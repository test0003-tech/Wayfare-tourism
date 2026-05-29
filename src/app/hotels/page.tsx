'use client';

import { useEffect, useState, useRef, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Hotel as HotelType } from '@/lib/types';
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

const ITEMS_PER_PAGE = 9;

const categories = ['All', 'Luxury', 'Boutique', 'Heritage', 'Resort'];
const starOptions = ['All', '5', '4', '3'];
const sortOptions = [
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'rating-asc', label: 'Lowest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'stars-desc', label: 'Most Stars' },
];

function HotelsContent() {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [stars, setStars] = useState('All');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
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

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.destination.name.toLowerCase().includes(q) ||
          h.destination.country.toLowerCase().includes(q)
      );
    }

    // Stars filter
    if (stars !== 'All') {
      const starNum = parseInt(stars);
      result = result.filter((h) => h.stars >= starNum);
    }

    // Sort
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

  // Reset page when filters change
  useEffect(() => { queueMicrotask(() => setPage(1)); }, [searchQuery, category, stars, sortBy]);

  const getStars = (count: number) => '★'.repeat(count);

  return (
    <PageTransition>
      <div className="bg-gray-950 min-h-screen">
        <PageHero
          badge="Premium Stays"
          badgeIcon={HotelIcon}
          title="Hotels & Resorts"
          subtitle="Handpicked luxury hotels, boutique resorts & heritage stays"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Hotels' }]} />

          {/* Filters Section */}
          <div className="mb-8 glass rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="h-4 w-4 text-teal-400" />
              <span className="text-sm font-semibold text-gray-300">Filter & Search</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search hotels..."
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

              {/* Stars */}
              <Select value={stars} onValueChange={setStars}>
                <SelectTrigger className="bg-white/5 border-white/10 text-gray-100 w-full">
                  <SelectValue placeholder="Star Rating" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {starOptions.map((s) => (
                    <SelectItem key={s} value={s} className="text-gray-200 focus:bg-white/10 focus:text-teal-400">
                      {s === 'All' ? 'All Ratings' : `${s} Stars & Up`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                    <div className="h-5 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                    <div className="flex gap-2">
                      <div className="h-5 w-12 bg-white/5 rounded-full" />
                      <div className="h-5 w-12 bg-white/5 rounded-full" />
                      <div className="h-5 w-12 bg-white/5 rounded-full" />
                    </div>
                    <div className="h-9 bg-white/5 rounded-lg" />
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

                  return (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                    >
                      <Card className="group overflow-hidden border-0 glass rounded-2xl tilt-card transition-all duration-300 hover:glow-amber streak-effect">
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

                          <div className="absolute top-3 right-3 rounded-full bg-amber-500/20 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-amber-400 shadow-lg border border-amber-500/20">
                            {getStars(hotel.stars)}
                          </div>

                          <div className="absolute bottom-3 left-3">
                            <Badge className="glass text-white text-xs font-semibold border-0">
                              {hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                            <MapPin className="h-3 w-3 text-teal-400" />
                            {hotel.destination.name}, {hotel.destination.country}
                          </div>

                          <h3 className="font-bold text-white text-base sm:text-lg leading-tight">
                            {hotel.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-400 line-clamp-2">{hotel.description}</p>

                          {/* Amenities */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {amenities.map((amenity, idx) => {
                              const Icon = amenityIcons[amenity.trim()] || null;
                              return (
                                <span key={idx} className="flex items-center gap-1 text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/5">
                                  {Icon && <Icon className="h-3 w-3" />}
                                  {amenity.trim()}
                                </span>
                              );
                            })}
                          </div>

                          {/* Rating & Price */}
                          <div className="mt-4 flex items-end justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 rounded-md bg-teal-500/10 px-2 py-0.5">
                                <Star className="h-3.5 w-3.5 fill-teal-400 text-teal-400" />
                                <span className="text-xs font-bold text-teal-400">{hotel.rating}</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                ({hotel.reviewCount} reviews)
                              </span>
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

                          <Button
                            asChild
                            className="w-full mt-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-lg font-semibold glow-teal"
                          >
                            <a href={`/hotels/${hotel.slug}`}>Book Hotel</a>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-teal-400 rounded-lg disabled:opacity-40"
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <Button
                      key={idx}
                      variant={page === idx + 1 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(idx + 1)}
                      className={
                        page === idx + 1
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg'
                          : 'border-white/10 text-gray-300 hover:bg-white/5 hover:text-teal-400 rounded-lg'
                      }
                    >
                      {idx + 1}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-teal-400 rounded-lg disabled:opacity-40"
                  >
                    Next
                  </Button>
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
