'use client';

import React from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import './styles.css';

function AboutPage() {const t = useTranslations();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const router = useRouter();

    const getLocalizedPath = (path: string) => {
        return locale === 'en' ? path : `/${locale}${path}`;
    };

    const stats = [
        { number: '10M+', label: 'Active Users', icon: 'bi-people-fill' },
        { number: '500K+', label: 'Videos', icon: 'bi-camera-video-fill' },
        { number: '50K+', label: 'Creators', icon: 'bi-star-fill' },
        { number: '150+', label: 'Countries', icon: 'bi-globe' }
    ];

    const values = [
        {
            icon: 'bi-shield-check',
            title: 'Privacy First',
            description: 'Your privacy is our top priority. We use advanced encryption and never share your data.'
        },
        {
            icon: 'bi-patch-check',
            title: 'Verified Content',
            description: 'All content is from verified adults. We comply with all legal requirements including 2257.'
        },
        {
            icon: 'bi-lightning-charge',
            title: 'Innovation',
            description: 'Pioneering the future of adult entertainment with cutting-edge technology and features.'
        },
        {
            icon: 'bi-heart',
            title: 'Creator Support',
            description: 'Empowering creators with fair revenue sharing and powerful tools to grow their audience.'
        }
    ];

    const team = [
        {
            role: 'CEO & Founder',
            bio: 'Visionary leader with 15+ years in tech and entertainment',
            color: '#c2338a'
        },
        {
            role: 'CTO',
            bio: 'Expert in AI/ML and scalable video streaming infrastructure',
            color: '#f8c537'
        },
        {
            role: 'Head of Safety',
            bio: 'Dedicated to platform safety and legal compliance',
            color: '#48bb78'
        },
        {
            role: 'Head of Creators',
            bio: 'Supporting and growing our amazing creator community',
            color: '#6c63ff'
        }
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container mx-auto px-4">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Redefining Adult Entertainment
                        </h1>
                        <p className="hero-subtitle">
                            ReelPorn is revolutionizing how adults discover and enjoy intimate content
                            through innovative short-form videos and cutting-edge technology.
                        </p>
                        <div className="hero-actions">
                            <button
                                className="btn-primary"
                                onClick={() => router.push('/signup')}
                            >
                                Get Started
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => router.push('/pornstars')}
                            >
                                Meet Our Creators
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
                            <h2 className="section-title">Our Mission</h2>
                            <p className="mission-text">
                                We believe adult entertainment should be safe, consensual, and accessible.
                                ReelPorn combines the addictive nature of short-form content with the
                                intimacy of adult entertainment, creating a unique platform where viewers
                                can discover new experiences and creators can thrive.
                            </p>
                            <p className="mission-text">
                                Our AI-powered recommendation engine learns your preferences to deliver
                                personalized content while maintaining complete privacy. Every video is
                                verified, every creator is authenticated, and every interaction is secure.
                            </p>
                        </div>
                        <div className="w-full lg:w-6/12">
                            <div className="mission-image">
                                <div className="image-placeholder">
                                    <i className="bi bi-play-circle-fill"></i>
                                    <span>Innovation in Motion</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section">
                <div className="container mx-auto px-4">
                    <h2 className="section-title text-center mb-5">Our Core Values</h2>
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
                    <h2 className="section-title text-center mb-5">Powered by Technology</h2>
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-6/12 lg:w-3/12">
                            <div className="tech-card">
                                <i className="bi bi-cpu tech-icon"></i>
                                <h4>AI Recommendations</h4>
                                <p>Advanced machine learning algorithms personalize your feed in real-time.</p>
                            </div>
                        </div>
                        <div className="w-full md:w-6/12 lg:w-3/12">
                            <div className="tech-card">
                                <i className="bi bi-shield-lock tech-icon"></i>
                                <h4>End-to-End Encryption</h4>
                                <p>Military-grade encryption protects your data and viewing history.</p>
                            </div>
                        </div>
                        <div className="w-full md:w-6/12 lg:w-3/12">
                            <div className="tech-card">
                                <i className="bi bi-speedometer2 tech-icon"></i>
                                <h4>Global CDN</h4>
                                <p>Lightning-fast streaming from servers worldwide for buffer-free viewing.</p>
                            </div>
                        </div>
                        <div className="w-full md:w-6/12 lg:w-3/12">
                            <div className="tech-card">
                                <i className="bi bi-phone tech-icon"></i>
                                <h4>Cross-Platform</h4>
                                <p>Seamless experience across all devices - desktop, mobile, and tablet.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section">
                <div className="container mx-auto px-4">
                    <h2 className="section-title text-center mb-5">Leadership Team</h2>
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
                        <h2>Become a Creator</h2>
                        <p>
                            Join thousands of creators earning on ReelPorn. We offer the highest
                            revenue share in the industry, powerful analytics, and a supportive community.
                        </p>
                        <div className="creator-benefits">
                            <div className="benefit">
                                <i className="bi bi-cash-stack"></i>
                                <span>80% Revenue Share</span>
                            </div>
                            <div className="benefit">
                                <i className="bi bi-graph-up-arrow"></i>
                                <span>Growth Tools</span>
                            </div>
                            <div className="benefit">
                                <i className="bi bi-headset"></i>
                                <span>24/7 Support</span>
                            </div>
                        </div>
                        <button className="btn-creator">Apply to Become a Creator</button>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="container mx-auto px-4">
                    <h2 className="section-title text-center mb-5">Get in Touch</h2>
                    <div className="flex flex-wrap">
                        <div className="w-full md:w-4/12">
                            <div className="contact-card">
                                <i className="bi bi-envelope"></i>
                                <h4>General Inquiries</h4>
                                <a href="mailto:info@reelporn.ai">info@reelporn.ai</a>
                            </div>
                        </div>
                        <div className="w-full md:w-4/12">
                            <div className="contact-card">
                                <i className="bi bi-headset"></i>
                                <h4>Support</h4>
                                <a href="mailto:support@reelporn.ai">support@reelporn.ai</a>
                            </div>
                        </div>
                        <div className="w-full md:w-4/12">
                            <div className="contact-card">
                                <i className="bi bi-briefcase"></i>
                                <h4>Business</h4>
                                <a href="mailto:business@reelporn.ai">business@reelporn.ai</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AboutPage;