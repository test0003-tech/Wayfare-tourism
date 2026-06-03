export const runtime = 'edge';
import { getEdgeHotel, enrichHotel, getAllEdgeDestinations } from '@/lib/edge-data';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const rawHotel = getEdgeHotel(slug);

    if (!rawHotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    const hotel = enrichHotel(rawHotel);

    // Also include destination image and slug for the frontend
    const dest = getAllEdgeDestinations().find(
      (d) => d.name === rawHotel.destination.name
    );
    if (dest) {
      hotel.destination = {
        ...hotel.destination,
        image: dest.image,
        slug: dest.slug,
      } as typeof hotel.destination & { image: string; slug: string };
    }

    return NextResponse.json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return NextResponse.json({ error: 'Failed to fetch hotel' }, { status: 500 });
  }
}
