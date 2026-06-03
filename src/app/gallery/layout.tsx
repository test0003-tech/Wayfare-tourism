import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photo Gallery | Wayfare — Real Travel Moments',
  description: 'Browse stunning travel photos from Wayfare travelers. Honeymoon, adventure, beach, nightlife, culture & luxury travel moments from Kerala to Maldives.',
  keywords: ['travel gallery', 'travel photos', 'holiday pictures', 'Wayfare gallery', 'travel moments'],
  openGraph: {
    title: 'Photo Gallery | Wayfare',
    description: 'Real travel moments from our happy travelers. Browse stunning photos.',
    type: 'website',
    siteName: 'Wayfare',
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
