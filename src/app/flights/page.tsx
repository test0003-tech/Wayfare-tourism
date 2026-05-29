'use client';

import { useEffect, useState, useRef, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FlightDeal } from '@/lib/types';
import PageHero from '@/components/wayfare/PageHero';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import PageTransition from '@/components/wayfare/PageTransition';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Plane,
  ArrowRight,
  Tag,
  PlaneIcon,
  Filter,
} from 'lucide-react';

const flightTypes = ['All', 'Round Trip', 'One Way'];
const ITEMS_PER_PAGE = 9;

function FlightsContent() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<FlightDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
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
    if (typeFilter === 'All') return flights;
    return flights.filter((f) => f.type === typeFilter);
  }, [flights, typeFilter]);

  useEffect(() => { queueMicrotask(() => setPage(1)); }, [typeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getDiscount = (flight: FlightDeal) => {
    if (!flight.originalPrice) return 0;
    return Math.round(((flight.originalPrice - flight.price) / flight.originalPrice) * 100);
  };

  return (
    <PageTransition>
      <div className="bg-gray-950 min-h-screen">
        <PageHero
          badge="Flight Deals"
          badgeIcon={PlaneIcon}
          title="Best Flight Deals"
          subtitle="Affordable round-trip flights from major Indian cities to top destinations"
          backgroundImage="/images/flights-hero.png"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Flights' }]} />

          {/* Filter Section */}
          <div className="mb-8 glass rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-teal-400" />
              <span className="text-sm font-semibold text-gray-300">Filter by Type</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {flightTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    typeFilter === type
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white glow-teal'
                      : 'glass text-gray-300 hover:text-teal-400 hover:bg-white/5'
                  }`}
                >
                  {type === 'All' ? 'All Flights' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing <span className="text-teal-400 font-semibold">{paginated.length}</span> of{' '}
              <span className="text-teal-400 font-semibold">{filtered.length}</span> flight deals
            </p>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-32 bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                    <div className="flex justify-between">
                      <div className="h-6 bg-white/5 rounded w-1/3" />
                      <div className="h-8 bg-white/5 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20">
              <Plane className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No flights found</h3>
              <p className="text-gray-500 mb-4">Try changing your filter</p>
              <Button
                variant="outline"
                onClick={() => setTypeFilter('All')}
                className="border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-xl"
              >
                Show All Flights
              </Button>
            </div>
          ) : (
            <>
              {/* Flight Cards Grid */}
              <div ref={sectionRef} className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((flight, i) => {
                  const discount = getDiscount(flight);
                  return (
                    <motion.div
                      key={flight.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                    >
                      <Card className="group overflow-hidden border-0 glass rounded-2xl tilt-card transition-all duration-300 hover:glow-teal streak-effect">
                        <div className="relative h-32 overflow-hidden bg-gradient-to-br from-teal-600/30 to-emerald-600/20">
                          <img
                            src={flight.image}
                            alt={`${flight.from} to ${flight.to}`}
                            className="h-full w-full object-cover opacity-30 mix-blend-overlay"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex items-center gap-4 text-white">
                              <div className="text-center">
                                <p className="text-lg sm:text-xl font-bold">{flight.from}</p>
                              </div>
                              <div className="flex flex-col items-center">
                                <Plane className="h-5 w-5 rotate-0 text-amber-400" />
                                <div className="mt-1 w-16 sm:w-24 h-0.5 bg-gradient-to-r from-teal-400 to-amber-400 rounded-full" />
                                <span className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-400">
                                  {flight.type}
                                </span>
                              </div>
                              <div className="text-center">
                                <p className="text-lg sm:text-xl font-bold">{flight.to}</p>
                              </div>
                            </div>
                          </div>

                          {discount > 0 && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-1 text-xs font-bold text-gray-950 shadow-lg glow-amber">
                              <Tag className="h-3 w-3" />
                              {discount}% OFF
                            </div>
                          )}

                          {flight.featured && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 backdrop-blur-sm text-xs font-semibold">
                                Featured
                              </Badge>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white">{flight.airline}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{flight.description}</p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-end justify-between">
                            <div>
                              {flight.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{flight.originalPrice.toLocaleString()}
                                </span>
                              )}
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-amber-400">
                                  ₹{flight.price.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500">/person</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-lg font-semibold"
                            >
                              Book Flight
                              <ArrowRight className="ml-1 h-3.5 w-3.5" />
                            </Button>
                          </div>
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

export default function FlightsPage() {
  return (
    <Suspense fallback={
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    }>
      <FlightsContent />
    </Suspense>
  );
}
