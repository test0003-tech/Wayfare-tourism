import { NextResponse } from 'next/server';
import { blogPosts, type BlogPost } from '@/lib/blog-data';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let posts = [...blogPosts];

    // Filter by category
    if (category && category !== 'All') {
      posts = posts.filter((p) => p.category === category);
    }

    // Filter by featured
    if (featured === 'true') {
      posts = posts.filter((p) => p.featured);
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }

    // Format response to match the expected shape (add id field)
    const result = posts.map((p) => ({
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

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
