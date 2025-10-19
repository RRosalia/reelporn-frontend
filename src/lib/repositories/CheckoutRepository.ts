import apiClient from '@/lib/api/apiClient';
import {
  PaymentMethodsResponse,
  CheckoutRequest,
  CheckoutPreviewResponse,
  CheckoutConfirmResponse,
  CheckoutPaymentStatusResponse,
  PaymentStatusPollResponse,
} from '@/types/Payment';

/**
 * Checkout Repository - Handles all checkout and payment-related API calls
 */
class CheckoutRepository {
  /**
   * Get all available payment methods
   * @returns {Promise<PaymentMethodsResponse>} Response data containing available payment methods
   */
  async getPaymentMethods(): Promise<PaymentMethodsResponse> {
    const response = await apiClient.get('/checkout/payment-methods');
    return response.data;
  }

  /**
   * Preview payment details before confirming (no payment record created)
   * @param {CheckoutRequest} request - Checkout request details
   * @returns {Promise<CheckoutPreviewResponse>} Preview of payment details
   */
  async previewCheckout(request: CheckoutRequest): Promise<CheckoutPreviewResponse> {
    const response = await apiClient.post('/checkout/preview', request);
    return response.data;
  }

  /**
   * Confirm and create actual payment (generates crypto address or payment URL)
   * @param {CheckoutRequest} request - Checkout request details
   * @returns {Promise<CheckoutConfirmResponse>} Payment confirmation with crypto details
   */
  async confirmCheckout(request: CheckoutRequest): Promise<CheckoutConfirmResponse> {
    const response = await apiClient.post('/checkout/confirm', request);
    return response.data;
  }

  /**
   * Get payment status and details
   * @param {string} paymentId - Payment UUID
   * @returns {Promise<PaymentStatusPollResponse>} Current payment status and details
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusPollResponse> {
    const response = await apiClient.get(`/checkout/payments/${paymentId}`);
    return response.data.data; // API returns { data: { payment_id, status, ... } }
  }
}

export default new CheckoutRepository();
