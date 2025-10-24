import apiClient from '@/lib/api/apiClient';
import { PaginatedResponse } from '@/lib/types/PaginatedResponse';
import type {
  Category,
  CategoryResponse,
  CategoriesResponse,
  CategorySitemapData,
  CategorySitemapResponse
} from '@/types/Category';
import type { Reel } from '@/types/Reel';

/**
 * CategoryRepository
 * Handles all API calls related to categories
 */
class CategoryRepository {
  /**
   * Get all categories with pagination
   * @param {number} page - Page number
   * @param {number} perPage - Items per page
   * @returns {Promise<PaginatedResponse<Category>>}
   */
  async getAll(page: number = 1, perPage: number = 15): Promise<PaginatedResponse<Category>> {
    try {
      const response = await apiClient.get<CategoriesResponse>('/categories', {
        params: { page, per_page: perPage }
      });
      return new PaginatedResponse<Category>(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get a single category by slug
   * @param {string} slug - Category slug
   * @returns {Promise<CategoryResponse>}
   */
  async getBySlug(slug: string): Promise<CategoryResponse> {
    try {
      const response = await apiClient.get<CategoryResponse>(`/categories/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Get videos for a specific category
   * @param {string} slug - Category slug
   * @param {number} page - Page number
   * @param {number} perPage - Items per page
   * @returns {Promise<PaginatedResponse<Reel>>}
   */
  async getVideos(slug: string, page: number = 1, perPage: number = 15): Promise<PaginatedResponse<Reel>> {
    try {
      const response = await apiClient.get(`/categories/${slug}/videos`, {
        params: { page, per_page: perPage }
      });
      return new PaginatedResponse<Reel>(response.data);
    } catch (error) {
      console.error(`Error fetching videos for category ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Search categories
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @returns {Promise<PaginatedResponse<Category>>}
   */
  async search(query: string, page: number = 1): Promise<PaginatedResponse<Category>> {
    try {
      const response = await apiClient.get<CategoriesResponse>('/categories/search', {
        params: { q: query, page }
      });
      return new PaginatedResponse<Category>(response.data);
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
  }

  /**
   * Get categories sitemap data
   * @returns {Promise<CategorySitemapData[]>}
   */
  async getSitemapData(): Promise<CategorySitemapData[]> {
    try {
      const response = await apiClient.get<CategorySitemapResponse>('/internal/sitemaps/categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching categories sitemap data:', error);
      throw error;
    }
  }
}

const categoryRepository = new CategoryRepository();
export default categoryRepository;
