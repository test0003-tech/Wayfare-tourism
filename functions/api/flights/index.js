import { data, enrichFlight } from '../../data.js';

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const featured = url.searchParams.get('featured');

    let flights = data.flights.map(enrichFlight);

    if (featured === 'true') flights = flights.filter(f => f.featured);
    flights.sort((a, b) => a.price - b.price);

    return new Response(JSON.stringify(flights), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch flights' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
