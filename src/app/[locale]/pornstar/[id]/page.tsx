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
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ReelPorn';

    if (!pornstar) {
        return {
            title: `${t('common.notFound')} | ${siteName}`,
            description: t('pornstar.notFoundDescription'),
        };
    }

    const fullName = `${pornstar.first_name} ${pornstar.last_name}`;
    const profileImageUrl = pornstar.profile_image?.large || pornstar.profile_image?.original;

    // Build enhanced SEO description based on available data
    let description: string;
    if (pornstar.videos_count > 0 && pornstar.age && pornstar.ethnicity && pornstar.country) {
        description = t('pornstar.seo.metaDescriptionWithVideos', {
            count: pornstar.videos_count,
            name: fullName,
            age: pornstar.age,
            ethnicity: pornstar.ethnicity,
            country: pornstar.country.name,
        });
    } else if (pornstar.age && pornstar.country) {
        description = t('pornstar.seo.metaDescriptionBasic', {
            name: fullName,
            age: pornstar.age,
            country: pornstar.country.name,
        });
    } else {
        description = t('pornstar.seo.metaDescriptionMinimal', {
            name: fullName,
        });
    }

    // Build comprehensive keywords using translated terms
    const keywordParts = [
        fullName,
        `${fullName} ${t('pornstar.seo.videos')}`,
        `${fullName} ${t('pornstar.seo.photos')}`,
        pornstar.first_name,
        pornstar.last_name,
        t('pornstar.seo.adultContent'),
        t('pornstar.seo.pornstarProfile'),
    ];
    if (pornstar.country) keywordParts.push(pornstar.country.name);
    if (pornstar.ethnicity) keywordParts.push(pornstar.ethnicity);
    if (pornstar.hair_color) keywordParts.push(`${pornstar.hair_color} hair`);

    const keywords = keywordParts.filter(Boolean).join(', ');

    // Get site URL from environment or construct it
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reelporn.com';
    const canonicalUrl = `${siteUrl}${locale !== 'en' ? `/${locale}` : ''}/pornstar/${slug}`;

    return {
        title: `${t('pornstar.seo.metaTitle', {
            name: fullName,
            firstName: pornstar.first_name,
        })} | ${siteName}`,
        description,
        keywords,
        authors: [{ name: fullName }],
        category: 'Adult Entertainment',
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

    // Generate JSON-LD structured data for ProfilePage, BreadcrumbList, ImageObject, and FAQPage
    const generateStructuredData = async () => {
        if (!pornstar) return [];

        const t = await getTranslations({ locale });
        const fullName = `${pornstar.first_name} ${pornstar.last_name}`;
        const profileImageUrl = pornstar.profile_image?.large || pornstar.profile_image?.original;
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reelporn.com';
        const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ReelPorn';
        const profileUrl = `${siteUrl}${locale !== 'en' ? `/${locale}` : ''}/pornstar/${slug}`;

        const schemas = [];

        // ProfilePage Schema
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            'mainEntity': {
                '@type': 'Person',
                'name': fullName,
                'alternateName': `${pornstar.first_name}`,
                'description': pornstar.bio?.content || t('pornstar.content.aboutDescriptionMinimal', {
                    name: fullName,
                    firstName: pornstar.first_name,
                }),
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
        });

        // BreadcrumbList Schema
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
                {
                    '@type': 'ListItem',
                    'position': 1,
                    'name': t('pornstar.breadcrumb.home'),
                    'item': siteUrl + (locale !== 'en' ? `/${locale}` : ''),
                },
                {
                    '@type': 'ListItem',
                    'position': 2,
                    'name': t('pornstar.breadcrumb.pornstars'),
                    'item': `${siteUrl}${locale !== 'en' ? `/${locale}` : ''}/pornstars`,
                },
                {
                    '@type': 'ListItem',
                    'position': 3,
                    'name': fullName,
                    'item': profileUrl,
                },
            ],
        });

        // ImageObject Schema (if profile image exists)
        if (profileImageUrl) {
            schemas.push({
                '@context': 'https://schema.org',
                '@type': 'ImageObject',
                'contentUrl': profileImageUrl,
                'url': profileImageUrl,
                'name': t('pornstar.imageAlt.profilePhoto', {
                    name: fullName,
                    age: pornstar.age || '',
                    ethnicity: pornstar.ethnicity || '',
                    country: pornstar.country?.name || '',
                }),
                'description': `${fullName} ${t('pornstar.seo.pornstarProfile')}`,
                'author': {
                    '@type': 'Person',
                    'name': fullName,
                },
            });
        }

        // FAQPage Schema
        const faqItems = [];

        if (pornstar.age) {
            faqItems.push({
                '@type': 'Question',
                'name': t('pornstar.faq.howOld.question', { name: fullName }),
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': t('pornstar.faq.howOld.answer', { name: fullName, age: pornstar.age }),
                },
            });
        }

        if (pornstar.country) {
            faqItems.push({
                '@type': 'Question',
                'name': t('pornstar.faq.whereFrom.question', { firstName: pornstar.first_name }),
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': t('pornstar.faq.whereFrom.answer', { firstName: pornstar.first_name, country: pornstar.country.name }),
                },
            });
        }

        if (pornstar.height_cm) {
            const heightFt = `${Math.floor(pornstar.height_cm / 30.48)}'${Math.round((pornstar.height_cm % 30.48) / 2.54)}"`;
            faqItems.push({
                '@type': 'Question',
                'name': t('pornstar.faq.howTall.question', { firstName: pornstar.first_name }),
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': t('pornstar.faq.howTall.answer', { firstName: pornstar.first_name, height: pornstar.height_cm, heightFt }),
                },
            });
        }

        if (pornstar.weight_kg) {
            const weightLbs = Math.round(pornstar.weight_kg * 2.20462);
            faqItems.push({
                '@type': 'Question',
                'name': t('pornstar.faq.howMuchWeight.question', { firstName: pornstar.first_name }),
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': t('pornstar.faq.howMuchWeight.answer', { firstName: pornstar.first_name, weight: pornstar.weight_kg, weightLbs }),
                },
            });
        }

        if (pornstar.ethnicity) {
            faqItems.push({
                '@type': 'Question',
                'name': t('pornstar.faq.whatEthnicity.question', { firstName: pornstar.first_name }),
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': t('pornstar.faq.whatEthnicity.answer', { firstName: pornstar.first_name, ethnicity: pornstar.ethnicity }),
                },
            });
        }

        if (pornstar.videos_count > 0) {
            faqItems.push({
                '@type': 'Question',
                'name': t('pornstar.faq.howManyVideos.question', { firstName: pornstar.first_name }),
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': t('pornstar.faq.howManyVideos.answer', { firstName: pornstar.first_name, count: pornstar.videos_count }),
                },
            });
        }

        faqItems.push({
            '@type': 'Question',
            'name': t('pornstar.faq.howToWatch.question', { firstName: pornstar.first_name }),
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': t('pornstar.faq.howToWatch.answer', { firstName: pornstar.first_name }),
            },
        });

        faqItems.push({
            '@type': 'Question',
            'name': t('pornstar.faq.howToContact.question', { firstName: pornstar.first_name }),
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': t('pornstar.faq.howToContact.answer', { firstName: pornstar.first_name }),
            },
        });

        if (faqItems.length > 0) {
            schemas.push({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                'mainEntity': faqItems,
            });
        }

        return schemas;
    };

    const structuredData = await generateStructuredData();

    return (
        <>
            {/* Structured Data Schemas */}
            {structuredData.map((schema, index) => (
                <script
                    key={`schema-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}

            {/* Client Component */}
            <PornstarProfileClient slug={slug} locale={locale} />
        </>
    );
}
