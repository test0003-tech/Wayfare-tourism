'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya & Rahul Sharma',
    location: 'Mumbai',
    trip: 'Kashmir Honeymoon',
    rating: 5,
    text: 'Our Kashmir honeymoon was absolutely magical! The houseboat stay on Dal Lake and the private shikara ride were dreams come true. Wayfare planned every detail perfectly.',
    avatar: '👩‍❤️‍👨',
    happyNote: 'Best honeymoon ever — still dreaming of Dal Lake!',
  },
  {
    name: 'Ankit Verma',
    location: 'Delhi',
    trip: 'Dubai Luxury',
    rating: 5,
    text: 'Dubai was breathtaking! From the top of Burj Khalifa to the desert safari, every moment was unforgettable. The hotel was world-class and the itinerary was well-paced.',
    avatar: '👨',
    happyNote: 'Burj Khalifa view from our room was insane!',
  },
  {
    name: 'Deepika Patel',
    location: 'Ahmedabad',
    trip: 'Maldives Honeymoon',
    rating: 5,
    text: 'Maldives exceeded all our expectations! The overwater villa was luxurious, the snorkeling was incredible, and the sunset dolphin cruise was magical. Best honeymoon ever!',
    avatar: '👰',
    happyNote: 'Sunset dolphin cruise was pure magic!',
  },
];

export default function HomeTestimonials() {
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
    <section ref={sectionRef} className="py-16 sm:py-20 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3 glass text-amber-300 border-amber-500/30">
            💬 Happy Notes
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold">
            <span className="gradient-text">What Our Travelers Say</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 tilt-card transition-all duration-300 hover:glow-teal"
            >
              <Quote className="h-8 w-8 text-teal-500/30 mb-3" />
              <p className="text-gray-300 text-sm leading-relaxed">{t.text}</p>

              <div className="mt-3 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
                <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <span>✨</span> Happy Note
                </p>
                <p className="text-sm text-amber-300/80 mt-0.5 italic">&ldquo;{t.happyNote}&rdquo;</p>
              </div>

              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 ${
                      j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-700'
                    }`}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/10 text-lg border border-teal-500/20">
                  {t.avatar}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location} • {t.trip}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
