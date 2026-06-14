// Script to generate edge-data.json and functions/data.js from the database
// This is the "Deploy" mechanism that syncs database content to Cloudflare-compatible static data

import { PrismaClient } from '../node_modules/@prisma/client';
import { writeFileSync } from 'fs';
import { join } from 'path';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:/home/z/my-project/db/custom.db';
}

const db = new PrismaClient();
const PROJECT_ROOT = '/home/z/my-project';

async function main() {
  console.log('🔄 Generating edge data from database...');

  // Fetch all data from database
  const [packages, destinations, hotels, flights, reviews, testimonials, videos, gallery, blogs, settings] = await Promise.all([
    db.package.findMany({ where: { status: 'active' }, include: { destination: { select: { name: true, country: true } } }, orderBy: { createdAt: 'desc' } }),
    db.destination.findMany({ where: { status: 'active' }, orderBy: { createdAt: 'desc' } }),
    db.hotel.findMany({ where: { status: 'active' }, include: { destination: { select: { name: true, country: true } } }, orderBy: { createdAt: 'desc' } }),
    db.flightDeal.findMany({ where: { status: 'active' }, orderBy: { createdAt: 'desc' } }),
    db.review.findMany({ where: { status: 'active' }, include: { package: { select: { name: true } }, destination: { select: { name: true } } }, orderBy: { createdAt: 'desc' } }),
    db.testimonial.findMany({ where: { status: 'active' }, orderBy: { createdAt: 'desc' } }),
    db.video.findMany({ where: { status: 'active' }, orderBy: { createdAt: 'desc' } }),
    db.galleryImage.findMany({ where: { status: 'active' }, orderBy: { createdAt: 'desc' } }),
    db.blogPost.findMany({ where: { status: 'active' }, orderBy: { createdAt: 'desc' } }),
    db.siteSetting.findMany(),
  ]);

  console.log(`✅ Fetched: ${packages.length} packages, ${destinations.length} destinations, ${hotels.length} hotels, ${flights.length} flights, ${reviews.length} reviews, ${testimonials.length} testimonials, ${videos.length} videos, ${gallery.length} gallery, ${blogs.length} blogs, ${settings.length} settings`);

  // Build edge-compatible data structure
  const edgeData: Record<string, unknown> = {
    packages: packages.map(p => ({
      slug: p.slug,
      name: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      duration: p.duration,
      category: p.category,
      image: p.image,
      gallery: JSON.parse(p.gallery || '[]'),
      highlights: JSON.parse(p.highlights || '[]'),
      included: JSON.parse(p.included || '[]'),
      itinerary: JSON.parse(p.itinerary || '[]'),
      rating: p.rating,
      reviewCount: p.reviewCount,
      featured: p.featured,
      destination: p.destination ? { name: p.destination.name, country: p.destination.country } : null,
    })),
    destinations: destinations.map(d => ({
      slug: d.slug,
      name: d.name,
      tagline: d.tagline,
      description: d.description,
      country: d.country,
      region: d.region,
      image: d.image,
      featured: d.featured,
    })),
    hotels: hotels.map(h => ({
      slug: h.slug,
      name: h.name,
      description: h.description,
      pricePerNight: h.pricePerNight,
      originalPrice: h.originalPrice,
      stars: h.stars,
      category: h.category,
      image: h.image,
      gallery: JSON.parse(h.gallery || '[]'),
      amenities: JSON.parse(h.amenities || '[]'),
      rating: h.rating,
      reviewCount: h.reviewCount,
      featured: h.featured,
      destination: h.destination ? { name: h.destination.name, country: h.destination.country } : null,
    })),
    flights: flights.map(f => ({
      id: f.id,
      from: f.from,
      to: f.to,
      airline: f.airline,
      price: f.price,
      originalPrice: f.originalPrice,
      type: f.type,
      image: f.image,
      description: f.description,
      featured: f.featured,
    })),
    reviews: reviews.map(r => ({
      id: r.id,
      name: r.name,
      avatar: r.avatar,
      location: r.location,
      rating: r.rating,
      title: r.title,
      text: r.text,
      date: r.date,
      verified: r.verified,
      category: r.category,
      package: r.package ? { name: r.package.name } : null,
      destination: r.destination ? { name: r.destination.name } : null,
    })),
    testimonials: testimonials.map(t => ({
      id: t.id,
      name: t.name,
      location: t.location,
      trip: t.trip,
      rating: t.rating,
      text: t.text,
      avatar: t.avatar,
      happyNote: t.happyNote,
      verified: t.verified,
      featured: t.featured,
    })),
    videos: videos.map(v => ({
      id: v.id,
      title: v.title,
      url: v.url,
      thumbnail: v.thumbnail,
      description: v.description,
      category: v.category,
      featured: v.featured,
    })),
    gallery: gallery.map(g => ({
      id: g.id,
      title: g.title,
      image: g.image,
      caption: g.caption,
      category: g.category,
      featured: g.featured,
    })),
    blogs: blogs.map(b => ({
      id: b.id,
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      content: b.content,
      authorName: b.authorName,
      authorAvatar: b.authorAvatar,
      authorBio: b.authorBio,
      date: b.date,
      category: b.category,
      image: b.image,
      readingTime: b.readingTime,
      tags: JSON.parse(b.tags || '[]'),
      featured: b.featured,
    })),
    settings: settings.reduce((acc: Record<string, string>, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {}),
  };

  // Write edge-data.json (used by local Next.js API routes)
  const jsonPath = join(PROJECT_ROOT, 'src/lib/edge-data.json');
  writeFileSync(jsonPath, JSON.stringify(edgeData, null, 2));
  console.log(`✅ Written: ${jsonPath}`);

  // Write functions/data.js (used by Cloudflare Functions)
  const dataJsPath = join(PROJECT_ROOT, 'functions/data.js');
  const dataJsContent = `// Shared data and enrichment logic for Cloudflare Functions
// Auto-generated from database on ${new Date().toISOString()}
// DO NOT EDIT MANUALLY - Use the Deploy button in the admin dashboard

const data = ${JSON.stringify(edgeData)};

function getRegion(country) {
  return country === 'India' ? 'domestic' : 'international';
}

function parseDuration(duration) {
  const match = duration.match(/(\\d+)N(\\d+)D/);
  if (match) return { nights: parseInt(match[1]), days: parseInt(match[2]) };
  return { nights: 0, days: 0 };
}

function getDestinationSlugByName(name) {
  const dest = data.destinations.find(d => d.name === name);
  return dest?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function getDestinationImageByName(name) {
  const dest = data.destinations.find(d => d.name === name);
  return dest?.image || '';
}

const categoryHighlights = {
  honeymoon: 'Candlelight Dinner,Couples Spa,Romantic Setup,Private Transfers,Flower Decoration',
  adventure: 'Trekking,River Rafting,Paragliding,Camping,Bonfire',
  beach: 'Beach Activities,Water Sports,Sunset Cruise,Snorkeling,Beach Dinner',
  tourism: 'Sightseeing,Local Culture,Guided Tours,Photography,Shopping',
  family: 'Kids Activities,Family Rooms,Entertainment,Safety,Swimming Pool',
  pilgrimage: 'Temple Visits,Prayer Ceremonies,Spiritual Walks,Cultural Programs,Local Guides',
  wildlife: 'Safari,Nature Walks,Bird Watching,Photography,Campfire',
  'hill-station': 'Mountain Views,Trekking,Tea Gardens,Toy Train,Snow Activities',
};

const categoryInclusions = {
  honeymoon: 'Accommodation,Meals,Transfers,Candlelight Dinner,Couples Spa',
  adventure: 'Accommodation,Meals,Transfers,Activity Equipment,Guide',
  beach: 'Accommodation,Meals,Transfers,Beach Activities,Water Sports',
  tourism: 'Accommodation,Meals,Transfers,Sightseeing,Guide',
  family: 'Accommodation,Meals,Transfers,Kids Activities,Entertainment',
  pilgrimage: 'Accommodation,Meals,Transfers,Temple Visits,Guide',
  wildlife: 'Accommodation,Meals,Transfers,Safari,Guide',
  'hill-station': 'Accommodation,Meals,Transfers,Sightseeing,Guide',
};

function enrichPackage(pkg) {
  const highlights = pkg.highlights?.length > 0
    ? pkg.highlights
    : (categoryHighlights[pkg.category] || categoryHighlights.tourism).split(',');

  const included = pkg.included?.length > 0
    ? pkg.included
    : (categoryInclusions[pkg.category] || categoryInclusions.tourism).split(',');

  const { nights, days } = parseDuration(pkg.duration);

  return {
    ...pkg,
    nights,
    days,
    highlights,
    included,
    region: getRegion(pkg.destination?.country || ''),
    originalPrice: pkg.originalPrice || Math.round(pkg.price * 1.3),
    rating: pkg.rating || 4.5,
    reviewCount: pkg.reviewCount || Math.floor(Math.random() * 200) + 50,
  };
}

function enrichDestination(dest) {
  const destPackages = data.packages.filter(p => p.destination?.name === dest.name);
  const destHotels = data.hotels.filter(h => h.destination?.name === dest.name);
  return {
    ...dest,
    region: getRegion(dest.country),
    packageCount: destPackages.length,
    hotelCount: destHotels.length,
    startingPrice: destPackages.length > 0 ? Math.min(...destPackages.map(p => p.price)) : 0,
  };
}

function enrichHotel(hotel) {
  const amenities = hotel.amenities?.length > 0
    ? hotel.amenities
    : ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Room Service'];
  return {
    ...hotel,
    amenities,
    originalPrice: hotel.originalPrice || Math.round(hotel.pricePerNight * 1.3),
    rating: hotel.rating || 4.0,
    reviewCount: hotel.reviewCount || Math.floor(Math.random() * 300) + 50,
  };
}

// Export for use in Cloudflare Functions
export { data, enrichPackage, enrichDestination, enrichHotel, getRegion, parseDuration, getDestinationSlugByName, getDestinationImageByName, categoryHighlights, categoryInclusions };
`;
  writeFileSync(dataJsPath, dataJsContent);
  console.log(`✅ Written: ${dataJsPath}`);

  // Also write a deploy log
  try {
    await db.deployLog.create({
      data: {
        action: 'deploy',
        details: `Generated edge data: ${packages.length} packages, ${destinations.length} destinations, ${hotels.length} hotels, ${flights.length} flights, ${reviews.length} reviews, ${testimonials.length} testimonials, ${videos.length} videos, ${gallery.length} gallery, ${blogs.length} blogs`,
        status: 'success',
        triggeredBy: 'admin',
      }
    });
    console.log('✅ Deploy log created');
  } catch (e) {
    console.log('⚠️ Could not create deploy log:', e);
  }

  await db.$disconnect();
  console.log('🎉 Edge data generation complete!');
}

main().catch(err => {
  console.error('❌ Error generating edge data:', err);
  process.exit(1);
});
