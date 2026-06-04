import type { Metadata } from 'next';
import { KEYWORDS, generatePageMetadata, SITE_URL } from '@/lib/seo';
import { BreadcrumbJsonLd } from '@/components/wayfare/JsonLd';

export const metadata: Metadata = generatePageMetadata({
  title: 'Flight Deals — Affordable Flights from India',
  description: 'Find the cheapest flight deals from major Indian cities to 50+ domestic and international destinations. Round-trip & one-way flights starting from ₹4,999. Compare airlines, book instantly with Wayfare!',
  keywords: [
    ...KEYWORDS.flights,
    'cheap flights from Delhi', 'cheap flights from Mumbai',
    'cheap flights from Bangalore', 'cheap flights from Chennai',
    'Delhi to Goa flights', 'Mumbai to Dubai flights',
    'Bangalore to Singapore flights', 'domestic flight offers',
    'international flight deals India', 'last minute flight deals',
    'flight booking offers', 'airline ticket deals',
  ],
  path: '/flights',
  ogImage: '/images/logo-wayfare-new.png',
});

export default function FlightsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={{
        items: [
          { name: 'Home', url: SITE_URL },
          { name: 'Flights', url: `${SITE_URL}/flights` },
        ],
      }} />
      <section aria-labelledby="flights-heading">
        <h1 id="flights-heading" className="sr-only">Flight Deals</h1>
        {children}
      </section>
    </>
  );
}
