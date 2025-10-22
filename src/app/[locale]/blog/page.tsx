'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import BlogService from '@/lib/services/BlogService';
import { BlogPost } from '@/lib/repositories/BlogRepository';

function BlogPage() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';

    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

    useEffect(() => {
        loadPosts();
        loadCategories();
    }, [currentPage, selectedCategory]);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const response = await BlogService.getAllPosts(currentPage, 12, selectedCategory);
            setPosts(response.data);
            setTotalPages(response.meta.last_page);
        } catch (error) {
            console.error('Failed to load blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const cats = await BlogService.getCategories();
            setCategories(cats);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryFilter = (categorySlug?: string) => {
        setSelectedCategory(categorySlug);
        setCurrentPage(1);
    };

    if (loading && posts.length === 0) {
        return (
            <div style={{ background: 'linear-gradient(135deg, #1a1626 0%, #2b2838 100%)', minHeight: '100vh' }} className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'linear-gradient(135deg, #1a1626 0%, #2b2838 100%)', paddingTop: '80px', paddingBottom: '40px' }}>
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-white text-5xl font-bold mb-4">
                        {t('blog.title')}
                    </h1>
                    <p className="text-gray-300 text-xl">
                        {t('blog.subtitle')}
                    </p>
                </div>

                {/* Category Filter */}
                <div className="mb-8 flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={() => handleCategoryFilter(undefined)}
                        className={`px-4 py-2 rounded-full transition-colors ${
                            !selectedCategory
                                ? 'bg-pink-500 text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                    >
                        {t('blog.allCategories')}
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryFilter(category.slug)}
                            className={`px-4 py-2 rounded-full transition-colors ${
                                selectedCategory === category.slug
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                        >
                            {category.name} ({category.posts_count})
                        </button>
                    ))}
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}` as any}
                            className="group block bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105"
                        >
                            {/* Featured Image */}
                            {post.featured_image && (
                                <div className="relative h-48 bg-gray-800 overflow-hidden">
                                    <Image
                                        src={post.featured_image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6">
                                {/* Category Badge */}
                                {post.category && (
                                    <span className="inline-block px-3 py-1 bg-pink-500 text-white text-xs font-semibold rounded-full mb-3">
                                        {post.category.name}
                                    </span>
                                )}

                                {/* Title */}
                                <h3 className="text-white text-xl font-bold mb-2 group-hover:text-pink-500 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                {/* Excerpt */}
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        {post.author && (
                                            <span>{post.author.name}</span>
                                        )}
                                    </div>
                                    <span>{BlogService.formatDate(post.published_at, locale)}</span>
                                </div>

                                {/* Reading Time & Views */}
                                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <i className="bi bi-clock"></i>
                                        {BlogService.calculateReadingTime(post.content)} {t('blog.minRead')}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <i className="bi bi-eye"></i>
                                        {post.views_count.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('blog.previous')}
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded transition-colors ${
                                    currentPage === page
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('blog.next')}
                        </button>
                    </div>
                )}

                {/* No Posts */}
                {!loading && posts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-xl">{t('blog.noPosts')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BlogPage;
