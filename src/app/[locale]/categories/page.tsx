'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import './styles.css';

function CategoriesPage() {const t = useTranslations();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [sortBy, setSortBy] = useState('popular');
    const [isPremium, setIsPremium] = useState(false); // Simulate premium status

    // Mock categories with real adult content categories
    const categories = [
        { id: 1, name: 'Amateur', slug: 'amateur', videos: 15420, icon: '👤', color: '#e74c3c', trending: true, description: 'Real homemade content' },
        { id: 2, name: 'Professional', slug: 'professional', videos: 12340, icon: '💼', color: '#3498db', description: 'Studio productions' },
        { id: 3, name: 'MILF', slug: 'milf', videos: 9876, icon: '👩', color: '#9b59b6', trending: true, description: 'Mature women content' },
        { id: 4, name: 'Teen (18+)', slug: 'teen', videos: 18234, icon: '🎓', color: '#1abc9c', description: 'Young adults 18+' },
        { id: 5, name: 'Lesbian', slug: 'lesbian', videos: 8765, icon: '💋', color: '#e91e63', trending: true, description: 'Girl on girl action' },
        { id: 6, name: 'Anal', slug: 'anal', videos: 7654, icon: '🍑', color: '#ff5722', description: 'Backdoor content' },
        { id: 7, name: 'Big Tits', slug: 'big-tits', videos: 11234, icon: '🍈', color: '#795548', description: 'Busty content' },
        { id: 8, name: 'Blonde', slug: 'blonde', videos: 9876, icon: '👱‍♀️', color: '#ffc107', description: 'Blonde performers' },
        { id: 9, name: 'Brunette', slug: 'brunette', videos: 8765, icon: '👩‍🦱', color: '#607d8b', description: 'Brunette performers' },
        { id: 10, name: 'Redhead', slug: 'redhead', videos: 4567, icon: '👩‍🦰', color: '#ff6b6b', description: 'Ginger performers' },
        { id: 11, name: 'Asian', slug: 'asian', videos: 6789, icon: '🌸', color: '#ff1744', description: 'Asian performers' },
        { id: 12, name: 'Ebony', slug: 'ebony', videos: 5678, icon: '🌍', color: '#4a148c', description: 'Black performers' },
        { id: 13, name: 'Latina', slug: 'latina', videos: 7890, icon: '🌶️', color: '#ff6f00', description: 'Latin performers' },
        { id: 14, name: 'Threesome', slug: 'threesome', videos: 5432, icon: '👥', color: '#00bcd4', description: 'Group fun' },
        { id: 15, name: 'POV', slug: 'pov', videos: 8901, icon: '👁️', color: '#673ab7', trending: true, description: 'Point of view' },
        { id: 16, name: 'VR', slug: 'vr', videos: 2345, icon: '🥽', color: '#00acc1', new: true, description: 'Virtual reality' },
        { id: 17, name: 'Fetish', slug: 'fetish', videos: 4321, icon: '⛓️', color: '#424242', description: 'Kinky content' },
        { id: 18, name: 'Cosplay', slug: 'cosplay', videos: 3456, icon: '🦸‍♀️', color: '#8e24aa', new: true, description: 'Costume roleplay' },
        { id: 19, name: 'Massage', slug: 'massage', videos: 4567, icon: '💆‍♀️', color: '#43a047', description: 'Sensual massage' },
        { id: 20, name: 'Vintage', slug: 'vintage', videos: 2345, icon: '📼', color: '#6d4c41', description: 'Classic content' }
    ];

    const getLocalizedPath = (path: string) => {
        return locale === 'en' ? path : `/${locale}${path}`;
    };

    // Sort categories
    const sortedCategories = [...categories].sort((a, b) => {
        switch (sortBy) {
            case 'popular':
                return b.videos - a.videos;
            case 'alphabetical':
                return a.name.localeCompare(b.name);
            case 'newest':
                return (b.new ? 1 : 0) - (a.new ? 1 : 0);
            default:
                return 0;
        }
    });

    // Ad banner component that gracefully disappears for premium users
    const AdBanner = ({ position, style = {} }: { position: string; style?: React.CSSProperties }) => {
        if (isPremium) return null; // Premium users don't see ads

        const adTypes = [
            { text: 'Hot Singles in Your Area', cta: 'Meet Now', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { text: 'Premium Cams Live 24/7', cta: 'Watch Live', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
            { text: 'Exclusive VIP Content', cta: 'Get Access', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
            { text: '50% OFF Premium Membership', cta: 'Claim Offer', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }
        ];

        const ad = adTypes[Math.floor(Math.random() * adTypes.length)];

        return (
            <div className="ad-banner-wrapper" style={style}>
                <div className="ad-banner" style={{ background: ad.gradient }}>
                    <div className="ad-content">
                        <span className="ad-tag">AD</span>
                        <h4 className="ad-title">{ad.text}</h4>
                        <button className="ad-cta">{ad.cta}</button>
                    </div>
                    <div className="ad-animation">
                        <div className="pulse-ring"></div>
                        <div className="pulse-ring"></div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="categories-page">
            {/* Hero Section */}
            <div className="categories-hero">
                <div className="hero-bg">
                    <div className="animated-gradient"></div>
                </div>
                <div className="container mx-auto px-4">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            {t('header.categories')}
                        </h1>
                        <p className="hero-subtitle">
                            Explore {categories.length} categories of premium content
                        </p>

                        {/* Controls */}
                        <div className="controls-bar">
                            <div className="view-toggle">
                                <button
                                    className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <i className="bi bi-grid-3x3-gap-fill"></i>
                                </button>
                                <button
                                    className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    <i className="bi bi-list-ul"></i>
                                </button>
                            </div>

                            <select
                                className="sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="popular">Most Popular</option>
                                <option value="alphabetical">Alphabetical</option>
                                <option value="newest">Newest First</option>
                            </select>

                            {/* Premium Toggle (for demo) */}
                            <button
                                className="premium-toggle"
                                onClick={() => setIsPremium(!isPremium)}
                                title="Toggle premium status (demo)"
                            >
                                {isPremium ? '👑 Premium' : '🎭 Free'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Ad Banner */}
            <AdBanner position="top" />

            {/* Categories Section */}
            <div className="container mx-auto px-4 py-12">
                <div className={viewMode === 'grid' ? 'categories-grid' : 'categories-list'}>
                    {sortedCategories.map((category, index) => (
                        <React.Fragment key={category.id}>
                            {/* Insert ad after every 6 categories */}
                            {index === 6 && <AdBanner position="middle-1" />}
                            {index === 12 && <AdBanner position="middle-2" />}

                            <Link
                                href={`/categories/${category.slug}` as any}
                                className="category-item"
                                style={{ '--category-color': category.color } as any}
                            >
                                <div className="category-card">
                                    {viewMode === 'grid' ? (
                                        <>
                                            <div className="category-icon">
                                                <span>{category.icon}</span>
                                                {category.trending && <span className="badge-trending">🔥 HOT</span>}
                                                {category.new && <span className="badge-new">NEW</span>}
                                            </div>
                                            <div className="category-info">
                                                <h3>{category.name}</h3>
                                                <p className="category-description">{category.description}</p>
                                                <div className="category-stats">
                                                    <span><i className="bi bi-play-circle"></i> {category.videos.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="category-icon-list">
                                                <span>{category.icon}</span>
                                            </div>
                                            <div className="category-info-list">
                                                <div>
                                                    <h3>
                                                        {category.name}
                                                        {category.trending && <span className="badge-trending ms-2">🔥 HOT</span>}
                                                        {category.new && <span className="badge-new ms-2">NEW</span>}
                                                    </h3>
                                                    <p>{category.description}</p>
                                                </div>
                                                <div className="category-stats-list">
                                                    <span className="videos-count">
                                                        <i className="bi bi-play-circle"></i>
                                                        {category.videos.toLocaleString()} videos
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Link>
                        </React.Fragment>
                    ))}
                </div>

                {/* Bottom Ad Banner */}
                <AdBanner position="bottom" style={{ marginTop: '40px' }} />

                {/* Premium CTA */}
                {!isPremium && (
                    <div className="premium-cta">
                        <div className="premium-card">
                            <div className="premium-content">
                                <h2>🚀 Go Premium, Go Ad-Free!</h2>
                                <p>Enjoy unlimited content without interruptions</p>
                                <ul>
                                    <li>✓ No advertisements</li>
                                    <li>✓ HD & 4K quality</li>
                                    <li>✓ Exclusive content</li>
                                    <li>✓ Priority support</li>
                                </ul>
                            </div>
                            <div className="premium-action">
                                <Link href='/subscriptions' className="btn-premium">
                                    Upgrade to Premium
                                </Link>
                                <span className="premium-price">Starting at $9.99/month</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoriesPage;