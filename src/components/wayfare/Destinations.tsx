'use client';

import { useEffect, useState } from 'react';
import { Destination } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

export default function Destinations({ region }: { region: 'domestic' | 'international' }) {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetch(`/api/destinations?region=${region}`)
      .then((res) => res.json())
      .then((data) => setDestinations(data))
      .catch(console.error);
  }, [region]);

  const title = region === 'domestic' ? 'Domestic Destinations' : 'International Destinations';
  const subtitle = region === 'domestic'
    ? 'Explore the incredible beauty of India — from the snow-capped Himalayas to pristine southern beaches'
    : 'Discover exotic destinations near India — paradise islands, vibrant cities, and cultural wonders';

  return (
    <section className="py-16 sm:py-20" id={region === 'domestic' ? 'domestic' : 'international'}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 bg-teal-50 text-teal-700 border-teal-200">
            <MapPin className="mr-1 h-3 w-3" />
            {region === 'domestic' ? '🇮🇳 India' : '🌏 Asia & Beyond'}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-lg">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {destinations.map((dest) => (
            <a
              key={dest.id}
              href="#packages"
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100 transition-transform hover:scale-[1.02] hover:shadow-xl"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {dest.name}
                </h3>
                <p className="mt-0.5 text-xs sm:text-sm text-gray-200">
                  {dest.tagline}
                </p>
                {dest._count && (
                  <p className="mt-1 text-xs text-teal-300 font-medium">
                    {dest._count.packages} packages available
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
