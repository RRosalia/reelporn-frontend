import BlogRepository, { BlogPost, BlogListResponse } from '@/lib/repositories/BlogRepository';

/**
 * Blog Service - Handles blog business logic
 */
class BlogService {
  /**
   * Get all blog posts with pagination
   * @param page - Page number
   * @param perPage - Items per page
   * @param category - Filter by category slug
   * @returns Blog posts with pagination
   */
  async getAllPosts(page: number = 1, perPage: number = 12, category?: string): Promise<BlogListResponse> {
    return await BlogRepository.getAllPosts(page, perPage, category);
  }

  /**
   * Get a single blog post by slug
   * @param slug - Blog post slug
   * @returns Blog post details
   */
  async getPostBySlug(slug: string): Promise<BlogPost> {
    return await BlogRepository.getPostBySlug(slug);
  }

  /**
   * Get featured/latest blog posts
   * @param limit - Number of posts to fetch
   * @returns Featured blog posts
   */
  async getFeaturedPosts(limit: number = 5): Promise<BlogPost[]> {
    return await BlogRepository.getFeaturedPosts(limit);
  }

  /**
   * Get blog categories
   * @returns List of blog categories
   */
  async getCategories() {
    return await BlogRepository.getCategories();
  }

  /**
   * Search blog posts
   * @param query - Search query
   * @param page - Page number
   * @returns Search results
   */
  async searchPosts(query: string, page: number = 1): Promise<BlogListResponse> {
    return await BlogRepository.searchPosts(query, page);
  }

  /**
   * Format date for display
   * @param dateString - ISO date string
   * @param locale - Locale code
   * @returns Formatted date string
   */
  formatDate(dateString: string, locale: string = 'en'): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  /**
   * Calculate reading time
   * @param content - Blog post content (HTML or plain text)
   * @returns Estimated reading time in minutes
   */
  calculateReadingTime(content: string): number {
    // Remove HTML tags and count words
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.trim().split(/\s+/).length;

    // Average reading speed: 200 words per minute
    const readingTime = Math.ceil(wordCount / 200);

    return readingTime;
  }
}

export default new BlogService();
