import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const rating = searchParams.get('rating');

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { title: { contains: search } },
        { text: { contains: search } },
      ];
    }
    if (status) where.status = status;
    if (category) where.category = category;
    if (rating) where.rating = parseInt(rating, 10);

    const [data, total] = await Promise.all([
      db.review.findMany({
        where,
        include: {
          package: { select: { id: true, name: true } },
          hotel: { select: { id: true, name: true } },
          destination: { select: { id: true, name: true, country: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.review.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, avatar, location, rating, title, text, date, verified, category,
      photos, status, packageId, hotelId, destinationId,
    } = body;

    if (!name || !text || rating === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, text, rating' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const review = await db.review.create({
      data: {
        name,
        avatar: avatar ?? '',
        location: location ?? '',
        rating,
        title: title ?? '',
        text,
        date: date ?? new Date().toLocaleDateString(),
        verified: verified ?? false,
        category: category ?? '',
        photos: photos ?? 0,
        status: status ?? 'active',
        packageId: packageId ?? null,
        hotelId: hotelId ?? null,
        destinationId: destinationId ?? null,
      },
      include: {
        package: { select: { id: true, name: true } },
        hotel: { select: { id: true, name: true } },
        destination: { select: { id: true, name: true, country: true } },
      },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
