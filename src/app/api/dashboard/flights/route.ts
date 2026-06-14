import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const type = searchParams.get('type');

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { from: { contains: search } },
        { to: { contains: search } },
        { airline: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;
    if (type) where.type = type;

    const [data, total] = await Promise.all([
      db.flightDeal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      db.flightDeal.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flights' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, airline, price, originalPrice, type, image, description, featured, status } = body;

    if (!from || !to || !airline || !price || !type || !image || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: from, to, airline, price, type, image, description' },
        { status: 400 }
      );
    }

    const flight = await db.flightDeal.create({
      data: {
        from,
        to,
        airline,
        price,
        originalPrice: originalPrice ?? null,
        type,
        image,
        description,
        featured: featured ?? false,
        status: status ?? 'active',
      },
    });

    return NextResponse.json({ success: true, data: flight }, { status: 201 });
  } catch (error) {
    console.error('Error creating flight:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create flight' },
      { status: 500 }
    );
  }
}
