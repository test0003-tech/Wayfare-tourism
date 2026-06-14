import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

function transformPackage(pkg: any) {
  let highlights = '';
  try {
    const parsed = JSON.parse(pkg.highlights);
    highlights = Array.isArray(parsed) ? parsed.join(',') : pkg.highlights;
  } catch {
    highlights = pkg.highlights;
  }

  let included = '';
  try {
    const parsed = JSON.parse(pkg.included);
    included = Array.isArray(parsed) ? parsed.join(',') : pkg.included;
  } catch {
    included = pkg.included;
  }

  let itinerary = '[]';
  try {
    const parsed = JSON.parse(pkg.itinerary);
    if (Array.isArray(parsed)) {
      itinerary = JSON.stringify(
        parsed.map((d: any) => ({
          day: d.day,
          title: d.title,
          desc: d.desc || d.description || '',
        }))
      );
    }
  } catch {
    itinerary = pkg.itinerary;
  }

  return {
    id: pkg.id,
    name: pkg.name,
    slug: pkg.slug,
    destinationId: pkg.destinationId,
    destination: {
      name: pkg.destination.name,
      country: pkg.destination.country,
      region: pkg.destination.region,
      image: pkg.destination.image,
      slug: pkg.destination.slug,
    },
    category: pkg.category,
    duration: pkg.duration,
    nights: pkg.nights,
    days: pkg.days,
    price: pkg.price,
    originalPrice: pkg.originalPrice,
    image: pkg.image,
    description: pkg.description,
    highlights,
    included,
    itinerary,
    rating: pkg.rating,
    reviewCount: pkg.reviewCount,
    featured: pkg.featured,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const pkg = await db.package.findUnique({
      where: { slug },
      include: { destination: true },
    });

    if (!pkg || pkg.status !== 'active') {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json(transformPackage(pkg));
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 });
  }
}
