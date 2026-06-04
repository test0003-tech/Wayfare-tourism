'use client';

import { useEffect, useState, useRef, useMemo, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FlightDeal } from '@/lib/types';
import PageHero from '@/components/wayfare/PageHero';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import PageTransition from '@/components/wayfare/PageTransition';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Plane,
  ArrowRight,
  Tag,
  PlaneIcon,
  Filter,
  Search,
  Flame,
  Star,
  Zap,
  Clock,
  Users,
  ChevronRight,
  MapPin,
  TrendingDown,
  Sparkles,
  CircleDot,
} from 'lucide-react';

const flightTypes = ['All', 'Round Trip', 'One Way'];
const ITEMS_PER_PAGE = 9;

// Airline color mapping for logo placeholders
const airlineColors: Record<string, string> = {
  'Emirates': 'from-red-500 to-red-700',
  'IndiGo': 'from-blue-400 to-blue-600',
  'Thai Airways': 'from-purple-500 to-purple-700',
  'Singapore Airlines': 'from-yellow-500 to-yellow-700',
  'SriLankan Airlines': 'from-teal-500 to-teal-700',
  'Air India': 'from-orange-500 to-red-600',
  'Vistara': 'from-indigo-400 to-purple-600',
  'Malaysia Airlines': 'from-blue-500 to-blue-700',
  'Garuda Indonesia': 'from-emerald-500 to-teal-600',
  'Vietnam Airlines': 'from-sky-500 to-blue-600',
};

// Destination theme gradients (beach=blue, mountains=white/cool, city=warm)
const destinationGradients: Record<string, string> = {
  'Dubai': 'from-amber-900/40 via-orange-800/20 to-yellow-900/30',
  'Maldives': 'from-cyan-800/40 via-teal-700/20 to-blue-900/30',
  'Bangkok': 'from-purple-900/40 via-pink-800/20 to-orange-900/30',
  'Singapore': 'from-emerald-900/40 via-teal-800/20 to-cyan-900/30',
  'Kathmandu': 'from-slate-800/40 via-blue-800/20 to-indigo-900/30',
  'Colombo': 'from-emerald-900/40 via-green-800/20 to-teal-900/30',
  'Srinagar': 'from-sky-900/40 via-slate-700/20 to-blue-900/30',
  'Goa': 'from-orange-900/40 via-amber-800/20 to-cyan-900/30',
  'Port Blair': 'from-cyan-900/40 via-teal-800/20 to-emerald-900/30',
  'Kuala Lumpur': 'from-pink-900/40 via-rose-800/20 to-purple-900/30',
  'Bali': 'from-emerald-900/40 via-teal-800/20 to-amber-900/30',
  'Ho Chi Minh': 'from-red-900/40 via-amber-800/20 to-yellow-900/30',
};

function PopularRouteCard({ from, to, price, airline, discount }: { from: string; to: string; price: number; airline: string; discount: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      className="glass-strong rounded-2xl p-4 cursor-pointer group relative overflow-hidden streak-effect"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-teal-500/10 transition-colors" />
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2 text-white">
          <MapPin className="h-3.5 w-3.5 text-teal-400" />
          <span className="text-sm font-semibold">{from}</span>
        </div>
        <div className="flex-1 flex items-center">
          <div className="h-px flex-1 bg-gradient-to-r from-teal-500/40 to-amber-500/40" />
          <Plane className="h-3 w-3 mx-2 text-amber-400 -rotate-0" />
          <div className="h-px flex-1 bg-gradient-to-r from-amber-500/40 to-teal-500/40" />
        </div>
        <div className="flex items-center gap-2 text-white">
          <span className="text-sm font-semibold">{to}</span>
          <MapPin className="h-3.5 w-3.5 text-amber-400" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{airline}</span>
          {discount > 0 && (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] px-1.5 py-0">
              <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
              {discount}% off
            </Badge>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-amber-400">₹{price.toLocaleString()}</span>
          <span className="text-[10px] text-gray-500">/person</span>
        </div>
      </div>
    </motion.div>
  );
}

function FlightCard({ flight, index, isVisible, isBestDeal }: { flight: FlightDeal; index: number; isVisible: boolean; isBestDeal: boolean }) {
  const discount = flight.originalPrice
    ? Math.round(((flight.originalPrice - flight.price) / flight.originalPrice) * 100)
    : 0;
  const gradient = destinationGradients[flight.to] || 'from-teal-900/40 via-emerald-800/20 to-cyan-900/30';
  const airlineColor = airlineColors[flight.airline] || 'from-gray-500 to-gray-700';
  const airlineInitial = flight.airline.charAt(0).toUpperCase();
  const isRoundTrip = flight.type?.toLowerCase().includes('round');

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="group relative overflow-hidden rounded-2xl glass tilt-card streak-effect transition-all duration-500 hover:glow-teal">
        {/* Destination-themed gradient background */}
        <div className={`relative h-40 sm:h-44 overflow-hidden bg-gradient-to-br ${gradient}`}>
          {/* Background image with overlay */}
          <img
            src={flight.image}
            alt={`${flight.from} to ${flight.to}`}
            className="h-full w-full object-cover opacity-20 mix-blend-overlay group-hover:opacity-30 transition-opacity duration-500"
          />

          {/* Animated shimmer overlay */}
          <div className="absolute inset-0 animate-shimmer opacity-30" />

          {/* Decorative floating circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-500" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-500" />

          {/* Badges row */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
            {isBestDeal && (
              <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-[10px] font-bold text-gray-950 shadow-lg glow-amber animate-pulse-glow">
                <Sparkles className="h-3 w-3" />
                BEST DEAL
              </div>
            )}
            {flight.featured && (
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 backdrop-blur-sm text-[10px] font-semibold px-2">
                <Star className="h-2.5 w-2.5 mr-0.5 fill-teal-400 text-teal-400" />
                Featured
              </Badge>
            )}
          </div>

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg z-10">
              <Tag className="h-3 w-3" />
              {discount}% OFF
            </div>
          )}

          {/* Flight type badge */}
          <div className="absolute bottom-3 right-3 z-10">
            <Badge className="bg-white/10 text-gray-300 border-white/20 backdrop-blur-md text-[10px] font-medium px-2 py-0.5">
              <Plane className="h-2.5 w-2.5 mr-1" />
              {isRoundTrip ? 'Round Trip' : 'One Way'}
            </Badge>
          </div>

          {/* Limited Seats urgency for featured */}
          {flight.featured && (
            <div className="absolute bottom-3 left-3 z-10">
              <div className="flex items-center gap-1 rounded-full bg-red-500/20 border border-red-500/30 backdrop-blur-md px-2 py-0.5">
                <Users className="h-2.5 w-2.5 text-red-400" />
                <span className="text-[10px] font-semibold text-red-300">Limited Seats</span>
              </div>
            </div>
          )}

          {/* Route visualization - the hero of the card */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full max-w-xs">
              {/* Departure city */}
              <div className="text-center flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full glass-strong flex items-center justify-center mx-auto mb-1 border border-white/20">
                  <span className="text-lg sm:text-xl font-bold text-white">{flight.from.substring(0, 3).toUpperCase()}</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white drop-shadow-lg">{flight.from}</p>
              </div>

              {/* Animated route line with plane */}
              <div className="flex-1 relative flex flex-col items-center">
                {/* Dashed line with gradient */}
                <div className="w-full relative h-0.5">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-amber-400 to-teal-400 rounded-full" style={{ backgroundSize: '200% 100%' }} />
                  {/* Dashes overlay */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.4) 4px, rgba(0,0,0,0.4) 8px)',
                  }} />
                  {/* Animated plane that moves on hover */}
                  <motion.div
                    className="absolute -top-3 left-0 text-amber-400 z-10"
                    initial={{ left: '0%' }}
                    whileHover={{ left: '85%' }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                  >
                    <div className="group-hover:translate-x-[calc(100cqw-100%)] transition-transform duration-[1.5s] ease-in-out">
                      <Plane className="h-5 w-5 sm:h-6 sm:w-6 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                    </div>
                  </motion.div>
                </div>
                {/* Dots at line endpoints */}
                <div className="flex items-center justify-between w-full -mt-0.5">
                  <CircleDot className="h-2.5 w-2.5 text-teal-400" />
                  <CircleDot className="h-2.5 w-2.5 text-teal-400" />
                </div>
                <span className="mt-1 text-[9px] uppercase tracking-widest text-gray-400 font-medium">
                  {isRoundTrip ? 'Round Trip' : 'One Way'}
                </span>
              </div>

              {/* Arrival city */}
              <div className="text-center flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full glass-strong flex items-center justify-center mx-auto mb-1 border border-white/20">
                  <span className="text-lg sm:text-xl font-bold text-white">{flight.to.substring(0, 3).toUpperCase()}</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white drop-shadow-lg">{flight.to}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card content */}
        <div className="p-4 sm:p-5">
          {/* Airline row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              {/* Airline logo placeholder */}
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${airlineColor} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                {airlineInitial}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{flight.airline}</p>
                <p className="text-[11px] text-gray-500 leading-tight line-clamp-1">{flight.description}</p>
              </div>
            </div>
          </div>

          {/* Savings callout */}
          {discount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-2 flex items-center gap-2"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-[11px] font-medium text-amber-300">
                Save ₹{(flight.originalPrice! - flight.price).toLocaleString()} on this flight!
              </span>
            </motion.div>
          )}

          {/* Price and CTA */}
          <div className="flex items-end justify-between pt-1">
            <div>
              {flight.originalPrice && (
                <span className="text-xs text-gray-500 line-through block">
                  ₹{flight.originalPrice.toLocaleString()}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold gradient-text-gold">
                  ₹{flight.price.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">/person</span>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 px-4 py-2.5 text-sm animate-glow-pulse"
            >
              Book Flight
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FlightsContent() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<FlightDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam && flightTypes.includes(typeParam)) {
      queueMicrotask(() => setTypeFilter(typeParam));
    }
  }, [searchParams]);

  useEffect(() => {
    queueMicrotask(() => setLoading(true));
    fetch('/api/flights')
      .then((res) => res.json())
      .then((data) => {
        setFlights(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.02 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered = useMemo(() => {
    let result = flights;
    if (typeFilter !== 'All') {
      result = result.filter((f) => {
        const type = f.type?.toLowerCase() || '';
        if (typeFilter === 'Round Trip') return type.includes('round');
        if (typeFilter === 'One Way') return type.includes('one') || type.includes('single');
        return true;
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (f) =>
          f.to.toLowerCase().includes(q) ||
          f.from.toLowerCase().includes(q) ||
          f.airline.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
      );
    }
    if (featuredOnly) {
      result = result.filter((f) => f.featured);
    }
    return result;
  }, [flights, typeFilter, searchQuery, featuredOnly]);

  useEffect(() => { queueMicrotask(() => setPage(1)); }, [typeFilter, searchQuery, featuredOnly]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getDiscount = useCallback((flight: FlightDeal) => {
    if (!flight.originalPrice) return 0;
    return Math.round(((flight.originalPrice - flight.price) / flight.originalPrice) * 100);
  }, []);

  // Determine which flight has the best deal (highest discount)
  const bestDealId = useMemo(() => {
    let bestId = '';
    let bestDiscount = 0;
    flights.forEach((f) => {
      const d = getDiscount(f);
      if (d > bestDiscount) {
        bestDiscount = d;
        bestId = f.id;
      }
    });
    return bestId;
  }, [flights, getDiscount]);

  // Popular routes: top 3 featured flights by discount
  const popularRoutes = useMemo(() => {
    return flights
      .filter((f) => f.featured)
      .sort((a, b) => getDiscount(b) - getDiscount(a))
      .slice(0, 3);
  }, [flights, getDiscount]);

  return (
    <PageTransition>
      <div className="bg-gray-950 min-h-screen">
        <PageHero
          badge="Flight Deals"
          badgeIcon={PlaneIcon}
          title="Best Flight Deals"
          subtitle="Affordable round-trip flights from major Indian cities to top destinations worldwide"
          backgroundImage="/images/flights-hero.png"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Flights' }]} />

          {/* Popular Routes Highlight Section */}
          {!loading && popularRoutes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✈️</span>
                  <h2 className="text-lg font-bold text-white">Popular Routes</h2>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-teal-500/30 to-transparent ml-3" />
                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">
                  <Flame className="h-2.5 w-2.5 mr-0.5" />
                  Trending
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {popularRoutes.map((flight) => (
                  <PopularRouteCard
                    key={flight.id}
                    from={flight.from}
                    to={flight.to}
                    price={flight.price}
                    airline={flight.airline}
                    discount={getDiscount(flight)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Filter Section - Redesigned */}
          <div className="mb-8 glass rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-teal-400" />
              <span className="text-sm font-semibold text-gray-300">Filter Flights</span>
              <div className="flex-1 h-px bg-white/5 ml-2" />
            </div>

            {/* Search bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search destinations, airlines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-10 focus-visible:border-teal-500/50 focus-visible:ring-teal-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Flight type tabs with plane icons */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {flightTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    typeFilter === type
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white glow-teal shadow-lg shadow-teal-500/20'
                      : 'glass text-gray-400 hover:text-teal-400 hover:bg-white/5'
                  }`}
                >
                  <Plane className={`h-3.5 w-3.5 ${typeFilter === type ? 'text-white' : 'text-gray-500'}`} />
                  {type === 'All' ? 'All Flights' : type}
                </button>
              ))}
            </div>

            {/* Featured Only toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={featuredOnly}
                  onCheckedChange={setFeaturedOnly}
                  className="data-[state=checked]:bg-teal-500"
                />
                <span className="text-sm text-gray-400 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                  Featured Only
                </span>
              </div>
            </div>
          </div>

          {/* Section header with decoration */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">✈️</span>
              <p className="text-sm text-gray-400">
                Showing <span className="text-teal-400 font-semibold">{paginated.length}</span> of{' '}
                <span className="text-teal-400 font-semibold">{filtered.length}</span> flight deals
              </p>
            </div>
            {(searchQuery || featuredOnly || typeFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFeaturedOnly(false);
                  setTypeFilter('All');
                }}
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
              >
                Clear all filters
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-white/5" />
                      <div className="h-4 bg-white/5 rounded w-1/3" />
                    </div>
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <div className="h-3 bg-white/5 rounded w-1/4" />
                        <div className="h-7 bg-white/5 rounded w-1/2" />
                      </div>
                      <div className="h-9 w-24 bg-white/5 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full glass mx-auto mb-6 flex items-center justify-center">
                <Plane className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No flights found</h3>
              <p className="text-gray-500 mb-6 text-sm">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search.`
                  : 'Try adjusting your filters'}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFeaturedOnly(false);
                  setTypeFilter('All');
                }}
                className="border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-xl"
              >
                Show All Flights
              </Button>
            </div>
          ) : (
            <>
              {/* Flight Cards Grid */}
              <div ref={sectionRef} className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((flight, i) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    index={i}
                    isVisible={isVisible}
                    isBestDeal={flight.id === bestDealId}
                  />
                ))}
              </div>

              {/* Pagination */}
              <AnimatePresence>
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-10 flex items-center justify-center gap-2"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-teal-400 rounded-xl disabled:opacity-40"
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <Button
                          key={idx}
                          variant={page === idx + 1 ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(idx + 1)}
                          className={
                            page === idx + 1
                              ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-teal-500/20 min-w-[36px]'
                              : 'border-white/10 text-gray-300 hover:bg-white/5 hover:text-teal-400 rounded-xl min-w-[36px]'
                          }
                        >
                          {idx + 1}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-teal-400 rounded-xl disabled:opacity-40"
                    >
                      Next
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Bottom spacer */}
        <div className="h-20" />
      </div>
    </PageTransition>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin h-10 w-10 border-2 border-teal-500 border-t-transparent rounded-full" />
            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-teal-400" />
          </div>
          <p className="text-sm text-gray-500">Loading flights...</p>
        </div>
      </div>
    }>
      <FlightsContent />
    </Suspense>
  );
}
