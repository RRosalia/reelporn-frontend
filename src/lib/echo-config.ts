'use client';

import { configureEcho } from '@laravel/echo-react';

/**
 * Initialize Laravel Echo configuration
 * This must be called BEFORE any useEcho hooks are used
 */
let echoConfigured = false;

export function initializeEcho(authToken?: string | null) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
  const authEndpoint = `${apiUrl}/broadcasting/auth`;

  const echoConfig: any = {
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'app-key',
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
    wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT) : 8080,
    wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ? parseInt(process.env.NEXT_PUBLIC_REVERB_PORT) : 8080,
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
  };

  if (authToken) {
    echoConfig.authEndpoint = authEndpoint;
    echoConfig.auth = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }

  console.log('[Echo] Configuring with:', {
    ...echoConfig,
    authEndpoint: authEndpoint,
    apiUrl: apiUrl,
  });

  configureEcho(echoConfig);
  echoConfigured = true;

  console.log('[Echo] Configuration complete', {
    authenticated: !!authToken,
    wsUrl: `${echoConfig.forceTLS ? 'wss' : 'ws'}://${echoConfig.wsHost}:${echoConfig.wsPort}`,
    authEndpoint: authToken ? authEndpoint : 'none',
  });
}

// Initialize Echo immediately when this module is imported (without auth)
if (typeof window !== 'undefined' && !echoConfigured) {
  initializeEcho();
}
