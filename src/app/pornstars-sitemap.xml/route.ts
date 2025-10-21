import { NextResponse } from 'next/server';
import PornstarsRepository from '@/lib/repositories/PornstarsRepository';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://reelporn.ai';

export const dynamic = 'force-dynamic';

/**
 * Generate pornstars sitemap
 */
export async function GET() {
  try {
    const pornstarsData = await PornstarsRepository.getSitemapData();

    // Helper function to create localized alternates
    const createAlternates = (slug: string) => {
      return `
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/pornstar/${slug}" />
    <xhtml:link rel="alternate" hreflang="nl" href="${BASE_URL}/nl/pornoster/${slug}" />
    <xhtml:link rel="alternate" hreflang="de" href="${BASE_URL}/de/pornostar/${slug}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}/fr/pornostar/${slug}" />`;
    };

    const urlEntries = pornstarsData
      .map(
        (pornstar) => `  <url>
    <loc>${BASE_URL}/pornstar/${pornstar.slug}</loc>
    <lastmod>${new Date(pornstar.last_modified).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${createAlternates(pornstar.slug)}
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
    console.error('Error generating pornstars sitemap:', error);

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
