import { NextResponse } from 'next/server';
import { blogPosts, type BlogPost } from '@/lib/blog-data';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Get related posts (same category, different slug)
    const relatedPosts: BlogPost[] = blogPosts
      .filter((p) => p.category === post.category && p.slug !== slug)
      .slice(0, 3);

    const result = {
      ...post,
      relatedPosts,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
