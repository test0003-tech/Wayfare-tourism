import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const destinationId = searchParams.get('destinationId');

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (category) where.category = category;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;
    if (destinationId) where.destinationId = destinationId;

    const [data, total] = await Promise.all([
      db.hotel.findMany({
        where,
        include: { destination: { select: { id: true, name: true, country: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      db.hotel.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, slug, destinationId, category, stars, pricePerNight, image, description,
      originalPrice, gallery, amenities, rating, reviewCount, featured, status,
    } = body;

    if (!name || !destinationId || !category || stars === undefined || !pricePerNight || !image || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, destinationId, category, stars, pricePerNight, image, description' },
        { status: 400 }
      );
    }

    const finalSlug = slug || slugify(name);

    // Check for slug uniqueness
    const existing = await db.hotel.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A hotel with this slug already exists' },
        { status: 400 }
      );
    }

    // Verify destination exists
    const destExists = await db.destination.findUnique({ where: { id: destinationId } });
    if (!destExists) {
      return NextResponse.json(
        { success: false, error: 'Destination not found' },
        { status: 400 }
      );
    }

    const hotel = await db.hotel.create({
      data: {
        name,
        slug: finalSlug,
        destinationId,
        category,
        stars,
        pricePerNight,
        originalPrice: originalPrice ?? null,
        image,
        gallery: gallery ?? '[]',
        description,
        amenities: amenities ?? '[]',
        rating: rating ?? 4.0,
        reviewCount: reviewCount ?? 0,
        featured: featured ?? false,
        status: status ?? 'active',
      },
      include: { destination: { select: { id: true, name: true, country: true } } },
    });

    return NextResponse.json({ success: true, data: hotel }, { status: 201 });
  } catch (error) {
    console.error('Error creating hotel:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create hotel' },
      { status: 500 }
    );
  }
}
