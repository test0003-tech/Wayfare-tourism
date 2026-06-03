import type { Metadata } from 'next';
import { db } from '@/lib/db';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hotel = await db.hotel.findUnique({
    where: { slug },
    include: { destination: true },
  });

  if (!hotel) {
    return { title: 'Hotel Not Found | Wayfare' };
  }

  return {
    title: `${hotel.name} | Wayfare — ${hotel.destination.name} Hotel`,
    description: `${hotel.description.slice(0, 160)} Book ${hotel.name} in ${hotel.destination.name} starting from ₹${hotel.pricePerNight.toLocaleString()}/night. ${hotel.stars}-star ${hotel.category} hotel.`,
    keywords: [hotel.name, `${hotel.destination.name} hotel`, `${hotel.category} hotel`, `${hotel.stars} star hotel`],
    openGraph: {
      title: `${hotel.name} | Wayfare`,
      description: `${hotel.stars}-star ${hotel.category} hotel in ${hotel.destination.name}. From ₹${hotel.pricePerNight.toLocaleString()}/night.`,
      type: 'website',
      siteName: 'Wayfare',
      images: [{ url: hotel.image, width: 1200, height: 630, alt: hotel.name }],
    },
  };
}

export default function HotelSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
