'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Destination } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight, Flame, Heart, Clock, ThermometerSun, Snowflake } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist';

// Premium destination card styles
const destStyles = `
@keyframes dest-border-glow {
  0%, 100% { border-color: rgba(13,148,136,0.15); }
  50% { border-color: rgba(13,148,136,0.5); }
}
@keyframes trending-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(249,115,22,0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 15px rgba(249,115,22,0.3); }
}
.trending-badge {
  animation: trending-pulse 2s ease-in-out infinite;
}
@keyframes price-highlight {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
@keyframes gradient-border-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.dest-card-wrapper {
  position: relative;
  border-radius: 1rem;
  padding: 2px;
  background: transparent;
  transition: all 0.4s ease;
}
.dest-card-wrapper:hover {
  background: linear-gradient(135deg, rgba(13,148,136,0.5), rgba(245,158,11,0.5), rgba(13,148,136,0.5));
  background-size: 300% 300%;
  animation: gradient-border-flow 3s ease infinite;
}
.dest-card-inner {
  border-radius: calc(1rem - 2px);
  overflow: hidden;
}
`;

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

const destinationDurations: Record<string, string> = {
  'Kerala': '5-7 days',
  'Kashmir': '6-8 days',
  'Goa': '3-5 days',
  'Rajasthan': '5-7 days',
  'Himachal Pradesh': '5-6 days',
  'Andaman': '5-7 days',
  'Maldives': '4-5 days',
  'Dubai': '4-5 days',
  'Thailand': '5-7 days',
  'Singapore': '4-5 days',
  'Bali': '5-7 days',
  'Sri Lanka': '5-6 days',
  'Malaysia': '5-6 days',
  'Mauritius': '5-7 days',
  'Vietnam': '6-8 days',
  'Turkey': '7-9 days',
  'Switzerland': '7-10 days',
  'Italy': '7-10 days',
};

const destinationWeather: Record<string, { icon: 'sun' | 'snow'; temp: string }> = {
  'Kerala': { icon: 'sun', temp: '28°C' },
  'Kashmir': { icon: 'snow', temp: '12°C' },
  'Goa': { icon: 'sun', temp: '30°C' },
  'Rajasthan': { icon: 'sun', temp: '32°C' },
  'Himachal Pradesh': { icon: 'snow', temp: '15°C' },
  'Andaman': { icon: 'sun', temp: '29°C' },
  'Maldives': { icon: 'sun', temp: '30°C' },
  'Dubai': { icon: 'sun', temp: '35°C' },
  'Thailand': { icon: 'sun', temp: '32°C' },
  'Singapore': { icon: 'sun', temp: '31°C' },
  'Bali': { icon: 'sun', temp: '29°C' },
  'Sri Lanka': { icon: 'sun', temp: '30°C' },
  'Malaysia': { icon: 'sun', temp: '31°C' },
  'Mauritius': { icon: 'sun', temp: '27°C' },
  'Vietnam': { icon: 'sun', temp: '28°C' },
  'Turkey': { icon: 'sun', temp: '22°C' },
  'Switzerland': { icon: 'snow', temp: '8°C' },
  'Italy': { icon: 'sun', temp: '20°C' },
};

const popularDestinations = ['Kerala', 'Kashmir', 'Goa'];

export default function HomeDestinations() {
  const [domestic, setDomestic] = useState<Destination[]>([]);
  const [international, setInternational] = useState<Destination[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { addItem, removeItem, isInWishlist } = useWishlist();

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
  const getDuration = (name: string) => destinationDurations[name] || null;
  const getWeather = (name: string) => destinationWeather[name] || null;
  const isPopular = (name: string) => popularDestinations.includes(name);

  const renderDestinationCard = (dest: Destination, index: number, delayOffset: number) => {
    const weather = getWeather(dest.name);
    const duration = getDuration(dest.name);
    const price = getPrice(dest.name);
    const popular = isPopular(dest.name);
    const wishlisted = isInWishlist(dest.id);

    return (
      <motion.div
        key={dest.id}
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.08 + delayOffset }}
      >
        <div className="dest-card-wrapper">
          <div className="dest-card-inner">
            <Link
              href={`/destinations/${dest.slug}`}
              className="group relative overflow-hidden aspect-[3/4] tilt-card cursor-pointer block"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.12]"
              />
              {/* Rich gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Trending Badge with Animated Fire */}
              {popular && (
                <div className="absolute top-3 left-3 z-10 trending-badge">
                  <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg shadow-orange-500/30">
                    <Flame className="h-3 w-3 animate-pulse" />
                    Trending
                  </div>
                </div>
              )}

              {/* Weather Indicator */}
              {weather && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="flex items-center gap-1 rounded-full glass px-2 py-1 text-[10px] font-bold text-white">
                    {weather.icon === 'sun' ? (
                      <ThermometerSun className="h-3 w-3 text-amber-400" />
                    ) : (
                      <Snowflake className="h-3 w-3 text-cyan-400" />
                    )}
                    {weather.temp}
                  </div>
                </div>
              )}

              {/* Wishlist Heart */}
              <button
                className={`absolute top-3 right-3 mt-8 flex h-7 w-7 items-center justify-center rounded-full glass transition-all duration-200 z-10 ${
                  wishlisted
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'text-gray-300 hover:bg-white/20 hover:text-rose-400'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (wishlisted) {
                    removeItem(dest.id);
                  } else {
                    addItem({
                      id: dest.id,
                      name: dest.name,
                      destination: `${dest.name}, ${dest.country}`,
                      image: dest.image,
                      price: 0,
                      duration: duration || '',
                      rating: 4.5,
                      category: dest.region,
                    });
                  }
                }}
              >
                <Heart className={`h-3.5 w-3.5 ${wishlisted ? 'fill-rose-400' : ''}`} />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <h3 className="text-sm sm:text-lg font-extrabold text-white leading-tight tracking-tight">
                  {dest.name}
                </h3>
                <p className="mt-0.5 text-xs text-amber-400/80 font-medium">
                  {dest.tagline}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    {price && (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400">From</span>
                        <span className="text-sm font-extrabold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                          {price}
                        </span>
                      </div>
                    )}
                  </div>
                  {duration && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                      <Clock className="h-2.5 w-2.5" />
                      {duration} ideal
                    </div>
                  )}
                </div>
                {dest._count && (
                  <p className="mt-1 text-[10px] text-gray-500 font-medium">
                    {dest._count.packages} packages available
                  </p>
                )}
              </div>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: destStyles }} />
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
              {domestic.map((dest, i) => renderDestinationCard(dest, i, 0))}
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
              {international.map((dest, i) => renderDestinationCard(dest, i, 0.3))}
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
    </>
  );
}
