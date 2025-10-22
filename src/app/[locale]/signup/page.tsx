'use client';

import React, { useState, useEffect } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import SubscriptionRepository from '@/lib/repositories/SubscriptionRepository';
import CheckoutRepository from '@/lib/repositories/CheckoutRepository';
import AuthRepository, { type RegisterData, type RegisterResponse } from '@/lib/repositories/AuthRepository';
import { GroupedPlans, Plan, PeriodicityType, PaymentMethod } from '@/types/Payment';

function SignupPage() {
    const t = useTranslations();
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    // Plans and payment
    const [groupedPlans, setGroupedPlans] = useState<GroupedPlans[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<string>('');

    // UI state
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    // Fetch subscription plans and payment methods
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch plans and payment methods in parallel
                const [plansResponse, paymentMethodsResponse] = await Promise.all([
                    SubscriptionRepository.getSubscriptionPlans(),
                    CheckoutRepository.getPaymentMethods(),
                ]);

                setGroupedPlans(plansResponse.grouped || []);
                setPaymentMethods(paymentMethodsResponse.data || []);

                // Auto-select first cryptocurrency
                if (paymentMethodsResponse.data && paymentMethodsResponse.data.length > 0) {
                    setSelectedCurrency(paymentMethodsResponse.data[0].code);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            router.push('/account');
        }
    }, [isAuthenticated, authLoading, router]);

    const getPlanForBillingCycle = (group: GroupedPlans): Plan | undefined => {
        const periodicityType = billingCycle === 'monthly' ? PeriodicityType.MONTH : PeriodicityType.YEAR;
        return group.plans.find(plan => plan.periodicity_type === periodicityType);
    };

    const handlePlanSelect = (plan: Plan) => {
        setSelectedPlan(plan);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setValidationErrors({});

        try {
            // Build registration data
            const registerData: RegisterData = {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            };

            // Add plan and payment details if a paid plan is selected
            const isPaidPlan = selectedPlan && selectedPlan.price > 0;
            if (selectedPlan) {
                registerData.plan_id = selectedPlan.id;

                if (isPaidPlan) {
                    registerData.payment_method = 'crypto';
                    registerData.payment_options = {
                        currency: selectedCurrency,
                    };
                }
            }

            // Call register API
            const response: RegisterResponse = await AuthRepository.register(registerData);

            // Store auth token
            localStorage.setItem('auth_token', response.data.token);

            // Store user data (optional - AuthContext might handle this)
            localStorage.setItem('auth_user', JSON.stringify(response.data.user));

            // Redirect based on payment requirement
            if (response.data.requires_payment && response.data.payment) {
                // Redirect to payment status page
                router.push({ pathname: '/payment/[id]', params: { id: response.data.payment.payment_id } });
            } else {
                // Redirect to account/dashboard
                router.push('/account');
            }
        } catch (err: any) {
            console.error('Registration error:', err);

            // Handle validation errors
            if (err.response?.data?.errors) {
                setValidationErrors(err.response.data.errors);
            }

            // Set general error message
            setError(err.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    const getGroupColor = (groupName: string): string => {
        const colors: Record<string, string> = {
            'free': '#6c757d',
            'basic': '#6c757d',
            'premium': '#c2338a',
            'pro': '#f8c537',
            'vip': '#f8c537',
        };
        return colors[groupName.toLowerCase()] || '#c2338a';
    };

    // Show loading while checking authentication or fetching data
    if (authLoading || loading) {
        return (
            <div style={{ background: '#2b2838', minHeight: '100vh' }} className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    // Don't show signup form if already authenticated
    if (isAuthenticated) {
        return null;
    }

    // Show error if data failed to load
    if (error && groupedPlans.length === 0) {
        return (
            <div style={{ background: '#2b2838', minHeight: '100vh' }} className="flex items-center justify-center">
                <div className="text-center text-white">
                    <i className="bi bi-exclamation-triangle text-5xl text-red-500 mb-4"></i>
                    <h2 className="text-2xl font-bold mb-2">{t('subscriptions.error.title')}</h2>
                    <p className="mb-4">{error}</p>
                    <button
                        className="px-6 py-3 bg-pink-500 text-white font-bold rounded hover:bg-pink-600 transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        {t('subscriptions.error.retry')}
                    </button>
                </div>
            </div>
        );
    }

    const isPaidPlan = selectedPlan && selectedPlan.price > 0;

    return (
        <div style={{ background: '#2b2838' }}>
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap">
                    {/* Left Side - Promotional Area */}
                    <div className="w-full md:w-full lg:w-5/12 mb-4">
                        <div className="text-center text-white p-4">
                            <h2 className="mb-4" style={{ color: '#f8c537', fontWeight: 'bold' }}>
                                {t('signup.promo.title')}
                            </h2>

                            <div className="relative mb-4">
                                <div style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '20px',
                                    padding: '40px',
                                    minHeight: '400px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div className="text-center">
                                        <i className="bi bi-camera-reels" style={{ fontSize: '120px', opacity: 0.3 }}></i>
                                        <p className="mt-3" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                            {t('signup.promo.subtitle')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p style={{ fontSize: '16px', fontStyle: 'italic' }}>
                                    {t('signup.promo.description')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Signup Form */}
                    <div className="w-full md:w-full lg:w-7/12">
                        <div className="p-4" style={{ background: '#3a3646', borderRadius: '15px' }}>
                            <h3 className="text-white text-center mb-4">
                                {t('signup.title')}
                            </h3>

                            {/* General Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}

                            {/* Billing Toggle */}
                            <div className="mb-4 flex justify-center">
                                <div className="inline-flex rounded-lg bg-gray-700 p-1">
                                    <button
                                        type="button"
                                        onClick={() => setBillingCycle('monthly')}
                                        className={`px-4 py-2 rounded-md transition-all ${
                                            billingCycle === 'monthly'
                                                ? 'bg-pink-500 text-white'
                                                : 'text-white hover:bg-gray-600'
                                        }`}
                                    >
                                        {t('subscriptions.billing.monthly')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setBillingCycle('yearly')}
                                        className={`px-4 py-2 rounded-md transition-all ${
                                            billingCycle === 'yearly'
                                                ? 'bg-pink-500 text-white'
                                                : 'text-white hover:bg-gray-600'
                                        }`}
                                    >
                                        {t('subscriptions.billing.yearly')}
                                        <span className="ml-1 text-xs">({t('subscriptions.billing.saveUpTo')})</span>
                                    </button>
                                </div>
                            </div>

                            {/* Package Selection */}
                            <div className="mb-4">
                                {groupedPlans.map((group) => {
                                    const plan = getPlanForBillingCycle(group);
                                    if (!plan) return null;
                                    const isFree = plan.price === 0;
                                    const groupColor = getGroupColor(group.group);

                                    return (
                                    <div key={group.group} className="mb-3">
                                        <div
                                            className="p-3 flex justify-between items-center cursor-pointer"
                                            onClick={() => handlePlanSelect(plan)}
                                            style={{
                                                background: selectedPlan?.id === plan.id ? groupColor : '#f8f9fa',
                                                borderRadius: '8px',
                                                color: selectedPlan?.id === plan.id ? 'white' : '#333',
                                                border: `2px solid ${groupColor}`,
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <div>
                                                <strong style={{ fontSize: '18px' }} className="capitalize">{group.group}</strong>
                                                <br />
                                                <small>{plan.name}</small>
                                            </div>
                                            <div className="text-right">
                                                {isFree ? (
                                                    <strong style={{ fontSize: '24px' }}>{t('subscriptions.price.free')}</strong>
                                                ) : (
                                                    <>
                                                        <strong style={{ fontSize: '24px' }}>${(plan.price / 100).toFixed(2)}</strong>
                                                        <small>/{plan.periodicity} {plan.periodicity_type}</small>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>

                            {/* Cryptocurrency Selection (only for paid plans) */}
                            {isPaidPlan && paymentMethods.length > 0 && (
                                <div className="mb-4">
                                    <label className="text-white mb-2 block">
                                        {t('checkout.selectPaymentMethod')}:
                                    </label>
                                    <select
                                        value={selectedCurrency}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
                                        className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                        required
                                    >
                                        {paymentMethods.map((method) => (
                                            <option key={method.code} value={method.code}>
                                                {method.name} ({method.code}) - {method.network}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Registration Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                        placeholder={t('signup.name')}
                                        required
                                    />
                                    {validationErrors.name && (
                                        <p className="text-red-400 text-sm mt-1">{validationErrors.name[0]}</p>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                        placeholder={t('signup.email')}
                                        required
                                    />
                                    {validationErrors.email && (
                                        <p className="text-red-400 text-sm mt-1">{validationErrors.email[0]}</p>
                                    )}
                                </div>

                                <div className="flex flex-wrap mb-4">
                                    <div className="w-full md:w-6/12 mb-3 md:mb-0 md:pr-2">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                            placeholder={t('signup.password')}
                                            required
                                        />
                                        {validationErrors.password && (
                                            <p className="text-red-400 text-sm mt-1">{validationErrors.password[0]}</p>
                                        )}
                                    </div>
                                    <div className="w-full md:w-6/12 md:pl-2">
                                        <input
                                            type="password"
                                            value={passwordConfirmation}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                            className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                            placeholder={t('signup.confirmPassword')}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mb-3"
                                    disabled={submitting}
                                    style={{
                                        background: submitting ? '#6c757d' : '#c2338a',
                                        color: 'white',
                                        padding: '16px',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        cursor: submitting ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {submitting ? t('signup.processing') : (
                                        selectedPlan && isPaidPlan
                                            ? `${t('signup.subscribeFor')} $${(selectedPlan.price / 100).toFixed(2)}`
                                            : t('signup.createAccount')
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="w-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-gray-900 font-bold rounded transition-colors"
                                    disabled={submitting}
                                    style={{
                                        padding: '12px',
                                        fontSize: '16px'
                                    }}
                                >
                                    {t('signup.cancel')}
                                </button>

                                <div className="text-center mt-3">
                                    <small className="text-white">
                                        {t('signup.haveAccount')}{' '}
                                        <Link href='/login' className="text-white" style={{ textDecoration: 'underline' }}>
                                            {t('signup.clickHere')}
                                        </Link>
                                    </small>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;
