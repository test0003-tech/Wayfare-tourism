import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

function transformBlogPost(post: any) {
  let tags: string[] = [];
  try {
    const parsed = JSON.parse(post.tags);
    tags = Array.isArray(parsed) ? parsed : [];
  } catch {
    tags = [];
  }

  return {
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
    tags,
    featured: post.featured,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const where: any = { status: 'active' };

    if (category && category !== 'All') where.category = category;
    if (featured === 'true') where.featured = true;

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const posts = await db.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts.map(transformBlogPost));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
