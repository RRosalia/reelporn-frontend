'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import './CookieConsent.css';

interface Language {
    code: string;
    name: string;
    flag: string;
}

interface CookiePreferences {
    essential: boolean;
    functional: boolean;
    analytics: boolean;
    advertising: boolean;
}

function CookieConsent() {
    const t = useTranslations();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const [showBanner, setShowBanner] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);

    // Don't show on blocked page
    const isBlockedPage = pathname.includes('/blocked');

    const languages: Language[] = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ];

    const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
        essential: true, // Always true, cannot be disabled
        functional: false,
        analytics: false,
        advertising: false
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const consent = localStorage.getItem('cookieConsent');
            if (!consent) {
                setTimeout(() => {
                    setShowBanner(true);
                }, 0);
            } else {
                const savedPreferences = JSON.parse(consent);
                setTimeout(() => {
                    setCookiePreferences(savedPreferences);
                }, 0);
            }
        }
    }, []);

    // Watch for external trigger to show preferences
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleOpenCookieSettings = () => {
            setShowPreferences(true);
        };

        window.addEventListener('openCookieSettings', handleOpenCookieSettings);
        return () => {
            window.removeEventListener('openCookieSettings', handleOpenCookieSettings);
        };
    }, []);

    const handleAcceptAll = () => {
        const allAccepted: CookiePreferences = {
            essential: true,
            functional: true,
            analytics: true,
            advertising: true
        };
        if (typeof window !== 'undefined') {
            localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
            // Dispatch event for GTM to update consent
            window.dispatchEvent(new CustomEvent('cookieConsentUpdated'));
        }
        setCookiePreferences(allAccepted);
        setShowBanner(false);
        setShowPreferences(false);
    };

    const handleSavePreferences = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cookieConsent', JSON.stringify(cookiePreferences));
            // Dispatch event for GTM to update consent
            window.dispatchEvent(new CustomEvent('cookieConsentUpdated'));
        }
        setShowBanner(false);
        setShowPreferences(false);
    };

    const handleTogglePreference = (type: keyof CookiePreferences) => {
        if (type === 'essential') return; // Cannot toggle essential cookies
        setCookiePreferences(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleLanguageChange = (newLang: string) => {
        router.push(pathname as any, { locale: newLang });
    };

    // Don't show anything on blocked page
    if (isBlockedPage) {
        return null;
    }

    return (
        <>
            {/* Cookie Banner */}
            {showBanner && (
            <div className="cookie-consent-banner">
                <div className="cookie-consent-content">
                    <div className="cookie-header">
                        <div className="cookie-icon">
                            <i className="bi bi-cookie"></i>
                        </div>
                        <div className="cookie-text">
                            <h3>{t('cookies.title')}</h3>
                            <p>{t('cookies.description')}</p>
                        </div>
                    </div>

                    <div className="cookie-actions">
                        {/* Language Switcher */}
                        <div className="cookie-language">
                            <i className="bi bi-globe2 me-2"></i>
                            <select
                                value={locale}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="cookie-lang-select"
                            >
                                {languages.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.flag} {lang.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="cookie-buttons">
                            <button
                                onClick={() => setShowPreferences(true)}
                                className="cookie-btn cookie-btn-customize"
                            >
                                {t('cookies.customize')}
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="cookie-btn cookie-btn-accept"
                            >
                                {t('cookies.acceptAll')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {/* Cookie Preferences Modal */}
            {showPreferences && (
                <div className="cookie-modal-overlay" onClick={() => setShowPreferences(false)}>
                    <div className="cookie-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cookie-modal-header">
                            <h2>{t('cookies.preferences.title')}</h2>
                            <button
                                onClick={() => setShowPreferences(false)}
                                className="cookie-modal-close"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="cookie-modal-body">
                            <p className="cookie-modal-intro">
                                {t('cookies.preferences.description')}
                            </p>

                            {/* Essential Cookies */}
                            <div className="cookie-preference-item">
                                <div className="cookie-preference-header">
                                    <div>
                                        <h4>{t('cookies.essential.title')}</h4>
                                        <p>{t('cookies.essential.description')}</p>
                                    </div>
                                    <div className="cookie-toggle">
                                        <input
                                            type="checkbox"
                                            id="essential"
                                            checked={true}
                                            disabled
                                            className="cookie-checkbox"
                                        />
                                        <label htmlFor="essential" className="cookie-switch disabled">
                                            <span className="cookie-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Functional Cookies */}
                            <div className="cookie-preference-item">
                                <div className="cookie-preference-header">
                                    <div>
                                        <h4>{t('cookies.functional.title')}</h4>
                                        <p>{t('cookies.functional.description')}</p>
                                    </div>
                                    <div className="cookie-toggle">
                                        <input
                                            type="checkbox"
                                            id="functional"
                                            checked={cookiePreferences.functional}
                                            onChange={() => handleTogglePreference('functional')}
                                            className="cookie-checkbox"
                                        />
                                        <label htmlFor="functional" className="cookie-switch">
                                            <span className="cookie-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="cookie-preference-item">
                                <div className="cookie-preference-header">
                                    <div>
                                        <h4>{t('cookies.analytics.title')}</h4>
                                        <p>{t('cookies.analytics.description')}</p>
                                    </div>
                                    <div className="cookie-toggle">
                                        <input
                                            type="checkbox"
                                            id="analytics"
                                            checked={cookiePreferences.analytics}
                                            onChange={() => handleTogglePreference('analytics')}
                                            className="cookie-checkbox"
                                        />
                                        <label htmlFor="analytics" className="cookie-switch">
                                            <span className="cookie-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Advertising Cookies */}
                            <div className="cookie-preference-item">
                                <div className="cookie-preference-header">
                                    <div>
                                        <h4>{t('cookies.advertising.title')}</h4>
                                        <p>{t('cookies.advertising.description')}</p>
                                    </div>
                                    <div className="cookie-toggle">
                                        <input
                                            type="checkbox"
                                            id="advertising"
                                            checked={cookiePreferences.advertising}
                                            onChange={() => handleTogglePreference('advertising')}
                                            className="cookie-checkbox"
                                        />
                                        <label htmlFor="advertising" className="cookie-switch">
                                            <span className="cookie-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="cookie-modal-footer">
                            <button
                                onClick={() => setShowPreferences(false)}
                                className="cookie-btn cookie-btn-secondary"
                            >
                                {t('cookies.cancel')}
                            </button>
                            <button
                                onClick={handleSavePreferences}
                                className="cookie-btn cookie-btn-primary"
                            >
                                {t('cookies.savePreferences')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CookieConsent;
