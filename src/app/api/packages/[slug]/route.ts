import { NextResponse } from 'next/server';
import { getEdgePackage, enrichPackage, getEdgeDestination } from '@/lib/edge-data';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const edgePkg = getEdgePackage(slug);

    if (!edgePkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const pkg = enrichPackage(edgePkg);

    // Add destination.slug for detail view compatibility
    const destSlug = pkg.destinationId;
    const result = {
      ...pkg,
      destination: {
        ...pkg.destination,
        slug: destSlug,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}
