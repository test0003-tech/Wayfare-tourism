import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const where: any = { status: 'active' };

    if (region) where.region = region;
    if (featured === 'true') where.featured = true;

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { country: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const destinations = await db.destination.findMany({
      where,
      include: {
        _count: { select: { packages: true, hotels: true } },
      },
      orderBy: { name: 'asc' },
    });

    const result = destinations.map((d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      country: d.country,
      region: d.region,
      image: d.image,
      description: d.description,
      tagline: d.tagline,
      featured: d.featured,
      _count: {
        packages: d._count.packages,
        hotels: d._count.hotels,
      },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}
