'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import './not-found.css';

export default function VideoNotFound() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="video-not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">
          <svg
            width="120"
            height="120"
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

        <h1 className="not-found-title">{t('videos.notFoundTitle')}</h1>
        <p className="not-found-description">{t('videos.notFoundDescription')}</p>

        <div className="not-found-actions">
          <button onClick={() => router.back()} className="btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            {t('videos.goBack')}
          </button>

          <button onClick={() => router.push('/')} className="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            {t('videos.goHome')}
          </button>
        </div>

        <div className="not-found-suggestions">
          <p className="suggestions-title">{t('videos.suggestions')}</p>
          <ul>
            <li>{t('videos.suggestionCheckUrl')}</li>
            <li>{t('videos.suggestionVideoDeleted')}</li>
            <li>{t('videos.suggestionBrowseCategories')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
