import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const destinationId = searchParams.get('destinationId');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    const where: Record<string, unknown> = {};

    if (destinationId) {
      where.destinationId = destinationId;
    }
    if (category) {
      where.category = category;
    }
    if (featured === 'true') {
      where.featured = true;
    }

    const hotels = await db.hotel.findMany({
      where,
      include: {
        destination: {
          select: {
            name: true,
            country: true,
            region: true,
          },
        },
      },
      orderBy: { rating: 'desc' },
    });

    return NextResponse.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
  }
}
