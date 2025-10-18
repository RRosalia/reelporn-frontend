'use client';

import React, { useState, useEffect } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

function SignupPage() {
    const t = useTranslations();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const [expandedPackage, setExpandedPackage] = useState<any | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('creditcard');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            router.push('/account');
        }
    }, [isAuthenticated, authLoading, router]);

    const packages = [
        {
            id: 'noads',
            name: t('membership.noAds.title'),
            description: t('membership.noAds.description'),
            fromPrice: '3.95',
            durations: [
                {
                    id: 'noads-1m',
                    duration: '1',
                    label: t('membership.duration.1month'),
                    price: '4.95',
                    monthlyPrice: '4.95',
                    discount: null
                },
                {
                    id: 'noads-6m',
                    duration: '6',
                    label: t('membership.duration.6months'),
                    price: '23.70',
                    monthlyPrice: '3.95',
                    discount: '20%'
                },
                {
                    id: 'noads-12m',
                    duration: '12',
                    label: t('membership.duration.12months'),
                    price: '35.40',
                    monthlyPrice: '2.95',
                    discount: '40%',
                    badge: t('membership.bestValue')
                }
            ],
            features: [
                t('membership.feature.noAds'),
                t('membership.feature.basicSupport')
            ],
            color: '#6c757d'
        },
        {
            id: 'premium',
            name: t('membership.premium.title'),
            description: t('membership.premium.description'),
            fromPrice: '9.95',
            durations: [
                {
                    id: 'premium-1m',
                    duration: '1',
                    label: t('membership.duration.1month'),
                    price: '14.95',
                    monthlyPrice: '14.95',
                    discount: null
                },
                {
                    id: 'premium-6m',
                    duration: '6',
                    label: t('membership.duration.6months'),
                    price: '59.70',
                    monthlyPrice: '9.95',
                    discount: '33%',
                    badge: t('membership.popular')
                },
                {
                    id: 'premium-12m',
                    duration: '12',
                    label: t('membership.duration.12months'),
                    price: '89.40',
                    monthlyPrice: '7.45',
                    discount: '50%',
                    badge: t('membership.bestValue')
                }
            ],
            features: [
                t('membership.feature.noAds'),
                t('membership.feature.hdStreaming'),
                t('membership.feature.downloadVideos'),
                t('membership.feature.exclusiveContent'),
                t('membership.feature.prioritySupport')
            ],
            color: '#c2338a'
        },
        {
            id: 'premiumplus',
            name: t('membership.premiumPlus.title'),
            description: t('membership.premiumPlus.description'),
            fromPrice: '12.45',
            durations: [
                {
                    id: 'premiumplus-12m',
                    duration: '12',
                    label: t('membership.duration.12months'),
                    price: '149.40',
                    monthlyPrice: '12.45',
                    discount: null,
                    badge: t('membership.exclusive')
                }
            ],
            features: [
                t('membership.feature.noAds'),
                t('membership.feature.4kStreaming'),
                t('membership.feature.unlimitedDownloads'),
                t('membership.feature.exclusiveContent'),
                t('membership.feature.earlyAccess'),
                t('membership.feature.vipSupport'),
                t('membership.feature.customPlaylist')
            ],
            color: '#f8c537'
        }
    ];

    const paymentMethods = [
        {
            id: 'creditcard',
            name: t('signup.creditCard'),
            logos: ['💳']
        },
        {
            id: 'crypto',
            name: 'Crypto',
            logos: ['₿', 'Ξ', '◊']
        },
        {
            id: 'paypal',
            name: 'PayPal',
            logos: ['P']
        }
    ];

    const handlePackageClick = (packageId: any) => {
        if (expandedPackage === packageId) {
            setExpandedPackage(null);
        } else {
            setExpandedPackage(packageId);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted', { selectedPlan, paymentMethod });
    };

    const getLocalizedPath = (path: string) => {
        return locale === 'en' ? path : `/${locale}${path}`;
    };

    const getSelectedPlanDetails = () => {
        for (const pkg of packages) {
            for (const duration of pkg.durations) {
                if (duration.id === selectedPlan) {
                    return duration;
                }
            }
        }
        return null;
    };

    const selectedPlanDetails = getSelectedPlanDetails();

    // Show loading while checking authentication
    if (authLoading) {
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

    return (
        <div style={{ background: '#2b2838' }}>
            <div className="container mx-auto px-4 py-5">
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

                            {/* Package Selection */}
                            <div className="mb-4">
                                {packages.map((pkg) => (
                                    <div key={pkg.id} className="mb-3">
                                        {/* Package Header */}
                                        <div
                                            className="p-3 flex justify-between items-center"
                                            onClick={() => handlePackageClick(pkg.id)}
                                            style={{
                                                background: expandedPackage === pkg.id ? pkg.color : '#f8f9fa',
                                                borderRadius: expandedPackage === pkg.id ? '8px 8px 0 0' : '8px',
                                                cursor: 'pointer',
                                                color: expandedPackage === pkg.id ? 'white' : '#333',
                                                border: `2px solid ${pkg.color}`,
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <div>
                                                <strong style={{ fontSize: '18px' }}>{pkg.name}</strong>
                                                <br />
                                                <small>{pkg.description}</small>
                                            </div>
                                            <div className="text-right">
                                                <div>
                                                    <small>{t('membership.from')}</small>
                                                </div>
                                                <strong style={{ fontSize: '24px' }}>€{pkg.fromPrice}</strong>
                                                <small>/{t('membership.perMonth')}</small>
                                            </div>
                                        </div>

                                        {/* Expanded Duration Options */}
                                        {expandedPackage === pkg.id && (
                                            <div style={{
                                                background: '#f8f9fa',
                                                borderRadius: '0 0 8px 8px',
                                                border: `2px solid ${pkg.color}`,
                                                borderTop: 'none',
                                                padding: '15px'
                                            }}>
                                                {/* Duration Options */}
                                                {pkg.durations.map((duration) => (
                                                    <div
                                                        key={duration.id}
                                                        className="mb-2 p-3 flex justify-between items-center"
                                                        onClick={() => setSelectedPlan(duration.id)}
                                                        style={{
                                                            background: selectedPlan === duration.id ? pkg.color : 'white',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            color: selectedPlan === duration.id ? 'white' : '#333',
                                                            position: 'relative',
                                                            border: `2px solid ${selectedPlan === duration.id ? pkg.color : '#dee2e6'}`
                                                        }}
                                                    >
                                                        <div>
                                                            <strong>{duration.label}</strong>
                                                            <br />
                                                            <small>
                                                                {t('signup.billedAt')} €{duration.price} (incl. BTW)
                                                            </small>
                                                        </div>
                                                        <div className="text-right">
                                                            <strong style={{ fontSize: '20px' }}>€{duration.monthlyPrice}</strong>
                                                            <small>/{t('membership.perMonth')}</small>
                                                            {duration.discount && (
                                                                <div style={{
                                                                    fontSize: '12px',
                                                                    color: selectedPlan === duration.id ? 'white' : '#28a745',
                                                                    fontWeight: 'bold'
                                                                }}>
                                                                    {t('membership.save')} {duration.discount}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {duration.badge && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '-10px',
                                                                right: '10px',
                                                                background: pkg.color,
                                                                color: 'white',
                                                                padding: '4px 12px',
                                                                borderRadius: '12px',
                                                                fontSize: '11px',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {duration.badge}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {/* Features List */}
                                                <div className="mt-3 p-3" style={{ background: 'white', borderRadius: '6px' }}>
                                                    <strong className="text-dark mb-2 block">
                                                        {t('membership.features')}:
                                                    </strong>
                                                    <ul className="mb-0" style={{ paddingLeft: '20px' }}>
                                                        {pkg.features.map((feature, idx) => (
                                                            <li key={idx} className="text-dark mb-1">
                                                                <small>{feature}</small>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Payment Methods */}
                            <div className="mb-4">
                                <label className="text-white mb-2">
                                    {t('signup.paymentMethod')}:
                                </label>
                                <div className="flex gap-2 mb-3">
                                    {paymentMethods.map((method) => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            className="flex-1 flex flex-col items-center"
                                            onClick={() => setPaymentMethod(method.id)}
                                            style={{
                                                background: paymentMethod === method.id ? 'white' : 'transparent',
                                                color: paymentMethod === method.id ? '#333' : 'white',
                                                border: '2px solid white',
                                                fontWeight: 'bold',
                                                padding: '12px 8px',
                                                minHeight: '80px'
                                            }}
                                        >
                                            <div className="flex gap-1 mb-2" style={{ fontSize: '24px' }}>
                                                {method.logos.map((logo, idx) => (
                                                    <span key={idx}>{logo}</span>
                                                ))}
                                            </div>
                                            <small style={{ fontSize: '12px' }}>{method.name}</small>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                        placeholder={t('signup.email')}
                                        required
                                    />
                                </div>

                                <div className="flex flex-wrap mb-4">
                                    <div className="w-full md:w-6/12 mb-3 md:mb-0 md:pr-2">
                                        <input
                                            type="password"
                                            className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                            placeholder={t('signup.password')}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-6/12 md:pl-2">
                                        <input
                                            type="password"
                                            className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                            placeholder={t('signup.confirmPassword')}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mb-3"
                                    disabled={!selectedPlan}
                                    style={{
                                        background: selectedPlan ? '#c2338a' : '#6c757d',
                                        color: 'white',
                                        padding: '12px',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        cursor: selectedPlan ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    {selectedPlanDetails
                                        ? `${t('signup.subscribeFor')} €${selectedPlanDetails.price}`
                                        : t('signup.selectPlan')
                                    }
                                </button>

                                <button
                                    type="button"
                                    className="w-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-gray-900 font-bold rounded transition-colors"
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
