import AuthRepository from '@/lib/repositories/AuthRepository';

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
  [key: string]: any;
}

interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

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
   * @returns {Promise<any>} Registration response data
   */
  async register(userData: RegisterData): Promise<any> {
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

    return data;
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
   * @returns {Promise<any>} User data
   */
  async getCurrentUser(): Promise<any> {
    const response = await AuthRepository.getCurrentUser();

    // Handle nested data structure
    const data = response.data || response;
    const user = data.user || data;

    // Update stored user data
    if (user) {
      this.setUser(user);
    }

    return user;
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
   * @param {any} user
   */
  setUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Get stored user data
   * @returns {any|null}
   */
  getUser(): any | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
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
   * @returns {Promise<any>}
   */
  async forgotPassword(email: string): Promise<any> {
    return await AuthRepository.forgotPassword(email);
  }

  /**
   * Reset password with token
   * @param {ResetPasswordData} data
   * @returns {Promise<any>}
   */
  async resetPassword(data: ResetPasswordData): Promise<any> {
    return await AuthRepository.resetPassword(data);
  }
}

export default new AuthService();
