'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FlightDeal } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, ArrowRight, Tag } from 'lucide-react';

export default function Flights() {
  const [flights, setFlights] = useState<FlightDeal[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/flights')
      .then((res) => res.json())
      .then((data) => setFlights(data))
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

  const displayed = showAll ? flights : flights.slice(0, 6);

  const getDiscount = (flight: FlightDeal) => {
    if (!flight.originalPrice) return 0;
    return Math.round(((flight.originalPrice - flight.price) / flight.originalPrice) * 100);
  };

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-gradient-to-b from-gray-950 to-gray-900" id="flights">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 glass text-teal-300 border-teal-500/30">
            ✈️ Flight Deals
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">Best Flight Deals</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
            Affordable round-trip flights from major Indian cities to top destinations
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((flight, i) => {
            const discount = getDiscount(flight);
            return (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="group overflow-hidden border-0 glass tilt-card transition-all duration-300 hover:glow-teal">
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

        {flights.length > 6 && (
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(!showAll)}
              className="border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-xl"
            >
              {showAll ? 'Show Less' : `View All ${flights.length} Flight Deals`}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
