import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const flight = await db.flightDeal.findUnique({ where: { id } });

    if (!flight) {
      return NextResponse.json(
        { success: false, error: 'Flight not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: flight });
  } catch (error) {
    console.error('Error fetching flight:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flight' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.flightDeal.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Flight not found' },
        { status: 404 }
      );
    }

    const flight = await db.flightDeal.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: flight });
  } catch (error) {
    console.error('Error updating flight:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update flight' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.flightDeal.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Flight not found' },
        { status: 404 }
      );
    }

    await db.flightDeal.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Error deleting flight:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete flight' },
      { status: 500 }
    );
  }
}
