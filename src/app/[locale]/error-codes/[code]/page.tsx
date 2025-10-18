'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import './styles.css';

function ErrorPage() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const code = params?.code as string;

    // Parse error code
    const errorCode = parseInt(code || '404') || 404;

    // Determine if it's a 4xx or 5xx error
    const is4xxError = errorCode >= 400 && errorCode < 500;
    const is5xxError = errorCode >= 500 && errorCode < 600;

    // Get error-specific content
    const getErrorContent = () => {
        switch (errorCode) {
            case 403:
                return {
                    title: t('error.403.title'),
                    message: t('error.403.message'),
                    icon: '🚫'
                };
            case 404:
                return {
                    title: t('error.404.title'),
                    message: t('error.404.message'),
                    icon: '🔍'
                };
            case 500:
                return {
                    title: t('error.500.title'),
                    message: t('error.500.message'),
                    icon: '⚠️'
                };
            case 503:
                return {
                    title: t('error.503.title'),
                    message: t('error.503.message'),
                    icon: '🔧'
                };
            default:
                return {
                    title: t('error.default.title'),
                    message: t('error.default.message'),
                    icon: '❌'
                };
        }
    };

    const errorContent = getErrorContent();

    const handleGoHome = () => {
        // Always redirect to main domain (not CDN)
        const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'https://reelporn.ai';

        // Construct the home URL with the correct language prefix
        const languagePrefix = locale !== 'en' ? `/${locale}` : '';
        const homeUrl = `${mainDomain}${languagePrefix}/`;

        // Use window.location for absolute redirect to main domain
        window.location.href = homeUrl;
    };

    return (
        <div className="error-page">
            <div className="error-content">
                {/* Logo - clickable to main domain */}
                <a
                    href={`${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'https://reelporn.ai'}${locale !== 'en' ? `/${locale}` : ''}/`}
                    className="error-logo-link"
                    style={{ textDecoration: 'none' }}
                >
                    <div className="error-logo">
                        <span className="error-logo-reel">Reel</span>
                        <span className="error-logo-porn">Porn</span>
                    </div>
                </a>

                {/* Error Code */}
                <div className="error-code">
                    <span className="error-icon">{errorContent.icon}</span>
                    <span className="error-number">{errorCode}</span>
                </div>

                {/* Title */}
                <h1 className="error-title">
                    {errorContent.title}
                </h1>

                {/* Message */}
                <p className="error-message">
                    {errorContent.message}
                </p>

                {/* Conditional Action Button */}
                {is4xxError && (
                    <button
                        className="error-button"
                        onClick={handleGoHome}
                    >
                        {t('error.goHome')}
                    </button>
                )}

                {is5xxError && (
                    <div className="error-server-notice">
                        <p className="error-server-text">
                            {t('error.serverNotice')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ErrorPage;
