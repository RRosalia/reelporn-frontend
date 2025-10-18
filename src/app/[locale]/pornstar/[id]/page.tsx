'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import VideoCard from '@/components/VideoCard';
import './styles.css';

function PornstarProfilePage() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const id = params?.id as string;
    const [activeTab, setActiveTab] = useState('videos');
    const [isFollowing, setIsFollowing] = useState(false);

    // Mock data - replace with API call
    const pornstar = {
        id: id,
        name: `Star ${id}`,
        stageName: `PornStar${id}`,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + parseInt(id || '1') * 1000000}?w=400&h=400&fit=crop&auto=format&q=80`,
        coverImage: `https://images.unsplash.com/photo-${1600000000000 + parseInt(id || '1') * 1000000}?w=1920&h=400&fit=crop&auto=format&q=80`,
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
        verified: true,
        stats: {
            videos: 142,
            photos: 856,
            views: '15.2M',
            likes: '892K',
            followers: '125K'
        },
        details: {
            age: 25,
            country: 'USA',
            height: "5'6\" (168 cm)",
            weight: "125 lbs (57 kg)",
            measurements: "34-24-36",
            hairColor: 'Blonde',
            eyeColor: 'Blue',
            ethnicity: 'Caucasian'
        },
        categories: ['Amateur', 'Solo', 'Lesbian', 'POV'],
        socialMedia: {
            twitter: '@pornstar',
            instagram: '@pornstar',
            onlyfans: 'pornstar'
        }
    };

    // Mock videos - replace with API call
    const mockVideos = Array.from({ length: 24 }, (_, i) => ({
        id: i + 1,
        title: `${pornstar.stageName} Video ${i + 1}`,
        thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i * 5000000}?w=300&h=533&fit=crop&auto=format&q=80`,
        duration: ((i * 7) % 15) + 1,
        views: `${((i * 13) % 100) + 1}K`,
        likes: `${((i * 11) % 50) + 1}K`,
        uploadedAt: `${((i * 5) % 24) + 1}h ago`
    }));

    const getLocalizedPath = (path: string) => {
        return locale === 'en' ? path : `/${locale}${path}`;
    };

    return (
        <div className="pornstar-profile">
            {/* Cover Image */}
            <div
                className="profile-cover"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(${pornstar.coverImage})`,
                    backgroundColor: `hsl(${(parseInt(id || '1') * 137) % 360}, 70%, 20%)`
                }}
            >
                <div className="container mx-auto px-4">
                    <div className="profile-header">
                        <div className="profile-avatar-wrapper">
                            <img
                                src={pornstar.avatar}
                                alt={pornstar.stageName}
                                className="profile-avatar"
                                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    if (target.parentElement) {
                                        (target.parentElement as HTMLElement).style.background = `linear-gradient(135deg, hsl(${(parseInt(id || '1') * 137) % 360}, 70%, 30%) 0%, hsl(${(parseInt(id || '1') * 137 + 60) % 360}, 70%, 20%) 100%)`;
                                    }
                                }}
                            />
                            {pornstar.verified && (
                                <span className="profile-verified">
                                    <i className="bi bi-check-circle-fill"></i>
                                </span>
                            )}
                        </div>
                        <div className="profile-info">
                            <h1 className="profile-name">
                                {pornstar.stageName}
                            </h1>
                            <div className="profile-stats">
                                <div className="stat">
                                    <span className="stat-value">{pornstar.stats.videos}</span>
                                    <span className="stat-label">{t('pornstar.stats.videos')}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{pornstar.stats.views}</span>
                                    <span className="stat-label">{t('pornstar.stats.views')}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{pornstar.stats.likes}</span>
                                    <span className="stat-label">{t('pornstar.stats.likes')}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{pornstar.stats.followers}</span>
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
                        {t('pornstar.tabs.videos')} ({pornstar.stats.videos})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'photos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('photos')}
                    >
                        <i className="bi bi-images mr-2"></i>
                        {t('pornstar.tabs.photos')} ({pornstar.stats.photos})
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
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                {mockVideos.map(video => (
                                    <div key={video.id}>
                                        <VideoCard video={video} />
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-5">
                                <button className="btn-load-more">
                                    {t('pornstar.loadMore')}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'photos' && (
                        <div className="photos-grid">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-3">
                                {Array.from({ length: 12 }, (_, i) => (
                                    <div key={i}>
                                        <div className="photo-item">
                                            <img
                                                src={`https://images.unsplash.com/photo-${1700000000000 + i * 3000000}?w=400&h=600&fit=crop&auto=format&q=80`}
                                                alt={`Photo ${i + 1}`}
                                                className="w-full rounded"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div className="about-section">
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full lg:w-8/12 px-3">
                                    <div className="about-card">
                                        <h3>{t('pornstar.about.bio')}</h3>
                                        <p>{pornstar.bio}</p>

                                        <h3 className="mt-4">{t('pornstar.about.categories')}</h3>
                                        <div className="categories-list">
                                            {pornstar.categories.map(cat => (
                                                <span key={cat} className="category-badge">{cat}</span>
                                            ))}
                                        </div>

                                        {pornstar.socialMedia && (
                                            <>
                                                <h3 className="mt-4">{t('pornstar.about.social')}</h3>
                                                <div className="social-links">
                                                    {pornstar.socialMedia.twitter && (
                                                        <a href={`https://twitter.com/${pornstar.socialMedia.twitter.replace('@', '')}`} className="social-link">
                                                            <i className="bi bi-twitter"></i> {pornstar.socialMedia.twitter}
                                                        </a>
                                                    )}
                                                    {pornstar.socialMedia.instagram && (
                                                        <a href={`https://instagram.com/${pornstar.socialMedia.instagram.replace('@', '')}`} className="social-link">
                                                            <i className="bi bi-instagram"></i> {pornstar.socialMedia.instagram}
                                                        </a>
                                                    )}
                                                    {pornstar.socialMedia.onlyfans && (
                                                        <a href={`https://onlyfans.com/${pornstar.socialMedia.onlyfans}`} className="social-link">
                                                            <i className="bi bi-heart"></i> OnlyFans
                                                        </a>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full lg:w-4/12 px-3">
                                    <div className="details-card">
                                        <h3>{t('pornstar.about.details')}</h3>
                                        <ul className="details-list">
                                            <li>
                                                <span className="detail-label">{t('pornstar.details.age')}</span>
                                                <span className="detail-value">{pornstar.details.age}</span>
                                            </li>
                                            <li>
                                                <span className="detail-label">{t('pornstar.details.country')}</span>
                                                <span className="detail-value">{pornstar.details.country}</span>
                                            </li>
                                            <li>
                                                <span className="detail-label">{t('pornstar.details.height')}</span>
                                                <span className="detail-value">{pornstar.details.height}</span>
                                            </li>
                                            <li>
                                                <span className="detail-label">{t('pornstar.details.weight')}</span>
                                                <span className="detail-value">{pornstar.details.weight}</span>
                                            </li>
                                            <li>
                                                <span className="detail-label">{t('pornstar.details.measurements')}</span>
                                                <span className="detail-value">{pornstar.details.measurements}</span>
                                            </li>
                                            <li>
                                                <span className="detail-label">{t('pornstar.details.hair')}</span>
                                                <span className="detail-value">{pornstar.details.hairColor}</span>
                                            </li>
                                            <li>
                                                <span className="detail-label">{t('pornstar.details.eyes')}</span>
                                                <span className="detail-value">{pornstar.details.eyeColor}</span>
                                            </li>
                                            <li>
                                                <span className="detail-label">{t('pornstar.details.ethnicity')}</span>
                                                <span className="detail-value">{pornstar.details.ethnicity}</span>
                                            </li>
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