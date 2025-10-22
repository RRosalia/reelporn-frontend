'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import './styles.css';

// Country code to country name mapping
const COUNTRY_NAMES: Record<string, string> = {
    BY: 'Belarus',
    MV: 'Maldives',
    KP: 'North Korea',
    VN: 'Vietnam',
    SA: 'Saudi Arabia',
    KR: 'South Korea',
    AF: 'Afghanistan',
    BD: 'Bangladesh',
    BT: 'Bhutan',
    BN: 'Brunei',
    AE: 'United Arab Emirates',
    QA: 'Qatar',
};

function BlockedPage() {
    const t = useTranslations();
    const searchParams = useSearchParams();

    const reason = searchParams.get('reason');
    const countryCode = searchParams.get('country');
    const isGeoBlocked = reason === 'geo';
    const countryName = countryCode ? COUNTRY_NAMES[countryCode] || countryCode : '';

    useEffect(() => {
        // Remove the pending class to show blocked page
        document.documentElement.classList.remove('age-verification-pending');

        // Only set age-related localStorage for age verification blocking
        if (!isGeoBlocked) {
            localStorage.setItem('ageBlocked', 'true');
            localStorage.removeItem('ageVerified');
        }
    }, [isGeoBlocked]);

    return (
        <div className="blocked-page">
            <div className="blocked-content">
                <div className="blocked-logo">
                    <span className="blocked-logo-reel">Reel</span>
                    <span className="blocked-logo-porn">Porn</span>
                </div>

                <h1 className="blocked-title">
                    {isGeoBlocked ? t('blocked.geo.title') : t('blocked.title')}
                </h1>

                <p className="blocked-message">
                    {isGeoBlocked
                        ? t('blocked.geo.message', { country: countryName })
                        : t('blocked.message')
                    }
                </p>
            </div>
        </div>
    );
}

export default BlockedPage;