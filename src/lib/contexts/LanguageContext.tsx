'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LanguageContextType {
  locale: string;
  changeLanguage: (newLocale: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const getInitialLocale = (): string => {
    // Check if user has already selected a language
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale');
      if (savedLocale) {
        return savedLocale;
      }

      // Detect browser language
      const browserLang = navigator.language || (navigator as Navigator & { userLanguage?: string }).userLanguage;
      const langCode = browserLang.split('-')[0].toLowerCase();

      // Check if we support this language
      const supportedLanguages = ['en', 'nl', 'de', 'fr'];
      if (supportedLanguages.includes(langCode)) {
        localStorage.setItem('locale', langCode);
        return langCode;
      }

      // Default to English
      localStorage.setItem('locale', 'en');
    }
    return 'en';
  };

  const [locale, setLocale] = useState(getInitialLocale());

  const changeLanguage = (newLocale: string) => {
    setLocale(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
