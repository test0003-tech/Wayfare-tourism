import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hotels & Resorts | Wayfare — Luxury, Boutique & Heritage Stays',
  description: 'Book luxury hotels, boutique resorts & heritage stays across 50+ destinations. Verified properties with best price guarantee. Starting from ₹3,500/night.',
  keywords: ['hotels', 'resorts', 'luxury hotels', 'boutique hotels', 'heritage stays', 'hotel booking', 'best hotel deals'],
  openGraph: {
    title: 'Hotels & Resorts | Wayfare',
    description: 'Luxury hotels, boutique resorts & heritage stays. Best price guarantee.',
    type: 'website',
    siteName: 'Wayfare',
  },
};

export default function HotelsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
