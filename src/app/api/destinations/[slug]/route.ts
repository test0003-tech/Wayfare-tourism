import { NextResponse } from 'next/server';
import {
  getEdgeDestination,
  enrichDestination,
  getAllEdgePackages,
  enrichPackage,
  getAllEdgeHotels,
  enrichHotel,
} from '@/lib/edge-data';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const dest = getEdgeDestination(slug);

    if (!dest) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    const enrichedDest = enrichDestination(dest);

    // Get packages and hotels for this destination
    const allPackages = getAllEdgePackages()
      .filter((p) => p.destination.name === dest.name)
      .map(enrichPackage)
      .sort((a, b) => b.rating - a.rating);

    const allHotels = getAllEdgeHotels()
      .filter((h) => h.destination.name === dest.name)
      .map(enrichHotel)
      .sort((a, b) => b.rating - a.rating);

    const result = {
      ...enrichedDest,
      packages: allPackages,
      hotels: allHotels,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json({ error: 'Failed to fetch destination' }, { status: 500 });
  }
}
