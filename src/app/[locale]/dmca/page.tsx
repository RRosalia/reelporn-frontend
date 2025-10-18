'use client';

import React from 'react';
import './styles.css';

function DMCAPage() {
    return (
        <div className="dmca-page">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-10/12">
                        <div className="page-header mb-5">
                            <h1 className="page-title">DMCA Notice & Takedown Policy</h1>
                            <p className="page-subtitle">Digital Millennium Copyright Act Compliance</p>
                        </div>

                        <div className="content-card">
                            <section className="content-section">
                                <h2>Copyright Infringement Notification</h2>
                                <p>
                                    ReelPorn respects the intellectual property rights of others and expects its users to do the same.
                                    In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond expeditiously
                                    to claims of copyright infringement committed using the ReelPorn website.
                                </p>
                            </section>

                            <section className="content-section">
                                <h2>Filing a DMCA Notice</h2>
                                <p>
                                    If you believe that your copyrighted work has been copied in a way that constitutes copyright
                                    infringement and is accessible on this site, you may notify our copyright agent, as set forth
                                    in the DMCA. For your complaint to be valid under the DMCA, you must provide the following
                                    information in writing:
                                </p>
                                <ol>
                                    <li>An electronic or physical signature of a person authorized to act on behalf of the copyright owner</li>
                                    <li>Identification of the copyrighted work that you claim has been infringed</li>
                                    <li>Identification of the material that is claimed to be infringing and where it is located on the site</li>
                                    <li>Information reasonably sufficient to permit us to contact you, such as your address, telephone number, and email address</li>
                                    <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or law</li>
                                    <li>A statement, made under penalty of perjury, that the above information is accurate, and that you are the copyright owner or are authorized to act on behalf of the owner</li>
                                </ol>
                            </section>

                            <section className="content-section">
                                <h2>Designated Copyright Agent</h2>
                                <div className="contact-box">
                                    <p>Please send all DMCA notices to our designated agent:</p>
                                    <div className="contact-info">
                                        <div className="contact-item">
                                            <i className="bi bi-envelope-fill"></i>
                                            <a href="mailto:dmca@reelporn.ai">dmca@reelporn.ai</a>
                                        </div>
                                        <div className="contact-item">
                                            <i className="bi bi-building"></i>
                                            <span>DMCA Agent<br />ReelPorn Legal Department</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="content-section">
                                <h2>Counter-Notification</h2>
                                <p>
                                    If you believe that your content was removed or access to it was disabled by mistake or misidentification,
                                    you may file a counter-notification with us. To be effective, a counter-notification must be a written
                                    communication that includes the following:
                                </p>
                                <ol>
                                    <li>Your physical or electronic signature</li>
                                    <li>Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access disabled</li>
                                    <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification</li>
                                    <li>Your name, address, telephone number, and email address</li>
                                    <li>A statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located</li>
                                </ol>
                            </section>

                            <section className="content-section">
                                <h2>Repeat Infringers</h2>
                                <p>
                                    In accordance with the DMCA and other applicable law, we have adopted a policy of terminating,
                                    in appropriate circumstances, users who are deemed to be repeat infringers. We may also at our
                                    sole discretion limit access to the site and/or terminate the accounts of any users who infringe
                                    any intellectual property rights of others.
                                </p>
                            </section>

                            <section className="content-section">
                                <h2>Important Notice</h2>
                                <div className="notice-box">
                                    <p>
                                        <strong>Please note:</strong> Under Section 512(f) of the DMCA, any person who knowingly materially
                                        misrepresents that material or activity is infringing may be subject to liability for damages,
                                        including costs and attorneys' fees. Please consult your legal advisor before filing a notice or
                                        counter-notice.
                                    </p>
                                </div>
                            </section>

                            <section className="content-section">
                                <p className="text-gray-400">
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

export default DMCAPage;