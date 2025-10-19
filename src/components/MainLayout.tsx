'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import Link from 'next/link';

interface MainLayoutProps {
    children: React.ReactNode;
    hideUI?: boolean;
}

function MainLayout({ children, hideUI }: MainLayoutProps) {
    const pathname = usePathname();

    // Check if current page is shorts in any language
    const isFullscreenPage = pathname === '/shorts' ||
                            pathname === '/nl/shorts' ||
                            pathname === '/de/shorts' ||
                            pathname === '/fr/shorts';

    // Check if current page is a payment status page (simplified UI)
    const isPaymentPage = pathname?.startsWith('/payment/') ||
                         pathname?.startsWith('/nl/betaling/') ||
                         pathname?.startsWith('/de/zahlung/') ||
                         pathname?.startsWith('/fr/paiement/');

    // Hide header/footer completely for fullscreen pages or when explicitly requested
    if (isFullscreenPage || hideUI) {
        return <>{children}</>;
    }

    // Simplified layout for payment pages
    if (isPaymentPage) {
        return (
            <>
                {/* Simplified Header - Logo only */}
                <header className="bg-gray-900 dark:bg-gray-950 border-b border-gray-800 py-4 relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-center">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">R</span>
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                    ReelPorn
                                </span>
                            </Link>
                        </div>
                    </div>
                </header>

                <main>
                    {children}
                </main>

                {/* Simplified Footer */}
                <footer className="bg-gray-900 dark:bg-gray-950 border-t border-gray-800 py-6 relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="text-center">
                            <p className="text-gray-400 text-sm">
                                © {new Date().getFullYear()} ReelPorn. All rights reserved.
                            </p>
                            <div className="flex justify-center gap-4 mt-3 text-xs">
                                <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">
                                    Terms
                                </Link>
                                <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">
                                    Privacy
                                </Link>
                                <Link href="/support" className="text-gray-500 hover:text-gray-300 transition-colors">
                                    Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />

            {/* Mini Player - Would need context implementation */}
            {/* {isOpen && queue.length > 0 && (
                <MiniPlayer
                    queue={queue}
                    currentIndex={currentIndex}
                    onClose={closeMiniPlayer}
                    onNext={goToNext}
                    onPrevious={goToPrevious}
                />
            )} */}
        </div>
    );
}

export default MainLayout;
