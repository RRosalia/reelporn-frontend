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
                              ${parseFloat(displayPlan.price).toFixed(2)}
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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Plan Summary Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t('checkout.title')}
          </h1>
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg inline-block">
            <h2 className="text-xl font-semibold mb-1">{plan.name}</h2>
            <p className="text-2xl font-bold text-pink-500">
              ${parseFloat(plan.price).toFixed(2)}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                / {plan.periodicity} {plan.periodicity_type}
              </span>
            </p>
          </div>
        </div>

        {/* Checkout Flow Component */}
        <CheckoutFlow
          payableType="plan"
          payableId={plan.id}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
