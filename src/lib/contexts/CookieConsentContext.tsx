'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CookieConsentContextType {
  showCookieModal: boolean;
  openCookieSettings: () => void;
  closeCookieSettings: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

interface CookieConsentProviderProps {
  children: ReactNode;
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  const [showCookieModal, setShowCookieModal] = useState(false);

  const openCookieSettings = () => {
    setShowCookieModal(true);
  };

  const closeCookieSettings = () => {
    setShowCookieModal(false);
  };

  return (
    <CookieConsentContext.Provider value={{
      showCookieModal,
      openCookieSettings,
      closeCookieSettings
    }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextType {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return context;
}
