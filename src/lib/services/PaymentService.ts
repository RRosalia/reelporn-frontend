import PaymentRepository from '@/lib/repositories/PaymentRepository';
import type {
  CryptoPaymentRequest,
  CryptoPaymentResponse,
  PaymentStatusUpdate,
  CryptoPrice,
  CryptoCurrency,
} from '@/types/Payment';

/**
 * Payment Service - Business logic for crypto payments
 */
class PaymentService {
  /**
   * Get all supported cryptocurrencies from backend
   * @returns {Promise<CryptoCurrency[]>} List of enabled cryptocurrencies
   */
  async getSupportedCurrencies(): Promise<CryptoCurrency[]> {
    const currencies = await PaymentRepository.getSupportedCurrencies();
    return currencies.filter((c) => c.enabled);
  }

  /**
   * Get current prices for all supported cryptocurrencies
   * @returns {Promise<CryptoPrice[]>} List of crypto prices with USD conversion
   */
  async getCryptoPrices(): Promise<CryptoPrice[]> {
    return await PaymentRepository.getCryptoPrices();
  }

  /**
   * Calculate crypto amount based on USD price
   * @param {number} usdAmount - Amount in USD
   * @param {CryptoPrice[]} prices - Current crypto prices
   * @param {string} currencyCode - Target cryptocurrency code
   * @param {number} decimals - Number of decimal places
   * @returns {string} Amount in cryptocurrency
   */
  calculateCryptoAmount(
    usdAmount: number,
    prices: CryptoPrice[],
    currencyCode: string,
    decimals: number = 8
  ): string {
    const price = prices.find((p) => p.code === currencyCode);
    if (!price) {
      throw new Error(`Price not found for ${currencyCode}`);
    }

    const cryptoAmount = usdAmount / price.priceUSD;
    return cryptoAmount.toFixed(decimals);
  }

  /**
   * Initiate a new crypto payment
   * @param {CryptoPaymentRequest} request - Payment request data
   * @returns {Promise<CryptoPaymentResponse>} Payment details with wallet address
   */
  async initiatePayment(
    request: CryptoPaymentRequest
  ): Promise<CryptoPaymentResponse> {
    return await PaymentRepository.initiateCryptoPayment(request);
  }

  /**
   * Check the current status of a payment
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<PaymentStatusUpdate>} Current payment status
   */
  async checkPaymentStatus(transactionId: string): Promise<PaymentStatusUpdate> {
    return await PaymentRepository.getPaymentStatus(transactionId);
  }

  /**
   * Cancel an ongoing payment
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<void>}
   */
  async cancelPayment(transactionId: string): Promise<void> {
    return await PaymentRepository.cancelPayment(transactionId);
  }

  /**
   * Verify payment completion
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<PaymentStatusUpdate>} Final verification status
   */
  async verifyPayment(transactionId: string): Promise<PaymentStatusUpdate> {
    return await PaymentRepository.verifyPayment(transactionId);
  }

  /**
   * Get user's payment history
   * @returns {Promise<CryptoPaymentResponse[]>} List of past payments
   */
  async getPaymentHistory(): Promise<CryptoPaymentResponse[]> {
    return await PaymentRepository.getPaymentHistory();
  }

  /**
   * Format crypto amount for display
   * @param {string} amount - Crypto amount
   * @param {CryptoCurrency} currency - Cryptocurrency
   * @returns {string} Formatted amount with symbol
   */
  formatCryptoAmount(amount: string, currency: CryptoCurrency): string {
    const numAmount = parseFloat(amount);
    const decimals = currency.decimals || 8;
    const displayDecimals = numAmount < 0.01 ? decimals : numAmount < 1 ? 6 : 4;
    return `${numAmount.toFixed(displayDecimals)} ${currency.code}`;
  }

  /**
   * Validate if amount is within currency limits
   * @param {number} amount - Amount to validate
   * @param {CryptoCurrency} currency - Cryptocurrency
   * @returns {boolean} Whether amount is valid
   */
  isAmountValid(amount: number, currency: CryptoCurrency): boolean {
    if (currency.minAmount && amount < currency.minAmount) {
      return false;
    }
    if (currency.maxAmount && amount > currency.maxAmount) {
      return false;
    }
    return true;
  }

  /**
   * Get validation error message for amount
   * @param {number} amount - Amount to validate
   * @param {CryptoCurrency} currency - Cryptocurrency
   * @returns {string | null} Error message or null if valid
   */
  getAmountValidationError(amount: number, currency: CryptoCurrency): string | null {
    if (currency.minAmount && amount < currency.minAmount) {
      return `Minimum amount is ${currency.minAmount} USD`;
    }
    if (currency.maxAmount && amount > currency.maxAmount) {
      return `Maximum amount is ${currency.maxAmount} USD`;
    }
    return null;
  }
}

export default new PaymentService();
