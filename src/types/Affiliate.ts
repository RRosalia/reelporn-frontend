/**
 * Affiliate tracking types
 */

/**
 * Affiliate registration request data
 */
export interface AffiliateLeadData {
  ref: string;
  sub1?: string;
  sub2?: string;
  sub3?: string;
}

/**
 * Affiliate registration response
 */
export interface AffiliateLeadResponse {
  data: {
    id: string; // UUID click_id from backend
  };
}
