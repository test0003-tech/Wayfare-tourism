import type { Metadata } from 'next';
import { generatePageMetadata, SITE_URL } from '@/lib/seo';
import { getAllBlogPosts } from '@/lib/blog-data';
import { BreadcrumbJsonLd } from '@/components/wayfare/JsonLd';

interface BlogDetailLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getAllBlogPosts().find((p) => p.slug === slug);

  if (!post) {
    return generatePageMetadata({
      title: 'Article Not Found — Wayfare Blog',
      description: 'The requested article could not be found.',
      path: '/blog',
      noIndex: true,
    });
  }

  return generatePageMetadata({
    title: `${post.title} — Wayfare Blog`,
    description: post.excerpt,
    keywords: post.tags,
    path: `/blog/${post.slug}`,
    ogImage: post.image,
    ogType: 'article',
    publishedTime: post.date,
  });
}

export default function BlogDetailLayout({ children, params }: BlogDetailLayoutProps) {
  // We can't await params in the layout body in some Next.js versions,
  // but we can still render the breadcrumb JSON-LD via the client component
  return (
    <>
      <BlogDetailBreadcrumbScript params={params} />
      {children}
    </>
  );
}

async function BlogDetailBreadcrumbScript({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getAllBlogPosts().find((p) => p.slug === slug);

  return (
    <BreadcrumbJsonLd
      items={{
        items: [
          { name: 'Home', url: SITE_URL },
          { name: 'Blog', url: `${SITE_URL}/blog` },
          ...(post
            ? [{ name: post.title, url: `${SITE_URL}/blog/${post.slug}` }]
            : []),
        ],
      }}
    />
  );
}
