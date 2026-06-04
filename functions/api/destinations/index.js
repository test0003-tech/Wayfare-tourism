import { data, enrichDestination } from '../../data.js';

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const region = url.searchParams.get('region');
    const featured = url.searchParams.get('featured');

    let destinations = data.destinations.map(enrichDestination);

    if (region) destinations = destinations.filter(d => d.region === region);
    if (featured === 'true') destinations = destinations.filter(d => d.featured);

    destinations.sort((a, b) => a.name.localeCompare(b.name));

    return new Response(JSON.stringify(destinations), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch destinations' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
