export const runtime = 'edge';

import { NextResponse } from 'next/server';

interface CreateBookingBody {
  name: string;
  email: string;
  phone: string;
  age?: number;
  packageId?: string;
  adults: number;
  children: number;
  departureDate: string;
  returnDate: string;
  roomType: string;
  specialRequests?: string;
  addOns: string[];
  totalPrice: number;
}

// In-memory booking store (for edge runtime)
// In production, replace with a proper database
const bookings: Array<Record<string, unknown>> = [];

export async function POST(request: Request) {
  try {
    const body: CreateBookingBody = await request.json();
    const {
      name,
      email,
      phone,
      age,
      packageId,
      adults,
      children,
      departureDate,
      returnDate,
      roomType,
      specialRequests,
      addOns,
      totalPrice,
    } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name is required (min 2 characters)' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json({ error: 'Valid phone number is required' }, { status: 400 });
    }
    if (!departureDate || !returnDate) {
      return NextResponse.json({ error: 'Departure and return dates are required' }, { status: 400 });
    }
    if (!adults || adults < 1) {
      return NextResponse.json({ error: 'At least 1 adult is required' }, { status: 400 });
    }
    if (!totalPrice || totalPrice <= 0) {
      return NextResponse.json({ error: 'Invalid total price' }, { status: 400 });
    }

    // Validate dates
    const depDate = new Date(departureDate);
    const retDate = new Date(returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (depDate < today) {
      return NextResponse.json({ error: 'Departure date must be in the future' }, { status: 400 });
    }
    if (retDate <= depDate) {
      return NextResponse.json({ error: 'Return date must be after departure date' }, { status: 400 });
    }

    const travelers = adults + children;
    const bookingId = `WF-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const booking = {
      id: bookingId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      age: age || null,
      packageId: packageId || null,
      travelers,
      adults,
      children,
      departureDate,
      returnDate,
      roomType: roomType || 'standard',
      specialRequests: specialRequests?.trim() || null,
      addOns: addOns && addOns.length > 0 ? JSON.stringify(addOns) : null,
      totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    bookings.push(booking);

    return NextResponse.json({
      success: true,
      booking,
    }, { status: 201 });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json({ success: true, bookings: bookings.slice(-50) });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
