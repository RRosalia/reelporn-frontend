'use client';

import { useEffect } from 'react';
import TagManager from 'react-gtm-module';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  advertising: boolean;
}

function GoogleTagManager() {
  useEffect(() => {
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

    // Don't initialize if GTM ID is not configured or is placeholder
    if (!gtmId || gtmId === 'GTM-XXXXXXX') {
      console.warn('GTM ID not configured. Skipping GTM initialization.');
      return;
    }

    // Function to get current cookie preferences
    const getCookiePreferences = (): CookiePreferences | null => {
      if (typeof window === 'undefined') return null;

      const consent = localStorage.getItem('cookieConsent');
      if (!consent) return null;

      try {
        return JSON.parse(consent);
      } catch (e) {
        console.error('Failed to parse cookie consent:', e);
        return null;
      }
    };

    // Function to update GTM consent
    const updateGTMConsent = (preferences: CookiePreferences) => {
      if (typeof window === 'undefined' || !window.dataLayer) return;

      // Send consent update to GTM
      window.dataLayer.push({
        event: 'consent_update',
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        ad_storage: preferences.advertising ? 'granted' : 'denied',
        functionality_storage: preferences.functional ? 'granted' : 'denied',
        personalization_storage: preferences.functional ? 'granted' : 'denied',
      });
    };

    // Initialize GTM
    const initializeGTM = () => {
      const preferences = getCookiePreferences();

      // Set default consent state (denied by default)
      const defaultConsent = {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        wait_for_update: 500,
      };

      // Initialize GTM with default consent
      TagManager.initialize({
        gtmId,
        dataLayer: {
          event: 'gtm.js',
          'gtm.start': new Date().getTime(),
        },
        dataLayerName: 'dataLayer',
      });

      // Set consent defaults
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'consent_default',
          ...defaultConsent,
        });

        // If user has already made consent choices, update immediately
        if (preferences) {
          updateGTMConsent(preferences);
        }
      }
    };

    // Initialize GTM
    initializeGTM();

    // Listen for cookie consent changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cookieConsent' && e.newValue) {
        try {
          const preferences = JSON.parse(e.newValue);
          updateGTMConsent(preferences);
        } catch (error) {
          console.error('Failed to parse cookie consent update:', error);
        }
      }
    };

    // Listen for custom event when cookie settings are saved
    const handleConsentUpdate = () => {
      const preferences = getCookiePreferences();
      if (preferences) {
        updateGTMConsent(preferences);
      }
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cookieConsentUpdated', handleConsentUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate);
    };
  }, []);

  return null;
}

export default GoogleTagManager;
