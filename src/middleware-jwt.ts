import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/jwt-auth';

/**
 * JWT-based authentication middleware
 * Protects routes and injects user context
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/shop',
    '/map',
    '/education',
    '/community',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ];

  // API paths that don't require authentication
  const publicApiPaths = [
    '/api/auth/register',
    '/api/auth/login',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/health',
    '/api/placeholder'
  ];

  // Check if path is public
  const isPublicPath = publicPaths.some(path =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  const isPublicApiPath = publicApiPaths.some(path =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Skip authentication for static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') && !pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Skip authentication for public paths
  if (isPublicPath || isPublicApiPath) {
    return NextResponse.next();
  }

  // Get user from request
  const user = getUserFromRequest(request);

  // If accessing protected path without authentication, redirect to login
  if (!user && !pathname.startsWith('/api')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing protected API without authentication, return 401
  if (!user && pathname.startsWith('/api')) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource'
      },
      { status: 401 }
    );
  }

  // Inject user context into request headers for API routes
  if (user) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.userId);
    requestHeaders.set('x-user-email', user.email);
    requestHeaders.set('x-user-role', user.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

/**
 * Middleware configuration
 * Apply to all routes except static files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
