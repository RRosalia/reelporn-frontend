'use client';

import { useEchoPublic } from '@laravel/echo-react';

/**
 * Test component to verify Echo WebSocket connection
 * Add this to any page to test the connection
 */
export default function EchoConnectionTest() {
  // Try to connect to a public channel (doesn't require auth)
  useEchoPublic('test-channel', 'test-event', (e: any) => {
    console.warn('[Echo Test] Received event:', e);
  });

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: '#333',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      Echo Connection Test Active
      <br />
      Check Console & Network Tab
    </div>
  );
}
