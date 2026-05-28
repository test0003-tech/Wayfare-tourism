'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    title: '10 Best Honeymoon Destinations in India for 2025',
    category: 'Honeymoon',
    excerpt: 'From the backwaters of Kerala to the snowy valleys of Kashmir, discover the most romantic destinations...',
    image: '/images/blog/honeymoon-guide.png',
    date: 'Dec 15, 2024',
    readTime: '8 min',
  },
  {
    title: 'Ultimate Guide to Budget-Friendly International Trips',
    category: 'Budget',
    excerpt: 'Who says international travel has to break the bank? Explore Thailand, Vietnam, and Sri Lanka...',
    image: '/images/blog/budget-travel.png',
    date: 'Dec 10, 2024',
    readTime: '6 min',
  },
  {
    title: 'Adventure Sports in India You Must Try in 2025',
    category: 'Adventure',
    excerpt: 'Paragliding in Manali, rafting in Rishikesh, scuba in Andaman — India is an adventure paradise...',
    image: '/images/blog/adventure-tips.png',
    date: 'Dec 5, 2024',
    readTime: '7 min',
  },
  {
    title: 'Top 7 Luxury Hotels That Are Worth Every Penny',
    category: 'Luxury',
    excerpt: 'From overwater villas in Maldives to palace hotels in Kashmir, these stays redefine luxury...',
    image: '/images/blog/luxury-hotels.png',
    date: 'Nov 28, 2024',
    readTime: '5 min',
  },
  {
    title: 'Essential Travel Tips for First-Time International Flyers',
    category: 'Tips',
    excerpt: 'Passport, visa, insurance, packing — everything you need to know before your first trip abroad...',
    image: '/images/blog/travel-tips.png',
    date: 'Nov 20, 2024',
    readTime: '10 min',
  },
  {
    title: 'Why Goa Should Be Your Next Beach Vacation',
    category: 'Beach',
    excerpt: 'Sun, sand, seafood, and spirituality — Goa offers an unmatched coastal experience...',
    image: '/images/destinations/goa.png',
    date: 'Nov 15, 2024',
    readTime: '6 min',
  },
];

const categoryColors: Record<string, string> = {
  Honeymoon: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Budget: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  Adventure: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Luxury: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Tips: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Beach: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export default function Blog() {
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
    <section ref={sectionRef} className="py-16 sm:py-20 bg-gradient-to-b from-gray-900 to-gray-950" id="blog">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 glass text-teal-300 border-teal-500/30">
            ✍️ Blog
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">Travel Stories & Tips</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
            Expert insights, destination guides, and travel inspiration
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass rounded-2xl overflow-hidden tilt-card transition-all duration-300 hover:glow-teal cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge className={`${categoryColors[post.category] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'} text-xs font-semibold border`}>
                    {post.category}
                  </Badge>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime} read
                  </span>
                </div>

                <h3 className="font-bold text-white text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-teal-300 transition-colors">
                  {post.title}
                </h3>

                <p className="mt-2 text-sm text-gray-400 line-clamp-2">{post.excerpt}</p>

                <div className="mt-4 flex items-center text-sm font-medium text-teal-400 group-hover:text-teal-300 transition-colors">
                  Read More
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
