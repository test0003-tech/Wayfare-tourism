export const runtime = 'edge';
import {
  getEdgeDestination,
  enrichDestination,
  getAllEdgePackages,
  getAllEdgeHotels,
  enrichPackage,
  enrichHotel,
} from '@/lib/edge-data';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const rawDest = getEdgeDestination(slug);

    if (!rawDest) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    const destination = enrichDestination(rawDest);

    // Find all packages for this destination
    const packages = getAllEdgePackages()
      .filter((p) => p.destination.name === rawDest.name)
      .map(enrichPackage)
      .sort((a, b) => b.rating - a.rating);

    // Find all hotels for this destination
    const hotels = getAllEdgeHotels()
      .filter((h) => h.destination.name === rawDest.name)
      .map(enrichHotel)
      .sort((a, b) => b.rating - a.rating);

    // Build the full destination detail response
    const destinationDetail = {
      ...destination,
      packages,
      hotels,
    };

    return NextResponse.json(destinationDetail);
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json({ error: 'Failed to fetch destination' }, { status: 500 });
  }
}
