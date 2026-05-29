import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const featured = searchParams.get('featured');

    const where: Record<string, unknown> = {};

    if (region) {
      where.region = region;
    }
    if (featured === 'true') {
      where.featured = true;
    }

    const destinations = await db.destination.findMany({
      where,
      include: {
        _count: {
          select: { packages: true, hotels: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}
