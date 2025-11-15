import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge, verifyAdminTokenEdge } from '@/lib/jwt-auth-edge';
import { getRedis } from '@/lib/redis';

export async function middleware(request: NextRequest) {
  try {
    // Handle user authentication for API routes and protected pages
    const isApiRoute = request.nextUrl.pathname.startsWith('/api');
    const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
    const isPublicApiRoute =
      request.nextUrl.pathname.startsWith('/api/auth') ||
      request.nextUrl.pathname.startsWith('/api/shop/products') ||
      request.nextUrl.pathname.startsWith('/api/community');

    // Protected routes that require authentication
    const protectedRoutes = [
      '/dashboard',
      '/pets',
      '/health',
      '/feeding',
      '/profile',
      '/cart',
      '/checkout',
      '/orders',
      '/activity',
    ];

    const isProtectedRoute = protectedRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    );

    // Extract JWT token from request
    let token: string | null = null;

    // Try cookie first
    token = request.cookies.get('auth-token')?.value || null;

    // Try Authorization header if no cookie
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    // Verify token and extract user info
    let userPayload: any = null;
    if (token) {
      userPayload = await verifyTokenEdge(token);
    }

    // Handle protected routes - redirect to login if not authenticated
    if (isProtectedRoute && !userPayload && !isAuthRoute) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Handle API routes that require authentication
    if (isApiRoute && !isPublicApiRoute && !request.nextUrl.pathname.startsWith('/api/admin')) {
      if (!userPayload) {
        return NextResponse.json(
          { error: 'Unauthorized - Authentication required' },
          { status: 401 }
        );
      }
    }

    // Handle admin routes protection
    if (request.nextUrl.pathname.startsWith('/admin')) {
      // Allow access to login page and auth endpoints
      const publicAdminPaths = [
        '/admin/login',
        '/api/admin/auth/login',
        '/api/admin/auth/logout',
      ];

      const isPublicPath = publicAdminPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      );

      if (!isPublicPath) {
        // Get token from cookie or Authorization header
        let token = request.cookies.get('admin-token')?.value;

        if (!token) {
          const authHeader = request.headers.get('authorization');
          if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
          }
        }

        // If no token, redirect to login (for pages) or return 401 (for API)
        if (!token) {
          if (request.nextUrl.pathname.startsWith('/api/admin')) {
            return NextResponse.json(
              { error: 'Unauthorized - No token provided' },
              { status: 401 }
            );
          }
          return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Check if token is blacklisted
        const redis = getRedis();
        let blacklisted = false;
        if (redis) {
          try {
            const result = await redis.get(`admin:blacklist:${token}`);
            blacklisted = result !== null;
          } catch (error) {
            console.error('[Middleware] Redis blacklist check failed:', error);
          }
        }

        if (blacklisted) {
          if (request.nextUrl.pathname.startsWith('/api/admin')) {
            return NextResponse.json(
              { error: 'Unauthorized - Token has been invalidated' },
              { status: 401 }
            );
          }
          return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Verify token
        const payload = await verifyAdminTokenEdge(token);

        if (!payload) {
          if (request.nextUrl.pathname.startsWith('/api/admin')) {
            return NextResponse.json(
              { error: 'Unauthorized - Invalid or expired token' },
              { status: 401 }
            );
          }
          return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Add admin user info to request headers for use in API routes
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-admin-id', payload.adminId);
        requestHeaders.set('x-admin-email', payload.email);
        requestHeaders.set('x-admin-role', payload.role);

        const response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });

        // Continue with security headers
        applySecurityHeaders(request, response);
        applyCORSHeaders(request, response);

        return response;
      }
    }

    // Create request headers with user info if authenticated
    const requestHeaders = new Headers(request.headers);

    if (userPayload) {
      // Inject user ID and email from verified JWT token
      requestHeaders.set('x-user-id', userPayload.userId);
      requestHeaders.set('x-user-email', userPayload.email);
      if (userPayload.role) {
        requestHeaders.set('x-user-role', userPayload.role);
      }
    }

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Apply security headers and CORS
    applySecurityHeaders(request, response);
    applyCORSHeaders(request, response);

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }

    return response;
  } catch (error) {
    // Log error and return a safe response to prevent middleware crash
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

/**
 * Apply security headers to response
 */
function applySecurityHeaders(request: NextRequest, response: NextResponse) {
  // Prevent aggressive caching of HTML pages
  const isHtmlPage = !request.nextUrl.pathname.startsWith('/_next/') &&
                     !request.nextUrl.pathname.startsWith('/api/') &&
                     !request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$/);

  if (isHtmlPage) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
  }

  const securityHeaders = {
    // Content Security Policy - Strict policy for production
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.cloudflareinsights.com https://challenges.cloudflare.com https://js.stripe.com https://vercel.live https://*.vercel.live",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.openai.com https://*.cloudflare.com https://static.cloudflareinsights.com https://rawgle.com https://*.rawgle.com https://api.stripe.com https://*.stripe.com https://vercel.live https://*.vercel.live wss://ws-us3.pusher.com",
      "frame-src 'self' https://challenges.cloudflare.com https://js.stripe.com https://hooks.stripe.com https://vercel.live https://*.vercel.live",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; '),

    // Prevent clickjacking attacks
    'X-Frame-Options': 'DENY',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Restrict browser features and APIs
    'Permissions-Policy': [
      'geolocation=(self)',
      'microphone=()',
      'camera=()',
      'payment=(self)',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
    ].join(', '),

    // XSS Protection (legacy browsers)
    'X-XSS-Protection': '1; mode=block',

    // Remove server identification
    'X-Powered-By': '',
  };

  // Apply all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

/**
 * Apply CORS headers to response
 */
function applyCORSHeaders(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://www.rawgle.com',
    'https://rawgle.com',
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, x-user-id, x-user-email, x-user-role, x-admin-id, x-admin-email, x-admin-role'
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|ttf|woff|woff2)$).*)',
  ],
};
