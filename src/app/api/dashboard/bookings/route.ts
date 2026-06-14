import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      db.booking.findMany({
        where,
        include: {
          package: { select: { id: true, name: true, slug: true, duration: true, price: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.booking.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, email, phone, age, packageId, travelers, adults, children,
      departureDate, returnDate, roomType, specialRequests, addOns, totalPrice, status,
    } = body;

    if (!name || !email || !phone || !departureDate || !returnDate || totalPrice === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, email, phone, departureDate, returnDate, totalPrice' },
        { status: 400 }
      );
    }

    const booking = await db.booking.create({
      data: {
        name,
        email,
        phone,
        age: age ?? null,
        packageId: packageId ?? null,
        travelers: travelers ?? 1,
        adults: adults ?? 1,
        children: children ?? 0,
        departureDate,
        returnDate,
        roomType: roomType ?? 'standard',
        specialRequests: specialRequests ?? null,
        addOns: addOns ?? null,
        totalPrice,
        status: status ?? 'pending',
      },
      include: {
        package: { select: { id: true, name: true, slug: true, duration: true, price: true } },
      },
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
