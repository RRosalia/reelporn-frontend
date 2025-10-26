/**
 * Google Analytics event tracking utility
 */

import type { DataLayerEvent } from "@/types/Common";

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: {
        event_category?: string;
        event_label?: string;
        value?: number;
        [key: string]: unknown;
      }
    ) => void;
  }
}

/**
 * Track a conversion event in Google Analytics
 * @param eventName - Name of the event (e.g., "affiliate_cta_click")
 * @param params - Additional parameters for the event
 */
export function trackConversion(
  eventName: string,
  params?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: unknown;
  }
): void {
  try {
    // Check if gtag is available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, params);
      console.log(`[GA] Tracked conversion: ${eventName}`, params);
    } else if (typeof window !== "undefined" && window.dataLayer) {
      // Fallback to dataLayer push
      const event: DataLayerEvent = {
        event: eventName,
        ...params,
      };
      window.dataLayer.push(event);
      console.log(`[GA] Tracked conversion via dataLayer: ${eventName}`, params);
    } else {
      console.warn("[GA] Google Analytics not initialized");
    }
  } catch (error) {
    console.error("[GA] Error tracking conversion:", error);
  }
}

/**
 * Track affiliate CTA button clicks
 * @param location - Where on the page the CTA was clicked
 */
export function trackAffiliateCTAClick(
  location: "hero" | "commission" | "testimonials" | "faq" | "calculator" | "mid-page" | "footer"
): void {
  trackConversion("affiliate_cta_click", {
    event_category: "Affiliate",
    event_label: `CTA Click - ${location}`,
    value: 1,
  });
}

/**
 * Track affiliate calculator interactions
 */
export function trackAffiliateCalculatorUse(): void {
  trackConversion("affiliate_calculator_use", {
    event_category: "Affiliate",
    event_label: "Calculator Interaction",
    value: 1,
  });
}
