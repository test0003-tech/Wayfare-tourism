'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, Search } from 'lucide-react';
import PageHero from '@/components/wayfare/PageHero';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import PageTransition from '@/components/wayfare/PageTransition';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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

const categories = ['All', 'Honeymoon', 'Budget', 'Adventure', 'Luxury', 'Tips', 'Beach'];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filtered = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageTransition>
      <div className="bg-gray-950 min-h-screen">
        <PageHero
          badge="Travel Stories"
          badgeIcon={BookOpen}
          title="Blog & Travel Tips"
          subtitle="Expert insights, destination guides, and travel inspiration to fuel your wanderlust"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Blog' }]} />

          <section ref={sectionRef} className="py-8 sm:py-12">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                />
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === cat
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white glow-teal'
                        : 'glass text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((post, i) => (
                  <motion.article
                    key={post.title}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
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
              </AnimatePresence>
            </div>

            {/* No results */}
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}

            {/* Newsletter CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 rounded-2xl glass-strong p-8 sm:p-12 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-[80px]" />
              <div className="relative">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Never Miss a <span className="gradient-text">Travel Story</span>
                </h3>
                <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                  Subscribe to our newsletter and get the latest travel tips, destination guides, and exclusive deals delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    className="flex-1 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                  />
                  <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
