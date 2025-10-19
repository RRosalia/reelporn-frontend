import apiClient from '@/lib/api/apiClient';
import { Reel, ReelApiResponse, transformReelApiResponse } from '@/types/Reel';
import { getMockVideoBySlug } from '@/lib/mocks/videoMockData';

/**
 * ReelRepository
 * Handles all API calls related to reels/shorts
 */
class ReelRepository {
  // Toggle this to switch between mock and real API
  private useMockData = true;

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
    // Use mock data for testing
    if (this.useMockData) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const mockVideo = getMockVideoBySlug(slug);

          if (mockVideo) {
            resolve(transformReelApiResponse(mockVideo));
          } else {
            // Simulate 404 error
            const error: any = new Error('Video not found');
            error.response = { status: 404 };
            reject(error);
          }
        }, 500); // Simulate network delay
      });
    }

    // Real API call
    try {
      const response = await apiClient.get<ReelApiResponse>(`/reels/slug/${slug}`);
      return transformReelApiResponse(response.data);
    } catch (error) {
      console.error(`Error fetching reel by slug ${slug}:`, error);
      throw error;
    }
  }
}

export default new ReelRepository();
