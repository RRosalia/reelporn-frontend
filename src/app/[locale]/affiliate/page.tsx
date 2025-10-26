import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AffiliatePageClient from '@/components/affiliate/AffiliatePageClient';

// Force dynamic rendering since we check environment variables
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const affiliateUrl = process.env.NEXT_PUBLIC_AFFILIATE_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reelporn.ai';

  // If affiliate program is not active, add noindex
  if (!affiliateUrl) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Use actual locale for translations (not hardcoded 'en')
  const t = await getTranslations({ locale, namespace: 'affiliate' });
  const title = t('meta.title');
  const description = t('meta.description');

  // Generate alternate language URLs based on routing config
  const alternateLanguages: Record<string, string> = {
    'en': `${siteUrl}/affiliate`,
    'nl': `${siteUrl}/nl/partner-programma`,
    'de': `${siteUrl}/de/partnerprogramm`,
    'fr': `${siteUrl}/fr/programme-affilie`,
  };

  const canonicalUrl = alternateLanguages[locale] || `${siteUrl}/affiliate`;

  return {
    title,
    description,
    keywords: [
      'affiliate program',
      'partner program',
      '40% commission',
      'lifetime commission',
      'recurring revenue',
      'crypto payouts',
      'adult affiliate',
      'revenue share'
    ].join(', '),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ReelPorn',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function AffiliatePage() {
  return <AffiliatePageClient />;
}
