'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gray-950 min-h-screen flex items-center">
      {/* Background Image Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.png"
          alt="Beautiful travel destination"
          className="h-full w-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/80 to-gray-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/50" />
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-500/8 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-600/5 rounded-full blur-[150px]" />

      {/* Particle-like decorative dots */}
      <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-teal-400 rounded-full animate-float" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-amber-400 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-teal-300 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-2/3 right-1/2 w-2 h-2 bg-amber-300/50 rounded-full animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-gray-300"
          >
            <MapPin className="h-4 w-4 text-teal-400" />
            Explore India & Beyond
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl leading-tight"
          >
            Discover Your Perfect
            <span className="block gradient-text mt-2">Travel Experience</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg text-gray-400 sm:text-xl max-w-2xl leading-relaxed"
          >
            From Kashmir to Kanyakumari, Dubai to Bali — handcrafted travel packages
            for honeymooners, families, and adventurers. Your dream vacation starts here.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 animate-float"
          >
            <div className="rounded-2xl glass-strong p-3 sm:p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 border border-white/5">
                  <MapPin className="h-5 w-5 text-teal-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">Destination</p>
                    <p className="text-sm font-semibold text-white truncate">Where to?</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 border border-white/5">
                  <Calendar className="h-5 w-5 text-teal-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">Duration</p>
                    <p className="text-sm font-semibold text-white truncate">4N5D - 6N7D</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 border border-white/5">
                  <Users className="h-5 w-5 text-teal-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">Travelers</p>
                    <p className="text-sm font-semibold text-white truncate">2 Adults</p>
                  </div>
                </div>
                <Button
                  className="h-auto bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl py-2.5 glow-teal font-bold animate-pulse-glow"
                  asChild
                >
                  <a href="#packages">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex flex-wrap gap-8"
          >
            {[
              { value: '500+', label: 'Travel Packages' },
              { value: '50+', label: 'Destinations' },
              { value: '10K+', label: 'Happy Travelers' },
              { value: '4.8★', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold sm:text-3xl gradient-text-gold">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
