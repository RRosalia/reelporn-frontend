import apiClient from '@/lib/api/apiClient';

interface LoginResponse {
  token?: string;
  user?: any;
  data?: any;
}

interface RegisterData {
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

interface RegisterUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface RegisterPaymentCrypto {
  currency: string;
  amount: string;
  payment_address: string;
  exchange_rate_cents: number;
  exchange_rate_usd: number;
  required_confirmations: number;
}

interface RegisterPayment {
  payment_id: string;
  status: string;
  amount_cents: number;
  amount_usd: number;
  payment_method: string;
  expires_at: string;
  crypto?: RegisterPaymentCrypto;
}

interface RegisterResponse {
  data: {
    user: RegisterUser;
    token: string;
    requires_payment: boolean;
    payment?: RegisterPayment;
  };
}

interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
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
    const response = await apiClient.post('/login', {
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
    const response = await apiClient.post('/register', userData);
    return response.data;
  }

  /**
   * Logout user
   * @returns {Promise<any>} Response data
   */
  async logout(): Promise<any> {
    const response = await apiClient.post('/logout');
    return response.data;
  }

  /**
   * Get current authenticated user
   * @returns {Promise<any>} User data
   */
  async getCurrentUser(): Promise<any> {
    const response = await apiClient.get('/user');
    return response.data;
  }

  /**
   * Refresh authentication token
   * @returns {Promise<any>} Response data containing new token
   */
  async refreshToken(): Promise<any> {
    const response = await apiClient.post('/refresh');
    return response.data;
  }

  /**
   * Request password reset
   * @param {string} email
   * @returns {Promise<any>} Response data
   */
  async forgotPassword(email: string): Promise<any> {
    const response = await apiClient.post('/forgot-password', { email });
    return response.data;
  }

  /**
   * Reset password with token
   * @param {ResetPasswordData} data - Contains token, email, password, password_confirmation
   * @returns {Promise<any>} Response data
   */
  async resetPassword(data: ResetPasswordData): Promise<any> {
    const response = await apiClient.post('/reset-password', data);
    return response.data;
  }
}

export default new AuthRepository();

// Export types for use in components
export type {
  LoginResponse,
  RegisterData,
  RegisterUser,
  RegisterPayment,
  RegisterPaymentCrypto,
  RegisterResponse,
  ResetPasswordData,
};
