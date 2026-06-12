export const runtime = 'edge';

// RSS Feed Generator for Wayfare Travel
// Generates a basic RSS 2.0 feed with all packages

import { getAllEdgePackages, getAllEdgeHotels, getAllEdgeDestinations } from '@/lib/edge-data';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo';

export async function GET() {
  const packages = getAllEdgePackages();
  const hotels = getAllEdgeHotels();
  const destinations = getAllEdgeDestinations();
  const now = new Date().toUTCString();

  const items: string[] = [];

  // Add packages to the feed
  for (const pkg of packages) {
    const categoryLabel = pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1).replace('-', ' ');
    items.push(`    <item>
      <title><![CDATA[${pkg.name} — ${pkg.destination.name} ${categoryLabel} Package]]></title>
      <link>${SITE_URL}/packages/${pkg.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/packages/${pkg.slug}</guid>
      <description><![CDATA[${pkg.description} Starting from ₹${pkg.price.toLocaleString()}. Duration: ${pkg.duration}.]]></description>
      <category>${categoryLabel}</category>
      <category>${pkg.destination.name}</category>
      <pubDate>${now}</pubDate>
    </item>`);
  }

  // Add top hotels to the feed
  for (const hotel of hotels.slice(0, 20)) {
    const categoryLabel = hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1);
    items.push(`    <item>
      <title><![CDATA[${hotel.name} — ${hotel.stars}-Star ${categoryLabel} Hotel in ${hotel.destination.name}]]></title>
      <link>${SITE_URL}/hotels/${hotel.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/hotels/${hotel.slug}</guid>
      <description><![CDATA[${hotel.description} Starting from ₹${hotel.pricePerNight.toLocaleString()}/night.]]></description>
      <category>Hotels</category>
      <category>${hotel.destination.name}</category>
      <pubDate>${now}</pubDate>
    </item>`);
  }

  // Add destinations to the feed
  for (const dest of destinations.slice(0, 15)) {
    items.push(`    <item>
      <title><![CDATA[${dest.name} Travel Guide — ${dest.tagline}]]></title>
      <link>${SITE_URL}/destinations/${dest.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/destinations/${dest.slug}</guid>
      <description><![CDATA[${dest.description}]]></description>
      <category>Destinations</category>
      <category>${dest.country}</category>
      <pubDate>${now}</pubDate>
    </item>`);
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} — Tour Packages, Hotels &amp; Travel Deals</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-IN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <generator>Wayfare Travel RSS Generator</generator>
    <image>
      <url>${SITE_URL}/images/logo-wayfare-new.png</url>
      <title>${SITE_NAME}</title>
      <link>${SITE_URL}</link>
    </image>
    <copyright>Copyright ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</copyright>
    <managingEditor>hello@wayfare.in (${SITE_NAME})</managingEditor>
    <webMaster>hello@wayfare.in (${SITE_NAME})</webMaster>
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
