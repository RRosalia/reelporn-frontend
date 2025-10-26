'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function WelcomePage() {
  const t = useTranslations('welcome');
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to home if user is not authenticated
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleUpgrade = () => {
    // TODO: Navigate to pricing/plans page
    router.push('/pricing');
  };

  const handleContinue = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Panel - Welcome Message */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {t('welcomeTitle', { name: user.name || 'there' })}
              </h1>
              <p className="text-gray-600 text-lg">
                {t('accountCreated')}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">{t('freeAccessTitle')}</p>
                  <p className="text-gray-600 text-sm">{t('freeAccessDesc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">{t('limitedContentTitle')}</p>
                  <p className="text-gray-600 text-sm">{t('limitedContentDesc')}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              {t('continueFree')}
            </button>
          </div>

          {/* Right Panel - Upgrade Offer */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 md:p-12 flex flex-col justify-center text-white">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">{t('unlockPremium')}</h2>
              <p className="text-purple-100">{t('premiumSubtitle')}</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-purple-50">{t('benefit1')}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-purple-50">{t('benefit2')}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-purple-50">{t('benefit3')}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-purple-50">{t('benefit4')}</span>
              </div>
            </div>

            <button
              onClick={handleUpgrade}
              className="w-full py-3 px-6 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-colors shadow-lg"
            >
              {t('upgradeToPremium')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
