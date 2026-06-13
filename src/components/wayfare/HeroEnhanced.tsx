'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  ShieldCheck,
  Phone,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

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

const destinationImages = [
  { src: '/images/destinations/maldives.png', name: 'Maldives' },
  { src: '/images/destinations/kashmir.png', name: 'Kashmir' },
  { src: '/images/destinations/kerala.png', name: 'Kerala' },
  { src: '/images/destinations/dubai.png', name: 'Dubai' },
  { src: '/images/destinations/goa.png', name: 'Goa' },
  { src: '/images/destinations/thailand.png', name: 'Thailand' },
  { src: '/images/destinations/bali.png', name: 'Bali' },
  { src: '/images/destinations/singapore.png', name: 'Singapore' },
];

const floatingCards = [
  { name: 'Kerala', emoji: '🌴', price: '₹22,999', from: '₹18,999', rating: 4.9, x: 'right-6', y: 'top-[18%]', delay: 0 },
  { name: 'Maldives', emoji: '🏝️', price: '₹79,999', from: '₹64,999', rating: 4.9, x: 'right-2', y: 'top-[43%]', delay: 0.5 },
  { name: 'Dubai', emoji: '🏙️', price: '₹59,999', from: '₹49,999', rating: 4.9, x: 'right-10', y: 'top-[68%]', delay: 1 },
];

const autocompleteSuggestions = [
  'Kerala Backwaters', 'Kashmir Valley', 'Maldives Honeymoon', 'Dubai Luxury Tour',
  'Goa Beach Holiday', 'Thailand Explorer', 'Andaman Islands', 'Singapore City Tour',
  'Bali Temple Tour', 'Sri Lanka Cultural Trip', 'Manali Adventure', 'Rajasthan Heritage',
  'Nepal Trekking', 'Vietnam Explorer', 'Malaysia Tour', 'Sikkim Himalayan',
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
    <span className="gradient-text text-5xl sm:text-6xl lg:text-8xl font-black">
      {text}
      <span className="animate-pulse text-teal-400">|</span>
    </span>
  );
}

function Particles() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.1,
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
            y: [0, -40, 0],
            x: [0, (p.id % 2 === 0 ? 10 : -10), 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
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

function RotatingImageBackground() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % destinationImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={destinationImages[currentIdx].src}
            alt={destinationImages[currentIdx].name}
            className="h-full w-full object-cover opacity-15 mix-blend-overlay"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/80 to-gray-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/50" />

      {/* Image indicator dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {destinationImages.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIdx ? 'w-6 bg-teal-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
            }`}
            whileHover={{ scale: 1.2 }}
            aria-label={`Show ${destinationImages[i].name}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HeroEnhanced() {
  const [searchDest, setSearchDest] = useState('');
  const [searchDuration, setSearchDuration] = useState('');
  const [searchTravelers, setSearchTravelers] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchInput = useCallback((value: string) => {
    setSearchDest(value);
    if (value.length > 0) {
      const filtered = autocompleteSuggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchDest(suggestion);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gray-950 min-h-screen flex items-center">
      {/* Video Background Placeholder */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero.png"
          className="h-full w-full object-cover opacity-10"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-beach-with-waves-1196-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Rotating Destination Image Background */}
      <RotatingImageBackground />

      {/* Pulsing gradient background animation */}
      <div className="absolute inset-0 hero-gradient-bg opacity-60" />

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
            Explore India &amp; Beyond
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl leading-tight"
          >
            Discover Your Perfect
            <span className="block mt-2 min-h-[1.3em]">
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

          {/* Enhanced Search Bar with Autocomplete */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10"
          >
            <div className="rounded-2xl glass-strong p-3 sm:p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <div className="relative" ref={searchRef}>
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 border border-white/5 focus-within:border-teal-500/30 transition-colors">
                    <MapPin className="h-5 w-5 text-teal-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-medium text-gray-500 uppercase">Destination</p>
                      <input
                        type="text"
                        value={searchDest}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        onFocus={() => {
                          if (searchDest.length > 0 && filteredSuggestions.length > 0) {
                            setShowSuggestions(true);
                          }
                        }}
                        placeholder="Where to?"
                        className="w-full bg-transparent text-sm font-semibold text-white placeholder:text-gray-600 outline-none"
                      />
                    </div>
                  </div>
                  {/* Autocomplete Dropdown */}
                  <AnimatePresence>
                    {showSuggestions && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 rounded-xl glass-strong border border-white/10 overflow-hidden z-50 max-h-48 overflow-y-auto"
                      >
                        {filteredSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-teal-400 transition-colors flex items-center gap-2"
                          >
                            <MapPin className="h-3.5 w-3.5 text-teal-500/60 shrink-0" />
                            {suggestion}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                  <Link href="/packages">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Start Planning CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6"
          >
            <Button
              variant="outline"
              className="rounded-full border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300 font-semibold gap-2 group"
              asChild
            >
              <Link href="/quiz">
                <Sparkles className="h-4 w-4" />
                Start Planning with AI
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
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

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-6 flex flex-wrap items-center gap-4"
          >
            <div className="flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-teal-400" />
              <span className="text-gray-300 font-medium">Verified by 10,000+ Travelers</span>
            </div>
            <div className="flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
              <Phone className="h-4 w-4 text-amber-400" />
              <span className="text-gray-300 font-medium">24/7 Support</span>
            </div>
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
              className={`absolute ${card.x} ${card.y} w-64`}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: card.delay }}
                className="rounded-2xl glass-strong p-5 hover:glow-teal transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{card.emoji}</span>
                  <div>
                    <h4 className="text-base font-bold text-white">{card.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-amber-400">{card.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Starting from</p>
                    <p className="text-xl font-bold text-amber-400">{card.from}</p>
                  </div>
                  <Link href="/packages" className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold transition-colors">
                    Explore <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
