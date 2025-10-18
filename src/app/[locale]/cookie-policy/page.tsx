'use client';

import React from 'react';
import './styles.css';

function CookiePolicyPage() {
    const handleManageCookies = () => {
        localStorage.removeItem('cookieConsent');
        window.location.reload();
    };

    return (
        <div className="cookie-policy-page">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-10/12">
                        <div className="page-header mb-5">
                            <h1 className="page-title">Cookie Policy</h1>
                            <p className="page-subtitle">How we use cookies and similar technologies</p>
                        </div>

                        <div className="content-card">
                            <section className="content-section">
                                <h2>What Are Cookies?</h2>
                                <p>
                                    Cookies are small text files that are placed on your device when you visit our website.
                                    They help us provide you with a better experience by remembering your preferences,
                                    analyzing site traffic, and personalizing content.
                                </p>
                                <p>
                                    We also use similar technologies like pixels, local storage, and device fingerprinting
                                    to enhance your browsing experience and improve our services.
                                </p>
                            </section>

                            <section className="content-section">
                                <h2>How We Use Cookies</h2>
                                <p>We use cookies and similar technologies for the following purposes:</p>
                                <div className="cookie-purpose">
                                    <h3><i className="bi bi-shield-check"></i> Essential Operations</h3>
                                    <p>To provide core functionality like user authentication, security, and site integrity</p>
                                </div>
                                <div className="cookie-purpose">
                                    <h3><i className="bi bi-gear"></i> Preferences & Settings</h3>
                                    <p>To remember your choices such as language preferences, playback quality, and display settings</p>
                                </div>
                                <div className="cookie-purpose">
                                    <h3><i className="bi bi-graph-up"></i> Analytics & Performance</h3>
                                    <p>To understand how users interact with our site and improve our services</p>
                                </div>
                                <div className="cookie-purpose">
                                    <h3><i className="bi bi-megaphone"></i> Marketing & Advertising</h3>
                                    <p>To deliver relevant advertisements and measure their effectiveness</p>
                                </div>
                            </section>

                            <section className="content-section">
                                <h2>Types of Cookies We Use</h2>

                                <div className="cookie-type">
                                    <h3>Essential Cookies</h3>
                                    <p>
                                        These cookies are necessary for the website to function properly. They enable basic
                                        functions like page navigation, secure areas access, and age verification.
                                    </p>
                                    <ul>
                                        <li>Session management</li>
                                        <li>Age verification status</li>
                                        <li>Security tokens</li>
                                        <li>Load balancing</li>
                                    </ul>
                                </div>

                                <div className="cookie-type">
                                    <h3>Functional Cookies</h3>
                                    <p>
                                        These cookies enable enhanced functionality and personalization. They may be set by us
                                        or by third-party providers whose services we use.
                                    </p>
                                    <ul>
                                        <li>Language preferences</li>
                                        <li>Video player settings</li>
                                        <li>Recently viewed content</li>
                                        <li>User interface customization</li>
                                    </ul>
                                </div>

                                <div className="cookie-type">
                                    <h3>Analytics Cookies</h3>
                                    <p>
                                        These cookies help us understand how visitors interact with our website by collecting
                                        and reporting information anonymously.
                                    </p>
                                    <ul>
                                        <li>Google Analytics</li>
                                        <li>Page view tracking</li>
                                        <li>User behavior analysis</li>
                                        <li>Performance monitoring</li>
                                    </ul>
                                </div>

                                <div className="cookie-type">
                                    <h3>Advertising Cookies</h3>
                                    <p>
                                        These cookies are used to deliver advertisements that are relevant to you and your
                                        interests. They also help limit the number of times you see an advertisement.
                                    </p>
                                    <ul>
                                        <li>Targeted advertising</li>
                                        <li>Ad frequency capping</li>
                                        <li>Campaign performance measurement</li>
                                        <li>Interest-based advertising</li>
                                    </ul>
                                </div>
                            </section>

                            <section className="content-section">
                                <h2>Third-Party Cookies</h2>
                                <p>
                                    Some cookies are placed by third-party services that appear on our pages. We do not
                                    control these cookies and encourage you to check the third-party websites for more
                                    information about how they use cookies.
                                </p>
                                <p>Third-party services we use include:</p>
                                <ul>
                                    <li>Google Analytics - for website analytics</li>
                                    <li>CloudFlare - for security and performance</li>
                                    <li>Payment processors - for secure transactions</li>
                                    <li>Social media platforms - for content sharing</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>Managing Your Cookie Preferences</h2>
                                <p>
                                    You have control over which cookies we use. You can manage your preferences at any time:
                                </p>
                                <div className="manage-cookies-box">
                                    <button onClick={handleManageCookies} className="btn-manage-cookies">
                                        <i className="bi bi-gear-fill mr-2"></i>
                                        Manage Cookie Settings
                                    </button>
                                    <p className="mt-3">
                                        Click the button above to review and update your cookie preferences.
                                    </p>
                                </div>
                                <p className="mt-4">
                                    You can also control cookies through your browser settings:
                                </p>
                                <ul>
                                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                                    <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                                    <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                                    <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>Cookie Duration</h2>
                                <p>Cookies can be either session or persistent cookies:</p>
                                <ul>
                                    <li>
                                        <strong>Session Cookies:</strong> These are temporary cookies that expire when you
                                        close your browser. We use these for security and essential site functions.
                                    </li>
                                    <li>
                                        <strong>Persistent Cookies:</strong> These cookies remain on your device for a set
                                        period or until you delete them. We use these to remember your preferences and
                                        provide personalized features.
                                    </li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>Updates to This Policy</h2>
                                <p>
                                    We may update this Cookie Policy from time to time to reflect changes in our practices
                                    or for other operational, legal, or regulatory reasons. We will notify you of any
                                    significant changes by posting the new policy on this page with an updated revision date.
                                </p>
                            </section>

                            <section className="content-section">
                                <h2>Contact Us</h2>
                                <p>
                                    If you have any questions about our use of cookies or this policy, please contact us:
                                </p>
                                <div className="contact-info">
                                    <a href="mailto:privacy@reelporn.ai" className="contact-link">
                                        <i className="bi bi-envelope-fill"></i>
                                        privacy@reelporn.ai
                                    </a>
                                </div>
                            </section>

                            <section className="content-section">
                                <p className="text-gray-500">
                                    Last Updated: {new Date().toLocaleDateString()}
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