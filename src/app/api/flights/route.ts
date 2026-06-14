import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const where: any = { status: 'active' };

    if (featured === 'true') where.featured = true;
    if (type) where.type = type;

    if (search) {
      where.OR = [
        { from: { contains: search } },
        { to: { contains: search } },
        { airline: { contains: search } },
      ];
    }

    const flights = await db.flightDeal.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    const result = flights.map((f) => ({
      id: f.id,
      from: f.from,
      to: f.to,
      airline: f.airline,
      price: f.price,
      originalPrice: f.originalPrice,
      type: f.type,
      image: f.image,
      description: f.description,
      featured: f.featured,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}
