'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import './styles.css';

function PornstarsPage() {const t = useTranslations();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const pornstarsPerPage = 24;

    // Mock data - replace with API call
    const generateMockPornstars = () => {
        return Array.from({ length: 150 }, (_, i) => ({
            id: i + 1,
            name: `Star ${i + 1}`,
            stageName: `PornStar${i + 1}`,
            avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=400&h=400&fit=crop&auto=format&q=80`,
            videos: Math.floor(Math.random() * 200) + 10,
            views: `${Math.floor(Math.random() * 999) + 1}M`,
            likes: `${Math.floor(Math.random() * 999) + 1}K`,
            verified: Math.random() > 0.5,
            country: ['USA', 'UK', 'Germany', 'France', 'Netherlands'][Math.floor(Math.random() * 5)],
            age: Math.floor(Math.random() * 15) + 20,
            category: ['Amateur', 'Professional', 'Rising Star'][Math.floor(Math.random() * 3)]
        }));
    };

    const allPornstars = generateMockPornstars();

    // Calculate pagination
    const indexOfLastPornstar = currentPage * pornstarsPerPage;
    const indexOfFirstPornstar = indexOfLastPornstar - pornstarsPerPage;
    const currentPornstars = allPornstars.slice(indexOfFirstPornstar, indexOfLastPornstar);
    const totalPages = Math.ceil(allPornstars.length / pornstarsPerPage);

    const getLocalizedPath = (path: string) => {
        return locale === 'en' ? path : `/${locale}${path}`;
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        pages.push(
            <button
                key="prev"
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <i className="bi bi-chevron-left"></i>
            </button>
        );

        // First page
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    className="pagination-btn"
                    onClick={() => handlePageChange(1)}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="dots1" className="pagination-dots">...</span>);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="dots2" className="pagination-dots">...</span>);
            }
            pages.push(
                <button
                    key={totalPages}
                    className="pagination-btn"
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }

        // Next button
        pages.push(
            <button
                key="next"
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <i className="bi bi-chevron-right"></i>
            </button>
        );

        return pages;
    };

    return (
        <div className="pornstars-page">
            {/* Header */}
            <div className="pornstars-header">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center">
                        <div className="w-full lg:w-6/12">
                            <h1 className="pornstars-title">
                                {t('pornstars.title')}
                            </h1>
                            <p className="pornstars-subtitle">
                                {t('pornstars.subtitle', { count: allPornstars.length })}
                            </p>
                        </div>
                        <div className="w-full lg:w-6/12">
                            <div className="flex gap-3 justify-start lg:justify-end mt-4 lg:mt-0">
                                {/* View Mode Toggle */}
                                <div className="inline-flex rounded overflow-hidden border border-pink-500" role="group">
                                    <button
                                        className={`px-4 py-2 transition-colors ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'bg-transparent text-pink-500 hover:bg-pink-500/10'}`}
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <i className="bi bi-grid-3x3-gap"></i>
                                    </button>
                                    <button
                                        className={`px-4 py-2 transition-colors border-l border-pink-500 ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'bg-transparent text-pink-500 hover:bg-pink-500/10'}`}
                                        onClick={() => setViewMode('list')}
                                    >
                                        <i className="bi bi-list"></i>
                                    </button>
                                </div>

                                {/* Sort Dropdown */}
                                <select className="w-auto px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-pink-500">
                                    <option>{t('pornstars.sort.popular')}</option>
                                    <option>{t('pornstars.sort.newest')}</option>
                                    <option>{t('pornstars.sort.mostVideos')}</option>
                                    <option>{t('pornstars.sort.mostViewed')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-5">
                {viewMode === 'grid' ? (
                    <div className="flex flex-wrap gap-4">
                        {currentPornstars.map(pornstar => (
                            <div key={pornstar.id} className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] xl:w-[calc(16.666%-0.83rem)]">
                                <Link
                                    href={`/pornstar/${pornstar.id}` as any}
                                    className="pornstar-card"
                                >
                                    <div className="pornstar-avatar-wrapper">
                                        <div
                                            className="pornstar-avatar"
                                            style={{
                                                backgroundImage: `url(${pornstar.avatar})`,
                                                backgroundColor: `hsl(${(pornstar.id * 137) % 360}, 70%, 30%)`
                                            }}
                                        >
                                            {pornstar.verified && (
                                                <span className="verified-badge">
                                                    <i className="bi bi-check-circle-fill"></i>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pornstar-info">
                                        <h3 className="pornstar-name">{pornstar.stageName}</h3>
                                        <div className="pornstar-stats">
                                            <span><i className="bi bi-camera-video"></i> {pornstar.videos}</span>
                                            <span><i className="bi bi-eye"></i> {pornstar.views}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="pornstars-list">
                        {currentPornstars.map(pornstar => (
                            <Link
                                key={pornstar.id}
                                href={`/pornstar/${pornstar.id}` as any}
                                className="pornstar-list-item"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="pornstar-list-avatar"
                                        style={{
                                            backgroundImage: `url(${pornstar.avatar})`,
                                            backgroundColor: `hsl(${(pornstar.id * 137) % 360}, 70%, 30%)`
                                        }}
                                    >
                                        {pornstar.verified && (
                                            <span className="verified-badge">
                                                <i className="bi bi-check-circle-fill"></i>
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="pornstar-list-name">{pornstar.stageName}</h3>
                                        <div className="pornstar-list-details">
                                            <span className="inline-block px-2 py-1 bg-gray-600 text-white text-xs rounded">{pornstar.category}</span>
                                            <span>{pornstar.country}</span>
                                            <span>{pornstar.age} years</span>
                                        </div>
                                    </div>
                                    <div className="pornstar-list-stats">
                                        <div><i className="bi bi-camera-video"></i> {pornstar.videos} videos</div>
                                        <div><i className="bi bi-eye"></i> {pornstar.views} views</div>
                                        <div><i className="bi bi-heart"></i> {pornstar.likes} likes</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="pagination-wrapper">
                    <div className="pagination-info">
                        {t('pornstars.pagination.showing', {
                            start: indexOfFirstPornstar + 1,
                            end: Math.min(indexOfLastPornstar, allPornstars.length),
                            total: allPornstars.length
                        })}
                    </div>
                    <div className="pagination">
                        {renderPagination()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PornstarsPage;