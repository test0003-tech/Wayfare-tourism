import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

function transformHotel(hotel: any) {
  let amenities = '';
  try {
    const parsed = JSON.parse(hotel.amenities);
    amenities = Array.isArray(parsed) ? parsed.join(',') : hotel.amenities;
  } catch {
    amenities = hotel.amenities;
  }

  return {
    id: hotel.id,
    name: hotel.name,
    slug: hotel.slug,
    destinationId: hotel.destinationId,
    destination: {
      name: hotel.destination.name,
      country: hotel.destination.country,
      region: hotel.destination.region,
      image: hotel.destination.image,
      slug: hotel.destination.slug,
    },
    category: hotel.category,
    stars: hotel.stars,
    pricePerNight: hotel.pricePerNight,
    originalPrice: hotel.originalPrice,
    image: hotel.image,
    description: hotel.description,
    amenities,
    rating: hotel.rating,
    reviewCount: hotel.reviewCount,
    featured: hotel.featured,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const hotel = await db.hotel.findUnique({
      where: { slug },
      include: { destination: true },
    });

    if (!hotel || hotel.status !== 'active') {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    return NextResponse.json(transformHotel(hotel));
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return NextResponse.json({ error: 'Failed to fetch hotel' }, { status: 500 });
  }
}
