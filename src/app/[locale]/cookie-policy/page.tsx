'use client';

import React from 'react';

function CookiePolicyPage() {
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
                            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
                            <p className="text-gray-300 text-xl">How we use cookies and similar technologies</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl">
                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">What Are Cookies?</h2>
                                <p className="text-gray-300 mb-4 leading-relaxed">
                                    Cookies are small text files that are placed on your device when you visit our website.
                                    They help us provide you with a better experience by remembering your preferences,
                                    analyzing site traffic, and personalizing content.
                                </p>
                                <p className="text-gray-300 leading-relaxed">
                                    We also use similar technologies like pixels, local storage, and device fingerprinting
                                    to enhance your browsing experience and improve our services.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">How We Use Cookies</h2>
                                <p className="text-gray-300 mb-4 leading-relaxed">We use cookies and similar technologies for the following purposes:</p>
                                <div className="bg-white/5 border-l-4 border-pink-500 p-5 mb-5 rounded-lg">
                                    <h3 className="text-yellow-400 text-xl mb-2 flex items-center gap-2">
                                        <i className="bi bi-shield-check text-pink-500 text-2xl"></i> Essential Operations
                                    </h3>
                                    <p className="text-white/90 m-0">To provide core functionality like user authentication, security, and site integrity</p>
                                </div>
                                <div className="bg-white/5 border-l-4 border-pink-500 p-5 mb-5 rounded-lg">
                                    <h3 className="text-yellow-400 text-xl mb-2 flex items-center gap-2">
                                        <i className="bi bi-gear text-pink-500 text-2xl"></i> Preferences & Settings
                                    </h3>
                                    <p className="text-white/90 m-0">To remember your choices such as language preferences, playback quality, and display settings</p>
                                </div>
                                <div className="bg-white/5 border-l-4 border-pink-500 p-5 mb-5 rounded-lg">
                                    <h3 className="text-yellow-400 text-xl mb-2 flex items-center gap-2">
                                        <i className="bi bi-graph-up text-pink-500 text-2xl"></i> Analytics & Performance
                                    </h3>
                                    <p className="text-white/90 m-0">To understand how users interact with our site and improve our services</p>
                                </div>
                                <div className="bg-white/5 border-l-4 border-pink-500 p-5 mb-5 rounded-lg">
                                    <h3 className="text-yellow-400 text-xl mb-2 flex items-center gap-2">
                                        <i className="bi bi-megaphone text-pink-500 text-2xl"></i> Marketing & Advertising
                                    </h3>
                                    <p className="text-white/90 m-0">To deliver relevant advertisements and measure their effectiveness</p>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">Types of Cookies We Use</h2>

                                <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-6 mb-6">
                                    <h3 className="text-yellow-400 text-xl font-semibold mb-4">Essential Cookies</h3>
                                    <p className="text-gray-300 mb-4 leading-relaxed">
                                        These cookies are necessary for the website to function properly. They enable basic
                                        functions like page navigation, secure areas access, and age verification.
                                    </p>
                                    <ul className="text-white/85 list-disc pl-6 space-y-2">
                                        <li>Session management</li>
                                        <li>Age verification status</li>
                                        <li>Security tokens</li>
                                        <li>Load balancing</li>
                                    </ul>
                                </div>

                                <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-6 mb-6">
                                    <h3 className="text-yellow-400 text-xl font-semibold mb-4">Functional Cookies</h3>
                                    <p className="text-gray-300 mb-4 leading-relaxed">
                                        These cookies enable enhanced functionality and personalization. They may be set by us
                                        or by third-party providers whose services we use.
                                    </p>
                                    <ul className="text-white/85 list-disc pl-6 space-y-2">
                                        <li>Language preferences</li>
                                        <li>Video player settings</li>
                                        <li>Recently viewed content</li>
                                        <li>User interface customization</li>
                                    </ul>
                                </div>

                                <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-6 mb-6">
                                    <h3 className="text-yellow-400 text-xl font-semibold mb-4">Analytics Cookies</h3>
                                    <p className="text-gray-300 mb-4 leading-relaxed">
                                        These cookies help us understand how visitors interact with our website by collecting
                                        and reporting information anonymously.
                                    </p>
                                    <ul className="text-white/85 list-disc pl-6 space-y-2">
                                        <li>Google Analytics</li>
                                        <li>Page view tracking</li>
                                        <li>User behavior analysis</li>
                                        <li>Performance monitoring</li>
                                    </ul>
                                </div>

                                <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-6 mb-6">
                                    <h3 className="text-yellow-400 text-xl font-semibold mb-4">Advertising Cookies</h3>
                                    <p className="text-gray-300 mb-4 leading-relaxed">
                                        These cookies are used to deliver advertisements that are relevant to you and your
                                        interests. They also help limit the number of times you see an advertisement.
                                    </p>
                                    <ul className="text-white/85 list-disc pl-6 space-y-2">
                                        <li>Targeted advertising</li>
                                        <li>Ad frequency capping</li>
                                        <li>Campaign performance measurement</li>
                                        <li>Interest-based advertising</li>
                                    </ul>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">Third-Party Cookies</h2>
                                <p className="text-gray-300 mb-4 leading-relaxed">
                                    Some cookies are placed by third-party services that appear on our pages. We do not
                                    control these cookies and encourage you to check the third-party websites for more
                                    information about how they use cookies.
                                </p>
                                <p className="text-gray-300 mb-4 leading-relaxed">Third-party services we use include:</p>
                                <ul className="text-white/85 list-disc pl-6 space-y-2">
                                    <li>Google Analytics - for website analytics</li>
                                    <li>CloudFlare - for security and performance</li>
                                    <li>Payment processors - for secure transactions</li>
                                    <li>Social media platforms - for content sharing</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">Managing Your Cookie Preferences</h2>
                                <p className="text-gray-300 mb-4 leading-relaxed">
                                    You have control over which cookies we use. You can manage your preferences at any time:
                                </p>
                                <div className="bg-gradient-to-r from-pink-500/10 to-yellow-400/10 border border-pink-500/30 rounded-xl p-8 text-center my-6">
                                    <button
                                        onClick={handleManageCookies}
                                        className="inline-flex items-center bg-gradient-to-r from-pink-500 to-yellow-400 text-white border-none px-10 py-4 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-500/40"
                                    >
                                        <i className="bi bi-gear-fill mr-2"></i>
                                        Manage Cookie Settings
                                    </button>
                                    <p className="text-white/80 mt-4 mb-0">
                                        Click the button above to review and update your cookie preferences.
                                    </p>
                                </div>
                                <p className="text-gray-300 mb-4 leading-relaxed">
                                    You can also control cookies through your browser settings:
                                </p>
                                <ul className="text-white/85 list-disc pl-6 space-y-2">
                                    <li><strong className="text-white">Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                                    <li><strong className="text-white">Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                                    <li><strong className="text-white">Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                                    <li><strong className="text-white">Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">Cookie Duration</h2>
                                <p className="text-gray-300 mb-4 leading-relaxed">Cookies can be either session or persistent cookies:</p>
                                <ul className="text-white/85 list-disc pl-6 space-y-3">
                                    <li>
                                        <strong className="text-white">Session Cookies:</strong> These are temporary cookies that expire when you
                                        close your browser. We use these for security and essential site functions.
                                    </li>
                                    <li>
                                        <strong className="text-white">Persistent Cookies:</strong> These cookies remain on your device for a set
                                        period or until you delete them. We use these to remember your preferences and
                                        provide personalized features.
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">Updates to This Policy</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    We may update this Cookie Policy from time to time to reflect changes in our practices
                                    or for other operational, legal, or regulatory reasons. We will notify you of any
                                    significant changes by posting the new policy on this page with an updated revision date.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-white text-2xl font-bold mb-4">Contact Us</h2>
                                <p className="text-gray-300 mb-4 leading-relaxed">
                                    If you have any questions about our use of cookies or this policy, please contact us:
                                </p>
                                <div className="inline-block">
                                    <a
                                        href="mailto:privacy@reelporn.ai"
                                        className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors text-lg"
                                    >
                                        <i className="bi bi-envelope-fill"></i>
                                        privacy@reelporn.ai
                                    </a>
                                </div>
                            </section>

                            <section className="mb-0">
                                <p className="text-gray-500 text-sm">
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