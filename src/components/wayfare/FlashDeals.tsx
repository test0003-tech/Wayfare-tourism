'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Zap,
  Clock,
  Star,
  MapPin,
  Flame,
  ArrowRight,
  Timer,
  Users,
} from 'lucide-react';
import Link from 'next/link';

interface FlashDeal {
  id: string;
  name: string;
  slug: string;
  destination: string;
  image: string;
  price: number;
  originalPrice: number;
  duration: string;
  rating: number;
  category: string;
  spotsLeft: number;
  endsAt: number; // timestamp in ms
}

const flashDeals: FlashDeal[] = [
  {
    id: 'flash-1',
    name: 'Kerala Honeymoon Special',
    slug: 'kerala-honeymoon-special',
    destination: 'Kerala, India',
    image: '/images/destinations/kerala.png',
    price: 22999,
    originalPrice: 29999,
    duration: '4N5D',
    rating: 4.9,
    category: 'Honeymoon',
    spotsLeft: 3,
    endsAt: Date.now() + 86400000 * 2 + 3600000 * 5,
  },
  {
    id: 'flash-2',
    name: 'Maldives Paradise Escape',
    slug: 'maldives-paradise-escape',
    destination: 'Maldives',
    image: '/images/destinations/maldives.png',
    price: 79999,
    originalPrice: 99999,
    duration: '4N5D',
    rating: 4.9,
    category: 'Luxury',
    spotsLeft: 2,
    endsAt: Date.now() + 86400000 + 3600000 * 8,
  },
  {
    id: 'flash-3',
    name: 'Dubai Luxury Experience',
    slug: 'dubai-luxury-experience',
    destination: 'Dubai, UAE',
    image: '/images/destinations/dubai.png',
    price: 59999,
    originalPrice: 74999,
    duration: '5N6D',
    rating: 4.9,
    category: 'Luxury',
    spotsLeft: 5,
    endsAt: Date.now() + 86400000 * 3 + 3600000 * 2,
  },
  {
    id: 'flash-4',
    name: 'Goa Beach Holiday',
    slug: 'goa-beach-holiday',
    destination: 'Goa, India',
    image: '/images/destinations/goa.png',
    price: 12999,
    originalPrice: 16999,
    duration: '4N5D',
    rating: 4.6,
    category: 'Beach',
    spotsLeft: 7,
    endsAt: Date.now() + 86400000 + 3600000 * 14,
  },
];

// Flip-style countdown digit (CSS-driven animation, no setState in effects)
function FlipDigit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden rounded-lg min-w-[2.5rem]">
        <motion.div
          key={value}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-gradient-to-b from-amber-500/25 to-amber-500/10 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] px-2.5 py-1.5 text-center"
          style={{ perspective: 300 }}
        >
          <span className="text-sm sm:text-base font-black text-amber-300">
            {String(value).padStart(2, '0')}
          </span>
        </motion.div>
        {/* Center line for flip effect */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-500/30 pointer-events-none" />
      </div>
      <span className="text-[9px] text-gray-500 mt-0.5 uppercase tracking-wider font-medium">{label}</span>
    </div>
  );
}

function CountdownTimer({ endsAt }: { endsAt: number }) {
  const getTimeLeft = (end: number) => {
    const diff = Math.max(0, end - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endsAt));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(endsAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  const blocks = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hrs' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {blocks.map((block, i) => (
        <div key={block.label} className="flex items-center gap-1.5">
          <FlipDigit value={block.value} label={block.label} />
          {i < blocks.length - 1 && (
            <span className="text-amber-500/70 font-black text-lg -mt-4 animate-pulse">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

// Scarcity progress bar
function ScarcityBar({ spotsLeft, total }: { spotsLeft: number; total: number }) {
  const percentage = Math.round(((total - spotsLeft) / total) * 100);
  const isUrgent = spotsLeft <= 3;

  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] mb-1">
        <span className={`${isUrgent ? 'text-rose-400' : 'text-amber-400'} font-bold`}>
          Only {spotsLeft} left!
        </span>
        <span className="text-gray-500">{percentage}% claimed</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isUrgent
              ? 'bg-gradient-to-r from-rose-500 to-red-500'
              : 'bg-gradient-to-r from-amber-500 to-amber-400'
          }`}
        />
      </div>
    </div>
  );
}

// Animated savings counter
function SavingsDisplay({ amount }: { amount: number }) {
  const [displayAmount, setDisplayAmount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1500;
          const steps = 30;
          const increment = amount / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= amount) {
              setDisplayAmount(amount);
              clearInterval(timer);
            } else {
              setDisplayAmount(Math.floor(current));
            }
          }, duration / steps);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [amount, hasAnimated]);

  return (
    <div ref={ref} className="text-xs text-teal-400 font-semibold mt-0.5">
      Save ₹{displayAmount.toLocaleString('en-IN')} per person!
    </div>
  );
}

export default function FlashDeals() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-gray-950 relative overflow-hidden" id="deals">
      {/* Background effects */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <Badge variant="secondary" className="mb-3 bg-amber-500/10 text-amber-300 border-amber-500/30">
            <Flame className="mr-1 h-3 w-3" />
            Limited Time Offers
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text-gold">Flash Deals</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
            Hurry! These exclusive offers won&apos;t last long. Book now and save big!
          </p>
          {/* Pulsing LIVE indicator */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/30 px-4 py-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
            <span className="text-xs font-black text-rose-300 uppercase tracking-widest">Live Deals</span>
          </div>
        </motion.div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flashDeals.map((deal, i) => {
            const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);
            const savings = deal.originalPrice - deal.price;

            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-2xl glass overflow-hidden tilt-card hover:glow-amber transition-all duration-300 border border-white/5 hover:border-amber-500/20"
              >
                {/* Deal Image */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-transparent" />

                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="rounded-full bg-gradient-to-r from-amber-500 to-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-500/20">
                      <Zap className="inline h-3 w-3 mr-1" />
                      {discount}% OFF
                    </div>
                    <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 text-xs">
                      <Flame className="mr-1 h-3 w-3" />
                      HOT DEAL
                    </Badge>
                  </div>

                  {/* Scarcity Indicator */}
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                    <div className="rounded-full glass px-3 py-1.5 text-xs font-bold text-rose-300 border border-rose-500/30 bg-rose-500/10">
                      Only {deal.spotsLeft} spots left!
                    </div>
                  </div>

                  {/* Countdown */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="rounded-xl glass-strong p-2.5">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-amber-400 shrink-0" />
                        <span className="text-xs text-gray-400 shrink-0 font-medium">Ends in:</span>
                        <CountdownTimer endsAt={deal.endsAt} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deal Info */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <MapPin className="h-3 w-3" />
                    {deal.destination}
                  </div>

                  <h3 className="font-bold text-white text-lg leading-tight group-hover:text-amber-300 transition-colors duration-300">{deal.name}</h3>

                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="glass text-white text-xs">
                      <Clock className="mr-1 h-3 w-3" />
                      {deal.duration}
                    </Badge>
                    <Badge className="bg-teal-500/10 text-teal-300 border-teal-500/20 text-xs">
                      {deal.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-amber-400">{deal.rating}</span>
                    </div>
                  </div>

                  {/* Scarcity Progress Bar */}
                  <ScarcityBar spotsLeft={deal.spotsLeft} total={10} />

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{deal.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                          ₹{deal.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-gray-500">/person</span>
                      </div>
                      <SavingsDisplay amount={savings} />
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-950 font-bold rounded-lg glow-amber shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-shadow duration-300"
                      asChild
                    >
                      <Link href={`/packages/${deal.slug}`}>
                        Grab Deal
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
