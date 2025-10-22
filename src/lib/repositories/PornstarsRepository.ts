import apiClient from '@/lib/api/apiClient';
import { PaginatedResponse } from '@/lib/types/PaginatedResponse';
import { Pornstar, PornstarFilters, FilterCountry, HeightRange, WeightRange, FilterOption } from '@/types/Pornstar';

/**
 * PornstarsRepository
 * Handles all API calls related to pornstars
 */
class PornstarsRepository {
  /**
   * Get all pornstars with optional filters and pagination
   * @param {PornstarFilters} filters - Filter parameters
   * @returns {Promise<PaginatedResponse<Pornstar>>}
   */
  async getAll(filters: PornstarFilters = {}): Promise<PaginatedResponse<Pornstar>> {
    try {
      // Sort parameters alphabetically as required by API
      const sortedParams: Record<string, any> = {};
      const keys = Object.keys(filters).sort();
      keys.forEach(key => {
        const value = filters[key as keyof PornstarFilters];
        if (value !== undefined && value !== null && value !== '') {
          sortedParams[key] = value;
        }
      });

      const response = await apiClient.get('/pornstars', {
        params: sortedParams
      });
      return new PaginatedResponse<Pornstar>(response.data);
    } catch (error) {
      console.error('Error fetching pornstars:', error);
      throw error;
    }
  }

  /**
   * Get a single pornstar by slug
   * @param {string} slug - Pornstar slug
   * @returns {Promise<Pornstar>}
   */
  async getBySlug(slug: string): Promise<Pornstar> {
    try {
      const response = await apiClient.get(`/pornstars/${slug}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching pornstar ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Get list of countries with pornstars
   * @returns {Promise<FilterCountry[]>}
   */
  async getFilterCountries(): Promise<FilterCountry[]> {
    try {
      const response = await apiClient.get('/pornstars/filters/countries');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching filter countries:', error);
      throw error;
    }
  }

  /**
   * Get height range
   * @returns {Promise<HeightRange>}
   */
  async getFilterHeights(): Promise<HeightRange> {
    try {
      const response = await apiClient.get('/pornstars/filters/heights');
      return response.data.data || { min: 100, max: 250 };
    } catch (error) {
      console.error('Error fetching filter heights:', error);
      throw error;
    }
  }

  /**
   * Get weight range
   * @returns {Promise<WeightRange>}
   */
  async getFilterWeights(): Promise<WeightRange> {
    try {
      const response = await apiClient.get('/pornstars/filters/weights');
      return response.data.data || { min: 30, max: 200 };
    } catch (error) {
      console.error('Error fetching filter weights:', error);
      throw error;
    }
  }

  /**
   * Get list of hair colors
   * @returns {Promise<FilterOption[]>}
   */
  async getFilterHairColors(): Promise<FilterOption[]> {
    try {
      const response = await apiClient.get('/pornstars/filters/hair-colors');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching filter hair colors:', error);
      throw error;
    }
  }

  /**
   * Get list of eye colors
   * @returns {Promise<FilterOption[]>}
   */
  async getFilterEyeColors(): Promise<FilterOption[]> {
    try {
      const response = await apiClient.get('/pornstars/filters/eye-colors');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching filter eye colors:', error);
      throw error;
    }
  }

  /**
   * Get list of ethnicities
   * @returns {Promise<FilterOption[]>}
   */
  async getFilterEthnicities(): Promise<FilterOption[]> {
    try {
      const response = await apiClient.get('/pornstars/filters/ethnicities');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching filter ethnicities:', error);
      throw error;
    }
  }

  /**
   * Get pornstars sitemap data
   * @returns {Promise<Array<{slug: string, last_modified: string}>>}
   */
  async getSitemapData(): Promise<Array<{slug: string, last_modified: string}>> {
    try {
      const response = await apiClient.get('/internal/sitemaps/pornstars');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching pornstars sitemap data:', error);
      throw error;
    }
  }

  /**
   * Get related pornstars by slug
   * @param {string} slug - Pornstar slug
   * @returns {Promise<Pornstar[]>}
   */
  async getRelated(slug: string): Promise<Pornstar[]> {
    try {
      const response = await apiClient.get(`/pornstars/${slug}/related`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching related pornstars for ${slug}:`, error);
      throw error;
    }
  }
}

const pornstarsRepository = new PornstarsRepository();
export default pornstarsRepository;
