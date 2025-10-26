'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
    UnauthorizedException,
    ValidationException,
    RateLimitException,
    NetworkException,
    ServerException
} from '@/lib/api/exceptions';
import { useTranslations } from 'next-intl';

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations();
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Get redirect URL and message from query params
    const redirectTo = searchParams.get('redirect') || '/';
    const messageType = searchParams.get('message');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, authLoading, router, redirectTo]);

    // Show messages based on URL parameters
    useEffect(() => {
        if (messageType === 'loginRequired') {
            setInfo(t('login.info.loginRequired'));
        } else if (messageType === 'logoutSuccess') {
            setInfo(t('login.info.logoutSuccess'));
        }
    }, [messageType, t]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setInfo('');
        setIsLoading(true);

        try {
            // Call auth context to login
            await login(email, password);

            // Redirect to intended location or home page
            router.push(redirectTo);
        } catch (err: unknown) {
            // Handle custom exceptions
            if (err instanceof RateLimitException) {
                setError(t('login.error.rateLimitExceeded'));
            } else if (err instanceof UnauthorizedException) {
                setError(t('login.error.invalidCredentials'));
            } else if (err instanceof ValidationException) {
                // Get first validation error message
                const firstError = Object.values(err.errors)[0]?.[0];
                setError(firstError || t('login.error.validationFailed'));
            } else if (err instanceof NetworkException) {
                setError(t('login.error.network'));
            } else if (err instanceof ServerException) {
                setError(t('login.error.server'));
            } else {
                setError(t('login.error.generic'));
            }
        } finally {
            setIsLoading(false);
        }
    };

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

    // Don't show login form if already authenticated
    if (isAuthenticated) {
        return null;
    }

    return (
        <div style={{ background: '#2b2838' }}>
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap items-center min-h-[80vh]">
                    {/* Left Side - Welcome Back Area */}
                    <div className="w-full lg:w-5/12 md:w-full mb-4">
                        <div className="text-center text-white p-4">
                            <h1 className="mb-4" style={{ color: '#f8c537', fontWeight: 'bold', fontSize: '48px' }}>
                                {t('login.welcomeBack')}
                            </h1>

                            {/* Welcome illustration */}
                            <div className="relative mb-4">
                                <div className="flex flex-col items-center justify-center rounded-[20px] p-[60px_40px] min-h-[350px]" style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                }}>
                                    <div className="text-center">
                                        <i className="bi bi-person-circle" style={{ fontSize: '140px', opacity: 0.3 }}></i>
                                        <h3 className="mt-4" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                            {t('login.hero.title')}
                                        </h3>
                                        <p className="mt-2" style={{ fontSize: '16px', opacity: 0.9 }}>
                                            {t('login.hero.subtitle')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p style={{ fontSize: '18px', fontStyle: 'italic', lineHeight: '1.6' }}>
                                    {t('login.hero.description')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full lg:w-7/12 md:w-full">
                        <div className="p-5 rounded-[15px] max-w-[500px] mx-auto" style={{ background: '#3a3646' }}>
                            <h3 className="text-white text-center mb-4 text-[28px]">
                                {t('login.signIn')}
                            </h3>

                            <form onSubmit={handleSubmit}>
                                {/* Info Message */}
                                {info && (
                                    <div className="bg-blue-500/10 border border-blue-500 text-blue-500 px-4 py-3 rounded mb-3" role="alert">
                                        {info}
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-3" role="alert">
                                        {error}
                                    </div>
                                )}

                                {/* Email */}
                                <div className="mb-3">
                                    <label className="text-white mb-2 block">
                                        {t('login.email')}
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                        placeholder={t('login.emailPlaceholder')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <label className="text-white mb-2 block">
                                        {t('login.password')}
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-3 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-pink-500"
                                        placeholder={t('login.passwordPlaceholder')}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center">
                                        <input
                                            className="mr-2 h-4 w-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                                            type="checkbox"
                                            id="rememberMe"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <label className="text-white" htmlFor="rememberMe">
                                            {t('login.rememberMe')}
                                        </label>
                                    </div>
                                    <Link href={'/forgot-password' as any} className="text-white underline">
                                        {t('login.forgotPassword')}
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full mb-4 py-[14px] text-white text-lg font-bold rounded border-none disabled:opacity-60"
                                    disabled={isLoading}
                                    style={{ background: '#c2338a' }}
                                >
                                    {isLoading
                                        ? t('login.loading')
                                        : t('login.submit')
                                    }
                                </button>

                                {/* Sign Up Link */}
                                <div className="text-center mt-3">
                                    <p className="text-white mb-2">
                                        {t('login.noAccount')}
                                    </p>
                                    <Link
                                        href="/signup"
                                        className="block w-full py-3 border-2 border-white text-white rounded hover:bg-white hover:text-gray-900 transition-colors"
                                    >
                                        {t('login.createAccount')}
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
