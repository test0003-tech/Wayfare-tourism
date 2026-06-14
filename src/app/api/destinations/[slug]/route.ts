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
    const edgeDest = getEdgeDestination(slug);

    if (!edgeDest) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    const destination = enrichDestination(edgeDest);

    // Get packages and hotels for this destination
    const allPackages = getAllEdgePackages().map(enrichPackage);
    const allHotels = getAllEdgeHotels().map(enrichHotel);

    const destPackages = allPackages.filter(
      (p) => p.destination.name === edgeDest.name
    );

    const destHotels = allHotels.filter(
      (h) => h.destination.name === edgeDest.name
    );

    const result = {
      ...destination,
      packages: destPackages,
      hotels: destHotels,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json({ error: 'Failed to fetch destination' }, { status: 500 });
  }
}
