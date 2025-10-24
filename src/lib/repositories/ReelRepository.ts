import apiClient from '@/lib/api/apiClient';
import { Reel, ReelApiResponse, transformReelApiResponse } from '@/types/Reel';

/**
 * API Response wrapper for list endpoints
 */
interface ApiListResponse {
  data: ReelApiResponse[];
}

/**
 * ReelRepository
 * Handles all API calls related to reels/shorts
 */
class ReelRepository {

  /**
   * Get a single reel by ID
   * @param {number} id - Reel ID
   * @returns {Promise<Reel>}
   */
  async getById(id: number): Promise<Reel> {
    try {
      const response = await apiClient.get<ReelApiResponse>(`/reels/${id}`);
      return transformReelApiResponse(response.data);
    } catch (error) {
      console.error(`Error fetching reel ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get a single reel by slug
   * @param {string} slug - Reel slug
   * @returns {Promise<Reel>}
   */
  async getBySlug(slug: string): Promise<Reel> {
    try {
      const response = await apiClient.get<ReelApiResponse>(`/reels/slug/${slug}`);
      return transformReelApiResponse(response.data);
    } catch (error) {
      console.error(`Error fetching reel by slug ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Get all videos
   * @returns {Promise<Reel[]>}
   */
  async getAll(): Promise<Reel[]> {
    try {
      const response = await apiClient.get<ApiListResponse>('/videos');
      return response.data.data.map(transformReelApiResponse);
    } catch (error) {
      console.error('Error fetching all videos:', error);
      throw error;
    }
  }

  /**
   * Get trending videos
   * @returns {Promise<Reel[]>}
   */
  async getTrending(): Promise<Reel[]> {
    try {
      const response = await apiClient.get<ApiListResponse>('/videos/trending');
      return response.data.data.map(transformReelApiResponse);
    } catch (error) {
      console.error('Error fetching trending videos:', error);
      throw error;
    }
  }

  /**
   * Get new videos
   * @returns {Promise<Reel[]>}
   */
  async getNew(): Promise<Reel[]> {
    try {
      const response = await apiClient.get<ApiListResponse>('/videos/new');
      return response.data.data.map(transformReelApiResponse);
    } catch (error) {
      console.error('Error fetching new videos:', error);
      throw error;
    }
  }

  /**
   * Get popular videos
   * @returns {Promise<Reel[]>}
   */
  async getPopular(): Promise<Reel[]> {
    try {
      const response = await apiClient.get<ApiListResponse>('/videos/popular');
      return response.data.data.map(transformReelApiResponse);
    } catch (error) {
      console.error('Error fetching popular videos:', error);
      throw error;
    }
  }

  /**
   * Get featured videos
   * @returns {Promise<Reel[]>}
   */
  async getFeatured(): Promise<Reel[]> {
    try {
      const response = await apiClient.get<ApiListResponse>('/videos/featured');
      return response.data.data.map(transformReelApiResponse);
    } catch (error) {
      console.error('Error fetching featured videos:', error);
      throw error;
    }
  }
}

const reelRepository = new ReelRepository();
export default reelRepository;
