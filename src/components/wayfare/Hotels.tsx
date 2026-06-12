'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Hotel as HotelType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Star,
  MapPin,
  Wifi,
  Waves,
  UtensilsCrossed,
  Dumbbell,
  Car,
  Snowflake,
  ShieldCheck,
  XCircle,
  Award,
  Heart,
} from 'lucide-react';
import { useWishlist } from '@/lib/wishlist';

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

// Premium hotel card styles
const hotelStyles = `
@keyframes hotel-shimmer {
  0% { transform: translateX(-100%) rotate(15deg); }
  100% { transform: translateX(200%) rotate(15deg); }
}
.hotel-shimmer-effect {
  position: relative;
  overflow: hidden;
}
.hotel-shimmer-effect::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -100%;
  width: 60%;
  height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
  transform: rotate(15deg);
  pointer-events: none;
  z-index: 1;
}
.hotel-shimmer-effect:hover::after {
  animation: hotel-shimmer 0.8s ease-out;
}
@keyframes free-cancel-shine {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.free-cancel-badge {
  animation: free-cancel-shine 3s ease-in-out infinite;
}
`;

export default function Hotels() {
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { addItem, removeItem, isInWishlist } = useWishlist();

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

  const isTopRated = (hotel: HotelType) => hotel.rating >= 4.8 && hotel.stars >= 4;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: hotelStyles }} />
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
                  <Card className="group overflow-hidden border border-white/5 glass tilt-card transition-all duration-500 hotel-shimmer-effect hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.12]"
                      />
                      {/* Mesh gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {discount > 0 && (
                        <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-1 text-xs font-bold text-gray-950 shadow-lg glow-amber">
                          {discount}% OFF
                        </div>
                      )}

                      {/* Star Rating Display */}
                      <div className="absolute top-3 right-3 flex items-center gap-0.5 rounded-full bg-amber-500/20 backdrop-blur-sm px-2.5 py-1 shadow-lg border border-amber-500/20">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= hotel.stars
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Free Cancellation Badge */}
                      <div className="absolute bottom-12 left-3 free-cancel-badge">
                        <div className="flex items-center gap-1 rounded-full bg-emerald-500/20 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                          <XCircle className="h-3 w-3" />
                          Free Cancellation
                        </div>
                      </div>

                      {/* Category */}
                      <div className="absolute bottom-3 left-3">
                        <Badge className="glass text-white text-xs font-semibold border-0">
                          {hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1)}
                        </Badge>
                      </div>

                      {/* Top Rated Badge */}
                      {isTopRated(hotel) && (
                        <div className="absolute top-3 left-3 mt-8">
                          <div className="flex items-center gap-1 rounded-full bg-amber-500/20 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/20">
                            <Award className="h-2.5 w-2.5" />
                            Top Rated
                          </div>
                        </div>
                      )}

                      {/* Wishlist Heart */}
                      <button
                        className={`absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full glass transition-all duration-200 z-10 ${
                          isInWishlist(hotel.id)
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'text-gray-300 hover:bg-white/20 hover:text-rose-400'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isInWishlist(hotel.id)) {
                            removeItem(hotel.id);
                          } else {
                            addItem({
                              id: hotel.id,
                              name: hotel.name,
                              destination: `${hotel.destination.name}, ${hotel.destination.country}`,
                              image: hotel.image,
                              price: hotel.pricePerNight,
                              duration: '',
                              rating: hotel.rating,
                              category: hotel.category,
                            });
                          }
                        }}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(hotel.id) ? 'fill-rose-400' : ''}`} />
                      </button>
                    </div>

                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <MapPin className="h-3 w-3 text-teal-400" />
                        {hotel.destination.name}, {hotel.destination.country}
                      </div>

                      <h3 className="font-bold text-white text-base sm:text-lg leading-tight group-hover:text-amber-300 transition-colors duration-300">
                        {hotel.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-400 line-clamp-2">{hotel.description}</p>

                      {/* Amenities Icons Row */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {amenities.map((amenity, idx) => {
                          const Icon = amenityIcons[amenity.trim()] || null;
                          return (
                            <span key={idx} className="flex items-center gap-1 text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/5 hover:border-amber-500/20 hover:text-amber-300 transition-colors duration-200">
                              {Icon && <Icon className="h-3 w-3" />}
                              {amenity.trim()}
                            </span>
                          );
                        })}
                      </div>

                      {/* Rating & Price */}
                      <div className="mt-4 flex items-end justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-teal-500/15 to-emerald-500/15 px-2.5 py-1 border border-teal-500/20">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= Math.round(hotel.rating)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-bold text-teal-300">{hotel.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            ({hotel.reviewCount})
                          </span>
                        </div>
                        <div className="text-right">
                          {hotel.originalPrice && (
                            <span className="text-sm text-gray-500 line-through block">
                              ₹{hotel.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                              ₹{hotel.pricePerNight.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500">/night</span>
                          </div>
                          {hotel.originalPrice && (
                            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                              Save ₹{(hotel.originalPrice - hotel.pricePerNight).toLocaleString()}/night
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Trust Badge */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[10px] text-teal-400/80 font-medium">
                          <ShieldCheck className="h-3 w-3" />
                          ✓ Verified Hotel
                        </div>
                      </div>

                      <Button className="w-full mt-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-shadow duration-300">
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
    </>
  );
}
