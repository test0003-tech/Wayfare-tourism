import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

function transformPackage(pkg: any) {
  let highlights = '';
  try {
    const parsed = JSON.parse(pkg.highlights);
    highlights = Array.isArray(parsed) ? parsed.join(',') : pkg.highlights;
  } catch {
    highlights = pkg.highlights;
  }

  let included = '';
  try {
    const parsed = JSON.parse(pkg.included);
    included = Array.isArray(parsed) ? parsed.join(',') : pkg.included;
  } catch {
    included = pkg.included;
  }

  let itinerary = '[]';
  try {
    const parsed = JSON.parse(pkg.itinerary);
    if (Array.isArray(parsed)) {
      itinerary = JSON.stringify(
        parsed.map((d: any) => ({
          day: d.day,
          title: d.title,
          desc: d.desc || d.description || '',
        }))
      );
    }
  } catch {
    itinerary = pkg.itinerary;
  }

  return {
    id: pkg.id,
    name: pkg.name,
    slug: pkg.slug,
    destinationId: pkg.destinationId,
    destination: {
      name: pkg.destination.name,
      country: pkg.destination.country,
      region: pkg.destination.region,
      image: pkg.destination.image,
    },
    category: pkg.category,
    duration: pkg.duration,
    nights: pkg.nights,
    days: pkg.days,
    price: pkg.price,
    originalPrice: pkg.originalPrice,
    image: pkg.image,
    description: pkg.description,
    highlights,
    included,
    itinerary,
    rating: pkg.rating,
    reviewCount: pkg.reviewCount,
    featured: pkg.featured,
  };
}

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const destination = await db.destination.findUnique({
      where: { slug },
      include: {
        _count: { select: { packages: true, hotels: true } },
      },
    });

    if (!destination || destination.status !== 'active') {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    const packages = await db.package.findMany({
      where: { destinationId: destination.id, status: 'active' },
      include: { destination: true },
      orderBy: { rating: 'desc' },
    });

    const hotels = await db.hotel.findMany({
      where: { destinationId: destination.id, status: 'active' },
      include: { destination: true },
      orderBy: { rating: 'desc' },
    });

    const result = {
      id: destination.id,
      name: destination.name,
      slug: destination.slug,
      country: destination.country,
      region: destination.region,
      image: destination.image,
      description: destination.description,
      tagline: destination.tagline,
      featured: destination.featured,
      _count: {
        packages: destination._count.packages,
        hotels: destination._count.hotels,
      },
      packages: packages.map(transformPackage),
      hotels: hotels.map(transformHotel),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json({ error: 'Failed to fetch destination' }, { status: 500 });
  }
}
