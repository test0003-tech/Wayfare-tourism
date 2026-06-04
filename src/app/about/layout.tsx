import type { Metadata } from 'next';
import { KEYWORDS, generatePageMetadata, SITE_URL } from '@/lib/seo';
import { BreadcrumbJsonLd } from '@/components/wayfare/JsonLd';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Wayfare — Our Story, Mission & Team',
  description: 'Learn about Wayfare — India\'s trusted travel partner. Born from a passion for travel, serving 10,000+ happy travelers with 500+ hotel partners across 50+ destinations. Best price guarantee & 24/7 support since 2023.',
  keywords: [
    ...KEYWORDS.brand,
    'about Wayfare Travel', 'Wayfare travel company', 'trusted travel agency India',
    'Wayfare team', 'Wayfare story', 'travel company India',
    'reliable travel partner', 'Wayfare reviews', 'Wayfare trust',
  ],
  path: '/about',
  ogImage: '/images/logo-wayfare-new.png',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={{
        items: [
          { name: 'Home', url: SITE_URL },
          { name: 'About', url: `${SITE_URL}/about` },
        ],
      }} />
      <section aria-labelledby="about-heading">
        <h1 id="about-heading" className="sr-only">About Wayfare</h1>
        {children}
      </section>
    </>
  );
}
