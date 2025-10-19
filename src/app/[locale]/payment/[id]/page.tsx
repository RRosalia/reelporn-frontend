'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import CheckoutRepository from '@/lib/repositories/CheckoutRepository';
import { PaymentStatusPollResponse } from '@/types/Payment';

export default function PaymentStatusPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('payment');
  const locale = params.locale as string;
  const paymentId = params.id as string;

  const [paymentData, setPaymentData] = useState<PaymentStatusPollResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);
  const [showEarlyRetry, setShowEarlyRetry] = useState(false);

  // Fetch payment status
  const fetchPaymentStatus = useCallback(async () => {
    try {
      const data = await CheckoutRepository.getPaymentStatus(paymentId);
      console.log('Payment status response:', data);
      if (data.crypto) {
        console.log('Confirmations:', data.crypto.confirmations, '/', data.crypto.required_confirmations);
      }

      setPaymentData(data);
      setError(null);

      // If payment is completed, redirect to account page after 3 seconds
      if (data?.status === 'completed' && data?.subscription) {
        setTimeout(() => {
          router.push('/account');
        }, 3000);
      }

      // Check if payment is expired based on expires_at timestamp
      if (data?.expires_at) {
        const expiresAt = new Date(data.expires_at);
        const now = new Date();
        if (now.getTime() > expiresAt.getTime() && !showExpiredModal) {
          setShowExpiredModal(true);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch payment status:', err);
      setError(err.message || t('failedToLoadData'));
    } finally {
      setLoading(false);
    }
  }, [paymentId, router, t]);

  // Poll for payment status every 5 seconds
  useEffect(() => {
    fetchPaymentStatus();

    const interval = setInterval(() => {
      fetchPaymentStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchPaymentStatus]);

  // Update countdown timer and check for expiration
  useEffect(() => {
    if (!paymentData || paymentData.status !== 'pending') return;

    const updateTimer = () => {
      const expiresAt = new Date(paymentData.expires_at);
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('00:00:00');
        // Payment has expired based on time - show modal
        if (!showExpiredModal) {
          setShowExpiredModal(true);
        }
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );

      // Show early retry button if under 2 minutes (120 seconds)
      const totalSeconds = Math.floor(diff / 1000);
      if (totalSeconds <= 120 && totalSeconds > 0) {
        setShowEarlyRetry(true);
      } else {
        setShowEarlyRetry(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [paymentData, showExpiredModal]);

  const copyToClipboard = async (text: string, type: 'amount' | 'address' | 'uri') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'amount') {
        setCopiedAmount(true);
        setTimeout(() => setCopiedAmount(false), 2000);
      } else if (type === 'address') {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      } else if (type === 'uri') {
        setCopiedUri(true);
        setTimeout(() => setCopiedUri(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRetryPayment = async () => {
    setIsRetrying(true);
    setRetryError(null);
    try {
      // Call API to create a new payment (retry)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/payments/${paymentId}/retry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error message from API response
        throw new Error(data.message || 'Failed to retry payment');
      }

      const newPaymentId = data.data?.payment_id || data.payment_id;

      if (newPaymentId) {
        // Redirect to the new payment page
        router.push(`/payment/${newPaymentId}`);
      } else {
        throw new Error('No payment ID returned');
      }
    } catch (err: any) {
      console.error('Failed to retry payment:', err);
      setRetryError(err.message || 'Failed to create new payment. Please try again.');
    } finally {
      setIsRetrying(false);
    }
  };

  const handleWalletButtonClick = async (paymentUri: string, e: React.MouseEvent) => {
    // Try to open the wallet app
    window.location.href = paymentUri;

    // After a short delay, offer to copy the URI in case the app didn't open
    setTimeout(async () => {
      // Ask user if they want to copy the payment URI instead
      const shouldCopy = await new Promise<boolean>((resolve) => {
        // Only show the copy option if we're still on the same page (app didn't open)
        const timeout = setTimeout(() => {
          resolve(false);
        }, 500);

        // If page is still visible after 500ms, wallet app probably didn't open
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            clearTimeout(timeout);
            resolve(false);
          }
        }, { once: true });
      });

      // If still on page, copy URI to clipboard as fallback
      if (!document.hidden) {
        await copyToClipboard(paymentUri, 'uri');
      }
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed':
      case 'expired':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 py-20">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('failedToLoadData')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Invalid payment data'}</p>
          <button
            onClick={() => router.push('/account')}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            {t('continue')}
          </button>
        </div>
      </div>
    );
  }

  const { status, crypto, payable, subscription } = paymentData;

  // Completed payment
  if (status === 'completed') {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 py-20">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('paymentCompleted')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for your {payable ? `subscription to ${payable.name}` : 'payment'}!
          </p>
          {subscription && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-green-800 dark:text-green-300">
                Subscription #{subscription.id} activated on {new Date(subscription.started_at).toLocaleDateString()}
              </p>
            </div>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Redirecting to your account...
          </p>
        </div>
      </div>
    );
  }

  // Failed/Expired/Cancelled payment
  if (['failed', 'expired', 'cancelled'].includes(status)) {
    return (
      <div className="flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 py-20">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">✗</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t(`status.${status}`)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {status === 'expired' && 'This payment has expired. Please start a new payment.'}
            {status === 'failed' && 'This payment has failed. Please try again.'}
            {status === 'cancelled' && 'This payment was cancelled.'}
          </p>
          <button
            onClick={() => router.push('/subscriptions')}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            View Subscription Plans
          </button>
        </div>
      </div>
    );
  }

  // Pending/Processing payment - show payment details
  return (
    <>
      {/* Expired Payment Modal */}
      {showExpiredModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('expired.title')}
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('expired.message')}
              </p>

              {retryError && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-800 dark:text-red-300">{retryError}</p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRetryPayment}
                  disabled={isRetrying}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRetrying ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      {t('expired.creatingPayment')}
                    </span>
                  ) : (
                    t('expired.retryButton')
                  )}
                </button>

                {!isRetrying && (
                  <button
                    onClick={() => router.push('/')}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    {t('expired.returnHome')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 py-12">
        <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('awaitingPayment')}
            </h1>
            <div className="inline-flex items-center gap-2">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(status)}`}>
                {t(`status.${status}`)}
              </span>
            </div>
          </div>

          {/* Timer */}
          {timeRemaining && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expires in</p>
              <p className="text-2xl font-mono font-bold text-yellow-600 dark:text-yellow-400">
                {timeRemaining}
              </p>

              {/* Early Retry Button - Shows when under 2 minutes */}
              {showEarlyRetry && !isRetrying && (
                <div className="mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {t('earlyRetry.message')}
                  </p>
                  <button
                    onClick={handleRetryPayment}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
                  >
                    {t('earlyRetry.button')}
                  </button>
                </div>
              )}

              {isRetrying && (
                <div className="mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-800">
                  <span className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-orange-500"></div>
                    {t('expired.creatingPayment')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Order Summary */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
            <div className="space-y-2">
              {payable && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Plan</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{payable.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount ({paymentData.currency})</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${(paymentData.amount_cents / 100).toFixed(2)}
                </span>
              </div>
              {payable?.interval && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Billing</span>
                  <span className="text-gray-900 dark:text-white">{payable.interval}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        {crypto && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Send Payment
            </h3>

            {/* QR Code */}
            {crypto.qr_code_svg && (
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-xl shadow-lg inline-block">
                    <div
                      dangerouslySetInnerHTML={{ __html: crypto.qr_code_svg }}
                      className="w-64 h-64 flex items-center justify-center"
                    />
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Scan with your crypto wallet app
                </p>
                {crypto.payment_uri && (
                  <div className="flex flex-col items-center gap-3">
                    <button
                      onClick={(e) => handleWalletButtonClick(crypto.payment_uri, e)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {copiedUri ? 'Payment URI Copied!' : 'Open in Wallet App'}
                    </button>
                    <button
                      onClick={() => copyToClipboard(crypto.payment_uri, 'uri')}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors underline"
                    >
                      {copiedUri ? 'Copied!' : 'Or copy payment URI'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Amount */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('sendExactAmount')}
              </label>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <code className="flex-1 font-mono text-lg font-bold text-gray-900 dark:text-white break-all">
                  {crypto.amount} {crypto.currency}
                </code>
                <button
                  onClick={() => copyToClipboard(crypto.amount, 'amount')}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold transition-colors whitespace-nowrap"
                >
                  {copiedAmount ? t('copied') : t('copy')}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                ≈ ${(crypto.exchange_rate_cents / 100).toLocaleString()} per {crypto.currency}
              </p>
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('toThisAddress')}
              </label>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <code className="flex-1 font-mono text-sm text-gray-900 dark:text-white break-all">
                  {crypto.payment_address}
                </code>
                <button
                  onClick={() => copyToClipboard(crypto.payment_address, 'address')}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold transition-colors whitespace-nowrap"
                >
                  {copiedAddress ? t('copied') : t('copy')}
                </button>
              </div>
            </div>

            {/* Confirmations */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('confirmationProgress')}
                </label>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {crypto.confirmations} / {crypto.required_confirmations}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((crypto.confirmations / crypto.required_confirmations) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Network */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Network:</strong> {crypto.currency} {crypto.network ? `(${crypto.network})` : 'Mainnet'}
              </p>
              {crypto.transaction_hash && (
                <p className="text-sm text-blue-800 dark:text-blue-300 mt-2">
                  <strong>Transaction:</strong> {crypto.transaction_hash.substring(0, 16)}...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
