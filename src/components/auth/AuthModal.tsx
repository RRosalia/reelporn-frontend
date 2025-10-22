'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  icon?: 'heart' | 'lock' | 'star' | 'user';
  trigger?: string; // For GTM tracking - what triggered the modal to open
}

function AuthModal({
  isOpen,
  onClose,
  title,
  message,
  icon = 'heart',
  trigger = 'unknown',
}: AuthModalProps) {
  const t = useTranslations();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  // Track when AuthModal opens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'auth_modal_shown',
        modal_trigger: trigger,
        modal_icon: icon,
        timestamp: new Date().toISOString(),
        page_path: window.location.pathname,
      });
    }
  }, [isOpen, trigger, icon]);

  if (!isOpen) return null;

  // Get current URL for redirect after login/register
  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      return encodeURIComponent(window.location.pathname);
    }
    return '';
  };

  const renderIcon = () => {
    switch (icon) {
      case 'heart':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case 'lock':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        );
      case 'star':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        );
      case 'user':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <div className="auth-modal-content">
          <div className="auth-modal-icon">{renderIcon()}</div>

          <h2>{title || t('authModal.defaultTitle')}</h2>
          <p>{message || t('authModal.defaultMessage')}</p>

          <div className="auth-modal-actions">
            <a
              href={`/${locale}/login?redirect=${getCurrentUrl()}`}
              className="auth-btn login-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              {t('authModal.login')}
            </a>

            <a
              href={`/${locale}/signup?redirect=${getCurrentUrl()}`}
              className="auth-btn register-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              {t('authModal.register')}
            </a>
          </div>

          <button className="auth-modal-skip" onClick={onClose}>
            {t('authModal.maybeLater')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
