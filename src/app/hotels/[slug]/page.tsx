'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PageTransition from '@/components/wayfare/PageTransition';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  MapPin,
  Wifi,
  Waves,
  UtensilsCrossed,
  Dumbbell,
  Car,
  Snowflake,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Heart,
  Share2,
  Users,
  Clock,
  ShieldCheck,
} from 'lucide-react';

const amenityIcons: Record<string, typeof Wifi> = {
  'Wi-Fi': Wifi,
  'Swimming Pool': Waves,
  'Pool': Waves,
  'Restaurant': UtensilsCrossed,
  'Gym': Dumbbell,
  'Parking': Car,
  'AC': Snowflake,
  'Air Conditioning': Snowflake,
};

interface HotelDetail {
  id: string;
  name: string;
  slug: string;
  destinationId: string;
  destination: {
    name: string;
    country: string;
    region: string;
    image?: string;
    slug?: string;
  };
  category: string;
  stars: number;
  pricePerNight: number;
  originalPrice: number | null;
  image: string;
  description: string;
  amenities: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
}

export default function HotelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/hotels/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Hotel not found');
        return res.json();
      })
      .then((data) => {
        setHotel(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  const discount = hotel?.originalPrice
    ? Math.round(((hotel.originalPrice - hotel.pricePerNight) / hotel.originalPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-10 w-10 border-2 border-teal-500 border-t-transparent rounded-full" />
          <p className="text-gray-400 text-sm">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Hotel Not Found</h2>
          <p className="text-gray-400 mb-4">{error || 'The hotel you are looking for does not exist.'}</p>
          <Button asChild className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-semibold">
            <Link href="/hotels">Browse Hotels</Link>
          </Button>
        </div>
      </div>
    );
  }

  const amenities = hotel.amenities.split(',').map((a) => a.trim());
  const getStars = (count: number) => '★'.repeat(count);

  return (
    <PageTransition>
      <div className="bg-gray-950 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Hotels', href: '/hotels' },
              { label: hotel.name },
            ]}
          />
        </div>

        {/* Hero Image Section */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden aspect-[21/9] sm:aspect-[21/8] glow-amber"
          >
            {!imgLoaded && (
              <div className="absolute inset-0 bg-white/5 animate-pulse" />
            )}
            <img
              src={hotel.image}
              alt={hotel.name}
              onLoad={() => setImgLoaded(true)}
              className={`h-full w-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 via-transparent to-transparent" />

            {/* Top badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
              {hotel.featured && (
                <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 backdrop-blur-sm text-xs font-semibold">
                  Featured
                </Badge>
              )}
              <Badge className="glass text-white text-xs font-semibold border-0">
                {hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1)}
              </Badge>
              <div className="rounded-full bg-amber-500/20 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                {getStars(hotel.stars)}
              </div>
            </div>

            {/* Back button */}
            <Link
              href="/hotels"
              className="absolute top-4 right-4 flex items-center gap-1.5 glass rounded-full px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Hotels
            </Link>

            {/* Bottom info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
              <div className="flex items-center gap-1 text-sm text-gray-300 mb-2">
                <MapPin className="h-4 w-4 text-teal-400" />
                {hotel.destination.name}, {hotel.destination.country}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                <span className="gradient-text">{hotel.name}</span>
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 rounded-md bg-teal-500/10 px-2.5 py-1">
                  <Star className="h-4 w-4 fill-teal-400 text-teal-400" />
                  <span className="text-sm font-bold text-teal-400">{hotel.rating}</span>
                </div>
                <span className="text-sm text-gray-400">
                  {hotel.reviewCount.toLocaleString()} reviews
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-strong rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">About This Hotel</h2>
                <p className="text-gray-300 leading-relaxed">{hotel.description}</p>
              </motion.div>

              {/* Amenities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-strong rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">Amenities & Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenities.map((amenity, idx) => {
                    const Icon = amenityIcons[amenity] || CheckCircle2;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + idx * 0.05 }}
                        className="flex items-center gap-2.5 glass rounded-xl p-3 hover:glow-teal transition-all"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10">
                          <Icon className="h-4 w-4 text-teal-400" />
                        </div>
                        <span className="text-sm text-gray-300 font-medium">{amenity}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-strong rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">Why Choose This Hotel</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10 shrink-0">
                      <ShieldCheck className="h-4 w-4 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Verified Quality</p>
                      <p className="text-xs text-gray-400">Rated {hotel.rating}/5 by {hotel.reviewCount} guests</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 shrink-0">
                      <Star className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{hotel.stars}-Star Property</p>
                      <p className="text-xs text-gray-400">Premium {hotel.category} experience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10 shrink-0">
                      <Users className="h-4 w-4 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Family Friendly</p>
                      <p className="text-xs text-gray-400">Suitable for all types of travelers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 shrink-0">
                      <Clock className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Flexible Booking</p>
                      <p className="text-xs text-gray-400">Free cancellation up to 24hrs before</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Price Card Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-strong rounded-2xl p-6 sticky top-24 space-y-5"
              >
                {/* Price */}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Price per night</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-amber-400">
                      ₹{hotel.pricePerNight.toLocaleString()}
                    </span>
                    {hotel.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ₹{hotel.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {discount > 0 && (
                    <Badge className="mt-2 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 font-bold text-xs">
                      Save {discount}% — You save ₹{(hotel.originalPrice! - hotel.pricePerNight).toLocaleString()}
                    </Badge>
                  )}
                </div>

                <div className="h-px bg-white/10" />

                {/* Quick Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Location</span>
                    <span className="text-sm text-white font-medium">{hotel.destination.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Category</span>
                    <span className="text-sm text-white font-medium">{hotel.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Star Rating</span>
                    <span className="text-sm text-amber-400 font-medium">{getStars(hotel.stars)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Guest Rating</span>
                    <span className="text-sm text-teal-400 font-medium">{hotel.rating}/5</span>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-lg font-semibold text-base h-11 animate-glow-pulse">
                    Book This Hotel
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 rounded-lg font-semibold"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call to Book
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-white/10 text-gray-300 hover:bg-white/5 hover:text-rose-400 rounded-lg"
                    >
                      <Heart className="h-4 w-4 mr-1.5" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-white/10 text-gray-300 hover:bg-white/5 hover:text-teal-400 rounded-lg"
                    >
                      <Share2 className="h-4 w-4 mr-1.5" />
                      Share
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Free cancellation up to 24 hours before check-in
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </PageTransition>
  );
}
