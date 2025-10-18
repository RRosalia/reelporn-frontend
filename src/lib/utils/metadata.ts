import { Metadata } from 'next';
import { routing } from '@/i18n/routing';

interface GenerateAlternateLinksOptions {
  locale: string;
  pathname: string;
  params?: Record<string, string>;
}

/**
 * Generates hreflang alternate links for SEO
 *
 * @param locale - Current locale
 * @param pathname - Current pathname (from routing.pathnames)
 * @param params - Dynamic route parameters (e.g., { id: '123' })
 * @returns Metadata object with alternates
 */
export function generateAlternateLinks({
  locale,
  pathname,
  params = {},
}: GenerateAlternateLinksOptions): Pick<Metadata, 'alternates'> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reelporn.ai';

  // Get pathname configuration from routing
  const pathnameConfig = routing.pathnames[pathname as keyof typeof routing.pathnames];

  // Generate language alternates for hreflang
  const languages: Record<string, string> = {};

  routing.locales.forEach((loc) => {
    let localizedPath: string;

    // Determine the localized path
    if (typeof pathnameConfig === 'string') {
      // Same path for all locales
      localizedPath = pathnameConfig;
    } else if (typeof pathnameConfig === 'object' && pathnameConfig !== null) {
      // Different paths per locale
      localizedPath = pathnameConfig[loc as keyof typeof pathnameConfig] as string || pathname;
    } else {
      // Fallback to the original pathname
      localizedPath = pathname;
    }

    // Replace dynamic parameters (e.g., [slug], [id])
    Object.entries(params).forEach(([key, value]) => {
      localizedPath = localizedPath.replace(`[${key}]`, value);
    });

    // Build the full URL
    // For default locale (en) with 'as-needed', don't add locale prefix
    if (loc === routing.defaultLocale && routing.localePrefix === 'as-needed') {
      languages[loc] = `${siteUrl}${localizedPath}`;
    } else {
      languages[loc] = `${siteUrl}/${loc}${localizedPath}`;
    }
  });

  // Determine canonical URL
  let canonicalPath: string;
  if (typeof pathnameConfig === 'string') {
    canonicalPath = pathnameConfig;
  } else if (typeof pathnameConfig === 'object' && pathnameConfig !== null) {
    canonicalPath = pathnameConfig[locale as keyof typeof pathnameConfig] as string || pathname;
  } else {
    canonicalPath = pathname;
  }

  // Replace dynamic parameters in canonical path
  Object.entries(params).forEach(([key, value]) => {
    canonicalPath = canonicalPath.replace(`[${key}]`, value);
  });

  const canonical = locale === routing.defaultLocale && routing.localePrefix === 'as-needed'
    ? `${siteUrl}${canonicalPath}`
    : `${siteUrl}/${locale}${canonicalPath}`;

  return {
    alternates: {
      canonical,
      languages: {
        ...languages,
        'x-default': languages[routing.defaultLocale], // Default to the default locale
      },
    },
  };
}
