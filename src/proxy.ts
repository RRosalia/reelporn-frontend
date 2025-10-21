import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

/**
 * Check if the request is from a known crawler
 * First checks user agent, then verifies IP with backend
 * Backend returns 200 if crawler, 404 if not
 */
async function isCrawler(request: NextRequest): Promise<boolean> {
  // Check common crawler user agents first
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const knownCrawlers = [
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'whatsapp',
    'telegrambot',
    'slackbot',
    'discordbot',
  ];

  const hasCrawlerUserAgent = knownCrawlers.some(bot => userAgent.includes(bot));

  // Only proceed with IP check if user agent matches a known crawler
  if (!hasCrawlerUserAgent) {
    return false;
  }

  // Get client IP from various headers (Cloudflare, nginx, etc.)
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  if (ip === 'unknown') {
    return false;
  }

  // Verify IP against backend
  // Backend returns 200 if crawler, 403 if not
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
    const response = await fetch(`${apiUrl}/crawlers/${ip}/check`, {
      headers: {
        'Accept': 'application/json',
      },
      // Add a short timeout to avoid blocking the middleware
      signal: AbortSignal.timeout(2000),
    });

    // Returns true only if backend returns 200 (crawler confirmed)
    // Returns false if 403 (not a crawler) or any other status
    return response.ok && response.status === 200;
  } catch (error) {
    console.error('Error checking crawler IP:', error);
    return false;
  }
}

export default async function middleware(request: NextRequest) {
  // Skip middleware for XML files (sitemaps)
  if (request.nextUrl.pathname.endsWith('.xml')) {
    return NextResponse.next();
  }

  // Get the pathname for hreflang metadata
  const pathname = request.nextUrl.pathname;

  // Check if request is from a crawler
  const isFromCrawler = await isCrawler(request);

  // Run next-intl middleware
  const response = intlMiddleware(request);

  // Add the pathname header to the response for server components
  if (response) {
    response.headers.set('x-pathname', pathname);

    // Set a cookie to bypass age verification for crawlers
    if (isFromCrawler) {
      response.cookies.set('crawler-bypass', 'true', {
        httpOnly: false, // Must be false so client-side JS can read it
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour
      });
    }
  }

  return response;
}

export const config = {
  // Match only internationalized pathnames
  // Exclude: API routes, static files, images
  matcher: [
    '/',
    '/(nl|de|fr)/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)'
  ]
};
