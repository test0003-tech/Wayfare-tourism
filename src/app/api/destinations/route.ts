import { NextResponse } from 'next/server';
import { getAllEdgeDestinations, enrichDestination } from '@/lib/edge-data';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    let destinations = getAllEdgeDestinations().map(enrichDestination);

    // Filter by region
    if (region) {
      destinations = destinations.filter((d) =>
        region === 'domestic' ? d.region === 'domestic' : d.region === 'international'
      );
    }

    // Filter by featured
    if (featured === 'true') {
      destinations = destinations.filter((d) => d.featured);
    }

    // Search by name, country, or description
    if (search) {
      const q = search.toLowerCase();
      destinations = destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      );
    }

    // Sort by name ascending
    destinations.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}
