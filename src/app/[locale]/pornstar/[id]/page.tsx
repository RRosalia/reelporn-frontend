import { Metadata } from 'next';
import { cache } from 'react';
import { getTranslations } from 'next-intl/server';
import PornstarsRepository from '@/lib/repositories/PornstarsRepository';
import { Pornstar } from '@/types/Pornstar';
import PornstarProfileClient from './PornstarProfileClient';
import './styles.css';

interface PageProps {
    params: Promise<{
        locale: string;
        id: string;
    }>;
}

// Cached function to get pornstar data - will only execute once per request
const getPornstarData = cache(async (slug: string): Promise<Pornstar | null> => {
    try {
        const data = await PornstarsRepository.getBySlug(slug);
        return data;
    } catch (error) {
        console.error('Error fetching pornstar for metadata:', error);
        return null;
    }
});

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, id: slug } = await params;
    const t = await getTranslations({ locale });

    const pornstar = await getPornstarData(slug);

    if (!pornstar) {
        return {
            title: `${t('common.notFound')} | ReelPorn`,
            description: t('pornstar.notFoundDescription'),
        };
    }

    const fullName = `${pornstar.first_name} ${pornstar.last_name}`;
    const profileImageUrl = pornstar.profile_image?.large || pornstar.profile_image?.original;

    // Build description with key details
    const descriptionParts: string[] = [];
    if (pornstar.age) descriptionParts.push(`${pornstar.age} years old`);
    if (pornstar.country) descriptionParts.push(`from ${pornstar.country.name}`);
    if (pornstar.videos_count > 0) descriptionParts.push(`${pornstar.videos_count} videos`);

    const description = `${fullName} - ${descriptionParts.join(', ')}. Watch exclusive content and connect with ${pornstar.first_name} on ReelPorn.`;

    // Get site URL from environment or construct it
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reelporn.com';
    const canonicalUrl = `${siteUrl}${locale !== 'en' ? `/${locale}` : ''}/pornstar/${slug}`;

    return {
        title: `${fullName} - Premium Content & Profile | ReelPorn`,
        description,
        keywords: `${fullName}, ${pornstar.first_name}, ${pornstar.last_name}, adult content, pornstar profile, videos${pornstar.country ? `, ${pornstar.country.name}` : ''}`,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'en': `${siteUrl}/pornstar/${slug}`,
                'nl': `${siteUrl}/nl/pornstar/${slug}`,
                'de': `${siteUrl}/de/pornstar/${slug}`,
                'fr': `${siteUrl}/fr/pornstar/${slug}`,
            },
        },
        openGraph: {
            type: 'profile',
            title: `${fullName} | ReelPorn`,
            description,
            url: canonicalUrl,
            siteName: 'ReelPorn',
            locale: locale,
            images: profileImageUrl ? [
                {
                    url: profileImageUrl,
                    width: 1200,
                    height: 1200,
                    alt: `${fullName} profile picture`,
                },
            ] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${fullName} | ReelPorn`,
            description,
            images: profileImageUrl ? [profileImageUrl] : [],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

// Main page component
export default async function PornstarProfilePage({ params }: PageProps) {
    const { locale, id: slug } = await params;
    const pornstar = await getPornstarData(slug);

    // Generate JSON-LD structured data for ProfilePage
    const generateStructuredData = () => {
        if (!pornstar) return null;

        const fullName = `${pornstar.first_name} ${pornstar.last_name}`;
        const profileImageUrl = pornstar.profile_image?.large || pornstar.profile_image?.original;
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reelporn.com';
        const profileUrl = `${siteUrl}${locale !== 'en' ? `/${locale}` : ''}/pornstar/${slug}`;

        return {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            'mainEntity': {
                '@type': 'Person',
                'name': fullName,
                'alternateName': `${pornstar.first_name}`,
                'description': pornstar.bio?.content || `Professional content creator on ReelPorn`,
                ...(profileImageUrl && { 'image': profileImageUrl }),
                ...(pornstar.date_of_birth && { 'birthDate': pornstar.date_of_birth }),
                ...(pornstar.country && {
                    'nationality': {
                        '@type': 'Country',
                        'name': pornstar.country.name,
                    }
                }),
                'url': profileUrl,
                'interactionStatistic': [
                    {
                        '@type': 'InteractionCounter',
                        'interactionType': 'https://schema.org/WatchAction',
                        'userInteractionCount': pornstar.views_count,
                    },
                ],
                ...(pornstar.height_cm && {
                    'height': {
                        '@type': 'QuantitativeValue',
                        'value': pornstar.height_cm,
                        'unitCode': 'CMT',
                    }
                }),
                ...(pornstar.weight_kg && {
                    'weight': {
                        '@type': 'QuantitativeValue',
                        'value': pornstar.weight_kg,
                        'unitCode': 'KGM',
                    }
                }),
            },
            'dateCreated': pornstar.created_at,
            'dateModified': pornstar.updated_at,
        };
    };

    const structuredData = generateStructuredData();

    return (
        <>
            {/* Structured Data */}
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            )}

            {/* Client Component */}
            <PornstarProfileClient slug={slug} locale={locale} />
        </>
    );
}
