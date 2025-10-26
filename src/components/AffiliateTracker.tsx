'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import affiliateService from '@/lib/services/AffiliateService';

/**
 * AffiliateTracker Component
 * Detects affiliate URL parameters (ref, sub1, sub2, sub3) and tracks them
 * Stores a cookie with backend-controlled expiration and sends a backend API call
 * If click_id already exists, sends it along with the new click
 */
export default function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');

    // Only track if ref parameter is present
    if (!ref) return;

    // Get optional sub parameters
    const sub1 = searchParams.get('sub1') || undefined;
    const sub2 = searchParams.get('sub2') || undefined;
    const sub3 = searchParams.get('sub3') || undefined;

    // Track the affiliate click
    affiliateService
      .trackClick(ref, sub1, sub2, sub3)
      .then((response) => {
        console.log('Affiliate click tracked successfully:', response);

        // Push GTM event for affiliate lead
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'affiliate_lead',
            affiliate_ref: ref,
            affiliate_click_id: response.data.click_id,
            affiliate_sub1: sub1 || null,
            affiliate_sub2: sub2 || null,
            affiliate_sub3: sub3 || null,
          });
        }
      })
      .catch((error) => {
        console.error('Failed to track affiliate click:', error);
      });
  }, [searchParams]);

  // This component doesn't render anything
  return null;
}
