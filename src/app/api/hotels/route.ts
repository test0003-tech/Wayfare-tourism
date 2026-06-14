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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const category = searchParams.get('category');
    const destinationId = searchParams.get('destinationId');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = { status: 'active' };

    if (category) where.category = category;
    if (destinationId) where.destinationId = destinationId;
    if (featured === 'true') where.featured = true;

    if (region) {
      where.destination = {
        country: region === 'domestic' ? 'India' : { not: 'India' },
      };
    }

    if (search) {
      const q = search.toLowerCase();
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const hotels = await db.hotel.findMany({
      where,
      include: {
        destination: { select: { name: true, country: true } },
      },
      orderBy: { rating: 'desc' },
    });

    const result = hotels.map((hotel) => ({
      id: hotel.id,
      name: hotel.name,
      slug: hotel.slug,
      destinationId: hotel.destinationId,
      destination: {
        name: hotel.destination.name,
        country: hotel.destination.country,
        region: getRegion(hotel.destination.country),
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
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
  }
}
