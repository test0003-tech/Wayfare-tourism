import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function parseJsonField(value: string | null, fallback: string = ''): string {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.join(',');
    return value;
  } catch {
    return value;
  }
}

function getRegion(country: string): 'domestic' | 'international' {
  return country === 'India' ? 'domestic' : 'international';
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const hotel = await db.hotel.findUnique({
      where: { slug, status: 'active' },
      include: {
        destination: { select: { name: true, country: true, image: true, slug: true } },
      },
    });

    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    const result = {
      id: hotel.id,
      name: hotel.name,
      slug: hotel.slug,
      destinationId: hotel.destinationId,
      destination: {
        name: hotel.destination.name,
        country: hotel.destination.country,
        region: getRegion(hotel.destination.country),
        image: hotel.destination.image,
        slug: hotel.destination.slug,
      },
      category: hotel.category,
      stars: hotel.stars,
      pricePerNight: hotel.pricePerNight,
      originalPrice: hotel.originalPrice,
      image: hotel.image,
      description: hotel.description,
      amenities: parseJsonField(hotel.amenities),
      rating: hotel.rating,
      reviewCount: hotel.reviewCount,
      featured: hotel.featured,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return NextResponse.json({ error: 'Failed to fetch hotel' }, { status: 500 });
  }
}
