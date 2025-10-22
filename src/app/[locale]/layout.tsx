import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ClientProviders } from '@/components/ClientProviders';
import MainLayout from '@/components/MainLayout';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import Script from 'next/script';

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
    other: {
      rating: 'RTA-5042-1996-1400-1577-RTA',
    },
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
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <Script
          id="age-verification-check"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var path = window.location.pathname;
                  var isExcluded = path.includes('/blocked') ||
                                   path.includes('/error-codes/') ||
                                   path.includes('/parental-controls');

                  // Check if this is a crawler (cookie set by middleware)
                  var isCrawler = document.cookie.split('; ').find(row => row.startsWith('crawler-bypass='));

                  // Skip age verification for crawlers
                  if (isCrawler || isExcluded) {
                    return;
                  }

                  var verified = localStorage.getItem('ageVerified');
                  var blocked = localStorage.getItem('ageBlocked');

                  if (blocked === 'true') {
                    // Add class to hide content during redirect
                    document.documentElement.classList.add('age-verification-pending');
                    window.location.href = '/blocked';
                  } else if (verified !== 'true') {
                    document.documentElement.classList.add('age-verification-pending');
                  }
                } catch (e) {
                  console.error('Age verification check error:', e);
                }
              })();
            `,
          }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders>
            <MainLayout>
              {children}
            </MainLayout>
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
