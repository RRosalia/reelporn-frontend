'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/contexts/AuthContext';
import ReelRepository from '@/lib/repositories/ReelRepository';
import { Reel } from '@/types/Reel';
import { mockVideos } from '@/lib/mocks/videoMockData';
import AuthModal from '@/components/auth/AuthModal';
import './styles.css';

interface VideoStructuredData {
  '@context': 'https://schema.org';
  '@type': 'VideoObject';
  name: string;
  description: string;
  thumbnailUrl: string[];
  uploadDate: string;
  duration?: string;
  contentUrl: string;
  embedUrl?: string;
  interactionStatistic?: Array<{
    '@type': 'InteractionCounter';
    interactionType: string;
    userInteractionCount: number;
  }>;
}

interface PaywalledContentStructuredData {
  '@context': 'https://schema.org';
  '@type': 'WebPage';
  hasPart: {
    '@type': 'WebPageElement';
    isAccessibleForFree: 'False';
    cssSelector: string;
  };
}

function VideoPage() {
  const t = useTranslations();
  const params = useParams();
  const { isAuthenticated, user } = useAuth();
  const slug = params?.slug as string;
  const locale = (params?.locale as string) || 'en';

  const [reel, setReel] = useState<Reel | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  // Get related videos (exclude current video)
  const getRelatedVideos = () => {
    return Object.values(mockVideos)
      .filter((v) => v.slug !== slug)
      .slice(0, 6);
  };

  useEffect(() => {
    const fetchReel = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setNotFound(false);
        const data = await ReelRepository.getBySlug(slug);
        setReel(data);
      } catch (err: any) {
        console.error('Error fetching reel:', err);

        // If 404, show inline not found instead of separate page
        if (err?.response?.status === 404) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReel();
  }, [slug]);

  // Generate Video structured data (schema.org)
  const generateVideoStructuredData = (reel: Reel): VideoStructuredData => {
    // Convert duration from seconds to ISO 8601 duration format (PT#M#S)
    const formatDuration = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `PT${mins}M${secs}S`;
    };

    return {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: reel.title,
      description: reel.description,
      thumbnailUrl: [reel.thumbnail],
      uploadDate: reel.uploadedAt,
      duration: formatDuration(reel.duration),
      contentUrl: reel.videoUrl,
      embedUrl: `${window.location.origin}/${locale}/videos/${reel.slug}`,
      interactionStatistic: [
        {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/WatchAction',
          userInteractionCount: reel.views,
        },
        {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/LikeAction',
          userInteractionCount: reel.likes,
        },
        {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/CommentAction',
          userInteractionCount: reel.comments,
        },
      ],
    };
  };

  // Generate Paywalled Content structured data (for premium videos)
  const generatePaywalledContentStructuredData = (): PaywalledContentStructuredData => {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      hasPart: {
        '@type': 'WebPageElement',
        isAccessibleForFree: 'False',
        cssSelector: '.video-player',
      },
    };
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatUploadDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInMinutes < 60) {
      return t('videos.uploadedMinutesAgo', { minutes: diffInMinutes });
    } else if (diffInHours < 24) {
      return t('videos.uploadedHoursAgo', { hours: diffInHours });
    } else if (diffInDays < 30) {
      return t('videos.uploadedDaysAgo', { days: diffInDays });
    } else if (diffInMonths < 12) {
      return t('videos.uploadedMonthsAgo', { months: diffInMonths });
    } else {
      return t('videos.uploadedYearsAgo', { years: diffInYears });
    }
  };

  const handleShare = async () => {
    if (!reel) return;

    const shareUrl = window.location.href;
    const shareTitle = reel.title;
    const shareText = `${reel.title} - Watch on ReelPorn`;

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });

        // Track successful share via native API
        trackShareEvent('native_share', true);
        console.log('Successfully shared');
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          // Fallback to copy
          copyToClipboard(shareUrl);
        } else {
          // User cancelled - track as cancelled
          trackShareEvent('native_share', false);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);

      // Track successful clipboard copy
      trackShareEvent('clipboard', true);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Ultimate fallback: Create a temporary input
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);

      // Track successful legacy copy
      trackShareEvent('clipboard_legacy', true);
    }
  };

  const trackShareEvent = (method: string, success: boolean) => {
    if (!reel) return;

    // Push event to Google Tag Manager dataLayer
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'video_share',
        video_id: reel.id,
        video_slug: reel.slug,
        video_title: reel.title,
        video_category: reel.category || 'uncategorized',
        is_premium: reel.isPremium,
        share_method: method,
        share_success: success,
        page_url: window.location.href,
        timestamp: new Date().toISOString(),
      });

      console.log('GTM Event Tracked:', {
        event: 'video_share',
        video_id: reel.id,
        video_slug: reel.slug,
        share_method: method,
        share_success: success,
      });
    } else {
      console.warn('Google Tag Manager dataLayer not found');
    }
  };

  const handleLike = async () => {
    if (!reel) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show login dialog
      setShowLoginDialog(true);

      // Track attempt to like without auth
      trackLikeEvent('unauthenticated', false);
      return;
    }

    // Prevent double-clicking
    if (isLiking) return;

    setIsLiking(true);

    // Optimistic update
    const previousLiked = isLiked;
    const previousCount = likeCount;
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await ReelRepository.toggleLike(reel.id);

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Track successful like/unlike
      trackLikeEvent(isLiked ? 'unlike' : 'like', true);

      console.log(`Video ${isLiked ? 'unliked' : 'liked'} successfully`);
    } catch (error) {
      console.error('Error toggling like:', error);

      // Revert optimistic update on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);

      // Track failed like/unlike
      trackLikeEvent(isLiked ? 'unlike' : 'like', false);
    } finally {
      setIsLiking(false);
    }
  };

  const trackLikeEvent = (action: string, success: boolean) => {
    if (!reel) return;

    // Push event to Google Tag Manager dataLayer
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'video_like',
        video_id: reel.id,
        video_slug: reel.slug,
        video_title: reel.title,
        video_category: reel.category || 'uncategorized',
        is_premium: reel.isPremium,
        like_action: action, // 'like', 'unlike', 'unauthenticated'
        like_success: success,
        user_authenticated: isAuthenticated,
        user_id: user?.id || null,
        page_url: window.location.href,
        timestamp: new Date().toISOString(),
      });

      console.log('GTM Event Tracked:', {
        event: 'video_like',
        video_id: reel.id,
        video_slug: reel.slug,
        like_action: action,
        like_success: success,
        user_authenticated: isAuthenticated,
      });
    } else {
      console.warn('Google Tag Manager dataLayer not found');
    }
  };

  // Initialize like state when reel loads
  useEffect(() => {
    if (reel) {
      setLikeCount(reel.likes);
      // TODO: Check if user has liked this video (API call)
      // For now, set to false
      setIsLiked(false);
    }
  }, [reel]);

  const relatedVideos = getRelatedVideos();

  return (
    <>
      {/* Inject Video structured data only if video exists */}
      {reel && !notFound && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateVideoStructuredData(reel)),
            }}
          />

          {/* Inject Paywalled Content structured data if premium */}
          {reel.isPremium && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(generatePaywalledContentStructuredData()),
              }}
            />
          )}
        </>
      )}

      <div className="video-page">
        {/* Video Player Section */}
        <div className="video-player-container">
          <div className="video-player">
            {loading ? (
              <div className="video-loading-player">
                <div className="spinner"></div>
                <p>{t('videos.loading')}</p>
              </div>
            ) : notFound ? (
              <div className="video-not-found-player">
                <div className="not-found-icon">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M23 7l-7 5 7 5V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    <line x1="6" y1="1" x2="6" y2="23" strokeWidth="2" />
                    <line x1="10" y1="1" x2="10" y2="23" strokeWidth="2" />
                  </svg>
                </div>
                <h2>{t('videos.notFoundTitle')}</h2>
                <p>{t('videos.notFoundDescription')}</p>
              </div>
            ) : reel ? (
              <>
                {reel.isPremium && (
                  <div className="premium-badge">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    {t('videos.premium')}
                  </div>
                )}

                <video
                  controls
                  poster={reel.thumbnail}
                  className="video-element"
                >
                  <source src={reel.videoUrl} type="video/mp4" />
                  {t('videos.videoNotSupported')}
                </video>
              </>
            ) : null}
          </div>

          {/* Video Info - Only show if video exists */}
          {!loading && !notFound && reel && (
            <div className="video-info">
            <h1 className="video-title">{reel.title}</h1>

            <div className="video-stats">
              <span className="stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
                {formatNumber(reel.views)} {t('videos.views')}
              </span>
              <span className="stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {formatNumber(reel.likes)} {t('videos.likes')}
              </span>
              <span className="stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                {formatNumber(reel.comments)} {t('videos.comments')}
              </span>
              <span className="stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                {formatDuration(reel.duration)}
              </span>
              <span className="stat upload-date">
                {formatUploadDate(reel.uploadedAt)}
              </span>
            </div>

            {/* Creator Info */}
            <div className="creator-info">
              <img
                src={reel.avatar}
                alt={reel.username}
                className="creator-avatar"
              />
              <div className="creator-details">
                <h3 className="creator-name">@{reel.username}</h3>
              </div>
              <button className="subscribe-btn">
                {t('videos.subscribe')}
              </button>
            </div>

            {/* Description */}
            <div className="video-description">
              <h3>{t('videos.description')}</h3>
              <p>{reel.description}</p>
            </div>

            {/* Category & Tags */}
            {(reel.category || (reel.tags && reel.tags.length > 0)) && (
              <div className="video-metadata">
                {reel.category && (
                  <div className="video-category">
                    <strong>{t('videos.category')}:</strong> {reel.category}
                  </div>
                )}
                {reel.tags && reel.tags.length > 0 && (
                  <div className="video-tags">
                    <strong>{t('videos.tags')}:</strong>
                    {reel.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          )}
        </div>

        {/* Action Buttons - Only show if video exists */}
        {!loading && !notFound && reel && (
          <div className="video-actions">
            <button
              className={`action-btn like-btn ${isLiked ? 'liked' : ''} ${isLiking ? 'liking' : ''}`}
              onClick={handleLike}
              disabled={isLiking}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {isLiked ? t('videos.liked') : t('videos.like')} ({formatNumber(likeCount)})
            </button>
            <button className="action-btn share-btn" onClick={handleShare}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
              </svg>
              {t('videos.share')}
            </button>
            <button className="action-btn report-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
              </svg>
              {t('videos.report')}
            </button>
          </div>
        )}

        {/* Related Videos Section */}
        {!loading && relatedVideos.length > 0 && (
          <div className="related-videos-section">
            <h2 className="related-videos-title">
              {notFound ? t('videos.tryTheseVideos') : t('videos.relatedVideos')}
            </h2>
            <div className="related-videos-grid">
              {relatedVideos.map((video) => (
                <a
                  key={video.slug}
                  href={`/${locale}/videos/${video.slug}`}
                  className="related-video-card"
                >
                  <div className="related-video-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                    {video.is_premium && (
                      <div className="related-premium-badge">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      </div>
                    )}
                    <div className="related-video-duration">
                      {Math.floor(video.duration / 60)}:
                      {(video.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div className="related-video-info">
                    <h3>{video.title}</h3>
                    <p className="related-video-username">@{video.username}</p>
                    <div className="related-video-stats">
                      <span>
                        {formatNumber(video.views)} {t('videos.views')}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Share Toast Notification */}
        {showShareToast && (
          <div className="share-toast">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
            {t('videos.linkCopied')}
          </div>
        )}

        {/* Login/Register Modal */}
        <AuthModal
          isOpen={showLoginDialog}
          onClose={() => setShowLoginDialog(false)}
          title={t('videos.loginToLike')}
          message={t('videos.loginToLikeDescription')}
          icon="heart"
          trigger="video_like_unauthenticated"
        />
      </div>
    </>
  );
}

export default VideoPage;
