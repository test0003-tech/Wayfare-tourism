import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const galleryImage = await db.galleryImage.findUnique({ where: { id } });

    if (!galleryImage) {
      return NextResponse.json(
        { success: false, error: 'Gallery image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: galleryImage });
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery image' },
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

    const existing = await db.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Gallery image not found' },
        { status: 404 }
      );
    }

    const galleryImage = await db.galleryImage.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: galleryImage });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update gallery image' },
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

    const existing = await db.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Gallery image not found' },
        { status: 404 }
      );
    }

    await db.galleryImage.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete gallery image' },
      { status: 500 }
    );
  }
}
