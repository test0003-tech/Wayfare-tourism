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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await db.blogPost.findUnique({
      where: { slug },
    });

    if (!post || post.status !== 'active') {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Get related posts (same category, different slug)
    const relatedPostsRaw = await db.blogPost.findMany({
      where: {
        category: post.category,
        status: 'active',
        slug: { not: slug },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    const result = {
      ...transformBlogPost(post),
      relatedPosts: relatedPostsRaw.map(transformBlogPost),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
