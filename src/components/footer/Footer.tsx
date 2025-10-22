'use client';

import React from 'react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { languages } from '@/i18n/languages';
import './Footer.css';

function Footer() {
    const t = useTranslations();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const currentYear = new Date().getFullYear();
    const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);
    const languageMenuRef = React.useRef<HTMLDivElement>(null);

    // Click outside handler to close dropdown
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
                setShowLanguageMenu(false);
            }
        };

        if (showLanguageMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLanguageMenu]);

    const handleLanguageChange = (newLang: string) => {
        setShowLanguageMenu(false);
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
                        {/* <div className="social-links mt-4">
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
                        </div> */}
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
                                <div className="relative" ref={languageMenuRef}>
                                    <button
                                        onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                                        className="inline-flex items-center gap-2 bg-[rgba(43,40,56,0.8)] text-white border border-[rgba(248,197,55,0.3)] rounded-lg px-4 py-2 text-sm cursor-pointer outline-none transition-all duration-300 hover:border-[#f8c537] hover:bg-[rgba(43,40,56,1)]"
                                    >
                                        <i className="bi bi-globe2 text-[#f8c537]"></i>
                                        <span>{languages.find(l => l.code === locale)?.flag} {languages.find(l => l.code === locale)?.name}</span>
                                    </button>
                                    {showLanguageMenu && (
                                        <ul className="absolute bottom-full right-0 mb-2 w-48 bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-700 overflow-hidden">
                                            {languages.map((lang) => (
                                                <li key={lang.code}>
                                                    <button
                                                        className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors cursor-pointer ${locale === lang.code ? 'bg-pink-500 text-white hover:bg-pink-600' : 'text-gray-100'}`}
                                                        onClick={() => handleLanguageChange(lang.code)}
                                                    >
                                                        {lang.flag} {lang.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
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
