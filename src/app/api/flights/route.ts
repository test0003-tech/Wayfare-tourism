export const runtime = 'edge';
import { getAllEdgeFlights, enrichFlight } from '@/lib/edge-data';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    let flights = getAllEdgeFlights().map(enrichFlight);

    if (featured === 'true') flights = flights.filter((f) => f.featured);
    flights.sort((a, b) => a.price - b.price);
    return NextResponse.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}
