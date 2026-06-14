import { NextResponse } from 'next/server';
import { getEdgePackage, enrichPackage } from '@/lib/edge-data';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const pkg = getEdgePackage(slug);

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const result = enrichPackage(pkg);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}
