'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Video {
    id: string | number;
    title: string;
    thumbnail: string;
    likes: number | string;
    views: number | string;
    duration: number;
    uploadedAt: string;
}

interface VideoCardProps {
    video: Video;
}

function VideoCard({ video }: VideoCardProps) {
    const [imageError, setImageError] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // Convert video data to shorts format for mini player
        // This would need MiniPlayerContext implementation
        // const shortVideo = {
        //     id: video.id,
        //     title: video.title,
        //     thumbnail: video.thumbnail,
        //     videoUrl: video.thumbnail.replace('/seed/', '/seed/video-'),
        //     likes: video.likes,
        //     views: video.views,
        //     duration: video.duration
        // };
        // openMiniPlayer(shortVideo);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div
            onClick={handleClick}
            className="no-underline cursor-pointer"
        >
            <div className="border-0 shadow-sm h-full relative overflow-hidden video-card rounded-lg" style={{
                background: 'linear-gradient(135deg, #2b2838 0%, #1a1626 100%)'
            }}>
                {/* Thumbnail */}
                <div className="aspect-[9/16] relative" style={{
                    background: `linear-gradient(135deg,
                        hsl(${(Number(video.id) * 37) % 360}, 70%, 30%) 0%,
                        hsl(${(Number(video.id) * 37 + 60) % 360}, 70%, 20%) 100%)`
                }}>
                    {!imageError && (
                        <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover"
                            loading="lazy"
                            onError={handleImageError}
                            style={{ opacity: imageError ? 0 : 1 }}
                        />
                    )}
                    {/* Play overlay */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-dark bg-opacity-50 rounded-full p-3">
                            <i className="bi bi-play-fill text-white text-4xl"></i>
                        </div>
                    </div>
                    {/* Duration badge */}
                    <span className="absolute bottom-0 right-0 m-2 px-2 py-1 bg-dark bg-opacity-75 text-white text-xs rounded">
                        {video.duration}s
                    </span>
                    {/* View count */}
                    <span className="absolute bottom-0 left-0 m-2 px-2 py-1 bg-dark bg-opacity-75 text-white text-xs rounded">
                        <i className="bi bi-eye mr-1"></i>
                        {video.views}
                    </span>
                </div>

                {/* Card body */}
                <div className="p-2">
                    <h6 className="truncate mb-1 text-white text-sm font-medium">
                        {video.title}
                    </h6>
                    <div className="flex justify-between items-center">
                        <small className="text-gray-400 text-xs">
                            <i className="bi bi-heart mr-1"></i>
                            {video.likes}
                        </small>
                        <small className="text-gray-400 text-xs">{video.uploadedAt}</small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;
