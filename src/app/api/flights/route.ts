import { NextResponse } from 'next/server';
import { getAllEdgeFlights, enrichFlight } from '@/lib/edge-data';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let flights = getAllEdgeFlights().map(enrichFlight);

    // Filter by featured
    if (featured === 'true') {
      flights = flights.filter((f) => f.featured);
    }

    // Filter by type
    if (type) {
      flights = flights.filter((f) => f.type === type);
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      flights = flights.filter(
        (f) =>
          f.from.toLowerCase().includes(q) ||
          f.to.toLowerCase().includes(q) ||
          f.airline.toLowerCase().includes(q)
      );
    }

    // Sort by price ascending
    flights.sort((a, b) => a.price - b.price);

    return NextResponse.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}
