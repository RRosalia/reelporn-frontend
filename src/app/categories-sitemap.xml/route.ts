import { NextResponse } from 'next/server';
import CategoryRepository from '@/lib/repositories/CategoryRepository';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://reelporn.ai';

export const dynamic = 'force-dynamic';

/**
 * Generate categories sitemap
 */
export async function GET() {
  try {
    const categoriesData = await CategoryRepository.getSitemapData();

    // Helper function to create localized alternates
    const createAlternates = (slug: string) => {
      return `
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/categories/${slug}" />
    <xhtml:link rel="alternate" hreflang="nl" href="${BASE_URL}/nl/categorieen/${slug}" />
    <xhtml:link rel="alternate" hreflang="de" href="${BASE_URL}/de/kategorien/${slug}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}/fr/categories/${slug}" />`;
    };

    const urlEntries = categoriesData
      .map(
        (category) => `  <url>
    <loc>${BASE_URL}/categories/${category.slug}</loc>
    <lastmod>${new Date(category.last_modified).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${createAlternates(category.slug)}
  </url>`
      )
      .join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating categories sitemap:', error);

    // Return empty sitemap on error
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
</urlset>`;

    return new NextResponse(sitemap, {
      status: 500,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
      },
    });
  }
}
