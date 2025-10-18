import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Get the pathname for hreflang metadata
  const pathname = request.nextUrl.pathname;

  // Run next-intl middleware
  const response = intlMiddleware(request);

  // Add the pathname header to the response for server components
  if (response) {
    response.headers.set('x-pathname', pathname);
  }

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(nl|de|fr)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
