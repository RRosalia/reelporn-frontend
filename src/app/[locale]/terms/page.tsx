'use client';

import React from 'react';
import {useTranslations} from 'next-intl';
import { formatDate, getLastUpdatedDate } from '@/lib/utils/dateFormatter';
import './styles.css';

function TermsOfServicePage() {
    const t = useTranslations('terms');
    const dateFormat = useTranslations()('dateFormat');

    return (
        <div className="legal-page">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-10/12">
                        <div className="page-header mb-5">
                            <h1 className="page-title">{t('title')}</h1>
                            <p className="page-subtitle">{t('lastUpdated')}: {formatDate(getLastUpdatedDate(), dateFormat)}</p>
                        </div>

                        <div className="content-card">
                            <section className="content-section">
                                <h2>1. {t('sections.acceptance.title')}</h2>
                                <p>{t('sections.acceptance.content1')}</p>
                                <p>{t('sections.acceptance.content2')}</p>
                            </section>

                            <section className="content-section">
                                <h2>2. {t('sections.account.title')}</h2>
                                <p>{t('sections.account.intro')}</p>
                                <ul>
                                    <li>{t('sections.account.item1')}</li>
                                    <li>{t('sections.account.item2')}</li>
                                    <li>{t('sections.account.item3')}</li>
                                    <li>{t('sections.account.item4')}</li>
                                    <li>{t('sections.account.item5')}</li>
                                </ul>
                                <p>{t('sections.account.outro')}</p>
                            </section>

                            <section className="content-section">
                                <h2>3. {t('sections.subscription.title')}</h2>
                                <p>{t('sections.subscription.intro')}</p>
                                <ul>
                                    <li>{t('sections.subscription.item1')}</li>
                                    <li>{t('sections.subscription.item2')}</li>
                                    <li>{t('sections.subscription.item3')}</li>
                                    <li>{t('sections.subscription.item4')}</li>
                                    <li>{t('sections.subscription.item5')}</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>4. {t('sections.userContent.title')}</h2>
                                <p>{t('sections.userContent.intro')}</p>
                                <ul>
                                    <li>{t('sections.userContent.item1')}</li>
                                    <li>{t('sections.userContent.item2')}</li>
                                    <li>{t('sections.userContent.item3')}</li>
                                    <li>{t('sections.userContent.item4')}</li>
                                    <li>{t('sections.userContent.item5')}</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>5. {t('sections.prohibited.title')}</h2>
                                <p>{t('sections.prohibited.intro')}</p>
                                <ul>
                                    <li>{t('sections.prohibited.item1')}</li>
                                    <li>{t('sections.prohibited.item2')}</li>
                                    <li>{t('sections.prohibited.item3')}</li>
                                    <li>{t('sections.prohibited.item4')}</li>
                                    <li>{t('sections.prohibited.item5')}</li>
                                    <li>{t('sections.prohibited.item6')}</li>
                                    <li>{t('sections.prohibited.item7')}</li>
                                    <li>{t('sections.prohibited.item8')}</li>
                                    <li>{t('sections.prohibited.item9')}</li>
                                    <li>{t('sections.prohibited.item10')}</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>6. {t('sections.intellectualProperty.title')}</h2>
                                <p>{t('sections.intellectualProperty.content1')}</p>
                                <p>{t('sections.intellectualProperty.content2')}</p>
                            </section>

                            <section className="content-section">
                                <h2>7. {t('sections.privacy.title')}</h2>
                                <p>{t('sections.privacy.content')}</p>
                            </section>

                            <section className="content-section">
                                <h2>8. {t('sections.dmca.title')}</h2>
                                <p>{t('sections.dmca.content')}</p>
                            </section>

                            <section className="content-section">
                                <h2>9. {t('sections.disclaimers.title')}</h2>
                                <p>{t('sections.disclaimers.content1')}</p>
                                <p>{t('sections.disclaimers.content2')}</p>
                            </section>

                            <section className="content-section">
                                <h2>10. {t('sections.liability.title')}</h2>
                                <p>{t('sections.liability.content1')}</p>
                                <p>{t('sections.liability.content2')}</p>
                            </section>

                            <section className="content-section">
                                <h2>11. {t('sections.indemnification.title')}</h2>
                                <p>{t('sections.indemnification.content')}</p>
                            </section>

                            <section className="content-section">
                                <h2>12. {t('sections.termination.title')}</h2>
                                <p>{t('sections.termination.content1')}</p>
                                <p>{t('sections.termination.content2')}</p>
                            </section>

                            <section className="content-section">
                                <h2>13. {t('sections.governingLaw.title')}</h2>
                                <p>{t('sections.governingLaw.content')}</p>
                            </section>

                            <section className="content-section">
                                <h2>14. {t('sections.changes.title')}</h2>
                                <p>{t('sections.changes.content1')}</p>
                                <p>{t('sections.changes.content2')}</p>
                            </section>

                            <section className="content-section">
                                <h2>15. {t('sections.contact.title')}</h2>
                                <p>{t('sections.contact.intro')}</p>
                                <div className="contact-info">
                                    <a href={`mailto:${t('sections.contact.email')}`} className="contact-link">
                                        <i className="bi bi-envelope-fill"></i>
                                        {t('sections.contact.email')}
                                    </a>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TermsOfServicePage;
