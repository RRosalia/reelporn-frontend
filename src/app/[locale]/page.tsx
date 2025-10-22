'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import VideoCard from '@/components/VideoCard';

export default function HomePage() {
    const t = useTranslations();
    const [activeTab, setActiveTab] = useState('trending');

    // Mock data - replace with API call later
    // Using deterministic values based on index to avoid hydration mismatches
    const mockVideos = Array.from({ length: 24 }, (_, i) => ({
        id: i + 1,
        title: `Hot Video ${i + 1}`,
        thumbnail: `https://images.unsplash.com/photo-${1500000000000 + (i * 123456789)}?w=300&h=533&fit=crop&auto=format`,
        duration: ((i * 7) % 15) + 1,
        views: `${((i * 13) % 100) + 1}K`,
        likes: `${((i * 11) % 50) + 1}K`,
        uploadedAt: `${((i * 5) % 24) + 1}h ago`
    }));

    const categories = [
        { key: 'trending', label: t('category.trending'), icon: '🔥' },
        { key: 'new', label: t('category.new'), icon: '✨' },
        { key: 'popular', label: t('category.popular'), icon: '⭐' },
        { key: 'amateur', label: t('category.amateur'), icon: '👤' },
        { key: 'professional', label: t('category.professional'), icon: '💼' },
        { key: 'featured', label: t('category.featured'), icon: '🎬' }
    ];

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #1a1626 0%, #2b2838 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.05,
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, #fff 35px, #fff 70px)'
                }}></div>

                <div className="container mx-auto px-4 py-12 md:py-20 relative">
                    <div className="flex flex-wrap items-center -mx-4" style={{ minHeight: '500px' }}>
                        <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{
                                background: 'linear-gradient(135deg, #c2338a 0%, #f8c537 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                {t('home.hero.title')}
                            </h1>
                            <p className="text-xl mb-8 text-white/50">
                                {t('home.hero.subtitle')}
                            </p>

                            <div className="flex gap-3 mb-8">
                                <Link
                                    href="/shorts"
                                    className="inline-block px-8 py-3 text-lg font-bold text-white rounded-full"
                                    style={{
                                        background: 'linear-gradient(135deg, #c2338a 0%, #e74c3c 100%)',
                                        boxShadow: '0 4px 15px rgba(194, 51, 138, 0.4)'
                                    }}
                                >
                                    {t('home.hero.watchNow')}
                                </Link>
                                <Link
                                    href="/signup"
                                    className="inline-block px-8 py-3 text-lg font-bold text-white border-2 border-white rounded-full"
                                >
                                    {t('home.hero.getPremium')}
                                </Link>
                            </div>

                            <div className="flex flex-wrap -mx-4 mt-12">
                                <div className="w-1/3 px-4">
                                    <div className="text-center">
                                        <h3 className="text-2xl md:text-3xl font-bold mb-0" style={{ color: '#f8c537' }}>10K+</h3>
                                        <small className="text-white/50 text-sm">{t('home.stats.videos')}</small>
                                    </div>
                                </div>
                                <div className="w-1/3 px-4">
                                    <div className="text-center">
                                        <h3 className="text-2xl md:text-3xl font-bold mb-0" style={{ color: '#c2338a' }}>50K+</h3>
                                        <small className="text-white/50 text-sm">{t('home.stats.users')}</small>
                                    </div>
                                </div>
                                <div className="w-1/3 px-4">
                                    <div className="text-center">
                                        <h3 className="text-2xl md:text-3xl font-bold mb-0" style={{ color: '#f8c537' }}>100+</h3>
                                        <small className="text-white/50 text-sm">{t('home.stats.daily')}</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 px-4">
                            <div className="relative">
                                <div style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '20px',
                                    padding: '40px',
                                    minHeight: '400px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
                                }}>
                                    <div className="text-center text-white">
                                        <i className="bi bi-play-circle" style={{ fontSize: '120px', opacity: 0.3 }}></i>
                                        <h4 className="mt-6 text-xl">{t('home.hero.featuredContent')}</h4>
                                    </div>
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    right: '-10px',
                                    background: 'linear-gradient(135deg, #c2338a 0%, #e74c3c 100%)',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    boxShadow: '0 4px 15px rgba(194, 51, 138, 0.5)'
                                }}>
                                    {t('home.hero.trending')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Pills */}
            <div className="bg-white border-b sticky z-50" style={{ top: '56px' }}>
                <div className="container mx-auto px-4">
                    <div className="flex gap-2 py-3 overflow-auto flex-nowrap scrollbar-thin">
                        {categories.map((category) => (
                            <button
                                key={category.key}
                                className="px-5 py-2 text-sm whitespace-nowrap rounded-full transition-all duration-300"
                                onClick={() => setActiveTab(category.key)}
                                style={{
                                    background: activeTab === category.key
                                        ? 'linear-gradient(135deg, #c2338a 0%, #e74c3c 100%)'
                                        : 'transparent',
                                    color: activeTab === category.key ? 'white' : '#666',
                                    border: activeTab === category.key ? 'none' : '1px solid #dee2e6',
                                    fontWeight: activeTab === category.key ? 'bold' : 'normal'
                                }}
                            >
                                <span className="mr-1">{category.icon}</span>
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Video Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-0 text-gray-900">
                        {categories.find(c => c.key === activeTab)?.icon} {categories.find(c => c.key === activeTab)?.label}
                    </h2>
                    <Link href="/categories" className="no-underline font-semibold" style={{ color: '#c2338a' }}>
                        {t('home.viewAll')} →
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {mockVideos.map((video) => (
                        <div key={video.id}>
                            <VideoCard video={video} />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button
                        className="px-12 py-3 text-lg font-bold text-white rounded-full"
                        style={{
                            background: 'linear-gradient(135deg, #c2338a 0%, #e74c3c 100%)',
                            boxShadow: '0 4px 15px rgba(194, 51, 138, 0.3)'
                        }}
                    >
                        {t('home.loadMore')}
                    </button>
                </div>
            </div>

            {/* Pornstars Section - Hidden for now */}
            {/* <div className="py-12 md:py-20" style={{ background: 'linear-gradient(135deg, rgba(194, 51, 138, 0.05) 0%, rgba(248, 197, 55, 0.05) 100%)' }}>
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold mb-0" style={{
                            background: 'linear-gradient(135deg, #c2338a 0%, #f8c537 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            {t('pornstars.title')}
                        </h2>
                        <Link href="/pornstars" className="no-underline font-bold" style={{ color: '#c2338a' }}>
                            {t('home.viewAll')} →
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {mockPornstars.map((star) => (
                            <div key={star.id}>
                                <Link
                                    href={`/pornstar/${star.id}` as any}
                                    className="no-underline block"
                                >
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-2 border-transparent">
                                        <div className="relative">
                                            <div style={{
                                                paddingTop: '100%',
                                                background: `linear-gradient(135deg, hsl(${star.id * 137 % 360}, 70%, 30%) 0%, hsl(${(star.id * 137 + 60) % 360}, 70%, 20%) 100%)`,
                                                position: 'relative'
                                            }}>
                                                <img
                                                    src={star.avatar}
                                                    alt={star.name}
                                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                                    onError={(e: any) => (e.target.style.display = 'none')}
                                                />
                                            </div>

                                            {star.isOnline && (
                                                <div className="absolute top-2.5 right-2.5 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                                            )}

                                            {star.verified && (
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '10px',
                                                    right: '10px',
                                                    background: 'linear-gradient(135deg, #c2338a 0%, #f8c537 100%)',
                                                    color: 'white',
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '2px solid white'
                                                }}>
                                                    <i className="bi bi-check text-base font-bold"></i>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3">
                                            <h6 className="text-dark-secondary font-bold mb-1 text-sm truncate">
                                                {star.name}
                                            </h6>
                                            <div className="text-xs text-gray-600">
                                                <div className="flex justify-between mb-1">
                                                    <span>{star.videos}</span>
                                                    <span>{star.views}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span style={{ color: '#f8c537' }}>
                                                        {'★'.repeat(Math.floor(parseFloat(star.rating)))}
                                                        {'☆'.repeat(5 - Math.floor(parseFloat(star.rating)))}
                                                    </span>
                                                    <span className="ml-1">{star.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div> */}

            {/* Premium CTA Section */}
            <div className="py-20" style={{
                background: 'linear-gradient(135deg, #1a1626 0%, #2b2838 100%)'
            }}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center -mx-4">
                        <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0 text-white">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{
                                background: 'linear-gradient(135deg, #c2338a 0%, #f8c537 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                {t('home.premium.title')}
                            </h2>
                            <p className="text-xl mb-8 text-white/50">
                                {t('home.premium.subtitle')}
                            </p>
                            <ul className="list-none mb-8 space-y-2">
                                <li className="flex items-start">
                                    <i className="bi bi-check-circle-fill mr-3 mt-1" style={{ color: '#c2338a' }}></i>
                                    <span>{t('home.premium.feature1')}</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="bi bi-check-circle-fill mr-3 mt-1" style={{ color: '#c2338a' }}></i>
                                    <span>{t('home.premium.feature2')}</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="bi bi-check-circle-fill mr-3 mt-1" style={{ color: '#c2338a' }}></i>
                                    <span>{t('home.premium.feature3')}</span>
                                </li>
                                <li className="flex items-start">
                                    <i className="bi bi-check-circle-fill mr-3 mt-1" style={{ color: '#c2338a' }}></i>
                                    <span>{t('home.premium.feature4')}</span>
                                </li>
                            </ul>
                            <Link
                                href="/signup"
                                className="inline-block px-12 py-3 text-lg font-bold text-white rounded-full"
                                style={{
                                    background: 'linear-gradient(135deg, #c2338a 0%, #e74c3c 100%)',
                                    boxShadow: '0 4px 15px rgba(194, 51, 138, 0.4)'
                                }}
                            >
                                {t('home.premium.cta')}
                            </Link>
                        </div>
                        <div className="w-full lg:w-1/2 px-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-6 text-center rounded-2xl" style={{
                                    background: 'rgba(194, 51, 138, 0.1)',
                                    border: '1px solid rgba(194, 51, 138, 0.2)'
                                }}>
                                    <i className="bi bi-badge-hd text-6xl" style={{ color: '#f8c537' }}></i>
                                    <h5 className="mt-4 text-white text-lg font-semibold">{t('footer.features.hdQuality')}</h5>
                                </div>
                                <div className="p-6 text-center rounded-2xl" style={{
                                    background: 'rgba(194, 51, 138, 0.1)',
                                    border: '1px solid rgba(194, 51, 138, 0.2)'
                                }}>
                                    <i className="bi bi-download text-6xl" style={{ color: '#f8c537' }}></i>
                                    <h5 className="mt-4 text-white text-lg font-semibold">{t('footer.features.downloads')}</h5>
                                </div>
                                <div className="p-6 text-center rounded-2xl" style={{
                                    background: 'rgba(194, 51, 138, 0.1)',
                                    border: '1px solid rgba(194, 51, 138, 0.2)'
                                }}>
                                    <i className="bi bi-x-octagon text-6xl" style={{ color: '#f8c537' }}></i>
                                    <h5 className="mt-4 text-white text-lg font-semibold">{t('footer.features.noAds')}</h5>
                                </div>
                                <div className="p-6 text-center rounded-2xl" style={{
                                    background: 'rgba(194, 51, 138, 0.1)',
                                    border: '1px solid rgba(194, 51, 138, 0.2)'
                                }}>
                                    <i className="bi bi-stars text-6xl" style={{ color: '#f8c537' }}></i>
                                    <h5 className="mt-4 text-white text-lg font-semibold">{t('footer.features.exclusive')}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
