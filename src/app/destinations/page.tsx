'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Destination } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Globe, Plane } from 'lucide-react';
import PageHero from '@/components/wayfare/PageHero';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import PageTransition from '@/components/wayfare/PageTransition';

const regionTabs = [
  { value: '', label: 'All', icon: Globe },
  { value: 'domestic', label: 'Domestic', icon: MapPin },
  { value: 'international', label: 'International', icon: Plane },
] as const;

function DestinationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [fetchedRegion, setFetchedRegion] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

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
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  const handleRegionChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('region', value);
    } else {
      params.delete('region');
    }
    router.push(`/destinations?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const filteredDestinations = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.country.toLowerCase().includes(search.toLowerCase()) ||
    d.tagline.toLowerCase().includes(search.toLowerCase())
  );

  const domesticCount = destinations.filter((d) => d.region === 'domestic').length;
  const internationalCount = destinations.filter((d) => d.region === 'international').length;

  return (
    <PageTransition>
      <PageHero
        badge="Explore Destinations"
        badgeIcon={MapPin}
        title="Explore Stunning Destinations"
        subtitle="From the snow-capped Himalayas to pristine island beaches — discover your perfect getaway"
        backgroundImage="/images/hero.png"
      />

      <div className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Destinations' }]} />

          {/* Region Filter Tabs & Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-2 flex-wrap">
              {regionTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = region === tab.value;
                const count = tab.value === ''
                  ? destinations.length
                  : tab.value === 'domestic'
                    ? domesticCount
                    : internationalCount;

                return (
                  <button
                    key={tab.value}
                    onClick={() => handleRegionChange(tab.value)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg glow-teal'
                        : 'glass text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    <span className={`ml-1 text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search destinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 glass border-white/10 bg-transparent text-gray-100 placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20 rounded-xl"
              />
            </div>
          </div>

          {/* Result Count */}
          <div className="flex items-center justify-between pb-4">
            <p className="text-sm text-gray-400">
              Showing <span className="text-teal-400 font-semibold">{filteredDestinations.length}</span>{' '}
              {filteredDestinations.length === 1 ? 'destination' : 'destinations'}
              {region && (
                <span>
                  {' '}in{' '}
                  <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 text-xs font-medium ml-1">
                    {region === 'domestic' ? '🇮🇳 Domestic' : '🌏 International'}
                  </Badge>
                </span>
              )}
            </p>
          </div>

          {/* Destinations Grid */}
          <div ref={gridRef} className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-16 sm:pb-20">
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="relative overflow-hidden rounded-2xl aspect-[4/5] animate-shimmer bg-white/5" />
              ))
            ) : filteredDestinations.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <MapPin className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-400">No destinations found</h3>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredDestinations.map((dest, i) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
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

                    {/* Region Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`text-xs font-semibold border ${
                        dest.region === 'domestic'
                          ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {dest.region === 'domestic' ? '🇮🇳 India' : '🌏 International'}
                      </Badge>
                    </div>

                    {/* Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                        {dest.name}
                      </h3>
                      <p className="mt-0.5 text-xs sm:text-sm text-amber-400/80 font-medium">
                        {dest.tagline}
                      </p>
                      {dest._count && (
                        <div className="mt-1.5 flex items-center gap-2">
                          {dest._count.packages > 0 && (
                            <span className="text-xs text-teal-400 font-medium">
                              {dest._count.packages} {dest._count.packages === 1 ? 'package' : 'packages'}
                            </span>
                          )}
                          {dest._count.hotels > 0 && (
                            <span className="text-xs text-amber-400/60 font-medium">
                              {dest._count.hotels} {dest._count.hotels === 1 ? 'hotel' : 'hotels'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-shimmer w-48 h-6 rounded bg-white/5" />
      </div>
    }>
      <DestinationsContent />
    </Suspense>
  );
}
