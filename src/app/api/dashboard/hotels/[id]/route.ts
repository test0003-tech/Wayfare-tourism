import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hotel = await db.hotel.findUnique({
      where: { id },
      include: { destination: true },
    });

    if (!hotel) {
      return NextResponse.json(
        { success: false, error: 'Hotel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: hotel });
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hotel' },
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

    const existing = await db.hotel.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Hotel not found' },
        { status: 404 }
      );
    }

    // Check slug uniqueness if changing
    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await db.hotel.findUnique({ where: { slug: body.slug } });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'A hotel with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const hotel = await db.hotel.update({
      where: { id },
      data: body,
      include: { destination: { select: { id: true, name: true, country: true } } },
    });

    return NextResponse.json({ success: true, data: hotel });
  } catch (error) {
    console.error('Error updating hotel:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update hotel' },
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

    const existing = await db.hotel.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Hotel not found' },
        { status: 404 }
      );
    }

    await db.hotel.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete hotel' },
      { status: 500 }
    );
  }
}
