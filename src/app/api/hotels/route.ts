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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const category = searchParams.get('category');
    const destinationId = searchParams.get('destinationId');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const where: any = { status: 'active' };

    if (category) where.category = category;
    if (destinationId) where.destinationId = destinationId;
    if (featured === 'true') where.featured = true;

    if (region) {
      where.destination = { region };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const hotels = await db.hotel.findMany({
      where,
      include: { destination: true },
      orderBy: { rating: 'desc' },
    });

    return NextResponse.json(hotels.map(transformHotel));
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
  }
}
