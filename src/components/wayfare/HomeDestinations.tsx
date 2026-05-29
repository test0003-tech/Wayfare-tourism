'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Destination } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight } from 'lucide-react';

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

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Domestic Destinations */}
        <div className="mb-12">
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
                  className="group relative overflow-hidden rounded-2xl aspect-[4/5] tilt-card cursor-pointer block"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                      {dest.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-amber-400/80 font-medium">
                      {dest.tagline}
                    </p>
                    {dest._count && (
                      <p className="mt-1 text-xs text-teal-400 font-medium">
                        {dest._count.packages} packages
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <Link href="/destinations?region=domestic" className="sm:hidden flex items-center justify-center gap-1 text-sm font-medium text-teal-400 mt-4">
            View All Domestic <ArrowRight className="h-4 w-4" />
          </Link>
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
                  className="group relative overflow-hidden rounded-2xl aspect-[4/5] tilt-card cursor-pointer block"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                      {dest.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-amber-400/80 font-medium">
                      {dest.tagline}
                    </p>
                    {dest._count && (
                      <p className="mt-1 text-xs text-teal-400 font-medium">
                        {dest._count.packages} packages
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <Link href="/destinations?region=international" className="sm:hidden flex items-center justify-center gap-1 text-sm font-medium text-teal-400 mt-4">
            View All International <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
