'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import './TopLoader.css';

function TopLoader() {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Start loading on route change
        setIsLoading(true);
        setProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                // Random increment to make it look natural
                const increment = Math.random() * 30;
                return Math.min(oldProgress + increment, 90);
            });
        }, 200);

        // Complete the loading after a short delay
        const timer = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                setIsLoading(false);
                setProgress(0);
            }, 200);
        }, 300);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(timer);
        };
    }, [pathname]);

    if (!isLoading) return null;

    return (
        <div className="top-loader">
            <div
                className="top-loader-bar"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

export default TopLoader;
