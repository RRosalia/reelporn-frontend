'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ShortsPlayer from '@/components/shorts/ShortsPlayer';
import ForcedAdvert from '@/components/promotions/ForcedAdvert';

export default function ShortsPageClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPremium, setIsPremium] = useState(false); // Simulate premium status
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isScrolling = useRef(false);
    const hasInitialized = useRef(false);

    // Mock shorts data - replace with API call later
    const mockShorts = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
        id: 100000 + i + 1, // Unique video IDs
        videoUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
        thumbnail: `https://picsum.photos/seed/${i + 1}/1080/1920`,
        title: `Hot Short ${i + 1}`,
        username: `user${i + 1}`,
        avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
        // Use deterministic values based on index to avoid hydration issues
        likes: ((i + 1) * 12345) % 100000,
        comments: ((i + 1) * 2345) % 10000,
        description: `Check out this amazing short video #${i + 1} 🔥`,
        uploadedAt: `${((i + 1) * 3) % 24}h ago`
    })), []);

    // Insert ads every 3 videos for non-premium users
    const createContentWithAds = () => {
        if (isPremium) return mockShorts; // Premium users don't see ads

        const contentWithAds: any[] = [];
        const AD_FREQUENCY = 3; // Show ad after every 3 videos

        mockShorts.forEach((short, index) => {
            contentWithAds.push(short);

            // Insert ad after every AD_FREQUENCY videos (but not after the last video)
            if ((index + 1) % AD_FREQUENCY === 0 && index !== mockShorts.length - 1) {
                contentWithAds.push({
                    id: `ad-${index}`,
                    isAd: true,
                    duration: 15, // 15 second ads
                    skipAfter: 5, // Can skip after 5 seconds
                    advertiser: ['Hot Singles', 'Premium Cams', 'VIP Content', 'Special Offer'][Math.floor(Math.random() * 4)],
                    ctaText: ['Join Now', 'Watch Live', 'Get Access', 'Claim Offer'][Math.floor(Math.random() * 4)],
                    ctaLink: '/subscriptions'
                });
            }
        });

        return contentWithAds;
    };

    const content = createContentWithAds();

    // Initialize from URL parameter
    useEffect(() => {
        if (hasInitialized.current) return;

        const viewParam = searchParams.get('view');
        if (viewParam && !viewParam.startsWith('ad-')) {
            const videoId = parseInt(viewParam);
            const index = content.findIndex(item => !item.isAd && item.id === videoId);
            if (index !== -1) {
                setTimeout(() => {
                    setCurrentIndex(index);
                    isScrolling.current = true;
                }, 0);

                setTimeout(() => {
                    const container = containerRef.current;
                    if (container) {
                        container.scrollTo({
                            top: index * window.innerHeight,
                            behavior: 'auto'
                        });

                        setTimeout(() => {
                            isScrolling.current = false;
                        }, 200);
                    }
                }, 100);
            }
        } else if (!viewParam) {
            // Set initial view parameter
            const firstContent = content.find(item => !item.isAd);
            if (firstContent) {
                const params = new URLSearchParams(searchParams.toString());
                params.set('view', firstContent.id.toString());
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            }
        }

        hasInitialized.current = true;
    }, []);

    // Update URL when currentIndex changes (only for non-ad content)
    useEffect(() => {
        if (!hasInitialized.current) return;

        const currentContent = content[currentIndex];
        if (currentContent && !currentContent.isAd) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('view', currentContent.id.toString());
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    }, [currentIndex, searchParams, router, pathname]);

    // Handle scroll snap
    const handleScroll = () => {
        if (isScrolling.current) return;

        const container = containerRef.current;
        if (!container) return;

        const scrollPosition = container.scrollTop;
        const windowHeight = window.innerHeight;
        const newIndex = Math.round(scrollPosition / windowHeight);

        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    };

    const scrollToIndex = useCallback((index: number) => {
        const container = containerRef.current;
        if (!container) return;

        // Check if trying to scroll away from a forced ad
        const currentContent = content[currentIndex];
        if (currentContent?.isAd && currentContent.isForced) {
            return; // Can't scroll away from forced ad
        }

        isScrolling.current = true;
        container.scrollTo({
            top: index * window.innerHeight,
            behavior: 'smooth'
        });

        setTimeout(() => {
            isScrolling.current = false;
            setCurrentIndex(index);
        }, 500);
    }, [content, currentIndex]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const currentContent = content[currentIndex];

            // Prevent navigation during forced ad playback
            if (currentContent?.isAd && currentContent.isForced) {
                e.preventDefault();
                return;
            }

            if (e.key === 'ArrowDown' && currentIndex < content.length - 1) {
                scrollToIndex(currentIndex + 1);
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                scrollToIndex(currentIndex - 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, content, scrollToIndex]);

    const handleAdComplete = () => {
        // Auto-advance to next video after ad completes
        if (currentIndex < content.length - 1) {
            scrollToIndex(currentIndex + 1);
        }
    };

    return (
        <>
            {/* Premium Toggle for Demo */}
            <button
                style={{
                    position: 'fixed',
                    top: '70px',
                    right: '20px',
                    zIndex: 9999,
                    background: isPremium
                        ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
                        : 'rgba(0,0,0,0.5)',
                    color: isPremium ? '#333' : 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                }}
                onClick={() => setIsPremium(!isPremium)}
                title="Toggle premium status (demo)"
            >
                {isPremium ? '👑 Premium' : '🎭 Free User'}
            </button>

            <div
                ref={containerRef}
                className="shorts-container"
                onScroll={handleScroll}
                style={{
                    height: '100vh',
                    overflow: 'auto',
                    scrollSnapType: 'y mandatory',
                    scrollBehavior: 'smooth'
                }}
            >
                {content.map((item, index) => {
                    if (item.isAd) {
                        return (
                            <ForcedAdvert
                                key={item.id}
                                adData={item}
                                isActive={index === currentIndex}
                                onComplete={handleAdComplete}
                                onSkip={() => scrollToIndex(index + 1)}
                            />
                        );
                    } else {
                        return (
                            <ShortsPlayer
                                key={item.id}
                                short={item}
                                isActive={index === currentIndex}
                                onNext={() => {
                                    if (index < content.length - 1) {
                                        const nextContent = content[index + 1];
                                        // If next is an ad, mark it as forced
                                        if (nextContent?.isAd) {
                                            nextContent.isForced = true;
                                        }
                                        scrollToIndex(index + 1);
                                    }
                                }}
                                onPrevious={() => index > 0 && scrollToIndex(index - 1)}
                            />
                        );
                    }
                })}
            </div>
        </>
    );
}
