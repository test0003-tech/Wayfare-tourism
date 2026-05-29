'use client';

import { useEffect, useState, useRef } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Destination, Package, Hotel } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  MapPin,
  Star,
  Clock,
  Heart,
  ArrowRight,
  Globe,
  Hotel as HotelIcon,
  Compass,
  ArrowLeft,
  Check,
} from 'lucide-react';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import PageTransition from '@/components/wayfare/PageTransition';
import { useWishlist } from '@/lib/wishlist';

interface DestinationDetail extends Destination {
  packages: Package[];
  hotels: Hotel[];
}

export default function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [destination, setDestination] = useState<DestinationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [similarDestinations, setSimilarDestinations] = useState<Destination[]>([]);
  const [packagesVisible, setPackagesVisible] = useState(false);
  const [hotelsVisible, setHotelsVisible] = useState(false);
  const [similarVisible, setSimilarVisible] = useState(false);
  const packagesRef = useRef<HTMLDivElement>(null);
  const hotelsRef = useRef<HTMLDivElement>(null);
  const similarRef = useRef<HTMLDivElement>(null);
  const { addItem, removeItem, isInWishlist } = useWishlist();

  useEffect(() => {
    fetch(`/api/destinations/${slug}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setDestination(data);
          // Fetch similar destinations from the same region
          fetch(`/api/destinations?region=${data.region}`)
            .then((res) => res.json())
            .then((similar) =>
              setSimilarDestinations(
                similar.filter((d: Destination) => d.id !== data.id).slice(0, 5)
              )
            )
            .catch(console.error);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === packagesRef.current) setPackagesVisible(true);
            if (entry.target === hotelsRef.current) setHotelsVisible(true);
            if (entry.target === similarRef.current) setSimilarVisible(true);
          }
        });
      },
      { threshold: 0.05 }
    );
    if (packagesRef.current) observer.observe(packagesRef.current);
    if (hotelsRef.current) observer.observe(hotelsRef.current);
    if (similarRef.current) observer.observe(similarRef.current);
    return () => observer.disconnect();
  }, [destination]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      honeymoon: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      adventure: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      family: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      pilgrimage: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      wildlife: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      beach: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      tourism: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      'hill-station': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };
    return colors[category] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getDiscount = (pkg: Package) => {
    if (!pkg.originalPrice) return 0;
    return Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="h-[50vh] animate-shimmer bg-white/5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-4">
          <div className="animate-shimmer h-6 w-48 rounded bg-white/5" />
          <div className="animate-shimmer h-10 w-3/4 rounded bg-white/5" />
          <div className="animate-shimmer h-4 w-1/2 rounded bg-white/5" />
        </div>
      </div>
    );
  }

  // 404 state
  if (notFound || !destination) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Compass className="mx-auto h-16 w-16 text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Destination Not Found</h1>
          <p className="text-gray-400 mb-6">The destination you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-semibold">
            <Link href="/destinations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Destinations
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[50vh] sm:min-h-[55vh] flex items-end">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-gray-950/40" />

        {/* Decorative orbs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-teal-500/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pb-12 sm:pb-16">
          <div className="flex items-center gap-2 mb-4">
            <Badge className={`text-xs font-semibold border ${
              destination.region === 'domestic'
                ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {destination.region === 'domestic' ? '🇮🇳 Domestic' : '🌏 International'}
            </Badge>
            <Badge className="bg-white/5 text-gray-300 border-white/10 text-xs">
              <MapPin className="mr-1 h-3 w-3" />
              {destination.country}
            </Badge>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
          >
            <span className="gradient-text">{destination.name}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-3 text-lg text-amber-400/80 font-medium max-w-2xl"
          >
            {destination.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 flex items-center gap-4"
          >
            {destination._count && (
              <>
                <span className="flex items-center gap-1 text-sm text-teal-400 font-medium">
                  <Compass className="h-4 w-4" />
                  {destination._count.packages} {destination._count.packages === 1 ? 'Package' : 'Packages'}
                </span>
                <span className="flex items-center gap-1 text-sm text-amber-400 font-medium">
                  <HotelIcon className="h-4 w-4" />
                  {destination._count.hotels} {destination._count.hotels === 1 ? 'Hotel' : 'Hotels'}
                </span>
              </>
            )}
          </motion.div>
        </div>
      </section>

      <div className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Destinations', href: '/destinations' },
              { label: destination.name },
            ]}
          />

          {/* Description Section */}
          <section className="py-10 sm:py-14">
            <div className="max-w-3xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                About <span className="gradient-text">{destination.name}</span>
              </h2>
              <p className="text-gray-400 leading-relaxed text-base sm:text-lg">
                {destination.description}
              </p>
            </div>
          </section>

          {/* Packages Section */}
          {destination.packages.length > 0 && (
            <section ref={packagesRef} className="py-10 sm:py-14">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <Badge className="mb-3 bg-teal-500/10 text-teal-400 border-teal-500/20">
                    <Compass className="mr-1 h-3 w-3" />
                    Tour Packages
                  </Badge>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Packages in <span className="gradient-text">{destination.name}</span>
                  </h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="hidden sm:flex border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-xl"
                >
                  <Link href={`/packages?destinationId=${destination.id}`}>
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {destination.packages.slice(0, 6).map((pkg, i) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={packagesVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <Card className="group overflow-hidden border-0 glass tilt-card cursor-pointer transition-all duration-300 hover:glow-teal">
                      <Link href={`/packages/${pkg.slug}`}>
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={pkg.image}
                            alt={pkg.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

                          {pkg.originalPrice && getDiscount(pkg) > 0 && (
                            <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-1 text-xs font-bold text-gray-950 shadow-lg glow-amber">
                              {getDiscount(pkg)}% OFF
                            </div>
                          )}

                          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full glass px-2.5 py-1 text-xs font-bold text-white">
                            <Clock className="h-3 w-3" />
                            {pkg.duration}
                          </div>

                          <div className="absolute bottom-3 left-3">
                            <Badge className={`${getCategoryColor(pkg.category)} text-xs font-semibold border`}>
                              {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1).replace('-', ' ')}
                            </Badge>
                          </div>

                          <button
                            className={`absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full glass transition-all duration-200 ${
                              isInWishlist(pkg.id)
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'text-gray-300 hover:bg-white/20 hover:text-rose-400'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (isInWishlist(pkg.id)) {
                                removeItem(pkg.id);
                              } else {
                                addItem({
                                  id: pkg.id,
                                  name: pkg.name,
                                  destination: `${pkg.destination.name}, ${pkg.destination.country}`,
                                  image: pkg.image,
                                  price: pkg.price,
                                  originalPrice: pkg.originalPrice || undefined,
                                  duration: pkg.duration,
                                  rating: pkg.rating,
                                  category: pkg.category,
                                });
                              }
                            }}
                          >
                            <Heart className={`h-4 w-4 ${isInWishlist(pkg.id) ? 'fill-rose-400' : ''}`} />
                          </button>
                        </div>

                        <CardContent className="p-4 sm:p-5">
                          <h3 className="font-bold text-white text-base sm:text-lg leading-tight line-clamp-2">
                            {pkg.name}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {pkg.highlights.split(',').slice(0, 3).map((h, idx) => (
                              <span key={idx} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/5">
                                {h.trim()}
                              </span>
                            ))}
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-md bg-teal-500/10 px-2 py-0.5">
                              <Star className="h-3.5 w-3.5 fill-teal-400 text-teal-400" />
                              <span className="text-xs font-bold text-teal-400">{pkg.rating}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              ({pkg.reviewCount.toLocaleString()} reviews)
                            </span>
                          </div>

                          <div className="mt-4 flex items-end justify-between">
                            <div>
                              {pkg.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{pkg.originalPrice.toLocaleString()}
                                </span>
                              )}
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-amber-400">
                                  ₹{pkg.price.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500">/person</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-lg font-semibold"
                            >
                              View Details
                              <ArrowRight className="ml-1 h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 text-center sm:hidden">
                <Button
                  variant="outline"
                  asChild
                  className="border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-xl"
                >
                  <Link href={`/packages?destinationId=${destination.id}`}>
                    View All Packages <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </section>
          )}

          {/* Hotels Section */}
          {destination.hotels.length > 0 && (
            <section ref={hotelsRef} className="py-10 sm:py-14">
              <div className="mb-8">
                <Badge className="mb-3 bg-amber-500/10 text-amber-400 border-amber-500/20">
                  <HotelIcon className="mr-1 h-3 w-3" />
                  Hotels & Resorts
                </Badge>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Hotels in <span className="gradient-text">{destination.name}</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {destination.hotels.slice(0, 6).map((hotel, i) => {
                  const discount = hotel.originalPrice
                    ? Math.round(((hotel.originalPrice - hotel.pricePerNight) / hotel.originalPrice) * 100)
                    : 0;
                  const amenities = hotel.amenities.split(',').slice(0, 4);

                  return (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={hotelsVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                    >
                      <Card className="group overflow-hidden border-0 glass tilt-card transition-all duration-300 hover:glow-amber">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

                          {discount > 0 && (
                            <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-1 text-xs font-bold text-gray-950 shadow-lg glow-amber">
                              {discount}% OFF
                            </div>
                          )}

                          <div className="absolute top-3 right-3 rounded-full bg-amber-500/20 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                            {'★'.repeat(hotel.stars)}
                          </div>

                          <div className="absolute bottom-3 left-3">
                            <Badge className="glass text-white text-xs font-semibold border-0">
                              {hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-4 sm:p-5">
                          <h3 className="font-bold text-white text-base sm:text-lg leading-tight">
                            {hotel.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-400 line-clamp-2">{hotel.description}</p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {amenities.map((amenity, idx) => (
                              <span key={idx} className="flex items-center gap-1 text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/5">
                                <Check className="h-3 w-3 text-teal-400" />
                                {amenity.trim()}
                              </span>
                            ))}
                          </div>

                          <div className="mt-4 flex items-end justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 rounded-md bg-teal-500/10 px-2 py-0.5">
                                <Star className="h-3.5 w-3.5 fill-teal-400 text-teal-400" />
                                <span className="text-xs font-bold text-teal-400">{hotel.rating}</span>
                              </div>
                              <span className="text-xs text-gray-500">({hotel.reviewCount})</span>
                            </div>
                            <div className="text-right">
                              {hotel.originalPrice && (
                                <span className="text-sm text-gray-500 line-through block">
                                  ₹{hotel.originalPrice.toLocaleString()}
                                </span>
                              )}
                              <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-amber-400">
                                  ₹{hotel.pricePerNight.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500">/night</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Similar Destinations Section */}
          {similarDestinations.length > 0 && (
            <section ref={similarRef} className="py-10 sm:py-14 border-t border-white/5">
              <div className="mb-8">
                <Badge className="mb-3 glass text-gray-300 border-white/10">
                  <Globe className="mr-1 h-3 w-3" />
                  More {destination.region === 'domestic' ? 'Domestic' : 'International'} Destinations
                </Badge>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Similar <span className="gradient-text">Destinations</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
                {similarDestinations.map((dest, i) => (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={similarVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="group relative block overflow-hidden rounded-2xl aspect-[4/5] tilt-card cursor-pointer"
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-transparent" />
                      <div className="absolute inset-0 glass opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                          {dest.name}
                        </h3>
                        <p className="mt-0.5 text-xs sm:text-sm text-amber-400/80 font-medium">
                          {dest.tagline}
                        </p>
                        {dest._count && (
                          <p className="mt-1 text-xs text-teal-400 font-medium">
                            {dest._count.packages} packages
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
