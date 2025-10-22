'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getAllMockVideoSlugs, mockVideos } from '@/lib/mocks/videoMockData';
import './videos-list.css';

/**
 * Video listing page - shows all available mock videos for testing
 */
function VideosListPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const videoSlugs = getAllMockVideoSlugs();

  return (
    <div className="videos-list-page">
      <div className="videos-list-header">
        <h1>Test Video Pages</h1>
        <p>Click on any video below to test the video landing page</p>
      </div>

      <div className="videos-grid">
        {videoSlugs.map((slug) => {
          const video = mockVideos[slug];
          return (
            <Link
              key={slug}
              href={`/${locale}/videos/${slug}`}
              className="video-card"
            >
              <div className="video-thumbnail">
                <Image src={video.thumbnail} alt={video.title} width={320} height={180} />
                {video.is_premium && (
                  <div className="premium-badge">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    Premium
                  </div>
                )}
                <div className="video-duration">
                  {Math.floor(video.duration / 60)}:{(video.duration % 60)
                    .toString()
                    .padStart(2, '0')}
                </div>
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
                <p className="video-username">@{video.username}</p>
                <div className="video-stats">
                  <span>{(video.views / 1000).toFixed(1)}K views</span>
                  <span>•</span>
                  <span>{(video.likes / 1000).toFixed(1)}K likes</span>
                </div>
              </div>
            </Link>
          );
        })}

        {/* 404 Test Card */}
        <Link
          href={`/${locale}/videos/non-existent-video`}
          className="video-card test-404"
        >
          <div className="video-thumbnail error-thumbnail">
            <div className="error-icon">
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="test-label">404 TEST</div>
          </div>
          <div className="video-info">
            <h3>Test 404 Error</h3>
            <p className="video-username">Non-existent video</p>
            <div className="video-stats">
              <span>Click to see 404 page</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="videos-list-footer">
        <h2>Testing Instructions</h2>
        <div className="instructions">
          <div className="instruction-item">
            <div className="instruction-number">1</div>
            <div>
              <strong>Regular Videos:</strong> Click on videos without premium
              badge to see standard video pages
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-number">2</div>
            <div>
              <strong>Premium Videos:</strong> Click on videos with gold premium
              badge to see paywalled content structured data
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-number">3</div>
            <div>
              <strong>404 Error:</strong> Click the "404 TEST" card to see the
              not-found page
            </div>
          </div>
          <div className="instruction-item">
            <div className="instruction-number">4</div>
            <div>
              <strong>SEO Testing:</strong> View page source to see VideoObject
              and Paywalled Content structured data
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideosListPage;
