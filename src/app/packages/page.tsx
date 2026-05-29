'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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

const getDiscount = (pkg: Package) => {
  if (!pkg.originalPrice) return 0;
  return Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
};

// FilterBar component declared outside render to satisfy lint rule
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
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Region Filter */}
      <Select value={region || '_all'} onValueChange={(v) => updateFilter('region', v === '_all' ? '' : v)}>
        <SelectTrigger className={`${fullWidth ? 'w-full' : 'w-[160px]'} glass border-white/10 bg-transparent text-gray-100 rounded-xl h-10`}>
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

      {/* Category Filter */}
      <Select value={category || '_all'} onValueChange={(v) => updateFilter('category', v === '_all' ? '' : v)}>
        <SelectTrigger className={`${fullWidth ? 'w-full' : 'w-[170px]'} glass border-white/10 bg-transparent text-gray-100 rounded-xl h-10`}>
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

      {/* Duration Filter */}
      <Select value={duration || '_all'} onValueChange={(v) => updateFilter('duration', v === '_all' ? '' : v)}>
        <SelectTrigger className={`${fullWidth ? 'w-full' : 'w-[150px]'} glass border-white/10 bg-transparent text-gray-100 rounded-xl h-10`}>
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

      {/* Sort */}
      <Select value={sort} onValueChange={(v) => updateFilter('sort', v)}>
        <SelectTrigger className={`${fullWidth ? 'w-full' : 'w-[170px]'} glass border-white/10 bg-transparent text-gray-100 rounded-xl h-10`}>
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
          className="text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl"
        >
          <X className="mr-1 h-3.5 w-3.5" />
          Clear ({activeFilterCount})
        </Button>
      )}
    </div>
  );
}

function PackagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [fetchedKey, setFetchedKey] = useState<string>('');
  const [search, setSearch] = useState('');
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
        // Apply sorting client-side
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

          {/* Desktop Filter Bar */}
          <div className="hidden lg:flex flex-col gap-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-teal-400" />
                <span className="text-sm font-medium text-gray-300">Filters</span>
                {activeFilterCount > 0 && (
                  <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 text-xs">
                    {activeFilterCount} active
                  </Badge>
                )}
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search packages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 glass border-white/10 bg-transparent text-gray-100 placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20 rounded-xl h-10"
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

          {/* Mobile Filter Area */}
          <div className="lg:hidden py-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search packages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 glass border-white/10 bg-transparent text-gray-100 placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20 rounded-xl h-10"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="shrink-0 border-white/10 text-teal-400 hover:bg-white/5 rounded-xl h-10 w-10 relative"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass rounded-xl p-4 space-y-3"
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
          </div>

          {/* Result Count */}
          <div className="flex items-center justify-between pb-4">
            <p className="text-sm text-gray-400">
              Showing <span className="text-teal-400 font-semibold">{filteredPackages.length}</span>{' '}
              {filteredPackages.length === 1 ? 'package' : 'packages'}
              {(region || category || duration) && (
                <span>
                  {' '}with{' '}
                  {[
                    region && <Badge key="r" className="bg-teal-500/10 text-teal-400 border-teal-500/20 text-xs font-medium mx-0.5">{region === 'domestic' ? 'Domestic' : 'International'}</Badge>,
                    category && <Badge key="c" className={`${getCategoryColor(category)} text-xs font-medium border mx-0.5`}>{category.charAt(0).toUpperCase() + category.slice(1)}</Badge>,
                    duration && <Badge key="d" className="bg-white/5 text-gray-300 border-white/10 text-xs font-medium mx-0.5">{duration}</Badge>,
                  ].filter(Boolean).reduce((acc, el, i) => i === 0 ? [el] : [...acc, ' + ', el], [] as React.ReactNode[])}
                </span>
              )}
            </p>
          </div>

          {/* Packages Grid */}
          <div ref={gridRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-16 sm:pb-20">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden glass">
                  <div className="aspect-[16/10] animate-shimmer bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="animate-shimmer h-4 w-20 rounded bg-white/5" />
                    <div className="animate-shimmer h-6 w-3/4 rounded bg-white/5" />
                    <div className="animate-shimmer h-4 w-1/2 rounded bg-white/5" />
                  </div>
                </div>
              ))
            ) : filteredPackages.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <Compass className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-400">No packages found</h3>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search</p>
                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-4 border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-xl"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              filteredPackages.map((pkg, i) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
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

                        {/* Discount Badge */}
                        {pkg.originalPrice && getDiscount(pkg) > 0 && (
                          <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-1 text-xs font-bold text-gray-950 shadow-lg glow-amber">
                            {getDiscount(pkg)}% OFF
                          </div>
                        )}

                        {/* Duration Badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full glass px-2.5 py-1 text-xs font-bold text-white">
                          <Clock className="h-3 w-3" />
                          {pkg.duration}
                        </div>

                        {/* Category Badge */}
                        <div className="absolute bottom-3 left-3">
                          <Badge className={`${getCategoryColor(pkg.category)} text-xs font-semibold border`}>
                            {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1).replace('-', ' ')}
                          </Badge>
                        </div>

                        {/* Heart / Wishlist */}
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
                        {/* Destination */}
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                          <MapPin className="h-3 w-3" />
                          {pkg.destination.name}, {pkg.destination.country}
                        </div>

                        {/* Name */}
                        <h3 className="font-bold text-white text-base sm:text-lg leading-tight line-clamp-2">
                          {pkg.name}
                        </h3>

                        {/* Highlights */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {pkg.highlights.split(',').slice(0, 3).map((h, idx) => (
                            <span key={idx} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/5">
                              {h.trim()}
                            </span>
                          ))}
                        </div>

                        {/* Rating */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex items-center gap-1 rounded-md bg-teal-500/10 px-2 py-0.5">
                            <Star className="h-3.5 w-3.5 fill-teal-400 text-teal-400" />
                            <span className="text-xs font-bold text-teal-400">{pkg.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            ({pkg.reviewCount.toLocaleString()} reviews)
                          </span>
                        </div>

                        {/* Price & CTA */}
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
              ))
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-shimmer w-48 h-6 rounded bg-white/5" />
      </div>
    }>
      <PackagesContent />
    </Suspense>
  );
}
