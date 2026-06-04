import { data, enrichPackage } from '../../data.js';

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const region = url.searchParams.get('region');
    const category = url.searchParams.get('category');
    const destinationId = url.searchParams.get('destinationId');
    const featured = url.searchParams.get('featured');
    const duration = url.searchParams.get('duration');

    let packages = data.packages.map(enrichPackage);

    if (region) packages = packages.filter(p => p.destination.region === region);
    if (category) packages = packages.filter(p => p.category === category);
    if (destinationId) packages = packages.filter(p => p.destinationId === destinationId);
    if (featured === 'true') packages = packages.filter(p => p.featured);
    if (duration) packages = packages.filter(p => p.duration === duration);

    packages.sort((a, b) => b.rating - a.rating);

    return new Response(JSON.stringify(packages), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch packages' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
