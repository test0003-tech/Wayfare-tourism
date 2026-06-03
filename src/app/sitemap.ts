import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';

const BASE_URL = 'https://wayfare.travel';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic data from database
  const [packages, destinations, hotels] = await Promise.all([
    db.package.findMany({ select: { slug: true, updatedAt: true } }),
    db.destination.findMany({ select: { slug: true, updatedAt: true } }),
    db.hotel.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/packages`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/destinations`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/hotels`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/flights`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/quiz`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Dynamic package pages
  const packagePages: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${BASE_URL}/packages/${pkg.slug}`,
    lastModified: pkg.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic destination pages
  const destinationPages: MetadataRoute.Sitemap = destinations.map((dest) => ({
    url: `${BASE_URL}/destinations/${dest.slug}`,
    lastModified: dest.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic hotel pages
  const hotelPages: MetadataRoute.Sitemap = hotels.map((hotel) => ({
    url: `${BASE_URL}/hotels/${hotel.slug}`,
    lastModified: hotel.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...packagePages, ...destinationPages, ...hotelPages];
}
