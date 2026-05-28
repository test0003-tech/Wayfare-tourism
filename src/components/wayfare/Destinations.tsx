'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Destination } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

export default function Destinations({ region }: { region: 'domestic' | 'international' }) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/destinations?region=${region}`)
      .then((res) => res.json())
      .then((data) => setDestinations(data))
      .catch(console.error);
  }, [region]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const title = region === 'domestic' ? 'Domestic Destinations' : 'International Destinations';
  const subtitle = region === 'domestic'
    ? 'Explore the incredible beauty of India — from the snow-capped Himalayas to pristine southern beaches'
    : 'Discover exotic destinations near India — paradise islands, vibrant cities, and cultural wonders';

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
      id={region === 'domestic' ? 'domestic' : 'international'}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 glass text-teal-300 border-teal-500/30">
            <MapPin className="mr-1 h-3 w-3" />
            {region === 'domestic' ? '🇮🇳 India' : '🌏 Asia & Beyond'}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">{title}</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {destinations.map((dest, i) => (
            <motion.a
              key={dest.id}
              href="#packages"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] tilt-card cursor-pointer"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-transparent" />
              <div className="absolute inset-0 glass opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {dest.name}
                </h3>
                <p className="mt-0.5 text-xs sm:text-sm text-amber-400/80 font-medium">
                  {dest.tagline}
                </p>
                {dest._count && (
                  <p className="mt-1 text-xs text-teal-400 font-medium">
                    {dest._count.packages} packages available
                  </p>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
