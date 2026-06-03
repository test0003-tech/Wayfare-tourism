import type { Metadata } from 'next';
import { db } from '@/lib/db';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = await db.destination.findUnique({
    where: { slug },
  });

  if (!destination) {
    return { title: 'Destination Not Found | Wayfare' };
  }

  return {
    title: `${destination.name} Travel Guide | Wayfare — ${destination.tagline}`,
    description: `${destination.description.slice(0, 160)} Explore ${destination.name}, ${destination.country} with Wayfare. Tour packages, hotels & flights available.`,
    keywords: [destination.name, `${destination.name} travel`, `${destination.name} tour`, `${destination.country} travel`, `${destination.name} packages`],
    openGraph: {
      title: `${destination.name} | Wayfare`,
      description: `Explore ${destination.name} — ${destination.tagline}. Packages, hotels & flights available.`,
      type: 'website',
      siteName: 'Wayfare',
      images: [{ url: destination.image, width: 1200, height: 630, alt: destination.name }],
    },
  };
}

export default function DestinationSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
