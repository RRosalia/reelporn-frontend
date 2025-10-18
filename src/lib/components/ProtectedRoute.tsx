'use client';

import React, { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute component
 * Redirects to login page if user is not authenticated
 * Preserves the intended destination for redirect after login
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to login with intended destination if not authenticated
  if (!isAuthenticated) {
    const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}&message=loginRequired`;
    router.replace(loginUrl);
    return null;
  }

  // Render protected content if authenticated
  return <>{children}</>;
}

export default ProtectedRoute;
