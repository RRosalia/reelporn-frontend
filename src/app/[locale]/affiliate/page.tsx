import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AffiliatePageClient from './AffiliatePageClient';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'affiliate' });
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ReelPorn';
  const affiliateUrl = process.env.NEXT_PUBLIC_AFFILIATE_URL;

  // If affiliate program is not active, add noindex
  if (!affiliateUrl) {
    return {
      title: `${t('metadata.title')} | ${siteName}`,
      description: t('metadata.description'),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${t('metadata.title')} | ${siteName}`,
    description: t('metadata.description'),
    keywords: 'affiliate program, earn commission, adult entertainment, referral program, passive income',
    category: 'Business',
  };
}

export default async function AffiliatePage({ params }: PageProps) {
  await params; // Ensure params are consumed

  return <AffiliatePageClient />;
}
