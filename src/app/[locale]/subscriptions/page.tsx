'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SubscriptionRepository from '@/lib/repositories/SubscriptionRepository';
import './styles.css';

function SubscriptionsPage() {const t = useTranslations();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const router = useRouter();
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getLocalizedPath = (path: string) => {
        return locale === 'en' ? path : `/${locale}${path}`;
    };

    // Fetch subscription plans on component mount
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await SubscriptionRepository.getSubscriptionPlans();
                setPlans(response.data || []);
            } catch (err) {
                console.error('Error fetching subscription plans:', err);
                setError(err instanceof Error ? err.message : 'Failed to load subscription plans');
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    // Calculate monthly price based on periodicity
    const calculateMonthlyPrice = (plan: any) => {
        if (!plan.features || plan.features.length === 0) return 0;

        // Sum up all feature charges
        const totalCharges = plan.features.reduce((sum: number, feature: any) => {
            return sum + (feature.pivot?.charges || 0);
        }, 0);

        // Convert to monthly based on plan periodicity
        if (plan.periodicity_type === 'month') {
            return (totalCharges / (plan.periodicity || 1)).toFixed(2);
        } else if (plan.periodicity_type === 'year') {
            return (totalCharges / 12 / (plan.periodicity || 1)).toFixed(2);
        }

        return totalCharges.toFixed(2);
    };

    // Get display price based on billing cycle
    const getDisplayPrice = (plan: any) => {
        const monthlyPrice = calculateMonthlyPrice(plan);

        if (billingCycle === 'yearly') {
            return (monthlyPrice * 12).toFixed(2);
        }

        return monthlyPrice;
    };

    // Loading state
    if (loading) {
        return (
            <div className="subscriptions-page">
                <div className="container mx-auto px-4 py-12">
                    <div className="loading-state text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-3" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p>{t('subscriptions.loading')}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="subscriptions-page">
                <div className="container mx-auto px-4 py-12">
                    <div className="error-state text-center">
                        <i className="bi bi-exclamation-triangle error-icon mb-3"></i>
                        <h2>{t('subscriptions.error.title')}</h2>
                        <p>{t('subscriptions.error.description')}</p>
                        <button
                            className="px-6 py-3 bg-pink-500 text-white font-bold rounded hover:bg-pink-600 transition-colors mt-3"
                            onClick={() => window.location.reload()}
                        >
                            {t('subscriptions.error.retry')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="subscriptions-page">
            <div className="container mx-auto px-4 py-5">
                <div className="page-header text-center mb-5">
                    <h1 className="page-title">
                        {t('subscriptions.title')}
                    </h1>
                    <p className="page-subtitle">
                        {t('subscriptions.subtitle')}
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="billing-toggle-wrapper">
                    <div className="billing-toggle">
                        <button
                            className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                            onClick={() => setBillingCycle('monthly')}
                        >
                            {t('subscriptions.billing.monthly')}
                        </button>
                        <button
                            className={`toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                            onClick={() => setBillingCycle('yearly')}
                        >
                            {t('subscriptions.billing.yearly')}
                            <span className="save-badge">
                                {t('subscriptions.billing.saveUpTo')}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="plans-grid">
                    {plans.map((plan, index) => {
                        const monthlyPrice = calculateMonthlyPrice(plan);
                        const displayPrice = getDisplayPrice(plan);
                        const isFree = parseFloat(monthlyPrice) === 0;
                        const isPopular = index === Math.floor(plans.length / 2); // Middle plan is popular

                        return (
                            <div key={plan.id} className={`plan-card ${isPopular ? 'popular' : ''}`}>
                                {isPopular && (
                                    <div className="plan-badge">
                                        {t('membership.popular')}
                                    </div>
                                )}
                                <div className="plan-header">
                                    <i className="bi bi-star-fill plan-icon"></i>
                                    <h3 className="plan-name">{plan.name}</h3>
                                </div>

                                <div className="plan-pricing">
                                    {isFree ? (
                                        <div className="price-display">
                                            <span className="price-amount">
                                                {t('subscriptions.price.free')}
                                            </span>
                                            <span className="price-period">
                                                {t('subscriptions.price.forever')}
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="price-display">
                                                <span className="price-currency">$</span>
                                                <span className="price-amount">
                                                    {billingCycle === 'monthly' ? monthlyPrice : monthlyPrice}
                                                </span>
                                                <span className="price-period">
                                                    {t('subscriptions.price.perMonth')}
                                                </span>
                                            </div>
                                            {billingCycle === 'yearly' && (
                                                <div className="billing-info">
                                                    <span className="total-price">
                                                        ${displayPrice} {t('subscriptions.price.billedYearly')}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <ul className="plan-features">
                                    {plan.features && plan.features.map((feature: any) => (
                                        <li key={feature.id}>
                                            <i className="bi bi-check-circle-fill"></i>
                                            <span>
                                                {feature.name}
                                                {feature.consumable && feature.quota && ` (${feature.quota})`}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`plan-btn ${isPopular ? 'btn-premium' : ''}`}
                                    onClick={() => router.push('/signup')}
                                >
                                    {isFree
                                        ? t('subscriptions.button.getCurrentPlan')
                                        : t('subscriptions.button.getStarted')
                                    }
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Comparison Table */}
                {plans.length > 0 && (
                    <div className="comparison-section mt-5">
                        <h2 className="section-title text-center mb-4">
                            {t('subscriptions.comparison.title')}
                        </h2>
                        <div className="comparison-table-wrapper">
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>{t('subscriptions.comparison.feature')}</th>
                                        {plans.map((plan) => (
                                            <th key={plan.id}>
                                                <span className="plan-header-cell">
                                                    <i className="bi bi-star-fill"></i>
                                                    {plan.name}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Get all unique features */}
                                    {Array.from(
                                        new Set(
                                            plans.flatMap((plan: any) =>
                                                plan.features?.map((f: any) => f.name) || []
                                            )
                                        )
                                    ).map((featureName, idx) => (
                                        <tr key={idx}>
                                            <td className="feature-name">{featureName}</td>
                                            {plans.map((plan: any) => {
                                                const feature = plan.features?.find((f: any) => f.name === featureName);
                                                return (
                                                    <td key={plan.id}>
                                                        {feature ? (
                                                            feature.consumable && feature.quota
                                                                ? feature.quota
                                                                : <i className="bi bi-check-circle-fill text-green-500"></i>
                                                        ) : (
                                                            <i className="bi bi-x-circle text-gray-400"></i>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* FAQs Section */}
                <div className="subscription-faqs mt-5">
                    <h2 className="section-title text-center mb-4">
                        {t('subscriptions.faq.title')}
                    </h2>
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-6/12 md:pr-4">
                            <div className="faq-item">
                                <h4>{t('subscriptions.faq.changePlans.question')}</h4>
                                <p>{t('subscriptions.faq.changePlans.answer')}</p>
                            </div>
                            <div className="faq-item">
                                <h4>{t('subscriptions.faq.freeTrial.question')}</h4>
                                <p>{t('subscriptions.faq.freeTrial.answer')}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-6/12 md:pl-4">
                            <div className="faq-item">
                                <h4>{t('subscriptions.faq.cancel.question')}</h4>
                                <p>{t('subscriptions.faq.cancel.answer')}</p>
                            </div>
                            <div className="faq-item">
                                <h4>{t('subscriptions.faq.payment.question')}</h4>
                                <p>{t('subscriptions.faq.payment.answer')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Money Back Guarantee */}
                <div className="guarantee-section text-center mt-5">
                    <i className="bi bi-shield-check guarantee-icon"></i>
                    <h3>{t('subscriptions.guarantee.title')}</h3>
                    <p>{t('subscriptions.guarantee.description')}</p>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionsPage;
