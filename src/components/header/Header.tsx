'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import './Header.css';

interface Language {
    code: string;
    name: string;
    flag: string;
}

function Header() {
    const t = useTranslations();
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const { isAuthenticated, user, logout } = useAuth();

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const profileMenuRef = useRef<HTMLDivElement>(null);
    const languageMenuRef = useRef<HTMLDivElement>(null);
    const navbarRef = useRef<HTMLElement>(null);

    // Scroll handler to add/remove scrolled class
    useEffect(() => {
        const handleScroll = () => {
            if (navbarRef.current) {
                if (window.scrollY > 50) {
                    navbarRef.current.classList.add('scrolled');
                } else {
                    navbarRef.current.classList.remove('scrolled');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Click outside handler to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
            if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
                setShowLanguageMenu(false);
            }
        };

        if (showProfileMenu || showLanguageMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileMenu, showLanguageMenu]);

    const handleLogout = async () => {
        try {
            await logout();
            setShowProfileMenu(false);
            router.push('/login?message=logoutSuccess' as any);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const languages: Language[] = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
    ];

    const handleLanguageChange = (newLocale: string) => {
        setShowLanguageMenu(false);
        router.push(pathname as any, { locale: newLocale });
    };

    return (
        <nav ref={navbarRef} className="navbar-dark bg-gray-900 text-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                    <Link className="navbar-brand text-2xl" href="/">
                        ReelPorn
                    </Link>
                    <button
                        className="lg:hidden p-2"
                        type="button"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        aria-controls="navbarNav"
                        aria-expanded={showMobileMenu}
                        aria-label="Toggle navigation"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className={`${showMobileMenu ? 'block' : 'hidden'} lg:flex lg:items-center lg:gap-4 absolute lg:relative top-full left-0 right-0 lg:top-auto bg-gray-900 lg:bg-transparent z-50`} id="navbarNav">
                        <ul className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-4 mr-auto">
                        <li>
                            <Link className="block px-4 py-2 lg:p-0 hover:text-pink-500 transition-colors" href="/">
                                {t('header.home')}
                            </Link>
                        </li>
                        {/* <li>
                            <Link className="block px-4 py-2 lg:p-0 hover:text-pink-500 transition-colors" href="/categories">
                                {t('header.categories')}
                            </Link>
                        </li> */}
                        <li>
                            <Link className="block px-4 py-2 lg:p-0 hover:text-pink-500 transition-colors" href="/pornstars">
                                {t('pornstars.title')}
                            </Link>
                        </li>
                        {/* <li>
                            <Link className="block px-4 py-2 lg:p-0 hover:text-pink-500 transition-colors" href={"/blog" as any}>
                                {t('blog.title')}
                            </Link>
                        </li> */}
                        <li>
                            <Link className="block px-4 py-2 lg:p-0 hover:text-pink-500 transition-colors" href={"/contact" as any}>
                                {t('header.contact')}
                            </Link>
                        </li>
                    </ul>

                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 p-4 lg:p-0">
                        {/* Language Switcher */}
                        <div className="relative" ref={languageMenuRef}>
                            <button
                                className="w-full lg:w-auto px-4 py-2 border border-gray-600 rounded hover:bg-gray-800 transition-colors cursor-pointer"
                                type="button"
                                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                            >
                                {languages.find(l => l.code === locale)?.flag} {languages.find(l => l.code === locale)?.code.toUpperCase()}
                            </button>
                            {showLanguageMenu && (
                                <ul className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-700 overflow-hidden">
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

                        {/* Watch Button */}
                        <Link href="/shorts" className="block lg:inline-block px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors text-center">
                            {t('header.watch')}
                        </Link>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileMenuRef}>
                            <button
                                className="w-full lg:w-auto px-4 py-2 border border-gray-600 rounded hover:bg-gray-800 transition-colors cursor-pointer"
                                type="button"
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            </button>
                            {showProfileMenu && (
                                <ul className="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg z-50">
                                    {!isAuthenticated ? (
                                        <>
                                            <li className="px-3 py-2 text-center border-b border-gray-200">
                                                <div className="flex justify-around">
                                                    <Link href="/signup" className="no-underline text-gray-900" onClick={() => setShowProfileMenu(false)}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                                        </svg>
                                                        <div className="text-xs mt-1">{t('profile.register')}</div>
                                                    </Link>
                                                    <Link href="/login" className="no-underline text-gray-900" onClick={() => setShowProfileMenu(false)}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                                                        </svg>
                                                        <div className="text-xs mt-1">{t('profile.login')}</div>
                                                    </Link>
                                                </div>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li className="px-3 py-2 text-center border-b border-gray-200">
                                                <div className="text-gray-900 font-semibold">
                                                    {user?.name || user?.email || 'User'}
                                                </div>
                                                <div className="text-xs text-gray-500">{user?.email}</div>
                                            </li>
                                            <li>
                                                <Link className="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-900 cursor-pointer" href="/account" onClick={() => setShowProfileMenu(false)}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                                    </svg>
                                                    {t('profile.account') || 'My Account'}
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    <li>
                                        <Link className="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-900 cursor-pointer" href="/subscriptions" onClick={() => setShowProfileMenu(false)}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                            {t('profile.subscriptions')}
                                        </Link>
                                    </li>
                                    <li><hr className="border-t border-gray-200 my-1" /></li>
                                    <li>
                                        <Link className="w-full text-left flex items-center px-4 py-2 hover:bg-gray-100 text-gray-900 cursor-pointer" href="/faq" onClick={() => setShowProfileMenu(false)}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                            </svg>
                                            {t('profile.faq')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="w-full text-left flex items-center px-4 py-2 hover:bg-gray-100 text-gray-900 cursor-pointer" href={"/contact" as any} onClick={() => setShowProfileMenu(false)}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                            </svg>
                                            {t('profile.support')}
                                        </Link>
                                    </li>
                                    {isAuthenticated && (
                                        <>
                                            <li><hr className="border-t border-gray-200 my-1" /></li>
                                            <li>
                                                <button
                                                    className="w-full text-left flex items-center px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                                                    onClick={handleLogout}
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                                                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                                                    </svg>
                                                    {t('profile.logout') || 'Logout'}
                                                </button>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </nav>
    );
}

export default Header;
