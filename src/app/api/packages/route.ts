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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const category = searchParams.get('category');
    const destinationId = searchParams.get('destinationId');
    const featured = searchParams.get('featured');
    const duration = searchParams.get('duration');
    const search = searchParams.get('search');

    const where: any = { status: 'active' };

    if (category) where.category = category;
    if (destinationId) where.destinationId = destinationId;
    if (featured === 'true') where.featured = true;
    if (duration) where.duration = duration;

    if (region) {
      where.destination = { region };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const packages = await db.package.findMany({
      where,
      include: { destination: true },
      orderBy: { rating: 'desc' },
    });

    return NextResponse.json(packages.map(transformPackage));
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}
