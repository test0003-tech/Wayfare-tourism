import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Wayfare — Our Story, Mission & Team',
  description: 'Learn about Wayfare — born from a passion for travel, serving 10,000+ happy travelers with 500+ hotel partners across 50+ destinations. Best price guarantee & 24/7 support.',
  keywords: ['about Wayfare', 'travel company', 'Wayfare team', 'travel agency India', 'trusted travel partner'],
  openGraph: {
    title: 'About Wayfare',
    description: 'Born from passion, built for dream vacations. 10K+ happy travelers trust Wayfare.',
    type: 'website',
    siteName: 'Wayfare',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
