'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { languages } from '@/i18n/languages';
import './AgeVerification.css';

function AgeVerification() {
    const t = useTranslations();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const currentYear = new Date().getFullYear();

    // IMMEDIATELY check if we're on blocked, error, or parental controls page
    const isBlockedPage = pathname.includes('/blocked');
    const isErrorPage = pathname.includes('/error-codes/');
    const isParentalPage = pathname.includes('/parental-controls');
    const isExcludedPage = isBlockedPage || isErrorPage || isParentalPage;

    // Start with null to prevent any flash
    const [showModal, setShowModal] = useState<boolean | null>(null);

    useEffect(() => {
        // Don't do anything on excluded pages (blocked, error, parental controls)
        if (isExcludedPage) {
            setTimeout(() => {
                setShowModal(false);
                document.documentElement.classList.remove('age-verification-pending');
            }, 0);
            return;
        }

        // Check verification status
        if (typeof window !== 'undefined') {
            // Check if this is a crawler (cookie set by middleware)
            const isCrawler = document.cookie.split('; ').find(row => row.startsWith('crawler-bypass='));

            if (isCrawler) {
                // Skip age verification for crawlers
                setTimeout(() => {
                    setShowModal(false);
                    document.documentElement.classList.remove('age-verification-pending');
                }, 0);
                return;
            }

            try {
                const verified = localStorage.getItem('ageVerified');
                const blocked = localStorage.getItem('ageBlocked');

                if (blocked === 'true') {
                    // User previously clicked "under 18", redirect to blocked
                    router.push('/blocked');
                    setTimeout(() => {
                        setShowModal(false);
                        document.documentElement.classList.remove('age-verification-pending');
                    }, 0);
                } else if (verified === 'true') {
                    // Already verified
                    setTimeout(() => {
                        setShowModal(false);
                        document.documentElement.classList.remove('age-verification-pending');
                    }, 0);
                } else {
                    // Need to verify age - class already added by inline script
                    setTimeout(() => {
                        setShowModal(true);
                    }, 0);
                }
            } catch (e) {
                // localStorage not available (e.g., disabled by user)
                // Show modal but won't be able to remember choice
                console.warn('localStorage not available:', e);
                setTimeout(() => {
                    setShowModal(true);
                }, 0);
            }
        }
    }, [isExcludedPage, router]);

    const handleEnter = () => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('ageVerified', 'true');
                localStorage.removeItem('ageBlocked');
            } catch (e) {
                console.warn('Could not save age verification:', e);
                // Continue anyway - user can still access the site
            }
        }
        document.documentElement.classList.remove('age-verification-pending');
        setShowModal(false);
    };

    const handleExit = () => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('ageBlocked', 'true');
                localStorage.removeItem('ageVerified');
            } catch (e) {
                console.warn('Could not save age block:', e);
                // Continue anyway - redirect to blocked page
            }
        }
        document.documentElement.classList.remove('age-verification-pending');
        router.push('/blocked');
        setShowModal(false);
    };

    const handleLanguageChange = (newLocale: string) => {
        router.push(pathname as any, { locale: newLocale });
    };

    // Don't render anything if modal shouldn't show or still checking (null)
    if (showModal !== true) {
        return null;
    }

    return (
        <div className="age-verification-overlay">
            <div className="age-verification-modal">
                {/* Language Selector */}
                <div className="age-lang-selector">
                    <select
                        value={locale}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="age-lang-dropdown"
                    >
                        {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Logo */}
                <div className="age-logo">
                    <span className="age-logo-reel">Reel</span>
                    <span className="age-logo-porn">Porn</span>
                </div>

                {/* Main Title */}
                <h1 className="age-title">
                    {t('age.title')}
                </h1>

                {/* Notice Badge */}
                <div className="age-notice-badge">
                    {t('age.notice')}
                </div>

                {/* Warning Text */}
                <div className="age-warning-text">
                    <p>{t('age.warning1')}</p>
                    <p>{t('age.warning2')}</p>
                </div>

                {/* Action Buttons */}
                <div className="age-buttons">
                    <button className="age-btn age-btn-enter" onClick={handleEnter}>
                        {t('age.enter')}
                    </button>
                    <button className="age-btn age-btn-exit" onClick={handleExit}>
                        {t('age.exit')}
                    </button>
                </div>

                {/* Parental Control Link */}
                <div className="age-parental-link">
                    {t('age.parentalInfo')}{' '}
                    <a href={`${locale !== 'en' ? `/${locale}` : ''}/parental-controls`}>
                        {t('age.parentalLink')}
                    </a>
                </div>

                {/* Footer */}
                <div className="age-footer">
                    © ReelPorn.com, {currentYear}
                </div>
            </div>
        </div>
    );
}

export default AgeVerification;
