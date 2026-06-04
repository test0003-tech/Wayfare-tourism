'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Package } from '@/lib/types';
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
  Clock,
  MapPin,
  Heart,
  ArrowRight,
  Compass,
  Search,
  SlidersHorizontal,
  X,
  Flame,
  Trophy,
  Users,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import PageHero from '@/components/wayfare/PageHero';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import PageTransition from '@/components/wayfare/PageTransition';
import { useWishlist } from '@/lib/wishlist';

const regionOptions = [
  { value: '', label: 'All Regions' },
  { value: 'domestic', label: '🇮🇳 Domestic' },
  { value: 'international', label: '🌏 International' },
];

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'honeymoon', label: 'Honeymoon' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'family', label: 'Family' },
  { value: 'pilgrimage', label: 'Pilgrimage' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'beach', label: 'Beach' },
  { value: 'hill-station', label: 'Hill Station' },
  { value: 'tourism', label: 'Tourism' },
];

const quickFilterCategories = [
  { value: 'honeymoon', label: 'Honeymoon', emoji: '💑' },
  { value: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { value: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { value: 'pilgrimage', label: 'Pilgrimage', emoji: '🙏' },
  { value: 'wildlife', label: 'Wildlife', emoji: '🦁' },
  { value: 'beach', label: 'Beach', emoji: '🏖️' },
  { value: 'hill-station', label: 'Hill Station', emoji: '⛰️' },
  { value: 'tourism', label: 'Tourism', emoji: '🗺️' },
];

const durationOptions = [
  { value: '', label: 'Any Duration' },
  { value: '3N4D', label: '3N/4D' },
  { value: '4N5D', label: '4N/5D' },
  { value: '5N6D', label: '5N/6D' },
  { value: '6N7D', label: '6N/7D' },
  { value: '7N8D', label: '7N/8D' },
];

const sortOptions = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
];

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

const getCategoryPillColor = (category: string, isActive: boolean) => {
  if (isActive) {
    const activeColors: Record<string, string> = {
      honeymoon: 'bg-rose-500/20 text-rose-300 border-rose-500/40 glow-teal',
      adventure: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      family: 'bg-teal-500/20 text-teal-300 border-teal-500/40 glow-teal',
      pilgrimage: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      wildlife: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 glow-teal',
      beach: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      tourism: 'bg-teal-500/20 text-teal-300 border-teal-500/40 glow-teal',
      'hill-station': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    };
    return activeColors[category] || 'bg-teal-500/20 text-teal-300 border-teal-500/40 glow-teal';
  }
  return 'glass text-gray-400 border-white/10 hover:text-gray-200 hover:border-white/20';
};

const getDiscount = (pkg: Package) => {
  if (!pkg.originalPrice) return 0;
  return Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
};

const getSavings = (pkg: Package) => {
  if (!pkg.originalPrice) return 0;
  return pkg.originalPrice - pkg.price;
};

// Deterministic "booked recently" number based on package id
const getBookedRecently = (pkgId: string) => {
  let hash = 0;
  for (let i = 0; i < pkgId.length; i++) {
    hash = ((hash << 5) - hash) + pkgId.charCodeAt(i);
    hash |= 0;
  }
  return 12 + (Math.abs(hash) % 37); // 12-48
};

// Generate destination thumbnails (small colored placeholder circles)
const getDestinationThumbnails = (pkg: Package) => {
  const colors = ['from-teal-400 to-emerald-500', 'from-amber-400 to-orange-500', 'from-rose-400 to-pink-500', 'from-cyan-400 to-blue-500'];
  const seed = pkg.id;
  return colors.map((color, i) => ({ color, seed: `${seed}-${i}` }));
};

// ─── Skeleton Card ───────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden glass-strong">
      <div className="relative aspect-[16/10] animate-shimmer bg-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
      </div>
      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <div className="animate-shimmer h-3 w-16 rounded bg-white/5" />
          <div className="animate-shimmer h-3 w-12 rounded bg-white/5" />
        </div>
        <div className="animate-shimmer h-5 w-3/4 rounded bg-white/5" />
        <div className="flex gap-1.5">
          <div className="animate-shimmer h-5 w-16 rounded-full bg-white/5" />
          <div className="animate-shimmer h-5 w-20 rounded-full bg-white/5" />
          <div className="animate-shimmer h-5 w-14 rounded-full bg-white/5" />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="animate-shimmer h-5 w-14 rounded bg-white/5" />
          <div className="animate-shimmer h-3 w-20 rounded bg-white/5" />
        </div>
        <div className="flex items-end justify-between pt-2">
          <div className="space-y-1">
            <div className="animate-shimmer h-3 w-20 rounded bg-white/5" />
            <div className="animate-shimmer h-6 w-24 rounded bg-white/5" />
          </div>
          <div className="animate-shimmer h-9 w-28 rounded-lg bg-white/5" />
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <div className="flex -space-x-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-shimmer h-5 w-5 rounded-full bg-white/5 border border-white/10" />
            ))}
          </div>
          <div className="animate-shimmer h-3 w-24 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}

// ─── Animated Empty State ────────────────────────────────────────
function AnimatedEmptyState({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="col-span-full py-24 text-center"
    >
      <div className="relative inline-block">
        {/* Spinning compass ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-28 h-28 rounded-full border border-dashed border-teal-500/20" />
        </motion.div>
        {/* Pulsing ring */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-24 h-24 rounded-full border border-teal-500/10" />
        </motion.div>
        {/* Compass icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 flex items-center justify-center w-20 h-20"
        >
          <Compass className="h-16 w-16 text-teal-500/30" />
        </motion.div>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-gray-300 mt-8"
      >
        No packages found
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-gray-500 mt-2 max-w-sm mx-auto"
      >
        Looks like this destination is off the map. Try adjusting your filters or explore a different path.
      </motion.p>
      {hasFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onClear}
            className="mt-6 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl font-semibold"
          >
            <Compass className="mr-2 h-4 w-4" />
            Clear All Filters
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Section Header ──────────────────────────────────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-4 pb-2">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
      <div className="text-center">
        <h2 className="text-sm font-semibold uppercase tracking-widest gradient-text">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
    </div>
  );
}

// ─── FilterBar Component ─────────────────────────────────────────
function FilterBar({
  className = '',
  fullWidth = false,
  region,
  category,
  duration,
  sort,
  activeFilterCount,
  updateFilter,
  clearFilters,
}: {
  className?: string;
  fullWidth?: boolean;
  region: string;
  category: string;
  duration: string;
  sort: string;
  activeFilterCount: number;
  updateFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <Select value={region || '_all'} onValueChange={(v) => updateFilter('region', v === '_all' ? '' : v)}>
        <SelectTrigger className={`${fullWidth ? 'w-full' : 'w-[150px]'} glass border-white/10 bg-transparent text-gray-100 rounded-xl h-9 text-sm`}>
          <SelectValue placeholder="All Regions" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-white/10 text-gray-100">
          {regionOptions.map((opt) => (
            <SelectItem key={opt.value || '_all'} value={opt.value || '_all'}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={category || '_all'} onValueChange={(v) => updateFilter('category', v === '_all' ? '' : v)}>
        <SelectTrigger className={`${fullWidth ? 'w-full' : 'w-[160px]'} glass border-white/10 bg-transparent text-gray-100 rounded-xl h-9 text-sm`}>
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-white/10 text-gray-100">
          {categoryOptions.map((opt) => (
            <SelectItem key={opt.value || '_all'} value={opt.value || '_all'}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={duration || '_all'} onValueChange={(v) => updateFilter('duration', v === '_all' ? '' : v)}>
        <SelectTrigger className={`${fullWidth ? 'w-full' : 'w-[140px]'} glass border-white/10 bg-transparent text-gray-100 rounded-xl h-9 text-sm`}>
          <SelectValue placeholder="Any Duration" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-white/10 text-gray-100">
          {durationOptions.map((opt) => (
            <SelectItem key={opt.value || '_all'} value={opt.value || '_all'}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => updateFilter('sort', v)}>
        <SelectTrigger className={`${fullWidth ? 'w-full' : 'w-[155px]'} glass border-white/10 bg-transparent text-gray-100 rounded-xl h-9 text-sm`}>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-white/10 text-gray-100">
          {sortOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl h-9 text-sm"
        >
          <X className="mr-1 h-3.5 w-3.5" />
          Clear ({activeFilterCount})
        </Button>
      )}
    </div>
  );
}

// ─── Package Card ────────────────────────────────────────────────
function PackageCard({
  pkg,
  index,
  isVisible,
  isInWishlist,
  addItem,
  removeItem,
}: {
  pkg: Package;
  index: number;
  isVisible: boolean;
  isInWishlist: (id: string) => boolean;
  addItem: (item: Parameters<typeof addItem>[0]) => void;
  removeItem: (id: string) => void;
}) {
  const discount = getDiscount(pkg);
  const savings = getSavings(pkg);
  const isTopRated = pkg.rating >= 4.7;
  const bookedRecently = getBookedRecently(pkg.id);
  const thumbnails = getDestinationThumbnails(pkg);
  const isWishlisted = isInWishlist(pkg.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className="group overflow-hidden border-0 glass-strong tilt-card streak-effect cursor-pointer transition-all duration-500 hover:glow-teal hover:border-teal-500/10">
        <Link href={`/packages/${pkg.slug}`}>
          {/* Image Section */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={pkg.image}
              alt={pkg.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent" />

            {/* Top Badges Row */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                {/* Best Seller / Trending Badge */}
                {isTopRated && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.07 + 0.3 }}
                    className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/90 to-orange-500/90 px-2.5 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm"
                  >
                    <Trophy className="h-3 w-3" />
                    Best Seller
                  </motion.div>
                )}
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="rounded-full bg-gradient-to-r from-emerald-500/90 to-teal-500/90 px-2.5 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm">
                    {discount}% OFF
                  </div>
                )}
              </div>

              {/* Duration Badge */}
              <div className="flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">
                <Clock className="h-3 w-3 text-teal-300" />
                {pkg.duration}
              </div>
            </div>

            {/* Bottom overlay badges */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <Badge className={`${getCategoryColor(pkg.category)} text-xs font-semibold border backdrop-blur-sm`}>
                {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1).replace('-', ' ')}
              </Badge>

              {/* Heart / Wishlist */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 ${
                  isWishlisted
                    ? 'bg-rose-500/25 text-rose-400 border border-rose-500/30 shadow-lg shadow-rose-500/20'
                    : 'glass text-gray-300 hover:bg-white/20 hover:text-rose-400'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isWishlisted) {
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
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`h-4 w-4 transition-transform duration-200 ${isWishlisted ? 'fill-rose-400 scale-110' : 'group-hover:scale-110'}`} />
              </motion.button>
            </div>
          </div>

          {/* Content Section */}
          <CardContent className="p-5 sm:p-6">
            {/* Destination + Rating Row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="h-3 w-3 text-teal-500/60" />
                <span>{pkg.destination.name}, {pkg.destination.country}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-teal-500/10 px-2 py-0.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-400">{pkg.rating}</span>
              </div>
            </div>

            {/* Package Name */}
            <h3 className="font-bold text-white text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-teal-100 transition-colors duration-300">
              {pkg.name}
            </h3>

            {/* Highlights */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {pkg.highlights.split(',').slice(0, 3).map((h, idx) => (
                <span key={idx} className="text-[11px] bg-white/[0.03] text-gray-400 px-2 py-0.5 rounded-full border border-white/[0.06]">
                  {h.trim()}
                </span>
              ))}
            </div>

            {/* Review count */}
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-500">
              <Users className="h-3 w-3" />
              <span>{pkg.reviewCount.toLocaleString()} reviews</span>
            </div>

            {/* Price & CTA */}
            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                {pkg.originalPrice && (
                  <span className="text-sm text-gray-500 line-through block">
                    ₹{pkg.originalPrice.toLocaleString()}
                  </span>
                )}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold gradient-text-gold">
                    ₹{pkg.price.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-gray-500">/person</span>
                </div>
                {savings > 0 && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Sparkles className="h-3 w-3 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">
                      You save ₹{savings.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all duration-300 group/btn"
              >
                View Details
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </div>

            {/* Social proof + Destination thumbnails row */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Mini destination thumbnails */}
                <div className="flex -space-x-1.5">
                  {thumbnails.map((thumb, i) => (
                    <div
                      key={i}
                      className={`h-5 w-5 rounded-full bg-gradient-to-br ${thumb.color} border-2 border-gray-900`}
                      title={pkg.destination.name}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-gray-500">
                  <span className="text-teal-400 font-medium">{bookedRecently}</span> booked recently
                </span>
              </div>
              {isTopRated && (
                <div className="flex items-center gap-1 text-[11px] text-amber-500/70">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </div>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}

// ─── Main Content Component ──────────────────────────────────────
function PackagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [fetchedKey, setFetchedKey] = useState<string>('');
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const { addItem, removeItem, isInWishlist } = useWishlist();

  // Read filters from URL
  const region = searchParams.get('region') || '';
  const category = searchParams.get('category') || '';
  const duration = searchParams.get('duration') || '';
  const sort = searchParams.get('sort') || 'rating';

  const filterKey = `${region}-${category}-${duration}-${sort}`;
  const loading = fetchedKey !== filterKey;

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/packages?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const clearFilters = useCallback(() => {
    router.push('/packages', { scroll: false });
  }, [router]);

  const activeFilterCount = [region, category, duration].filter(Boolean).length;

  useEffect(() => {
    const params = new URLSearchParams();
    if (region) params.set('region', region);
    if (category) params.set('category', category);
    if (duration) params.set('duration', duration);

    fetch(`/api/packages?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        let sorted = [...data];
        if (sort === 'price-low') {
          sorted.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
          sorted.sort((a, b) => b.price - a.price);
        } else {
          sorted.sort((a, b) => b.rating - a.rating);
        }
        setPackages(sorted);
        setFetchedKey(filterKey);
      })
      .catch(() => {
        setFetchedKey(filterKey);
      });
  }, [region, category, duration, sort, filterKey]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  // Client-side search filter
  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(search.toLowerCase()) ||
    pkg.destination.name.toLowerCase().includes(search.toLowerCase()) ||
    pkg.destination.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition>
      <PageHero
        badge="Tour Packages"
        badgeIcon={Compass}
        title="Curated Tour Packages"
        subtitle="Handcrafted itineraries for every kind of traveler — from budget-friendly to luxury escapes"
        backgroundImage="/images/hero.png"
      />

      <div className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Packages' }]} />

          {/* ═══ Quick Filter Pills ═══ */}
          <div className="py-4">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Quick Filters</span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent" />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter('category', '')}
                className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-all duration-300 ${
                  !category
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 glow-teal'
                    : 'glass text-gray-400 border-white/10 hover:text-gray-200 hover:border-white/20'
                }`}
              >
                ✨ All
              </button>
              {quickFilterCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => updateFilter('category', category === cat.value ? '' : cat.value)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-all duration-300 ${
                    getCategoryPillColor(cat.value, category === cat.value)
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ═══ Desktop Filter Bar ═══ */}
          <div className="hidden lg:flex flex-col gap-3 pb-4">
            <div className="glass-strong rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-teal-400" />
                  <span className="text-sm font-medium text-gray-300">Refine Results</span>
                  {activeFilterCount > 0 && (
                    <Badge className="bg-teal-500/15 text-teal-400 border-teal-500/30 text-xs animate-pulse-glow">
                      {activeFilterCount} active
                    </Badge>
                  )}
                </div>
                {/* Search bar */}
                <div className={`relative w-72 transition-all duration-300 ${searchFocused ? 'w-80' : ''}`}>
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${searchFocused ? 'text-teal-400' : 'text-gray-500'}`} />
                  <Input
                    placeholder="Search destinations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className={`pl-9 glass border-white/10 bg-transparent text-gray-100 placeholder:text-gray-500 rounded-xl h-9 text-sm transition-all duration-300 ${
                      searchFocused ? 'border-teal-500/40 ring-2 ring-teal-500/10' : 'focus:border-teal-500/30'
                    }`}
                  />
                </div>
              </div>
              <FilterBar
                region={region}
                category={category}
                duration={duration}
                sort={sort}
                activeFilterCount={activeFilterCount}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
              />
            </div>
          </div>

          {/* ═══ Mobile Filter Area ═══ */}
          <div className="lg:hidden py-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className={`relative flex-1 transition-all duration-300`}>
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${searchFocused ? 'text-teal-400' : 'text-gray-500'}`} />
                <Input
                  placeholder="Search destinations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`pl-9 glass border-white/10 bg-transparent text-gray-100 placeholder:text-gray-500 rounded-xl h-10 text-sm transition-all duration-300 ${
                    searchFocused ? 'border-teal-500/40 ring-2 ring-teal-500/10' : 'focus:border-teal-500/30'
                  }`}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className={`shrink-0 border-white/10 rounded-xl h-10 w-10 relative transition-all duration-300 ${
                  activeFilterCount > 0 ? 'text-teal-400 bg-teal-500/10 border-teal-500/30' : 'text-teal-400 hover:bg-white/5'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-strong rounded-2xl p-4 space-y-3 overflow-hidden"
                >
                  <FilterBar
                    fullWidth
                    region={region}
                    category={category}
                    duration={duration}
                    sort={sort}
                    activeFilterCount={activeFilterCount}
                    updateFilter={updateFilter}
                    clearFilters={clearFilters}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ═══ Result Count & Section Header ═══ */}
          <div className="pb-2 pt-2">
            <SectionHeader
              title={`${filteredPackages.length} ${filteredPackages.length === 1 ? 'Package' : 'Packages'} Available`}
              subtitle={
                activeFilterCount > 0
                  ? `Filtered by ${[
                      region && (region === 'domestic' ? 'Domestic' : 'International'),
                      category && category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
                      duration,
                    ].filter(Boolean).join(' · ')}`
                  : undefined
              }
            />
          </div>

          {/* Active filter badges */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pb-4">
              {region && (
                <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 text-xs font-medium hover:bg-teal-500/20 cursor-pointer transition-colors" onClick={() => updateFilter('region', '')}>
                  {region === 'domestic' ? '🇮🇳 Domestic' : '🌏 International'}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              {category && (
                <Badge className={`${getCategoryColor(category)} text-xs font-medium border cursor-pointer transition-colors`} onClick={() => updateFilter('category', '')}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              {duration && (
                <Badge className="bg-white/5 text-gray-300 border-white/10 text-xs font-medium cursor-pointer hover:bg-white/10 transition-colors" onClick={() => updateFilter('duration', '')}>
                  {duration}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
            </div>
          )}

          {/* ═══ Packages Grid ═══ */}
          <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-16 sm:pb-20">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : filteredPackages.length === 0 ? (
              <AnimatedEmptyState onClear={clearFilters} hasFilters={activeFilterCount > 0} />
            ) : (
              filteredPackages.map((pkg, i) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  index={i}
                  isVisible={isVisible}
                  isInWishlist={isInWishlist}
                  addItem={addItem}
                  removeItem={removeItem}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// ─── Page Export with Suspense ───────────────────────────────────
export default function PackagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
          >
            <Compass className="h-8 w-8 text-teal-500/40" />
          </motion.div>
          <p className="mt-3 text-sm text-gray-500">Loading packages...</p>
        </div>
      </div>
    }>
      <PackagesContent />
    </Suspense>
  );
}
