import apiClient from '@/lib/api/apiClient';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author?: {
    id: number;
    name: string;
    avatar?: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  views_count: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface BlogListResponse {
  data: BlogPost[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Blog Repository - Handles all blog-related API calls
 */
class BlogRepository {
  /**
   * Get all blog posts with pagination
   * @param page - Page number
   * @param perPage - Items per page
   * @param category - Filter by category slug
   * @returns Blog posts with pagination
   */
  async getAllPosts(page: number = 1, perPage: number = 12, category?: string): Promise<BlogListResponse> {
    const params: { page: number; per_page: number; category?: string } = { page, per_page: perPage };
    if (category) {
      params.category = category;
    }

    const response = await apiClient.get<BlogListResponse>('/blog', { params });
    return response.data;
  }

  /**
   * Get a single blog post by slug
   * @param slug - Blog post slug
   * @returns Blog post details
   */
  async getPostBySlug(slug: string): Promise<BlogPost> {
    const response = await apiClient.get<BlogPost>(`/blog/${slug}`);
    return response.data;
  }

  /**
   * Get featured/latest blog posts
   * @param limit - Number of posts to fetch
   * @returns Featured blog posts
   */
  async getFeaturedPosts(limit: number = 5): Promise<BlogPost[]> {
    const response = await apiClient.get<BlogPost[]>('/blog/featured', {
      params: { limit }
    });
    return response.data;
  }

  /**
   * Get blog categories
   * @returns List of blog categories
   */
  async getCategories(): Promise<Array<{ id: number; name: string; slug: string; posts_count: number }>> {
    const response = await apiClient.get('/blog/categories');
    return response.data;
  }

  /**
   * Search blog posts
   * @param query - Search query
   * @param page - Page number
   * @returns Search results
   */
  async searchPosts(query: string, page: number = 1): Promise<BlogListResponse> {
    const response = await apiClient.get<BlogListResponse>('/blog/search', {
      params: { q: query, page }
    });
    return response.data;
  }
}

const blogRepository = new BlogRepository();
export default blogRepository;
