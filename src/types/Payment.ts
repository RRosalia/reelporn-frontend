export enum PaymentStatus {
  PENDING = 'pending',
  AWAITING_CONFIRMATION = 'awaiting_confirmation',
  CONFIRMING = 'confirming',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

/**
 * Cryptocurrency configuration from backend
 */
export interface CryptoCurrency {
  code: string; // e.g., 'BTC', 'ETH', 'USDT'
  name: string; // e.g., 'Bitcoin', 'Ethereum'
  symbol: string; // e.g., '₿', 'Ξ'
  icon?: string; // URL to icon image
  decimals: number; // Number of decimal places
  enabled: boolean; // Whether this currency is currently enabled
  minAmount?: number; // Minimum transaction amount
  maxAmount?: number; // Maximum transaction amount
  network?: string; // e.g., 'mainnet', 'ERC20', 'TRC20'
}

/**
 * Crypto price information
 */
export interface CryptoPrice {
  code: string; // Currency code (matches CryptoCurrency.code)
  priceUSD: number; // Current price in USD
  lastUpdated: string; // ISO timestamp
}

export interface CryptoPaymentRequest {
  subscriptionPlanId: string;
  currencyCode: string; // Crypto currency code (e.g., 'BTC')
  amount: number; // Amount in USD
  amountCrypto: string; // Amount in cryptocurrency
  walletAddress: string; // Backend-generated wallet address
  userId?: string;
}

export interface CryptoPaymentResponse {
  transactionId: string;
  paymentAddress: string; // Address to send crypto to
  amount: string; // USD amount
  amountCrypto: string; // Crypto amount
  currencyCode: string; // Crypto currency code
  currency: CryptoCurrency; // Full currency details
  qrCode: string; // Base64 QR code or URL
  expiresAt: string; // ISO timestamp
  status: PaymentStatus;
  confirmationsRequired: number;
  currentConfirmations: number;
  networkFee?: string; // Estimated network fee
}

export interface PaymentStatusUpdate {
  transactionId: string;
  status: PaymentStatus;
  confirmations: number;
  confirmationsRequired: number;
  completedAt?: string;
  txHash?: string; // Blockchain transaction hash
  explorerUrl?: string; // URL to view transaction on blockchain explorer
  message?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: string[];
}

export interface QuickTransactionConfig {
  amount: number;
  currencyCode: string; // Crypto currency code
  description: string;
  metadata?: Record<string, any>; // Additional data to send to backend
  onSuccess?: (transactionId: string) => void;
  onCancel?: () => void;
  onError?: (error: string) => void;
}

export interface PaymentContextType {
  currentPayment: CryptoPaymentResponse | null;
  paymentStatus: PaymentStatus;
  isProcessing: boolean;
  supportedCurrencies: CryptoCurrency[];
  cryptoPrices: CryptoPrice[];
  initializePayment: (request: CryptoPaymentRequest) => Promise<CryptoPaymentResponse>;
  cancelPayment: (transactionId: string) => Promise<void>;
  checkPaymentStatus: (transactionId: string) => Promise<PaymentStatusUpdate>;
  loadSupportedCurrencies: () => Promise<void>;
  loadCryptoPrices: () => Promise<void>;
}
