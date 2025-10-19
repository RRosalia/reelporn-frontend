import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

interface SubscriptionsLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: SubscriptionsLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'subscriptions' });

  const title = t('meta.title');
  const description = t('meta.description');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function SubscriptionsLayout({
  children,
  params,
}: SubscriptionsLayoutProps) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Can I change plans anytime?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes! You can upgrade or downgrade your subscription at any time. Changes take effect at your next billing cycle.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do I cancel?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: "You can cancel your subscription anytime from your account settings. You'll keep access until the end of your billing period.",
                },
              },
              {
                '@type': 'Question',
                name: 'What payment methods are accepted?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'We accept cryptocurrency payments for your privacy and security.',
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
