import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function getRegion(country: string): 'domestic' | 'international' {
  return country === 'India' ? 'domestic' : 'international';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = { status: 'active' };

    if (featured === 'true') where.featured = true;

    if (region) {
      where.country = region === 'domestic' ? 'India' : { not: 'India' };
    }

    if (search) {
      const q = search.toLowerCase();
      where.OR = [
        { name: { contains: q } },
        { country: { contains: q } },
        { description: { contains: q } },
      ];
    }

    const destinations = await db.destination.findMany({
      where,
      include: {
        _count: { select: { packages: true, hotels: true } },
      },
      orderBy: { name: 'asc' },
    });

    const result = destinations.map((dest) => ({
      id: dest.id,
      name: dest.name,
      slug: dest.slug,
      country: dest.country,
      region: getRegion(dest.country),
      image: dest.image,
      description: dest.description,
      tagline: dest.tagline,
      featured: dest.featured,
      _count: {
        packages: dest._count.packages,
        hotels: dest._count.hotels,
      },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}
