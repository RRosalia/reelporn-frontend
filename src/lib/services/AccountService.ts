import AccountRepository from '@/lib/repositories/AccountRepository';
import AuthService from './AuthService';

interface ProfileData {
  name?: string;
  nickname?: string;
  [key: string]: any;
}

/**
 * Account Service - Handles account management business logic
 */
class AccountService {
  /**
   * Get current user's profile
   * @returns {Promise<any>} User profile data
   */
  async getProfile(): Promise<any> {
    const response = await AccountRepository.getProfile();

    // Update stored user data if present
    if (response.data) {
      AuthService.setUser(response.data);
    }

    return response.data;
  }

  /**
   * Update user profile
   * @param {ProfileData} profileData - { name, nickname }
   * @returns {Promise<any>} Updated user profile data
   */
  async updateProfile(profileData: ProfileData): Promise<any> {
    const response = await AccountRepository.updateProfile(profileData);

    // Update stored user data
    if (response.data) {
      AuthService.setUser(response.data);
    }

    return response.data;
  }

  /**
   * Update user password
   * @param {string} currentPassword
   * @param {string} newPassword
   * @param {string} passwordConfirmation
   * @returns {Promise<any>} Response data
   */
  async updatePassword(
    currentPassword: string,
    newPassword: string,
    passwordConfirmation: string
  ): Promise<any> {
    return await AccountRepository.updatePassword({
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: passwordConfirmation,
    });
  }
}

export default new AccountService();
