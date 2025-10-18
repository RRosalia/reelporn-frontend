import TwoFactorRepository, { TwoFactorConfirmRequest } from '../repositories/TwoFactorRepository';

class TwoFactorService {
  /**
   * Enable 2FA for the current user
   * @returns Promise that resolves when 2FA is enabled
   */
  async enableTwoFactor(): Promise<void> {
    return await TwoFactorRepository.enable();
  }

  /**
   * Get the QR code SVG for scanning with authenticator app
   * @returns Promise with QR code SVG string
   */
  async getQRCode(): Promise<string> {
    const response = await TwoFactorRepository.getQRCode();
    return response.svg;
  }

  /**
   * Get the secret key for manual entry in authenticator app
   * @returns Promise with secret key string
   */
  async getSecretKey(): Promise<string> {
    const response = await TwoFactorRepository.getSecretKey();
    return response.secretKey;
  }

  /**
   * Confirm 2FA setup with verification code from authenticator app
   * @param code - 6-digit verification code
   * @returns Promise that resolves when 2FA is confirmed
   */
  async confirmTwoFactor(code: string): Promise<void> {
    const data: TwoFactorConfirmRequest = { code };
    return await TwoFactorRepository.confirm(data);
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
    await TwoFactorRepository.regenerateRecoveryCodes();
    // Fetch the new codes after regeneration
    return await TwoFactorRepository.getRecoveryCodes();
  }

  /**
   * Disable 2FA for the current user
   * @returns Promise that resolves when 2FA is disabled
   */
  async disableTwoFactor(): Promise<void> {
    return await TwoFactorRepository.disable();
  }
}

export default new TwoFactorService();
