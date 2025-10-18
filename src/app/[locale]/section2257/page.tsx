'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import './styles.css';

function Section2257Page() {
    const t = useTranslations('section2257');

    return (
        <div className="section2257-page">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-10/12">
                        <div className="page-header mb-5">
                            <h1 className="page-title">{t('title')}</h1>
                            <p className="page-subtitle">{t('subtitle')}</p>
                        </div>

                        <div className="content-card">
                            <section className="content-section">
                                <h2>{t('sections.compliance.title')}</h2>
                                <p>{t('sections.compliance.content1')}</p>
                                <p>{t('sections.compliance.content2')}</p>
                            </section>

                            <section className="content-section">
                                <h2>{t('sections.custodian.title')}</h2>
                                <div className="custodian-box">
                                    <p>{t('sections.custodian.intro')}</p>
                                    <p><strong>{t('sections.custodian.custodianTitle')}</strong></p>
                                    <div className="custodian-info">
                                        <p>
                                            {t('sections.custodian.name')}<br />
                                            {t('sections.custodian.role')}<br />
                                            {t('sections.custodian.department')}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="content-section">
                                <h2>{t('sections.producers.title')}</h2>
                                <p>{t('sections.producers.intro')}</p>
                                <ul>
                                    <li>{t('sections.producers.item1')}</li>
                                    <li>{t('sections.producers.item2')}</li>
                                    <li>{t('sections.producers.item3')}</li>
                                    <li>{t('sections.producers.item4')}</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>{t('sections.original.title')}</h2>
                                <p>{t('sections.original.intro1')}</p>
                                <p>{t('sections.original.intro2')}</p>
                                <ul>
                                    <li>{t('sections.original.item1')}</li>
                                    <li>{t('sections.original.item2')}</li>
                                    <li>{t('sections.original.item3')}</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>{t('sections.exemptions.title')}</h2>
                                <p>{t('sections.exemptions.intro')}</p>
                                <ul>
                                    <li>{t('sections.exemptions.item1')}</li>
                                    <li>{t('sections.exemptions.item2')}</li>
                                    <li>{t('sections.exemptions.item3')}</li>
                                    <li>{t('sections.exemptions.item4')}</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>{t('sections.legal.title')}</h2>
                                <div className="legal-box">
                                    <p>{t('sections.legal.content1')}</p>
                                    <p>{t('sections.legal.content2')}</p>
                                </div>
                            </section>

                            <section className="content-section">
                                <h2>{t('sections.contact.title')}</h2>
                                <p>{t('sections.contact.intro')}</p>
                                <div className="contact-info">
                                    <a href={`mailto:${t('sections.contact.email')}`} className="contact-link">
                                        <i className="bi bi-envelope-fill"></i>
                                        {t('sections.contact.email')}
                                    </a>
                                </div>
                            </section>

                            <section className="content-section">
                                <p className="text-muted">
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

export default Section2257Page;