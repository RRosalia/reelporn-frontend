import PornstarsRepository from '@/lib/repositories/PornstarsRepository';
import type { Pornstar, PornstarFilters } from '@/types/Pornstar';
import type { PaginatedResponse } from '@/lib/types/PaginatedResponse';

/**
 * PornstarService
 * Business logic layer for pornstars
 */
class PornstarService {
  /**
   * Get all pornstars with optional filters and pagination
   * @param {PornstarFilters} filters - Filter parameters
   * @returns {Promise<PaginatedResponse<Pornstar>>}
   */
  async getAll(filters: PornstarFilters = {}): Promise<PaginatedResponse<Pornstar>> {
    return await PornstarsRepository.getAll(filters);
  }

  /**
   * Get a single pornstar by slug
   * @param {string} slug - Pornstar slug
   * @returns {Promise<Pornstar>}
   */
  async getBySlug(slug: string): Promise<Pornstar> {
    return await PornstarsRepository.getBySlug(slug);
  }

  /**
   * Get related pornstars by slug
   * @param {string} slug - Pornstar slug
   * @returns {Promise<Pornstar[]>}
   */
  async getRelated(slug: string): Promise<Pornstar[]> {
    return await PornstarsRepository.getRelated(slug);
  }

  /**
   * Get featured pornstars for homepage (limited to 12)
   * @returns {Promise<Pornstar[]>}
   */
  async getFeatured(): Promise<Pornstar[]> {
    const response = await this.getAll({ per_page: 12, page: 1 });
    return response.getData();
  }

  /**
   * Get filter countries
   * @returns {Promise<any>}
   */
  async getFilterCountries() {
    return await PornstarsRepository.getFilterCountries();
  }

  /**
   * Get filter heights
   * @returns {Promise<any>}
   */
  async getFilterHeights() {
    return await PornstarsRepository.getFilterHeights();
  }

  /**
   * Get filter weights
   * @returns {Promise<any>}
   */
  async getFilterWeights() {
    return await PornstarsRepository.getFilterWeights();
  }

  /**
   * Get filter hair colors
   * @returns {Promise<any>}
   */
  async getFilterHairColors() {
    return await PornstarsRepository.getFilterHairColors();
  }

  /**
   * Get filter eye colors
   * @returns {Promise<any>}
   */
  async getFilterEyeColors() {
    return await PornstarsRepository.getFilterEyeColors();
  }

  /**
   * Get filter ethnicities
   * @returns {Promise<any>}
   */
  async getFilterEthnicities() {
    return await PornstarsRepository.getFilterEthnicities();
  }

  /**
   * Get pornstars sitemap data
   * @returns {Promise<Array<{slug: string, last_modified: string}>>}
   */
  async getSitemapData(): Promise<Array<{slug: string, last_modified: string}>> {
    return await PornstarsRepository.getSitemapData();
  }
}

const pornstarService = new PornstarService();
export default pornstarService;
