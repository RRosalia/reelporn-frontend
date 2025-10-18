'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import './styles.css';

function ParentalControlsPage() {
    const t = useTranslations();

    return (
        <div className="parental-controls-page">
            <div className="container mx-auto px-4 py-12">
                <div className="parental-header">
                    <h1 className="parental-title">
                        {t('parental.title')}
                    </h1>
                    <p className="parental-subtitle">
                        {t('parental.subtitle')}
                    </p>
                </div>

                <div className="parental-content">
                    {/* Introduction */}
                    <section className="parental-section">
                        <h2>{t('parental.intro.title')}</h2>
                        <p>{t('parental.intro.text1')}</p>
                        <p>{t('parental.intro.text2')}</p>
                    </section>

                    {/* Blocking Methods */}
                    <section className="parental-section">
                        <h2>{t('parental.methods.title')}</h2>
                        <p>{t('parental.methods.intro')}</p>

                        {/* Router Level */}
                        <div className="parental-method">
                            <h3>
                                <i className="bi bi-router me-2"></i>
                                {t('parental.methods.router.title')}
                            </h3>
                            <p>{t('parental.methods.router.text')}</p>
                        </div>

                        {/* ISP Level */}
                        <div className="parental-method">
                            <h3>
                                <i className="bi bi-globe me-2"></i>
                                {t('parental.methods.isp.title')}
                            </h3>
                            <p>{t('parental.methods.isp.text')}</p>
                        </div>

                        {/* Device Level */}
                        <div className="parental-method">
                            <h3>
                                <i className="bi bi-phone me-2"></i>
                                {t('parental.methods.device.title')}
                            </h3>
                            <p>{t('parental.methods.device.text')}</p>
                        </div>
                    </section>

                    {/* Third-Party Software */}
                    <section className="parental-section">
                        <h2>{t('parental.software.title')}</h2>
                        <p>{t('parental.software.intro')}</p>

                        <div className="software-list">
                            <div className="software-item">
                                <h4>Net Nanny</h4>
                                <p>{t('parental.software.netnanny')}</p>
                                <a href="https://www.netnanny.com" target="_blank" rel="noopener noreferrer" className="software-link">
                                    www.netnanny.com
                                </a>
                            </div>

                            <div className="software-item">
                                <h4>Norton Family</h4>
                                <p>{t('parental.software.norton')}</p>
                                <a href="https://family.norton.com" target="_blank" rel="noopener noreferrer" className="software-link">
                                    family.norton.com
                                </a>
                            </div>

                            <div className="software-item">
                                <h4>Qustodio</h4>
                                <p>{t('parental.software.qustodio')}</p>
                                <a href="https://www.qustodio.com" target="_blank" rel="noopener noreferrer" className="software-link">
                                    www.qustodio.com
                                </a>
                            </div>

                            <div className="software-item">
                                <h4>OpenDNS Family Shield</h4>
                                <p>{t('parental.software.opendns')}</p>
                                <a href="https://www.opendns.com/home-internet-security/" target="_blank" rel="noopener noreferrer" className="software-link">
                                    www.opendns.com/home-internet-security
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Additional Resources */}
                    <section className="parental-section">
                        <h2>{t('parental.resources.title')}</h2>
                        <p>{t('parental.resources.text')}</p>

                        <div className="resources-list">
                            <a href="https://www.internetsafety101.org" target="_blank" rel="noopener noreferrer" className="resource-link">
                                <i className="bi bi-link-45deg me-2"></i>
                                Internet Safety 101
                            </a>
                            <a href="https://www.commonsensemedia.org" target="_blank" rel="noopener noreferrer" className="resource-link">
                                <i className="bi bi-link-45deg me-2"></i>
                                Common Sense Media
                            </a>
                            <a href="https://www.netsmartz.org" target="_blank" rel="noopener noreferrer" className="resource-link">
                                <i className="bi bi-link-45deg me-2"></i>
                                NetSmartz
                            </a>
                        </div>
                    </section>

                    {/* Important Notice */}
                    <section className="parental-section parental-notice">
                        <h2>{t('parental.notice.title')}</h2>
                        <p>{t('parental.notice.text')}</p>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default ParentalControlsPage;
