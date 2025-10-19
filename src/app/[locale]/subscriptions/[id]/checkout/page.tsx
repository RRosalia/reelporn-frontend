'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CheckoutFlow from '@/components/checkout/CheckoutFlow';
import SubscriptionRepository from '@/lib/repositories/SubscriptionRepository';
import { Plan, GroupedPlans, PeriodicityType } from '@/types/Payment';

export default function SubscriptionCheckoutPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'en';
  const planId = parseInt(params?.id as string, 10);

  const [plan, setPlan] = useState<Plan | null>(null);
  const [alternativePlans, setAlternativePlans] = useState<GroupedPlans[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch plan details on mount
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await SubscriptionRepository.getSubscriptionPlans();

        // Find the plan with the matching ID
        const foundPlan = response.data.find(p => p.id === planId);

        if (!foundPlan) {
          setError('Plan not found');
          // Store alternative plans to show user
          setAlternativePlans(response.grouped || []);
          return;
        }

        setPlan(foundPlan);
      } catch (err) {
        console.error('Error fetching plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to load plan');
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlan();
    } else {
      setError('Invalid plan ID');
      setLoading(false);
    }
  }, [planId]);

  const handleSuccess = (subscription?: any) => {
    // Redirect to account subscriptions page or show success message
    const path = locale === 'en' ? '/account' : `/${locale}/account`;
    router.push(path);
  };

  const handleCancel = () => {
    // Go back to subscriptions page
    const path = locale === 'en' ? '/subscriptions' : `/${locale}/subscriptions`;
    router.push(path);
  };

  const getLocalizedPath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

  const getPlanForDisplay = (group: GroupedPlans): Plan | undefined => {
    // Prefer monthly plan for display
    return group.plans.find(p => p.periodicity_type === PeriodicityType.MONTH) || group.plans[0];
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-3"></div>
          <p>{t('checkout.loadingPlan')}</p>
        </div>
      </div>
    );
  }

  // Error state - Plan not found
  if (error || !plan) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Error Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
              <i className="bi bi-exclamation-triangle text-4xl text-red-500"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('checkout.error.planNotFoundTitle')}
            </h1>
            <p className="text-lg max-w-2xl mx-auto text-white" style={{ opacity: 0.85 }}>
              {t('checkout.error.planNotFoundDescription')}
            </p>
          </div>

          {/* Alternative Plans */}
          {alternativePlans.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-center mb-8 text-white">
                {t('checkout.error.alternativePlans')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {alternativePlans.slice(0, 3).map((group, index) => {
                  const displayPlan = getPlanForDisplay(group);
                  if (!displayPlan) return null;

                  const isFree = parseFloat(displayPlan.price) === 0;
                  const isPopular = index === 1; // Middle plan

                  return (
                    <div
                      key={group.group}
                      className={`relative rounded-2xl p-6 border-2 transition-all hover:shadow-xl bg-white ${
                        isPopular
                          ? 'border-pink-500 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                            {t('membership.popular')}
                          </span>
                        </div>
                      )}
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold mb-2 capitalize text-gray-900">
                          {group.group}
                        </h3>
                        {!isFree ? (
                          <div className="mb-4">
                            <span className="text-4xl font-bold text-pink-500">
                              ${(parseFloat(displayPlan.price) / 100).toFixed(2)}
                            </span>
                            <span className="ml-2 text-gray-600">
                              /{displayPlan.periodicity_type}
                            </span>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <span className="text-4xl font-bold text-gray-900">
                              {t('subscriptions.price.free')}
                            </span>
                          </div>
                        )}
                      </div>
                      <ul className="space-y-3 mb-6">
                        {displayPlan.features?.slice(0, 4).map((feature: any) => (
                          <li key={feature.id} className="flex items-start text-sm">
                            <i className="bi bi-check-circle-fill text-green-500 mr-2 mt-0.5 flex-shrink-0"></i>
                            <span className="text-gray-700">
                              {feature.name}
                              {feature.consumable && feature.quota && ` (${feature.quota})`}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => router.push(getLocalizedPath(`/subscriptions/${displayPlan.id}/checkout`))}
                        className={`w-full py-3 px-6 rounded-lg font-bold transition-all ${
                          isPopular
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-lg'
                        }`}
                      >
                        {t('checkout.error.selectPlan')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleCancel}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              {t('checkout.error.viewAllPlans')}
            </button>
            <button
              onClick={() => router.back()}
              className="px-8 py-4 font-bold rounded-lg transition-all bg-white text-gray-900 hover:bg-gray-100"
            >
              {t('checkout.error.goBack')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center z-10 relative">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-2 shadow-lg">
                  <i className="bi bi-check-lg text-white text-xl font-bold"></i>
                </div>
                <span className="text-xs md:text-sm font-semibold text-white">{t('checkout.progress.step1')}</span>
              </div>

              {/* Connecting line 1 */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-pink-500 to-gray-600" style={{ zIndex: 0, width: '100%', transform: 'translateY(-50%)' }}></div>

              {/* Step 2 - Active */}
              <div className="flex flex-col items-center z-10 relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mb-2 shadow-lg animate-pulse">
                  <span className="text-white text-lg font-bold">2</span>
                </div>
                <span className="text-xs md:text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{t('checkout.progress.step2')}</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center z-10 relative">
                <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center mb-2">
                  <span className="text-gray-400 text-lg font-bold">3</span>
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-400">{t('checkout.progress.step3')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {t('checkout.title')}
        </h1>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Subscription Details */}
          <div className="space-y-6">
            {/* Plan Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-pink-500/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {plan.periodicity_type}
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  ${(parseFloat(plan.price) / 100).toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 dark:text-gray-400">
                  / {plan.periodicity} {plan.periodicity_type}
                </span>
              </div>

              {plan.features && plan.features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t('checkout.whatsIncluded')}
                  </h3>
                  <ul className="space-y-3">
                    {plan.features.map((feature: any) => (
                      <li key={feature.id} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                        <i className="bi bi-check-circle-fill text-green-500 mr-3 mt-0.5 flex-shrink-0 text-lg"></i>
                        <span>
                          {feature.name}
                          {feature.consumable && feature.quota && ` (${feature.quota})`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Trust Badges & Security */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-pink-500/20">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <i className="bi bi-shield-check text-4xl text-green-500"></i>
                  <i className="bi bi-lock-fill text-4xl text-blue-500"></i>
                  <i className="bi bi-lightning-charge-fill text-4xl text-yellow-500"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('checkout.securePayment')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t('checkout.securePaymentDescription')}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <i className="bi bi-shield-fill-check text-green-500 text-lg"></i>
                    {t('checkout.sslEncrypted')}
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="bi bi-credit-card-2-front text-gray-500 text-lg"></i>
                    {t('checkout.noCreditCard')}
                  </span>
                </div>
              </div>

              {/* Live Member Counter */}
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-4">
                <p className="text-center text-sm text-gray-700 dark:text-gray-300">
                  <i className="bi bi-people-fill text-pink-500 mr-2"></i>
                  <span className="font-semibold">{t('checkout.joinMembers', { count: '2,847' })}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Method Selection */}
          <div>
            <CheckoutFlow
              payableType="plan"
              payableId={plan.id}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>

        {/* Crypto Payment Methods Trust Section */}
        <div className="mt-12 pb-8">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">
              {t('checkout.acceptedCryptocurrencies')}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 hover:opacity-100 transition-opacity duration-300">
            {/* Bitcoin */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <i className="bi bi-currency-bitcoin text-3xl text-orange-400"></i>
              </div>
              <span className="text-xs text-gray-400 font-medium">{t('checkout.bitcoin')}</span>
            </div>

            {/* Ethereum */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <svg className="w-8 h-8" viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M127.961 0L125.45 8.536V285.168L127.961 287.678L255.922 212.32L127.961 0Z" fill="#8A92B2"/>
                  <path d="M127.962 0L0 212.32L127.962 287.678V153.983V0Z" fill="#62688F"/>
                  <path d="M127.961 312.187L126.385 314.097V411.791L127.961 416.616L256 237.276L127.961 312.187Z" fill="#62688F"/>
                  <path d="M127.962 416.616V312.187L0 237.276L127.962 416.616Z" fill="#454A75"/>
                </svg>
              </div>
              <span className="text-xs text-gray-400 font-medium">{t('checkout.ethereum')}</span>
            </div>

            {/* Litecoin */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <span className="text-2xl font-bold text-gray-300">Ł</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">{t('checkout.litecoin')}</span>
            </div>

            {/* USDT */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <svg className="w-8 h-8" viewBox="0 0 339.43 295.27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M62.15 1.45l-61.89 130a2.52 2.52 0 000 2.13l61.89 130a2.5 2.5 0 002.14 1.19h225.26a2.5 2.5 0 002.14-1.19l61.89-130a2.52 2.52 0 000-2.13l-61.89-130A2.5 2.5 0 00289.55.26H64.29a2.5 2.5 0 00-2.14 1.19z" fill="#50AF95"/>
                  <path d="M191.19 144.8v0c-1.2.09-7.4.46-21.23.46-11 0-18.81-.33-21.55-.46v0c-42.51-1.87-74.24-9.27-74.24-18.13s31.73-16.25 74.24-18.15v28.91c2.78.2 10.74.67 21.74.67 13.2 0 19.81-.55 21-.66v-28.9c42.42 1.89 74.08 9.29 74.08 18.13s-31.65 16.24-74.08 18.12zm0-39.25V79.68h59.2V40.23H89.21v39.45h59.19v25.86c-48.11 2.21-84.29 11.74-84.29 23.16s36.18 20.94 84.29 23.16v82.9h42.78v-82.93c48-2.21 84.12-11.73 84.12-23.14s-36.09-20.93-84.12-23.15z" fill="#fff"/>
                </svg>
              </div>
              <span className="text-xs text-gray-400 font-medium">{t('checkout.usdt')}</span>
            </div>

            {/* USDC */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <svg className="w-8 h-8" viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="1000" cy="1000" r="1000" fill="#2775CA"/>
                  <path d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 216.67 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z" fill="white"/>
                </svg>
              </div>
              <span className="text-xs text-gray-400 font-medium">{t('checkout.usdc')}</span>
            </div>

            {/* More cryptos indicator */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <span className="text-gray-400 font-bold text-xl">+</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">{t('checkout.more')}</span>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-shield-fill-check text-green-500"></i>
              <span>{t('checkout.securePayments')}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lock-fill text-blue-500"></i>
              <span>{t('checkout.encryptedTransactions')}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightning-charge-fill text-yellow-500"></i>
              <span>{t('checkout.instantConfirmation')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
