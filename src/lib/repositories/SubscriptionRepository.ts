import apiClient from '@/lib/api/apiClient';
import { PeriodicityType, SubscriptionPlansResponse, Subscription } from '@/types/Payment';

/**
 * Subscription Repository - Handles all subscription-related API calls
 */
class SubscriptionRepository {
  /**
   * Get all subscription plans with their features
   * Returns both flat data array and grouped plans by plan_group
   * @param {PeriodicityType} periodicityType - Optional filter by periodicity type
   * @returns {Promise<SubscriptionPlansResponse>} Response data containing subscription plans (data array and grouped object)
   */
  async getSubscriptionPlans(periodicityType?: PeriodicityType): Promise<SubscriptionPlansResponse> {
    const params = periodicityType ? { periodicity_type: periodicityType } : {};
    const response = await apiClient.get('/subscription-plans', { params });
    return response.data;
  }

  /**
   * Get all subscriptions for the authenticated user
   * @returns {Promise<{data: Subscription[]}>} Response data containing user's subscriptions
   */
  async getUserSubscriptions(): Promise<{ data: Subscription[] }> {
    const response = await apiClient.get('/account/subscriptions');
    return response.data;
  }

  /**
   * Get the current active subscription for the authenticated user
   * @returns {Promise<{data: Subscription}>} Response data containing current subscription or 404 if none active
   */
  async getCurrentSubscription(): Promise<{ data: Subscription }> {
    const response = await apiClient.get('/account/subscription/current');
    return response.data;
  }

  /**
   * Cancel a subscription by ID
   * @param {number} subscriptionId - The ID of the subscription to cancel
   * @returns {Promise<{data: Subscription}>} Response data containing the canceled subscription
   */
  async cancelSubscription(subscriptionId: number): Promise<{ data: Subscription }> {
    const response = await apiClient.post(`/account/subscriptions/${subscriptionId}/cancel`);
    return response.data;
  }
}

export default new SubscriptionRepository();
