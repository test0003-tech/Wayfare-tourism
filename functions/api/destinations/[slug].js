import { data, enrichDestination, enrichPackage, enrichHotel } from '../../data.js';

export async function onRequestGet(context) {
  try {
    const slug = context.params.slug;
    const rawDest = data.destinations.find(d => d.slug === slug);

    if (!rawDest) {
      return new Response(JSON.stringify({ error: 'Destination not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const destination = enrichDestination(rawDest);
    const packages = data.packages
      .filter(p => p.destination.name === rawDest.name)
      .map(enrichPackage)
      .sort((a, b) => b.rating - a.rating);
    const hotels = data.hotels
      .filter(h => h.destination.name === rawDest.name)
      .map(enrichHotel)
      .sort((a, b) => b.rating - a.rating);

    const destinationDetail = { ...destination, packages, hotels };

    return new Response(JSON.stringify(destinationDetail), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch destination' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
