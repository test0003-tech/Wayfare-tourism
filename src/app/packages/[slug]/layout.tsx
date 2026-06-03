import type { Metadata } from 'next';
import { getEdgePackage } from '@/lib/edge-data';
import { SITE_URL, generateDetailPageMetadata, KEYWORDS, PACKAGE_FAQS } from '@/lib/seo';
import { TravelPackageJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/wayfare/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getEdgePackage(slug);

  if (!pkg) {
    return {
      title: 'Package Not Found',
      description: 'The tour package you are looking for does not exist. Browse our collection of honeymoon, adventure, and family tour packages on Wayfare.',
    };
  }

  const categoryLabel = pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1).replace('-', ' ');

  return generateDetailPageMetadata({
    name: `${pkg.name} — ${pkg.destination.name} ${categoryLabel} Package`,
    description: pkg.description,
    path: `/packages/${slug}`,
    image: pkg.image,
    category: `${categoryLabel} Package`,
    price: pkg.price,
    priceCurrency: 'INR',
    location: `${pkg.destination.name}, ${pkg.destination.country}`,
    rating: 4.5,
    reviewCount: 100,
    keywords: [
      pkg.name,
      `${pkg.destination.name} tour package`,
      `${pkg.destination.name} ${pkg.category} package`,
      `${pkg.category} package ${pkg.destination.country}`,
      `${pkg.duration} ${pkg.category} tour`,
      `₹${pkg.price.toLocaleString()} tour package`,
      `${pkg.destination.name} holiday package`,
      `${pkg.destination.name} travel deal`,
      `book ${pkg.destination.name} package online`,
      `Wayfare ${pkg.destination.name} tour`,
      ...KEYWORDS.categories.filter(k => k.toLowerCase().includes(pkg.category)),
    ],
  });
}

export async function generateStaticParams() {
  const { getAllEdgePackages } = await import('@/lib/edge-data');
  return getAllEdgePackages().map((pkg) => ({ slug: pkg.slug }));
}

export default async function PackageSlugLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = getEdgePackage(slug);

  return (
    <>
      {pkg && (
        <>
          <TravelPackageJsonLd data={{
            name: pkg.name,
            description: pkg.description,
            image: pkg.image,
            price: pkg.price,
            priceCurrency: 'INR',
            destination: `${pkg.destination.name}, ${pkg.destination.country}`,
            duration: pkg.duration,
            rating: 4.5,
            reviewCount: 100,
            url: `${SITE_URL}/packages/${slug}`,
            category: pkg.category,
          }} />
          <FAQJsonLd items={PACKAGE_FAQS} />
          <BreadcrumbJsonLd items={{
            items: [
              { name: 'Home', url: SITE_URL },
              { name: 'Packages', url: `${SITE_URL}/packages` },
              { name: pkg.name, url: `${SITE_URL}/packages/${slug}` },
            ],
          }} />
        </>
      )}
      {children}
    </>
  );
}
