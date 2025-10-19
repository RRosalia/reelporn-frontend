'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import SubscriptionRepository from '@/lib/repositories/SubscriptionRepository';
import { GroupedPlans, Plan, PeriodicityType } from '@/types/Payment';
import './styles.css';

function SubscriptionsPage() {const t = useTranslations();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const router = useRouter();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [groupedPlans, setGroupedPlans] = useState<GroupedPlans[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch subscription plans on component mount
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await SubscriptionRepository.getSubscriptionPlans();
                setGroupedPlans(response.grouped || []);
            } catch (err) {
                console.error('Error fetching subscription plans:', err);
                setError(err instanceof Error ? err.message : 'Failed to load subscription plans');
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    // Get the plan for the current billing cycle from a group
    const getPlanForBillingCycle = (group: GroupedPlans): Plan | undefined => {
        const periodicityType = billingCycle === 'monthly' ? PeriodicityType.MONTH : PeriodicityType.YEAR;
        return group.plans.find(plan => plan.periodicity_type === periodicityType);
    };

    // Calculate discount percentage when choosing yearly over monthly
    const calculateYearlyDiscount = (group: GroupedPlans): number => {
        const monthlyPlan = group.plans.find(p => p.periodicity_type === PeriodicityType.MONTH);
        const yearlyPlan = group.plans.find(p => p.periodicity_type === PeriodicityType.YEAR);

        if (!monthlyPlan || !yearlyPlan) return 0;

        // Prices are in cents, convert to dollars
        const monthlyPrice = monthlyPlan.price / 100;
        const yearlyPrice = yearlyPlan.price / 100;

        // Calculate what 12 months would cost at monthly rate
        const yearlyAtMonthlyRate = monthlyPrice * 12;

        // Calculate discount percentage
        if (yearlyAtMonthlyRate === 0) return 0;
        const discount = ((yearlyAtMonthlyRate - yearlyPrice) / yearlyAtMonthlyRate) * 100;

        return Math.round(discount);
    };

    // Get monthly equivalent price for display (prices are in cents from backend)
    const getMonthlyEquivalentPrice = (plan: Plan): string => {
        // Convert cents to dollars
        const price = plan.price / 100;

        if (plan.periodicity_type === PeriodicityType.MONTH) {
            return price.toFixed(2);
        } else if (plan.periodicity_type === PeriodicityType.YEAR) {
            return (price / 12).toFixed(2);
        }

        return price.toFixed(2);
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
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        {t('subscriptions.title')}
                    </h1>
                    <p className="text-lg md:text-xl text-white max-w-2xl mx-auto" style={{ opacity: 0.95 }}>
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
                    {groupedPlans.map((group, index) => {
                        const plan = getPlanForBillingCycle(group);
                        if (!plan) return null;

                        const monthlyEquivalentPrice = getMonthlyEquivalentPrice(plan);
                        const yearlyDiscount = calculateYearlyDiscount(group);
                        const isFree = plan.price === 0; // Price in cents, 0 is still 0
                        const isPopular = index === Math.floor(groupedPlans.length / 2); // Middle plan is popular

                        return (
                            <div key={group.group} className={`plan-card ${isPopular ? 'popular' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                {isPopular && (
                                    <div className="plan-badge" style={{ top: '10px', right: '10px' }}>
                                        {t('membership.popular')}
                                    </div>
                                )}
                                {billingCycle === 'yearly' && yearlyDiscount > 0 && !isFree && !isPopular && (
                                    <div className="plan-badge" style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        top: '10px',
                                        right: '10px'
                                    }}>
                                        Save {yearlyDiscount}%
                                    </div>
                                )}
                                {billingCycle === 'yearly' && yearlyDiscount > 0 && !isFree && isPopular && (
                                    <div className="plan-badge" style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        top: '10px',
                                        left: '10px'
                                    }}>
                                        Save {yearlyDiscount}%
                                    </div>
                                )}
                                <div className="plan-header">
                                    <i className="bi bi-star-fill plan-icon"></i>
                                    <h3 className="plan-name">{group.group.charAt(0).toUpperCase() + group.group.slice(1)}</h3>
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
                                                    {monthlyEquivalentPrice}
                                                </span>
                                                <span className="price-period">
                                                    {t('subscriptions.price.perMonth')}
                                                </span>
                                            </div>
                                            {billingCycle === 'yearly' && (
                                                <div className="billing-info">
                                                    <span className="total-price">
                                                        ${(plan.price / 100).toFixed(2)} {t('subscriptions.price.billedYearly')}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <ul className="plan-features" style={{ flexGrow: 1 }}>
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
                                    onClick={() => {
                                        if (isFree) {
                                            router.push('/signup');
                                        } else {
                                            router.push({ pathname: '/subscriptions/[id]/checkout', params: { id: plan.id.toString() } });
                                        }
                                    }}
                                    style={{
                                        background: isPopular
                                            ? 'linear-gradient(135deg, #c2338a 0%, #e74c3c 100%)'
                                            : isFree
                                            ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                                            : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        padding: '14px 28px',
                                        fontSize: '16px',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: isPopular
                                            ? '0 8px 20px rgba(194, 51, 138, 0.4)'
                                            : '0 4px 12px rgba(0, 0, 0, 0.15)',
                                        transform: 'translateY(0)',
                                        width: '100%'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = isPopular
                                            ? '0 12px 28px rgba(194, 51, 138, 0.5)'
                                            : '0 6px 16px rgba(0, 0, 0, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = isPopular
                                            ? '0 8px 20px rgba(194, 51, 138, 0.4)'
                                            : '0 4px 12px rgba(0, 0, 0, 0.15)';
                                    }}
                                >
                                    {isFree
                                        ? t('subscriptions.button.getCurrentPlan')
                                        : (isPopular ? '🚀 ' : '✨ ') + t('subscriptions.button.getStarted')
                                    }
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Comparison Table */}
                {groupedPlans.length > 0 && (
                    <div className="comparison-section mt-5">
                        <h2 className="section-title text-3xl md:text-4xl font-bold text-center mb-4">
                            {t('subscriptions.comparison.title')}
                        </h2>
                        <div className="comparison-table-wrapper">
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>{t('subscriptions.comparison.feature')}</th>
                                        {groupedPlans.map((group) => {
                                            const plan = getPlanForBillingCycle(group);
                                            return (
                                                <th key={group.group}>
                                                    <span className="plan-header-cell">
                                                        <i className="bi bi-star-fill"></i>
                                                        {group.group.charAt(0).toUpperCase() + group.group.slice(1)}
                                                    </span>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Get all unique features */}
                                    {Array.from(
                                        new Set(
                                            groupedPlans.flatMap((group) => {
                                                const plan = getPlanForBillingCycle(group);
                                                return plan?.features?.map((f: any) => f.name) || [];
                                            })
                                        )
                                    ).map((featureName, idx) => (
                                        <tr key={idx}>
                                            <td className="feature-name">{featureName}</td>
                                            {groupedPlans.map((group) => {
                                                const plan = getPlanForBillingCycle(group);
                                                const feature = plan?.features?.find((f: any) => f.name === featureName);
                                                return (
                                                    <td key={group.group}>
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
                                <h4>{t('subscriptions.faq.cancel.question')}</h4>
                                <p>{t('subscriptions.faq.cancel.answer')}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-6/12 md:pl-4">
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
