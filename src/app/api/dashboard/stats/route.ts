import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [
      totalDestinations,
      totalPackages,
      totalHotels,
      totalFlights,
      totalReviews,
      totalTestimonials,
      totalBookings,
      totalInquiries,
      totalGalleryImages,
      totalBlogPosts,
      totalVideos,
      totalSettings,
      activePackages,
      featuredPackages,
      pendingBookings,
      confirmedBookings,
      newInquiries,
      pendingReviews,
      ratingAggregate,
      revenueAggregate,
    ] = await Promise.all([
      db.destination.count(),
      db.package.count(),
      db.hotel.count(),
      db.flightDeal.count(),
      db.review.count(),
      db.testimonial.count(),
      db.booking.count(),
      db.inquiry.count(),
      db.galleryImage.count(),
      db.blogPost.count(),
      db.video.count(),
      db.siteSetting.count(),
      db.package.count({ where: { status: 'active' } }),
      db.package.count({ where: { featured: true } }),
      db.booking.count({ where: { status: 'pending' } }),
      db.booking.count({ where: { status: 'confirmed' } }),
      db.inquiry.count({ where: { status: 'new' } }),
      db.review.count({ where: { status: 'pending' } }),
      db.review.aggregate({ _avg: { rating: true } }),
      db.booking.aggregate({ _sum: { totalPrice: true }, where: { status: { in: ['confirmed', 'completed'] } } }),
    ]);

    // Recent bookings
    const recentBookings = await db.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { package: { select: { name: true } } },
    });

    // Recent inquiries
    const recentInquiries = await db.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      counts: {
        packages: totalPackages,
        destinations: totalDestinations,
        hotels: totalHotels,
        flights: totalFlights,
        reviews: totalReviews,
        testimonials: totalTestimonials,
        gallery: totalGalleryImages,
        blogPosts: totalBlogPosts,
        videos: totalVideos,
        bookings: totalBookings,
        inquiries: totalInquiries,
        settings: totalSettings,
      },
      highlights: {
        activePackages,
        featuredPackages,
        pendingBookings,
        confirmedBookings,
        newInquiries,
        pendingReviews,
        revenue: revenueAggregate._sum.totalPrice ?? 0,
        averageRating: ratingAggregate._avg.rating ?? 0,
      },
      recentBookings: recentBookings.map(b => ({
        id: b.id,
        name: b.name,
        packageName: b.package?.name || 'N/A',
        travelers: b.travelers,
        totalPrice: b.totalPrice,
        status: b.status,
        createdAt: b.createdAt,
      })),
      recentInquiries: recentInquiries.map(i => ({
        id: i.id,
        name: i.name,
        email: i.email,
        type: i.type,
        status: i.status,
        createdAt: i.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
