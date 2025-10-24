export enum PaymentStatus {
  PENDING = 'pending',
  AWAITING_CONFIRMATION = 'awaiting_confirmation',
  CONFIRMING = 'confirming',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum PeriodicityType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
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
  subscriptionPlanId: number;
  currencyCode: string; // Crypto currency code (e.g., 'BTC')
  amount: number; // Amount in USD cents
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
  periodicity: number;
  periodicity_type: PeriodicityType;
  features: string[];
}

export interface QuickTransactionConfig {
  amount: number;
  currencyCode: string; // Crypto currency code
  description: string;
  metadata?: Record<string, unknown>; // Additional data to send to backend
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

/**
 * Feature associated with a subscription plan
 */
export interface PlanFeature {
  id: number;
  name: string;
  consumable: boolean;
  quota: number | null;
  periodicity_type: PeriodicityType;
  periodicity: number;
  postpaid: boolean;
  created_at: string;
  updated_at: string;
  pivot?: {
    charges?: number;
  };
}

/**
 * Subscription plan with features
 */
export interface Plan {
  id: number;
  name: string;
  plan_group: string;
  price: number; // Price in cents
  periodicity_type: PeriodicityType;
  periodicity: number;
  grace_days: number;
  features: PlanFeature[];
  created_at: string;
  updated_at: string;
}

/**
 * Grouped plans by plan group (free, basic, premium, etc.)
 */
export interface GroupedPlans {
  group: string;
  plans: Plan[];
}

/**
 * Response from GET /subscription-plans
 */
export interface SubscriptionPlansResponse {
  data: Plan[];
  grouped: GroupedPlans[];
}

/**
 * User subscription
 */
export interface Subscription {
  id: number;
  plan: Plan;
  started_at: string;
  expired_at: string;
  canceled_at: string | null;
  grace_days_ended_at: string | null;
  suppressed_at: string | null;
  was_switched: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Checkout & Payment Types
 */

/**
 * Token that runs on a native cryptocurrency (e.g., USDT on Ethereum)
 */
export interface PaymentToken {
  code: string; // e.g., 'USDT_ERC20', 'USDC_ERC20'
  name: string; // e.g., 'Tether (ERC-20)', 'USD Coin (ERC-20)'
  is_token: true;
  min_amount: number;
  max_amount: number;
}

/**
 * Payment method from GET /checkout/payment-methods
 * Can be either a native cryptocurrency or have tokens
 */
export interface PaymentMethod {
  code: string; // e.g., 'BTC', 'ETH'
  name: string; // e.g., 'Bitcoin', 'Ethereum'
  is_token: boolean; // false for native crypto, true for tokens
  network?: string; // e.g., 'mainnet', 'ERC20' (deprecated, keeping for compatibility)
  required_confirmations?: number;
  min_amount: number;
  max_amount: number;
  tokens?: PaymentToken[]; // Tokens that can run on this network (e.g., USDT, USDC on ETH)
}

/**
 * Response from GET /checkout/payment-methods
 */
export interface PaymentMethodsResponse {
  data: PaymentMethod[];
  total: number;
}

/**
 * Payable item in checkout preview/confirmation
 */
export interface CheckoutPayable {
  type: string; // e.g., 'plan'
  id: number;
  name: string;
  price_cents: number;
  price_usd: number;
  interval?: string; // e.g., 'monthly', 'yearly'
}

/**
 * Crypto details in checkout preview/confirmation
 */
export interface CheckoutCryptoDetails {
  currency: string; // e.g., 'BTC'
  amount: string; // Crypto amount as string
  exchange_rate_cents: number;
  exchange_rate_usd: number;
}

/**
 * Payment details in checkout preview
 */
export interface CheckoutPaymentDetails {
  method: string; // e.g., 'crypto'
  amount_cents: number;
  amount_usd: number;
  crypto?: CheckoutCryptoDetails;
}

/**
 * Request body for POST /checkout/preview and POST /checkout/confirm
 */
export interface CheckoutRequest {
  payable_type: string; // e.g., 'plan'
  payable_id: number;
  payment_method: string; // e.g., 'crypto'
  options: {
    currency: string; // e.g., 'BTC'
  };
}

/**
 * Response from POST /checkout/preview
 */
export interface CheckoutPreviewResponse {
  payable: CheckoutPayable;
  payment: CheckoutPaymentDetails;
  preview_expires_in_seconds: number;
  message: string;
}

/**
 * Payment record from checkout confirmation
 */
export interface CheckoutPayment {
  id: string; // UUID
  user_id: string; // UUID
  payable_type: string;
  payable_id: number;
  payment_method: string;
  amount_cents: number;
  amount_usd: number;
  status: string; // 'pending', 'completed', 'expired', etc.
  expires_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at?: string;
}

/**
 * Crypto details for confirmed payment
 */
export interface ConfirmedCryptoDetails {
  currency: string;
  amount_crypto: string;
  payment_address: string;
  transaction_hash: string | null;
  exchange_rate_cents: number;
  exchange_rate_usd: number;
  required_confirmations: number;
  confirmations: number;
  status: string;
  confirmed_at: string | null;
}

/**
 * Payment instructions after confirmation
 */
export interface PaymentInstructions {
  message: string;
  expires_in_minutes: number;
  qr_code_data: string;
}

/**
 * Response from POST /checkout/confirm
 */
export interface CheckoutConfirmResponse {
  data: {
    payment_id: number;
  };
  payment?: CheckoutPayment;
  crypto_details?: ConfirmedCryptoDetails;
  instructions?: PaymentInstructions;
}

/**
 * Subscription details in completed payment
 */
export interface PaymentSubscription {
  id: number;
  status: string;
  started_at: string;
}

/**
 * Response from GET /checkout/payments/{id}
 */
export interface CheckoutPaymentStatusResponse {
  payment: CheckoutPayment;
  crypto_details: ConfirmedCryptoDetails;
  payable: CheckoutPayable;
  subscription?: PaymentSubscription;
}

/**
 * Payment status polling response (simplified for /checkout/payments/{id})
 * Used in payment status page
 * This is the ACTUAL response structure from the API
 */
export interface PaymentStatusPollResponse {
  payment_id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired' | 'cancelled';
  amount_cents: number;
  currency: string; // e.g., 'USD'
  payment_method: string;
  created_at: string;
  expires_at: string;
  completed_at: string | null;
  crypto?: {
    currency: string;
    network: string;
    amount: string;
    payment_address: string;
    exchange_rate_cents: number;
    transaction_hash: string | null;
    confirmations: number;
    min_confirmations: number; // When payment is confirmed for user (they get access)
    required_confirmations: number; // When transaction is final (irreversible)
    qr_code_svg: string;
    payment_uri: string;
    blockchain_url?: string;
  };
  subscription?: {
    id: number;
    status: string;
    started_at: string;
  };
  payable?: {
    type: string;
    id: number;
    name: string;
    price_cents: number;
    price_usd: number;
    interval?: string;
  };
}
