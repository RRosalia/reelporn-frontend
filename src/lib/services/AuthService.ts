import AuthRepository, { RegisterResponse } from '@/lib/repositories/AuthRepository';
import AffiliateService from '@/lib/services/AffiliateService';
import type {
  LoginResponse,
  RegisterData,
  ResetPasswordData,
  User,
  ForgotPasswordResponse,
  ResetPasswordResponse
} from '@/types/User';

/**
 * Auth Service - Handles authentication business logic
 */
class AuthService {
  private TOKEN_KEY = 'auth_token';
  private USER_KEY = 'auth_user';

  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<LoginResponse>} Login response data
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Call repository to login
    const response = await AuthRepository.login(email, password);

    // Handle nested data structure ($.data.token)
    const data = response.data || response;

    // Store token if present in response
    const token = data.token || response.token;
    if (token) {
      this.setToken(token);
    }

    // Store user data if present
    const user = data.user || response.user;
    if (user) {
      this.setUser(user);
    }

    return data;
  }

  /**
   * Register new user
   * @param {RegisterData} userData
   * @returns {Promise<RegisterResponse>} Registration response data
   */
  async register(userData: RegisterData): Promise<RegisterResponse> {
    // Get affiliate click_id from cookie if it exists and send it for commission tracking
    const clickId = AffiliateService.getCookie();

    if (clickId) {
      userData.click_id = clickId;
    }

    // Call repository to register
    const response = await AuthRepository.register(userData);

    // Handle nested data structure ($.data.token)
    const data = response.data;

    // Store token if present in response
    const token = data.token;
    if (token) {
      this.setToken(token);
    }

    // Store user data if present
    const user = data.user;
    if (user) {
      this.setUser(user);
    }

    return { data };
  }

  /**
   * Logout user
   * @param {boolean} redirect - Whether to redirect to login page with success message
   * @returns {Promise<void>}
   */
  async logout(redirect: boolean = true): Promise<void> {
    try {
      // Call API to logout (will invalidate token on server)
      await AuthRepository.logout();
    } catch (error) {
      // Even if API call fails, we still want to clear local data
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage
      this.clearAuth();

      // Redirect to login page with success message if requested
      if (redirect && typeof window !== 'undefined') {
        window.location.href = '/login?message=logoutSuccess';
      }
    }
  }

  /**
   * Get current authenticated user from API
   * @returns {Promise<User | null>} User data
   */
  async getCurrentUser(): Promise<User | null> {
    const response = await AuthRepository.getCurrentUser();

    // Handle nested data structure
    const user = response.user || (response.data?.user);

    // Update stored user data
    if (user) {
      this.setUser(user);
    }

    return user || null;
  }

  /**
   * Store authentication token
   * @param {string} token
   */
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Get authentication token
   * @returns {string|null}
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Remove authentication token
   */
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /**
   * Store user data
   * @param {User} user
   */
  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Get stored user data
   * @returns {User | null}
   */
  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) as User : null;
    }
    return null;
  }

  /**
   * Remove user data
   */
  removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  /**
   * Check if user is authenticated (has valid token)
   * @returns {boolean}
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Clear all authentication data
   */
  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  }

  /**
   * Request password reset
   * @param {string} email
   * @returns {Promise<ForgotPasswordResponse>}
   */
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return await AuthRepository.forgotPassword(email);
  }

  /**
   * Reset password with token
   * @param {ResetPasswordData} data
   * @returns {Promise<ResetPasswordResponse>}
   */
  async resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {
    return await AuthRepository.resetPassword(data);
  }
}

const authService = new AuthService();
export default authService;
