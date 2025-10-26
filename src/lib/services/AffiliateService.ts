import AffiliateRepository from '@/lib/repositories/AffiliateRepository';
import type { AffiliateLeadData, AffiliateLeadResponse } from '@/types/Affiliate';

/**
 * Affiliate Service - Handles affiliate tracking business logic
 */
class AffiliateService {
  private COOKIE_NAME = 'affiliate_click_id';

  /**
   * Track affiliate click from URL parameters
   * Stores cookie with backend-controlled expiration and sends API call to backend
   * If click_id already exists, sends it along with the new click
   * @param {string} ref - Affiliate reference ID
   * @param {string} [sub1] - Optional sub ID 1
   * @param {string} [sub2] - Optional sub ID 2
   * @param {string} [sub3] - Optional sub ID 3
   * @returns {Promise<AffiliateLeadResponse>} Response data
   */
  async trackClick(
    ref: string,
    sub1?: string,
    sub2?: string,
    sub3?: string
  ): Promise<AffiliateLeadResponse> {
    try {
      // Check if already tracked (cookie with click_id exists)
      const existingClickId = this.getCookie();

      // Prepare data for API call
      const data: AffiliateLeadData = {
        ref,
        ...(existingClickId && { click_id: existingClickId }),
        ...(sub1 && { sub1 }),
        ...(sub2 && { sub2 }),
        ...(sub3 && { sub3 }),
      };

      if (existingClickId) {
        console.log('Sending affiliate click with existing click_id:', existingClickId);
      }

      // Send API call to backend
      const response = await AffiliateRepository.registerClick(data);

      // Extract click_id and expiration_date from response
      const clickId = response.data.click_id;
      const expirationDate = response.data.expiration_date;

      // Store cookie with backend-controlled expiration (only stores click_id)
      this.setCookie(clickId, expirationDate);

      return response;
    } catch (error) {
      console.error('Failed to track affiliate click:', error);
      // Don't store cookie if API fails (we need the click_id)
      throw error;
    }
  }

  /**
   * Set affiliate cookie with backend-controlled expiration
   * @param {string} clickId - Unique click ID from backend
   * @param {string} expirationDate - ISO 8601 timestamp for cookie expiration from backend
   */
  private setCookie(clickId: string, expirationDate: string): void {
    if (typeof document === 'undefined') return;

    // Use backend-provided expiration date
    const expires = new Date(expirationDate);

    // Store only the click_id as a plain string
    document.cookie = `${this.COOKIE_NAME}=${encodeURIComponent(clickId)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }

  /**
   * Get affiliate click_id from cookie
   * @returns {string | null} Click ID or null if not found
   */
  getCookie(): string | null {
    if (typeof document === 'undefined') return null;

    const name = this.COOKIE_NAME + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        const cookieValue = cookie.substring(name.length);
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  /**
   * Remove affiliate cookie
   */
  removeCookie(): void {
    if (typeof document === 'undefined') return;

    document.cookie = `${this.COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

const affiliateService = new AffiliateService();
export default affiliateService;
