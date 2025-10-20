import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://reelporn.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en', 'nl', 'de', 'fr'] as const;

  // Helper function to create localized alternates
  const createAlternates = (paths: Record<string, string>) => ({
    languages: {
      en: `${BASE_URL}${paths.en}`,
      nl: `${BASE_URL}/nl${paths.nl}`,
      de: `${BASE_URL}/de${paths.de}`,
      fr: `${BASE_URL}/fr${paths.fr}`,
    },
  });

  return [
    // Home page
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
      alternates: createAlternates({
        en: '',
        nl: '',
        de: '',
        fr: '',
      }),
    },
    // Shorts
    {
      url: `${BASE_URL}/shorts`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
      alternates: createAlternates({
        en: '/shorts',
        nl: '/shorts',
        de: '/shorts',
        fr: '/shorts',
      }),
    },
    // Videos
    {
      url: `${BASE_URL}/videos`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
      alternates: createAlternates({
        en: '/videos',
        nl: '/videos',
        de: '/videos',
        fr: '/videos',
      }),
    },
    // Categories
    {
      url: `${BASE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: createAlternates({
        en: '/categories',
        nl: '/categorieen',
        de: '/kategorien',
        fr: '/categories',
      }),
    },
    // Pornstars
    {
      url: `${BASE_URL}/pornstars`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: createAlternates({
        en: '/pornstars',
        nl: '/pornosterren',
        de: '/pornostars',
        fr: '/pornostars',
      }),
    },
    // Blog
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: createAlternates({
        en: '/blog',
        nl: '/blog',
        de: '/blog',
        fr: '/blog',
      }),
    },
    // Subscriptions
    {
      url: `${BASE_URL}/subscriptions`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: createAlternates({
        en: '/subscriptions',
        nl: '/abbonementen',
        de: '/abonnements',
        fr: '/abonnements',
      }),
    },
    // About
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: createAlternates({
        en: '/about',
        nl: '/over-ons',
        de: '/uber-uns',
        fr: '/a-propos',
      }),
    },
    // FAQ
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: createAlternates({
        en: '/faq',
        nl: '/veelgestelde-vragen',
        de: '/haufig-gestellte-fragen',
        fr: '/faq',
      }),
    },
    // Terms
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
      alternates: createAlternates({
        en: '/terms',
        nl: '/voorwaarden',
        de: '/bedingungen',
        fr: '/conditions',
      }),
    },
    // Privacy
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
      alternates: createAlternates({
        en: '/privacy',
        nl: '/privacy',
        de: '/datenschutz',
        fr: '/confidentialite',
      }),
    },
    // Cookie Policy
    {
      url: `${BASE_URL}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: createAlternates({
        en: '/cookie-policy',
        nl: '/cookie-policy',
        de: '/cookie-policy',
        fr: '/cookie-policy',
      }),
    },
    // DMCA
    {
      url: `${BASE_URL}/dmca`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: createAlternates({
        en: '/dmca',
        nl: '/dmca',
        de: '/dmca',
        fr: '/dmca',
      }),
    },
    // Section 2257
    {
      url: `${BASE_URL}/section2257`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: createAlternates({
        en: '/section2257',
        nl: '/section2257',
        de: '/section2257',
        fr: '/section2257',
      }),
    },
    // Parental Controls
    {
      url: `${BASE_URL}/parental-controls`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: createAlternates({
        en: '/parental-controls',
        nl: '/parental-controls',
        de: '/parental-controls',
        fr: '/parental-controls',
      }),
    },
  ];
}
