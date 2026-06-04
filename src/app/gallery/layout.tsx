import type { Metadata } from 'next';
import { generatePageMetadata, SITE_URL } from '@/lib/seo';
import { BreadcrumbJsonLd } from '@/components/wayfare/JsonLd';

export const metadata: Metadata = generatePageMetadata({
  title: 'Photo Gallery — Real Travel Moments',
  description: 'Browse stunning travel photos from Wayfare travelers. Honeymoon, adventure, beach, nightlife, culture & luxury travel moments from Kerala to Maldives, Kashmir to Dubai. Get inspired for your next trip!',
  keywords: [
    'travel gallery', 'travel photos India', 'holiday pictures',
    'Wayfare travel gallery', 'travel moments', 'tourism photography',
    'Kerala photos', 'Goa beach photos', 'Maldives pictures',
    'Kashmir photos', 'travel inspiration', 'vacation photos',
  ],
  path: '/gallery',
  ogImage: '/images/logo-wayfare-new.png',
});

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={{
        items: [
          { name: 'Home', url: SITE_URL },
          { name: 'Gallery', url: `${SITE_URL}/gallery` },
        ],
      }} />
      <section aria-labelledby="gallery-heading">
        <h1 id="gallery-heading" className="sr-only">Photo Gallery</h1>
        {children}
      </section>
    </>
  );
}
