import apiClient from '../api/apiClient';

export interface TwoFactorQRResponse {
  svg: string;
}

export interface TwoFactorSecretResponse {
  secretKey: string;
}

export interface TwoFactorConfirmRequest {
  code: string;
}

class TwoFactorRepository {
  /**
   * Enable 2FA for the authenticated user
   */
  async enable(): Promise<void> {
    await apiClient.post('/account/two-factor-authentication');
  }

  /**
   * Get the QR code SVG for 2FA setup
   */
  async getQRCode(): Promise<TwoFactorQRResponse> {
    const response = await apiClient.get<TwoFactorQRResponse>('/account/two-factor-qr-code');
    return response.data;
  }

  /**
   * Get the secret key for 2FA setup
   */
  async getSecretKey(): Promise<TwoFactorSecretResponse> {
    const response = await apiClient.get<TwoFactorSecretResponse>('/account/two-factor-secret-key');
    return response.data;
  }

  /**
   * Confirm 2FA with a verification code
   */
  async confirm(data: TwoFactorConfirmRequest): Promise<void> {
    await apiClient.post('/account/confirmed-two-factor-authentication', data);
  }

  /**
   * Get recovery codes
   */
  async getRecoveryCodes(): Promise<string[]> {
    const response = await apiClient.get<string[]>('/account/two-factor-recovery-codes');
    return response.data;
  }

  /**
   * Regenerate recovery codes
   */
  async regenerateRecoveryCodes(): Promise<void> {
    await apiClient.post('/account/two-factor-recovery-codes');
  }

  /**
   * Disable 2FA
   */
  async disable(): Promise<void> {
    await apiClient.delete('/account/two-factor-authentication');
  }
}

export default new TwoFactorRepository();
