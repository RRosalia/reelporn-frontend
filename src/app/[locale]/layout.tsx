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

  // Generate language alternates for hreflang
  const languages: Record<string, string> = {};

  routing.locales.forEach((loc) => {
    // For default locale (en), don't add prefix when using 'as-needed'
    if (loc === routing.defaultLocale && routing.localePrefix === 'as-needed') {
      languages[loc] = `${siteUrl}${pathWithoutLocale}`;
    } else {
      languages[loc] = `${siteUrl}/${loc}${pathWithoutLocale}`;
    }
  });

  // Generate canonical URL
  const canonical = locale === routing.defaultLocale && routing.localePrefix === 'as-needed'
    ? `${siteUrl}${pathWithoutLocale}`
    : `${siteUrl}/${locale}${pathWithoutLocale}`;

  return {
    alternates: {
      canonical,
      languages: {
        ...languages,
        'x-default': `${siteUrl}${pathWithoutLocale}`, // Default to English version
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
