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
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [preview, setPreview] = useState<CheckoutPreviewResponse | null>(null);
  const [confirmedPayment, setConfirmedPayment] = useState<CheckoutConfirmResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<CheckoutPaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

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

  // Auto-preview when payment method is selected
  useEffect(() => {
    if (selectedMethod && currentStep === 'selection') {
      const loadPreview = async () => {
        try {
          setLoadingPreview(true);
          setError(null);
          const response = await CheckoutRepository.previewCheckout({
            payable_type: payableType,
            payable_id: payableId,
            payment_method: 'crypto',
            options: { currency: selectedMethod },
          });
          setPreview(response);
        } catch (err) {
          console.error('Error previewing checkout:', err);
          setError(err instanceof Error ? err.message : 'Failed to preview payment');
        } finally {
          setLoadingPreview(false);
        }
      };

      loadPreview();
    }
  }, [selectedMethod, payableType, payableId, currentStep]);

  // Confirm checkout
  const handleConfirm = async () => {
    if (!selectedMethod) return;

    try {
      setLoading(true);
      setError(null);
      const response = await CheckoutRepository.confirmCheckout({
        payable_type: payableType,
        payable_id: payableId,
        payment_method: 'crypto',
        options: { currency: selectedMethod },
      });
      setConfirmedPayment(response);
      setCurrentStep('status');
    } catch (err) {
      console.error('Error confirming checkout:', err);
      setError(err instanceof Error ? err.message : 'Failed to confirm payment');
    } finally {
      setLoading(false);
    }
  };

  // Handle method selection
  const handleMethodSelect = (currency: string) => {
    setSelectedMethod(currency);
    setError(null);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
      <h2 className="checkout-title">{t('checkout.selectPaymentMethod')}</h2>

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
          <div className="payment-methods-grid">
            {paymentMethods.map((method) => (
              <button
                key={method.code}
                className={`payment-method-card ${selectedMethod === method.code ? 'selected' : ''}`}
                onClick={() => handleMethodSelect(method.code)}
                disabled={loadingPreview}
              >
                <div className="payment-method-icon">
                  <i className="bi bi-currency-bitcoin"></i>
                </div>
                <h3>{method.name}</h3>
                <p className="payment-method-network">{method.network}</p>
                <p className="payment-method-details">
                  {t('checkout.minAmount')}: {method.min_amount} {method.code}
                </p>
                {selectedMethod === method.code && (
                  <div className="selected-indicator">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Show preview when method is selected */}
          {selectedMethod && preview && (
            <div className="checkout-preview">
              <div className="preview-section">
                <h3>{t('checkout.orderSummary')}</h3>
                <div className="preview-item">
                  <span>{preview.payable.name}</span>
                  <span className="preview-price">${preview.payable.price_usd.toFixed(2)}</span>
                </div>
                {preview.payable.interval && (
                  <p className="preview-interval">{preview.payable.interval}</p>
                )}
              </div>

              <div className="preview-section">
                <h3>{t('checkout.paymentDetails')}</h3>
                <div className="preview-item">
                  <span>{t('checkout.paymentMethod')}</span>
                  <span>{selectedMethod}</span>
                </div>
                <div className="preview-item">
                  <span>{t('checkout.amountUsd')}</span>
                  <span>${preview.payment.amount_usd.toFixed(2)}</span>
                </div>
                {preview.payment.crypto && (
                  <>
                    <div className="preview-item">
                      <span>{t('checkout.amountCrypto')}</span>
                      <span>{preview.payment.crypto.amount} {preview.payment.crypto.currency}</span>
                    </div>
                    <div className="preview-item">
                      <span>{t('checkout.exchangeRate')}</span>
                      <span>1 {preview.payment.crypto.currency} = ${preview.payment.crypto.exchange_rate_usd.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              <p className="preview-note">{preview.message}</p>

              <div className="checkout-actions">
                {onCancel && (
                  <button className="checkout-btn-secondary" onClick={onCancel} disabled={loading}>
                    {t('checkout.cancel')}
                  </button>
                )}
                <button className="checkout-btn-primary" onClick={handleConfirm} disabled={loading}>
                  {loading ? t('checkout.processing') : t('checkout.confirmPayment')}
                </button>
              </div>
            </div>
          )}

          {loadingPreview && selectedMethod && (
            <div className="checkout-loading">
              <div className="spinner"></div>
              <p>{t('checkout.loading')}</p>
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
