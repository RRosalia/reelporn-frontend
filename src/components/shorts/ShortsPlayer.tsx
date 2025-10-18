'use client';

import React, { useRef, useEffect, useState } from 'react';
import './ShortsPlayer.css';

interface Short {
    id: string | number;
    videoUrl: string;
    thumbnail: string;
    likes: number;
    comments: number;
    username: string;
    avatar: string;
    description: string;
}

interface ShortsPlayerProps {
    short: Short;
    isActive: boolean;
    onNext: () => void;
    onPrevious: () => void;
}

function ShortsPlayer({ short, isActive, onNext, onPrevious }: ShortsPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [progress, setProgress] = useState(0);

    // Auto-play/pause based on visibility
    useEffect(() => {
        if (!videoRef.current) return;

        if (isActive) {
            videoRef.current.play().catch(err => {
                console.log('Autoplay prevented:', err);
            });
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
            setProgress(0);
        }
    }, [isActive]);

    // Update progress
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };

        video.addEventListener('timeupdate', updateProgress);
        return () => video.removeEventListener('timeupdate', updateProgress);
    }, []);

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

    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    const handleVideoEnd = () => {
        onNext();
    };

    return (
        <div className="shorts-player">
            {/* Video */}
            <video
                ref={videoRef}
                className="shorts-video"
                src={short.videoUrl}
                poster={short.thumbnail}
                loop={false}
                muted={isMuted}
                playsInline
                onEnded={handleVideoEnd}
                onClick={togglePlayPause}
            />

            {/* Progress Bar */}
            <div className="shorts-progress">
                <div className="shorts-progress-bar" style={{ width: `${progress}%` }} />
            </div>

            {/* Play/Pause Overlay */}
            {!isPlaying && (
                <div className="shorts-play-overlay" onClick={togglePlayPause}>
                    <div className="shorts-play-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                </div>
            )}

            {/* Side Actions */}
            <div className="shorts-actions">
                {/* Like */}
                <button className="shorts-action-btn" onClick={toggleLike}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill={isLiked ? 'red' : 'white'}>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span className="shorts-action-count">
                        {formatNumber(short.likes + (isLiked ? 1 : 0))}
                    </span>
                </button>

                {/* Comment */}
                <button className="shorts-action-btn">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                    <span className="shorts-action-count">
                        {formatNumber(short.comments)}
                    </span>
                </button>

                {/* Share */}
                <button className="shorts-action-btn">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
                    <span className="shorts-action-count">Share</span>
                </button>

                {/* More */}
                <button className="shorts-action-btn">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                </button>

                {/* User Avatar */}
                <button className="shorts-action-btn shorts-avatar">
                    <img src={short.avatar} alt={short.username} />
                </button>
            </div>

            {/* Bottom Info */}
            <div className="shorts-info">
                {/* Mute Button */}
                <button className="shorts-mute-btn" onClick={toggleMute}>
                    {isMuted ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                    )}
                </button>

                {/* User Info */}
                <div className="shorts-user-info">
                    <div className="shorts-username">@{short.username}</div>
                    <button className="shorts-subscribe-btn">Subscribe</button>
                </div>

                {/* Description */}
                <div className="shorts-description">
                    <p className={showDescription ? 'expanded' : 'collapsed'}>
                        {short.description}
                    </p>
                    {short.description.length > 50 && (
                        <button
                            className="shorts-more-btn"
                            onClick={() => setShowDescription(!showDescription)}
                        >
                            {showDescription ? 'less' : 'more'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShortsPlayer;
