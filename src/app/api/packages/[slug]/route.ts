export const runtime = 'edge';
import { getEdgePackage, getAllEdgePackages, enrichPackage, getAllEdgeDestinations } from '@/lib/edge-data';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const rawPkg = getEdgePackage(slug);
    if (!rawPkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    const pkg = enrichPackage(rawPkg);
    const dest = getAllEdgeDestinations().find((d) => d.name === rawPkg.destination.name);
    if (dest) {
      pkg.destination = { ...pkg.destination, slug: dest.slug } as typeof pkg.destination & { slug: string };
    }
    return NextResponse.json(pkg);
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}
