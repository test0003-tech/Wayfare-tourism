'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MapPin, Users, Star, Heart, Building2 } from 'lucide-react';

const stats = [
  { value: 500, suffix: '+', label: 'Travel Packages', icon: TrendingUp, color: 'text-teal-400', bgColor: 'bg-teal-500/10' },
  { value: 50, suffix: '+', label: 'Destinations', icon: MapPin, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  { value: 10000, suffix: '+', label: 'Happy Travelers', icon: Users, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  { value: 4.8, suffix: '★', label: 'Average Rating', icon: Star, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  { value: 98, suffix: '%', label: 'Customer Satisfaction', icon: Heart, color: 'text-rose-400', bgColor: 'bg-rose-500/10' },
  { value: 500, suffix: '+', label: 'Hotel Partners', icon: Building2, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
];

const partners = ['Taj Hotels', 'Emirates', 'Singapore Airlines', 'Marriott', 'Thai Airways'];

function CountUpNumber({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current * 10) / 10);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, inView]);

  const display = Number.isInteger(value) ? Math.floor(count).toLocaleString() : count.toFixed(1);

  return (
    <span>
      {display}{suffix}
    </span>
  );
}

export default function Portfolio() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-gray-950 relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-teal-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-600/3 rounded-full blur-[200px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 glass text-amber-300 border-amber-500/30">
            🏆 Our Journey
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">Our Journey in Numbers</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
            Trusted by thousands of travelers worldwide
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-5 sm:p-6 text-center tilt-card transition-all duration-300 hover:glow-teal"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} mb-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <p className={`text-3xl sm:text-4xl font-bold ${stat.color}`}>
                <CountUpNumber value={stat.value} suffix={stat.suffix} inView={isInView} />
              </p>
              <p className="mt-1 text-sm text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Trusted By */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">Trusted By</p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            {partners.map((partner) => (
              <div
                key={partner}
                className="glass rounded-xl px-6 py-3 text-gray-400 font-semibold text-sm sm:text-base hover:text-teal-400 hover:border-teal-500/20 transition-all duration-300"
              >
                {partner}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
