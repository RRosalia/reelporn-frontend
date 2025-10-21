'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations('error');

    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Error caught by error boundary:', error);
    }, [error]);

    // Determine error type based on error message or status code
    const getErrorType = () => {
        if (error.message?.includes('403') || error.message?.toLowerCase().includes('forbidden')) {
            return '403';
        }
        if (error.message?.includes('503') || error.message?.toLowerCase().includes('unavailable')) {
            return '503';
        }
        if (error.message?.includes('500') || error.message?.toLowerCase().includes('internal')) {
            return '500';
        }
        return 'default';
    };

    const errorType = getErrorType();
    const title = t(`${errorType}.title` as any);
    const message = t(`${errorType}.message` as any);

    return (
        <div
            className="flex items-center justify-center px-4 py-12"
            style={{
                background: 'linear-gradient(135deg, #1a1626 0%, #2b2838 100%)',
                position: 'relative'
            }}
        >
            {/* Background pattern */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.05,
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, #fff 35px, #fff 70px)'
            }}></div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* Error Icon */}
                <div className="mb-8">
                    <div
                        className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6"
                        style={{
                            background: 'rgba(194, 51, 138, 0.1)',
                            border: '2px solid rgba(194, 51, 138, 0.3)'
                        }}
                    >
                        <i
                            className="bi bi-exclamation-triangle text-6xl"
                            style={{
                                color: '#f8c537'
                            }}
                        ></i>
                    </div>
                </div>

                {/* Error Code */}
                {errorType !== 'default' && (
                    <div
                        className="text-7xl md:text-8xl font-bold mb-4"
                        style={{
                            background: 'linear-gradient(135deg, #c2338a 0%, #f8c537 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            lineHeight: '1'
                        }}
                    >
                        {errorType}
                    </div>
                )}

                {/* Title */}
                <h2
                    className="text-3xl md:text-4xl font-bold mb-4 text-white"
                >
                    {title}
                </h2>

                {/* Message */}
                <p
                    className="text-lg md:text-xl mb-4"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                    {message}
                </p>

                {/* Server Notice (for 500 and 503 errors) */}
                {(errorType === '500' || errorType === '503') && (
                    <p
                        className="text-sm mb-8"
                        style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                    >
                        {t('serverNotice')}
                    </p>
                )}

                {/* Error Digest (for debugging) */}
                {error.digest && (
                    <p
                        className="text-xs mb-8 font-mono"
                        style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                    >
                        Error ID: {error.digest}
                    </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={reset}
                        className="inline-flex items-center px-8 py-3 text-lg font-bold text-white rounded-full transition-all duration-300"
                        style={{
                            background: 'linear-gradient(135deg, #c2338a 0%, #e74c3c 100%)',
                            boxShadow: '0 4px 15px rgba(194, 51, 138, 0.4)'
                        }}
                    >
                        <i className="bi bi-arrow-clockwise mr-2"></i>
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center px-8 py-3 text-lg font-bold text-white border-2 border-white rounded-full transition-all duration-300 hover:bg-white hover:text-gray-900"
                    >
                        <i className="bi bi-house-door mr-2"></i>
                        {t('goHome')}
                    </Link>
                </div>

                {/* Help Section - hidden on small screens */}
                <div
                    className="mt-8 p-4 rounded-2xl hidden md:block"
                    style={{
                        background: 'rgba(194, 51, 138, 0.1)',
                        border: '1px solid rgba(194, 51, 138, 0.2)'
                    }}
                >
                    <h3 className="text-white font-bold text-base mb-2">
                        <i className="bi bi-info-circle mr-2" style={{ color: '#f8c537' }}></i>
                        Need Help?
                    </h3>
                    <p className="text-white/70 text-sm mb-3">
                        If this problem persists, please contact our support team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="mailto:support@reelporn.ai"
                            className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white border border-white/30 rounded-full hover:bg-white/10 transition-all duration-300"
                        >
                            <i className="bi bi-headset mr-2"></i>
                            Contact Support
                        </a>
                        <Link
                            href="/faq"
                            className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white border border-white/30 rounded-full hover:bg-white/10 transition-all duration-300"
                        >
                            <i className="bi bi-question-circle mr-2"></i>
                            View FAQ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
