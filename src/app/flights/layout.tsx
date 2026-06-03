import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flight Deals | Wayfare — Affordable Flights from India',
  description: 'Find the best flight deals from major Indian cities to top domestic and international destinations. Round-trip & one-way flights starting from ₹4,999.',
  keywords: ['flight deals', 'cheap flights', 'flight booking', 'round trip flights', 'domestic flights', 'international flights'],
  openGraph: {
    title: 'Flight Deals | Wayfare',
    description: 'Best flight deals from India. Affordable round-trip & one-way flights.',
    type: 'website',
    siteName: 'Wayfare',
  },
};

export default function FlightsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
