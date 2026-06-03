export const runtime = 'edge';
import { getAllEdgeDestinations, enrichDestination } from '@/lib/edge-data';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const featured = searchParams.get('featured');

    let destinations = getAllEdgeDestinations().map(enrichDestination);

    if (region) destinations = destinations.filter((d) => d.region === region);
    if (featured === 'true') destinations = destinations.filter((d) => d.featured);

    destinations.sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}
