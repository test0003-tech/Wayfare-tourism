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
    const region = searchParams.get('region');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { country: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (region) where.region = region;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    const [data, total] = await Promise.all([
      db.destination.findMany({
        where,
        include: {
          _count: { select: { packages: true, hotels: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.destination.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, country, region, image, description, tagline, featured, status } = body;

    if (!name || !country || !region || !image || !description || !tagline) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, country, region, image, description, tagline' },
        { status: 400 }
      );
    }

    const finalSlug = slug || slugify(name);

    // Check for slug uniqueness
    const existing = await db.destination.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A destination with this slug already exists' },
        { status: 400 }
      );
    }

    const destination = await db.destination.create({
      data: {
        name,
        slug: finalSlug,
        country,
        region,
        image,
        description,
        tagline,
        featured: featured ?? false,
        status: status ?? 'active',
      },
    });

    return NextResponse.json({ success: true, data: destination }, { status: 201 });
  } catch (error) {
    console.error('Error creating destination:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create destination' },
      { status: 500 }
    );
  }
}
