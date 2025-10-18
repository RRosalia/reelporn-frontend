'use client';

import React from 'react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import './Footer.css';

interface Language {
    code: string;
    name: string;
    flag: string;
}

function Footer() {
    const t = useTranslations();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const currentYear = new Date().getFullYear();

    const languages: Language[] = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ];

    const handleLanguageChange = (newLang: string) => {
        router.push(pathname as any, { locale: newLang });
    };

    const handleCookieSettings = () => {
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('openCookieSettings');
            window.dispatchEvent(event);
        }
    };

    return (
        <footer className="modern-footer">
            <div className="footer-gradient"></div>
            <div className="container mx-auto px-4 py-12 relative">
                <div className="flex flex-wrap -mx-2">
                    {/* Quick Links */}
                    <div className="w-1/2 md:w-1/4 lg:w-1/4 px-2">
                        <h5 className="footer-heading">{t('footer.quickLinks')}</h5>
                        <ul className="footer-links">
                            <li>
                                <Link href="/">
                                    {t('header.home')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/shorts">
                                    {t('footer.shorts')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories">
                                    {t('header.categories')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/pornstars">
                                    {t('pornstars.title')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div className="w-1/2 md:w-1/4 lg:w-1/4 px-2">
                        <h5 className="footer-heading">{t('footer.account')}</h5>
                        <ul className="footer-links">
                            <li>
                                <Link href="/signup">
                                    {t('profile.register')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/login">
                                    {t('profile.login')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/subscriptions">
                                    {t('profile.subscriptions')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="w-1/2 md:w-1/4 lg:w-1/4 px-2">
                        <h5 className="footer-heading">{t('footer.support')}</h5>
                        <ul className="footer-links">
                            <li>
                                <Link href={"/contact" as any}>
                                    {t('header.contact')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq">
                                    {t('profile.faq')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms">
                                    {t('footer.terms')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy">
                                    {t('footer.privacy')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="w-1/2 md:w-1/4 lg:w-1/4 px-2">
                        <h5 className="footer-heading">{t('footer.legal')}</h5>
                        <ul className="footer-links">
                            <li>
                                <Link href="/dmca">
                                    {t('footer.dmca')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/2257">
                                    2257
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookie-policy">
                                    {t('footer.cookies')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Brand Section */}
                    <div className="w-full px-2 mt-8 mb-8">
                        <div className="footer-brand mb-3">
                            <h3 className="brand-logo">ReelPorn</h3>
                        </div>
                        <p className="footer-description max-w-md">
                            {t('footer.description')}
                        </p>
                        <div className="social-links mt-4">
                            <a href="#" className="social-icon" aria-label="Twitter">
                                <i className="bi bi-twitter"></i>
                            </a>
                            <a href="#" className="social-icon" aria-label="Instagram">
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="#" className="social-icon" aria-label="Discord">
                                <i className="bi bi-discord"></i>
                            </a>
                            <a href="#" className="social-icon" aria-label="Telegram">
                                <i className="bi bi-telegram"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom mt-12 pt-4">
                    <div className="flex flex-wrap items-center -mx-2">
                        <div className="w-full md:w-1/2 px-2 text-center md:text-left mb-3 md:mb-0">
                            <p className="copyright mb-0">
                                © {currentYear} <span className="brand-highlight">ReelPorn</span>. {t('footer.copyright')}.
                            </p>
                        </div>
                        <div className="w-full md:w-1/2 px-2 text-center md:text-right">
                            <div className="flex justify-center md:justify-end gap-3 items-center">
                                <button
                                    onClick={handleCookieSettings}
                                    className="cookie-settings-btn"
                                >
                                    <i className="bi bi-gear mr-2"></i>
                                    {t('footer.cookieSettings')}
                                </button>
                                <div className="inline-flex items-center gap-2">
                                    <i className="bi bi-globe2 text-[#f8c537] text-lg"></i>
                                    <select
                                        value={locale}
                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                        className="bg-[rgba(43,40,56,0.8)] text-white border border-[rgba(248,197,55,0.3)] rounded-lg px-4 py-2 text-sm cursor-pointer outline-none transition-all duration-300 hover:border-[#f8c537] hover:bg-[rgba(43,40,56,1)]"
                                    >
                                        {languages.map((lang) => (
                                            <option key={lang.code} value={lang.code} className="bg-[#2b2838] text-white p-2">
                                                {lang.flag} {lang.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
