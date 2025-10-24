import apiClient from '@/lib/api/apiClient';
import type {
  ProfileData,
  PasswordData,
  ProfileResponse,
  PasswordUpdateResponse,
  TwoFactorSetupResponse,
  TwoFactorConfirmData,
  TwoFactorDisableData
} from '@/types/Account';

/**
 * Account Repository - Handles all account-related API calls
 */
class AccountRepository {
  /**
   * Get user profile
   * @returns {Promise<ProfileResponse>} User profile data
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await apiClient.get<ProfileResponse>('/account/profile');
    return response.data;
  }

  /**
   * Update user profile
   * @param {ProfileData} profileData - { name, nickname }
   * @returns {Promise<ProfileResponse>} Updated user profile data
   */
  async updateProfile(profileData: ProfileData): Promise<ProfileResponse> {
    const response = await apiClient.put<ProfileResponse>('/account/profile', profileData);
    return response.data;
  }

  /**
   * Update user password
   * @param {PasswordData} passwordData - { current_password, password, password_confirmation }
   * @returns {Promise<PasswordUpdateResponse>} Response data
   */
  async updatePassword(passwordData: PasswordData): Promise<PasswordUpdateResponse> {
    const response = await apiClient.put<PasswordUpdateResponse>('/account/password', passwordData);
    return response.data;
  }

  /**
   * Setup two-factor authentication
   * @returns {Promise<TwoFactorSetupResponse>} QR code and secret
   */
  async setupTwoFactor(): Promise<TwoFactorSetupResponse> {
    const response = await apiClient.post<TwoFactorSetupResponse>('/account/two-factor/setup');
    return response.data;
  }

  /**
   * Confirm two-factor authentication setup
   * @param {TwoFactorConfirmData} data - { code }
   * @returns {Promise<{message: string}>} Confirmation response
   */
  async confirmTwoFactor(data: TwoFactorConfirmData): Promise<{message: string}> {
    const response = await apiClient.post<{message: string}>('/account/two-factor/confirm', data);
    return response.data;
  }

  /**
   * Disable two-factor authentication
   * @param {TwoFactorDisableData} data - { password }
   * @returns {Promise<{message: string}>} Disable response
   */
  async disableTwoFactor(data: TwoFactorDisableData): Promise<{message: string}> {
    const response = await apiClient.post<{message: string}>('/account/two-factor/disable', data);
    return response.data;
  }
}

const accountRepository = new AccountRepository();
export default accountRepository;
