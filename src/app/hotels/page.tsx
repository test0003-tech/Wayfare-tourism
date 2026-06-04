'use client';

import { useEffect, useState, useRef, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Hotel as HotelType } from '@/lib/types';
import { useWishlist, WishlistItem } from '@/lib/wishlist';
import PageHero from '@/components/wayfare/PageHero';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import PageTransition from '@/components/wayfare/PageTransition';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Star,
  MapPin,
  Search,
  Hotel as HotelIcon,
  Wifi,
  Waves,
  UtensilsCrossed,
  Dumbbell,
  Car,
  Snowflake,
  SlidersHorizontal,
  Heart,
  Eye,
  ShieldCheck,
  Sparkles,
  Crown,
  Building2,
  Palmtree,
  Landmark,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  X,
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

const amenityColors: Record<string, string> = {
  'Wi-Fi': 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  'Swimming Pool': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/20',
  'Pool': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/20',
  'Restaurant': 'bg-orange-500/20 text-orange-400 border-orange-500/20',
  'Gym': 'bg-red-500/20 text-red-400 border-red-500/20',
  'Parking': 'bg-purple-500/20 text-purple-400 border-purple-500/20',
  'AC': 'bg-teal-500/20 text-teal-400 border-teal-500/20',
  'Air Conditioning': 'bg-teal-500/20 text-teal-400 border-teal-500/20',
};

const ITEMS_PER_PAGE = 9;

const categories = ['All', 'Luxury', 'Boutique', 'Heritage', 'Resort'];
const sortOptions = [
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'rating-asc', label: 'Lowest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'stars-desc', label: 'Most Stars' },
];

const quickFilterCategories = [
  { label: 'Luxury', icon: Crown, color: 'from-amber-500/20 to-yellow-600/20 border-amber-500/30 text-amber-400' },
  { label: 'Resort', icon: Palmtree, color: 'from-cyan-500/20 to-teal-600/20 border-cyan-500/30 text-cyan-400' },
  { label: 'Heritage', icon: Landmark, color: 'from-orange-500/20 to-red-600/20 border-orange-500/30 text-orange-400' },
  { label: 'Boutique', icon: Building2, color: 'from-purple-500/20 to-pink-600/20 border-purple-500/30 text-purple-400' },
];

// Fake "viewing" numbers for urgency
const viewingCounts = [2, 3, 5, 4, 7, 2, 6, 3, 8, 4, 5, 2];

function StarRating({ count, size = 'md' }: { count: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${i < count ? 'fill-amber-400 text-amber-400' : 'fill-gray-700 text-gray-700'}`}
        />
      ))}
    </div>
  );
}

function StarFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { label: 'All', value: 'All' },
    { label: '5★', value: '5' },
    { label: '4★+', value: '4' },
    { label: '3★+', value: '3' },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
            value === opt.value
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 glow-amber'
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function HotelsContent() {
  const searchParams = useSearchParams();
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [stars, setStars] = useState('All');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [heartAnimation, setHeartAnimation] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      queueMicrotask(() => setCategory(categoryParam));
    }
  }, [searchParams]);

  useEffect(() => {
    queueMicrotask(() => setLoading(true));
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category.toLowerCase());
    fetch(`/api/hotels?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setHotels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [category]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.02 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered = useMemo(() => {
    let result = [...hotels];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.destination.name.toLowerCase().includes(q) ||
          h.destination.country.toLowerCase().includes(q)
      );
    }

    if (stars !== 'All') {
      const starNum = parseInt(stars);
      result = result.filter((h) => h.stars >= starNum);
    }

    switch (sortBy) {
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-asc':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'price-asc':
        result.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'price-desc':
        result.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'stars-desc':
        result.sort((a, b) => b.stars - a.stars);
        break;
    }

    return result;
  }, [hotels, searchQuery, stars, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { queueMicrotask(() => setPage(1)); }, [searchQuery, category, stars, sortBy]);

  const toggleWishlist = useCallback((hotel: HotelType) => {
    if (isInWishlist(hotel.id)) {
      removeItem(hotel.id);
    } else {
      const item: WishlistItem = {
        id: hotel.id,
        name: hotel.name,
        destination: `${hotel.destination.name}, ${hotel.destination.country}`,
        image: hotel.image,
        price: hotel.pricePerNight,
        originalPrice: hotel.originalPrice ?? undefined,
        duration: 'Per Night',
        rating: hotel.rating,
        category: hotel.category,
      };
      addItem(item);
      setHeartAnimation(hotel.id);
      setTimeout(() => setHeartAnimation(null), 600);
    }
  }, [addItem, removeItem, isInWishlist]);

  return (
    <PageTransition>
      <div className="bg-gray-950 min-h-screen">
        <PageHero
          badge="Premium Stays"
          badgeIcon={HotelIcon}
          title="Hotels & Resorts"
          subtitle="Handpicked luxury hotels, boutique resorts & heritage stays"
          backgroundImage="/images/flights-hero.png"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Hotels' }]} />

          {/* Quick Filters Row */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Quick Filters</span>
            {quickFilterCategories.map((qf) => {
              const Icon = qf.icon;
              const isActive = category === qf.label;
              return (
                <motion.button
                  key={qf.label}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCategory(isActive ? 'All' : qf.label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${qf.color} shadow-lg`
                      : 'glass hover:bg-white/10 border-white/10 text-gray-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {qf.label}
                </motion.button>
              );
            })}
          </div>

          {/* Filters Section */}
          <div className="mb-8 glass rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-teal-400" />
                <span className="text-sm font-semibold text-gray-300">Filter & Search</span>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategory('All');
                  setStars('All');
                  setSortBy('rating-desc');
                }}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-teal-400 transition-colors"
              >
                <X className="h-3 w-3" />
                Reset
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search hotels, destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white/5 border-white/10 text-gray-100 placeholder:text-gray-500 focus-visible:border-teal-500/50 focus-visible:ring-teal-500/20"
                />
              </div>

              {/* Category */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/5 border-white/10 text-gray-100 w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-gray-200 focus:bg-white/10 focus:text-teal-400">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Stars - Now using StarFilter component */}
              <div className="flex items-center">
                <StarFilter value={stars} onChange={setStars} />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/5 border-white/10 text-gray-100 w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-gray-200 focus:bg-white/10 focus:text-teal-400">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing <span className="text-teal-400 font-semibold">{paginated.length}</span> of{' '}
              <span className="text-teal-400 font-semibold">{filtered.length}</span> hotels
            </p>
            {filtered.length > 0 && (
              <p className="text-xs text-gray-600">
                Page {page} of {totalPages}
              </p>
            )}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[16/12] bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                    <div className="h-5 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="flex gap-2">
                      <div className="h-6 w-14 bg-white/5 rounded-full" />
                      <div className="h-6 w-14 bg-white/5 rounded-full" />
                      <div className="h-6 w-14 bg-white/5 rounded-full" />
                    </div>
                    <div className="h-10 bg-white/5 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20">
              <HotelIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No hotels found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setCategory('All');
                  setStars('All');
                  setSortBy('rating-desc');
                }}
                className="border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-xl"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Hotel Cards Grid */}
              <div ref={sectionRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((hotel, i) => {
                  const amenities = hotel.amenities.split(',').slice(0, 4);
                  const discount = hotel.originalPrice
                    ? Math.round(((hotel.originalPrice - hotel.pricePerNight) / hotel.originalPrice) * 100)
                    : 0;
                  const wishlisted = isInWishlist(hotel.id);
                  const viewingNum = viewingCounts[(hotel.id.charCodeAt(0) + i) % viewingCounts.length];
                  const isFeatured = hotel.featured;
                  const hasFreeCancellation = hotel.pricePerNight > 3000;

                  return (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                    >
                      <Card className="group overflow-hidden border-0 glass rounded-2xl tilt-card transition-all duration-300 hover:glow-amber streak-effect">
                        {/* Image Section - Taller for more impact */}
                        <div className="relative aspect-[16/12] overflow-hidden">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent" />

                          {/* Best Price Guaranteed badge for featured */}
                          {isFeatured && (
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 text-xs font-bold text-gray-950 shadow-lg glow-amber">
                              <Sparkles className="h-3 w-3" />
                              Best Price Guaranteed
                            </div>
                          )}

                          {/* Discount badge */}
                          {discount > 0 && !isFeatured && (
                            <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                              {discount}% OFF
                            </div>
                          )}

                          {/* Star rating - prominent gold stars */}
                          <div className="absolute top-3 right-3 glass-strong rounded-lg px-2 py-1.5 flex items-center gap-1">
                            <StarRating count={hotel.stars} size="sm" />
                          </div>

                          {/* Wishlist heart button */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleWishlist(hotel);
                            }}
                            className={`absolute top-3 right-[88px] flex items-center justify-center h-8 w-8 rounded-full glass-strong transition-all duration-300 hover:scale-110 ${
                              wishlisted ? 'text-rose-500' : 'text-white/70 hover:text-rose-400'
                            } ${heartAnimation === hotel.id ? 'animate-heartbeat' : ''}`}
                            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                          >
                            <Heart className={`h-4 w-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
                          </button>

                          {/* Bottom overlay info */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                            <Badge className="glass text-white text-xs font-semibold border-0">
                              {hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1)}
                            </Badge>

                            {/* Urgency indicator */}
                            <div className="flex items-center gap-1 glass-strong rounded-full px-2.5 py-1">
                              <Eye className="h-3 w-3 text-rose-400" />
                              <span className="text-[10px] font-semibold text-rose-400">{viewingNum} viewing</span>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4 sm:p-5">
                          {/* Location & Name */}
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                            <MapPin className="h-3 w-3 text-teal-400" />
                            {hotel.destination.name}, {hotel.destination.country}
                          </div>

                          <h3 className="font-bold text-white text-base sm:text-lg leading-tight group-hover:text-teal-300 transition-colors">
                            {hotel.name}
                          </h3>

                          {/* Prominent star rating + review count */}
                          <div className="mt-1.5 flex items-center gap-2">
                            <StarRating count={hotel.stars} size="sm" />
                            <div className="flex items-center gap-1 rounded-md bg-teal-500/10 px-2 py-0.5">
                              <Star className="h-3 w-3 fill-teal-400 text-teal-400" />
                              <span className="text-xs font-bold text-teal-400">{hotel.rating}</span>
                            </div>
                            <span className="text-[11px] text-gray-500">
                              ({hotel.reviewCount.toLocaleString()} reviews)
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-gray-400 line-clamp-2">{hotel.description}</p>

                          {/* Amenities with colored circles */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {amenities.map((amenity, idx) => {
                              const Icon = amenityIcons[amenity.trim()] || null;
                              const colorClass = amenityColors[amenity.trim()] || 'bg-white/5 text-gray-400 border-white/5';
                              return (
                                <span key={idx} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border ${colorClass}`}>
                                  <span className="flex items-center justify-center h-4 w-4 rounded-full bg-current/20">
                                    {Icon ? <Icon className="h-2.5 w-2.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                                  </span>
                                  {amenity.trim()}
                                </span>
                              );
                            })}
                          </div>

                          {/* Free Cancellation tag */}
                          {hasFreeCancellation && (
                            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span className="font-semibold">Free Cancellation</span>
                            </div>
                          )}

                          {/* Price & Savings */}
                          <div className="mt-3 flex items-end justify-between">
                            <div className="flex flex-col gap-0.5">
                              {hotel.originalPrice && discount > 0 && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500 line-through">
                                    ₹{hotel.originalPrice.toLocaleString()}
                                  </span>
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                    <Flame className="h-2.5 w-2.5" />
                                    Save {discount}% tonight
                                  </span>
                                </div>
                              )}
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-amber-400">
                                  ₹{hotel.pricePerNight.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500">/night</span>
                              </div>
                            </div>

                            {/* Rating pill */}
                            <div className="flex items-center gap-1 bg-amber-500/10 rounded-lg px-2 py-1">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-bold text-amber-400">{hotel.rating}</span>
                            </div>
                          </div>

                          {/* Book Now CTA */}
                          <Button
                            asChild
                            className="w-full mt-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl font-semibold glow-teal transition-all duration-300 group-hover:animate-glow-pulse h-11"
                          >
                            <a href={`/hotels/${hotel.slug}`} className="flex items-center justify-center gap-2">
                              <span>Book Now</span>
                              <ShieldCheck className="h-4 w-4 opacity-70" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination - Glass effect with Page X of Y */}
              {totalPages > 1 && (
                <div className="mt-10 flex flex-col items-center gap-4">
                  <p className="text-sm text-gray-500">
                    Page <span className="text-teal-400 font-semibold">{page}</span> of{' '}
                    <span className="text-teal-400 font-semibold">{totalPages}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="glass border-white/10 text-gray-300 hover:bg-white/10 hover:text-teal-400 rounded-xl disabled:opacity-30 h-10 px-4"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Prev
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <motion.button
                          key={idx}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setPage(idx + 1)}
                          className={`h-10 w-10 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            page === idx + 1
                              ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg glow-teal'
                              : 'glass border-white/10 text-gray-400 hover:bg-white/10 hover:text-teal-400'
                          }`}
                        >
                          {idx + 1}
                        </motion.button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="glass border-white/10 text-gray-300 hover:bg-white/10 hover:text-teal-400 rounded-xl disabled:opacity-30 h-10 px-4"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom spacer */}
        <div className="h-16" />
      </div>
    </PageTransition>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    }>
      <HotelsContent />
    </Suspense>
  );
}
