'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import PornstarsRepository from '@/lib/repositories/PornstarsRepository';
import PornstarsFilter from '@/components/pornstars/PornstarsFilter';
import { Pornstar, PornstarFilters } from '@/types/Pornstar';
import { PaginatedResponse } from '@/lib/types/PaginatedResponse';
import './styles.css';

function PornstarsPage() {
    const t = useTranslations();

    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [filters, setFilters] = useState<PornstarFilters>({ per_page: 24, page: 1 });
    const [pornstars, setPornstars] = useState<Pornstar[]>([]);
    const [pagination, setPagination] = useState<PaginatedResponse<Pornstar> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Helper function to convert UUID to number for gradients
    const getColorFromId = (id: string): number => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    // Fetch pornstars when filters change
    useEffect(() => {
        const fetchPornstars = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await PornstarsRepository.getAll(filters);
                setPornstars(response.getData());
                setPagination(response);
            } catch (err) {
                console.error('Error fetching pornstars:', err);
                setError(t('pornstars.errors.fetchFailed'));
            } finally {
                setLoading(false);
            }
        };

        fetchPornstars();
    }, [filters, t]);

    const handleFilterChange = (newFilters: PornstarFilters) => {
        setFilters({ ...newFilters, per_page: 24, page: 1 });
    };

    const handlePageChange = (pageNumber: number) => {
        setFilters({ ...filters, page: pageNumber });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderPagination = () => {
        if (!pagination) return null;

        const currentPage = pagination.getCurrentPage();
        const totalPages = pagination.getLastPage();
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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
                                {t('pornstars.subtitle', { count: pagination?.getTotal() || 0 })}
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
            <div className="container mx-auto px-4 py-12">
                {/* Mobile Filter Toggle Button */}
                <button
                    className="lg:hidden mb-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-pink-500 text-pink-500 rounded-lg font-semibold hover:bg-pink-50 transition-colors"
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                >
                    <i className={`bi bi-${isMobileFilterOpen ? 'x-lg' : 'funnel'}`}></i>
                    {isMobileFilterOpen ? t('pornstars.filters.hideFilters') : t('pornstars.filters.showFilters')}
                </button>

                <div className="flex flex-wrap lg:flex-nowrap gap-8">
                    {/* Left Sidebar - Filter */}
                    <div className={`w-full lg:w-64 flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
                        <PornstarsFilter
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Loading State */}
                        {loading && (
                            <div className="text-center py-20">
                                <i className="bi bi-hourglass-split text-5xl text-pink-500 animate-spin mb-4 block"></i>
                                <p className="text-gray-600">{t('common.loading')}</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="text-center py-20">
                                <i className="bi bi-exclamation-triangle text-5xl text-red-500 mb-4 block"></i>
                                <p className="text-red-600 mb-4">{error}</p>
                                <button
                                    className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                                    onClick={() => setFilters({ ...filters })}
                                >
                                    {t('common.retry')}
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && pornstars.length === 0 && (
                            <div className="text-center py-20">
                                <i className="bi bi-search text-5xl text-gray-400 mb-4 block"></i>
                                <p className="text-gray-600 mb-4">{t('pornstars.noResults')}</p>
                                <button
                                    className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                                    onClick={() => setFilters({ per_page: 24, page: 1 })}
                                >
                                    {t('pornstars.filters.clearAll')}
                                </button>
                            </div>
                        )}

                        {/* Pornstars Grid/List */}
                        {!loading && !error && pornstars.length > 0 && (
                            <>
                                {viewMode === 'grid' ? (
                                    <div className="flex flex-wrap gap-4">
                                        {pornstars.map(pornstar => (
                                            <div key={pornstar.id} className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] xl:w-[calc(20%-0.8rem)]">
                                                <Link
                                                    href={`/pornstar/${pornstar.slug}` as any}
                                                    className="pornstar-card"
                                                >
                                                    <div className="pornstar-avatar-wrapper">
                                                        <div
                                                            className="pornstar-avatar"
                                                            style={{
                                                                backgroundColor: `hsl(${(getColorFromId(pornstar.id) * 137) % 360}, 70%, 30%)`
                                                            }}
                                                        >
                                                        </div>
                                                    </div>
                                                    <div className="pornstar-info">
                                                        <h3 className="pornstar-name">{`${pornstar.first_name} ${pornstar.last_name}`}</h3>
                                                        <div className="pornstar-stats">
                                                            {pornstar.age && <span><i className="bi bi-calendar"></i> {pornstar.age}</span>}
                                                            {pornstar.country && <span><i className="bi bi-geo-alt"></i> {pornstar.country.iso}</span>}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="pornstars-list">
                                        {pornstars.map(pornstar => (
                                            <Link
                                                key={pornstar.id}
                                                href={`/pornstar/${pornstar.slug}` as any}
                                                className="pornstar-list-item"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="pornstar-list-avatar"
                                                        style={{
                                                            backgroundColor: `hsl(${(getColorFromId(pornstar.id) * 137) % 360}, 70%, 30%)`
                                                        }}
                                                    >
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="pornstar-list-name">{`${pornstar.first_name} ${pornstar.last_name}`}</h3>
                                                        <div className="pornstar-list-details">
                                                            {pornstar.age && <span>{pornstar.age} years</span>}
                                                            {pornstar.country && <span>{pornstar.country.name}</span>}
                                                            {pornstar.ethnicity && <span>{pornstar.ethnicity}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="pornstar-list-stats">
                                                        {pornstar.height_cm && <div><i className="bi bi-arrows-vertical"></i> {pornstar.height_cm}cm</div>}
                                                        {pornstar.weight_kg && <div><i className="bi bi-speedometer"></i> {pornstar.weight_kg}kg</div>}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {pagination && pagination.getLastPage() > 1 && (
                                    <div className="pagination-wrapper">
                                        <div className="pagination-info">
                                            {t('pornstars.pagination.showing', {
                                                start: pagination.getFrom(),
                                                end: pagination.getTo(),
                                                total: pagination.getTotal()
                                            })}
                                        </div>
                                        <div className="pagination">
                                            {renderPagination()}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PornstarsPage;