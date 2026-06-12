export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getBlogPostBySlug, getRelatedPosts } from '@/lib/blog-data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const relatedPosts = getRelatedPosts(slug, 3);

    return NextResponse.json({ ...post, relatedPosts });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
