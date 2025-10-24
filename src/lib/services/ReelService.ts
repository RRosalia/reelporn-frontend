import ReelRepository from '@/lib/repositories/ReelRepository';
import type { Reel } from '@/types/Reel';

/**
 * ReelService
 * Business logic layer for reels/videos
 */
class ReelService {
  /**
   * Get all videos
   * @returns {Promise<Reel[]>}
   */
  async getAllVideos(): Promise<Reel[]> {
    return await ReelRepository.getAll();
  }

  /**
   * Get trending videos
   * @returns {Promise<Reel[]>}
   */
  async getTrendingVideos(): Promise<Reel[]> {
    return await ReelRepository.getTrending();
  }

  /**
   * Get new videos
   * @returns {Promise<Reel[]>}
   */
  async getNewVideos(): Promise<Reel[]> {
    return await ReelRepository.getNew();
  }

  /**
   * Get popular videos
   * @returns {Promise<Reel[]>}
   */
  async getPopularVideos(): Promise<Reel[]> {
    return await ReelRepository.getPopular();
  }

  /**
   * Get featured videos
   * @returns {Promise<Reel[]>}
   */
  async getFeaturedVideos(): Promise<Reel[]> {
    return await ReelRepository.getFeatured();
  }

  /**
   * Get a single video by ID
   * @param {number} id - Video ID
   * @returns {Promise<Reel>}
   */
  async getVideoById(id: number): Promise<Reel> {
    return await ReelRepository.getById(id);
  }

  /**
   * Get a single video by slug
   * @param {string} slug - Video slug
   * @returns {Promise<Reel>}
   */
  async getVideoBySlug(slug: string): Promise<Reel> {
    return await ReelRepository.getBySlug(slug);
  }

  /**
   * Get videos by category
   * @param {string} category - Category key (trending, new, popular, etc.)
   * @returns {Promise<Reel[]>}
   */
  async getVideosByCategory(category: string): Promise<Reel[]> {
    switch (category) {
      case 'trending':
        return await this.getTrendingVideos();
      case 'new':
        return await this.getNewVideos();
      case 'popular':
        return await this.getPopularVideos();
      case 'featured':
        return await this.getFeaturedVideos();
      default:
        return await this.getAllVideos();
    }
  }
}

const reelService = new ReelService();
export default reelService;
