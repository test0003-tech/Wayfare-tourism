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

    const destination = await db.destination.findUnique({
      where: { slug, status: 'active' },
      include: {
        packages: { where: { status: 'active' }, orderBy: { rating: 'desc' } },
        hotels: { where: { status: 'active' }, orderBy: { rating: 'desc' } },
      },
    });

    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    const result = {
      id: destination.id,
      name: destination.name,
      slug: destination.slug,
      country: destination.country,
      region: getRegion(destination.country),
      image: destination.image,
      description: destination.description,
      tagline: destination.tagline,
      featured: destination.featured,
      _count: {
        packages: destination.packages.length,
        hotels: destination.hotels.length,
      },
      packages: destination.packages.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        slug: pkg.slug,
        destinationId: pkg.destinationId,
        destination: {
          name: destination.name,
          country: destination.country,
          region: getRegion(destination.country),
          image: destination.image,
        },
        category: pkg.category,
        duration: pkg.duration,
        nights: pkg.nights,
        days: pkg.days,
        price: pkg.price,
        originalPrice: pkg.originalPrice,
        image: pkg.image,
        description: pkg.description,
        highlights: parseJsonField(pkg.highlights),
        included: parseJsonField(pkg.included),
        itinerary: pkg.itinerary,
        rating: pkg.rating,
        reviewCount: pkg.reviewCount,
        featured: pkg.featured,
      })),
      hotels: destination.hotels.map((hotel) => ({
        id: hotel.id,
        name: hotel.name,
        slug: hotel.slug,
        destinationId: hotel.destinationId,
        destination: {
          name: destination.name,
          country: destination.country,
          region: getRegion(destination.country),
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
      })),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json({ error: 'Failed to fetch destination' }, { status: 500 });
  }
}
