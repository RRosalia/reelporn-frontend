import AccountRepository from '@/lib/repositories/AccountRepository';
import AuthService from './AuthService';
import type {
  ProfileData,
  ProfileResponse,
  PasswordUpdateResponse
} from '@/types/Account';
import type { User } from '@/types/User';

/**
 * Account Service - Handles account management business logic
 */
class AccountService {
  /**
   * Get current user's profile
   * @returns {Promise<User>} User profile data
   */
  async getProfile(): Promise<User> {
    const response = await AccountRepository.getProfile();

    // Update stored user data if present
    const user = response.user || response.data?.user;
    if (user) {
      AuthService.setUser(user);
      return user;
    }

    throw new Error('Failed to get user profile');
  }

  /**
   * Update user profile
   * @param {ProfileData} profileData - { name, nickname }
   * @returns {Promise<User>} Updated user profile data
   */
  async updateProfile(profileData: ProfileData): Promise<User> {
    const response = await AccountRepository.updateProfile(profileData);

    // Update stored user data
    const user = response.user || response.data?.user;
    if (user) {
      AuthService.setUser(user);
      return user;
    }

    throw new Error('Failed to update user profile');
  }

  /**
   * Update user password
   * @param {string} currentPassword
   * @param {string} newPassword
   * @param {string} passwordConfirmation
   * @returns {Promise<PasswordUpdateResponse>} Response data
   */
  async updatePassword(
    currentPassword: string,
    newPassword: string,
    passwordConfirmation: string
  ): Promise<PasswordUpdateResponse> {
    return await AccountRepository.updatePassword({
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: passwordConfirmation,
    });
  }
}

const accountService = new AccountService();
export default accountService;
