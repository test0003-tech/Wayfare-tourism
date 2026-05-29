'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Hotel as HotelType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Wifi, Waves, UtensilsCrossed, Dumbbell, Car, Snowflake } from 'lucide-react';

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

export default function Hotels() {
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/hotels?featured=true')
      .then((res) => res.json())
      .then((data) => setHotels(data))
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

  const displayed = showAll ? hotels : hotels.slice(0, 6);

  const getStars = (count: number) => '★'.repeat(count);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-gray-900" id="hotels">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 glass text-amber-300 border-amber-500/30">
            🏨 Premium Stays
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">Featured Hotels & Resorts</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
            Handpicked luxury hotels, boutique resorts & heritage stays for a comfortable journey
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((hotel, i) => {
            const amenities = hotel.amenities.split(',').slice(0, 4);
            const discount = hotel.originalPrice
              ? Math.round(((hotel.originalPrice - hotel.pricePerNight) / hotel.originalPrice) * 100)
              : 0;

            return (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="group overflow-hidden border-0 glass tilt-card transition-all duration-300 hover:glow-amber">
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

                    <Button className="w-full mt-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-lg font-semibold glow-teal">
                      Book Hotel
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {hotels.length > 6 && (
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(!showAll)}
              className="border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-xl"
            >
              {showAll ? 'Show Less' : `View All ${hotels.length} Hotels`}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
