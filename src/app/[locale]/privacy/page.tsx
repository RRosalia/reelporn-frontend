'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

function PrivacyPolicyPage() {
    const t = useTranslations('privacy');

    return (
        <div className="legal-page">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-10/12">
                        <div className="page-header mb-5">
                            <h1 className="page-title">{t('title')}</h1>
                            <p className="page-subtitle">{t('lastUpdated')}: {new Date().toLocaleDateString()}</p>
                        </div>

                        <div className="content-card">
                            <section className="content-section">
                                <h2>1. {t('sections.infoCollect.title')}</h2>
                                <h3>{t('sections.infoCollect.provideTitle')}</h3>
                                <ul>
                                    <li>{t('sections.infoCollect.provide1')}</li>
                                    <li>{t('sections.infoCollect.provide2')}</li>
                                    <li>{t('sections.infoCollect.provide3')}</li>
                                    <li>{t('sections.infoCollect.provide4')}</li>
                                    <li>{t('sections.infoCollect.provide5')}</li>
                                </ul>

                                <h3>{t('sections.infoCollect.autoTitle')}</h3>
                                <ul>
                                    <li>{t('sections.infoCollect.auto1')}</li>
                                    <li>{t('sections.infoCollect.auto2')}</li>
                                    <li>{t('sections.infoCollect.auto3')}</li>
                                    <li>{t('sections.infoCollect.auto4')}</li>
                                    <li>{t('sections.infoCollect.auto5')}</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>2. {t('sections.infoUse.title')}</h2>
                                <p>{t('sections.infoUse.intro')}</p>
                                <ul>
                                    <li>{t('sections.infoUse.item1')}</li>
                                    <li>{t('sections.infoUse.item2')}</li>
                                    <li>{t('sections.infoUse.item3')}</li>
                                    <li>{t('sections.infoUse.item4')}</li>
                                    <li>{t('sections.infoUse.item5')}</li>
                                    <li>{t('sections.infoUse.item6')}</li>
                                    <li>{t('sections.infoUse.item7')}</li>
                                    <li>{t('sections.infoUse.item8')}</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>3. {t('sections.infoSharing.title')}</h2>
                                <p>{t('sections.infoSharing.intro')}</p>
                                <ul>
                                    <li>{t('sections.infoSharing.item1')}</li>
                                    <li>{t('sections.infoSharing.item2')}</li>
                                    <li>{t('sections.infoSharing.item3')}</li>
                                    <li>{t('sections.infoSharing.item4')}</li>
                                    <li>{t('sections.infoSharing.item5')}</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>4. {t('sections.dataSecurity.title')}</h2>
                                <p>{t('sections.dataSecurity.intro')}</p>
                                <ul>
                                    <li>{t('sections.dataSecurity.item1')}</li>
                                    <li>{t('sections.dataSecurity.item2')}</li>
                                    <li>{t('sections.dataSecurity.item3')}</li>
                                    <li>{t('sections.dataSecurity.item4')}</li>
                                    <li>{t('sections.dataSecurity.item5')}</li>
                                </ul>
                                <p>{t('sections.dataSecurity.outro')}</p>
                            </section>

                            <section className="content-section">
                                <h2>5. {t('sections.privacyRights.title')}</h2>
                                <p>{t('sections.privacyRights.intro')}</p>
                                <ul>
                                    <li>{t('sections.privacyRights.item1')}</li>
                                    <li>{t('sections.privacyRights.item2')}</li>
                                    <li>{t('sections.privacyRights.item3')}</li>
                                    <li>{t('sections.privacyRights.item4')}</li>
                                    <li>{t('sections.privacyRights.item5')}</li>
                                    <li>{t('sections.privacyRights.item6')}</li>
                                </ul>
                                <p>{t('sections.privacyRights.outro')}</p>
                            </section>

                            <section className="content-section">
                                <h2>6. {t('sections.cookies.title')}</h2>
                                <p>{t('sections.cookies.content1')}</p>
                                <p>{t('sections.cookies.content2')}</p>
                            </section>

                            <section className="content-section">
                                <h2>7. {t('sections.thirdParty.title')}</h2>
                                <p>{t('sections.thirdParty.intro1')}</p>
                                <p>{t('sections.thirdParty.intro2')}</p>
                                <ul>
                                    <li>{t('sections.thirdParty.item1')}</li>
                                    <li>{t('sections.thirdParty.item2')}</li>
                                    <li>{t('sections.thirdParty.item3')}</li>
                                    <li>{t('sections.thirdParty.item4')}</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>8. {t('sections.childrenPrivacy.title')}</h2>
                                <p>{t('sections.childrenPrivacy.content')}</p>
                            </section>

                            <section className="content-section">
                                <h2>9. {t('sections.dataRetention.title')}</h2>
                                <p>{t('sections.dataRetention.intro')}</p>
                                <ul>
                                    <li>{t('sections.dataRetention.item1')}</li>
                                    <li>{t('sections.dataRetention.item2')}</li>
                                    <li>{t('sections.dataRetention.item3')}</li>
                                    <li>{t('sections.dataRetention.item4')}</li>
                                </ul>
                                <p>{t('sections.dataRetention.outro')}</p>
                            </section>

                            <section className="content-section">
                                <h2>10. {t('sections.internationalTransfers.title')}</h2>
                                <p>{t('sections.internationalTransfers.content')}</p>
                            </section>

                            <section className="content-section">
                                <h2>11. {t('sections.californiaRights.title')}</h2>
                                <p>{t('sections.californiaRights.intro')}</p>
                                <ul>
                                    <li>{t('sections.californiaRights.item1')}</li>
                                    <li>{t('sections.californiaRights.item2')}</li>
                                    <li>{t('sections.californiaRights.item3')}</li>
                                    <li>{t('sections.californiaRights.item4')}</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>12. {t('sections.europeanRights.title')}</h2>
                                <p>{t('sections.europeanRights.content')}</p>
                            </section>

                            <section className="content-section">
                                <h2>13. {t('sections.policyUpdates.title')}</h2>
                                <p>{t('sections.policyUpdates.content1')}</p>
                                <p>{t('sections.policyUpdates.content2')}</p>
                            </section>

                            <section className="content-section">
                                <h2>14. {t('sections.contact.title')}</h2>
                                <p>{t('sections.contact.intro')}</p>
                                <div className="contact-info">
                                    <a href={`mailto:${t('sections.contact.email')}`} className="contact-link">
                                        <i className="bi bi-envelope-fill"></i>
                                        {t('sections.contact.email')}
                                    </a>
                                </div>
                                <div className="highlight-box mt-4">
                                    <p><strong>{t('sections.contact.dpoTitle')}</strong></p>
                                    <p>{t('sections.contact.dpo')}<br />
                                    Email: {t('sections.contact.dpoEmail')}</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicyPage;