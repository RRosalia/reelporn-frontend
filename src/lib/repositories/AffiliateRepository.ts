import apiClient from '@/lib/api/apiClient';
import type { AffiliateLeadData, AffiliateLeadResponse } from '@/types/Affiliate';

/**
 * Affiliate Repository - Handles all affiliate-related API calls
 */
class AffiliateRepository {
  /**
   * Register an affiliate click
   * @param {AffiliateLeadData} data - Contains the ref parameter
   * @returns {Promise<AffiliateLeadResponse>} Response data
   */
  async registerClick(data: AffiliateLeadData): Promise<AffiliateLeadResponse> {
    const response = await apiClient.post<AffiliateLeadResponse>('/affiliate/click', data);
    return response.data;
  }
}

const affiliateRepository = new AffiliateRepository();
export default affiliateRepository;
