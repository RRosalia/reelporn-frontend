import AffiliateRepository from '@/lib/repositories/AffiliateRepository';
import type { AffiliateLeadData, AffiliateLeadResponse } from '@/types/Affiliate';

/**
 * Affiliate Service - Handles affiliate tracking business logic
 */
class AffiliateService {
  private COOKIE_NAME = 'affiliate_ref';
  private COOKIE_EXPIRY_DAYS = 60;

  /**
   * Track affiliate click from URL parameters
   * Stores cookie for 60 days and sends API call to backend ONLY on first detection (when no click_id exists)
   * @param {string} ref - Affiliate reference ID
   * @param {string} [sub1] - Optional sub ID 1
   * @param {string} [sub2] - Optional sub ID 2
   * @param {string} [sub3] - Optional sub ID 3
   * @returns {Promise<AffiliateLeadResponse | null>} Response data or null if already tracked
   */
  async trackClick(
    ref: string,
    sub1?: string,
    sub2?: string,
    sub3?: string
  ): Promise<AffiliateLeadResponse | null> {
    // Check if already tracked (cookie with click_id exists)
    if (this.hasExistingClickId()) {
      console.log('Affiliate click_id already exists in cookie, skipping API call');
      return null;
    }

    try {
      // Prepare data for API call
      const data: AffiliateLeadData = {
        ref,
        ...(sub1 && { sub1 }),
        ...(sub2 && { sub2 }),
        ...(sub3 && { sub3 }),
      };

      // Send API call to backend (only happens once when click_id doesn't exist)
      const response = await AffiliateRepository.registerClick(data);

      // Extract click_id from response
      const clickId = response.data.id;

      // Store cookie for 60 days with click_id
      this.setCookie(ref, clickId, sub1, sub2, sub3);

      return response;
    } catch (error) {
      console.error('Failed to track affiliate click:', error);
      // Don't store cookie if API fails (we need the click_id)
      throw error;
    }
  }

  /**
   * Set affiliate cookie with 60 day expiry
   * @param {string} ref - Affiliate reference ID
   * @param {string} clickId - Unique click ID from backend
   * @param {string} [sub1] - Optional sub ID 1
   * @param {string} [sub2] - Optional sub ID 2
   * @param {string} [sub3] - Optional sub ID 3
   */
  private setCookie(ref: string, clickId: string, sub1?: string, sub2?: string, sub3?: string): void {
    if (typeof document === 'undefined') return;

    const cookieData = {
      ref,
      click_id: clickId,
      ...(sub1 && { sub1 }),
      ...(sub2 && { sub2 }),
      ...(sub3 && { sub3 }),
      tracked_at: new Date().toISOString(),
    };

    const expires = new Date();
    expires.setDate(expires.getDate() + this.COOKIE_EXPIRY_DAYS);

    document.cookie = `${this.COOKIE_NAME}=${encodeURIComponent(JSON.stringify(cookieData))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }

  /**
   * Get affiliate cookie data
   * @returns {object | null} Cookie data or null if not found
   */
  getCookie(): { ref: string; click_id?: string; sub1?: string; sub2?: string; sub3?: string; tracked_at: string } | null {
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
        try {
          return JSON.parse(cookieValue);
        } catch (e) {
          console.error('Failed to parse affiliate cookie:', e);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Check if affiliate cookie with click_id already exists
   * @returns {boolean}
   */
  hasExistingClickId(): boolean {
    const cookie = this.getCookie();
    return cookie !== null && !!cookie.click_id;
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
