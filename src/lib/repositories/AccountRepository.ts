import apiClient from '@/lib/api/apiClient';

interface ProfileData {
  name?: string;
  nickname?: string;
  [key: string]: any;
}

interface PasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

/**
 * Account Repository - Handles all account-related API calls
 */
class AccountRepository {
  /**
   * Get user profile
   * @returns {Promise<any>} User profile data
   */
  async getProfile(): Promise<any> {
    const response = await apiClient.get('/account/profile');
    return response.data;
  }

  /**
   * Update user profile
   * @param {ProfileData} profileData - { name, nickname }
   * @returns {Promise<any>} Updated user profile data
   */
  async updateProfile(profileData: ProfileData): Promise<any> {
    const response = await apiClient.put('/account/profile', profileData);
    return response.data;
  }

  /**
   * Update user password
   * @param {PasswordData} passwordData - { current_password, password, password_confirmation }
   * @returns {Promise<any>} Response data
   */
  async updatePassword(passwordData: PasswordData): Promise<any> {
    const response = await apiClient.put('/account/password', passwordData);
    return response.data;
  }
}

const accountRepository = new AccountRepository();
export default accountRepository;
