'use client';

import React, { useState } from 'react';
import './styles.css';

function FAQPage() {
    const [activeCategory, setActiveCategory] = useState<'general' | 'account' | 'content' | 'creators' | 'technical' | 'legal'>('general');
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const toggleItem = (id: string) => {
        setOpenItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const faqCategories = {
        general: {
            title: 'General Questions',
            icon: 'bi-info-circle',
            questions: [
                {
                    id: 'g1',
                    question: 'What is ReelPorn?',
                    answer: 'ReelPorn is a premium adult content platform specializing in short-form video content (15-second reels). We provide a TikTok-like experience for adult entertainment with swipe functionality, personalized feeds, and high-quality content from verified creators.'
                },
                {
                    id: 'g2',
                    question: 'Is ReelPorn free to use?',
                    answer: 'ReelPorn offers both free and premium content. You can browse and watch limited content for free, but a premium subscription unlocks unlimited access to all videos, HD/4K quality, download features, and ad-free viewing.'
                },
                {
                    id: 'g3',
                    question: 'How do I verify my age?',
                    answer: 'Age verification is required to access ReelPorn. When you first visit, you must confirm you are 18 years or older. This is a legal requirement to ensure minors cannot access adult content.'
                },
                {
                    id: 'g4',
                    question: 'Is my data safe and private?',
                    answer: 'Yes, we take privacy seriously. All data is encrypted, we never share personal information with third parties without consent, and you can browse anonymously. Please review our Privacy Policy for detailed information.'
                }
            ]
        },
        account: {
            title: 'Account & Subscription',
            icon: 'bi-person-circle',
            questions: [
                {
                    id: 'a1',
                    question: 'How do I create an account?',
                    answer: 'Click the "Sign Up" button, choose your membership plan, enter your email and create a password. Verify your email address and you\'re ready to start watching!'
                },
                {
                    id: 'a2',
                    question: 'What payment methods do you accept?',
                    answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and cryptocurrency payments (Bitcoin, Ethereum). All transactions are processed securely and discreetly.'
                },
                {
                    id: 'a3',
                    question: 'How do I cancel my subscription?',
                    answer: 'You can cancel your subscription anytime from your account settings. Go to Profile > Subscription > Cancel Subscription. You\'ll continue to have access until the end of your billing period.'
                },
                {
                    id: 'a4',
                    question: 'Will charges appear as "ReelPorn" on my statement?',
                    answer: 'No, for your privacy, charges appear under a discreet billing name like "RP Media Services" or "Digital Entertainment Services" on your bank statement.'
                },
                {
                    id: 'a5',
                    question: 'Can I upgrade or downgrade my plan?',
                    answer: 'Yes, you can change your subscription plan at any time. The new plan will take effect at your next billing cycle. Any price difference will be prorated.'
                }
            ]
        },
        content: {
            title: 'Content & Features',
            icon: 'bi-camera-video',
            questions: [
                {
                    id: 'c1',
                    question: 'What kind of content is available?',
                    answer: 'We offer a wide variety of adult content in 15-second reel format, including amateur, professional, various categories and fetishes. All content is from verified adults and complies with legal requirements.'
                },
                {
                    id: 'c2',
                    question: 'Can I download videos for offline viewing?',
                    answer: 'Premium members can download videos for offline viewing. Downloads are encrypted and can only be viewed through our app while your subscription is active.'
                },
                {
                    id: 'c3',
                    question: 'How does the recommendation algorithm work?',
                    answer: 'Our AI-powered algorithm learns from your viewing habits, likes, and preferences to show you personalized content. The more you interact, the better the recommendations become.'
                },
                {
                    id: 'c4',
                    question: 'Can I upload my own content?',
                    answer: 'Yes, verified creators can upload content. You must complete our creator verification process, provide 2257 documentation, and comply with our content guidelines.'
                },
                {
                    id: 'c5',
                    question: 'How do I report inappropriate content?',
                    answer: 'Every video has a report button. Click it to report content that violates our terms, is non-consensual, involves minors, or is otherwise inappropriate. We review all reports within 24 hours.'
                }
            ]
        },
        creators: {
            title: 'For Creators',
            icon: 'bi-stars',
            questions: [
                {
                    id: 'cr1',
                    question: 'How do I become a verified creator?',
                    answer: 'Apply through the Creator Portal, provide government-issued ID, complete 2257 documentation, and pass our verification process. Approval typically takes 24-48 hours.'
                },
                {
                    id: 'cr2',
                    question: 'How much can I earn as a creator?',
                    answer: 'Creators earn through multiple revenue streams: ad revenue share (60%), tips from fans, pay-per-view content, and subscription tiers. Top creators earn thousands per month.'
                },
                {
                    id: 'cr3',
                    question: 'What are the content requirements?',
                    answer: 'Videos must be 15 seconds or less, minimum 720p quality, all participants must be 18+, and content must be consensual. We prohibit illegal content, violence, and non-consensual material.'
                },
                {
                    id: 'cr4',
                    question: 'How do I get paid?',
                    answer: 'Payments are processed weekly via direct deposit, PayPal, or cryptocurrency. Minimum payout is $50. You\'ll receive detailed earnings reports in your creator dashboard.'
                },
                {
                    id: 'cr5',
                    question: 'Do I retain rights to my content?',
                    answer: 'Yes, you retain ownership of your content. You grant us a license to display it on our platform. You can remove your content at any time from your creator dashboard.'
                }
            ]
        },
        technical: {
            title: 'Technical Support',
            icon: 'bi-gear',
            questions: [
                {
                    id: 't1',
                    question: 'What devices are supported?',
                    answer: 'ReelPorn works on all modern browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile. We also have native apps for iOS and Android (available outside app stores).'
                },
                {
                    id: 't2',
                    question: 'Why is video playback stuttering?',
                    answer: 'This is usually due to slow internet connection. Try reducing video quality in settings, closing other tabs/apps, or switching to a faster network. Premium members get priority streaming.'
                },
                {
                    id: 't3',
                    question: 'How do I clear my viewing history?',
                    answer: 'Go to Profile > Privacy Settings > Clear History. You can clear all history or selectively remove items. You can also enable incognito mode for private browsing.'
                },
                {
                    id: 't4',
                    question: 'Can I use a VPN?',
                    answer: 'Yes, VPN usage is allowed and recommended for privacy. However, some features may be limited based on the VPN location due to regional content restrictions.'
                }
            ]
        },
        legal: {
            title: 'Legal & Safety',
            icon: 'bi-shield-check',
            questions: [
                {
                    id: 'l1',
                    question: 'How do you verify performers are 18+?',
                    answer: 'We comply with 18 U.S.C. 2257 requirements. All creators must provide government-issued ID and we maintain detailed records. We use AI and manual review to verify ages.'
                },
                {
                    id: 'l2',
                    question: 'What if my content was uploaded without permission?',
                    answer: 'Submit a DMCA takedown request to dmca@reelporn.ai with proof of ownership. We remove infringing content within 24 hours of receiving valid notices.'
                },
                {
                    id: 'l3',
                    question: 'Is ReelPorn legal in my country?',
                    answer: 'Adult content laws vary by country. It\'s your responsibility to ensure you\'re complying with local laws. We block access from countries where adult content is prohibited.'
                },
                {
                    id: 'l4',
                    question: 'How do you prevent minors from accessing?',
                    answer: 'We use age verification gates, require account creation with age confirmation, provide parental control information, and cooperate with filtering services.'
                }
            ]
        }
    };

    return (
        <div className="faq-page">
            <div className="container mx-auto px-4 py-12">
                <div className="page-header mb-5">
                    <h1 className="page-title">Frequently Asked Questions</h1>
                    <p className="page-subtitle">Everything you need to know about ReelPorn</p>
                </div>

                <div className="flex flex-wrap -mx-3">
                    <div className="w-full lg:w-3/12 px-3 mb-4">
                        <div className="category-sidebar">
                            {Object.entries(faqCategories).map(([key, category]) => (
                                <button
                                    key={key}
                                    className={`category-btn ${activeCategory === key ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(key as 'general' | 'account' | 'content' | 'creators' | 'technical' | 'legal')}
                                >
                                    <i className={`bi ${category.icon}`}></i>
                                    <span>{category.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-full lg:w-9/12 px-3">
                        <div className="faq-content">
                            <h2 className="category-title">
                                <i className={`bi ${faqCategories[activeCategory].icon}`}></i>
                                {faqCategories[activeCategory].title}
                            </h2>

                            <div className="faq-items">
                                {faqCategories[activeCategory].questions.map(item => (
                                    <div key={item.id} className={`faq-item ${openItems[item.id] ? 'open' : ''}`}>
                                        <button
                                            className="faq-question"
                                            onClick={() => toggleItem(item.id)}
                                        >
                                            <span>{item.question}</span>
                                            <i className={`bi bi-chevron-${openItems[item.id] ? 'up' : 'down'}`}></i>
                                        </button>
                                        {openItems[item.id] && (
                                            <div className="faq-answer">
                                                <p>{item.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="help-box mt-5">
                            <h3>Still need help?</h3>
                            <p>Can't find the answer you're looking for? Our support team is here to help!</p>
                            <div className="help-actions">
                                <a href="mailto:support@reelporn.ai" className="btn-help">
                                    <i className="bi bi-envelope"></i>
                                    Email Support
                                </a>
                                <a href="#" className="btn-help">
                                    <i className="bi bi-chat-dots"></i>
                                    Live Chat
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FAQPage;