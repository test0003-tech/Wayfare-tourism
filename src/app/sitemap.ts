// Dynamic Sitemap Generator for Wayfare Travel
// Replaces the static public/sitemap.xml with auto-generated URLs from edge-data

import { MetadataRoute } from 'next';
import { getAllEdgePackages, getAllEdgeDestinations, getAllEdgeHotels } from '@/lib/edge-data';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const packages = getAllEdgePackages();
  const destinations = getAllEdgeDestinations();
  const hotels = getAllEdgeHotels();
  const now = new Date();
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: formatDate(now),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/packages`,
      lastModified: formatDate(now),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/destinations`,
      lastModified: formatDate(now),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/hotels`,
      lastModified: formatDate(now),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/flights`,
      lastModified: formatDate(now),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: formatDate(now),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: formatDate(now),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: formatDate(now),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: formatDate(now),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/quiz`,
      lastModified: formatDate(now),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Package detail pages — highest priority for booking conversions
  const packagePages: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${SITE_URL}/packages/${pkg.slug}`,
    lastModified: formatDate(now),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Destination detail pages
  const destinationPages: MetadataRoute.Sitemap = destinations.map((dest) => ({
    url: `${SITE_URL}/destinations/${dest.slug}`,
    lastModified: formatDate(now),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Hotel detail pages
  const hotelPages: MetadataRoute.Sitemap = hotels.map((hotel) => ({
    url: `${SITE_URL}/hotels/${hotel.slug}`,
    lastModified: formatDate(now),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...packagePages,
    ...destinationPages,
    ...hotelPages,
  ];
}
