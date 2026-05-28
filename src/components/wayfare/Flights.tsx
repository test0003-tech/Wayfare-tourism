'use client';

import { useEffect, useState } from 'react';
import { FlightDeal } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, ArrowRight, Tag } from 'lucide-react';

export default function Flights() {
  const [flights, setFlights] = useState<FlightDeal[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('/api/flights')
      .then((res) => res.json())
      .then((data) => setFlights(data))
      .catch(console.error);
  }, []);

  const displayed = showAll ? flights : flights.slice(0, 6);

  const getDiscount = (flight: FlightDeal) => {
    if (!flight.originalPrice) return 0;
    return Math.round(((flight.originalPrice - flight.price) / flight.originalPrice) * 100);
  };

  return (
    <section className="py-16 sm:py-20" id="flights">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 bg-teal-50 text-teal-700 border-teal-200">
            ✈️ Flight Deals
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Best Flight Deals
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-lg">
            Affordable round-trip flights from major Indian cities to top destinations
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((flight) => {
            const discount = getDiscount(flight);
            return (
              <Card
                key={flight.id}
                className="group overflow-hidden border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative h-32 overflow-hidden bg-gradient-to-br from-teal-600 to-emerald-600">
                  <img
                    src={flight.image}
                    alt={`${flight.from} to ${flight.to}`}
                    className="h-full w-full object-cover opacity-40 mix-blend-overlay"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-4 text-white">
                      <div className="text-center">
                        <p className="text-lg sm:text-xl font-bold">{flight.from}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Plane className="h-5 w-5 rotate-0 text-amber-300" />
                        <div className="mt-1 w-16 sm:w-24 border-t border-dashed border-white/50" />
                        <span className="mt-0.5 text-[10px] uppercase tracking-wider text-white/80">
                          {flight.type}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-lg sm:text-xl font-bold">{flight.to}</p>
                      </div>
                    </div>
                  </div>

                  {discount > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                      <Tag className="h-3 w-3" />
                      {discount}% OFF
                    </div>
                  )}
                </div>

                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{flight.airline}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{flight.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      {flight.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{flight.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{flight.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">/person</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
                    >
                      Book Flight
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {flights.length > 6 && (
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(!showAll)}
              className="border-teal-200 text-teal-700 hover:bg-teal-50 rounded-xl"
            >
              {showAll ? 'Show Less' : `View All ${flights.length} Flight Deals`}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
