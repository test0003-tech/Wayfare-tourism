import type { Metadata } from 'next';
import { getEdgeDestination } from '@/lib/edge-data';
import { generateDetailPageMetadata, KEYWORDS, SITE_URL, DESTINATION_FAQS } from '@/lib/seo';
import { DestinationJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/wayfare/JsonLd';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = getEdgeDestination(slug);

  if (!destination) {
    return {
      title: 'Destination Not Found',
      description: 'The destination you are looking for does not exist. Explore our collection of 50+ domestic and international travel destinations on Wayfare.',
    };
  }

  const regionLabel = destination.country === 'India' ? 'Domestic' : 'International';

  return generateDetailPageMetadata({
    name: `${destination.name} Travel Guide — ${destination.tagline}`,
    description: destination.description,
    path: `/destinations/${slug}`,
    image: destination.image,
    category: `${regionLabel} Destination`,
    location: `${destination.name}, ${destination.country}`,
    keywords: [
      destination.name,
      `${destination.name} travel guide`,
      `${destination.name} tour`,
      `${destination.name} holiday`,
      `${destination.name} packages`,
      `${destination.country} travel`,
      `visit ${destination.name}`,
      `${destination.name} tourism`,
      `${destination.name} things to do`,
      `${destination.name} best time to visit`,
      `${destination.name} hotels`,
      `Wayfare ${destination.name}`,
      `${regionLabel.toLowerCase()} destination ${destination.name}`,
      ...KEYWORDS.domestic.filter(k => k.toLowerCase().includes(destination.name.toLowerCase())),
      ...KEYWORDS.international.filter(k => k.toLowerCase().includes(destination.name.toLowerCase())),
    ],
    ...(true && {
      robots: { index: true, follow: true },
    }),
  });
}

export async function generateStaticParams() {
  const { getAllEdgeDestinations } = await import('@/lib/edge-data');
  return getAllEdgeDestinations().map((dest) => ({ slug: dest.slug }));
}

export default async function DestinationSlugLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = getEdgeDestination(slug);

  return (
    <>
      {destination && (
        <>
          <DestinationJsonLd data={{
            name: destination.name,
            description: destination.description,
            image: destination.image,
            url: `${SITE_URL}/destinations/${slug}`,
            country: destination.country,
            tagline: destination.tagline,
            region: destination.country === 'India' ? 'domestic' : 'international',
          }} />
          <FAQJsonLd items={DESTINATION_FAQS} />
          <BreadcrumbJsonLd items={{
            items: [
              { name: 'Home', url: SITE_URL },
              { name: 'Destinations', url: `${SITE_URL}/destinations` },
              { name: destination.name, url: `${SITE_URL}/destinations/${slug}` },
            ],
          }} />
        </>
      )}
      {children}
    </>
  );
}
