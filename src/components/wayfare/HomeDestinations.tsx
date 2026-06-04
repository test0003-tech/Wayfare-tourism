'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Destination } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight, Flame } from 'lucide-react';

const destinationPrices: Record<string, string> = {
  'Kerala': '₹18,999',
  'Kashmir': '₹22,999',
  'Goa': '₹11,999',
  'Rajasthan': '₹15,999',
  'Himachal Pradesh': '₹14,499',
  'Andaman': '₹24,999',
  'Maldives': '₹64,999',
  'Dubai': '₹49,999',
  'Thailand': '₹29,999',
  'Singapore': '₹39,999',
  'Bali': '₹34,999',
  'Sri Lanka': '₹27,999',
  'Malaysia': '₹32,999',
  'Mauritius': '₹54,999',
  'Vietnam': '₹26,999',
  'Turkey': '₹59,999',
  'Switzerland': '₹89,999',
  'Italy': '₹79,999',
};

const popularDestinations = ['Kerala', 'Kashmir', 'Goa'];

export default function HomeDestinations() {
  const [domestic, setDomestic] = useState<Destination[]>([]);
  const [international, setInternational] = useState<Destination[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/destinations?region=domestic')
      .then((res) => res.json())
      .then((data) => setDomestic(data.slice(0, 5)))
      .catch(console.error);
    fetch('/api/destinations?region=international')
      .then((res) => res.json())
      .then((data) => setInternational(data.slice(0, 4)))
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

  const getPrice = (name: string) => destinationPrices[name] || null;
  const isPopular = (name: string) => popularDestinations.includes(name);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Domestic Destinations */}
        <div className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Badge variant="secondary" className="mb-3 glass text-teal-300 border-teal-500/30">
                <MapPin className="mr-1 h-3 w-3" />
                🇮🇳 India Tours
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold">
                <span className="gradient-text">Domestic Destinations</span>
              </h2>
            </div>
            <Link href="/destinations?region=domestic" className="hidden sm:flex items-center gap-1 text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
            {domestic.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[3/4] tilt-card cursor-pointer block"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/40 to-transparent" />

                  {/* Popular Badge */}
                  {isPopular(dest.name) && (
                    <div className="absolute top-3 left-3 z-10">
                      <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                        <span className="animate-flame">🔥</span> Popular
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                      {dest.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-amber-400/80 font-medium">
                      {dest.tagline}
                    </p>
                    {getPrice(dest.name) && (
                      <p className="mt-1.5 text-xs font-semibold text-teal-400">
                        Starting from {getPrice(dest.name)}
                      </p>
                    )}
                    {dest._count && (
                      <p className="mt-0.5 text-xs text-gray-500 font-medium">
                        {dest._count.packages} packages available
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Link href="/destinations?region=domestic">
              <Button variant="outline" className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300 hover:border-teal-500/50 rounded-xl gap-2">
                View All Destinations <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* International Destinations */}
        <div>
          <div className="flex items-end justify-between mb-8">
            <div>
              <Badge variant="secondary" className="mb-3 glass text-amber-300 border-amber-500/30">
                <MapPin className="mr-1 h-3 w-3" />
                🌏 International
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold">
                <span className="gradient-text">International Destinations</span>
              </h2>
            </div>
            <Link href="/destinations?region=international" className="hidden sm:flex items-center gap-1 text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {international.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 + 0.3 }}
              >
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[3/4] tilt-card cursor-pointer block"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/40 to-transparent" />

                  {/* Popular Badge for international top 3 */}
                  {i < 3 && (
                    <div className="absolute top-3 left-3 z-10">
                      <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                        <span className="animate-flame">🔥</span> Popular
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                      {dest.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-amber-400/80 font-medium">
                      {dest.tagline}
                    </p>
                    {getPrice(dest.name) && (
                      <p className="mt-1.5 text-xs font-semibold text-teal-400">
                        Starting from {getPrice(dest.name)}
                      </p>
                    )}
                    {dest._count && (
                      <p className="mt-0.5 text-xs text-gray-500 font-medium">
                        {dest._count.packages} packages available
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Link href="/destinations?region=international">
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500/50 rounded-xl gap-2">
                View All Destinations <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
