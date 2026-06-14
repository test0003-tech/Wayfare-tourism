import { NextResponse } from 'next/server';
import { getEdgeHotel, enrichHotel } from '@/lib/edge-data';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const hotel = getEdgeHotel(slug);

    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    const result = enrichHotel(hotel);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return NextResponse.json({ error: 'Failed to fetch hotel' }, { status: 500 });
  }
}
