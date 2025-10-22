import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'nl', 'de', 'fr', 'es', 'it', 'pl', 'pt', 'sv', 'cs'],

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
      fr: '/categories',
      es: '/categorias',
      it: '/categorie',
      pl: '/kategorie',
      pt: '/categorias',
      sv: '/kategorier',
      cs: '/kategorie'
    },
    '/categories/[slug]': {
      en: '/categories/[slug]',
      nl: '/categorieen/[slug]',
      de: '/kategorien/[slug]',
      fr: '/categories/[slug]',
      es: '/categorias/[slug]',
      it: '/categorie/[slug]',
      pl: '/kategorie/[slug]',
      pt: '/categorias/[slug]',
      sv: '/kategorier/[slug]',
      cs: '/kategorie/[slug]'
    },
    '/blocked': '/blocked',
    '/parental-controls': '/parental-controls',
    '/pornstars': {
      en: '/pornstars',
      nl: '/pornosterren',
      de: '/pornostars',
      fr: '/pornostars',
      es: '/actrices-porno',
      it: '/pornostar',
      pl: '/gwiazdy-porno',
      pt: '/estrelas-porno',
      sv: '/porrstjarnor',
      cs: '/pornoherci'
    },
    '/pornstar/[id]': {
      en: '/pornstar/[id]',
      nl: '/pornoster/[id]',
      de: '/pornostar/[id]',
      fr: '/pornostar/[id]',
      es: '/actriz-porno/[id]',
      it: '/pornostar/[id]',
      pl: '/gwiazda-porno/[id]',
      pt: '/estrela-porno/[id]',
      sv: '/porrstjarna/[id]',
      cs: '/pornoherecka/[id]'
    },
    '/dmca': '/dmca',
    '/cookie-policy': '/cookie-policy',
    '/contact': {
      en: '/contact',
      nl: '/contact',
      de: '/kontakt',
      fr: '/contact',
      es: '/contacto',
      it: '/contatto',
      pl: '/kontakt',
      pt: '/contato',
      sv: '/kontakt',
      cs: '/kontakt'
    },
    '/faq': {
      en: '/faq',
      nl: '/veelgestelde-vragen',
      de: '/haufig-gestellte-fragen',
      fr: '/faq',
      es: '/preguntas-frecuentes',
      it: '/domande-frequenti',
      pl: '/czesto-zadawane-pytania',
      pt: '/perguntas-frequentes',
      sv: '/vanliga-fragor',
      cs: '/caste-dotazy'
    },
    '/terms': {
      en: '/terms',
      nl: '/voorwaarden',
      de: '/bedingungen',
      fr: '/conditions',
      es: '/terminos',
      it: '/termini',
      pl: '/warunki',
      pt: '/termos',
      sv: '/villkor',
      cs: '/podminky'
    },
    '/privacy': {
      en: '/privacy',
      nl: '/privacy',
      de: '/datenschutz',
      fr: '/confidentialite',
      es: '/privacidad',
      it: '/privacy',
      pl: '/prywatnosc',
      pt: '/privacidade',
      sv: '/integritet',
      cs: '/soukromi'
    },
    '/subscriptions': {
      en: '/subscriptions',
      nl: '/abbonementen',
      de: '/abonnements',
      fr: '/abonnements',
      es: '/suscripciones',
      it: '/abbonamenti',
      pl: '/subskrypcje',
      pt: '/assinaturas',
      sv: '/prenumerationer',
      cs: '/predplatne'
    },
    '/subscriptions/[id]/checkout': {
      en: '/subscriptions/[id]/checkout',
      nl: '/abbonementen/[id]/afrekenen',
      de: '/abonnements/[id]/kasse',
      fr: '/abonnements/[id]/paiement',
      es: '/suscripciones/[id]/pagar',
      it: '/abbonamenti/[id]/checkout',
      pl: '/subskrypcje/[id]/kasa',
      pt: '/assinaturas/[id]/finalizar',
      sv: '/prenumerationer/[id]/kassa',
      cs: '/predplatne/[id]/pokladna'
    },
    '/about': {
      en: '/about',
      nl: '/over-ons',
      de: '/uber-uns',
      fr: '/a-propos',
      es: '/acerca-de',
      it: '/chi-siamo',
      pl: '/o-nas',
      pt: '/sobre',
      sv: '/om-oss',
      cs: '/o-nas'
    },
    '/payment/crypto': {
      en: '/payment/crypto',
      nl: '/betaling/crypto',
      de: '/zahlung/krypto',
      fr: '/paiement/crypto',
      es: '/pago/cripto',
      it: '/pagamento/cripto',
      pl: '/platnosc/krypto',
      pt: '/pagamento/cripto',
      sv: '/betalning/krypto',
      cs: '/platba/krypto'
    },
    '/payment/[id]': {
      en: '/payment/[id]',
      nl: '/betaling/[id]',
      de: '/zahlung/[id]',
      fr: '/paiement/[id]',
      es: '/pago/[id]',
      it: '/pagamento/[id]',
      pl: '/platnosc/[id]',
      pt: '/pagamento/[id]',
      sv: '/betalning/[id]',
      cs: '/platba/[id]'
    },
    '/error-codes/[code]': '/error-codes/[code]',
  }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
