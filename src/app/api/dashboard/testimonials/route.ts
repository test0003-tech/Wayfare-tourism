import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { trip: { contains: search } },
        { text: { contains: search } },
      ];
    }
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    const [data, total] = await Promise.all([
      db.testimonial.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      db.testimonial.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location, trip, rating, text, avatar, happyNote, verified, featured, status } = body;

    if (!name || !location || !trip || !text || rating === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, location, trip, text, rating' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const testimonial = await db.testimonial.create({
      data: {
        name,
        location,
        trip,
        rating,
        text,
        avatar: avatar ?? '',
        happyNote: happyNote ?? '',
        verified: verified ?? false,
        featured: featured ?? false,
        status: status ?? 'active',
      },
    });

    return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
