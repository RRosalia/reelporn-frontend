'use client';

import React from 'react';
import './styles.css';

function Section2257Page() {
    return (
        <div className="section2257-page">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-10/12">
                        <div className="page-header mb-5">
                            <h1 className="page-title">18 U.S.C. 2257 Compliance Notice</h1>
                            <p className="page-subtitle">Record-Keeping Requirements Compliance Statement</p>
                        </div>

                        <div className="content-card">
                            <section className="content-section">
                                <h2>Compliance Statement</h2>
                                <p>
                                    All visual depictions displayed on this website, whether of actual sexually explicit conduct,
                                    simulated sexual content or otherwise, are visual depictions of persons who were at least 18
                                    years of age when those visual depictions were created.
                                </p>
                                <p>
                                    All other visual depictions displayed on this website are exempt from the provision of 18
                                    U.S.C. section 2257 and 28 C.F.R. 75 because said visual depictions do not consist of
                                    depictions of conduct as specifically listed in 18 U.S.C section 2256 (2) (A) through (D),
                                    but are merely depictions of non-sexually explicit nudity, or are depictions of simulated
                                    sexual conduct, or are otherwise exempt because the visual depictions were created prior
                                    to July 3, 1995.
                                </p>
                            </section>

                            <section className="content-section">
                                <h2>Custodian of Records</h2>
                                <div className="custodian-box">
                                    <p>
                                        The owners and operators of ReelPorn.ai are committed to compliance with U.S. federal law
                                        18 U.S.C. 2257, and all associated regulations.
                                    </p>
                                    <p>
                                        <strong>The Custodian of Records for ReelPorn.ai is:</strong>
                                    </p>
                                    <div className="custodian-info">
                                        <p>
                                            ReelPorn Legal Compliance<br />
                                            Custodian of Records<br />
                                            Compliance Department
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="content-section">
                                <h2>Content Producers</h2>
                                <p>
                                    With respect to all visual depictions displayed on this website, whether of actual sexually
                                    explicit conduct, simulated sexual content or otherwise, all content has been provided by
                                    third-party producers, webmasters, or users of the website who have warranted that:
                                </p>
                                <ul>
                                    <li>They are the custodian of records for all content provided</li>
                                    <li>All models, actors, actresses and other persons appearing in any visual depiction were over the age of eighteen years at the time of the creation of such depictions</li>
                                    <li>They maintain records required pursuant to U.S. law 18 U.S.C. 2257</li>
                                    <li>All content and activities portrayed are consensual</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>Original Producers</h2>
                                <p>
                                    The original producers of the visual content contained on this website are various third-party
                                    entities. Each producer maintains records in accordance with the requirements set forth in
                                    18 U.S.C. 2257 and its regulations.
                                </p>
                                <p>
                                    For records relating to specific content, the following entities serve as the custodian of
                                    records for their respective productions:
                                </p>
                                <ul>
                                    <li>Content uploaded by users: Individual uploaders are responsible for maintaining their own 2257 records</li>
                                    <li>Licensed content: Original producer maintains custody of records</li>
                                    <li>Partner content: Partner studios maintain their respective records</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>Exemptions</h2>
                                <p>
                                    Some content displayed on this website is exempt from 18 U.S.C. 2257 record-keeping requirements, including:
                                </p>
                                <ul>
                                    <li>Visual depictions of only non-sexually explicit nudity</li>
                                    <li>Visual depictions created before July 3, 1995</li>
                                    <li>Visual depictions that do not portray conduct as described in 18 U.S.C. 2256(2)(A)</li>
                                    <li>Content that contains only simulated sexual conduct where no actual sexual conduct occurred</li>
                                </ul>
                            </section>

                            <section className="content-section">
                                <h2>Legal Information</h2>
                                <div className="legal-box">
                                    <p>
                                        <strong>Important:</strong> ReelPorn.ai operates as a platform and does not produce original content.
                                        All content is provided by third-party producers who have represented and warranted their compliance
                                        with all applicable laws, including 18 U.S.C. 2257.
                                    </p>
                                    <p>
                                        Any person who uploads, submits, or otherwise provides content to ReelPorn.ai represents and
                                        warrants that they have complied with the record-keeping requirements of 18 U.S.C. 2257 with
                                        respect to any such content.
                                    </p>
                                </div>
                            </section>

                            <section className="content-section">
                                <h2>Contact Information</h2>
                                <p>
                                    For any inquiries regarding 2257 compliance or to request access to records, please contact:
                                </p>
                                <div className="contact-info">
                                    <a href="mailto:legal@reelporn.ai" className="contact-link">
                                        <i className="bi bi-envelope-fill"></i>
                                        legal@reelporn.ai
                                    </a>
                                </div>
                            </section>

                            <section className="content-section">
                                <p className="text-muted">
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

export default Section2257Page;