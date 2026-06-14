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

    const pkg = await db.package.findUnique({
      where: { slug, status: 'active' },
      include: {
        destination: { select: { name: true, country: true, image: true, slug: true } },
      },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const result = {
      id: pkg.id,
      name: pkg.name,
      slug: pkg.slug,
      destinationId: pkg.destinationId,
      destination: {
        name: pkg.destination.name,
        country: pkg.destination.country,
        region: getRegion(pkg.destination.country),
        image: pkg.destination.image,
        slug: pkg.destination.slug,
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
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}
