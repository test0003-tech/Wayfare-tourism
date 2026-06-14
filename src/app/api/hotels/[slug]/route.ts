import { NextResponse } from 'next/server';
import { getEdgeHotel, enrichHotel, getEdgeDestination } from '@/lib/edge-data';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const edgeHotel = getEdgeHotel(slug);

    if (!edgeHotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    const hotel = enrichHotel(edgeHotel);

    // Add destination.image and destination.slug for detail view compatibility
    const edgeDest = getEdgeDestination(hotel.destinationId);
    const result = {
      ...hotel,
      destination: {
        ...hotel.destination,
        image: edgeDest?.image || '',
        slug: hotel.destinationId,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return NextResponse.json({ error: 'Failed to fetch hotel' }, { status: 500 });
  }
}
