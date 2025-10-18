'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import './styles.css';

function FAQPage() {
    const t = useTranslations();
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
            title: t('faq.categories.general.title'),
            icon: 'bi-info-circle',
            questions: [
                { id: 'q1', question: t('faq.categories.general.q1.question'), answer: t('faq.categories.general.q1.answer') },
                { id: 'q2', question: t('faq.categories.general.q2.question'), answer: t('faq.categories.general.q2.answer') },
                { id: 'q3', question: t('faq.categories.general.q3.question'), answer: t('faq.categories.general.q3.answer') },
                { id: 'q4', question: t('faq.categories.general.q4.question'), answer: t('faq.categories.general.q4.answer') }
            ]
        },
        account: {
            title: t('faq.categories.account.title'),
            icon: 'bi-person-circle',
            questions: [
                { id: 'q1', question: t('faq.categories.account.q1.question'), answer: t('faq.categories.account.q1.answer') },
                { id: 'q2', question: t('faq.categories.account.q2.question'), answer: t('faq.categories.account.q2.answer') },
                { id: 'q3', question: t('faq.categories.account.q3.question'), answer: t('faq.categories.account.q3.answer') },
                { id: 'q4', question: t('faq.categories.account.q4.question'), answer: t('faq.categories.account.q4.answer') },
                { id: 'q5', question: t('faq.categories.account.q5.question'), answer: t('faq.categories.account.q5.answer') }
            ]
        },
        content: {
            title: t('faq.categories.content.title'),
            icon: 'bi-camera-video',
            questions: [
                { id: 'q1', question: t('faq.categories.content.q1.question'), answer: t('faq.categories.content.q1.answer') },
                { id: 'q2', question: t('faq.categories.content.q2.question'), answer: t('faq.categories.content.q2.answer') },
                { id: 'q3', question: t('faq.categories.content.q3.question'), answer: t('faq.categories.content.q3.answer') },
                { id: 'q4', question: t('faq.categories.content.q4.question'), answer: t('faq.categories.content.q4.answer') },
                { id: 'q5', question: t('faq.categories.content.q5.question'), answer: t('faq.categories.content.q5.answer') }
            ]
        },
        creators: {
            title: t('faq.categories.creators.title'),
            icon: 'bi-stars',
            questions: [
                { id: 'q1', question: t('faq.categories.creators.q1.question'), answer: t('faq.categories.creators.q1.answer') },
                { id: 'q2', question: t('faq.categories.creators.q2.question'), answer: t('faq.categories.creators.q2.answer') },
                { id: 'q3', question: t('faq.categories.creators.q3.question'), answer: t('faq.categories.creators.q3.answer') },
                { id: 'q4', question: t('faq.categories.creators.q4.question'), answer: t('faq.categories.creators.q4.answer') },
                { id: 'q5', question: t('faq.categories.creators.q5.question'), answer: t('faq.categories.creators.q5.answer') }
            ]
        },
        technical: {
            title: t('faq.categories.technical.title'),
            icon: 'bi-gear',
            questions: [
                { id: 'q1', question: t('faq.categories.technical.q1.question'), answer: t('faq.categories.technical.q1.answer') },
                { id: 'q2', question: t('faq.categories.technical.q2.question'), answer: t('faq.categories.technical.q2.answer') },
                { id: 'q3', question: t('faq.categories.technical.q3.question'), answer: t('faq.categories.technical.q3.answer') },
                { id: 'q4', question: t('faq.categories.technical.q4.question'), answer: t('faq.categories.technical.q4.answer') }
            ]
        },
        legal: {
            title: t('faq.categories.legal.title'),
            icon: 'bi-shield-check',
            questions: [
                { id: 'q1', question: t('faq.categories.legal.q1.question'), answer: t('faq.categories.legal.q1.answer') },
                { id: 'q2', question: t('faq.categories.legal.q2.question'), answer: t('faq.categories.legal.q2.answer') },
                { id: 'q3', question: t('faq.categories.legal.q3.question'), answer: t('faq.categories.legal.q3.answer') },
                { id: 'q4', question: t('faq.categories.legal.q4.question'), answer: t('faq.categories.legal.q4.answer') }
            ]
        }
    };

    return (
        <div className="faq-page">
            <div className="container mx-auto px-4 py-12">
                <div className="page-header mb-5">
                    <h1 className="page-title">{t('faq.title')}</h1>
                    <p className="page-subtitle">{t('faq.subtitle')}</p>
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
                            <h3>{t('faq.help.title')}</h3>
                            <p>{t('faq.help.description')}</p>
                            <div className="help-actions">
                                <a href="mailto:support@reelporn.ai" className="btn-help">
                                    <i className="bi bi-envelope"></i>
                                    {t('faq.help.emailSupport')}
                                </a>
                                <a href="#" className="btn-help">
                                    <i className="bi bi-chat-dots"></i>
                                    {t('faq.help.liveChat')}
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