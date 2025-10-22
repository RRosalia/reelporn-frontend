'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import './ForcedAdvert.css';

interface AdData {
    duration?: number;
    skipAfter?: number;
    advertiser?: string;
    message?: string;
    ctaText?: string;
    ctaLink?: string;
}

interface ForcedAdvertProps {
    adData: AdData;
    isActive: boolean;
    onComplete?: () => void;
    onSkip?: () => void;
}

function ForcedAdvert({ adData, isActive, onComplete, onSkip }: ForcedAdvertProps) {
    const [timeRemaining, setTimeRemaining] = useState(adData.duration || 15);
    const [canSkip, setCanSkip] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const skipAfter = adData.skipAfter || 5;

    useEffect(() => {
        if (isActive) {
            setTimeout(() => {
                setTimeRemaining(adData.duration || 15);
                setCanSkip(false);
            }, 0);

            // Start countdown
            intervalRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                        setTimeout(() => {
                            onComplete?.();
                        }, 500);
                        return 0;
                    }

                    // Enable skip button after skipAfter seconds
                    if (prev === (adData.duration || 15) - skipAfter + 1) {
                        setTimeout(() => {
                            setCanSkip(true);
                        }, 0);
                    }

                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, adData.duration, adData.skipAfter, onComplete, skipAfter]);

    const handleSkip = () => {
        if (canSkip) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            onSkip?.();
        }
    };

    // Ad creative backgrounds
    const adBackgrounds = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    ];

    // Use useMemo to generate a stable random background
    const randomBg = useMemo(() => {
        // Use a deterministic value based on some prop or use index-based selection
        const index = adData?.duration ? (adData.duration % adBackgrounds.length) : 0;
        return adBackgrounds[index];
    }, [adData?.duration, adBackgrounds]);

    return (
        <div className="forced-advert" style={{ background: randomBg }}>
            {/* Ad Tag */}
            <div className="ad-tag-overlay">
                <span className="ad-badge">AD</span>
                <span className="ad-timer">
                    <i className="bi bi-clock"></i> {timeRemaining}s
                </span>
            </div>

            {/* Ad Content */}
            <div className="ad-content-center">
                <div className="ad-logo">
                    <i className="bi bi-megaphone-fill"></i>
                </div>
                <h2 className="ad-advertiser">{adData.advertiser || 'Premium Content'}</h2>
                <p className="ad-message">
                    {adData.message || 'Upgrade for an ad-free experience'}
                </p>

                {/* Skip Button */}
                <button
                    className={`skip-button ${canSkip ? 'active' : 'disabled'}`}
                    onClick={handleSkip}
                    disabled={!canSkip}
                >
                    {canSkip ? (
                        <>
                            <i className="bi bi-skip-end-fill"></i> Skip Ad
                        </>
                    ) : (
                        <>Skip in {(adData.duration || 15) - timeRemaining < skipAfter ? skipAfter - ((adData.duration || 15) - timeRemaining) : 0}s</>
                    )}
                </button>

                {/* CTA */}
                {adData.ctaText && (
                    <a
                        href={adData.ctaLink || '#'}
                        className="ad-cta-button"
                        onClick={(e) => {
                            e.preventDefault();
                            if (typeof window !== 'undefined') {
                                window.location.href = adData.ctaLink || '/subscriptions';
                            }
                        }}
                    >
                        {adData.ctaText}
                        <i className="bi bi-arrow-right-circle-fill ms-2"></i>
                    </a>
                )}
            </div>

            {/* Progress Bar */}
            <div className="ad-progress-container">
                <div
                    className="ad-progress-bar"
                    style={{
                        width: `${(((adData.duration || 15) - timeRemaining) / (adData.duration || 15)) * 100}%`
                    }}
                ></div>
            </div>

            {/* Decorative elements */}
            <div className="ad-decoration">
                <div className="pulse-ring"></div>
                <div className="pulse-ring"></div>
                <div className="pulse-ring"></div>
            </div>
        </div>
    );
}

export default ForcedAdvert;
