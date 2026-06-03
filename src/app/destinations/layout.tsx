import type { Metadata } from 'next';
import { KEYWORDS, generatePageMetadata, SITE_URL } from '@/lib/seo';
import { getAllEdgeDestinations } from '@/lib/edge-data';
import { ItemListJsonLd } from '@/components/wayfare/JsonLd';

export const metadata: Metadata = generatePageMetadata({
  title: 'Travel Destinations — Domestic & International',
  description: 'Discover 50+ stunning travel destinations — from Kerala backwaters & Kashmir valleys to Maldives overwater villas & Dubai skylines. Explore domestic & international destinations with tour packages, hotels & flights. Book with Wayfare!',
  keywords: [
    ...KEYWORDS.domestic,
    ...KEYWORDS.international,
    'best tourist destinations India', 'top travel destinations 2024',
    'holiday destinations from India', 'popular tourist places India',
    'international travel destinations from India',
    'beach destinations India', 'hill station destinations India',
    'honeymoon destinations India', 'adventure destinations India',
    'family vacation destinations', 'pilgrimage destinations India',
  ],
  path: '/destinations',
  ogImage: '/images/logo-wayfare-new.png',
});

export default function DestinationsLayout({ children }: { children: React.ReactNode }) {
  const destinations = getAllEdgeDestinations();

  return (
    <>
      <ItemListJsonLd data={{
        name: 'Wayfare Travel Destinations',
        description: '50+ stunning travel destinations — domestic & international.',
        url: `${SITE_URL}/destinations`,
        items: destinations.map((dest, i) => ({
          name: dest.name,
          url: `${SITE_URL}/destinations/${dest.slug}`,
          position: i + 1,
        })),
      }} />
      {children}
    </>
  );
}
