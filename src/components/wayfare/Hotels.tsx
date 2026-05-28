'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    fetch('/api/hotels?featured=true')
      .then((res) => res.json())
      .then((data) => setHotels(data))
      .catch(console.error);
  }, []);

  const displayed = showAll ? hotels : hotels.slice(0, 6);

  const getStars = (count: number) => '★'.repeat(count);

  return (
    <section className="py-16 sm:py-20 bg-gray-50" id="hotels">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 bg-teal-50 text-teal-700 border-teal-200">
            🏨 Premium Stays
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Featured Hotels & Resorts
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-lg">
            Handpicked luxury hotels, boutique resorts & heritage stays for a comfortable journey
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((hotel) => {
            const amenities = hotel.amenities.split(',').slice(0, 4);
            const discount = hotel.originalPrice
              ? Math.round(((hotel.originalPrice - hotel.pricePerNight) / hotel.originalPrice) * 100)
              : 0;

            return (
              <Card
                key={hotel.id}
                className="group overflow-hidden border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {discount > 0 && (
                    <div className="absolute top-3 left-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                      {discount}% OFF
                    </div>
                  )}

                  <div className="absolute top-3 right-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-900 shadow-lg">
                    {getStars(hotel.stars)}
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm text-xs font-semibold">
                      {hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1)}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <MapPin className="h-3 w-3" />
                    {hotel.destination.name}, {hotel.destination.country}
                  </div>

                  <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">
                    {hotel.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{hotel.description}</p>

                  {/* Amenities */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {amenities.map((amenity, i) => {
                      const Icon = amenityIcons[amenity.trim()] || null;
                      return (
                        <span key={i} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {Icon && <Icon className="h-3 w-3" />}
                          {amenity.trim()}
                        </span>
                      );
                    })}
                  </div>

                  {/* Rating & Price */}
                  <div className="mt-4 flex items-end justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5">
                        <Star className="h-3.5 w-3.5 fill-teal-500 text-teal-500" />
                        <span className="text-xs font-bold text-teal-700">{hotel.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({hotel.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="text-right">
                      {hotel.originalPrice && (
                        <span className="text-sm text-gray-400 line-through block">
                          ₹{hotel.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{hotel.pricePerNight.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">/night</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg">
                    Book Hotel
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {hotels.length > 6 && (
          <div className="mt-10 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(!showAll)}
              className="border-teal-200 text-teal-700 hover:bg-teal-50 rounded-xl"
            >
              {showAll ? 'Show Less' : `View All ${hotels.length} Hotels`}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
