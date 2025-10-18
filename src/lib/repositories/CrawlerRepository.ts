import apiClient from '@/lib/api/apiClient';

/**
 * Crawler Repository - Handles crawler/bot detection API calls
 */
class CrawlerRepository {
  /**
   * Check if a specific IP is a known crawler
   * @param {string} ip - IP address to check
   * @returns Promise with boolean indicating if IP is a crawler
   * Backend returns 200 if crawler, 404 if not
   */
  async isCrawlerIP(ip: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`/api/crawlers/${ip}/check`);
      return response.status === 200;
    } catch (error: any) {
      // Backend returns 404 for non-crawlers
      if (error.response?.status === 404) {
        return false;
      }
      console.error('Failed to check crawler IP:', error);
      return false;
    }
  }
}

export default new CrawlerRepository();
