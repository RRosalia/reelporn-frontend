import apiClient from '@/lib/api/apiClient';
import { PaginatedResponse } from '@/lib/types/PaginatedResponse';

/**
 * CategoryRepository
 * Handles all API calls related to categories
 */
class CategoryRepository {
  /**
   * Get all categories with pagination
   * @param {number} page - Page number
   * @param {number} perPage - Items per page
   * @returns {Promise<PaginatedResponse>}
   */
  async getAll(page: number = 1, perPage: number = 15): Promise<PaginatedResponse> {
    try {
      const response = await apiClient.get('/categories', {
        params: { page, per_page: perPage }
      });
      return new PaginatedResponse(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get a single category by slug
   * @param {string} slug - Category slug
   * @returns {Promise<any>}
   */
  async getBySlug(slug: string): Promise<any> {
    try {
      const response = await apiClient.get(`/categories/${slug}`);
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
   * @returns {Promise<PaginatedResponse>}
   */
  async getVideos(slug: string, page: number = 1, perPage: number = 15): Promise<PaginatedResponse> {
    try {
      const response = await apiClient.get(`/categories/${slug}/videos`, {
        params: { page, per_page: perPage }
      });
      return new PaginatedResponse(response.data);
    } catch (error) {
      console.error(`Error fetching videos for category ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Search categories
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @returns {Promise<PaginatedResponse>}
   */
  async search(query: string, page: number = 1): Promise<PaginatedResponse> {
    try {
      const response = await apiClient.get('/categories/search', {
        params: { q: query, page }
      });
      return new PaginatedResponse(response.data);
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
  }

  /**
   * Get categories sitemap data
   * @returns {Promise<Array<{slug: string, last_modified: string}>>}
   */
  async getSitemapData(): Promise<Array<{slug: string, last_modified: string}>> {
    try {
      const response = await apiClient.get('/internal/sitemaps/categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching categories sitemap data:', error);
      throw error;
    }
  }
}

export default new CategoryRepository();
