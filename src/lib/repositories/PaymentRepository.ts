import apiClient from '@/lib/api/apiClient';
import type {
  CryptoPaymentRequest,
  CryptoPaymentResponse,
  PaymentStatusUpdate,
  CryptoPrice,
  CryptoCurrency,
} from '@/types/Payment';

/**
 * Payment Repository - Handles all crypto payment-related API calls
 */
class PaymentRepository {
  /**
   * Get all supported cryptocurrencies from backend
   * @returns {Promise<CryptoCurrency[]>} List of supported cryptocurrencies with configurations
   */
  async getSupportedCurrencies(): Promise<CryptoCurrency[]> {
    const response = await apiClient.get('/payment-methods/crypto/currencies');
    return response.data;
  }

  /**
   * Get current crypto prices for all supported currencies
   * @returns {Promise<CryptoPrice[]>} List of crypto prices
   */
  async getCryptoPrices(): Promise<CryptoPrice[]> {
    const response = await apiClient.get('/payment-methods/crypto/prices');
    return response.data;
  }

  /**
   * Initialize a crypto payment transaction
   * @param {CryptoPaymentRequest} request - Payment request data
   * @returns {Promise<CryptoPaymentResponse>} Payment response with wallet address and QR code
   */
  async initiateCryptoPayment(
    request: CryptoPaymentRequest
  ): Promise<CryptoPaymentResponse> {
    const response = await apiClient.post('/payment-methods/crypto/payments/initiate', request);
    return response.data;
  }

  /**
   * Get payment status by transaction ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<PaymentStatusUpdate>} Current payment status
   */
  async getPaymentStatus(transactionId: string): Promise<PaymentStatusUpdate> {
    const response = await apiClient.get(`/payment-methods/crypto/payments/${transactionId}/status`);
    return response.data;
  }

  /**
   * Cancel a pending payment
   * @param {string} transactionId - Transaction ID to cancel
   * @returns {Promise<void>}
   */
  async cancelPayment(transactionId: string): Promise<void> {
    await apiClient.post(`/payment-methods/crypto/payments/${transactionId}/cancel`);
  }

  /**
   * Verify payment completion
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<PaymentStatusUpdate>} Final payment status
   */
  async verifyPayment(transactionId: string): Promise<PaymentStatusUpdate> {
    const response = await apiClient.post(`/payment-methods/crypto/payments/${transactionId}/verify`);
    return response.data;
  }

  /**
   * Get payment history for the current user
   * @returns {Promise<CryptoPaymentResponse[]>} List of past payments
   */
  async getPaymentHistory(): Promise<CryptoPaymentResponse[]> {
    const response = await apiClient.get('/payment-methods/crypto/payments/history');
    return response.data;
  }
}

const paymentRepository = new PaymentRepository();
export default paymentRepository;
