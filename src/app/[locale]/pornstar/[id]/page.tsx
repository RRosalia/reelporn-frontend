'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import PornstarsRepository from '@/lib/repositories/PornstarsRepository';
import { Pornstar } from '@/types/Pornstar';
import { NotFoundException } from '@/lib/api/exceptions';
import './styles.css';

function PornstarProfilePage() {
    const t = useTranslations();
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as string) || 'en';
    const slug = params?.id as string;

    const [activeTab, setActiveTab] = useState('videos');
    const [isFollowing, setIsFollowing] = useState(false);
    const [pornstar, setPornstar] = useState<Pornstar | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [relatedPornstars, setRelatedPornstars] = useState<Pornstar[]>([]);

    // Fetch pornstar data
    useEffect(() => {
        const fetchPornstar = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await PornstarsRepository.getBySlug(slug);
                setPornstar(data);
            } catch (err: any) {
                console.error('Error fetching pornstar:', err);

                if (err instanceof NotFoundException || err.name === 'NotFoundException') {
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
                .then(related => setRelatedPornstars(related))
                .catch(err => console.error('Error fetching related pornstars:', err));
        }
    }, [error, pornstar, slug]);

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
                                            background: `linear-gradient(135deg, hsl(${(star.id * 137) % 360}, 70%, 40%) 0%, hsl(${(star.id * 137 + 60) % 360}, 70%, 30%) 100%)`
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
                                            }}>{star.name}</h3>
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

    return (
        <div className="pornstar-profile">
            {/* Cover Image */}
            <div
                className="profile-cover"
                style={{
                    background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), linear-gradient(135deg, hsl(${(pornstar.id * 137) % 360}, 70%, 20%) 0%, hsl(${(pornstar.id * 137 + 60) % 360}, 70%, 15%) 100%)`
                }}
            >
                <div className="container mx-auto px-4">
                    <div className="profile-header">
                        <div className="profile-avatar-wrapper">
                            <div
                                className="profile-avatar"
                                style={{
                                    background: `linear-gradient(135deg, hsl(${(pornstar.id * 137) % 360}, 70%, 40%) 0%, hsl(${(pornstar.id * 137 + 60) % 360}, 70%, 30%) 100%)`
                                }}
                            >
                            </div>
                        </div>
                        <div className="profile-info">
                            <h1 className="profile-name">
                                {pornstar.name}
                            </h1>
                            <div className="profile-stats">
                                <div className="stat">
                                    <span className="stat-value">0</span>
                                    <span className="stat-label">{t('pornstar.stats.videos')}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">0</span>
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
                                <button
                                    className={`btn-follow ${isFollowing ? 'following' : ''}`}
                                    onClick={() => setIsFollowing(!isFollowing)}
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
                                </button>
                                <button className="btn-message">
                                    <i className="bi bi-envelope mr-2"></i>
                                    {t('pornstar.message')}
                                </button>
                                <button className="btn-tip">
                                    <i className="bi bi-gift mr-2"></i>
                                    {t('pornstar.tip')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="container mx-auto px-4 py-12">
                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('videos')}
                    >
                        <i className="bi bi-camera-video mr-2"></i>
                        {t('pornstar.tabs.videos')} (0)
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'photos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('photos')}
                    >
                        <i className="bi bi-images mr-2"></i>
                        {t('pornstar.tabs.photos')} (0)
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                        onClick={() => setActiveTab('about')}
                    >
                        <i className="bi bi-info-circle mr-2"></i>
                        {t('pornstar.tabs.about')}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'videos' && (
                        <div className="videos-grid">
                            <div className="text-center py-20">
                                <i className="bi bi-camera-video text-5xl text-gray-400 mb-4 block"></i>
                                <p className="text-gray-600">No videos available yet</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'photos' && (
                        <div className="photos-grid">
                            <div className="text-center py-20">
                                <i className="bi bi-images text-5xl text-gray-400 mb-4 block"></i>
                                <p className="text-gray-600">No photos available yet</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div className="about-section">
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full lg:w-8/12 px-3">
                                    <div className="about-card">
                                        <h3>{t('pornstar.about.bio')}</h3>
                                        <p>{pornstar.bio || 'No biography available'}</p>
                                    </div>
                                </div>

                                <div className="w-full lg:w-4/12 px-3">
                                    <div className="details-card">
                                        <h3>{t('pornstar.about.details')}</h3>
                                        <ul className="details-list">
                                            {pornstar.age && (
                                                <li>
                                                    <span className="detail-label">{t('pornstar.details.age')}</span>
                                                    <span className="detail-value">{pornstar.age}</span>
                                                </li>
                                            )}
                                            {pornstar.country && (
                                                <li>
                                                    <span className="detail-label">{t('pornstar.details.country')}</span>
                                                    <span className="detail-value">{pornstar.country.name}</span>
                                                </li>
                                            )}
                                            {pornstar.height_cm && (
                                                <li>
                                                    <span className="detail-label">{t('pornstar.details.height')}</span>
                                                    <span className="detail-value">{pornstar.height_cm} cm</span>
                                                </li>
                                            )}
                                            {pornstar.weight_kg && (
                                                <li>
                                                    <span className="detail-label">{t('pornstar.details.weight')}</span>
                                                    <span className="detail-value">{pornstar.weight_kg} kg</span>
                                                </li>
                                            )}
                                            {pornstar.measurements && (
                                                <li>
                                                    <span className="detail-label">{t('pornstar.details.measurements')}</span>
                                                    <span className="detail-value">{pornstar.measurements}</span>
                                                </li>
                                            )}
                                            {pornstar.hair_color && (
                                                <li>
                                                    <span className="detail-label">{t('pornstar.details.hair')}</span>
                                                    <span className="detail-value">{pornstar.hair_color}</span>
                                                </li>
                                            )}
                                            {pornstar.eye_color && (
                                                <li>
                                                    <span className="detail-label">{t('pornstar.details.eyes')}</span>
                                                    <span className="detail-value">{pornstar.eye_color}</span>
                                                </li>
                                            )}
                                            {pornstar.ethnicity && (
                                                <li>
                                                    <span className="detail-label">{t('pornstar.details.ethnicity')}</span>
                                                    <span className="detail-value">{pornstar.ethnicity}</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PornstarProfilePage;