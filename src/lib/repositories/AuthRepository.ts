import apiClient from '@/lib/api/apiClient';

interface LoginResponse {
  token?: string;
  user?: any;
  data?: any;
}

interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  name?: string;
  [key: string]: any;
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
   * Register new user
   * @param {RegisterData} userData
   * @returns {Promise<any>} Response data
   */
  async register(userData: RegisterData): Promise<any> {
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
