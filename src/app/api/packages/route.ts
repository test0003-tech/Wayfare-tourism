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
    const duration = searchParams.get('duration');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = { status: 'active' };

    if (category) where.category = category;
    if (destinationId) where.destinationId = destinationId;
    if (featured === 'true') where.featured = true;
    if (duration) where.duration = duration;

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

    const packages = await db.package.findMany({
      where,
      include: {
        destination: { select: { name: true, country: true, image: true, slug: true } },
      },
      orderBy: { rating: 'desc' },
    });

    const result = packages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      slug: pkg.slug,
      destinationId: pkg.destinationId,
      destination: {
        name: pkg.destination.name,
        country: pkg.destination.country,
        region: getRegion(pkg.destination.country),
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
      highlights: parseJsonField(pkg.highlights),
      included: parseJsonField(pkg.included),
      itinerary: pkg.itinerary,
      rating: pkg.rating,
      reviewCount: pkg.reviewCount,
      featured: pkg.featured,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}
