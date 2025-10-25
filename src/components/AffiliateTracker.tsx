'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import affiliateService from '@/lib/services/AffiliateService';

/**
 * AffiliateTracker Component
 * Detects affiliate URL parameters (ref, sub1, sub2, sub3) and tracks them
 * Stores a cookie for 60 days and sends a backend API call ONLY on first detection
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

    // Track the affiliate click (only sends API call if cookie doesn't exist)
    affiliateService
      .trackClick(ref, sub1, sub2, sub3)
      .then((response) => {
        if (response) {
          console.log('Affiliate click tracked successfully:', response);
        } else {
          console.log('Affiliate already tracked, skipping API call');
        }
      })
      .catch((error) => {
        console.error('Failed to track affiliate click:', error);
      });
  }, [searchParams]);

  // This component doesn't render anything
  return null;
}
