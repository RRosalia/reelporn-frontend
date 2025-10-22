import type { User } from './User';

/**
 * Account and Profile Type Definitions
 */

/**
 * Profile data for updates (partial user data)
 */
export interface ProfileData {
  name?: string;
  nickname?: string;
  email?: string;
}

/**
 * Password update data
 */
export interface PasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

/**
 * Profile response from API
 */
export interface ProfileResponse {
  user: User;
  data?: {
    user: User;
  };
}

/**
 * Password update response
 */
export interface PasswordUpdateResponse {
  message: string;
}

/**
 * Two-factor authentication setup data
 */
export interface TwoFactorSetupResponse {
  qr_code: string; // Base64 encoded QR code image
  secret: string; // Secret key for manual entry
}

/**
 * Two-factor authentication confirmation data
 */
export interface TwoFactorConfirmData {
  code: string; // 6-digit code from authenticator app
}

/**
 * Two-factor authentication disable data
 */
export interface TwoFactorDisableData {
  password: string;
}
