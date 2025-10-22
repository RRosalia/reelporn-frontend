/**
 * User and Authentication Types
 */

/**
 * User model from the backend
 */
export interface User {
  id: number;
  email: string;
  name?: string;
  email_verified_at?: string | null;
  two_factor_enabled?: boolean;
  two_factor_confirmed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Login response from the API
 */
export interface LoginResponse {
  token?: string;
  user?: User;
  data?: {
    token?: string;
    user?: User;
  };
}

/**
 * User registration data
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  plan_id?: number;
  payment_method?: string;
  payment_options?: {
    currency?: string;
  };
}

/**
 * Password reset data
 */
export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * Forgot password request data
 */
export interface ForgotPasswordData {
  email: string;
}

/**
 * API response for forgot password
 */
export interface ForgotPasswordResponse {
  message: string;
}

/**
 * API response for reset password
 */
export interface ResetPasswordResponse {
  message: string;
}

/**
 * Current user response from /user endpoint
 */
export interface CurrentUserResponse {
  user?: User;
  data?: {
    user?: User;
  };
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  token: string;
  data?: {
    token: string;
  };
}
