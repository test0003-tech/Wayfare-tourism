import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number | null;
  packageId: string | null;
  travelers: number;
  adults: number;
  children: number;
  departureDate: string;
  returnDate: string;
  roomType: string;
  specialRequests: string | null;
  addOns: string | null;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory bookings store (edge-compatible — no Prisma)
const bookings: Booking[] = [];

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
    const now = new Date().toISOString();
    const id = `booking-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const booking: Booking = {
      id,
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
      createdAt: now,
      updatedAt: now,
    };

    bookings.push(booking);

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        age: booking.age,
        packageId: booking.packageId,
        travelers: booking.travelers,
        adults: booking.adults,
        children: booking.children,
        departureDate: booking.departureDate,
        returnDate: booking.returnDate,
        roomType: booking.roomType,
        specialRequests: booking.specialRequests,
        addOns: booking.addOns,
        totalPrice: booking.totalPrice,
        status: booking.status,
        createdAt: booking.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Return recent bookings (in-memory, newest first)
    const sorted = [...bookings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const result = sorted.slice(0, 50).map((b) => ({
      id: b.id,
      name: b.name,
      email: b.email,
      phone: b.phone,
      age: b.age,
      packageId: b.packageId,
      travelers: b.travelers,
      adults: b.adults,
      children: b.children,
      departureDate: b.departureDate,
      returnDate: b.returnDate,
      roomType: b.roomType,
      specialRequests: b.specialRequests,
      addOns: b.addOns,
      totalPrice: b.totalPrice,
      status: b.status,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      package: null,
    }));

    return NextResponse.json({ success: true, bookings: result });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
