'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar, Users, Star, ArrowRight } from 'lucide-react';

const rotatingWords = [
  'Honeymoon in Maldives',
  'Kashmir Adventure',
  'Kerala Backwaters',
  'Dubai Luxury',
  'Goa Beach Vibes',
  'Thailand Explorer',
  'Andaman Escape',
  'Singapore Dreams',
];

const floatingCards = [
  { name: 'Kerala', emoji: '🌴', price: '₹22,999', rating: 4.9, x: 'right-8', y: 'top-[20%]', delay: 0 },
  { name: 'Maldives', emoji: '🏝️', price: '₹79,999', rating: 4.9, x: 'right-4', y: 'top-[45%]', delay: 0.5 },
  { name: 'Dubai', emoji: '🏙️', price: '₹59,999', rating: 4.9, x: 'right-12', y: 'top-[70%]', delay: 1 },
];

function TypingText() {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const wordRef = useRef(rotatingWords[0]);

  useEffect(() => {
    wordRef.current = rotatingWords[wordIndex];
    const word = wordRef.current;
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting && text === word) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && text === '') {
      const nextIdx = (wordIndex + 1) % rotatingWords.length;
      queueMicrotask(() => {
        setWordIndex(nextIdx);
        setIsDeleting(false);
      });
      return;
    }

    const timer = setTimeout(() => {
      setText(isDeleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex]);

  return (
    <span className="gradient-text">
      {text}
      <span className="animate-pulse text-teal-400">|</span>
    </span>
  );
}

// Particle component
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0 ? '#0d9488' : p.id % 3 === 1 ? '#f59e0b' : '#10b981',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const [searchDest, setSearchDest] = useState('');
  const [searchDuration, setSearchDuration] = useState('');
  const [searchTravelers, setSearchTravelers] = useState('');

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

      {/* Particles */}
      <Particles />

      {/* Decorative gradient orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-500/8 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-600/5 rounded-full blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36 w-full">
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
            <span className="block mt-2 h-[1.2em]">
              <TypingText />
            </span>
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
            className="mt-10"
          >
            <div className="rounded-2xl glass-strong p-3 sm:p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 border border-white/5 focus-within:border-teal-500/30 transition-colors">
                  <MapPin className="h-5 w-5 text-teal-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase">Destination</p>
                    <input
                      type="text"
                      value={searchDest}
                      onChange={(e) => setSearchDest(e.target.value)}
                      placeholder="Where to?"
                      className="w-full bg-transparent text-sm font-semibold text-white placeholder:text-gray-600 outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 border border-white/5 focus-within:border-teal-500/30 transition-colors">
                  <Calendar className="h-5 w-5 text-teal-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase">Duration</p>
                    <select
                      value={searchDuration}
                      onChange={(e) => setSearchDuration(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-white outline-none appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-gray-900">Any Duration</option>
                      <option value="4N5D" className="bg-gray-900">4N5D</option>
                      <option value="5N6D" className="bg-gray-900">5N6D</option>
                      <option value="6N7D" className="bg-gray-900">6N7D</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 border border-white/5 focus-within:border-teal-500/30 transition-colors">
                  <Users className="h-5 w-5 text-teal-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase">Travelers</p>
                    <select
                      value={searchTravelers}
                      onChange={(e) => setSearchTravelers(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-white outline-none appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-gray-900">Travelers</option>
                      <option value="1" className="bg-gray-900">1 Adult</option>
                      <option value="2" className="bg-gray-900">2 Adults</option>
                      <option value="family" className="bg-gray-900">Family</option>
                      <option value="group" className="bg-gray-900">Group</option>
                    </select>
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

        {/* Floating Destination Cards (Desktop only) */}
        <div className="hidden xl:block">
          {floatingCards.map((card) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 + card.delay }}
              className={`absolute ${card.x} ${card.y} w-52`}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: card.delay }}
                className="rounded-2xl glass-strong p-4 hover:glow-teal transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{card.emoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{card.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-amber-400">{card.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Starting from</p>
                    <p className="text-lg font-bold text-amber-400">{card.price}</p>
                  </div>
                  <a href="#packages" className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold transition-colors">
                    Explore <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
