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
        { description: { contains: search } },
      ];
    }
    if (category) where.category = category;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    const [data, total] = await Promise.all([
      db.video.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      db.video.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, thumbnail, description, category, featured, status } = body;

    if (!title || !url) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, url' },
        { status: 400 }
      );
    }

    const video = await db.video.create({
      data: {
        title,
        url,
        thumbnail: thumbnail ?? '',
        description: description ?? '',
        category: category ?? 'general',
        featured: featured ?? false,
        status: status ?? 'active',
      },
    });

    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create video' },
      { status: 500 }
    );
  }
}
