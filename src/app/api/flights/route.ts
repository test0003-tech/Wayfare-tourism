import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    const where: Record<string, unknown> = {};

    if (featured === 'true') {
      where.featured = true;
    }

    const flights = await db.flightDeal.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    return NextResponse.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}
