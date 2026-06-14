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

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }
    if (category) where.category = category;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    const [data, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      db.blogPost.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug, title, excerpt, content, authorName, authorAvatar, authorBio,
      date, category, image, readingTime, tags, featured, status,
    } = body;

    if (!title || !excerpt || !content || !image) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, excerpt, content, image' },
        { status: 400 }
      );
    }

    const finalSlug = slug || slugify(title);

    // Check for slug uniqueness
    const existing = await db.blogPost.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A blog post with this slug already exists' },
        { status: 400 }
      );
    }

    const blogPost = await db.blogPost.create({
      data: {
        slug: finalSlug,
        title,
        excerpt,
        content,
        authorName: authorName ?? 'Wayfare Team',
        authorAvatar: authorAvatar ?? '',
        authorBio: authorBio ?? '',
        date: date ?? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        category: category ?? 'Destinations',
        image,
        readingTime: readingTime ?? '5 min read',
        tags: tags ?? '[]',
        featured: featured ?? false,
        status: status ?? 'active',
      },
    });

    return NextResponse.json({ success: true, data: blogPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
