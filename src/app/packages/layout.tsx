import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tour Packages | Wayfare — Honeymoon, Adventure & Family Packages',
  description: 'Explore curated tour packages for Kerala, Kashmir, Goa, Dubai, Maldives, Thailand & more. Honeymoon, adventure, family packages starting from ₹11,999. Book now with Wayfare!',
  keywords: ['tour packages', 'honeymoon packages', 'adventure tours', 'family packages', 'Kerala tour', 'Kashmir package', 'Goa holiday', 'Dubai tour'],
  openGraph: {
    title: 'Tour Packages | Wayfare',
    description: 'Curated tour packages for every traveler — honeymoon, adventure, family & more. Starting from ₹11,999.',
    type: 'website',
    siteName: 'Wayfare',
  },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
