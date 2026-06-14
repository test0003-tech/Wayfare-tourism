import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function parseJsonTags(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const where: Record<string, unknown> = { status: 'active' };

    if (category && category !== 'All') where.category = category;
    if (featured === 'true') where.featured = true;

    if (search) {
      const q = search.toLowerCase();
      where.OR = [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
      ];
    }

    const posts = await db.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const result = posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: {
        name: post.authorName,
        avatar: post.authorAvatar,
        bio: post.authorBio,
      },
      date: post.date,
      category: post.category,
      image: post.image,
      readingTime: post.readingTime,
      tags: parseJsonTags(post.tags),
      featured: post.featured,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
