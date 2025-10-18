'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { MiniPlayerProvider } from '@/lib/contexts/MiniPlayerContext';
import { CookieConsentProvider } from '@/lib/contexts/CookieConsentContext';
import CookieConsent from './CookieConsent';
import AgeVerification from './AgeVerification';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MiniPlayerProvider>
        <CookieConsentProvider>
          <AgeVerification />
          {children}
          <CookieConsent />
        </CookieConsentProvider>
      </MiniPlayerProvider>
    </AuthProvider>
  );
}
