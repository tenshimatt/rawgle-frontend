'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * Protected Route Wrapper Component
 *
 * Wraps components that require authentication.
 * Shows loading state while checking auth, redirects if not authenticated.
 *
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <DashboardContent />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
  children,
  redirectTo = '/auth/login',
  requireAuth = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated) {
      // Store intended destination for redirect after login
      const returnUrl = pathname !== '/auth/login' ? `?returnUrl=${encodeURIComponent(pathname)}` : '';
      router.push(`${redirectTo}${returnUrl}`);
    }
  }, [isAuthenticated, loading, requireAuth, router, redirectTo, pathname]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If require auth and not authenticated, show nothing (will redirect)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Render children if authenticated or auth not required
  return <>{children}</>;
}

/**
 * Higher-order component for protecting pages
 *
 * @example
 * ```tsx
 * export default withAuth(DashboardPage);
 * ```
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { redirectTo?: string } = {}
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute redirectTo={options.redirectTo}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Loading Skeleton for Protected Content
 * Use this as a fallback while content is loading
 */
export function ProtectedContentLoader() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
