import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// List of blocked country codes (ISO 3166-1 alpha-2)
const BLOCKED_COUNTRIES = [
  'BY', // Belarus
  'MV', // Maldives
  'KP', // North Korea
  'VN', // Vietnam
  'SA', // Saudi Arabia
  'KR', // South Korea
  'AF', // Afghanistan
  'BD', // Bangladesh
  'BT', // Bhutan
  'BN', // Brunei
  'AE', // United Arab Emirates
  'QA', // Qatar
] as const;

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Check for geo-blocking based on Vercel's x-vercel-ip-country header
  const country = request.headers.get('x-vercel-ip-country');

  if (country && BLOCKED_COUNTRIES.includes(country as any)) {
    // Redirect to /blocked page with country information
    const url = new URL('/blocked', request.url);
    url.searchParams.set('reason', 'geo');
    url.searchParams.set('country', country);
    return NextResponse.redirect(url);
  }

  // Continue with i18n routing if not blocked
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for:
  // - /api routes
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - Static files (images, fonts, etc.)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
