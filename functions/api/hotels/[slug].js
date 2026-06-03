import { data, enrichHotel } from '../../data.js';

export async function onRequestGet(context) {
  try {
    const slug = context.params.slug;
    const rawHotel = data.hotels.find(h => h.slug === slug);

    if (!rawHotel) {
      return new Response(JSON.stringify({ error: 'Hotel not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const hotel = enrichHotel(rawHotel);
    const dest = data.destinations.find(d => d.name === rawHotel.destination.name);
    if (dest) {
      hotel.destination = { ...hotel.destination, image: dest.image, slug: dest.slug };
    }

    return new Response(JSON.stringify(hotel), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch hotel' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
