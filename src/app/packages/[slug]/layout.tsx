export const runtime = 'edge';
import type { Metadata } from 'next';
import { getEdgePackage } from '@/lib/edge-data';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getEdgePackage(slug);

  if (!pkg) {
    return { title: 'Package Not Found | Wayfare' };
  }

  return {
    title: `${pkg.name} | Wayfare — ${pkg.destination.name} Tour Package`,
    description: `${pkg.description.slice(0, 160)} Book ${pkg.name} starting from ₹${pkg.price.toLocaleString()}/person. ${pkg.duration} ${pkg.category} package to ${pkg.destination.name}, ${pkg.destination.country}.`,
    keywords: [pkg.name, `${pkg.destination.name} tour`, `${pkg.category} package`, pkg.duration, `₹${pkg.price} package`],
    openGraph: {
      title: `${pkg.name} | Wayfare`,
      description: `${pkg.duration} ${pkg.category} package to ${pkg.destination.name} starting from ₹${pkg.price.toLocaleString()}/person.`,
      type: 'website',
      siteName: 'Wayfare',
      images: [{ url: pkg.image, width: 1200, height: 630, alt: pkg.name }],
    },
  };
}

export default function PackageSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
