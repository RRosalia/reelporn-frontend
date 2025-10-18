import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'nl', 'de', 'fr'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Only show locale prefix for non-default locales
  localePrefix: 'as-needed',

  // The `pathnames` object holds pairs of internal and
  // external paths. Based on the external path a locale
  // can be found.
  pathnames: {
    '/': '/',
    '/shorts': '/shorts',
    '/signup': '/signup',
    '/login': '/login',
    '/account': '/account',
    '/categories': {
      en: '/categories',
      nl: '/categorieen',
      de: '/kategorien',
      fr: '/categories'
    },
    '/categories/[slug]': {
      en: '/categories/[slug]',
      nl: '/categorieen/[slug]',
      de: '/kategorien/[slug]',
      fr: '/categories/[slug]'
    },
    '/blocked': '/blocked',
    '/parental-controls': '/parental-controls',
    '/pornstars': {
      en: '/pornstars',
      nl: '/pornosterren',
      de: '/pornostars',
      fr: '/pornostars'
    },
    '/pornstar/[id]': {
      en: '/pornstar/[id]',
      nl: '/pornoster/[id]',
      de: '/pornostar/[id]',
      fr: '/pornostar/[id]'
    },
    '/dmca': '/dmca',
    '/2257': '/section2257',
    '/section2257': '/section2257',
    '/cookie-policy': '/cookie-policy',
    '/faq': {
      en: '/faq',
      nl: '/veelgestelde-vragen',
      de: '/haufig-gestellte-fragen',
      fr: '/faq'
    },
    '/terms': {
      en: '/terms',
      nl: '/voorwaarden',
      de: '/bedingungen',
      fr: '/conditions'
    },
    '/privacy': {
      en: '/privacy',
      nl: '/privacy',
      de: '/datenschutz',
      fr: '/confidentialite'
    },
    '/subscriptions': {
      en: '/subscriptions',
      nl: '/abbonementen',
      de: '/abonnements',
      fr: '/abonnements'
    },
    '/about': {
      en: '/about',
      nl: '/over-ons',
      de: '/uber-uns',
      fr: '/a-propos'
    },
    '/payment/crypto': {
      en: '/payment/crypto',
      nl: '/betaling/crypto',
      de: '/zahlung/krypto',
      fr: '/paiement/crypto'
    },
    '/error-codes/[code]': '/error-codes/[code]',
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
