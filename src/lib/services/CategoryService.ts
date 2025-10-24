import CategoryRepository from '@/lib/repositories/CategoryRepository';
import { PaginatedResponse } from '@/lib/types/PaginatedResponse';
import type { Category, CategoryResponse } from '@/types/Category';
import type { Reel } from '@/types/Reel';

interface FormattedCategory {
  id: number;
  slug: string;
  name: string;
  description?: string;
  videosCount: number;
  thumbnail: string | null;
}

/**
 * CategoryService
 * Business logic layer for categories
 */
class CategoryService {
  /**
   * Get all categories
   * @param {number} page - Page number
   * @param {number} perPage - Items per page
   * @returns {Promise<PaginatedResponse<Category>>}
   */
  async getAllCategories(page: number = 1, perPage: number = 15): Promise<PaginatedResponse<Category>> {
    return await CategoryRepository.getAll(page, perPage);
  }

  /**
   * Get category details by slug
   * @param {string} slug - Category slug
   * @returns {Promise<CategoryResponse>}
   */
  async getCategoryBySlug(slug: string): Promise<CategoryResponse> {
    return await CategoryRepository.getBySlug(slug);
  }

  /**
   * Get videos for a category
   * @param {string} slug - Category slug
   * @param {number} page - Page number
   * @param {number} perPage - Items per page
   * @returns {Promise<PaginatedResponse<Reel>>}
   */
  async getCategoryVideos(slug: string, page: number = 1, perPage: number = 15): Promise<PaginatedResponse<Reel>> {
    return await CategoryRepository.getVideos(slug, page, perPage);
  }

  /**
   * Search categories by name or description
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @returns {Promise<PaginatedResponse<Category>>}
   */
  async searchCategories(query: string, page: number = 1): Promise<PaginatedResponse<Category>> {
    if (!query || query.trim() === '') {
      return await this.getAllCategories(page);
    }
    return await CategoryRepository.search(query, page);
  }

  /**
   * Format category for display
   * @param {Category} category - Raw category object
   * @returns {FormattedCategory}
   */
  formatCategory(category: Category): FormattedCategory {
    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      videosCount: category.video_count || 0,
      thumbnail: category.thumbnail || null,
    };
  }

  /**
   * Format multiple categories
   * @param {Category[]} categories - Array of raw category objects
   * @returns {FormattedCategory[]}
   */
  formatCategories(categories: Category[]): FormattedCategory[] {
    return categories.map(category => this.formatCategory(category));
  }
}

const categoryService = new CategoryService();
export default categoryService;
