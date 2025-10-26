/**
 * Affiliate tracking types
 */

/**
 * Affiliate registration request data
 */
export interface AffiliateLeadData {
  ref: string;
  click_id?: string; // Existing click_id to send when already tracked
  sub1?: string;
  sub2?: string;
  sub3?: string;
}

/**
 * Affiliate registration response
 */
export interface AffiliateLeadResponse {
  data: {
    click_id: string; // UUID click_id from backend
    expiration_date: string; // ISO 8601 timestamp for cookie expiration
  };
}
