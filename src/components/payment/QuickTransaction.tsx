'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import PaymentService from '@/lib/services/PaymentService';
import { usePaymentWebSocket } from '@/lib/hooks/usePaymentWebSocket';
import type {
  QuickTransactionConfig,
  CryptoCurrency,
  CryptoPrice,
} from '@/types/Payment';
import { PaymentStatus } from '@/types/Payment';
import './QuickTransaction.css';

interface QuickTransactionProps {
  config: QuickTransactionConfig;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * QuickTransaction Component
 * A modal component that allows users to quickly execute a crypto payment
 * Shows QR code, wallet address, and live payment status updates
 */
export default function QuickTransaction({
  config,
  isOpen,
  onClose,
}: QuickTransactionProps) {
  const t = useTranslations();
  const [currencies, setCurrencies] = useState<CryptoCurrency[]>([]);
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency | null>(null);
  const [loading, setLoading] = useState(false);
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
      if (update.status === PaymentStatus.COMPLETED) {
        config.onSuccess?.(update.transactionId);
        setTimeout(() => onClose(), 2000);
      } else if (update.status === PaymentStatus.FAILED) {
        setError(update.message || 'Payment failed');
        config.onError?.(update.message || 'Payment failed');
      }
    }
  );

  // Load supported currencies and prices
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Auto-select currency if specified in config
  useEffect(() => {
    if (currencies.length > 0 && config.currencyCode) {
      const currency = currencies.find((c) => c.code === config.currencyCode);
      if (currency) {
        setSelectedCurrency(currency);
      }
    }
  }, [currencies, config.currencyCode]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [currenciesData, pricesData] = await Promise.all([
        PaymentService.getSupportedCurrencies(),
        PaymentService.getCryptoPrices(),
      ]);
      setCurrencies(currenciesData);
      setPrices(pricesData);
    } catch {
      setError('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    if (!selectedCurrency) return;

    try {
      setLoading(true);
      setError(null);

      const amount = PaymentService.calculateCryptoAmount(
        config.amount,
        prices,
        selectedCurrency.code,
        selectedCurrency.decimals
      );

      const response = await PaymentService.initiatePayment({
        subscriptionPlanId: 0, // Quick transaction doesn't need plan
        currencyCode: selectedCurrency.code,
        amount: config.amount,
        amountCrypto: amount,
        walletAddress: '', // Backend generates this
        userId: config.metadata?.userId,
      });

      setTransactionId(response.transactionId);
      setPaymentAddress(response.paymentAddress);
      setQrCode(response.qrCode);
      setCryptoAmount(response.amountCrypto);
      setExpiresAt(response.expiresAt);
    } catch {
      setError('Failed to initiate payment');
      config.onError?.('Failed to initiate payment');
    } finally {
      setLoading(false);
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

  const handleClose = () => {
    if (paymentStatus?.status !== PaymentStatus.COMPLETED) {
      config.onCancel?.();
    }
    resetState();
    onClose();
  };

  const resetState = () => {
    setTransactionId(null);
    setPaymentAddress(null);
    setQrCode(null);
    setCryptoAmount(null);
    setExpiresAt(null);
    setError(null);
    setSelectedCurrency(null);
  };

  if (!isOpen) return null;

  return (
    <div className="quick-transaction-overlay" onClick={handleClose}>
      <div
        className="quick-transaction-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="quick-transaction-header">
          <h2>{t('payment.quickTransaction')}</h2>
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="quick-transaction-body">
          {error && (
            <div className="error-message">
              <i className="bi bi-exclamation-circle"></i>
              {error}
            </div>
          )}

          {!transactionId ? (
            // Currency Selection Screen
            <>
              <div className="transaction-description">
                <p>{config.description}</p>
                <div className="amount-display">
                  ${config.amount.toFixed(2)} USD
                </div>
              </div>

              <div className="currency-selector">
                <label>{t('payment.selectCryptocurrency')}</label>
                <div className="currency-grid">
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      className={`currency-option ${
                        selectedCurrency?.code === currency.code ? 'selected' : ''
                      }`}
                      onClick={() => setSelectedCurrency(currency)}
                      disabled={!currency.enabled}
                    >
                      {currency.icon ? (
                        <Image src={currency.icon} alt={currency.name} width={32} height={32} />
                      ) : (
                        <span className="currency-symbol">{currency.symbol}</span>
                      )}
                      <span className="currency-name">{currency.name}</span>
                      <span className="currency-code">{currency.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="initiate-payment-btn"
                onClick={initiatePayment}
                disabled={!selectedCurrency || loading}
              >
                {loading ? t('payment.processing') : t('payment.continue')}
              </button>
            </>
          ) : (
            // Payment Screen
            <>
              <div className="payment-status">
                <div className={`status-badge status-${paymentStatus?.status || 'pending'}`}>
                  {paymentStatus?.status === PaymentStatus.COMPLETED && (
                    <i className="bi bi-check-circle"></i>
                  )}
                  {paymentStatus?.status === PaymentStatus.FAILED && (
                    <i className="bi bi-x-circle"></i>
                  )}
                  {(!paymentStatus || paymentStatus.status === PaymentStatus.PENDING) && (
                    <i className="bi bi-clock"></i>
                  )}
                  {t(`payment.status.${paymentStatus?.status || 'pending'}`)}
                </div>
              </div>

              <div className="qr-code-section">
                {qrCode && (
                  <Image
                    src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
                    alt="Payment QR Code"
                    width={200}
                    height={200}
                    className="qr-code"
                  />
                )}
              </div>

              <div className="payment-details">
                <div className="detail-row">
                  <label>{t('payment.sendExactly')}</label>
                  <div className="value-with-copy">
                    <span className="crypto-amount">
                      {cryptoAmount} {selectedCurrency?.code}
                    </span>
                  </div>
                </div>

                <div className="detail-row">
                  <label>{t('payment.toAddress')}</label>
                  <div className="value-with-copy">
                    <span className="payment-address">{paymentAddress}</span>
                    <button
                      className="copy-btn"
                      onClick={() => paymentAddress && copyToClipboard(paymentAddress)}
                    >
                      <i className={`bi bi-${copied ? 'check' : 'clipboard'}`}></i>
                    </button>
                  </div>
                </div>

                {selectedCurrency?.network && (
                  <div className="detail-row">
                    <label>{t('payment.network')}</label>
                    <span className="network-badge">{selectedCurrency.network}</span>
                  </div>
                )}

                {paymentStatus && paymentStatus.confirmations < paymentStatus.confirmationsRequired && (
                  <div className="confirmation-progress">
                    <label>{t('payment.confirmations')}</label>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(paymentStatus.confirmations / paymentStatus.confirmationsRequired) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="progress-text">
                      {paymentStatus.confirmations} / {paymentStatus.confirmationsRequired}
                    </span>
                  </div>
                )}

                {expiresAt && (
                  <div className="expiry-notice">
                    <i className="bi bi-clock-history"></i>
                    {t('payment.expiresAt', { time: new Date(expiresAt).toLocaleTimeString() })}
                  </div>
                )}
              </div>

              {paymentStatus?.explorerUrl && (
                <a
                  href={paymentStatus.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="explorer-link"
                >
                  {t('payment.viewOnBlockchain')} <i className="bi bi-box-arrow-up-right"></i>
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
