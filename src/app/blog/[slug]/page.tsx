import { getAllBlogPosts } from '@/lib/blog-data';
import BlogDetailClient from './BlogDetailClient';

export function generateStaticParams() {
  const items = getAllBlogPosts();
  return items.map((item) => ({ slug: item.slug }));
}

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <BlogDetailClient params={params} />;
}
