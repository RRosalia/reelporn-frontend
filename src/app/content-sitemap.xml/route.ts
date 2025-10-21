import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://reelporn.ai';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Helper function to create localized alternates
  const createAlternates = (paths: Record<string, string>) => {
    return `
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${paths.en}" />
    <xhtml:link rel="alternate" hreflang="nl" href="${BASE_URL}/nl${paths.nl}" />
    <xhtml:link rel="alternate" hreflang="de" href="${BASE_URL}/de${paths.de}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}/fr${paths.fr}" />`;
  };

  const now = new Date().toISOString();

  const urls = [
    // Home page
    {
      url: BASE_URL,
      changefreq: 'hourly',
      priority: '1.0',
      alternates: createAlternates({ en: '', nl: '', de: '', fr: '' }),
    },
    // Shorts
    {
      url: `${BASE_URL}/shorts`,
      changefreq: 'hourly',
      priority: '0.9',
      alternates: createAlternates({ en: '/shorts', nl: '/shorts', de: '/shorts', fr: '/shorts' }),
    },
    // Videos
    {
      url: `${BASE_URL}/videos`,
      changefreq: 'hourly',
      priority: '0.9',
      alternates: createAlternates({ en: '/videos', nl: '/videos', de: '/videos', fr: '/videos' }),
    },
    // Categories
    {
      url: `${BASE_URL}/categories`,
      changefreq: 'daily',
      priority: '0.9',
      alternates: createAlternates({ en: '/categories', nl: '/categorieen', de: '/kategorien', fr: '/categories' }),
    },
    // Pornstars
    {
      url: `${BASE_URL}/pornstars`,
      changefreq: 'daily',
      priority: '0.9',
      alternates: createAlternates({ en: '/pornstars', nl: '/pornosterren', de: '/pornostars', fr: '/pornostars' }),
    },
    // Blog
    {
      url: `${BASE_URL}/blog`,
      changefreq: 'weekly',
      priority: '0.7',
      alternates: createAlternates({ en: '/blog', nl: '/blog', de: '/blog', fr: '/blog' }),
    },
    // Subscriptions
    {
      url: `${BASE_URL}/subscriptions`,
      changefreq: 'weekly',
      priority: '0.8',
      alternates: createAlternates({ en: '/subscriptions', nl: '/abbonementen', de: '/abonnements', fr: '/abonnements' }),
    },
    // About
    {
      url: `${BASE_URL}/about`,
      changefreq: 'monthly',
      priority: '0.6',
      alternates: createAlternates({ en: '/about', nl: '/over-ons', de: '/uber-uns', fr: '/a-propos' }),
    },
    // FAQ
    {
      url: `${BASE_URL}/faq`,
      changefreq: 'monthly',
      priority: '0.6',
      alternates: createAlternates({ en: '/faq', nl: '/veelgestelde-vragen', de: '/haufig-gestellte-fragen', fr: '/faq' }),
    },
    // Terms
    {
      url: `${BASE_URL}/terms`,
      changefreq: 'monthly',
      priority: '0.4',
      alternates: createAlternates({ en: '/terms', nl: '/voorwaarden', de: '/bedingungen', fr: '/conditions' }),
    },
    // Privacy
    {
      url: `${BASE_URL}/privacy`,
      changefreq: 'monthly',
      priority: '0.4',
      alternates: createAlternates({ en: '/privacy', nl: '/privacy', de: '/datenschutz', fr: '/confidentialite' }),
    },
    // Cookie Policy
    {
      url: `${BASE_URL}/cookie-policy`,
      changefreq: 'yearly',
      priority: '0.3',
      alternates: createAlternates({ en: '/cookie-policy', nl: '/cookie-policy', de: '/cookie-policy', fr: '/cookie-policy' }),
    },
    // DMCA
    {
      url: `${BASE_URL}/dmca`,
      changefreq: 'yearly',
      priority: '0.3',
      alternates: createAlternates({ en: '/dmca', nl: '/dmca', de: '/dmca', fr: '/dmca' }),
    },
    // Section 2257
    {
      url: `${BASE_URL}/section2257`,
      changefreq: 'yearly',
      priority: '0.3',
      alternates: createAlternates({ en: '/section2257', nl: '/section2257', de: '/section2257', fr: '/section2257' }),
    },
    // Parental Controls
    {
      url: `${BASE_URL}/parental-controls`,
      changefreq: 'yearly',
      priority: '0.3',
      alternates: createAlternates({ en: '/parental-controls', nl: '/parental-controls', de: '/parental-controls', fr: '/parental-controls' }),
    },
  ];

  const urlEntries = urls
    .map(
      ({ url, changefreq, priority, alternates }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${alternates}
  </url>`
    )
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
