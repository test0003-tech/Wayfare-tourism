import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const category = searchParams.get('category');
    const destinationId = searchParams.get('destinationId');
    const featured = searchParams.get('featured');
    const duration = searchParams.get('duration');

    const where: Record<string, unknown> = {};

    if (region) {
      where.destination = { region };
    }
    if (category) {
      where.category = category;
    }
    if (destinationId) {
      where.destinationId = destinationId;
    }
    if (featured === 'true') {
      where.featured = true;
    }
    if (duration) {
      where.duration = duration;
    }

    const packages = await db.package.findMany({
      where,
      include: {
        destination: {
          select: {
            name: true,
            country: true,
            region: true,
            image: true,
          },
        },
      },
      orderBy: { rating: 'desc' },
    });

    return NextResponse.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}
