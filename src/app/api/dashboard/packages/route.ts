import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseDuration(duration: string): { nights: number; days: number } {
  const match = duration.match(/(\d+)N\s*(\d+)D/i);
  if (match) {
    return { nights: parseInt(match[1], 10), days: parseInt(match[2], 10) };
  }
  return { nights: 0, days: 0 };
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
      db.package.findMany({
        where,
        include: { destination: { select: { id: true, name: true, country: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      db.package.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, slug, destinationId, category, duration, price, image, description,
      originalPrice, gallery, highlights, included, itinerary, rating, reviewCount,
      featured, status,
    } = body;

    if (!name || !destinationId || !category || !duration || !price || !image || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, destinationId, category, duration, price, image, description' },
        { status: 400 }
      );
    }

    const finalSlug = slug || slugify(name);

    // Check for slug uniqueness
    const existing = await db.package.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A package with this slug already exists' },
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

    const { nights, days } = parseDuration(duration);

    const pkg = await db.package.create({
      data: {
        name,
        slug: finalSlug,
        destinationId,
        category,
        duration,
        nights,
        days,
        price,
        originalPrice: originalPrice ?? null,
        image,
        description,
        gallery: gallery ?? '[]',
        highlights: highlights ?? '[]',
        included: included ?? '[]',
        itinerary: itinerary ?? '[]',
        rating: rating ?? 4.5,
        reviewCount: reviewCount ?? 0,
        featured: featured ?? false,
        status: status ?? 'active',
      },
      include: { destination: { select: { id: true, name: true, country: true } } },
    });

    return NextResponse.json({ success: true, data: pkg }, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create package' },
      { status: 500 }
    );
  }
}
