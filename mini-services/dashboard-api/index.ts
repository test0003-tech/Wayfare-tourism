// Wayfare Dashboard API Mini-Service
// Port: 3002
// Provides all dashboard CRUD API routes using Prisma

import { PrismaClient } from '../../node_modules/@prisma/client';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

// Set DATABASE_URL if not already set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:/home/z/my-project/db/custom.db';
}

const db = new PrismaClient();

const PORT = 3002;
const PROJECT_ROOT = '/home/z/my-project';

// ============================================
// UTILITIES
// ============================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseDuration(duration: string): { nights: number; days: number } {
  const match = duration.match(/(\d+)N\s*(\d+)D/i);
  if (match) {
    return { nights: parseInt(match[1], 10), days: parseInt(match[2], 10) };
  }
  return { nights: 0, days: 0 };
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
  });
}

function successResponse(data: unknown, status = 200): Response {
  return jsonResponse({ success: true, data }, status);
}

function errorResponse(error: string, status = 500): Response {
  return jsonResponse({ success: false, error }, status);
}

function parseQuery(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const urlObj = new URL(url, 'http://localhost');
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

async function parseBody(request: Request): Promise<Record<string, unknown>> {
  try {
    return await request.json() as Record<string, unknown>;
  } catch {
    return {};
  }
}

// Route matching helper
function matchRoute(pathname: string, pattern: string): Record<string, string> | null {
  const pathParts = pathname.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);

  if (pathParts.length !== patternParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

// ============================================
// ROUTE HANDLERS
// ============================================

// ---- STATS ----
async function handleGetStats(): Promise<Response> {
  try {
    const [
      totalDestinations, totalPackages, totalHotels, totalFlights,
      totalReviews, totalTestimonials, totalBookings, totalInquiries,
      totalGalleryImages, totalBlogPosts, totalVideos, totalSettings,
      activePackages, featuredPackages, pendingBookings, confirmedBookings,
      newInquiries, pendingReviews, ratingAggregate, revenueAggregate,
    ] = await Promise.all([
      db.destination.count(), db.package.count(), db.hotel.count(), db.flightDeal.count(),
      db.review.count(), db.testimonial.count(), db.booking.count(), db.inquiry.count(),
      db.galleryImage.count(), db.blogPost.count(), db.video.count(), db.siteSetting.count(),
      db.package.count({ where: { status: 'active' } }),
      db.package.count({ where: { featured: true } }),
      db.booking.count({ where: { status: 'pending' } }),
      db.booking.count({ where: { status: 'confirmed' } }),
      db.inquiry.count({ where: { status: 'new' } }),
      db.review.count({ where: { status: 'pending' } }),
      db.review.aggregate({ _avg: { rating: true } }),
      db.booking.aggregate({ _sum: { totalPrice: true }, where: { status: { in: ['confirmed', 'completed'] } } }),
    ]);

    const recentBookings = await db.booking.findMany({
      take: 5, orderBy: { createdAt: 'desc' },
      include: { package: { select: { name: true } } },
    });

    const recentInquiries = await db.inquiry.findMany({
      take: 5, orderBy: { createdAt: 'desc' },
    });

    return jsonResponse({
      counts: {
        packages: totalPackages, destinations: totalDestinations, hotels: totalHotels,
        flights: totalFlights, reviews: totalReviews, testimonials: totalTestimonials,
        gallery: totalGalleryImages, blogPosts: totalBlogPosts, videos: totalVideos,
        bookings: totalBookings, inquiries: totalInquiries, settings: totalSettings,
      },
      highlights: {
        activePackages, featuredPackages, pendingBookings, confirmedBookings,
        newInquiries, pendingReviews,
        revenue: revenueAggregate._sum.totalPrice ?? 0,
        averageRating: ratingAggregate._avg.rating ?? 0,
      },
      recentBookings: recentBookings.map(b => ({
        id: b.id, name: b.name, packageName: b.package?.name || 'N/A',
        travelers: b.travelers, totalPrice: b.totalPrice, status: b.status, createdAt: b.createdAt,
      })),
      recentInquiries: recentInquiries.map(i => ({
        id: i.id, name: i.name, email: i.email, type: i.type, status: i.status, createdAt: i.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return errorResponse('Failed to fetch stats');
  }
}

// ---- DESTINATIONS ----
async function handleGetDestinations(query: Record<string, string>): Promise<Response> {
  try {
    const { search, region, status, featured } = query;
    const where: Record<string, unknown> = {};
    if (search) where.OR = [{ name: { contains: search } }, { country: { contains: search } }, { description: { contains: search } }];
    if (region) where.region = region;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    const [data, total] = await Promise.all([
      db.destination.findMany({ where, include: { _count: { select: { packages: true, hotels: true } } }, orderBy: { createdAt: 'desc' } }),
      db.destination.count({ where }),
    ]);
    return jsonResponse({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return errorResponse('Failed to fetch destinations');
  }
}

async function handleCreateDestination(body: Record<string, unknown>): Promise<Response> {
  try {
    const { name, slug, country, region, image, description, tagline, featured, status } = body as Record<string, string>;
    if (!name || !country || !region || !image || !description || !tagline) {
      return errorResponse('Missing required fields: name, country, region, image, description, tagline', 400);
    }
    const finalSlug = (slug as string) || slugify(name as string);
    const existing = await db.destination.findUnique({ where: { slug: finalSlug } });
    if (existing) return errorResponse('A destination with this slug already exists', 400);

    const destination = await db.destination.create({
      data: { name: name as string, slug: finalSlug, country: country as string, region: region as string, image: image as string, description: description as string, tagline: tagline as string, featured: (featured as boolean) ?? false, status: (status as string) ?? 'active' },
    });
    return successResponse(destination, 201);
  } catch (error) {
    console.error('Error creating destination:', error);
    return errorResponse('Failed to create destination');
  }
}

async function handleGetDestination(id: string): Promise<Response> {
  try {
    const destination = await db.destination.findUnique({ where: { id }, include: { packages: true, hotels: true } });
    if (!destination) return errorResponse('Destination not found', 404);
    return successResponse(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    return errorResponse('Failed to fetch destination');
  }
}

async function handleUpdateDestination(id: string, body: Record<string, unknown>): Promise<Response> {
  try {
    const existing = await db.destination.findUnique({ where: { id } });
    if (!existing) return errorResponse('Destination not found', 404);

    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await db.destination.findUnique({ where: { slug: body.slug as string } });
      if (slugExists) return errorResponse('A destination with this slug already exists', 400);
    }

    const destination = await db.destination.update({ where: { id }, data: body });
    return successResponse(destination);
  } catch (error) {
    console.error('Error updating destination:', error);
    return errorResponse('Failed to update destination');
  }
}

async function handleDeleteDestination(id: string): Promise<Response> {
  try {
    const existing = await db.destination.findUnique({ where: { id } });
    if (!existing) return errorResponse('Destination not found', 404);
    await db.destination.delete({ where: { id } });
    return successResponse({ id });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return errorResponse('Failed to delete destination');
  }
}

// ---- PACKAGES ----
async function handleGetPackages(query: Record<string, string>): Promise<Response> {
  try {
    const { search, category, status, featured, destinationId } = query;
    const where: Record<string, unknown> = {};
    if (search) where.OR = [{ name: { contains: search } }, { description: { contains: search } }];
    if (category) where.category = category;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;
    if (destinationId) where.destinationId = destinationId;

    const [data, total] = await Promise.all([
      db.package.findMany({ where, include: { destination: { select: { id: true, name: true, country: true } } }, orderBy: { createdAt: 'desc' } }),
      db.package.count({ where }),
    ]);
    return jsonResponse({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return errorResponse('Failed to fetch packages');
  }
}

async function handleCreatePackage(body: Record<string, unknown>): Promise<Response> {
  try {
    const { name, slug, destinationId, category, duration, price, image, description,
      originalPrice, gallery, highlights, included, itinerary, rating, reviewCount, featured, status } = body;

    if (!name || !destinationId || !category || !duration || !price || !image || !description) {
      return errorResponse('Missing required fields: name, destinationId, category, duration, price, image, description', 400);
    }

    const finalSlug = (slug as string) || slugify(name as string);
    const existing = await db.package.findUnique({ where: { slug: finalSlug } });
    if (existing) return errorResponse('A package with this slug already exists', 400);

    const destExists = await db.destination.findUnique({ where: { id: destinationId as string } });
    if (!destExists) return errorResponse('Destination not found', 400);

    const { nights, days } = parseDuration(duration as string);

    const pkg = await db.package.create({
      data: {
        name: name as string, slug: finalSlug, destinationId: destinationId as string, category: category as string,
        duration: duration as string, nights, days, price: price as number,
        originalPrice: (originalPrice as number) ?? null, image: image as string,
        description: description as string, gallery: (gallery as string) ?? '[]',
        highlights: (highlights as string) ?? '[]', included: (included as string) ?? '[]',
        itinerary: (itinerary as string) ?? '[]', rating: (rating as number) ?? 4.5,
        reviewCount: (reviewCount as number) ?? 0, featured: (featured as boolean) ?? false,
        status: (status as string) ?? 'active',
      },
      include: { destination: { select: { id: true, name: true, country: true } } },
    });
    return successResponse(pkg, 201);
  } catch (error) {
    console.error('Error creating package:', error);
    return errorResponse('Failed to create package');
  }
}

async function handleGetPackage(id: string): Promise<Response> {
  try {
    const pkg = await db.package.findUnique({ where: { id }, include: { destination: true } });
    if (!pkg) return errorResponse('Package not found', 404);
    return successResponse(pkg);
  } catch (error) {
    console.error('Error fetching package:', error);
    return errorResponse('Failed to fetch package');
  }
}

async function handleUpdatePackage(id: string, body: Record<string, unknown>): Promise<Response> {
  try {
    const existing = await db.package.findUnique({ where: { id } });
    if (!existing) return errorResponse('Package not found', 404);

    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await db.package.findUnique({ where: { slug: body.slug as string } });
      if (slugExists) return errorResponse('A package with this slug already exists', 400);
    }

    // Auto-calculate nights/days if duration is being updated
    if (body.duration) {
      const match = (body.duration as string).match(/(\d+)N\s*(\d+)D/i);
      if (match) {
        body.nights = parseInt(match[1], 10);
        body.days = parseInt(match[2], 10);
      }
    }

    const pkg = await db.package.update({
      where: { id }, data: body,
      include: { destination: { select: { id: true, name: true, country: true } } },
    });
    return successResponse(pkg);
  } catch (error) {
    console.error('Error updating package:', error);
    return errorResponse('Failed to update package');
  }
}

async function handleDeletePackage(id: string): Promise<Response> {
  try {
    const existing = await db.package.findUnique({ where: { id } });
    if (!existing) return errorResponse('Package not found', 404);
    await db.package.delete({ where: { id } });
    return successResponse({ id });
  } catch (error) {
    console.error('Error deleting package:', error);
    return errorResponse('Failed to delete package');
  }
}

// ---- HOTELS ----
async function handleGetHotels(query: Record<string, string>): Promise<Response> {
  try {
    const { search, category, status, featured, destinationId } = query;
    const where: Record<string, unknown> = {};
    if (search) where.OR = [{ name: { contains: search } }, { description: { contains: search } }];
    if (category) where.category = category;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;
    if (destinationId) where.destinationId = destinationId;

    const [data, total] = await Promise.all([
      db.hotel.findMany({ where, include: { destination: { select: { id: true, name: true, country: true } } }, orderBy: { createdAt: 'desc' } }),
      db.hotel.count({ where }),
    ]);
    return jsonResponse({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return errorResponse('Failed to fetch hotels');
  }
}

async function handleCreateHotel(body: Record<string, unknown>): Promise<Response> {
  try {
    const { name, slug, destinationId, category, stars, pricePerNight, image, description,
      originalPrice, gallery, amenities, rating, reviewCount, featured, status } = body;

    if (!name || !destinationId || !category || stars === undefined || !pricePerNight || !image || !description) {
      return errorResponse('Missing required fields: name, destinationId, category, stars, pricePerNight, image, description', 400);
    }

    const finalSlug = (slug as string) || slugify(name as string);
    const existing = await db.hotel.findUnique({ where: { slug: finalSlug } });
    if (existing) return errorResponse('A hotel with this slug already exists', 400);

    const destExists = await db.destination.findUnique({ where: { id: destinationId as string } });
    if (!destExists) return errorResponse('Destination not found', 400);

    const hotel = await db.hotel.create({
      data: {
        name: name as string, slug: finalSlug, destinationId: destinationId as string,
        category: category as string, stars: stars as number, pricePerNight: pricePerNight as number,
        originalPrice: (originalPrice as number) ?? null, image: image as string,
        gallery: (gallery as string) ?? '[]', description: description as string,
        amenities: (amenities as string) ?? '[]', rating: (rating as number) ?? 4.0,
        reviewCount: (reviewCount as number) ?? 0, featured: (featured as boolean) ?? false,
        status: (status as string) ?? 'active',
      },
      include: { destination: { select: { id: true, name: true, country: true } } },
    });
    return successResponse(hotel, 201);
  } catch (error) {
    console.error('Error creating hotel:', error);
    return errorResponse('Failed to create hotel');
  }
}

async function handleGetHotel(id: string): Promise<Response> {
  try {
    const hotel = await db.hotel.findUnique({ where: { id }, include: { destination: true } });
    if (!hotel) return errorResponse('Hotel not found', 404);
    return successResponse(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return errorResponse('Failed to fetch hotel');
  }
}

async function handleUpdateHotel(id: string, body: Record<string, unknown>): Promise<Response> {
  try {
    const existing = await db.hotel.findUnique({ where: { id } });
    if (!existing) return errorResponse('Hotel not found', 404);

    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await db.hotel.findUnique({ where: { slug: body.slug as string } });
      if (slugExists) return errorResponse('A hotel with this slug already exists', 400);
    }

    const hotel = await db.hotel.update({
      where: { id }, data: body,
      include: { destination: { select: { id: true, name: true, country: true } } },
    });
    return successResponse(hotel);
  } catch (error) {
    console.error('Error updating hotel:', error);
    return errorResponse('Failed to update hotel');
  }
}

async function handleDeleteHotel(id: string): Promise<Response> {
  try {
    const existing = await db.hotel.findUnique({ where: { id } });
    if (!existing) return errorResponse('Hotel not found', 404);
    await db.hotel.delete({ where: { id } });
    return successResponse({ id });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    return errorResponse('Failed to delete hotel');
  }
}

// ---- FLIGHTS ----
async function handleGetFlights(query: Record<string, string>): Promise<Response> {
  try {
    const { search, status, featured, type } = query;
    const where: Record<string, unknown> = {};
    if (search) where.OR = [{ from: { contains: search } }, { to: { contains: search } }, { airline: { contains: search } }, { description: { contains: search } }];
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;
    if (type) where.type = type;

    const [data, total] = await Promise.all([
      db.flightDeal.findMany({ where, orderBy: { createdAt: 'desc' } }),
      db.flightDeal.count({ where }),
    ]);
    return jsonResponse({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching flights:', error);
    return errorResponse('Failed to fetch flights');
  }
}

async function handleCreateFlight(body: Record<string, unknown>): Promise<Response> {
  try {
    const { from, to, airline, price, originalPrice, type, image, description, featured, status } = body;
    if (!from || !to || !airline || !price || !type || !image || !description) {
      return errorResponse('Missing required fields: from, to, airline, price, type, image, description', 400);
    }
    const flight = await db.flightDeal.create({
      data: {
        from: from as string, to: to as string, airline: airline as string, price: price as number,
        originalPrice: (originalPrice as number) ?? null, type: type as string, image: image as string,
        description: description as string, featured: (featured as boolean) ?? false, status: (status as string) ?? 'active',
      },
    });
    return successResponse(flight, 201);
  } catch (error) {
    console.error('Error creating flight:', error);
    return errorResponse('Failed to create flight');
  }
}

async function handleGetFlight(id: string): Promise<Response> {
  try {
    const flight = await db.flightDeal.findUnique({ where: { id } });
    if (!flight) return errorResponse('Flight not found', 404);
    return successResponse(flight);
  } catch (error) {
    console.error('Error fetching flight:', error);
    return errorResponse('Failed to fetch flight');
  }
}

async function handleUpdateFlight(id: string, body: Record<string, unknown>): Promise<Response> {
  try {
    const existing = await db.flightDeal.findUnique({ where: { id } });
    if (!existing) return errorResponse('Flight not found', 404);
    const flight = await db.flightDeal.update({ where: { id }, data: body });
    return successResponse(flight);
  } catch (error) {
    console.error('Error updating flight:', error);
    return errorResponse('Failed to update flight');
  }
}

async function handleDeleteFlight(id: string): Promise<Response> {
  try {
    const existing = await db.flightDeal.findUnique({ where: { id } });
    if (!existing) return errorResponse('Flight not found', 404);
    await db.flightDeal.delete({ where: { id } });
    return successResponse({ id });
  } catch (error) {
    console.error('Error deleting flight:', error);
    return errorResponse('Failed to delete flight');
  }
}

// ---- REVIEWS ----
async function handleGetReviews(query: Record<string, string>): Promise<Response> {
  try {
    const { search, status, category, rating } = query;
    const where: Record<string, unknown> = {};
    if (search) where.OR = [{ name: { contains: search } }, { title: { contains: search } }, { text: { contains: search } }];
    if (status) where.status = status;
    if (category) where.category = category;
    if (rating) where.rating = parseInt(rating, 10);

    const [data, total] = await Promise.all([
      db.review.findMany({
        where,
        include: {
          package: { select: { id: true, name: true } },
          hotel: { select: { id: true, name: true } },
          destination: { select: { id: true, name: true, country: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.review.count({ where }),
    ]);
    return jsonResponse({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return errorResponse('Failed to fetch reviews');
  }
}

async function handleCreateReview(body: Record<string, unknown>): Promise<Response> {
  try {
    const { name, avatar, location, rating, title, text, date, verified, category, photos, status, packageId, hotelId, destinationId } = body;
    if (!name || !text || rating === undefined) {
      return errorResponse('Missing required fields: name, text, rating', 400);
    }
    if ((rating as number) < 1 || (rating as number) > 5) {
      return errorResponse('Rating must be between 1 and 5', 400);
    }
    const review = await db.review.create({
      data: {
        name: name as string, avatar: (avatar as string) ?? '', location: (location as string) ?? '',
        rating: rating as number, title: (title as string) ?? '', text: text as string,
        date: (date as string) ?? new Date().toLocaleDateString(), verified: (verified as boolean) ?? false,
        category: (category as string) ?? '', photos: (photos as number) ?? 0, status: (status as string) ?? 'active',
        packageId: (packageId as string) ?? null, hotelId: (hotelId as string) ?? null, destinationId: (destinationId as string) ?? null,
      },
      include: {
        package: { select: { id: true, name: true } },
        hotel: { select: { id: true, name: true } },
        destination: { select: { id: true, name: true, country: true } },
      },
    });
    return successResponse(review, 201);
  } catch (error) {
    console.error('Error creating review:', error);
    return errorResponse('Failed to create review');
  }
}

async function handleGetReview(id: string): Promise<Response> {
  try {
    const review = await db.review.findUnique({
      where: { id },
      include: {
        package: { select: { id: true, name: true } },
        hotel: { select: { id: true, name: true } },
        destination: { select: { id: true, name: true, country: true } },
      },
    });
    if (!review) return errorResponse('Review not found', 404);
    return successResponse(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    return errorResponse('Failed to fetch review');
  }
}

async function handleUpdateReview(id: string, body: Record<string, unknown>): Promise<Response> {
  try {
    const existing = await db.review.findUnique({ where: { id } });
    if (!existing) return errorResponse('Review not found', 404);
    if (body.rating !== undefined && ((body.rating as number) < 1 || (body.rating as number) > 5)) {
      return errorResponse('Rating must be between 1 and 5', 400);
    }
    const review = await db.review.update({
      where: { id }, data: body,
      include: {
        package: { select: { id: true, name: true } },
        hotel: { select: { id: true, name: true } },
        destination: { select: { id: true, name: true, country: true } },
      },
    });
    return successResponse(review);
  } catch (error) {
    console.error('Error updating review:', error);
    return errorResponse('Failed to update review');
  }
}

async function handleDeleteReview(id: string): Promise<Response> {
  try {
    const existing = await db.review.findUnique({ where: { id } });
    if (!existing) return errorResponse('Review not found', 404);
    await db.review.delete({ where: { id } });
    return successResponse({ id });
  } catch (error) {
    console.error('Error deleting review:', error);
    return errorResponse('Failed to delete review');
  }
}

// ---- TESTIMONIALS ----
async function handleGetTestimonials(query: Record<string, string>): Promise<Response> {
  try {
    const { search, status, featured } = query;
    const where: Record<string, unknown> = {};
    if (search) where.OR = [{ name: { contains: search } }, { trip: { contains: search } }, { text: { contains: search } }];
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    const [data, total] = await Promise.all([
      db.testimonial.findMany({ where, orderBy: { createdAt: 'desc' } }),
      db.testimonial.count({ where }),
    ]);
    return jsonResponse({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return errorResponse('Failed to fetch testimonials');
  }
}

async function handleCreateTestimonial(body: Record<string, unknown>): Promise<Response> {
  try {
    const { name, location, trip, rating, text, avatar, happyNote, verified, featured, status } = body;
    if (!name || !location || !trip || !text || rating === undefined) {
      return errorResponse('Missing required fields: name, location, trip, text, rating', 400);
    }
    if ((rating as number) < 1 || (rating as number) > 5) {
      return errorResponse('Rating must be between 1 and 5', 400);
    }
    const testimonial = await db.testimonial.create({
      data: {
        name: name as string, location: location as string, trip: trip as string,
        rating: rating as number, text: text as string, avatar: (avatar as string) ?? '',
        happyNote: (happyNote as string) ?? '', verified: (verified as boolean) ?? false,
        featured: (featured as boolean) ?? false, status: (status as string) ?? 'active',
      },
    });
    return successResponse(testimonial, 201);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return errorResponse('Failed to create testimonial');
  }
}

async function handleGetTestimonial(id: string): Promise<Response> {
  try {
    const testimonial = await db.testimonial.findUnique({ where: { id } });
    if (!testimonial) return errorResponse('Testimonial not found', 404);
    return successResponse(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return errorResponse('Failed to fetch testimonial');
  }
}

async function handleUpdateTestimonial(id: string, body: Record<string, unknown>): Promise<Response> {
  try {
    const existing = await db.testimonial.findUnique({ where: { id } });
    if (!existing) return errorResponse('Testimonial not found', 404);
    if (body.rating !== undefined && ((body.rating as number) < 1 || (body.rating as number) > 5)) {
      return errorResponse('Rating must be between 1 and 5', 400);
    }
    const testimonial = await db.testimonial.update({ where: { id }, data: body });
    return successResponse(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return errorResponse('Failed to update testimonial');
  }
}

async function handleDeleteTestimonial(id: string): Promise<Response> {
  try {
    const existing = await db.testimonial.findUnique({ where: { id } });
    if (!existing) return errorResponse('Testimonial not found', 404);
    await db.testimonial.delete({ where: { id } });
    return successResponse({ id });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return errorResponse('Failed to delete testimonial');
  }
}

// ---- GALLERY ----
async function handleGetGallery(query: Record<string, string>): Promise<Response> {
  try {
    const { search, category, status, featured } = query;
    const where: Record<string, unknown> = {};
    if (search) where.OR = [{ title: { contains: search } }, { caption: { contains: search } }];
    if (category) where.category = category;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    const [data, total] = await Promise.all([
      db.galleryImage.findMany({ where, orderBy: { createdAt: 'desc' } }),
      db.galleryImage.count({ where }),
    ]);
    return jsonResponse({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return errorResponse('Failed to fetch gallery images');
  }
}

async function handleCreateGallery(body: Record<string, unknown>): Promise<Response> {
  try {
    const { title, image, caption, category, featured, status } = body;
    if (!title || !image) {
      return errorResponse('Missing required fields: title, image', 400);
    }
    const galleryImage = await db.galleryImage.create({
      data: {
        title: title as string, image: image as string, caption: (caption as string) ?? '',
        category: (category as string) ?? 'general', featured: (featured as boolean) ?? false,
        status: (status as string) ?? 'active',
      },
    });
    return successResponse(galleryImage, 201);
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return errorResponse('Failed to create gallery image');
  }
}

async function handleGetGalleryItem(id: string): Promise<Response> {
  try {
    const galleryImage = await db.galleryImage.findUnique({ where: { id } });
    if (!galleryImage) return errorResponse('Gallery image not found', 404);
    return successResponse(galleryImage);
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    return errorResponse('Failed to fetch gallery image');
  }
}

async function handleUpdateGalleryItem(id: string, body: Record<string, unknown>): Promise<Response> {
  try {
    const existing = await db.galleryImage.findUnique({ where: { id } });
    if (!existing) return errorResponse('Gallery image not found', 404);
    const galleryImage = await db.galleryImage.update({ where: { id }, data: body });
    return successResponse(galleryImage);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return errorResponse('Failed to update gallery image');
  }
}

async function handleDeleteGalleryItem(id: string): Promise<Response> {
  try {
    const existing = await db.galleryImage.findUnique({ where: { id } });
    if (!existing) return errorResponse('Gallery image not found', 404);
    await db.galleryImage.delete({ where: { id } });
    return successResponse({ id });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return errorResponse('Failed to delete gallery image');
  }
}

// ---- BLOGS ----
async function handleGetBlogs(query: Record<string, string>): Promise<Response> {
  try {
    const { search, category, status, featured } = query;
    const where: Record<string, unknown> = {};
    if (search) where.OR = [{ title: { contains: search } }, { excerpt: { contains: search } }];
    if (category) where.category = category;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    const [data, total] = await Promise.all([
      db.blogPost.findMany({ where, orderBy: { createdAt: 'desc' } }),
      db.blogPost.count({ where }),
    ]);
    return jsonResponse({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return errorResponse('Failed to fetch blog posts');
  }
}

async function handleCreateBlog(body: Record<string, unknown>): Promise<Response> {
  try {
    const { slug, title, excerpt, content, authorName, authorAvatar, authorBio, date, category, image, readingTime, tags, featured, status } = body;
    if (!title || !excerpt || !content || !image) {
      return errorResponse('Missing required fields: title, excerpt, content, image', 400);
    }
    const finalSlug = (slug as string) || slugify(title as string);
    const existing = await db.blogPost.findUnique({ where: { slug: finalSlug } });
    if (existing) return errorResponse('A blog post with this slug already exists', 400);

    const blogPost = await db.blogPost.create({
      data: {
        slug: finalSlug, title: title as string, excerpt: excerpt as string,
        content: content as string, authorName: (authorName as string) ?? 'Wayfare Team',
        authorAvatar: (authorAvatar as string) ?? '', authorBio: (authorBio as string) ?? '',
        date: (date as string) ?? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        category: (category as string) ?? 'Destinations', image: image as string,
        readingTime: (readingTime as string) ?? '5 min read', tags: (tags as string) ?? '[]',
        featured: (featured as boolean) ?? false, status: (status as string) ?? 'active',
      },
    });
    return successResponse(blogPost, 201);
  } catch (error) {
    console.error('Error creating blog post:', error);
    return errorResponse('Failed to create blog post');
  }
}

async function handleGetBlog(id: string): Promise<Response> {
  try {
    const blogPost = await db.blogPost.findUnique({ where: { id } });
    if (!blogPost) return errorResponse('Blog post not found', 404);
    return successResponse(blogPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return errorResponse('Failed to fetch blog post');
  }
}

async function handleUpdateBlog(id: string, body: Record<string, unknown>): Promise<Response> {
  try {
    const existing = await db.blogPost.findUnique({ where: { id } });
    if (!existing) return errorResponse('Blog post not found', 404);

    if (body.slug && body.slug !== existing.slug) {
      const slugExists = await db.blogPost.findUnique({ where: { slug: body.slug as string } });
      if (slugExists) return errorResponse('A blog post with this slug already exists', 400);
    }

    const blogPost = await db.blogPost.update({ where: { id }, data: body });
    return successResponse(blogPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return errorResponse('Failed to update blog post');
  }
}

async function handleDeleteBlog(id: string): Promise<Response> {
  try {
    const existing = await db.blogPost.findUnique({ where: { id } });
    if (!existing) return errorResponse('Blog post not found', 404);
    await db.blogPost.delete({ where: { id } });
    return successResponse({ id });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return errorResponse('Failed to delete blog post');
  }
}

// ---- VIDEOS ----
async function handleGetVideos(query: Record<string, string>): Promise<Response> {
  try {
    const { search, category, status, featured } = query;
    const where: Record<string, unknown> = {};
    if (search) where.OR = [{ title: { contains: search } }, { description: { contains: search } }];
    if (category) where.category = category;
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;

    const [data, total] = await Promise.all([
      db.video.findMany({ where, orderBy: { createdAt: 'desc' } }),
      db.video.count({ where }),
    ]);
    return jsonResponse({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return errorResponse('Failed to fetch videos');
  }
}

async function handleCreateVideo(body: Record<string, unknown>): Promise<Response> {
  try {
    const { title, url, thumbnail, description, category, featured, status } = body;
    if (!title || !url) {
      return errorResponse('Missing required fields: title, url', 400);
    }
    const video = await db.video.create({
      data: {
        title: title as string, url: url as string, thumbnail: (thumbnail as string) ?? '',
        description: (description as string) ?? '', category: (category as string) ?? 'general',
        featured: (featured as boolean) ?? false, status: (status as string) ?? 'active',
      },
    });
    return successResponse(video, 201);
  } catch (error) {
    console.error('Error creating video:', error);
    return errorResponse('Failed to create video');
  }
}

async function handleGetVideo(id: string): Promise<Response> {
  try {
    const video = await db.video.findUnique({ where: { id } });
    if (!video) return errorResponse('Video not found', 404);
    return successResponse(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return errorResponse('Failed to fetch video');
  }
}

async function handleUpdateVideo(id: string, body: Record<string, unknown>): Promise<Response> {
  try {
    const existing = await db.video.findUnique({ where: { id } });
    if (!existing) return errorResponse('Video not found', 404);
    const video = await db.video.update({ where: { id }, data: body });
    return successResponse(video);
  } catch (error) {
    console.error('Error updating video:', error);
    return errorResponse('Failed to update video');
  }
}

async function handleDeleteVideo(id: string): Promise<Response> {
  try {
    const existing = await db.video.findUnique({ where: { id } });
    if (!existing) return errorResponse('Video not found', 404);
    await db.video.delete({ where: { id } });
    return successResponse({ id });
  } catch (error) {
    console.error('Error deleting video:', error);
    return errorResponse('Failed to delete video');
  }
}

// ---- BOOKINGS ----
async function handleGetBookings(query: Record<string, string>): Promise<Response> {
  try {
    const { search, status } = query;
    const where: Record<string, unknown> = {};
    if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }, { phone: { contains: search } }];
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      db.booking.findMany({
        where,
        include: { package: { select: { id: true, name: true, slug: true, duration: true, price: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      db.booking.count({ where }),
    ]);
    return jsonResponse({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return errorResponse('Failed to fetch bookings');
  }
}

async function handleCreateBooking(body: Record<string, unknown>): Promise<Response> {
  try {
    const { name, email, phone, age, packageId, travelers, adults, children,
      departureDate, returnDate, roomType, specialRequests, addOns, totalPrice, status } = body;

    if (!name || !email || !phone || !departureDate || !returnDate || totalPrice === undefined) {
      return errorResponse('Missing required fields: name, email, phone, departureDate, returnDate, totalPrice', 400);
    }

    const booking = await db.booking.create({
      data: {
        name: name as string, email: email as string, phone: phone as string,
        age: (age as number) ?? null, packageId: (packageId as string) ?? null,
        travelers: (travelers as number) ?? 1, adults: (adults as number) ?? 1,
        children: (children as number) ?? 0, departureDate: departureDate as string,
        returnDate: returnDate as string, roomType: (roomType as string) ?? 'standard',
        specialRequests: (specialRequests as string) ?? null, addOns: (addOns as string) ?? null,
        totalPrice: totalPrice as number, status: (status as string) ?? 'pending',
      },
      include: { package: { select: { id: true, name: true, slug: true, duration: true, price: true } } },
    });
    return successResponse(booking, 201);
  } catch (error) {
    console.error('Error creating booking:', error);
    return errorResponse('Failed to create booking');
  }
}

async function handleGetBooking(id: string): Promise<Response> {
  try {
    const booking = await db.booking.findUnique({
      where: { id },
      include: { package: { select: { id: true, name: true, slug: true, duration: true, price: true, image: true } } },
    });
    if (!booking) return errorResponse('Booking not found', 404);
    return successResponse(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return errorResponse('Failed to fetch booking');
  }
}

async function handleUpdateBooking(id: string, body: Record<string, unknown>): Promise<Response> {
  try {
    const existing = await db.booking.findUnique({ where: { id } });
    if (!existing) return errorResponse('Booking not found', 404);
    const booking = await db.booking.update({
      where: { id }, data: body,
      include: { package: { select: { id: true, name: true, slug: true, duration: true, price: true } } },
    });
    return successResponse(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return errorResponse('Failed to update booking');
  }
}

async function handleDeleteBooking(id: string): Promise<Response> {
  try {
    const existing = await db.booking.findUnique({ where: { id } });
    if (!existing) return errorResponse('Booking not found', 404);
    await db.booking.delete({ where: { id } });
    return successResponse({ id });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return errorResponse('Failed to delete booking');
  }
}

// ---- INQUIRIES ----
async function handleGetInquiries(query: Record<string, string>): Promise<Response> {
  try {
    const { search, status } = query;
    const where: Record<string, unknown> = {};
    if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }, { message: { contains: search } }];
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      db.inquiry.findMany({ where, orderBy: { createdAt: 'desc' } }),
      db.inquiry.count({ where }),
    ]);
    return jsonResponse({ success: true, data, total });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return errorResponse('Failed to fetch inquiries');
  }
}

async function handleCreateInquiry(body: Record<string, unknown>): Promise<Response> {
  try {
    const { name, email, phone, type, message, status } = body;
    if (!name || !email || !type || !message) {
      return errorResponse('Missing required fields: name, email, type, message', 400);
    }
    const inquiry = await db.inquiry.create({
      data: {
        name: name as string, email: email as string, phone: (phone as string) ?? null,
        type: type as string, message: message as string, status: (status as string) ?? 'new',
      },
    });
    return successResponse(inquiry, 201);
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return errorResponse('Failed to create inquiry');
  }
}

async function handleGetInquiry(id: string): Promise<Response> {
  try {
    const inquiry = await db.inquiry.findUnique({ where: { id } });
    if (!inquiry) return errorResponse('Inquiry not found', 404);
    return successResponse(inquiry);
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    return errorResponse('Failed to fetch inquiry');
  }
}

async function handleUpdateInquiry(id: string, body: Record<string, unknown>): Promise<Response> {
  try {
    const existing = await db.inquiry.findUnique({ where: { id } });
    if (!existing) return errorResponse('Inquiry not found', 404);
    const inquiry = await db.inquiry.update({ where: { id }, data: body });
    return successResponse(inquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return errorResponse('Failed to update inquiry');
  }
}

async function handleDeleteInquiry(id: string): Promise<Response> {
  try {
    const existing = await db.inquiry.findUnique({ where: { id } });
    if (!existing) return errorResponse('Inquiry not found', 404);
    await db.inquiry.delete({ where: { id } });
    return successResponse({ id });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return errorResponse('Failed to delete inquiry');
  }
}

// ---- SETTINGS ----
async function handleGetSettings(): Promise<Response> {
  try {
    const settings = await db.siteSetting.findMany({ orderBy: [{ group: 'asc' }, { key: 'asc' }] });
    const grouped = settings.reduce<Record<string, typeof settings>>((acc, setting) => {
      const group = setting.group || 'general';
      if (!acc[group]) acc[group] = [];
      acc[group].push(setting);
      return acc;
    }, {} as Record<string, typeof settings>);
    return successResponse(grouped);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return errorResponse('Failed to fetch settings');
  }
}

async function handleUpdateSettings(body: Record<string, unknown>): Promise<Response> {
  try {
    const { settings } = body as { settings: { key: string; value: string }[] };
    if (!settings || !Array.isArray(settings)) {
      return errorResponse('Settings array is required', 400);
    }
    const results = await Promise.all(
      settings.map((setting) =>
        db.siteSetting.upsert({
          where: { key: setting.key },
          update: { value: setting.value },
          create: { key: setting.key, value: setting.value },
        })
      )
    );
    return successResponse(results);
  } catch (error) {
    console.error('Error updating settings:', error);
    return errorResponse('Failed to update settings');
  }
}

// ---- DEPLOY ----
async function handleGetDeployLogs(): Promise<Response> {
  try {
    const logs = await db.deployLog.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
    return successResponse(logs);
  } catch (error) {
    console.error('Error fetching deploy logs:', error);
    return errorResponse('Failed to fetch deploy logs');
  }
}

async function handleDeploy(body: Record<string, unknown>): Promise<Response> {
  try {
    const triggeredBy = (body?.triggeredBy as string) || 'admin';

    // Create a deploy log entry first
    const deployLog = await db.deployLog.create({
      data: {
        action: 'deploy',
        details: 'Generating edge-data.json and updating Cloudflare Functions data from database',
        status: 'running',
        triggeredBy,
      },
    });

    try {
      // Fetch all data from the database
      const [packages, destinations, hotels, flights] = await Promise.all([
        db.package.findMany({
          where: { status: 'active' },
          include: { destination: { select: { name: true, country: true } } },
        }),
        db.destination.findMany({ where: { status: 'active' } }),
        db.hotel.findMany({
          where: { status: 'active' },
          include: { destination: { select: { name: true, country: true } } },
        }),
        db.flightDeal.findMany(),
      ]);

      // Transform to edge-data.json format
      const edgePackages = packages.map((pkg) => ({
        slug: pkg.slug, name: pkg.name, description: pkg.description,
        price: pkg.price, duration: pkg.duration, category: pkg.category, image: pkg.image,
        destination: { name: pkg.destination.name, country: pkg.destination.country },
      }));

      const edgeDestinations = destinations.map((dest) => ({
        slug: dest.slug, name: dest.name, tagline: dest.tagline,
        description: dest.description, country: dest.country, image: dest.image,
      }));

      const edgeHotels = hotels.map((hotel) => ({
        slug: hotel.slug, name: hotel.name, description: hotel.description,
        pricePerNight: hotel.pricePerNight, stars: hotel.stars, category: hotel.category, image: hotel.image,
        destination: { name: hotel.destination.name, country: hotel.destination.country },
      }));

      const edgeFlights = flights.map((flight) => ({
        id: flight.id, from: flight.from, to: flight.to, airline: flight.airline,
        price: flight.price, originalPrice: flight.originalPrice, type: flight.type,
        image: flight.image, description: flight.description, featured: flight.featured,
        createdAt: flight.createdAt.toISOString(), updatedAt: flight.updatedAt.toISOString(),
      }));

      const edgeData = { packages: edgePackages, destinations: edgeDestinations, hotels: edgeHotels, flights: edgeFlights };

      // Write to edge-data.json
      const edgeDataPath = join(PROJECT_ROOT, 'src/lib/edge-data.json');
      writeFileSync(edgeDataPath, JSON.stringify(edgeData, null, 2), 'utf-8');

      // Also update the Cloudflare Functions data file
      const cfDataPath = join(PROJECT_ROOT, 'functions/data.js');
      try {
        const existingFile = readFileSync(cfDataPath, 'utf-8');
        const newDataLine = `const data = ${JSON.stringify(edgeData)};`;
        const updatedFile = existingFile.replace(/const data = \{[\s\S]*?\};\n/, newDataLine + '\n');
        writeFileSync(cfDataPath, updatedFile, 'utf-8');
      } catch (cfError) {
        console.error('Warning: Could not update Cloudflare Functions data file:', cfError);
      }

      // Update deploy log to success
      await db.deployLog.update({
        where: { id: deployLog.id },
        data: {
          status: 'success',
          details: `Generated edge-data.json with ${edgePackages.length} packages, ${edgeDestinations.length} destinations, ${edgeHotels.length} hotels, ${edgeFlights.length} flights. Also updated Cloudflare Functions data.`,
        },
      });

      return successResponse({
        deployLogId: deployLog.id,
        stats: { packages: edgePackages.length, destinations: edgeDestinations.length, hotels: edgeHotels.length, flights: edgeFlights.length },
      });
    } catch (innerError) {
      // Update deploy log to failed
      await db.deployLog.update({
        where: { id: deployLog.id },
        data: {
          status: 'failed',
          details: innerError instanceof Error ? innerError.message : 'Unknown error during deploy',
        },
      });
      throw innerError;
    }
  } catch (error) {
    console.error('Error during deploy:', error);
    return errorResponse('Failed to deploy');
  }
}

// ============================================
// ROUTER
// ============================================

const server = Bun.serve({
  port: PORT,
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    try {
      // ---- STATS ----
      if (matchRoute(pathname, '/api/dashboard/stats') && method === 'GET') {
        return await handleGetStats();
      }

      // ---- DESTINATIONS ----
      if (matchRoute(pathname, '/api/dashboard/destinations') && method === 'GET') {
        return await handleGetDestinations(parseQuery(url.toString()));
      }
      if (matchRoute(pathname, '/api/dashboard/destinations') && method === 'POST') {
        return await handleCreateDestination(await parseBody(request));
      }
      const destParams = matchRoute(pathname, '/api/dashboard/destinations/:id');
      if (destParams) {
        const id = destParams.id;
        if (method === 'GET') return await handleGetDestination(id);
        if (method === 'PUT') return await handleUpdateDestination(id, await parseBody(request));
        if (method === 'DELETE') return await handleDeleteDestination(id);
      }

      // ---- PACKAGES ----
      if (matchRoute(pathname, '/api/dashboard/packages') && method === 'GET') {
        return await handleGetPackages(parseQuery(url.toString()));
      }
      if (matchRoute(pathname, '/api/dashboard/packages') && method === 'POST') {
        return await handleCreatePackage(await parseBody(request));
      }
      const pkgParams = matchRoute(pathname, '/api/dashboard/packages/:id');
      if (pkgParams) {
        const id = pkgParams.id;
        if (method === 'GET') return await handleGetPackage(id);
        if (method === 'PUT') return await handleUpdatePackage(id, await parseBody(request));
        if (method === 'DELETE') return await handleDeletePackage(id);
      }

      // ---- HOTELS ----
      if (matchRoute(pathname, '/api/dashboard/hotels') && method === 'GET') {
        return await handleGetHotels(parseQuery(url.toString()));
      }
      if (matchRoute(pathname, '/api/dashboard/hotels') && method === 'POST') {
        return await handleCreateHotel(await parseBody(request));
      }
      const hotelParams = matchRoute(pathname, '/api/dashboard/hotels/:id');
      if (hotelParams) {
        const id = hotelParams.id;
        if (method === 'GET') return await handleGetHotel(id);
        if (method === 'PUT') return await handleUpdateHotel(id, await parseBody(request));
        if (method === 'DELETE') return await handleDeleteHotel(id);
      }

      // ---- FLIGHTS ----
      if (matchRoute(pathname, '/api/dashboard/flights') && method === 'GET') {
        return await handleGetFlights(parseQuery(url.toString()));
      }
      if (matchRoute(pathname, '/api/dashboard/flights') && method === 'POST') {
        return await handleCreateFlight(await parseBody(request));
      }
      const flightParams = matchRoute(pathname, '/api/dashboard/flights/:id');
      if (flightParams) {
        const id = flightParams.id;
        if (method === 'GET') return await handleGetFlight(id);
        if (method === 'PUT') return await handleUpdateFlight(id, await parseBody(request));
        if (method === 'DELETE') return await handleDeleteFlight(id);
      }

      // ---- REVIEWS ----
      if (matchRoute(pathname, '/api/dashboard/reviews') && method === 'GET') {
        return await handleGetReviews(parseQuery(url.toString()));
      }
      if (matchRoute(pathname, '/api/dashboard/reviews') && method === 'POST') {
        return await handleCreateReview(await parseBody(request));
      }
      const reviewParams = matchRoute(pathname, '/api/dashboard/reviews/:id');
      if (reviewParams) {
        const id = reviewParams.id;
        if (method === 'GET') return await handleGetReview(id);
        if (method === 'PUT') return await handleUpdateReview(id, await parseBody(request));
        if (method === 'DELETE') return await handleDeleteReview(id);
      }

      // ---- TESTIMONIALS ----
      if (matchRoute(pathname, '/api/dashboard/testimonials') && method === 'GET') {
        return await handleGetTestimonials(parseQuery(url.toString()));
      }
      if (matchRoute(pathname, '/api/dashboard/testimonials') && method === 'POST') {
        return await handleCreateTestimonial(await parseBody(request));
      }
      const testimonialParams = matchRoute(pathname, '/api/dashboard/testimonials/:id');
      if (testimonialParams) {
        const id = testimonialParams.id;
        if (method === 'GET') return await handleGetTestimonial(id);
        if (method === 'PUT') return await handleUpdateTestimonial(id, await parseBody(request));
        if (method === 'DELETE') return await handleDeleteTestimonial(id);
      }

      // ---- GALLERY ----
      if (matchRoute(pathname, '/api/dashboard/gallery') && method === 'GET') {
        return await handleGetGallery(parseQuery(url.toString()));
      }
      if (matchRoute(pathname, '/api/dashboard/gallery') && method === 'POST') {
        return await handleCreateGallery(await parseBody(request));
      }
      const galleryParams = matchRoute(pathname, '/api/dashboard/gallery/:id');
      if (galleryParams) {
        const id = galleryParams.id;
        if (method === 'GET') return await handleGetGalleryItem(id);
        if (method === 'PUT') return await handleUpdateGalleryItem(id, await parseBody(request));
        if (method === 'DELETE') return await handleDeleteGalleryItem(id);
      }

      // ---- BLOGS ----
      if (matchRoute(pathname, '/api/dashboard/blogs') && method === 'GET') {
        return await handleGetBlogs(parseQuery(url.toString()));
      }
      if (matchRoute(pathname, '/api/dashboard/blogs') && method === 'POST') {
        return await handleCreateBlog(await parseBody(request));
      }
      const blogParams = matchRoute(pathname, '/api/dashboard/blogs/:id');
      if (blogParams) {
        const id = blogParams.id;
        if (method === 'GET') return await handleGetBlog(id);
        if (method === 'PUT') return await handleUpdateBlog(id, await parseBody(request));
        if (method === 'DELETE') return await handleDeleteBlog(id);
      }

      // ---- VIDEOS ----
      if (matchRoute(pathname, '/api/dashboard/videos') && method === 'GET') {
        return await handleGetVideos(parseQuery(url.toString()));
      }
      if (matchRoute(pathname, '/api/dashboard/videos') && method === 'POST') {
        return await handleCreateVideo(await parseBody(request));
      }
      const videoParams = matchRoute(pathname, '/api/dashboard/videos/:id');
      if (videoParams) {
        const id = videoParams.id;
        if (method === 'GET') return await handleGetVideo(id);
        if (method === 'PUT') return await handleUpdateVideo(id, await parseBody(request));
        if (method === 'DELETE') return await handleDeleteVideo(id);
      }

      // ---- BOOKINGS ----
      if (matchRoute(pathname, '/api/dashboard/bookings') && method === 'GET') {
        return await handleGetBookings(parseQuery(url.toString()));
      }
      if (matchRoute(pathname, '/api/dashboard/bookings') && method === 'POST') {
        return await handleCreateBooking(await parseBody(request));
      }
      const bookingParams = matchRoute(pathname, '/api/dashboard/bookings/:id');
      if (bookingParams) {
        const id = bookingParams.id;
        if (method === 'GET') return await handleGetBooking(id);
        if (method === 'PUT') return await handleUpdateBooking(id, await parseBody(request));
        if (method === 'DELETE') return await handleDeleteBooking(id);
      }

      // ---- INQUIRIES ----
      if (matchRoute(pathname, '/api/dashboard/inquiries') && method === 'GET') {
        return await handleGetInquiries(parseQuery(url.toString()));
      }
      if (matchRoute(pathname, '/api/dashboard/inquiries') && method === 'POST') {
        return await handleCreateInquiry(await parseBody(request));
      }
      const inquiryParams = matchRoute(pathname, '/api/dashboard/inquiries/:id');
      if (inquiryParams) {
        const id = inquiryParams.id;
        if (method === 'GET') return await handleGetInquiry(id);
        if (method === 'PUT') return await handleUpdateInquiry(id, await parseBody(request));
        if (method === 'DELETE') return await handleDeleteInquiry(id);
      }

      // ---- SETTINGS ----
      if (matchRoute(pathname, '/api/dashboard/settings') && method === 'GET') {
        return await handleGetSettings();
      }
      if (matchRoute(pathname, '/api/dashboard/settings') && method === 'PUT') {
        return await handleUpdateSettings(await parseBody(request));
      }

      // ---- DEPLOY ----
      if (matchRoute(pathname, '/api/dashboard/deploy') && method === 'GET') {
        return await handleGetDeployLogs();
      }
      if (matchRoute(pathname, '/api/dashboard/deploy') && method === 'POST') {
        return await handleDeploy(await parseBody(request));
      }

      // 404 - No route matched
      return errorResponse('Not found', 404);
    } catch (err) {
      console.error('Unhandled error:', err);
      return errorResponse('Internal server error', 500);
    }
  },
});

console.log(`🚀 Wayfare Dashboard API running on port ${PORT}`);

// Keep the process alive
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
