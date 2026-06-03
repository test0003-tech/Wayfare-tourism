import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

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
  return children;
}
