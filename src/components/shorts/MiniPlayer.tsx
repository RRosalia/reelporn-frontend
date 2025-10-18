'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import './MiniPlayer.css';

interface Short {
    id: string | number;
    videoUrl: string;
    thumbnail: string;
    title: string;
}

interface MiniPlayerProps {
    queue: Short[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
}

function MiniPlayer({ queue, currentIndex, onClose, onNext, onPrevious }: MiniPlayerProps) {
    const router = useRouter();
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState({ width: 400, height: 300 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const currentShort = queue[currentIndex];

    // Set initial position on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPosition({ x: window.innerWidth - 420, y: window.innerHeight - 350 });
        }
    }, []);

    // Auto-play video
    useEffect(() => {
        if (videoRef.current && isPlaying) {
            videoRef.current.play().catch(err => {
                console.log('Autoplay prevented:', err);
            });
        }
    }, [currentShort, isPlaying]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.mini-player-controls') || (e.target as HTMLElement).closest('.resize-handle')) return;

        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            });
        } else if (isResizing) {
            const deltaX = e.clientX - resizeStart.x;
            const deltaY = e.clientY - resizeStart.y;

            // Maintain aspect ratio (4:3)
            const newWidth = Math.max(300, Math.min(800, resizeStart.width + deltaX));
            const newHeight = (newWidth * 3) / 4;

            setSize({
                width: newWidth,
                height: newHeight
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, dragOffset, resizeStart]);

    const togglePlayPause = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const goFullscreen = () => {
        router.push(`/shorts?view=${currentShort.id}` as any);
    };

    const handleVideoEnd = () => {
        if (currentIndex < queue.length - 1) {
            onNext();
        }
    };

    if (!currentShort) return null;

    return (
        <div
            ref={playerRef}
            className={`mini-player ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${size.width}px`,
                height: `${size.height}px`
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Video */}
            <video
                ref={videoRef}
                className="mini-player-video"
                src={currentShort.videoUrl}
                poster={currentShort.thumbnail}
                loop={false}
                muted={isMuted}
                playsInline
                onEnded={handleVideoEnd}
                onClick={togglePlayPause}
            />

            {/* Controls Overlay */}
            <div className="mini-player-controls">
                {/* Top Bar */}
                <div className="mini-player-top-bar">
                    <button className="mini-player-btn" onClick={goFullscreen} title="Fullscreen">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                        </svg>
                    </button>
                    <button className="mini-player-btn" onClick={onClose} title="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>

                {/* Bottom Controls */}
                <div className="mini-player-bottom-bar">
                    <button className="mini-player-btn" onClick={togglePlayPause}>
                        {isPlaying ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        )}
                    </button>

                    <button className="mini-player-btn" onClick={toggleMute}>
                        {isMuted ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                            </svg>
                        )}
                    </button>

                    <div className="mini-player-queue-info">
                        {currentIndex + 1} / {queue.length}
                    </div>

                    <button
                        className="mini-player-btn"
                        onClick={onPrevious}
                        disabled={currentIndex === 0}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                        </svg>
                    </button>

                    <button
                        className="mini-player-btn"
                        onClick={onNext}
                        disabled={currentIndex === queue.length - 1}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Queue indicator */}
            <div className="mini-player-title">
                {currentShort.title}
            </div>

            {/* Resize handle */}
            <div
                className="resize-handle"
                onMouseDown={handleResizeMouseDown}
                title="Resize"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M22 22H20V20H22V22M22 18H20V16H22V18M18 22H16V20H18V22M18 18H16V16H18V18M14 22H12V20H14V22M22 14H20V12H22V14Z"/>
                </svg>
            </div>
        </div>
    );
}

export default MiniPlayer;
