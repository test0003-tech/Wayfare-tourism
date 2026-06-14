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
    const relatedPosts = blogPosts
      .filter((p) => p.category === post.category && p.slug !== slug)
      .slice(0, 3)
      .map((p) => ({
        id: p.slug,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        author: p.author,
        date: p.date,
        category: p.category,
        image: p.image,
        readingTime: p.readingTime,
        tags: p.tags,
        featured: p.featured,
      }));

    const result = {
      id: post.slug,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      date: post.date,
      category: post.category,
      image: post.image,
      readingTime: post.readingTime,
      tags: post.tags,
      featured: post.featured,
      relatedPosts,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
