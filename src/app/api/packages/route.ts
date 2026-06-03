export const runtime = 'edge';
import { getAllEdgePackages, enrichPackage } from '@/lib/edge-data';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const category = searchParams.get('category');
    const destinationId = searchParams.get('destinationId');
    const featured = searchParams.get('featured');
    const duration = searchParams.get('duration');

    let packages = getAllEdgePackages().map(enrichPackage);

    if (region) packages = packages.filter((p) => p.destination.region === region);
    if (category) packages = packages.filter((p) => p.category === category);
    if (destinationId) packages = packages.filter((p) => p.destinationId === destinationId);
    if (featured === 'true') packages = packages.filter((p) => p.featured);
    if (duration) packages = packages.filter((p) => p.duration === duration);

    packages.sort((a, b) => b.rating - a.rating);
    return NextResponse.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}
