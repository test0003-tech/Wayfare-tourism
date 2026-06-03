import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Destinations | Wayfare — Domestic & International Travel Destinations',
  description: 'Discover 50+ stunning destinations — from Kerala backwaters to Maldives overwater villas. Domestic & international travel destinations with packages, hotels & flights.',
  keywords: ['travel destinations', 'Kerala', 'Kashmir', 'Goa', 'Dubai', 'Maldives', 'Thailand', 'Singapore', 'domestic destinations', 'international destinations'],
  openGraph: {
    title: 'Explore Destinations | Wayfare',
    description: '50+ stunning destinations — from Kerala backwaters to Maldives overwater villas.',
    type: 'website',
    siteName: 'Wayfare',
  },
};

export default function DestinationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
