'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Star,
  Clock,
  MapPin,
  Heart,
  ArrowRight,
  Award,
  Users,
  ShieldCheck,
  Eye,
  Plane,
  XCircle,
} from 'lucide-react';
import { useWishlist } from '@/lib/wishlist';

// Premium card styles
const premiumStyles = `
@keyframes featured-shimmer {
  0% { transform: translateX(-100%) rotate(15deg); }
  100% { transform: translateX(200%) rotate(15deg); }
}
.featured-shimmer-effect {
  position: relative;
  overflow: hidden;
}
.featured-shimmer-effect::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -100%;
  width: 60%;
  height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
  transform: rotate(15deg);
  pointer-events: none;
  z-index: 1;
}
.featured-shimmer-effect:hover::after {
  animation: featured-shimmer 0.8s ease-out;
}
@keyframes ribbon-appear {
  0% { opacity: 0; transform: translateX(10px); }
  100% { opacity: 1; transform: translateX(0); }
}
.ribbon-badge-featured {
  animation: ribbon-appear 0.5s ease-out;
}
@keyframes cta-glow {
  0%, 100% { box-shadow: 0 0 15px rgba(13,148,136,0.3); }
  50% { box-shadow: 0 0 25px rgba(13,148,136,0.5), 0 0 40px rgba(13,148,136,0.15); }
}
.cta-glow-anim:hover {
  animation: cta-glow 1.5s ease-in-out infinite;
}
@keyframes viewers-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
.live-indicator {
  animation: viewers-pulse 2s ease-in-out infinite;
}
`;

export default function HomeFeaturedPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { addItem, removeItem, isInWishlist } = useWishlist();

  useEffect(() => {
    fetch('/api/packages?featured=true')
      .then((res) => res.json())
      .then((data) => setPackages(data.slice(0, 6)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getDiscount = (pkg: Package) => {
    if (!pkg.originalPrice) return 0;
    return Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
  };

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

  const getCategoryGlow = (category: string) => {
    const glows: Record<string, string> = {
      honeymoon: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]',
      adventure: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]',
      family: 'hover:shadow-[0_0_30px_rgba(13,148,136,0.2)]',
      pilgrimage: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
      wildlife: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
      beach: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
      tourism: 'hover:shadow-[0_0_30px_rgba(13,148,136,0.2)]',
      'hill-station': 'hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
    };
    return glows[category] || 'hover:shadow-[0_0_30px_rgba(13,148,136,0.2)]';
  };

  const getBookedRecently = (pkg: Package) => {
    if (pkg.rating >= 4.8) return Math.floor(Math.random() * 20) + 15;
    if (pkg.rating >= 4.5) return Math.floor(Math.random() * 15) + 8;
    return Math.floor(Math.random() * 10) + 3;
  };

  const isBestSeller = (pkg: Package) => {
    return pkg.rating >= 4.8 && pkg.reviewCount >= 50;
  };

  const isLimitedAvailability = (pkg: Package) => pkg.rating >= 4.7 && pkg.reviewCount >= 30;

  // Deterministic viewers count based on package id
  const getViewingCount = (pkgId: string) => {
    let hash = 0;
    for (let i = 0; i < pkgId.length; i++) {
      hash = ((hash << 5) - hash) + pkgId.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 18) + 4;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: premiumStyles }} />
      <section ref={sectionRef} className="py-16 sm:py-20 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Badge variant="secondary" className="mb-3 glass text-amber-300 border-amber-500/30">
                ⭐ Featured Packages
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold">
                <span className="gradient-text">Best-Selling Tour Packages</span>
              </h2>
              <p className="mt-2 text-gray-400 max-w-xl">
                Handpicked packages loved by thousands of travelers
              </p>
            </div>
            <Link href="/packages" className="hidden sm:flex items-center gap-1 text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className={`group overflow-hidden border border-white/5 glass tilt-card transition-all duration-500 featured-shimmer-effect ${getCategoryGlow(pkg.category)} relative`}>
                  {/* Ribbon Best Seller Badge */}
                  {isBestSeller(pkg) && (
                    <div className="absolute top-0 right-0 z-20 ribbon-badge-featured">
                      <div className="relative">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-gray-950 text-xs font-extrabold px-4 py-1.5 pl-6 shadow-lg">
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            Best Seller
                          </div>
                        </div>
                        <div className="absolute top-0 left-0 w-0 h-0 border-t-[12px] border-l-[8px] border-t-transparent border-l-gray-950/40" />
                      </div>
                    </div>
                  )}

                  <Link href={`/packages/${pkg.slug}`}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.12]"
                      />
                      {/* Mesh gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {!isBestSeller(pkg) && pkg.originalPrice && getDiscount(pkg) > 0 && (
                        <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-1 text-xs font-bold text-gray-950 shadow-lg glow-amber">
                          {getDiscount(pkg)}% OFF
                        </div>
                      )}

                      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full glass px-2.5 py-1 text-xs font-bold text-white">
                        <Clock className="h-3 w-3" />
                        {pkg.duration}
                      </div>

                      {/* Limited Availability */}
                      {isLimitedAvailability(pkg) && !isBestSeller(pkg) && (
                        <div className="absolute top-3 right-3 mt-8">
                          <div className="flex items-center gap-1 rounded-full bg-rose-500/20 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                            <span className="live-indicator h-1.5 w-1.5 rounded-full bg-rose-400" />
                            Limited Availability
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-12 left-3">
                        <Badge className={`${getCategoryColor(pkg.category)} text-xs font-semibold border`}>
                          {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1).replace('-', ' ')}
                        </Badge>
                      </div>

                      {/* Trust Badges Row */}
                      <div className="absolute bottom-12 right-3 flex items-center gap-1">
                        {pkg.included?.toLowerCase().includes('flight') && (
                          <div className="flex items-center gap-0.5 rounded-full bg-teal-500/20 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-teal-300 border border-teal-500/20">
                            <Plane className="h-2.5 w-2.5" />
                            Flights
                          </div>
                        )}
                        <div className="flex items-center gap-0.5 rounded-full bg-emerald-500/20 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/20">
                          <XCircle className="h-2.5 w-2.5" />
                          Free Cancel
                        </div>
                      </div>

                      {/* Wishlist Heart */}
                      <button
                        className={`absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full glass transition-all duration-200 z-10 ${
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
                        <Heart className={`h-4 w-4 transition-transform ${isInWishlist(pkg.id) ? 'fill-rose-400 scale-110' : ''}`} />
                      </button>

                      {/* Social Proof - People Viewing */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1">
                        <div className="flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-gray-300">
                          <Eye className="h-2.5 w-2.5 text-teal-400" />
                          <span>{getViewingCount(pkg.id)} viewing</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <CardContent className="p-4 sm:p-5">
                    <Link href={`/packages/${pkg.slug}`}>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                        <MapPin className="h-3 w-3" />
                        {pkg.destination.name}, {pkg.destination.country}
                      </div>

                      <h3 className="font-bold text-white text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-teal-300 transition-colors duration-300">
                        {pkg.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {pkg.highlights.split(',').slice(0, 3).map((h, idx) => (
                          <span key={idx} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/5">
                            {h.trim()}
                          </span>
                        ))}
                      </div>

                      {/* Enhanced Rating */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-teal-500/15 to-emerald-500/15 px-2.5 py-1 border border-teal-500/20">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= Math.round(pkg.rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-bold text-teal-300">{pkg.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({pkg.reviewCount.toLocaleString()} reviews)
                        </span>
                      </div>

                      {/* Verified & Trust Badges */}
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] text-teal-400/80 font-medium">
                          <ShieldCheck className="h-3 w-3" />
                          ✓ Verified
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-amber-400/80 font-medium">
                          <span>★</span>
                          Best Price
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400/80 font-medium">
                          <Users className="h-2.5 w-2.5 text-amber-400/70" />
                          <span>{getBookedRecently(pkg)} booked recently</span>
                        </div>
                      </div>
                    </Link>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        {pkg.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{pkg.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                            ₹{pkg.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">/person</span>
                        </div>
                        {pkg.originalPrice && (
                          <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                            Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-shadow duration-300 cta-glow-anim"
                        asChild
                      >
                        <Link href={`/packages/${pkg.slug}`}>
                          View Details
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/packages">
              <Button variant="outline" className="border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-xl">
                View All Packages <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
