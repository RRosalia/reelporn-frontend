'use client';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally for Echo
if (typeof window !== 'undefined') {
  (window as any).Pusher = Pusher;
}

/**
 * Initialize Laravel Echo configuration
 * This must be called BEFORE any useEcho hooks are used
 */
let echoConfigured = false;

export function initializeEcho(authToken?: string | null) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
  const authEndpoint = `${apiUrl}/broadcasting/auth`;

  // Disconnect existing Echo instance if reconfiguring with auth
  if (echoConfigured && (window as any).Echo) {
    (window as any).Echo.disconnect();
  }

  const echoConfig: any = {
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'app-key',
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT) : 8080,
    wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT) : 8080,
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: authEndpoint, // Always set authEndpoint
  };

  // Add authorization headers if we have a token
  if (authToken) {
    echoConfig.auth = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }

  // Create Echo instance and attach to window
  const echoInstance = new Echo(echoConfig);
  (window as any).Echo = echoInstance;

  echoConfigured = true;

  // Add connection event listeners for error tracking
  const connector = echoInstance.connector as any;
  if (connector?.pusher) {
    connector.pusher.connection.bind('error', (error: any) => {
      console.error('[Echo] WebSocket error:', error);
    });
  }

  return echoInstance;
}

// Initialize Echo immediately when this module is imported (without auth)
if (typeof window !== 'undefined' && !echoConfigured) {
  initializeEcho();
}
