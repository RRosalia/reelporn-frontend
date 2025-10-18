'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

function CookiePolicyPage() {
    const t = useTranslations('cookiePolicy');

    const handleManageCookies = () => {
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('openCookieSettings');
            window.dispatchEvent(event);
        }
    };

    return (
        <div style={{ background: 'linear-gradient(135deg, #1a1626 0%, #2b2838 100%)', paddingTop: '80px', paddingBottom: '40px', minHeight: '100vh' }}>
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-10/12">
                        <div className="mb-8">
                            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
                            <p className="text-gray-300 text-xl">{t('subtitle')}</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl">
                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">{t('sections.whatAre.title')}</h2>
                                <p className="text-gray-300 mb-4 leading-relaxed">{t('sections.whatAre.content1')}</p>
                                <p className="text-gray-300 leading-relaxed">{t('sections.whatAre.content2')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">{t('sections.howWeUse.title')}</h2>
                                <p className="text-gray-300 mb-4 leading-relaxed">{t('sections.howWeUse.intro')}</p>
                                <div className="bg-white/5 border-l-4 border-pink-500 p-5 mb-5 rounded-lg">
                                    <h3 className="text-yellow-400 text-xl mb-2 flex items-center gap-2">
                                        <i className="bi bi-shield-check text-pink-500 text-2xl"></i> {t('sections.howWeUse.essential.title')}
                                    </h3>
                                    <p className="text-white/90 m-0">{t('sections.howWeUse.essential.description')}</p>
                                </div>
                                <div className="bg-white/5 border-l-4 border-pink-500 p-5 mb-5 rounded-lg">
                                    <h3 className="text-yellow-400 text-xl mb-2 flex items-center gap-2">
                                        <i className="bi bi-gear text-pink-500 text-2xl"></i> {t('sections.howWeUse.preferences.title')}
                                    </h3>
                                    <p className="text-white/90 m-0">{t('sections.howWeUse.preferences.description')}</p>
                                </div>
                                <div className="bg-white/5 border-l-4 border-pink-500 p-5 mb-5 rounded-lg">
                                    <h3 className="text-yellow-400 text-xl mb-2 flex items-center gap-2">
                                        <i className="bi bi-graph-up text-pink-500 text-2xl"></i> {t('sections.howWeUse.analytics.title')}
                                    </h3>
                                    <p className="text-white/90 m-0">{t('sections.howWeUse.analytics.description')}</p>
                                </div>
                                <div className="bg-white/5 border-l-4 border-pink-500 p-5 mb-5 rounded-lg">
                                    <h3 className="text-yellow-400 text-xl mb-2 flex items-center gap-2">
                                        <i className="bi bi-megaphone text-pink-500 text-2xl"></i> {t('sections.howWeUse.marketing.title')}
                                    </h3>
                                    <p className="text-white/90 m-0">{t('sections.howWeUse.marketing.description')}</p>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">{t('sections.types.title')}</h2>

                                <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-6 mb-6">
                                    <h3 className="text-yellow-400 text-xl font-semibold mb-4">{t('sections.types.essential.title')}</h3>
                                    <p className="text-gray-300 mb-4 leading-relaxed">{t('sections.types.essential.description')}</p>
                                    <ul className="text-white/85 list-disc pl-6 space-y-2">
                                        {t.raw('sections.types.essential.items').map((item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-6 mb-6">
                                    <h3 className="text-yellow-400 text-xl font-semibold mb-4">{t('sections.types.functional.title')}</h3>
                                    <p className="text-gray-300 mb-4 leading-relaxed">{t('sections.types.functional.description')}</p>
                                    <ul className="text-white/85 list-disc pl-6 space-y-2">
                                        {t.raw('sections.types.functional.items').map((item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-6 mb-6">
                                    <h3 className="text-yellow-400 text-xl font-semibold mb-4">{t('sections.types.analyticsType.title')}</h3>
                                    <p className="text-gray-300 mb-4 leading-relaxed">{t('sections.types.analyticsType.description')}</p>
                                    <ul className="text-white/85 list-disc pl-6 space-y-2">
                                        {t.raw('sections.types.analyticsType.items').map((item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-6 mb-6">
                                    <h3 className="text-yellow-400 text-xl font-semibold mb-4">{t('sections.types.advertising.title')}</h3>
                                    <p className="text-gray-300 mb-4 leading-relaxed">{t('sections.types.advertising.description')}</p>
                                    <ul className="text-white/85 list-disc pl-6 space-y-2">
                                        {t.raw('sections.types.advertising.items').map((item: string, index: number) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">{t('sections.thirdParty.title')}</h2>
                                <p className="text-gray-300 mb-4 leading-relaxed">{t('sections.thirdParty.intro1')}</p>
                                <p className="text-gray-300 mb-4 leading-relaxed">{t('sections.thirdParty.intro2')}</p>
                                <ul className="text-white/85 list-disc pl-6 space-y-2">
                                    {t.raw('sections.thirdParty.items').map((item: string, index: number) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">{t('sections.managing.title')}</h2>
                                <p className="text-gray-300 mb-4 leading-relaxed">{t('sections.managing.intro')}</p>
                                <div className="bg-gradient-to-r from-pink-500/10 to-yellow-400/10 border border-pink-500/30 rounded-xl p-8 text-center my-6">
                                    <button
                                        onClick={handleManageCookies}
                                        className="inline-flex items-center bg-gradient-to-r from-pink-500 to-yellow-400 text-white border-none px-10 py-4 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-500/40"
                                    >
                                        <i className="bi bi-gear-fill mr-2"></i>
                                        {t('sections.managing.buttonText')}
                                    </button>
                                    <p className="text-white/80 mt-4 mb-0">{t('sections.managing.buttonDescription')}</p>
                                </div>
                                <p className="text-gray-300 mb-4 leading-relaxed">{t('sections.managing.browserIntro')}</p>
                                <ul className="text-white/85 list-disc pl-6 space-y-2">
                                    <li><strong className="text-white">Chrome:</strong> {t('sections.managing.browsers.chrome')}</li>
                                    <li><strong className="text-white">Firefox:</strong> {t('sections.managing.browsers.firefox')}</li>
                                    <li><strong className="text-white">Safari:</strong> {t('sections.managing.browsers.safari')}</li>
                                    <li><strong className="text-white">Edge:</strong> {t('sections.managing.browsers.edge')}</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">{t('sections.duration.title')}</h2>
                                <p className="text-gray-300 mb-4 leading-relaxed">{t('sections.duration.intro')}</p>
                                <ul className="text-white/85 list-disc pl-6 space-y-3">
                                    <li>
                                        <strong className="text-white">{t('sections.duration.session.title')}:</strong> {t('sections.duration.session.description')}
                                    </li>
                                    <li>
                                        <strong className="text-white">{t('sections.duration.persistent.title')}:</strong> {t('sections.duration.persistent.description')}
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">{t('sections.updates.title')}</h2>
                                <p className="text-gray-300 leading-relaxed">{t('sections.updates.content')}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">{t('sections.contact.title')}</h2>
                                <p className="text-gray-300 mb-4 leading-relaxed">{t('sections.contact.intro')}</p>
                                <div className="inline-block">
                                    <a
                                        href={`mailto:${t('sections.contact.email')}`}
                                        className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors text-lg"
                                    >
                                        <i className="bi bi-envelope-fill"></i>
                                        {t('sections.contact.email')}
                                    </a>
                                </div>
                            </section>

                            <section className="mb-0">
                                <p className="text-gray-500 text-sm">
                                    {t('lastUpdated')}: {new Date().toLocaleDateString()}
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CookiePolicyPage;
