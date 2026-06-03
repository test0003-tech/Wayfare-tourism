import type { Metadata } from 'next';
import { KEYWORDS, generatePageMetadata, SITE_URL } from '@/lib/seo';
import { getAllEdgeHotels } from '@/lib/edge-data';
import { ItemListJsonLd } from '@/components/wayfare/JsonLd';

export const metadata: Metadata = generatePageMetadata({
  title: 'Hotels & Resorts — Luxury, Boutique & Heritage Stays',
  description: 'Book 200+ luxury hotels, boutique resorts, heritage stays & homestays across 50+ destinations in India & abroad. Verified properties with best price guarantee. Starting from ₹3,500/night. Free cancellation on select hotels.',
  keywords: [
    ...KEYWORDS.hotels,
    'best hotels in Kerala', 'best hotels in Goa', 'best hotels in Dubai',
    'best hotels in Kashmir', 'beach resort India', 'hill station resort',
    'heritage hotel India', 'luxury resort booking', 'budget hotel booking',
    'hotel booking India', 'resort booking online', '5 star hotel India',
    'couple friendly hotels', 'family hotels India', 'hotel deals today',
  ],
  path: '/hotels',
  ogImage: '/images/logo-wayfare-new.png',
});

export default function HotelsLayout({ children }: { children: React.ReactNode }) {
  const hotels = getAllEdgeHotels();

  return (
    <>
      <ItemListJsonLd data={{
        name: 'Wayfare Hotels & Resorts',
        description: 'Luxury hotels, boutique resorts & heritage stays across 50+ destinations.',
        url: `${SITE_URL}/hotels`,
        items: hotels.map((hotel, i) => ({
          name: hotel.name,
          url: `${SITE_URL}/hotels/${hotel.slug}`,
          position: i + 1,
        })),
      }} />
      {children}
    </>
  );
}
