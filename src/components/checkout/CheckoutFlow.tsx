'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import CheckoutRepository from '@/lib/repositories/CheckoutRepository';
import {
  PaymentMethod,
  CheckoutPreviewResponse,
  CheckoutConfirmResponse,
  CheckoutPaymentStatusResponse,
} from '@/types/Payment';
import './checkout.css';

interface CheckoutFlowProps {
  payableType: string; // e.g., 'plan'
  payableId: number;
  onSuccess?: (subscription?: any) => void;
  onCancel?: () => void;
}

type CheckoutStep = 'selection' | 'payment' | 'status';

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  payableType,
  payableId,
  onSuccess,
  onCancel,
}) => {
  const t = useTranslations();

  // State management
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('selection');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null); // Selected native crypto
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null); // Code to use (native or token)
  const [preview, setPreview] = useState<CheckoutPreviewResponse | null>(null);
  const [confirmedPayment, setConfirmedPayment] = useState<CheckoutConfirmResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<CheckoutPaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [previewTimeRemaining, setPreviewTimeRemaining] = useState<number>(300); // 5 minutes in seconds
  const [previewExpired, setPreviewExpired] = useState(false);

  // Fetch payment methods on mount
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await CheckoutRepository.getPaymentMethods();
        setPaymentMethods(response.data);
      } catch (err) {
        console.error('Error fetching payment methods:', err);
        setError(err instanceof Error ? err.message : 'Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  // Poll payment status when payment is confirmed
  useEffect(() => {
    if (currentStep === 'status' && confirmedPayment) {
      const pollStatus = async () => {
        try {
          const status = await CheckoutRepository.getPaymentStatus(confirmedPayment.payment.id);
          setPaymentStatus(status);

          // If payment is completed, stop polling and call onSuccess
          if (status.payment.status === 'completed') {
            if (pollingInterval) {
              clearInterval(pollingInterval);
              setPollingInterval(null);
            }
            if (onSuccess) {
              onSuccess(status.subscription);
            }
          }

          // If payment expired or failed, stop polling
          if (status.payment.status === 'expired' || status.payment.status === 'failed') {
            if (pollingInterval) {
              clearInterval(pollingInterval);
              setPollingInterval(null);
            }
          }
        } catch (err) {
          console.error('Error polling payment status:', err);
        }
      };

      // Initial poll
      pollStatus();

      // Set up polling every 10 seconds
      const interval = setInterval(pollStatus, 10000);
      setPollingInterval(interval);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [currentStep, confirmedPayment, onSuccess]);

  // Auto-preview when currency is selected (native crypto or token)
  useEffect(() => {
    if (selectedCurrency && currentStep === 'selection') {
      const loadPreview = async () => {
        try {
          setLoadingPreview(true);
          setError(null);
          const response = await CheckoutRepository.previewCheckout({
            payable_type: payableType,
            payable_id: payableId,
            payment_method: 'crypto',
            options: { currency: selectedCurrency },
          });
          setPreview(response);
          // Reset countdown timer when new preview loads
          setPreviewTimeRemaining(300); // 5 minutes
          setPreviewExpired(false);
        } catch (err) {
          console.error('Error previewing checkout:', err);
          setError(err instanceof Error ? err.message : 'Failed to preview payment');
        } finally {
          setLoadingPreview(false);
        }
      };

      loadPreview();
    }
  }, [selectedCurrency, payableType, payableId, currentStep]);

  // Countdown timer for preview expiration
  useEffect(() => {
    if (!preview || currentStep !== 'selection') return;

    const timer = setInterval(() => {
      setPreviewTimeRemaining((prev) => {
        if (prev <= 1) {
          setPreviewExpired(true);
          // Auto-refresh preview
          if (selectedCurrency) {
            const refreshPreview = async () => {
              try {
                const response = await CheckoutRepository.previewCheckout({
                  payable_type: payableType,
                  payable_id: payableId,
                  payment_method: 'crypto',
                  options: { currency: selectedCurrency },
                });
                setPreview(response);
                setPreviewTimeRemaining(300);
                setPreviewExpired(false);
              } catch (err) {
                console.error('Error refreshing preview:', err);
              }
            };
            refreshPreview();
          }
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [preview, currentStep, selectedCurrency, payableType, payableId]);

  // Confirm checkout and redirect to payment page
  const handleConfirm = async () => {
    if (!selectedCurrency) return;

    try {
      setLoading(true);
      setError(null);
      const response = await CheckoutRepository.confirmCheckout({
        payable_type: payableType,
        payable_id: payableId,
        payment_method: 'crypto',
        options: { currency: selectedCurrency },
      });

      // Extract payment_id from response - API returns { data: { payment_id: ... } }
      const paymentId = response.data?.payment_id || response.payment_id || response.payment?.id || response.payment?.payment_id;
      if (paymentId) {
        // Use window.location.href to navigate to payment page
        // The router will automatically handle localization
        window.location.href = `/payment/${paymentId}`;
      } else {
        console.error('Payment response:', response);
        throw new Error('No payment ID returned from server');
      }
    } catch (err) {
      console.error('Error confirming checkout:', err);
      setError(err instanceof Error ? err.message : 'Failed to confirm payment');
      setLoading(false);
    }
  };

  // Handle native cryptocurrency selection (e.g., ETH, BTC)
  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    // Default to native currency
    setSelectedCurrency(method.code);
    setError(null);
  };

  // Handle token selection (e.g., USDT on ETH)
  const handleTokenSelect = (tokenCode: string) => {
    setSelectedCurrency(tokenCode);
    setError(null);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Format time remaining for countdown
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format time remaining
  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();

    if (diff <= 0) return t('checkout.status.expired');

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Render combined selection and preview
  const renderSelectionStep = () => (
    <div className="checkout-step">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('checkout.selectPaymentMethod')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('checkout.selectPaymentMethodDescription')}
        </p>
      </div>

      {error && (
        <div className="checkout-error">
          <i className="bi bi-exclamation-triangle"></i>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="checkout-loading">
          <div className="spinner"></div>
          <p>{t('checkout.loading')}</p>
        </div>
      ) : (
        <>
          {/* Step 1: Select native cryptocurrency */}
          <div className="payment-methods-grid">
            {paymentMethods.filter(method => !method.is_token).map((method) => (
              <button
                key={method.code}
                className={`payment-method-card ${selectedMethod?.code === method.code ? 'selected' : ''}`}
                onClick={() => handleMethodSelect(method)}
                disabled={loadingPreview}
              >
                <div className="payment-method-icon">
                  <i className="bi bi-currency-bitcoin"></i>
                </div>
                <h3>{method.name}</h3>
                <p className="payment-method-details">
                  {t('checkout.minAmount')}: {method.min_amount} {method.code}
                </p>
                {selectedMethod?.code === method.code && (
                  <div className="selected-indicator">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Step 2: Show token options if selected method has tokens */}
          {selectedMethod && selectedMethod.tokens && selectedMethod.tokens.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Or pay with a token on {selectedMethod.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option to use native currency */}
                <button
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCurrency === selectedMethod.code
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-pink-300'
                  }`}
                  onClick={() => handleTokenSelect(selectedMethod.code)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedMethod.name} ({selectedMethod.code})
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Native cryptocurrency
                      </p>
                    </div>
                    {selectedCurrency === selectedMethod.code && (
                      <i className="bi bi-check-circle-fill text-pink-500 text-xl"></i>
                    )}
                  </div>
                </button>

                {/* Token options */}
                {selectedMethod.tokens.map((token) => (
                  <button
                    key={token.code}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCurrency === token.code
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-pink-300'
                    }`}
                    onClick={() => handleTokenSelect(token.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {token.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Min: {token.min_amount}
                        </p>
                      </div>
                      {selectedCurrency === token.code && (
                        <i className="bi bi-check-circle-fill text-pink-500 text-xl"></i>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {loadingPreview && selectedMethod && (
            <div className="checkout-loading">
              <div className="spinner"></div>
              <p>{t('checkout.loading')}</p>
            </div>
          )}

          {/* Show preview when method is selected */}
          {selectedMethod && preview && !loadingPreview && (
            <div className="checkout-preview">
              {/* Countdown Timer */}
              <div className={`px-4 py-3 rounded-lg mb-4 text-center font-mono font-bold ${
                previewTimeRemaining < 60 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
              }`}>
                {previewExpired ? (
                  <span>{t('checkout.priceExpired')}</span>
                ) : previewTimeRemaining < 60 ? (
                  <span>{t('checkout.priceExpiringSoon')} {formatCountdown(previewTimeRemaining)}</span>
                ) : (
                  <span>{t('checkout.priceLocked')} {formatCountdown(previewTimeRemaining)}</span>
                )}
              </div>

              {/* Simplified Payment Summary - No redundant order summary */}
              <div className="preview-section">
                <h3>{t('checkout.paymentDetails')}</h3>
                {preview.payment.crypto && (
                  <>
                    <div className="preview-item">
                      <span>{t('checkout.amountCrypto')}</span>
                      <span className="font-semibold text-lg">{preview.payment.crypto.amount} {preview.payment.crypto.currency}</span>
                    </div>
                    <div className="preview-item">
                      <span>{t('checkout.exchangeRate')}</span>
                      <span className="text-sm">1 {preview.payment.crypto.currency} = ${preview.payment.crypto.exchange_rate_usd.toFixed(2)}</span>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800 dark:text-blue-300 font-semibold">{t('checkout.amountUsd')}</span>
                        <span className="text-lg font-bold text-blue-900 dark:text-blue-200">${preview.payment.amount_usd.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="checkout-actions">
                <button
                  className="checkout-btn-primary relative overflow-hidden group"
                  onClick={handleConfirm}
                  disabled={loading}
                  style={{
                    boxShadow: loading ? 'none' : '0 4px 14px 0 rgba(236, 72, 153, 0.39)',
                  }}
                >
                  {loading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t('checkout.processing')}
                    </>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center justify-center">
                        {t('checkout.unlockAccess')}
                        <span className="ml-2">→</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {t('checkout.startWatching')}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Render payment status step
  const renderStatusStep = () => {
    const status = paymentStatus || { payment: confirmedPayment?.payment, crypto_details: confirmedPayment?.crypto_details };
    const isPending = status.payment?.status === 'pending' || status.payment?.status === 'awaiting_confirmation';
    const isCompleted = status.payment?.status === 'completed';
    const isExpired = status.payment?.status === 'expired';
    const isFailed = status.payment?.status === 'failed';

    return (
      <div className="checkout-step">
        <h2 className="checkout-title">
          {isCompleted && t('checkout.status.completed')}
          {isPending && t('checkout.status.awaitingPayment')}
          {isExpired && t('checkout.status.expired')}
          {isFailed && t('checkout.status.failed')}
        </h2>

        {confirmedPayment && (
          <div className="payment-status">
            {isPending && (
              <>
                <div className="status-section">
                  <h3>{t('checkout.status.sendPayment')}</h3>
                  <p>{confirmedPayment.instructions.message}</p>

                  <div className="payment-address-section">
                    <label>{t('checkout.status.paymentAddress')}</label>
                    <div className="payment-address-display">
                      <code>{confirmedPayment.crypto_details.payment_address}</code>
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(confirmedPayment.crypto_details.payment_address)}
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </div>
                  </div>

                  <div className="payment-amount-section">
                    <label>{t('checkout.status.exactAmount')}</label>
                    <div className="payment-amount-display">
                      <code>{confirmedPayment.crypto_details.amount_crypto} {confirmedPayment.crypto_details.currency}</code>
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(confirmedPayment.crypto_details.amount_crypto)}
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </div>
                  </div>

                  <div className="qr-code-section">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(confirmedPayment.instructions.qr_code_data)}`}
                      alt="Payment QR Code"
                      className="qr-code"
                    />
                  </div>

                  <div className="payment-status-info">
                    <div className="status-item">
                      <span>{t('checkout.status.confirmations')}</span>
                      <span>{confirmedPayment.crypto_details.confirmations} / {confirmedPayment.crypto_details.required_confirmations}</span>
                    </div>
                    {confirmedPayment.payment.expires_at && (
                      <div className="status-item">
                        <span>{t('checkout.status.expiresIn')}</span>
                        <span className="expires-timer">{formatTimeRemaining(confirmedPayment.payment.expires_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {isCompleted && paymentStatus?.subscription && (
              <div className="status-section success">
                <i className="bi bi-check-circle success-icon"></i>
                <h3>{t('checkout.status.subscriptionActivated')}</h3>
                <p>{t('checkout.status.thankYou')}</p>
              </div>
            )}

            {(isExpired || isFailed) && (
              <div className="status-section error">
                <i className="bi bi-x-circle error-icon"></i>
                <h3>{isExpired ? t('checkout.status.paymentExpired') : t('checkout.status.paymentFailed')}</h3>
                <button className="checkout-btn-primary" onClick={handleBack}>
                  {t('checkout.tryAgain')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'selection':
        return renderSelectionStep();
      case 'status':
        return renderStatusStep();
      default:
        return renderSelectionStep();
    }
  };

  return (
    <div className="checkout-flow">
      {renderStep()}
    </div>
  );
};

export default CheckoutFlow;
