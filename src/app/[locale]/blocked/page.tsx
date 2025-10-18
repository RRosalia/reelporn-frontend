'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import './styles.css';

function BlockedPage() {
    const t = useTranslations();

    useEffect(() => {
        // Remove the pending class to show blocked page
        document.documentElement.classList.remove('age-verification-pending');

        // Ensure blocked state is set when on this page
        localStorage.setItem('ageBlocked', 'true');
        localStorage.removeItem('ageVerified');
    }, []);

    return (
        <div className="blocked-page">
            <div className="blocked-content">
                <div className="blocked-logo">
                    <span className="blocked-logo-reel">Reel</span>
                    <span className="blocked-logo-porn">Porn</span>
                </div>

                <h1 className="blocked-title">
                    {t('blocked.title')}
                </h1>

                <p className="blocked-message">
                    {t('blocked.message')}
                </p>
            </div>
        </div>
    );
}

export default BlockedPage;