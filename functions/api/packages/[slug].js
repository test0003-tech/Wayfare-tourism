import { data, enrichPackage } from '../../data.js';

export async function onRequestGet(context) {
  try {
    const slug = context.params.slug;
    const rawPkg = data.packages.find(p => p.slug === slug);

    if (!rawPkg) {
      return new Response(JSON.stringify({ error: 'Package not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const pkg = enrichPackage(rawPkg);
    const dest = data.destinations.find(d => d.name === rawPkg.destination.name);
    if (dest) {
      pkg.destination = { ...pkg.destination, slug: dest.slug };
    }

    return new Response(JSON.stringify(pkg), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch package' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
