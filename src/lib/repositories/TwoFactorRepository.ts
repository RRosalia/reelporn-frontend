import apiClient from '../api/apiClient';

export interface TwoFactorEnableResponse {
  message: string;
  data: {
    svg: string;
    secret: string;
  };
}

export interface TwoFactorQRResponse {
  data: {
    svg: string;
  };
}

export interface TwoFactorConfirmRequest {
  code: string;
}

export interface TwoFactorConfirmResponse {
  message: string;
  data: {
    recovery_codes: string[];
  };
}

export interface TwoFactorDisableRequest {
  code: string;
}

export interface RecoveryCodesResponse {
  data: {
    recovery_codes: string[];
  };
}

class TwoFactorRepository {
  /**
   * Enable 2FA for the authenticated user
   * Returns QR code SVG and secret key
   */
  async enable(): Promise<TwoFactorEnableResponse> {
    const response = await apiClient.post<TwoFactorEnableResponse>('/account/two-factor-authentication');
    return response.data;
  }

  /**
   * Get the QR code SVG for 2FA setup (re-fetch)
   */
  async getQRCode(): Promise<TwoFactorQRResponse> {
    const response = await apiClient.get<TwoFactorQRResponse>('/account/two-factor-qr-code');
    return response.data;
  }

  /**
   * Confirm 2FA with a verification code
   * Returns recovery codes
   */
  async confirm(data: TwoFactorConfirmRequest): Promise<TwoFactorConfirmResponse> {
    const response = await apiClient.post<TwoFactorConfirmResponse>('/account/confirmed-two-factor-authentication', data);
    return response.data;
  }

  /**
   * Get recovery codes
   */
  async getRecoveryCodes(): Promise<string[]> {
    const response = await apiClient.get<RecoveryCodesResponse>('/account/two-factor-recovery-codes');
    return response.data.data.recovery_codes;
  }

  /**
   * Regenerate recovery codes
   */
  async regenerateRecoveryCodes(): Promise<string[]> {
    const response = await apiClient.post<RecoveryCodesResponse>('/account/two-factor-recovery-codes');
    return response.data.data.recovery_codes;
  }

  /**
   * Disable 2FA (requires verification code)
   */
  async disable(data: TwoFactorDisableRequest): Promise<void> {
    await apiClient.delete('/account/two-factor-authentication', { data });
  }
}

export default new TwoFactorRepository();
