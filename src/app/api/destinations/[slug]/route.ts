import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const destination = await db.destination.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { packages: true, hotels: true },
        },
        packages: {
          include: {
            destination: {
              select: { name: true, country: true, region: true, image: true },
            },
          },
          orderBy: { rating: 'desc' },
        },
        hotels: {
          orderBy: { rating: 'desc' },
        },
      },
    });

    if (!destination) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    return NextResponse.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json({ error: 'Failed to fetch destination' }, { status: 500 });
  }
}
