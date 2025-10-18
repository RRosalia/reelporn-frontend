'use client';

import React from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import './styles.css';

function AboutPage() {
    const t = useTranslations('about');
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const router = useRouter();

    const getLocalizedPath = (path: string) => {
        return locale === 'en' ? path : `/${locale}${path}`;
    };

    const stats = [
        { number: t('stats.users.number'), label: t('stats.users.label'), icon: 'bi-people-fill' },
        { number: t('stats.videos.number'), label: t('stats.videos.label'), icon: 'bi-camera-video-fill' },
        { number: t('stats.creators.number'), label: t('stats.creators.label'), icon: 'bi-star-fill' },
        { number: t('stats.countries.number'), label: t('stats.countries.label'), icon: 'bi-globe' }
    ];

    const values = [
        {
            icon: 'bi-shield-check',
            title: t('values.privacyFirst.title'),
            description: t('values.privacyFirst.description')
        },
        {
            icon: 'bi-patch-check',
            title: t('values.verifiedContent.title'),
            description: t('values.verifiedContent.description')
        },
        {
            icon: 'bi-lightning-charge',
            title: t('values.innovation.title'),
            description: t('values.innovation.description')
        },
        {
            icon: 'bi-heart',
            title: t('values.creatorSupport.title'),
            description: t('values.creatorSupport.description')
        }
    ];

    const team = [
        {
            role: t('team.ceo.role'),
            bio: t('team.ceo.bio'),
            color: '#c2338a'
        },
        {
            role: t('team.cto.role'),
            bio: t('team.cto.bio'),
            color: '#f8c537'
        },
        {
            role: t('team.headSafety.role'),
            bio: t('team.headSafety.bio'),
            color: '#48bb78'
        },
        {
            role: t('team.headCreators.role'),
            bio: t('team.headCreators.bio'),
            color: '#6c63ff'
        }
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container mx-auto px-4">
                    <div className="hero-content">
                        <h1 className="hero-title">{t('hero.title')}</h1>
                        <p className="hero-subtitle">{t('hero.subtitle')}</p>
                        <div className="hero-actions">
                            <button
                                className="btn-primary"
                                onClick={() => router.push('/signup')}
                            >
                                {t('hero.getStarted')}
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => router.push('/pornstars')}
                            >
                                {t('hero.meetCreators')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container mx-auto px-4">
                    <div className="stats-grid">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="stat-card">
                                <i className={`bi ${stat.icon} stat-icon`}></i>
                                <h3 className="stat-number">{stat.number}</h3>
                                <p className="stat-label">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mission-section">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center">
                        <div className="w-full lg:w-6/12">
                            <h2 className="section-title">{t('mission.title')}</h2>
                            <p className="mission-text">{t('mission.paragraph1')}</p>
                            <p className="mission-text">{t('mission.paragraph2')}</p>
                        </div>
                        <div className="w-full lg:w-6/12">
                            <div className="mission-image">
                                <div className="image-placeholder">
                                    <i className="bi bi-play-circle-fill"></i>
                                    <span>{t('mission.imageCaption')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section">
                <div className="container mx-auto px-4">
                    <h2 className="section-title text-center mb-5">{t('values.title')}</h2>
                    <div className="values-grid">
                        {values.map((value, idx) => (
                            <div key={idx} className="value-card">
                                <i className={`bi ${value.icon} value-icon`}></i>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section className="technology-section">
                <div className="container mx-auto px-4">
                    <h2 className="section-title text-center mb-5">{t('technology.title')}</h2>
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-6/12 lg:w-3/12">
                            <div className="tech-card">
                                <i className="bi bi-cpu tech-icon"></i>
                                <h4>{t('technology.aiRecommendations.title')}</h4>
                                <p>{t('technology.aiRecommendations.description')}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-6/12 lg:w-3/12">
                            <div className="tech-card">
                                <i className="bi bi-shield-lock tech-icon"></i>
                                <h4>{t('technology.encryption.title')}</h4>
                                <p>{t('technology.encryption.description')}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-6/12 lg:w-3/12">
                            <div className="tech-card">
                                <i className="bi bi-speedometer2 tech-icon"></i>
                                <h4>{t('technology.cdn.title')}</h4>
                                <p>{t('technology.cdn.description')}</p>
                            </div>
                        </div>
                        <div className="w-full md:w-6/12 lg:w-3/12">
                            <div className="tech-card">
                                <i className="bi bi-phone tech-icon"></i>
                                <h4>{t('technology.crossPlatform.title')}</h4>
                                <p>{t('technology.crossPlatform.description')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section">
                <div className="container mx-auto px-4">
                    <h2 className="section-title text-center mb-5">{t('team.title')}</h2>
                    <div className="team-grid">
                        {team.map((member, idx) => (
                            <div key={idx} className="team-card">
                                <div
                                    className="team-avatar"
                                    style={{ background: `linear-gradient(135deg, ${member.color}40, ${member.color}20)` }}
                                >
                                    <i className="bi bi-person-circle" style={{ color: member.color }}></i>
                                </div>
                                <h4>{member.role}</h4>
                                <p>{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Creator Section */}
            <section className="creator-section">
                <div className="container mx-auto px-4">
                    <div className="creator-content">
                        <h2>{t('becomeCreator.title')}</h2>
                        <p>{t('becomeCreator.description')}</p>
                        <div className="creator-benefits">
                            <div className="benefit">
                                <i className="bi bi-cash-stack"></i>
                                <span>{t('becomeCreator.revenueShare')}</span>
                            </div>
                            <div className="benefit">
                                <i className="bi bi-graph-up-arrow"></i>
                                <span>{t('becomeCreator.growthTools')}</span>
                            </div>
                            <div className="benefit">
                                <i className="bi bi-headset"></i>
                                <span>{t('becomeCreator.support')}</span>
                            </div>
                        </div>
                        <button className="btn-creator">{t('becomeCreator.applyButton')}</button>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="container mx-auto px-4">
                    <h2 className="section-title text-center mb-5">{t('contact.title')}</h2>
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-4/12">
                            <div className="contact-card">
                                <i className="bi bi-envelope"></i>
                                <h4>{t('contact.general.title')}</h4>
                                <a href={`mailto:${t('contact.general.email')}`}>{t('contact.general.email')}</a>
                            </div>
                        </div>
                        <div className="w-full md:w-4/12">
                            <div className="contact-card">
                                <i className="bi bi-headset"></i>
                                <h4>{t('contact.support.title')}</h4>
                                <a href={`mailto:${t('contact.support.email')}`}>{t('contact.support.email')}</a>
                            </div>
                        </div>
                        <div className="w-full md:w-4/12">
                            <div className="contact-card">
                                <i className="bi bi-briefcase"></i>
                                <h4>{t('contact.business.title')}</h4>
                                <a href={`mailto:${t('contact.business.email')}`}>{t('contact.business.email')}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AboutPage;
