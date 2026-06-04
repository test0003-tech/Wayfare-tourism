import type { Metadata } from 'next';
import { SITE_URL, KEYWORDS, generatePageMetadata } from '@/lib/seo';
import { getAllEdgePackages } from '@/lib/edge-data';
import { ItemListJsonLd, BreadcrumbJsonLd } from '@/components/wayfare/JsonLd';

export const metadata: Metadata = generatePageMetadata({
  title: 'Tour Packages — Honeymoon, Adventure & Family Packages',
  description: 'Explore 50+ curated tour packages for Kerala, Kashmir, Goa, Dubai, Maldives, Thailand & more. Honeymoon, adventure, family, beach & pilgrimage packages starting from ₹11,999. Best price guarantee with Wayfare!',
  keywords: [
    ...KEYWORDS.categories,
    ...KEYWORDS.priceBooking,
    'Kerala tour package', 'Kashmir honeymoon package', 'Goa beach holiday',
    'Dubai tour from India', 'Maldives honeymoon', 'Thailand travel package',
    'Singapore tour package', 'Bali honeymoon package', 'Rajasthan heritage tour',
    'Himachal adventure package', 'Andaman beach package',
    'all inclusive tour packages', 'customized tour packages India',
  ],
  path: '/packages',
  ogImage: '/images/logo-wayfare-new.png',
});

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  const packages = getAllEdgePackages();
  
  return (
    <>
      <ItemListJsonLd data={{
        name: 'Wayfare Tour Packages',
        description: 'Curated tour packages for honeymoon, adventure, family & more. Starting from ₹11,999.',
        url: `${SITE_URL}/packages`,
        items: packages.map((pkg, i) => ({
          name: pkg.name,
          url: `${SITE_URL}/packages/${pkg.slug}`,
          position: i + 1,
        })),
      }} />
      <BreadcrumbJsonLd items={{
        items: [
          { name: 'Home', url: SITE_URL },
          { name: 'Packages', url: `${SITE_URL}/packages` },
        ],
      }} />
      <section aria-labelledby="packages-heading">
        <h1 id="packages-heading" className="sr-only">Tour Packages</h1>
        {children}
      </section>
    </>
  );
}
