import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { slug: { contains: search } },
      ];
    }

    const posts = await db.blogPost.findMany({ where, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const post = await db.blogPost.create({
      data: {
        title: body.title || '',
        slug: body.slug || body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '',
        excerpt: body.excerpt || '',
        content: body.content || '',
        authorName: body.authorName || 'Wayfare Team',
        authorAvatar: body.authorAvatar || '',
        authorBio: body.authorBio || '',
        date: body.date || new Date().toISOString().split('T')[0],
        category: body.category || 'Destinations',
        image: body.image || '',
        readingTime: body.readingTime || '5 min read',
        tags: body.tags || '[]',
        featured: body.featured || false,
        status: body.status || 'draft',
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
