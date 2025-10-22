"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import BlogService from "@/lib/services/BlogService";
import { BlogPost } from "@/lib/repositories/BlogRepository";

function BlogDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(false);
      const postData = await BlogService.getPostBySlug(slug);
      setPost(postData);

      // Load related posts (same category)
      if (postData.category) {
        const related = await BlogService.getAllPosts(
          1,
          3,
          postData.category.slug
        );
        setRelatedPosts(related.data.filter((p) => p.id !== postData.id));
      }
    } catch (err) {
      console.error("Failed to load blog post:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #1a1626 0%, #2b2838 100%)",
          minHeight: "100vh",
        }}
        className="flex items-center justify-center"
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #1a1626 0%, #2b2838 100%)",
          minHeight: "100vh",
          paddingTop: "80px",
        }}
      >
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-white text-4xl font-bold mb-4">
            {t("blog.notFound")}
          </h1>
          <p className="text-gray-400 mb-8">{t("blog.notFoundDescription")}</p>
          <Link
            href={"/blog" as any}
            className="inline-block px-6 py-3 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
          >
            {t("blog.backToBlog")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a1626 0%, #2b2838 100%)",
        paddingTop: "80px",
        paddingBottom: "40px",
      }}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href={"/blog" as any}
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <i className="bi bi-arrow-left mr-2"></i>
          {t("blog.backToBlog")}
        </Link>

        {/* Article */}
        <article className="max-w-4xl mx-auto">
          {/* Category Badge */}
          {post.category && (
            <span className="inline-block px-4 py-2 bg-pink-500 text-white text-sm font-semibold rounded-full mb-4">
              {post.category.name}
            </span>
          )}

          {/* Title */}
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-6">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-400">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <span className="font-medium">{post.author.name}</span>
              </div>
            )}
            <span className="flex items-center gap-1">
              <i className="bi bi-calendar"></i>
              {BlogService.formatDate(post.published_at, locale)}
            </span>
            <span className="flex items-center gap-1">
              <i className="bi bi-clock"></i>
              {BlogService.calculateReadingTime(post.content)}{" "}
              {t("blog.minRead")}
            </span>
            <span className="flex items-center gap-1">
              <i className="bi bi-eye"></i>
              {post.views_count.toLocaleString()} {t("blog.views")}
            </span>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8 rounded-lg overflow-hidden relative w-full" style={{ aspectRatio: '16/9' }}>
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert prose-lg max-w-none mb-12"
            style={{
              color: "#e5e7eb",
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-white/10 text-white text-sm rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-white text-3xl font-bold mb-8">
              {t("blog.relatedPosts")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}` as any}
                  className="group block bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300"
                >
                  {relatedPost.featured_image && (
                    <div className="relative h-40 bg-gray-800 overflow-hidden">
                      <Image
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-white text-lg font-bold mb-2 group-hover:text-pink-500 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogDetailPage;
