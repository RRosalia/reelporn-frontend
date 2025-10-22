'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

declare global {
  interface Window {
    Echo: any;
  }
}

/**
 * Custom hook that automatically subscribes to the authenticated user's private channel
 * Channel format: user.{userId}
 *
 * This hook will automatically join the user's private channel when they are authenticated
 * and leave it when they log out or the component unmounts.
 *
 * @returns {any} The Echo private channel instance if authenticated, null otherwise
 */
export function useUserChannel(): any {
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    // Don't attempt to subscribe if still loading auth state
    if (isLoading) {
      return;
    }

    // Only subscribe if user is authenticated and has an ID
    if (!isAuthenticated || !user?.id) {
      return;
    }

    // Ensure Echo is available
    if (typeof window === 'undefined' || !window.Echo) {
      console.warn('Laravel Echo is not initialized');
      return;
    }

    const channelName = `user.${user.id}`;

    // Subscribe to the user's private channel
    window.Echo.private(channelName);

    // Cleanup: leave the channel when component unmounts or user logs out
    return () => {
      if (typeof window !== 'undefined' && window.Echo) {
        window.Echo.leave(channelName);
      }
    };
  }, [isAuthenticated, user?.id, isLoading]);

  // Return the channel instance if authenticated, otherwise null
  if (typeof window !== 'undefined' && isAuthenticated && user?.id && window.Echo) {
    return window.Echo.private(`user.${user.id}`);
  }
  return null;
}
