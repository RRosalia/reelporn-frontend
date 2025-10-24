import apiClient from '@/lib/api/apiClient';
import type {
  LoginResponse,
  RegisterData,
  ResetPasswordData,
  User,
  CurrentUserResponse,
  RefreshTokenResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse
} from '@/types/User';

/**
 * Register response structure
 */
interface RegisterResponse {
  data: {
    user: User;
    token: string;
    requires_payment: boolean;
    payment?: {
      payment_id: string;
      status: string;
      amount_cents: number;
      amount_usd: number;
      payment_method: string;
      expires_at: string;
      crypto?: {
        currency: string;
        amount: string;
        payment_address: string;
        exchange_rate_cents: number;
        exchange_rate_usd: number;
        required_confirmations: number;
      };
    };
  };
}

/**
 * Logout response structure
 */
interface LogoutResponse {
  message: string;
}

/**
 * Auth Repository - Handles all authentication-related API calls
 */
class AuthRepository {
  /**
   * Login user with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<LoginResponse>} Response data containing token
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/login', {
      email,
      password,
    });
    return response.data;
  }

  /**
   * Register new user with optional plan and payment details
   * @param {RegisterData} userData - User registration data including optional payment info
   * @returns {Promise<RegisterResponse>} Response data containing user, token, and optional payment details
   */
  async register(userData: RegisterData): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/register', userData);
    return response.data;
  }

  /**
   * Logout user
   * @returns {Promise<LogoutResponse>} Response data
   */
  async logout(): Promise<LogoutResponse> {
    const response = await apiClient.post<LogoutResponse>('/logout');
    return response.data;
  }

  /**
   * Get current authenticated user
   * @returns {Promise<CurrentUserResponse>} User data
   */
  async getCurrentUser(): Promise<CurrentUserResponse> {
    const response = await apiClient.get<CurrentUserResponse>('/user');
    return response.data;
  }

  /**
   * Refresh authentication token
   * @returns {Promise<RefreshTokenResponse>} Response data containing new token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>('/refresh');
    return response.data;
  }

  /**
   * Request password reset
   * @param {string} email
   * @returns {Promise<ForgotPasswordResponse>} Response data
   */
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const response = await apiClient.post<ForgotPasswordResponse>('/forgot-password', { email });
    return response.data;
  }

  /**
   * Reset password with token
   * @param {ResetPasswordData} data - Contains token, email, password, password_confirmation
   * @returns {Promise<ResetPasswordResponse>} Response data
   */
  async resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<ResetPasswordResponse>('/reset-password', data);
    return response.data;
  }
}

const authRepository = new AuthRepository();
export default authRepository;

// Export types for use in components
export type {
  RegisterResponse,
  LogoutResponse,
};
