'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Destination } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Search,
  Globe,
  Plane,
  Package,
  Hotel,
  ArrowRight,
  Sparkles,
  Compass,
  TrendingUp,
  IndianRupee,
} from 'lucide-react';
import PageHero from '@/components/wayfare/PageHero';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import PageTransition from '@/components/wayfare/PageTransition';

const regionTabs = [
  { value: '', label: 'All Regions', emoji: '🌍', icon: Globe },
  { value: 'domestic', label: 'Domestic', emoji: '🇮🇳', icon: MapPin },
  { value: 'international', label: 'International', emoji: '🌏', icon: Plane },
] as const;

// Price lookup map for "Starting from ₹X" display
const startingPriceMap: Record<string, number> = {
  'Kerala': 18999,
  'Kashmir': 17999,
  'Goa': 12999,
  'Darjeeling': 15999,
  'Andaman & Nicobar': 24999,
  'Manali': 11999,
  'Dharamshala': 12999,
  'Delhi - Golden Triangle': 15999,
  'Sikkim': 16999,
  'Himachal Pradesh': 21999,
  'Dubai': 44999,
  'Maldives': 79999,
  'Thailand': 32999,
  'Singapore': 38999,
  'Malaysia': 42999,
  'Bali (Indonesia)': 45999,
  'Sri Lanka': 29999,
  'Vietnam': 27999,
  'Nepal': 21999,
};

function formatPrice(price: number): string {
  return price.toLocaleString('en-IN');
}

function DestinationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [fetchedRegion, setFetchedRegion] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [featuredVisible, setFeaturedVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  const region = searchParams.get('region') || '';
  const loading = fetchedRegion !== region;

  useEffect(() => {
    const params = new URLSearchParams();
    if (region) params.set('region', region);
    fetch(`/api/destinations?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setDestinations(data);
        setFetchedRegion(region);
      })
      .catch(() => {
        setFetchedRegion(region);
      });
  }, [region]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.05 }
    );
    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setFeaturedVisible(true);
      },
      { threshold: 0.1 }
    );
    if (featuredRef.current) observer.observe(featuredRef.current);
    return () => observer.disconnect();
  }, []);

  const handleRegionChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('region', value);
      } else {
        params.delete('region');
      }
      router.push(`/destinations?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const filteredDestinations = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase()) ||
      d.tagline.toLowerCase().includes(search.toLowerCase())
  );

  const domesticCount = destinations.filter((d) => d.region === 'domestic').length;
  const internationalCount = destinations.filter((d) => d.region === 'international').length;

  // Featured destinations: those with the most packages, or we pick top ones
  const featuredDestinations = [...destinations]
    .sort((a, b) => (b._count?.packages || 0) - (a._count?.packages || 0))
    .slice(0, 6);

  return (
    <PageTransition>
      <PageHero
        badge="Explore Destinations"
        badgeIcon={Compass}
        title="Discover Your Dream Destination"
        subtitle="From the snow-capped Himalayas to pristine island beaches — find your perfect getaway with curated travel packages"
        backgroundImage="/images/hero.png"
      />

      <div className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Destinations' }]} />

          {/* ═══════════════════════════════════════════════════════════
              FEATURED DESTINATIONS — Horizontal scroll row
          ═══════════════════════════════════════════════════════════ */}
          {!region && !search && destinations.length > 0 && (
            <section ref={featuredRef} className="py-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20">
                  <Sparkles className="h-4.5 w-4.5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Featured Destinations</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Handpicked places travellers love most</p>
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible">
                {featuredDestinations.map((dest, i) => (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={featuredVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="snap-start shrink-0 w-[70vw] sm:w-auto"
                  >
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="group relative block overflow-hidden rounded-2xl aspect-[3/4] tilt-card cursor-pointer streak-effect"
                    >
                      {/* Image with parallax zoom */}
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-115"
                      />

                      {/* Gradient overlay — shifts on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent transition-all duration-500 group-hover:via-gray-950/40" />
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-amber-500/0 transition-all duration-500 group-hover:from-teal-500/10 group-hover:to-amber-500/5" />

                      {/* Popular badge */}
                      {(dest._count?.packages || 0) >= 3 && (
                        <div className="absolute top-3 left-3 z-10">
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] font-bold px-2 py-0.5 shadow-lg">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        </div>
                      )}

                      {/* Region indicator dot */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="flex items-center gap-1 glass rounded-full px-2 py-1 text-[10px] font-semibold text-white/90">
                          {dest.region === 'domestic' ? '🇮🇳' : '🌏'}
                        </span>
                      </div>

                      {/* Bottom info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <h3 className="text-sm sm:text-base font-bold text-white leading-tight drop-shadow-lg">
                          {dest.name}
                        </h3>
                        <p className="mt-0.5 text-[11px] sm:text-xs text-amber-300/80 font-medium line-clamp-1">
                          {dest.tagline}
                        </p>
                        {startingPriceMap[dest.name] && (
                          <p className="mt-1.5 flex items-center gap-0.5 text-[11px] text-teal-300/90 font-semibold">
                            <IndianRupee className="h-3 w-3" />
                            {formatPrice(startingPriceMap[dest.name])}
                            <span className="text-teal-300/50 font-normal text-[10px]">onwards</span>
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
              ALL DESTINATIONS — Filter tabs + Search + Grid
          ═══════════════════════════════════════════════════════════ */}
          <section className="pb-16 sm:pb-20">
            {/* Section header */}
            <div className="flex items-center gap-3 mb-5 pt-2">
              <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-600/10 border border-teal-500/20">
                <Globe className="h-4.5 w-4.5 text-teal-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">All Destinations</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Browse {destinations.length} incredible places to visit
                </p>
              </div>
            </div>

            {/* Region Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
              {/* Pill tabs with emoji icons */}
              <div className="flex items-center gap-2 flex-wrap">
                {regionTabs.map((tab) => {
                  const isActive = region === tab.value;
                  const count =
                    tab.value === ''
                      ? destinations.length
                      : tab.value === 'domestic'
                        ? domesticCount
                        : internationalCount;

                  return (
                    <button
                      key={tab.value}
                      onClick={() => handleRegionChange(tab.value)}
                      className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 border ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg glow-teal border-teal-400/30'
                          : 'glass border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <span className="text-base">{tab.emoji}</span>
                      <span>{tab.label}</span>
                      <span
                        className={`ml-0.5 text-xs px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white/80'
                            : 'bg-white/5 text-gray-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search bar — more prominent */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-400/60" />
                <Input
                  placeholder="Search destinations, countries..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-11 h-11 glass-strong border-white/10 bg-white/[0.03] text-gray-100 placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20 rounded-2xl text-sm"
                />
              </div>
            </div>

            {/* Result Count */}
            <div className="flex items-center justify-between pb-4">
              <p className="text-sm text-gray-400">
                Showing{' '}
                <span className="text-teal-400 font-semibold">
                  {filteredDestinations.length}
                </span>{' '}
                {filteredDestinations.length === 1 ? 'destination' : 'destinations'}
                {region && (
                  <span>
                    {' '}
                    in{' '}
                    <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 text-xs font-medium ml-1">
                      {region === 'domestic' ? '🇮🇳 Domestic' : '🌏 International'}
                    </Badge>
                  </span>
                )}
              </p>
            </div>

            {/* ═══════════════════════════════════════════
                DESTINATIONS GRID — Redesigned large cards
            ═══════════════════════════════════════════ */}
            <div
              ref={gridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
            >
              {loading ? (
                // Loading skeletons — match new card size
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-2xl animate-shimmer bg-white/5"
                  >
                    <div className="aspect-[4/5]" />
                  </div>
                ))
              ) : filteredDestinations.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-400">No destinations found</h3>
                  <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredDestinations.map((dest, i) => {
                  const isPopular = (dest._count?.packages || 0) >= 3;
                  const startingPrice = startingPriceMap[dest.name];
                  const pkgCount = dest._count?.packages || 0;
                  const hotelCount = dest._count?.hotels || 0;

                  return (
                    <motion.div
                      key={dest.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                    >
                      <Link
                        href={`/destinations/${dest.slug}`}
                        className="group relative block overflow-hidden rounded-2xl aspect-[4/5] tilt-card streak-effect cursor-pointer"
                      >
                        {/* Image with parallax zoom */}
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                        />

                        {/* Multi-layer gradient overlay — shifts on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-gray-950/5 transition-all duration-500 group-hover:via-gray-950/50" />
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/0 via-transparent to-amber-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:from-teal-600/15 group-hover:to-amber-600/10" />

                        {/* Glass overlay on hover */}
                        <div className="absolute inset-0 glass opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* ─── Top badges ─── */}
                        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
                          {/* Left: Popular or Region badge */}
                          <div className="flex flex-col gap-1.5">
                            {isPopular && (
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] font-bold px-2.5 py-0.5 shadow-lg shadow-amber-500/20">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                            <Badge
                              className={`text-[10px] font-semibold border backdrop-blur-md ${
                                dest.region === 'domestic'
                                  ? 'bg-teal-500/15 text-teal-300 border-teal-500/25'
                                  : 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                              }`}
                            >
                              {dest.region === 'domestic' ? '🇮🇳 India' : '🌏 International'}
                            </Badge>
                          </div>

                          {/* Right: Starting price pill */}
                          {startingPrice && (
                            <div className="glass-strong rounded-lg px-2 py-1 text-right">
                              <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">
                                From
                              </p>
                              <p className="flex items-center gap-0.5 text-xs font-bold text-teal-300">
                                <IndianRupee className="h-3 w-3" />
                                {formatPrice(startingPrice)}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* ─── Bottom content area ─── */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
                          {/* Destination name */}
                          <h3 className="text-base sm:text-lg font-bold text-white leading-tight drop-shadow-lg">
                            {dest.name}
                          </h3>

                          {/* Tagline — more prominent & styled */}
                          <p className="mt-1 text-xs sm:text-sm text-amber-300/90 font-medium italic line-clamp-2">
                            &ldquo;{dest.tagline}&rdquo;
                          </p>

                          {/* Stats row */}
                          <div className="mt-2.5 flex items-center gap-3">
                            {pkgCount > 0 && (
                              <span className="flex items-center gap-1 text-[11px] text-teal-400/80 font-medium">
                                <Package className="h-3 w-3 text-teal-400" />
                                {pkgCount} {pkgCount === 1 ? 'Package' : 'Packages'}
                              </span>
                            )}
                            {hotelCount > 0 && (
                              <span className="flex items-center gap-1 text-[11px] text-amber-400/60 font-medium">
                                <Hotel className="h-3 w-3 text-amber-400/60" />
                                {hotelCount} {hotelCount === 1 ? 'Hotel' : 'Hotels'}
                              </span>
                            )}
                          </div>

                          {/* "Explore Packages →" link — appears on hover */}
                          <div className="mt-3 overflow-hidden">
                            <div className="translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 hover:text-teal-200 transition-colors">
                                Explore Packages
                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom gradient fade for text readability */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950/80 to-transparent pointer-events-none" />
                      </Link>
                    </motion.div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="animate-shimmer w-48 h-6 rounded bg-white/5" />
        </div>
      }
    >
      <DestinationsContent />
    </Suspense>
  );
}
