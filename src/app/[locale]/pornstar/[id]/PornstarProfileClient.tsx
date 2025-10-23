'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useEchoPublic } from '@laravel/echo-react';
import PornstarsRepository from '@/lib/repositories/PornstarsRepository';
import { Pornstar } from '@/types/Pornstar';
import AuthModal from '@/components/auth/AuthModal';
import QuickTransaction from '@/components/payment/QuickTransaction';
import type { QuickTransactionConfig } from '@/types/Payment';

interface PornstarProfileClientProps {
    slug: string;
    locale: string;
}

export default function PornstarProfileClient({ slug, locale }: PornstarProfileClientProps) {
    const t = useTranslations();
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const [isFollowing, setIsFollowing] = useState(false);
    const [pornstar, setPornstar] = useState<Pornstar | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [relatedPornstars, setRelatedPornstars] = useState<Pornstar[]>([]);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalTrigger, setAuthModalTrigger] = useState<'follow' | 'message' | 'tip'>('follow');
    const [showTipModal, setShowTipModal] = useState(false);

    // Helper function to convert UUID to number for gradients
    const getColorFromId = (id: string): number => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    // Fetch pornstar data
    useEffect(() => {
        const fetchPornstar = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await PornstarsRepository.getBySlug(slug);
                setPornstar(data);
            } catch (err: unknown) {
                console.error('Error fetching pornstar:', err);

                if (err instanceof Error && err.name === 'NotFoundException') {
                    setError('Pornstar not found');
                } else {
                    setError('Failed to load pornstar data');
                }
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPornstar();
        }
    }, [slug]);

    // Fetch related pornstars when there's an error or when pornstar loads
    useEffect(() => {
        if (slug && (error || pornstar)) {
            // Fetch related pornstars using the slug (works even for 404)
            PornstarsRepository.getRelated(slug)
                .then((related: Pornstar[]) => setRelatedPornstars(related))
                .catch((err: unknown) => console.error('Error fetching related pornstars:', err));
        }
    }, [error, pornstar, slug]);

    // Connect to pornstar WebSocket channel
    const handlePornstarEvent = useCallback((event: unknown) => {
        console.error('[Pornstar Channel] Event received:', event);
    }, []);

    useEchoPublic(
        pornstar?.id ? `pornstar.${pornstar.id}` : '',
        [],
        handlePornstarEvent
    );

    // Handler for follow button
    const handleFollow = () => {
        if (!isAuthenticated) {
            setAuthModalTrigger('follow');
            setShowAuthModal(true);

            // Track attempt to follow without auth
            if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                    event: 'pornstar_follow_unauthenticated',
                    pornstar_id: pornstar?.id,
                    pornstar_name: pornstar ? `${pornstar.first_name} ${pornstar.last_name}` : '',
                    timestamp: new Date().toISOString(),
                });
            }
            return;
        }

        // Toggle follow status
        setIsFollowing(!isFollowing);

        // TODO: Call API to follow/unfollow pornstar
        // Track follow/unfollow
        if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
                event: isFollowing ? 'pornstar_unfollow' : 'pornstar_follow',
                pornstar_id: pornstar?.id,
                pornstar_name: pornstar ? `${pornstar.first_name} ${pornstar.last_name}` : '',
                timestamp: new Date().toISOString(),
            });
        }
    };

    // Handler for message button
    const handleMessage = () => {
        if (!isAuthenticated) {
            setAuthModalTrigger('message');
            setShowAuthModal(true);

            // Track attempt to message without auth
            if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                    event: 'pornstar_message_unauthenticated',
                    pornstar_id: pornstar?.id,
                    pornstar_name: pornstar ? `${pornstar.first_name} ${pornstar.last_name}` : '',
                    timestamp: new Date().toISOString(),
                });
            }
            return;
        }

        // TODO: Open message dialog or navigate to messages
        console.error('Opening message dialog...');

        // Track message attempt
        if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
                event: 'pornstar_message_clicked',
                pornstar_id: pornstar?.id,
                pornstar_name: pornstar ? `${pornstar.first_name} ${pornstar.last_name}` : '',
                timestamp: new Date().toISOString(),
            });
        }
    };

    // Handler for tip button
    const handleTip = () => {
        if (!isAuthenticated) {
            setAuthModalTrigger('tip');
            setShowAuthModal(true);

            // Track attempt to tip without auth
            if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                    event: 'pornstar_tip_unauthenticated',
                    pornstar_id: pornstar?.id,
                    pornstar_name: pornstar ? `${pornstar.first_name} ${pornstar.last_name}` : '',
                    timestamp: new Date().toISOString(),
                });
            }
            return;
        }

        // Open tip modal
        setShowTipModal(true);

        // Track tip attempt
        if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
                event: 'pornstar_tip_clicked',
                pornstar_id: pornstar?.id,
                pornstar_name: pornstar ? `${pornstar.first_name} ${pornstar.last_name}` : '',
                timestamp: new Date().toISOString(),
            });
        }
    };

    // Get modal title and message based on trigger
    const getAuthModalContent = () => {
        switch (authModalTrigger) {
            case 'follow':
                return {
                    title: t('pornstar.authModal.followTitle'),
                    message: t('pornstar.authModal.followMessage'),
                    icon: 'heart' as const,
                };
            case 'message':
                return {
                    title: t('pornstar.authModal.messageTitle'),
                    message: t('pornstar.authModal.messageMessage'),
                    icon: 'user' as const,
                };
            case 'tip':
                return {
                    title: t('pornstar.authModal.tipTitle'),
                    message: t('pornstar.authModal.tipMessage'),
                    icon: 'star' as const,
                };
        }
    };

    const authModalContent = getAuthModalContent();

    // QuickTransaction config for tipping
    const tipConfig: QuickTransactionConfig = {
        amount: 10, // Default tip amount in USD
        currencyCode: '', // Let user choose currency
        description: pornstar
            ? `Tip for ${pornstar.first_name} ${pornstar.last_name}`
            : 'Send a tip',
        metadata: {
            pornstarId: pornstar?.id,
            pornstarName: pornstar ? `${pornstar.first_name} ${pornstar.last_name}` : '',
        },
        onSuccess: (transactionId) => {
            // Track successful tip
            if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                    event: 'pornstar_tip_success',
                    pornstar_id: pornstar?.id,
                    pornstar_name: pornstar ? `${pornstar.first_name} ${pornstar.last_name}` : '',
                    transaction_id: transactionId,
                    timestamp: new Date().toISOString(),
                });
            }
        },
        onCancel: () => {
            // Track cancelled tip
            if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                    event: 'pornstar_tip_cancelled',
                    pornstar_id: pornstar?.id,
                    pornstar_name: pornstar ? `${pornstar.first_name} ${pornstar.last_name}` : '',
                    timestamp: new Date().toISOString(),
                });
            }
        },
        onError: (error) => {
            console.error('Tip error:', error);
            // Track tip error
            if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                    event: 'pornstar_tip_error',
                    pornstar_id: pornstar?.id,
                    pornstar_name: pornstar ? `${pornstar.first_name} ${pornstar.last_name}` : '',
                    error,
                    timestamp: new Date().toISOString(),
                });
            }
        },
    };

    // Loading state
    if (loading) {
        return (
            <div className="pornstar-profile">
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center">
                        <i className="bi bi-hourglass-split text-5xl text-pink-500 animate-spin mb-4 block"></i>
                        <p className="text-gray-600">{t('common.loading')}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !pornstar) {
        return (
            <div style={{ background: '#f8f9fa' }}>
                {/* Error Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1a1626 0%, #2b2838 100%)',
                    padding: '60px 0 80px',
                    marginBottom: '40px'
                }}>
                    <div className="container mx-auto px-4">
                        <div className="text-center">
                            <i className="bi bi-exclamation-circle mb-4 block" style={{
                                fontSize: '80px',
                                color: '#c2338a'
                            }}></i>
                            <h1 style={{
                                fontSize: '42px',
                                fontWeight: 'bold',
                                color: '#ffffff',
                                marginBottom: '20px'
                            }}>
                                {error === 'Pornstar not found' ? 'Pornstar Not Found' : 'Error Loading Pornstar'}
                            </h1>
                            <p style={{
                                fontSize: '20px',
                                color: 'rgba(255, 255, 255, 0.85)',
                                marginBottom: '40px',
                                maxWidth: '600px',
                                margin: '0 auto 40px'
                            }}>
                                {error === 'Pornstar not found'
                                    ? 'The pornstar you are looking for does not exist or has been deleted.'
                                    : 'We encountered an error while loading the pornstar profile. Please try again later.'}
                            </p>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '16px',
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <button
                                    style={{
                                        padding: '16px 32px',
                                        background: 'linear-gradient(135deg, #c2338a 0%, #f8c537 100%)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(194, 51, 138, 0.4)'
                                    }}
                                    onClick={() => router.push(`/${locale}/pornstars`)}
                                >
                                    <i className="bi bi-grid-3x3-gap" style={{ marginRight: '8px' }}></i>
                                    Browse All Pornstars
                                </button>
                                <button
                                    style={{
                                        padding: '16px 32px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => router.back()}
                                >
                                    <i className="bi bi-arrow-left" style={{ marginRight: '8px' }}></i>
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Pornstars */}
                {relatedPornstars.length > 0 ? (
                    <div className="container mx-auto px-4" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
                        <h2 style={{
                            fontSize: '28px',
                            fontWeight: 'bold',
                            color: '#2b2838',
                            marginBottom: '32px'
                        }}>
                            <i className="bi bi-stars" style={{ marginRight: '8px', color: '#c2338a' }}></i>
                            You Might Also Like
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '20px'
                        }}>
                            {relatedPornstars.map(star => (
                                <a
                                    key={star.id}
                                    href={`/${locale}/pornstar/${star.slug}`}
                                    style={{
                                        textDecoration: 'none',
                                        display: 'block'
                                    }}
                                >
                                    <div style={{
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.3s ease',
                                        cursor: 'pointer'
                                    }}>
                                        <div style={{
                                            paddingBottom: '100%',
                                            position: 'relative',
                                            background: `linear-gradient(135deg, hsl(${(getColorFromId(star.id) * 137) % 360}, 70%, 40%) 0%, hsl(${(getColorFromId(star.id) * 137 + 60) % 360}, 70%, 30%) 100%)`
                                        }}>
                                        </div>
                                        <div style={{ padding: '12px', background: 'white', textAlign: 'center' }}>
                                            <h3 style={{
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                color: '#2b2838',
                                                marginBottom: '6px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>{`${star.first_name} ${star.last_name}`}</h3>
                                            <div style={{
                                                display: 'flex',
                                                gap: '10px',
                                                fontSize: '13px',
                                                color: '#666',
                                                justifyContent: 'center'
                                            }}>
                                                {star.age && <span><i className="bi bi-calendar"></i> {star.age}</span>}
                                                {star.country && <span><i className="bi bi-geo-alt"></i> {star.country.iso}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{ paddingBottom: '80px' }}></div>
                )}
            </div>
        );
    }

    const colorHash = getColorFromId(pornstar.id);
    const profileImageUrl = pornstar.profile_image?.large || pornstar.profile_image?.original;

    return (
        <div className="pornstar-profile">
            {/* Cover Image */}
            <div
                className="profile-cover"
                style={{
                    background: profileImageUrl
                        ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${profileImageUrl}) center/cover`
                        : `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), linear-gradient(135deg, hsl(${(colorHash * 137) % 360}, 70%, 20%) 0%, hsl(${(colorHash * 137 + 60) % 360}, 70%, 15%) 100%)`
                }}
            >
                <div className="container mx-auto px-4">
                    <div className="profile-header">
                        <div className="profile-avatar-wrapper">
                            <div
                                className="profile-avatar"
                                style={{
                                    background: pornstar.profile_image?.medium
                                        ? `url(${pornstar.profile_image.medium}) center/cover`
                                        : `linear-gradient(135deg, hsl(${(colorHash * 137) % 360}, 70%, 40%) 0%, hsl(${(colorHash * 137 + 60) % 360}, 70%, 30%) 100%)`
                                }}
                            >
                            </div>
                        </div>
                        <div className="profile-info">
                            <h1 className="profile-name">
                                {`${pornstar.first_name} ${pornstar.last_name}`}
                            </h1>
                            <div className="profile-stats">
                                {pornstar.videos_count > 0 && (
                                    <div className="stat">
                                        <span className="stat-value">{pornstar.videos_count}</span>
                                        <span className="stat-label">{t('pornstar.stats.videos')}</span>
                                    </div>
                                )}
                                <div className="stat">
                                    <span className="stat-value">{pornstar.views_count}</span>
                                    <span className="stat-label">{t('pornstar.stats.views')}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">0</span>
                                    <span className="stat-label">{t('pornstar.stats.likes')}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">0</span>
                                    <span className="stat-label">{t('pornstar.stats.followers')}</span>
                                </div>
                            </div>
                            <div className="profile-actions">
                                {/* <button
                                    className={`btn-follow ${isFollowing ? 'following' : ''}`}
                                    onClick={handleFollow}
                                >
                                    {isFollowing ? (
                                        <>
                                            <i className="bi bi-check-circle mr-2"></i>
                                            {t('pornstar.following')}
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-plus-circle mr-2"></i>
                                            {t('pornstar.follow')}
                                        </>
                                    )}
                                </button> */}
                                <button className="btn-message" onClick={handleMessage}>
                                    <i className="bi bi-envelope mr-2"></i>
                                    {t('pornstar.message')}
                                </button>
                                <button className="btn-tip" onClick={handleTip}>
                                    <i className="bi bi-gift mr-2"></i>
                                    {t('pornstar.tip')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Gallery - Combined Videos & Photos */}
            <div className="container mx-auto px-4 py-8">
                <h2 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                    color: '#2b2838',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <i className="bi bi-collection-play" style={{ color: '#c2338a' }}></i>
                    Media Gallery
                    <span style={{
                        fontSize: '16px',
                        fontWeight: 'normal',
                        color: '#999',
                        marginLeft: '8px'
                    }}>
                        ({pornstar.videos_count + pornstar.images_count} items)
                    </span>
                </h2>

                {pornstar.videos_count === 0 && pornstar.images_count === 0 ? (
                    <div className="text-center py-20" style={{
                        background: 'linear-gradient(135deg, rgba(194, 51, 138, 0.05) 0%, rgba(248, 197, 55, 0.05) 100%)',
                        borderRadius: '16px',
                        border: '2px dashed rgba(194, 51, 138, 0.2)'
                    }}>
                        <i className="bi bi-camera-video text-5xl mb-4 block" style={{ color: '#c2338a', opacity: 0.5 }}></i>
                        <p style={{ color: '#999', fontSize: '18px' }}>No media available yet</p>
                        <p style={{ color: '#ccc', fontSize: '14px', marginTop: '8px' }}>Check back soon for new content!</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '20px'
                    }}>
                        {/* Placeholder for future videos/photos */}
                        <div className="text-center py-12" style={{
                            gridColumn: '1 / -1',
                            background: 'linear-gradient(135deg, rgba(194, 51, 138, 0.05) 0%, rgba(248, 197, 55, 0.05) 100%)',
                            borderRadius: '16px',
                            border: '1px solid rgba(194, 51, 138, 0.2)'
                        }}>
                            <i className="bi bi-hourglass-split text-4xl mb-3 block" style={{ color: '#c2338a', opacity: 0.5 }}></i>
                            <p style={{ color: '#999', fontSize: '16px' }}>Media content coming soon...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* About Section - Compact Layout */}
            <div className="container mx-auto px-4 py-8">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '20px'
                }}>
                    {/* Two Column Layout on Desktop */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '20px'
                    }}>
                        {/* Personal Details - Compact */}
                        <div style={{
                            background: 'white',
                            border: '1px solid rgba(194, 51, 138, 0.15)',
                            borderRadius: '12px',
                            padding: '20px'
                        }}>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                marginBottom: '16px',
                                color: '#2b2838',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <i className="bi bi-person-badge" style={{ color: '#c2338a', fontSize: '20px' }}></i>
                                {t('pornstar.about.details')}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {pornstar.age && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                        <span style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className="bi bi-calendar-event" style={{ color: '#c2338a' }}></i>
                                            {t('pornstar.details.age')}
                                        </span>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#2b2838' }}>{pornstar.age}</span>
                                    </div>
                                )}
                                {pornstar.country && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                        <span style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className="bi bi-geo-alt-fill" style={{ color: '#c2338a' }}></i>
                                            {t('pornstar.details.country')}
                                        </span>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#2b2838' }}>{pornstar.country.name}</span>
                                    </div>
                                )}
                                {pornstar.height_cm && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                        <span style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className="bi bi-arrows-vertical" style={{ color: '#c2338a' }}></i>
                                            {t('pornstar.details.height')}
                                        </span>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#2b2838' }}>{pornstar.height_cm} cm</span>
                                    </div>
                                )}
                                {pornstar.weight_kg && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                        <span style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className="bi bi-speedometer" style={{ color: '#c2338a' }}></i>
                                            {t('pornstar.details.weight')}
                                        </span>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#2b2838' }}>{pornstar.weight_kg} kg</span>
                                    </div>
                                )}
                                {pornstar.hair_color && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                        <span style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className="bi bi-brush" style={{ color: '#c2338a' }}></i>
                                            {t('pornstar.details.hair')}
                                        </span>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#2b2838' }}>{pornstar.hair_color}</span>
                                    </div>
                                )}
                                {pornstar.eye_color && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                        <span style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className="bi bi-eye" style={{ color: '#c2338a' }}></i>
                                            {t('pornstar.details.eyes')}
                                        </span>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#2b2838' }}>{pornstar.eye_color}</span>
                                    </div>
                                )}
                                {pornstar.ethnicity && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                                        <span style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className="bi bi-globe" style={{ color: '#c2338a' }}></i>
                                            {t('pornstar.details.ethnicity')}
                                        </span>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#2b2838' }}>{pornstar.ethnicity}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bio Section - Compact */}
                        {pornstar.bio?.content && (
                            <div style={{
                                background: 'white',
                                border: '1px solid rgba(194, 51, 138, 0.15)',
                                borderRadius: '12px',
                                padding: '20px'
                            }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    marginBottom: '12px',
                                    color: '#2b2838',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <i className="bi bi-file-text" style={{ color: '#c2338a', fontSize: '20px' }}></i>
                                    {t('pornstar.about.bio')}
                                </h3>
                                {pornstar.bio.language !== locale && (
                                    <div style={{
                                        padding: '8px 12px',
                                        marginBottom: '12px',
                                        background: 'rgba(194, 51, 138, 0.05)',
                                        border: '1px solid rgba(194, 51, 138, 0.2)',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '13px'
                                    }}>
                                        <i className="bi bi-translate" style={{ color: '#c2338a' }}></i>
                                        <span style={{ color: '#666' }}>{t('pornstar.about.notTranslated')}</span>
                                    </div>
                                )}
                                <p style={{
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    color: '#666',
                                    whiteSpace: 'pre-wrap',
                                    margin: 0
                                }}>
                                    {pornstar.bio.content}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                title={authModalContent.title}
                message={authModalContent.message}
                icon={authModalContent.icon}
                trigger={`pornstar_${authModalTrigger}_unauthenticated`}
                imageUrl={profileImageUrl}
            />

            {/* Tip Modal */}
            <QuickTransaction
                config={tipConfig}
                isOpen={showTipModal}
                onClose={() => setShowTipModal(false)}
            />
        </div>
    );
}
