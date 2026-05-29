'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Heart, Mountain, Users, Umbrella, Trees, Waves } from 'lucide-react';

const categories = [
  {
    id: 'honeymoon',
    name: 'Honeymoon',
    icon: Heart,
    glowColor: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-400',
    borderHover: 'hover:border-rose-500/30',
    description: 'Romantic getaways for couples with private dinners, spa & more',
  },
  {
    id: 'adventure',
    name: 'Adventure',
    icon: Mountain,
    glowColor: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-400',
    borderHover: 'hover:border-orange-500/30',
    description: 'Trekking, rafting, paragliding & thrilling outdoor activities',
  },
  {
    id: 'family',
    name: 'Family',
    icon: Users,
    glowColor: 'hover:shadow-[0_0_30px_rgba(13,148,136,0.3)]',
    iconBg: 'bg-teal-500/10',
    iconColor: 'text-teal-400',
    borderHover: 'hover:border-teal-500/30',
    description: 'Kid-friendly destinations with activities for all ages',
  },
  {
    id: 'pilgrimage',
    name: 'Pilgrimage',
    icon: Umbrella,
    glowColor: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    borderHover: 'hover:border-amber-500/30',
    description: 'Spiritual journeys to sacred temples and holy sites',
  },
  {
    id: 'wildlife',
    name: 'Wildlife',
    icon: Trees,
    glowColor: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    borderHover: 'hover:border-emerald-500/30',
    description: 'Safari tours, nature reserves & exotic wildlife spotting',
  },
  {
    id: 'beach',
    name: 'Beach',
    icon: Waves,
    glowColor: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    borderHover: 'hover:border-cyan-500/30',
    description: 'Sun, sand & surf — tropical beach escapes & water sports',
  },
];

export default function PackageCategories() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 glass text-amber-300 border-amber-500/30">
            ✨ Travel Styles
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">Choose Your Travel Style</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
            Whether you seek romance, adventure, or relaxation — we have the perfect package for you
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.a
              key={cat.id}
              href={`/packages?category=${cat.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl glass p-5 sm:p-6 transition-all duration-300 tilt-card ${cat.borderHover} ${cat.glowColor}`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${cat.iconBg} transition-all duration-300 group-hover:scale-110`}>
                  <cat.icon className={`h-6 w-6 ${cat.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-base sm:text-lg">{cat.name}</h3>
                  <p className="mt-1 text-sm text-gray-400 line-clamp-2">{cat.description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-teal-400 group-hover:text-teal-300 transition-colors">
                Explore packages
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
