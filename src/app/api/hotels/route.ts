export const runtime = 'edge';
import { getAllEdgeHotels, enrichHotel } from '@/lib/edge-data';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const category = searchParams.get('category');
    const destinationId = searchParams.get('destinationId');
    const featured = searchParams.get('featured');

    let hotels = getAllEdgeHotels().map(enrichHotel);

    if (region) hotels = hotels.filter((h) => h.destination.region === region);
    if (category) hotels = hotels.filter((h) => h.category === category);
    if (destinationId) hotels = hotels.filter((h) => h.destinationId === destinationId);
    if (featured === 'true') hotels = hotels.filter((h) => h.featured);

    hotels.sort((a, b) => b.rating - a.rating);
    return NextResponse.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
  }
}
