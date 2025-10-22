'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import './styles.css';

function ContactPage() {
    const t = useTranslations('contactPage');

    return (
        <div className="contact-page">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-10/12">
                        <div className="page-header mb-5">
                            <h1 className="page-title">{t('title')}</h1>
                            <p className="page-subtitle">{t('subtitle')}</p>
                        </div>

                        <div className="mb-5">
                            <p className="text-center text-lg text-gray-300">
                                {t('description')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {/* Email Support */}
                            <div className="contact-card">
                                <div className="contact-icon">
                                    <i className="bi bi-envelope-fill"></i>
                                </div>
                                <h3 className="contact-card-title">{t('email.title')}</h3>
                                <p className="contact-card-description">{t('email.description')}</p>
                                <a
                                    href={`mailto:${t('email.address')}`}
                                    className="contact-email-link"
                                >
                                    {t('email.address')}
                                </a>
                                <p className="contact-note">{t('email.responseTime')}</p>
                            </div>

                            {/* DMCA */}
                            <div className="contact-card">
                                <div className="contact-icon">
                                    <i className="bi bi-shield-fill-exclamation"></i>
                                </div>
                                <h3 className="contact-card-title">{t('dmca.title')}</h3>
                                <p className="contact-card-description">{t('dmca.description')}</p>
                                <a
                                    href={`mailto:${t('dmca.address')}`}
                                    className="contact-email-link"
                                >
                                    {t('dmca.address')}
                                </a>
                                <p className="contact-note">{t('dmca.note')}</p>
                            </div>

                            {/* Support Hours */}
                            <div className="contact-card">
                                <div className="contact-icon">
                                    <i className="bi bi-clock-fill"></i>
                                </div>
                                <h3 className="contact-card-title">{t('hours.title')}</h3>
                                <p className="contact-card-description mb-3">{t('hours.description')}</p>
                                <div className="hours-list">
                                    <p><i className="bi bi-calendar-check"></i> {t('hours.weekdays')}</p>
                                </div>
                            </div>

                            {/* FAQ */}
                            <div className="contact-card">
                                <div className="contact-icon">
                                    <i className="bi bi-question-circle-fill"></i>
                                </div>
                                <h3 className="contact-card-title">{t('faq.title')}</h3>
                                <p className="contact-card-description">
                                    {t('faq.description')}{' '}
                                    <Link href="/faq" className="faq-link">
                                        {t('faq.link')}
                                    </Link>{' '}
                                    {t('faq.suffix')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
