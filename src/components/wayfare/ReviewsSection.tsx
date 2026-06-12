'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MessageSquarePlus,
  Quote,
  Filter,
} from 'lucide-react';

interface Review {
  id: number;
  name: string;
  avatar: string;
  location: string;
  destination: string;
  tripName: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  category: string;
  photos: number;
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    avatar: 'RS',
    location: 'Delhi, India',
    destination: 'Kerala',
    tripName: 'Kerala Honeymoon Special',
    rating: 5,
    text: 'Absolutely magical experience! The houseboat in Alleppey was the highlight of our honeymoon. The team arranged a candlelight dinner on the boat which was beyond our expectations. Highly recommended for couples!',
    date: '2 weeks ago',
    verified: true,
    category: 'Honeymoon',
    photos: 8,
  },
  {
    id: 2,
    name: 'Priya Menon',
    avatar: 'PM',
    location: 'Mumbai, India',
    destination: 'Maldives',
    tripName: 'Maldives Paradise Escape',
    rating: 5,
    text: 'From the moment we landed to the farewell, everything was seamless. The overwater villa was breathtaking. Wayfare handled all the transfers and activities perfectly. Worth every rupee!',
    date: '1 month ago',
    verified: true,
    category: 'Luxury',
    photos: 12,
  },
  {
    id: 3,
    name: 'Amit Patel',
    avatar: 'AP',
    location: 'Ahmedabad, India',
    destination: 'Dubai',
    tripName: 'Dubai Luxury Experience',
    rating: 4,
    text: 'Great value for money package! The desert safari and Burj Khalifa visit were unforgettable. The hotel was premium and well-located. Only suggestion: add more shopping time at Dubai Mall.',
    date: '3 weeks ago',
    verified: true,
    category: 'Luxury',
    photos: 6,
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    avatar: 'SR',
    location: 'Hyderabad, India',
    destination: 'Kashmir',
    tripName: 'Kashmir Valley Explorer',
    rating: 5,
    text: 'Kashmir is truly paradise on earth! The shikara ride on Dal Lake and the gondola ride in Gulmarg were surreal. Our guide was extremely knowledgeable. Would love to visit again in winter!',
    date: '1 week ago',
    verified: true,
    category: 'Adventure',
    photos: 15,
  },
  {
    id: 5,
    name: 'Vikram Joshi',
    avatar: 'VJ',
    location: 'Pune, India',
    destination: 'Goa',
    tripName: 'Goa Beach Holiday',
    rating: 4,
    text: 'Perfect family vacation! Kids loved the beach activities and the spice plantation tour. The resort had great amenities. The Baga beach party was a bonus. Good for a quick getaway!',
    date: '2 months ago',
    verified: true,
    category: 'Beach',
    photos: 9,
  },
  {
    id: 6,
    name: 'Ananya Gupta',
    avatar: 'AG',
    location: 'Bangalore, India',
    destination: 'Thailand',
    tripName: 'Thailand Explorer',
    rating: 5,
    text: 'Thailand was amazing! From the temples in Bangkok to the beaches in Phuket, every day was an adventure. The street food tour was a fantastic addition. Wayfare planned everything flawlessly.',
    date: '3 weeks ago',
    verified: true,
    category: 'Adventure',
    photos: 20,
  },
  {
    id: 7,
    name: 'Rohit Nair',
    avatar: 'RN',
    location: 'Chennai, India',
    destination: 'Andaman',
    tripName: 'Andaman Island Escape',
    rating: 5,
    text: 'The scuba diving experience was out of this world! Radhanagar Beach is the most beautiful beach I have ever seen. The team arranged everything including PADI certification. Incredible trip!',
    date: '1 month ago',
    verified: true,
    category: 'Adventure',
    photos: 11,
  },
  {
    id: 8,
    name: 'Kavita Desai',
    avatar: 'KD',
    location: 'Jaipur, India',
    destination: 'Singapore',
    tripName: 'Singapore Dreams Tour',
    rating: 4,
    text: 'Perfect for families with kids! Universal Studios and Gardens by the Bay were the highlights. The itinerary was well-balanced between sightseeing and leisure. Clean and well-organized.',
    date: '5 weeks ago',
    verified: true,
    category: 'Family',
    photos: 7,
  },
  {
    id: 9,
    name: 'Arjun Mehta',
    avatar: 'AM',
    location: 'Kolkata, India',
    destination: 'Bali',
    tripName: 'Bali Temple & Beach Tour',
    rating: 5,
    text: 'Bali exceeded all our expectations! The Tegallalang rice terraces and Uluwatu temple at sunset were magical. The private pool villa was the perfect romantic touch. Will definitely book again!',
    date: '2 weeks ago',
    verified: true,
    category: 'Honeymoon',
    photos: 14,
  },
  {
    id: 10,
    name: 'Deepa Krishnan',
    avatar: 'DK',
    location: 'Coimbatore, India',
    destination: 'Sri Lanka',
    tripName: 'Sri Lanka Cultural Trip',
    rating: 4,
    text: 'Rich cultural experience! Sigiriya rock fortress was awe-inspiring. The tea gardens in Nuwara Eliya were beautiful. The local cuisine was a delightful surprise. Very well-curated itinerary.',
    date: '6 weeks ago',
    verified: true,
    category: 'Adventure',
    photos: 10,
  },
  {
    id: 11,
    name: 'Suresh Iyer',
    avatar: 'SI',
    location: 'Madurai, India',
    destination: 'Manali',
    tripName: 'Manali Adventure Package',
    rating: 5,
    text: 'The paragliding in Solang Valley was thrilling! Rohtang Pass was breathtaking. Our hotel had stunning mountain views. The bonfire evening was a perfect end to each adventurous day.',
    date: '3 weeks ago',
    verified: true,
    category: 'Adventure',
    photos: 8,
  },
  {
    id: 12,
    name: 'Nisha Bhatt',
    avatar: 'NB',
    location: 'Surat, India',
    destination: 'Dubai',
    tripName: 'Dubai Family Fun Tour',
    rating: 5,
    text: 'Kids had the time of their lives! From Ferrari World to the Dubai Aquarium, every activity was perfect for families. The hotel was kids-friendly with amazing pools. Five stars all around!',
    date: '1 month ago',
    verified: true,
    category: 'Family',
    photos: 16,
  },
];

const categories = ['All', 'Honeymoon', 'Luxury', 'Adventure', 'Beach', 'Family'];

const avatarColors = [
  'from-teal-400 to-emerald-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
  'from-blue-400 to-indigo-500',
  'from-purple-400 to-fuchsia-500',
  'from-green-400 to-teal-500',
];

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sz} ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [currentReview, setCurrentReview] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filteredReviews = useMemo(() => {
    if (activeCategory === 'All') return reviews;
    return reviews.filter((r) => r.category === activeCategory);
  }, [activeCategory]);

  // Reset current review when category changes
  useEffect(() => {
    const timer = setTimeout(() => setCurrentReview(0), 0);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  useEffect(() => {
    if (isAutoPlaying && filteredReviews.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentReview((prev) => (prev + 1) % filteredReviews.length);
      }, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, filteredReviews.length]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % filteredReviews.length);
    setIsAutoPlaying(false);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
    setIsAutoPlaying(false);
  };

  const review = filteredReviews[currentReview];

  return (
    <section className="py-16 sm:py-20 bg-gray-950 relative overflow-hidden" id="reviews">
      {/* Background effects */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge variant="secondary" className="mb-3 bg-teal-500/10 text-teal-300 border-teal-500/30">
            <Star className="mr-1 h-3 w-3 fill-amber-400 text-amber-400" />
            Traveler Reviews
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">What Our Travelers Say</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
            Real stories from real travelers. Over 10,000 happy customers trust Wayfare.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          <Filter className="h-4 w-4 text-gray-500 mt-2 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 glow-teal'
                  : 'glass text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Review Card */}
        {review && (
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl glass-strong p-6 sm:p-8 relative"
              >
                {/* Quote icon */}
                <Quote className="absolute top-4 right-6 h-12 w-12 text-teal-500/10" />

                {/* Rating & Verification */}
                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={review.rating} size="md" />
                  {review.verified && (
                    <Badge className="bg-teal-500/10 text-teal-300 border-teal-500/20 text-xs gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Booking
                    </Badge>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 italic">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Reviewer Info */}
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${
                      avatarColors[review.id % avatarColors.length]
                    } text-white font-bold text-sm shrink-0`}
                  >
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white">{review.name}</h4>
                    </div>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-teal-400">{review.tripName}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>

                {/* Photos count */}
                {review.photos > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-gray-500">
                      📸 {review.photos} travel photos shared
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevReview}
                  className="rounded-full border-white/10 hover:bg-white/5 hover:border-teal-500/30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextReview}
                  className="rounded-full border-white/10 hover:bg-white/5 hover:border-teal-500/30"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Dots indicator */}
              <div className="flex gap-1.5">
                {filteredReviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentReview(i);
                      setIsAutoPlaying(false);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentReview ? 'w-6 bg-teal-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                className="rounded-full border-teal-500/30 text-teal-400 hover:bg-teal-500/10 text-sm"
              >
                <MessageSquarePlus className="h-4 w-4 mr-1.5" />
                Write a Review
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
