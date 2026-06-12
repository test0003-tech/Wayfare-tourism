'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Search,
  Star,
  TrendingUp,
  Mail,
} from 'lucide-react';
import PageHero from '@/components/wayfare/PageHero';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import PageTransition from '@/components/wayfare/PageTransition';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { blogCategories, categoryColors } from '@/lib/blog-data';
import type { BlogPost } from '@/lib/blog-data';

const POSTS_PER_PAGE = 6;

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [allRes, featuredRes, recentRes] = await Promise.all([
          fetch('/api/blog'),
          fetch('/api/blog?featured=true'),
          fetch('/api/blog'),
        ]);
        const allData = await allRes.json();
        const featuredData = await featuredRes.json();
        const recentData = await recentRes.json();

        setPosts(allData);
        setFeaturedPosts(featuredData);
        setRecentPosts(recentData.slice(0, 5));
      } catch {
        // fallback — data will be empty
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = posts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visiblePosts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  }, []);

  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [activeCategory, searchQuery]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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

          {/* Featured Posts */}
          {featuredPosts.length > 0 && activeCategory === 'All' && searchQuery === '' && (
            <section className="py-6 sm:py-8">
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 text-amber-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Featured Stories
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredPosts.slice(0, 2).map((post, i) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Link href={`/blog/${post.slug}`} className="group block">
                      <div className="glass rounded-2xl overflow-hidden tilt-card transition-all duration-300 hover:glow-teal">
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />
                          <div className="absolute top-3 left-3">
                            <Badge className={`${categoryColors[post.category] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'} text-xs font-semibold border`}>
                              {post.category}
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs font-semibold border flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              Featured
                            </Badge>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                            <h3 className="font-bold text-white text-lg sm:text-xl leading-tight line-clamp-2 group-hover:text-teal-300 transition-colors">
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-gray-300 mt-2">
                              <span>{formatDate(post.date)}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readingTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-col lg:flex-row gap-8 py-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {['All', ...blogCategories].map((cat) => (
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
              {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="glass rounded-2xl overflow-hidden animate-pulse"
                    >
                      <div className="aspect-[16/10] bg-white/5" />
                      <div className="p-5 space-y-3">
                        <div className="h-3 bg-white/5 rounded w-1/3" />
                        <div className="h-5 bg-white/5 rounded w-3/4" />
                        <div className="h-4 bg-white/5 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                      {visiblePosts.map((post, i) => (
                        <motion.article
                          key={post.slug}
                          layout
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5, delay: i * 0.06 }}
                        >
                          <Link href={`/blog/${post.slug}`} className="group block">
                            <div className="glass rounded-2xl overflow-hidden tilt-card transition-all duration-300 hover:glow-teal h-full">
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
                                  <span>{formatDate(post.date)}</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {post.readingTime}
                                  </span>
                                </div>

                                <h3 className="font-bold text-white text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-teal-300 transition-colors">
                                  {post.title}
                                </h3>

                                <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                                  {post.excerpt}
                                </p>

                                <div className="mt-4 flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    {post.author.name}
                                  </span>
                                  <span className="flex items-center text-sm font-medium text-teal-400 group-hover:text-teal-300 transition-colors">
                                    Read More
                                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Load More */}
                  {hasMore && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-10 text-center"
                    >
                      <Button
                        onClick={loadMore}
                        variant="outline"
                        className="rounded-xl border-white/10 text-gray-300 hover:text-white hover:bg-white/10 px-8 py-3"
                      >
                        Load More Articles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}

                  {/* No results */}
                  {filtered.length === 0 && !loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16"
                    >
                      <div className="text-5xl mb-4">📝</div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        No articles found
                      </h3>
                      <p className="text-gray-400">
                        Try adjusting your search or filter criteria
                      </p>
                      <button
                        onClick={() => {
                          setActiveCategory('All');
                          setSearchQuery('');
                        }}
                        className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                      >
                        Clear Filters
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 shrink-0 space-y-6">
              {/* Categories */}
              <div className="glass rounded-2xl p-5">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-teal-400" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {['All', ...blogCategories].map((cat) => {
                    const count =
                      cat === 'All'
                        ? posts.length
                        : posts.filter((p) => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                          activeCategory === cat
                            ? 'bg-teal-500/10 text-teal-400 glow-teal'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="glass rounded-2xl p-5">
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-400" />
                  Recent Posts
                </h3>
                <div className="space-y-4">
                  {recentPosts.slice(0, 4).map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex gap-3"
                    >
                      <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium text-gray-300 line-clamp-2 group-hover:text-teal-300 transition-colors">
                          {post.title}
                        </h4>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {formatDate(post.date)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="glass-strong rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/5 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[60px]" />
                <div className="relative">
                  <Mail className="h-8 w-8 text-teal-400 mb-3" />
                  <h3 className="font-bold text-white text-lg mb-2">
                    Never Miss a Story
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Get the latest travel tips and deals delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                    />
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/5" />

              {/* Tags */}
              <div className="glass rounded-2xl p-5">
                <h3 className="font-bold text-white text-lg mb-4">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'honeymoon',
                    'Kerala',
                    'Goa',
                    'budget travel',
                    'adventure',
                    'Dubai',
                    'Ladakh',
                    'Rajasthan',
                    'international',
                    'Maldives',
                    'Bali',
                    'tips',
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all border border-white/5 hover:border-teal-500/20"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8 mb-12 rounded-2xl glass-strong p-8 sm:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-[80px]" />
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Never Miss a{' '}
                <span className="gradient-text">Travel Story</span>
              </h3>
              <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                Subscribe to our newsletter and get the latest travel tips,
                destination guides, and exclusive deals delivered to your inbox.
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
        </div>
      </div>
    </PageTransition>
  );
}
