'use client';

import React from 'react';

function PrivacyPolicyPage() {
    return (
        <div className="legal-page">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-10/12">
                        <div className="page-header mb-5">
                            <h1 className="page-title">Privacy Policy</h1>
                            <p className="page-subtitle">Last Updated: {new Date().toLocaleDateString()}</p>
                        </div>

                        <div className="content-card">
                            <section className="content-section">
                                <h2>1. Information We Collect</h2>
                                <h3>Information You Provide</h3>
                                <ul>
                                    <li>Account information (email, username, password)</li>
                                    <li>Profile information (display name, bio, preferences)</li>
                                    <li>Payment information (processed securely through third-party providers)</li>
                                    <li>Content you upload (videos, photos, comments)</li>
                                    <li>Communications with us (support tickets, emails)</li>
                                </ul>

                                <h3>Information Collected Automatically</h3>
                                <ul>
                                    <li>IP address and device information</li>
                                    <li>Browser type and operating system</li>
                                    <li>Usage data (pages visited, videos watched, interactions)</li>
                                    <li>Cookies and similar tracking technologies</li>
                                    <li>Location data (country/region level only)</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>2. How We Use Your Information</h2>
                                <p>We use collected information to:</p>
                                <ul>
                                    <li>Provide and maintain our Service</li>
                                    <li>Process transactions and send related information</li>
                                    <li>Send administrative information and updates</li>
                                    <li>Respond to your comments and questions</li>
                                    <li>Personalize your experience and provide recommendations</li>
                                    <li>Monitor and analyze usage and trends</li>
                                    <li>Detect and prevent fraud and abuse</li>
                                    <li>Comply with legal obligations</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>3. Information Sharing</h2>
                                <p>We do not sell your personal information. We may share information in these circumstances:</p>
                                <ul>
                                    <li><strong>Service Providers:</strong> With trusted third parties who assist in operating our Service</li>
                                    <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                                    <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
                                    <li><strong>With Consent:</strong> When you explicitly agree to sharing</li>
                                    <li><strong>Aggregated Data:</strong> Non-identifiable statistical data for analysis</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>4. Data Security</h2>
                                <p>
                                    We implement appropriate technical and organizational security measures to protect your personal
                                    information, including:
                                </p>
                                <ul>
                                    <li>SSL/TLS encryption for data transmission</li>
                                    <li>Encrypted storage of sensitive information</li>
                                    <li>Regular security audits and updates</li>
                                    <li>Limited access to personal information</li>
                                    <li>Secure payment processing through PCI-compliant providers</li>
                                </ul>
                                <p>
                                    However, no method of transmission or storage is 100% secure. We cannot guarantee absolute security.
                                </p>
                            </section>

                            <section className="content-section">
                                <h2>5. Your Privacy Rights</h2>
                                <p>Depending on your location, you may have certain rights regarding your personal information:</p>
                                <ul>
                                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                                    <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                                    <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                                    <li><strong>Portability:</strong> Receive your data in a portable format</li>
                                    <li><strong>Objection:</strong> Object to certain processing of your information</li>
                                    <li><strong>Restriction:</strong> Request limited processing of your information</li>
                                </ul>
                                <p>To exercise these rights, contact us at privacy@reelporn.ai</p>
                            </section>

                            <section className="content-section">
                                <h2>6. Cookies and Tracking</h2>
                                <p>
                                    We use cookies and similar technologies to enhance your experience. For detailed information,
                                    please see our <a href="/cookies" style={{color: '#f8c537'}}>Cookie Policy</a>.
                                </p>
                                <p>You can control cookies through your browser settings and our cookie preference center.</p>
                            </section>

                            <section className="content-section">
                                <h2>7. Third-Party Services</h2>
                                <p>Our Service may contain links to third-party websites and services. We are not responsible for their privacy practices. We encourage you to review their privacy policies.</p>
                                <p>Third-party services we use include:</p>
                                <ul>
                                    <li>Payment processors (Stripe, PayPal)</li>
                                    <li>Analytics providers (Google Analytics)</li>
                                    <li>Content delivery networks (CloudFlare)</li>
                                    <li>Communication tools (email services)</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>8. Children's Privacy</h2>
                                <p>
                                    Our Service is strictly for adults 18 years and older. We do not knowingly collect information
                                    from anyone under 18. If we discover we have collected information from a minor, we will delete
                                    it immediately.
                                </p>
                            </section>

                            <section className="content-section">
                                <h2>9. Data Retention</h2>
                                <p>We retain your personal information for as long as necessary to:</p>
                                <ul>
                                    <li>Provide you with our Service</li>
                                    <li>Comply with legal obligations</li>
                                    <li>Resolve disputes and enforce agreements</li>
                                    <li>Maintain business records</li>
                                </ul>
                                <p>When you delete your account, we will delete or anonymize your personal information, except where retention is required by law.</p>
                            </section>

                            <section className="content-section">
                                <h2>10. International Data Transfers</h2>
                                <p>
                                    Your information may be transferred to and processed in countries other than your own. These
                                    countries may have different data protection laws. We ensure appropriate safeguards are in place
                                    for such transfers.
                                </p>
                            </section>

                            <section className="content-section">
                                <h2>11. California Privacy Rights</h2>
                                <p>
                                    California residents have additional rights under the California Consumer Privacy Act (CCPA):
                                </p>
                                <ul>
                                    <li>Right to know what personal information is collected</li>
                                    <li>Right to know if personal information is sold or disclosed</li>
                                    <li>Right to opt-out of the sale of personal information</li>
                                    <li>Right to non-discrimination for exercising privacy rights</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>12. European Privacy Rights</h2>
                                <p>
                                    If you are in the European Economic Area (EEA), you have additional rights under the General
                                    Data Protection Regulation (GDPR), including the right to lodge a complaint with your local
                                    data protection authority.
                                </p>
                            </section>

                            <section className="content-section">
                                <h2>13. Updates to This Policy</h2>
                                <p>
                                    We may update this Privacy Policy from time to time. We will notify you of any changes by
                                    posting the new Privacy Policy on this page and updating the "Last Updated" date.
                                </p>
                                <p>
                                    For significant changes, we will provide additional notice (such as email notification or
                                    a prominent notice on our Service).
                                </p>
                            </section>

                            <section className="content-section">
                                <h2>14. Contact Information</h2>
                                <p>If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
                                <div className="contact-info">
                                    <a href="mailto:privacy@reelporn.ai" className="contact-link">
                                        <i className="bi bi-envelope-fill"></i>
                                        privacy@reelporn.ai
                                    </a>
                                </div>
                                <div className="highlight-box mt-4">
                                    <p><strong>Data Protection Officer</strong></p>
                                    <p>ReelPorn Legal Department<br />
                                    Email: dpo@reelporn.ai</p>
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