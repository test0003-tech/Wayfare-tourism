'use client';

import { useEffect, useState, useRef } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  Clock,
  MapPin,
  Heart,
  ArrowRight,
  ArrowLeft,
  Check,
  Calendar,
  Users,
  Phone,
  Compass,
  Share2,
} from 'lucide-react';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import PageTransition from '@/components/wayfare/PageTransition';
import { useWishlist } from '@/lib/wishlist';

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

export default function PackageDetailClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [relatedPackages, setRelatedPackages] = useState<Package[]>([]);
  const [relatedVisible, setRelatedVisible] = useState(false);
  const relatedRef = useRef<HTMLDivElement>(null);
  const { addItem, removeItem, isInWishlist } = useWishlist();

  useEffect(() => {
    fetch(`/api/packages/${slug}`)
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
          setPkg(data);
          // Fetch related packages from same destination
          fetch(`/api/packages?destinationId=${data.destinationId}`)
            .then((res) => res.json())
            .then((related) =>
              setRelatedPackages(
                related.filter((p: Package) => p.id !== data.id).slice(0, 3)
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
      ([entry]) => { if (entry.isIntersecting) setRelatedVisible(true); },
      { threshold: 0.05 }
    );
    if (relatedRef.current) observer.observe(relatedRef.current);
    return () => observer.disconnect();
  }, [relatedPackages]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="h-[50vh] animate-shimmer bg-white/5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-4">
          <div className="animate-shimmer h-6 w-48 rounded bg-white/5" />
          <div className="animate-shimmer h-10 w-3/4 rounded bg-white/5" />
          <div className="animate-shimmer h-4 w-1/2 rounded bg-white/5" />
          <div className="animate-shimmer h-40 w-full rounded bg-white/5 mt-6" />
        </div>
      </div>
    );
  }

  // 404 state
  if (notFound || !pkg) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Compass className="mx-auto h-16 w-16 text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Package Not Found</h1>
          <p className="text-gray-400 mb-6">The package you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-semibold">
            <Link href="/packages">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Packages
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;

  const highlights = pkg.highlights.split(',').map((h) => h.trim());
  const included = pkg.included.split(',').map((i) => i.trim());

  let itinerary: { day: number; title: string; desc: string }[] = [];
  try {
    itinerary = JSON.parse(pkg.itinerary);
  } catch {
    itinerary = [];
  }

  const inWishlist = isInWishlist(pkg.id);

  return (
    <PageTransition>
      {/* Hero Image Section */}
      <section className="relative overflow-hidden min-h-[45vh] sm:min-h-[50vh] flex items-end">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-gray-950/40" />

        {/* Floating badges */}
        <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
          {discount > 0 && (
            <div className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-sm font-bold text-gray-950 shadow-lg glow-amber">
              {discount}% OFF
            </div>
          )}
        </div>

        <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
          <Badge className="glass text-white text-xs font-semibold border-0">
            <Clock className="mr-1 h-3 w-3" />
            {pkg.duration}
          </Badge>
          <Badge className={`${getCategoryColor(pkg.category)} text-xs font-semibold border`}>
            {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1).replace('-', ' ')}
          </Badge>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pb-10 sm:pb-14">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-3xl"
          >
            {pkg.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-3 flex flex-wrap items-center gap-3"
          >
            <span className="flex items-center gap-1 text-sm text-gray-300">
              <MapPin className="h-4 w-4 text-teal-400" />
              {pkg.destination.name}, {pkg.destination.country}
            </span>
            <span className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-amber-400">{pkg.rating}</span>
              <span className="text-gray-400">({pkg.reviewCount.toLocaleString()} reviews)</span>
            </span>
          </motion.div>
        </div>
      </section>

      <div className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Packages', href: '/packages' },
              { label: pkg.name },
            ]}
          />

          <div className="py-8 sm:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-10">
                {/* Price Card (Mobile) */}
                <div className="lg:hidden rounded-xl glass-strong p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-teal-400 uppercase tracking-wider">Starting from</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        {pkg.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            ₹{pkg.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-3xl font-bold gradient-text-gold">
                          ₹{pkg.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">/person</span>
                      </div>
                      {discount > 0 && (
                        <p className="text-sm text-teal-400 font-medium mt-1">
                          You save ₹{((pkg.originalPrice || 0) - pkg.price).toLocaleString()} per person!
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`rounded-full border-white/10 h-10 w-10 ${
                          inWishlist
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                            : 'text-gray-300 hover:text-rose-400 hover:bg-white/5'
                        }`}
                        onClick={() => {
                          if (inWishlist) {
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
                        <Heart className={`h-5 w-5 ${inWishlist ? 'fill-rose-400' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full border-white/10 text-gray-300 hover:text-teal-400 hover:bg-white/5 h-10 w-10"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-teal-400" />
                      {pkg.nights} Nights / {pkg.days} Days
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-teal-400" />
                      Per person on twin sharing
                    </span>
                  </div>
                </div>

                {/* Description */}
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">
                    About This <span className="gradient-text">Package</span>
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-base">
                    {pkg.description}
                  </p>
                </section>

                <Separator className="bg-white/10" />

                {/* Highlights */}
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">
                    Tour <span className="gradient-text">Highlights</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {highlights.map((highlight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="flex items-center gap-3 text-gray-300"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/10">
                          <Check className="h-3.5 w-3.5 text-teal-400" />
                        </div>
                        <span className="text-sm">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>

                <Separator className="bg-white/10" />

                {/* Day-by-Day Itinerary */}
                {itinerary.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-white mb-6">
                      Day-by-Day <span className="gradient-text">Itinerary</span>
                    </h2>
                    <div className="space-y-4">
                      {itinerary.map((day, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.08 }}
                          className="relative flex gap-4 rounded-xl glass p-4 sm:p-5"
                        >
                          <div className="flex flex-col items-center shrink-0">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-sm font-bold text-white shadow-lg glow-teal">
                              {day.day}
                            </div>
                            {i < itinerary.length - 1 && (
                              <div className="mt-1 w-0.5 flex-1 bg-gradient-to-b from-teal-500/30 to-transparent min-h-[20px]" />
                            )}
                          </div>
                          <div className="min-w-0 pt-0.5">
                            <h4 className="text-sm sm:text-base font-semibold text-white">{day.title}</h4>
                            <p className="mt-1 text-sm text-gray-400 leading-relaxed">{day.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                <Separator className="bg-white/10" />

                {/* What's Included */}
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">
                    What&apos;s <span className="gradient-text">Included</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {included.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        className="flex items-center gap-3 text-gray-300"
                      >
                        <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                        <span className="text-sm">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>

                <Separator className="bg-white/10" />

                {/* CTA Buttons (Mobile) */}
                <div className="flex flex-col sm:flex-row items-center gap-3 lg:hidden">
                  <Button
                    className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-lg h-12 text-base font-bold glow-teal animate-glow-pulse"
                    asChild
                  >
                    <Link href="/contact">
                      Book This Package
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-lg h-12 text-base"
                    asChild
                  >
                    <a href="tel:+919876543210">
                      <Phone className="mr-2 h-4 w-4" />
                      Call for Details
                    </a>
                  </Button>
                </div>
              </div>

              {/* Sidebar (Desktop) */}
              <div className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  {/* Price Card */}
                  <Card className="glass-strong border-white/10 overflow-hidden">
                    <CardContent className="p-6">
                      <p className="text-xs font-medium text-teal-400 uppercase tracking-wider mb-2">Starting from</p>
                      <div className="flex items-baseline gap-2">
                        {pkg.originalPrice && (
                          <span className="text-xl text-gray-500 line-through">
                            ₹{pkg.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-4xl font-bold gradient-text-gold">
                          ₹{pkg.price.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">/person</span>

                      {discount > 0 && (
                        <div className="mt-3 rounded-lg bg-teal-500/10 border border-teal-500/20 p-3">
                          <p className="text-sm text-teal-400 font-medium">
                            🎉 You save ₹{((pkg.originalPrice || 0) - pkg.price).toLocaleString()} per person!
                          </p>
                        </div>
                      )}

                      <div className="mt-4 space-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-teal-400" />
                          {pkg.nights} Nights / {pkg.days} Days
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-teal-400" />
                          Per person on twin sharing
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-teal-400" />
                          {pkg.destination.name}, {pkg.destination.country}
                        </div>
                      </div>

                      <Separator className="my-5 bg-white/10" />

                      <div className="space-y-3">
                        <Button
                          className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-lg h-12 text-base font-bold glow-teal animate-glow-pulse"
                          asChild
                        >
                          <Link href="/contact">
                            Book This Package
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-lg h-11 text-base"
                          asChild
                        >
                          <a href="tel:+919876543210">
                            <Phone className="mr-2 h-4 w-4" />
                            Call for Details
                          </a>
                        </Button>
                      </div>

                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`rounded-full ${inWishlist ? 'text-rose-400 hover:text-rose-300' : 'text-gray-400 hover:text-rose-400'}`}
                          onClick={() => {
                            if (inWishlist) {
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
                          <Heart className={`mr-1.5 h-4 w-4 ${inWishlist ? 'fill-rose-400' : ''}`} />
                          {inWishlist ? 'Saved to Wishlist' : 'Add to Wishlist'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Info */}
                  <Card className="glass border-white/10 overflow-hidden">
                    <CardContent className="p-5">
                      <h3 className="text-sm font-semibold text-white mb-3">Quick Info</h3>
                      <div className="space-y-2.5 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Duration</span>
                          <span className="text-white font-medium">{pkg.duration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Category</span>
                          <Badge className={`${getCategoryColor(pkg.category)} text-xs font-semibold border`}>
                            {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1).replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Rating</span>
                          <span className="flex items-center gap-1 text-white font-medium">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {pkg.rating}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Reviews</span>
                          <span className="text-white font-medium">{pkg.reviewCount.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Related Packages */}
          {relatedPackages.length > 0 && (
            <section ref={relatedRef} className="py-10 sm:py-14 border-t border-white/5">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <Badge className="mb-3 bg-teal-500/10 text-teal-400 border-teal-500/20">
                    <Compass className="mr-1 h-3 w-3" />
                    More Packages
                  </Badge>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Related <span className="gradient-text">Packages</span>
                  </h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="hidden sm:flex border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-xl"
                >
                  <Link href={`/packages?destinationId=${pkg.destinationId}`}>
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPackages.map((relPkg, i) => {
                  const relDiscount = relPkg.originalPrice
                    ? Math.round(((relPkg.originalPrice - relPkg.price) / relPkg.originalPrice) * 100)
                    : 0;

                  return (
                    <motion.div
                      key={relPkg.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={relatedVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                    >
                      <Card className="group overflow-hidden border-0 glass tilt-card cursor-pointer transition-all duration-300 hover:glow-teal">
                        <Link href={`/packages/${relPkg.slug}`}>
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <img
                              src={relPkg.image}
                              alt={relPkg.name}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

                            {relPkg.originalPrice && relDiscount > 0 && (
                              <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-1 text-xs font-bold text-gray-950 shadow-lg glow-amber">
                                {relDiscount}% OFF
                              </div>
                            )}

                            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full glass px-2.5 py-1 text-xs font-bold text-white">
                              <Clock className="h-3 w-3" />
                              {relPkg.duration}
                            </div>

                            <div className="absolute bottom-3 left-3">
                              <Badge className={`${getCategoryColor(relPkg.category)} text-xs font-semibold border`}>
                                {relPkg.category.charAt(0).toUpperCase() + relPkg.category.slice(1).replace('-', ' ')}
                              </Badge>
                            </div>

                            <button
                              className={`absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full glass transition-all duration-200 ${
                                isInWishlist(relPkg.id)
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : 'text-gray-300 hover:bg-white/20 hover:text-rose-400'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (isInWishlist(relPkg.id)) {
                                  removeItem(relPkg.id);
                                } else {
                                  addItem({
                                    id: relPkg.id,
                                    name: relPkg.name,
                                    destination: `${relPkg.destination.name}, ${relPkg.destination.country}`,
                                    image: relPkg.image,
                                    price: relPkg.price,
                                    originalPrice: relPkg.originalPrice || undefined,
                                    duration: relPkg.duration,
                                    rating: relPkg.rating,
                                    category: relPkg.category,
                                  });
                                }
                              }}
                            >
                              <Heart className={`h-4 w-4 ${isInWishlist(relPkg.id) ? 'fill-rose-400' : ''}`} />
                            </button>
                          </div>

                          <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                              <MapPin className="h-3 w-3" />
                              {relPkg.destination.name}, {relPkg.destination.country}
                            </div>

                            <h3 className="font-bold text-white text-base sm:text-lg leading-tight line-clamp-2">
                              {relPkg.name}
                            </h3>

                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {relPkg.highlights.split(',').slice(0, 3).map((h, idx) => (
                                <span key={idx} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/5">
                                  {h.trim()}
                                </span>
                              ))}
                            </div>

                            <div className="mt-3 flex items-center gap-2">
                              <div className="flex items-center gap-1 rounded-md bg-teal-500/10 px-2 py-0.5">
                                <Star className="h-3.5 w-3.5 fill-teal-400 text-teal-400" />
                                <span className="text-xs font-bold text-teal-400">{relPkg.rating}</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                ({relPkg.reviewCount.toLocaleString()} reviews)
                              </span>
                            </div>

                            <div className="mt-4 flex items-end justify-between">
                              <div>
                                {relPkg.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ₹{relPkg.originalPrice.toLocaleString()}
                                  </span>
                                )}
                                <div className="flex items-baseline gap-1">
                                  <span className="text-2xl font-bold text-amber-400">
                                    ₹{relPkg.price.toLocaleString()}
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
                  );
                })}
              </div>

              <div className="mt-6 text-center sm:hidden">
                <Button
                  variant="outline"
                  asChild
                  className="border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-xl"
                >
                  <Link href={`/packages?destinationId=${pkg.destinationId}`}>
                    View All Related <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </section>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
