import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken, isTokenBlacklisted } from '@/lib/auth/admin';

export async function middleware(request: NextRequest) {
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
      const blacklisted = await isTokenBlacklisted(token);
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
      const payload = verifyAdminToken(token);

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
      applySecurityHeaders(response);
      applyCORSHeaders(request, response);

      return response;
    }
  }

  const response = NextResponse.next();

  // Apply security headers and CORS
  applySecurityHeaders(response);
  applyCORSHeaders(request, response);

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

/**
 * Apply security headers to response
 */
function applySecurityHeaders(response: NextResponse) {
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
      'Content-Type, Authorization, x-user-id, x-admin-id, x-admin-email, x-admin-role'
    );
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
