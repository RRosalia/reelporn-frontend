'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/contexts/AuthContext';
import AuthService from '@/lib/services/AuthService';
import type { RegisterData } from '@/types/User';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  icon?: 'heart' | 'lock' | 'star' | 'user';
  trigger?: string; // For GTM tracking - what triggered the modal to open
  mode?: 'signup' | 'login'; // Initial mode
  imageUrl?: string; // Left panel image
}

function AuthModal({
  isOpen,
  onClose,
  title,
  message,
  icon = 'heart',
  trigger = 'unknown',
  mode: initialMode = 'signup',
  imageUrl = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
}: AuthModalProps) {
  const t = useTranslations('authModal');
  const router = useRouter();
  const { login, refreshAuth } = useAuth();

  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Track when AuthModal opens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'auth_modal_shown',
        modal_trigger: trigger,
        modal_icon: icon,
        modal_mode: mode,
        timestamp: new Date().toISOString(),
        page_path: window.location.pathname,
      });
    }
  }, [isOpen, trigger, icon, mode]);

  // Reset form when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
      setError(null);
      setValidationErrors({});
      setShowPassword(false);
      setShowPasswordConfirmation(false);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = t('emailRequired');
    }

    if (!password) {
      errors.password = t('passwordRequired');
    } else if (password.length < 6) {
      errors.password = t('passwordTooShort');
    }

    if (mode === 'signup') {
      if (!name) {
        errors.name = 'Name is required';
      }

      if (!passwordConfirmation) {
        errors.passwordConfirmation = 'Password confirmation is required';
      } else if (password !== passwordConfirmation) {
        errors.passwordConfirmation = t('passwordsDoNotMatch');
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        // Login
        await login(email, password);

        // Track successful login
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'auth_login_success',
            method: 'email',
            trigger: trigger,
            timestamp: new Date().toISOString(),
          });
        }

        // Close modal on success
        onClose();
      } else {
        // Sign up
        const registerData: RegisterData = {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        };

        const response = await AuthService.register(registerData);

        // Update AuthContext with new user data (user is now logged in)
        refreshAuth();

        // Track successful registration
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'auth_signup_success',
            method: 'email',
            trigger: trigger,
            timestamp: new Date().toISOString(),
          });
        }

        // Redirect based on payment requirement
        const requiresPayment = response.data?.requires_payment ?? false;
        if (requiresPayment) {
          // User needs to complete payment - redirect to payment page
          const paymentId = response.data?.payment?.payment_id;
          router.push(paymentId ? `/payment/${paymentId}` : '/payment');
        } else {
          // User signed up successfully without payment - redirect to welcome page
          router.push('/welcome');
        }
      }
    } catch (err: unknown) {
      console.error(`${mode === 'login' ? 'Login' : 'Registration'} error:`, err);

      // Handle validation errors from backend
      if (err && typeof err === 'object' && 'response' in err) {
        const errorResponse = err as { response?: { data?: { errors?: any; message?: string } } };

        if (errorResponse.response?.data?.errors) {
          const backendErrors: Record<string, string> = {};
          Object.entries(errorResponse.response.data.errors).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              backendErrors[key] = value[0];
            }
          });
          setValidationErrors(backendErrors);
        }

        const message =
          errorResponse.response?.data?.message ||
          (mode === 'login' ? t('invalidCredentials') : t('registrationFailed'));
        setError(message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(mode === 'login' ? t('invalidCredentials') : t('registrationFailed'));
      }

      // Track failed auth
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: `auth_${mode}_failed`,
          method: 'email',
          error: error,
          trigger: trigger,
          timestamp: new Date().toISOString(),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'discord' | 'x') => {
    // Placeholder for future social login implementation
    console.log(`Social login with ${provider} - coming soon!`);

    // Track social login attempt
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'auth_social_clicked',
        provider: provider,
        mode: mode,
        trigger: trigger,
        timestamp: new Date().toISOString(),
      });
    }

    // TODO: Implement social login when backend is ready
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`);
  };

  const toggleMode = () => {
    setMode(mode === 'signup' ? 'login' : 'signup');
    setError(null);
    setValidationErrors({});
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Left Panel - Image */}
        <div className="auth-modal-left" style={{ backgroundImage: `url(${imageUrl})` }}>
          <div className="auth-modal-image-overlay">
            <div className="auth-modal-logo">reelporn</div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="auth-modal-right">
          <div className="auth-modal-form-container">
            <h2 className="auth-modal-title">
              {mode === 'signup' ? t('createAccount') : t('signIn')}
            </h2>

            {/* Error Message */}
            {error && (
              <div className="auth-modal-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-modal-form">
              {/* Name Input (Signup only) */}
              {mode === 'signup' && (
                <div className="auth-modal-input-group">
                  <div className={`auth-modal-input-wrapper ${validationErrors.name ? 'error' : ''}`}>
                    <svg className="auth-modal-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('namePlaceholder')}
                      disabled={isSubmitting}
                      className="auth-modal-input"
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="auth-modal-input-error">{validationErrors.name}</p>
                  )}
                </div>
              )}

              {/* Email Input */}
              <div className="auth-modal-input-group">
                <div className={`auth-modal-input-wrapper ${validationErrors.email ? 'error' : ''}`}>
                  <svg className="auth-modal-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    disabled={isSubmitting}
                    className="auth-modal-input"
                  />
                </div>
                {validationErrors.email && (
                  <p className="auth-modal-input-error">{validationErrors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="auth-modal-input-group">
                <div className={`auth-modal-input-wrapper ${validationErrors.password ? 'error' : ''}`}>
                  <svg className="auth-modal-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('passwordPlaceholder')}
                    disabled={isSubmitting}
                    className="auth-modal-input"
                  />
                  <button
                    type="button"
                    className="auth-modal-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="auth-modal-input-error">{validationErrors.password}</p>
                )}
                {mode === 'signup' && !validationErrors.password && (
                  <p className="auth-modal-input-hint">{t('minimumCharacters')}</p>
                )}
              </div>

              {/* Password Confirmation (Signup only) */}
              {mode === 'signup' && (
                <div className="auth-modal-input-group">
                  <div className={`auth-modal-input-wrapper ${validationErrors.passwordConfirmation ? 'error' : ''}`}>
                    <svg className="auth-modal-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                    <input
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      placeholder={t('confirmPasswordPlaceholder')}
                      disabled={isSubmitting}
                      className="auth-modal-input"
                    />
                    <button
                      type="button"
                      className="auth-modal-password-toggle"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      aria-label={showPasswordConfirmation ? t('hidePassword') : t('showPassword')}
                    >
                      {showPasswordConfirmation ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {validationErrors.passwordConfirmation && (
                    <p className="auth-modal-input-error">{validationErrors.passwordConfirmation}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="auth-modal-submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? mode === 'signup'
                    ? t('creatingAccount')
                    : t('loggingIn')
                  : mode === 'signup'
                  ? t('createFreeAccount')
                  : t('signIn')}
              </button>

              {/* Divider */}
              <div className="auth-modal-divider">
                <span>{t('orContinueWith')}</span>
              </div>

              {/* Social Login Buttons */}
              <div className="auth-modal-social">
                <button
                  type="button"
                  className="auth-modal-social-btn google"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isSubmitting}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t('continueWithGoogle')}
                </button>

                <div className="auth-modal-social-row">
                  <button
                    type="button"
                    className="auth-modal-social-btn discord"
                    onClick={() => handleSocialLogin('discord')}
                    disabled={isSubmitting}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    {t('continueWithDiscord')}
                  </button>

                  <button
                    type="button"
                    className="auth-modal-social-btn x"
                    onClick={() => handleSocialLogin('x')}
                    disabled={isSubmitting}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    {t('continueWithX')}
                  </button>
                </div>
              </div>

              {/* Terms of Service (Signup only) */}
              {mode === 'signup' && (
                <p className="auth-modal-terms">
                  {t('agreeToTerms')}{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer">
                    {t('termsOfService')}
                  </a>
                </p>
              )}
            </form>

            {/* Toggle Mode */}
            <div className="auth-modal-toggle">
              {mode === 'signup' ? (
                <>
                  {t('alreadyHaveAccount')}{' '}
                  <button type="button" onClick={toggleMode}>
                    {t('signInLink')}
                  </button>
                </>
              ) : (
                <>
                  {t('dontHaveAccount')}{' '}
                  <button type="button" onClick={toggleMode}>
                    {t('signUpLink')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
