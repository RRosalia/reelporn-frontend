import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ClientProviders } from '@/components/ClientProviders';
import MainLayout from '@/components/MainLayout';
import { Metadata } from 'next';
import { headers } from 'next/headers';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reelporn.ai';
  const headersList = await headers();

  // Get the pathname from headers
  const pathname = headersList.get('x-pathname') || '/';

  // Remove locale prefix from pathname if present
  let pathWithoutLocale = pathname;
  routing.locales.forEach((loc) => {
    if (pathname.startsWith(`/${loc}/`)) {
      pathWithoutLocale = pathname.substring(loc.length + 1);
    } else if (pathname === `/${loc}`) {
      pathWithoutLocale = '/';
    }
  });

  // Helper function to get localized pathname
  const getLocalizedPath = (targetLocale: string, basePath: string): string => {
    // Find matching pathname config in routing
    const pathnameConfig = routing.pathnames as Record<string, string | Record<string, string>>;

    // Look for exact match in pathnames
    for (const [key, value] of Object.entries(pathnameConfig)) {
      if (typeof value === 'string') {
        // Simple pathname (same across all locales)
        if (basePath === value || basePath === key) {
          return value;
        }
      } else {
        // Localized pathname
        // Check if the current basePath matches any locale version of this route
        const localeValues = Object.values(value);
        if (localeValues.includes(basePath) || basePath === key) {
          return value[targetLocale as keyof typeof value] || basePath;
        }
      }
    }

    // If no match found, return the original path
    return basePath;
  };

  // Generate language alternates for hreflang
  const languages: Record<string, string> = {};

  routing.locales.forEach((loc) => {
    const localizedPath = getLocalizedPath(loc, pathWithoutLocale);

    // For default locale (en), don't add prefix when using 'as-needed'
    if (loc === routing.defaultLocale && routing.localePrefix === 'as-needed') {
      languages[loc] = `${siteUrl}${localizedPath}`;
    } else {
      languages[loc] = `${siteUrl}/${loc}${localizedPath}`;
    }
  });

  // Get the canonical URL with localized path
  const canonicalPath = getLocalizedPath(locale, pathWithoutLocale);
  const canonical = locale === routing.defaultLocale && routing.localePrefix === 'as-needed'
    ? `${siteUrl}${canonicalPath}`
    : `${siteUrl}/${locale}${canonicalPath}`;

  return {
    alternates: {
      canonical,
      languages: {
        ...languages,
        'x-default': `${siteUrl}${getLocalizedPath(routing.defaultLocale, pathWithoutLocale)}`, // Default to English version
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Load messages for the current locale
  let messages;
  try {
    messages = (await import(`@/i18n/locales/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    messages = {};
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ClientProviders>
        <MainLayout>
          {children}
        </MainLayout>
      </ClientProviders>
    </NextIntlClientProvider>
  );
}
