import { NextResponse } from 'next/server';
import { getAllEdgePackages, enrichPackage } from '@/lib/edge-data';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const category = searchParams.get('category');
    const destinationId = searchParams.get('destinationId');
    const featured = searchParams.get('featured');
    const duration = searchParams.get('duration');
    const search = searchParams.get('search');

    let packages = getAllEdgePackages().map(enrichPackage);

    // Filter by region
    if (region) {
      packages = packages.filter((p) =>
        region === 'domestic' ? p.destination.region === 'domestic' : p.destination.region === 'international'
      );
    }

    // Filter by category
    if (category) {
      packages = packages.filter((p) => p.category === category);
    }

    // Filter by destinationId (slug)
    if (destinationId) {
      packages = packages.filter((p) => p.destinationId === destinationId);
    }

    // Filter by featured
    if (featured === 'true') {
      packages = packages.filter((p) => p.featured);
    }

    // Filter by duration
    if (duration) {
      packages = packages.filter((p) => p.duration === duration);
    }

    // Search by name or description
    if (search) {
      const q = search.toLowerCase();
      packages = packages.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Sort by rating descending
    packages.sort((a, b) => b.rating - a.rating);

    return NextResponse.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}
