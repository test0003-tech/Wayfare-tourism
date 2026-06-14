import { NextResponse } from 'next/server';
import { blogPosts, type BlogPost } from '@/lib/blog-data';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let posts: BlogPost[] = [...blogPosts];

    // Filter by category
    if (category && category !== 'All') {
      posts = posts.filter((p) => p.category === category);
    }

    // Filter by featured
    if (featured === 'true') {
      posts = posts.filter((p) => p.featured);
    }

    // Search by title, excerpt, or content
    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
