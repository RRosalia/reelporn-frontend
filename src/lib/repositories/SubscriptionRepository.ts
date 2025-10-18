import apiClient from '@/lib/api/apiClient';

/**
 * Subscription Repository - Handles all subscription-related API calls
 */
class SubscriptionRepository {
  /**
   * Get all subscription plans with their features
   * @returns {Promise<any>} Response data containing subscription plans
   */
  async getSubscriptionPlans(): Promise<any> {
    const response = await apiClient.get('/subscription-plans');
    return response.data;
  }
}

export default new SubscriptionRepository();
