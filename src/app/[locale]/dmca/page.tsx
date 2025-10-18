'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import './styles.css';

function DMCAPage() {
    const t = useTranslations('dmca');

    return (
        <div className="dmca-page">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-10/12">
                        <div className="page-header mb-5">
                            <h1 className="page-title">{t('title')}</h1>
                            <p className="page-subtitle">{t('subtitle')}</p>
                        </div>

                        <div className="content-card">
                            <section className="content-section">
                                <h2>{t('sections.notification.title')}</h2>
                                <p>{t('sections.notification.content')}</p>
                            </section>

                            <section className="content-section">
                                <h2>{t('sections.filing.title')}</h2>
                                <p>{t('sections.filing.intro')}</p>
                                <ol>
                                    <li>{t('sections.filing.item1')}</li>
                                    <li>{t('sections.filing.item2')}</li>
                                    <li>{t('sections.filing.item3')}</li>
                                    <li>{t('sections.filing.item4')}</li>
                                    <li>{t('sections.filing.item5')}</li>
                                    <li>{t('sections.filing.item6')}</li>
                                </ol>
                            </section>

                            <section className="content-section">
                                <h2>{t('sections.agent.title')}</h2>
                                <div className="contact-box">
                                    <p>{t('sections.agent.intro')}</p>
                                    <div className="contact-info">
                                        <div className="contact-item">
                                            <i className="bi bi-envelope-fill"></i>
                                            <a href={`mailto:${t('sections.agent.email')}`}>{t('sections.agent.email')}</a>
                                        </div>
                                        <div className="contact-item">
                                            <i className="bi bi-building"></i>
                                            <span>{t('sections.agent.name')}<br />{t('sections.agent.department')}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="content-section">
                                <h2>{t('sections.counter.title')}</h2>
                                <p>{t('sections.counter.intro')}</p>
                                <ol>
                                    <li>{t('sections.counter.item1')}</li>
                                    <li>{t('sections.counter.item2')}</li>
                                    <li>{t('sections.counter.item3')}</li>
                                    <li>{t('sections.counter.item4')}</li>
                                    <li>{t('sections.counter.item5')}</li>
                                </ol>
                            </section>

                            <section className="content-section">
                                <h2>{t('sections.repeat.title')}</h2>
                                <p>{t('sections.repeat.content')}</p>
                            </section>

                            <section className="content-section">
                                <h2>{t('sections.notice.title')}</h2>
                                <div className="notice-box">
                                    <p>{t('sections.notice.content')}</p>
                                </div>
                            </section>

                            <section className="content-section">
                                <p className="text-gray-400">
                                    {t('sections.lastUpdated')}: {new Date().toLocaleDateString()}
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DMCAPage;