import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { caption: { contains: search } },
      ];
    }
    if (category) where.category = category;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    const [data, total] = await Promise.all([
      db.galleryImage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      db.galleryImage.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, image, caption, category, featured, status } = body;

    if (!title || !image) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, image' },
        { status: 400 }
      );
    }

    const galleryImage = await db.galleryImage.create({
      data: {
        title,
        image,
        caption: caption ?? '',
        category: category ?? 'general',
        featured: featured ?? false,
        status: status ?? 'active',
      },
    });

    return NextResponse.json({ success: true, data: galleryImage }, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create gallery image' },
      { status: 500 }
    );
  }
}
