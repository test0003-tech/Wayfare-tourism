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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await db.blogPost.findUnique({
      where: { slug, status: 'active' },
    });

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Get related posts (same category, different slug)
    const relatedPostsRaw = await db.blogPost.findMany({
      where: {
        category: post.category,
        slug: { not: slug },
        status: 'active',
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
    });

    const relatedPosts = relatedPostsRaw.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      author: {
        name: p.authorName,
        avatar: p.authorAvatar,
        bio: p.authorBio,
      },
      date: p.date,
      category: p.category,
      image: p.image,
      readingTime: p.readingTime,
      tags: parseJsonTags(p.tags),
      featured: p.featured,
    }));

    const result = {
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
      relatedPosts,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
