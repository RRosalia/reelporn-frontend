import TwoFactorRepository, { TwoFactorConfirmRequest } from '../repositories/TwoFactorRepository';

interface TwoFactorSetupData {
  qrCode: string;
  secret: string;
}

class TwoFactorService {
  /**
   * Enable 2FA for the current user
   * @returns Promise with QR code and secret key
   */
  async enableTwoFactor(): Promise<TwoFactorSetupData> {
    const response = await TwoFactorRepository.enable();
    return {
      qrCode: response.data.svg,
      secret: response.data.secret,
    };
  }

  /**
   * Get the QR code SVG for scanning with authenticator app (re-fetch)
   * @returns Promise with QR code SVG string
   */
  async getQRCode(): Promise<string> {
    const response = await TwoFactorRepository.getQRCode();
    return response.data.svg;
  }

  /**
   * Confirm 2FA setup with verification code from authenticator app
   * @param code - 6-digit verification code
   * @returns Promise with array of recovery codes
   */
  async confirmTwoFactor(code: string): Promise<string[]> {
    const data: TwoFactorConfirmRequest = { code };
    const response = await TwoFactorRepository.confirm(data);
    return response.data.recovery_codes;
  }

  /**
   * Get recovery codes for account recovery
   * @returns Promise with array of recovery codes
   */
  async getRecoveryCodes(): Promise<string[]> {
    return await TwoFactorRepository.getRecoveryCodes();
  }

  /**
   * Regenerate new set of recovery codes (invalidates old ones)
   * @returns Promise with new array of recovery codes
   */
  async regenerateRecoveryCodes(): Promise<string[]> {
    // The regenerate endpoint now returns the new codes directly
    return await TwoFactorRepository.regenerateRecoveryCodes();
  }

  /**
   * Disable 2FA for the current user
   * @param code - 6-digit verification code from authenticator app
   * @returns Promise that resolves when 2FA is disabled
   */
  async disableTwoFactor(code: string): Promise<void> {
    return await TwoFactorRepository.disable({ code });
  }
}

const twoFactorService = new TwoFactorService();
export default twoFactorService;
