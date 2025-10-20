import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://reelporn.ai';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/login',
          '/register',
          '/verify-email',
          '/forgot-password',
          '/reset-password',
          '/profile/*',
          '/settings/*',
          '/checkout/*',
          '/payment/*',
          '/api/*',
          '/*?*', // Disallow URLs with query parameters
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
