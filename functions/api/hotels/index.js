import { data, enrichHotel } from '../../data.js';

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const region = url.searchParams.get('region');
    const category = url.searchParams.get('category');
    const destinationId = url.searchParams.get('destinationId');
    const featured = url.searchParams.get('featured');

    let hotels = data.hotels.map(enrichHotel);

    if (region) hotels = hotels.filter(h => h.destination.region === region);
    if (category) hotels = hotels.filter(h => h.category === category);
    if (destinationId) hotels = hotels.filter(h => h.destinationId === destinationId);
    if (featured === 'true') hotels = hotels.filter(h => h.featured);

    hotels.sort((a, b) => b.rating - a.rating);

    return new Response(JSON.stringify(hotels), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch hotels' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
