export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getAllBlogPosts, getFeaturedPosts, getPostsByCategory, searchPosts } from '@/lib/blog-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let posts;

    if (featured === 'true') {
      posts = getFeaturedPosts();
    } else if (search) {
      posts = searchPosts(search);
    } else if (category && category !== 'All') {
      posts = getPostsByCategory(category);
    } else {
      posts = getAllBlogPosts();
    }

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
