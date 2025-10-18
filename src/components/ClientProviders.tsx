'use client';

import { ReactNode } from 'react';
import '@/lib/echo-config'; // Initialize Echo immediately
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { MiniPlayerProvider } from '@/lib/contexts/MiniPlayerContext';
import { CookieConsentProvider } from '@/lib/contexts/CookieConsentContext';
import CookieConsent from './CookieConsent';
import AgeVerification from './AgeVerification';
import GoogleTagManager from './GoogleTagManager';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MiniPlayerProvider>
        <CookieConsentProvider>
          <GoogleTagManager />
          <AgeVerification />
          {children}
          <CookieConsent />
        </CookieConsentProvider>
      </MiniPlayerProvider>
    </AuthProvider>
  );
}
