'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import PaymentService from '@/lib/services/PaymentService';
import { usePaymentWebSocket } from '@/lib/hooks/usePaymentWebSocket';
import SubscriptionRepository from '@/lib/repositories/SubscriptionRepository';
import type {
  CryptoCurrency,
  CryptoPrice,
  Plan,
  PaymentStatus,
} from '@/types/Payment';

/**
 * Crypto Payment Client Component
 * Allows users to purchase subscriptions using cryptocurrency
 * Features:
 * - Dynamic cryptocurrency selection from backend
 * - Real-time price updates
 * - QR code for easy payment
 * - WebSocket live payment status updates
 * - Confirmation progress tracking
 */
export default function CryptoPaymentClient() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');

  const [currencies, setCurrencies] = useState<CryptoCurrency[]>([]);
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentAddress, setPaymentAddress] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [cryptoAmount, setCryptoAmount] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // WebSocket for live payment updates
  const { status: paymentStatus } = usePaymentWebSocket(
    transactionId,
    (update) => {
      if (update.status === 'completed' as PaymentStatus) {
        // Payment successful, redirect to account page
        setTimeout(() => {
          router.push('/account');
        }, 2000);
      } else if (update.status === 'failed' as PaymentStatus) {
        setError(update.message || t('payment.paymentFailed'));
      }
    }
  );

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Auto-select plan from URL parameter
  useEffect(() => {
    if (planId && plans.length > 0) {
      const plan = plans.find((p) => p.id === parseInt(planId, 10));
      if (plan) {
        setSelectedPlan(plan);
      }
    }
  }, [planId, plans]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [currenciesData, pricesData, plansResponse] = await Promise.all([
        PaymentService.getSupportedCurrencies(),
        PaymentService.getCryptoPrices(),
        SubscriptionRepository.getSubscriptionPlans(),
      ]);

      setCurrencies(currenciesData);
      setPrices(pricesData);
      setPlans(plansResponse.data || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('payment.failedToLoadData');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateCryptoAmount = (currency: CryptoCurrency): string => {
    if (!selectedPlan) return '0';
    try {
      // Convert cents to dollars
      const priceInDollars = selectedPlan.price / 100;
      return PaymentService.calculateCryptoAmount(
        priceInDollars,
        prices,
        currency.code,
        currency.decimals
      );
    } catch {
      return '0';
    }
  };

  const getCryptoPrice = (currencyCode: string): number => {
    const price = prices.find((p) => p.code === currencyCode);
    return price?.priceUSD || 0;
  };

  const initiatePayment = async () => {
    if (!selectedPlan || !selectedCurrency) return;

    try {
      setProcessing(true);
      setError(null);

      const amount = calculateCryptoAmount(selectedCurrency);

      const response = await PaymentService.initiatePayment({
        subscriptionPlanId: selectedPlan.id,
        currencyCode: selectedCurrency.code,
        amount: selectedPlan.price,
        amountCrypto: amount,
        walletAddress: '', // Backend generates this
      });

      setTransactionId(response.transactionId);
      setPaymentAddress(response.paymentAddress);
      setQrCode(response.qrCode);
      setCryptoAmount(response.amountCrypto);
      setExpiresAt(response.expiresAt);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('payment.failedToInitiatePayment');
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCancelPayment = async () => {
    if (!transactionId) return;

    try {
      await PaymentService.cancelPayment(transactionId);
      resetPayment();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('payment.failedToCancelPayment');
      setError(errorMessage);
    }
  };

  const resetPayment = () => {
    setTransactionId(null);
    setPaymentAddress(null);
    setQrCode(null);
    setCryptoAmount(null);
    setExpiresAt(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="crypto-payment-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>{t('payment.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crypto-payment-page">
      <div className="crypto-payment-container">
        {/* Header */}
        <div className="payment-header">
          <h1>{t('payment.cryptoPayment')}</h1>
          <p>{t('payment.cryptoPaymentDescription')}</p>
        </div>

        {error && (
          <div className="error-banner">
            <i className="bi bi-exclamation-circle"></i>
            {error}
          </div>
        )}

        {!transactionId ? (
          // Step 1: Select Plan and Currency
          <div className="payment-selection">
            {/* Subscription Plans */}
            <section className="plans-section">
              <h2>{t('payment.selectPlan')}</h2>
              <div className="plans-grid">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className="plan-header">
                      <h3>{plan.name}</h3>
                      <div className="plan-price">
                        ${(plan.price / 100).toFixed(2)}
                        <span className="period">/{t('payment.month')}</span>
                      </div>
                    </div>
                    <ul className="plan-features">
                      {plan.features.map((feature) => (
                        <li key={feature.id}>
                          <i className="bi bi-check-circle"></i>
                          {feature.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Cryptocurrency Selection */}
            {selectedPlan && (
              <section className="currency-section">
                <h2>{t('payment.selectCryptocurrency')}</h2>
                <div className="currency-grid">
                  {currencies.map((currency) => {
                    const cryptoAmt = calculateCryptoAmount(currency);
                    const usdPrice = getCryptoPrice(currency.code);

                    return (
                      <div
                        key={currency.code}
                        className={`currency-card ${
                          selectedCurrency?.code === currency.code ? 'selected' : ''
                        }`}
                        onClick={() => currency.enabled && setSelectedCurrency(currency)}
                      >
                        <div className="currency-icon">
                          {currency.icon ? (
                            <Image src={currency.icon} alt={currency.name} width={40} height={40} />
                          ) : (
                            <span className="currency-symbol">{currency.symbol}</span>
                          )}
                        </div>
                        <div className="currency-info">
                          <h3>{currency.name}</h3>
                          <span className="currency-code">{currency.code}</span>
                        </div>
                        <div className="currency-amount">
                          <div className="crypto-value">{cryptoAmt}</div>
                          <div className="usd-price">
                            ${usdPrice.toFixed(2)} USD
                          </div>
                        </div>
                        {currency.network && (
                          <div className="network-tag">{currency.network}</div>
                        )}
                        {!currency.enabled && (
                          <div className="disabled-overlay">
                            {t('payment.unavailable')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Payment Summary & Submit */}
            {selectedPlan && selectedCurrency && (
              <section className="payment-summary">
                <div className="summary-content">
                  <div className="summary-row">
                    <span>{t('payment.plan')}</span>
                    <strong>{selectedPlan.name}</strong>
                  </div>
                  <div className="summary-row">
                    <span>{t('payment.currency')}</span>
                    <strong>{selectedCurrency.name}</strong>
                  </div>
                  <div className="summary-row total">
                    <span>{t('payment.total')}</span>
                    <strong>
                      {calculateCryptoAmount(selectedCurrency)} {selectedCurrency.code}
                    </strong>
                  </div>
                </div>
                <button
                  className="proceed-btn"
                  onClick={initiatePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="btn-spinner"></span>
                      {t('payment.processing')}
                    </>
                  ) : (
                    t('payment.proceedToPayment')
                  )}
                </button>
              </section>
            )}
          </div>
        ) : (
          // Step 2: Payment Details with QR Code
          <div className="payment-details-section">
            <div className="status-header">
              <div className={`status-indicator status-${paymentStatus?.status || 'pending'}`}>
                {paymentStatus?.status === ('completed' as PaymentStatus) && (
                  <>
                    <i className="bi bi-check-circle-fill"></i>
                    {t('payment.paymentCompleted')}
                  </>
                )}
                {paymentStatus?.status === ('failed' as PaymentStatus) && (
                  <>
                    <i className="bi bi-x-circle-fill"></i>
                    {t('payment.paymentFailed')}
                  </>
                )}
                {(!paymentStatus ||
                  (paymentStatus.status !== ('completed' as PaymentStatus) &&
                    paymentStatus.status !== ('failed' as PaymentStatus))) && (
                  <>
                    <i className="bi bi-clock-history"></i>
                    {t('payment.awaitingPayment')}
                  </>
                )}
              </div>
            </div>

            <div className="payment-content">
              <div className="qr-section">
                {qrCode && (
                  <div className="qr-container">
                    <Image
                      src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
                      alt="Payment QR Code"
                      width={256}
                      height={256}
                      className="qr-image"
                    />
                    <p className="qr-instruction">{t('payment.scanQRCode')}</p>
                  </div>
                )}
              </div>

              <div className="details-section">
                <div className="detail-card">
                  <label>{t('payment.sendExactAmount')}</label>
                  <div className="value-display crypto-highlight">
                    {cryptoAmount} {selectedCurrency?.code}
                  </div>
                  <div className="value-subtext">
                    ≈ ${selectedPlan?.price.toFixed(2)} USD
                  </div>
                </div>

                <div className="detail-card">
                  <label>{t('payment.toThisAddress')}</label>
                  <div className="address-container">
                    <code className="address-value">{paymentAddress}</code>
                    <button
                      className="copy-button"
                      onClick={() => paymentAddress && copyToClipboard(paymentAddress)}
                      title={t('payment.copyAddress')}
                    >
                      <i className={`bi bi-${copied ? 'check' : 'clipboard'}`}></i>
                      {copied ? t('payment.copied') : t('payment.copy')}
                    </button>
                  </div>
                </div>

                {selectedCurrency?.network && (
                  <div className="detail-card">
                    <label>{t('payment.network')}</label>
                    <div className="network-badge-large">{selectedCurrency.network}</div>
                  </div>
                )}

                {paymentStatus && (
                  <div className="detail-card">
                    <label>{t('payment.confirmationProgress')}</label>
                    <div className="confirmation-tracker">
                      <div className="confirmation-bar">
                        <div
                          className="confirmation-fill"
                          style={{
                            width: `${
                              (paymentStatus.confirmations /
                                paymentStatus.confirmationsRequired) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="confirmation-text">
                        {paymentStatus.confirmations} / {paymentStatus.confirmationsRequired}{' '}
                        {t('payment.confirmations')}
                      </div>
                    </div>
                  </div>
                )}

                {expiresAt && (
                  <div className="expiry-warning">
                    <i className="bi bi-clock"></i>
                    {t('payment.paymentExpiresAt', {
                      time: new Date(expiresAt).toLocaleTimeString(),
                    })}
                  </div>
                )}

                {paymentStatus?.explorerUrl && (
                  <a
                    href={paymentStatus.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blockchain-link"
                  >
                    <i className="bi bi-box-arrow-up-right"></i>
                    {t('payment.viewOnBlockchain')}
                  </a>
                )}

                <button className="cancel-button" onClick={handleCancelPayment}>
                  {t('payment.cancelPayment')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
