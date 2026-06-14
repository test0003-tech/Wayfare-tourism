import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = { status: 'active' };

    if (featured === 'true') where.featured = true;
    if (type) where.type = type;

    if (search) {
      const q = search.toLowerCase();
      where.OR = [
        { from: { contains: q } },
        { to: { contains: q } },
        { airline: { contains: q } },
      ];
    }

    const flights = await db.flightDeal.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    const result = flights.map((flight) => ({
      id: flight.id,
      from: flight.from,
      to: flight.to,
      airline: flight.airline,
      price: flight.price,
      originalPrice: flight.originalPrice,
      type: flight.type,
      image: flight.image,
      description: flight.description,
      featured: flight.featured,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}
