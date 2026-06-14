import { NextResponse } from 'next/server';
import { getAllEdgeHotels, enrichHotel } from '@/lib/edge-data';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const category = searchParams.get('category');
    const destinationId = searchParams.get('destinationId');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    let hotels = getAllEdgeHotels().map(enrichHotel);

    // Filter by region
    if (region) {
      hotels = hotels.filter((h) =>
        region === 'domestic' ? h.destination.region === 'domestic' : h.destination.region === 'international'
      );
    }

    // Filter by category
    if (category) {
      hotels = hotels.filter((h) => h.category === category);
    }

    // Filter by destinationId (slug)
    if (destinationId) {
      hotels = hotels.filter((h) => h.destinationId === destinationId);
    }

    // Filter by featured
    if (featured === 'true') {
      hotels = hotels.filter((h) => h.featured);
    }

    // Search by name or description
    if (search) {
      const q = search.toLowerCase();
      hotels = hotels.filter(
        (h) => h.name.toLowerCase().includes(q) || h.description.toLowerCase().includes(q)
      );
    }

    // Sort by rating descending
    hotels.sort((a, b) => b.rating - a.rating);

    return NextResponse.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
  }
}
