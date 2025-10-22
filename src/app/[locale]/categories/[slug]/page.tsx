'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import CategoryService from '@/lib/services/CategoryService';
import VideoCard from '@/components/VideoCard';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    videos_count?: number;
}

interface Video {
    id: string;
    title: string;
    thumbnail: string;
    duration: number;
    views: string;
    likes: string;
    uploadedAt: string;
}

function CategoryDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [category, setCategory] = useState<Category | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<any | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        loadCategoryData();
    }, [slug]);

    useEffect(() => {
        if (category) {
            loadVideos(currentPage);
        }
    }, [currentPage]);

    const loadCategoryData = async () => {
        try {
            setLoading(true);
            setError(null);
            const categoryData = await CategoryService.getCategoryBySlug(slug);
            setCategory(categoryData);
            loadVideos(1);
        } catch (err) {
            setError('Failed to load category. Please try again later.');
            console.error(err);
            setLoading(false);
        }
    };

    const loadVideos = async (page: number) => {
        try {
            setLoading(true);
            const response = await CategoryService.getCategoryVideos(slug, page);

            // Mock videos for now since endpoint might return empty
            // Replace with actual data: setVideos(response.getData());
            const mockVideos = Array.from({ length: 12 }, (_, i) => ({
                id: `${slug}-${i + 1}`,
                title: `${category?.name || 'Video'} ${i + 1}`,
                thumbnail: `https://picsum.photos/seed/${slug}-${i}/300/533`,
                duration: ((i * 7) % 15) + 1,
                views: `${((i * 13) % 100) + 1}K`,
                likes: `${((i * 11) % 50) + 1}K`,
                uploadedAt: `${((i * 5) % 24) + 1}h ago`
            }));

            setVideos(mockVideos);
            setPagination(response);
        } catch (err) {
            console.error('Error loading videos:', err);
            // Set mock videos on error too
            const mockVideos = Array.from({ length: 12 }, (_, i) => ({
                id: `${slug}-${i + 1}`,
                title: `${category?.name || 'Video'} ${i + 1}`,
                thumbnail: `https://picsum.photos/seed/${slug}-${i}/300/533`,
                duration: ((i * 7) % 15) + 1,
                views: `${((i * 13) % 100) + 1}K`,
                likes: `${((i * 11) % 50) + 1}K`,
                uploadedAt: `${((i * 5) % 24) + 1}h ago`
            }));
            setVideos(mockVideos);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    if (loading && !category) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="alert alert-danger" role="alert">
                    {error}
                    <div className="mt-3">
                        <Link href='/categories' className="btn btn-primary">
                            Back to Categories
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100">
            {/* Category Header */}
            <div className="bg-dark text-white py-5">
                <div className="container mx-auto px-4">
                    <nav aria-label="breadcrumb" className="mb-3">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href='/' className="text-white-50 text-decoration-none">
                                    Home
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link href='/categories' className="text-white-50 text-decoration-none">
                                    Categories
                                </Link>
                            </li>
                            <li className="breadcrumb-item active text-white" aria-current="page">
                                {category?.name}
                            </li>
                        </ol>
                    </nav>
                    <h1 className="display-4 fw-bold mb-3">
                        <i className="bi bi-folder-fill me-3"></i>
                        {category?.name}
                    </h1>
                    <p className="lead mb-3">{category?.description}</p>
                    <div className="d-flex align-items-center gap-3">
                        <span className="badge bg-primary fs-6">
                            <i className="bi bi-play-circle me-2"></i>
                            {category?.videos_count || 0} Videos
                        </span>
                    </div>
                </div>
            </div>

            {/* Videos Grid */}
            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading videos...</span>
                        </div>
                    </div>
                ) : videos.length > 0 ? (
                    <>
                        <div className="flex flex-wrap gap-3">
                            {videos.map((video) => (
                                <div key={video.id} className="w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.5rem)] md:w-[calc(25%-0.5625rem)] lg:w-[calc(16.666%-0.625rem)]">
                                    <VideoCard video={video} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.getLastPage() > 1 && (
                            <nav aria-label="Videos pagination" className="mt-5">
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${!pagination.hasPrevPage() ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={!pagination.hasPrevPage()}
                                        >
                                            Previous
                                        </button>
                                    </li>

                                    {Array.from({ length: pagination.getLastPage() }, (_, i) => i + 1).map((page) => (
                                        <li
                                            key={page}
                                            className={`page-item ${currentPage === page ? 'active' : ''}`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    ))}

                                    <li className={`page-item ${!pagination.hasNextPage() ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={!pagination.hasNextPage()}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="text-center py-5">
                        <i className="bi bi-film text-muted display-1"></i>
                        <h3 className="mt-4 text-muted">No videos yet</h3>
                        <p className="text-muted">Check back soon for new content!</p>
                        <Link href='/categories' className="btn btn-primary mt-3">
                            Browse Other Categories
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoryDetailPage;
