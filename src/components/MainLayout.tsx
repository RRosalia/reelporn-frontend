'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';

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

    // Hide header/footer for fullscreen pages or blocked page
    if (isFullscreenPage || hideUI) {
        return <>{children}</>;
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
