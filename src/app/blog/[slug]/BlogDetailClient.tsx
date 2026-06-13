'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  LinkIcon,
  ChevronRight,
  BookOpen,
  Tag,
} from 'lucide-react';
import PageTransition from '@/components/wayfare/PageTransition';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { categoryColors } from '@/lib/blog-data';
import type { BlogPost } from '@/lib/blog-data';

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

function extractTOC(html: string): TableOfContentsItem[] {
  const headings: TableOfContentsItem[] = [];
  const regex = /<h([2-3])\s+id="([^"]+)">([^<]+)<\/h[2-3]>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3],
    });
  }
  return headings;
}

export default function BlogDetailClient({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const params = useParams<{ slug: string }>();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
          setRelatedPosts(data.relatedPosts || []);
        }
      } catch {
        // error handled by null post
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  const tocItems = useMemo(() => {
    if (!post) return [];
    return extractTOC(post.content);
  }, [post]);

  // Track active section for TOC
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="bg-gray-950 min-h-screen">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-white/5 rounded w-3/4" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
              <div className="aspect-[21/9] bg-white/5 rounded-2xl" />
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-4 bg-white/5 rounded w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!post) {
    return (
      <PageTransition>
        <div className="bg-gray-950 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📖</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Article Not Found
            </h1>
            <p className="text-gray-400 mb-6">
              The article you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="bg-gray-950 min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={post.image}
              alt=""
              className="h-full w-full object-cover opacity-15 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/90 to-gray-950/70" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12">
            <Breadcrumbs
              items={[
                { label: 'Blog', href: '/blog' },
                { label: post.title },
              ]}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge
                  className={`${categoryColors[post.category] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'} text-sm font-semibold border`}
                >
                  {post.category}
                </Badge>
                {post.featured && (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-sm font-semibold border">
                    ⭐ Featured
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-4xl">
                {post.title}
              </h1>

              <p className="mt-4 text-lg text-gray-400 max-w-2xl">
                {post.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {post.author.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readingTime}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cover Image */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-10"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 to-transparent" />
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents - Sticky Sidebar */}
            {tocItems.length > 0 && (
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24 glass rounded-2xl p-5">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-teal-400" />
                    Table of Contents
                  </h3>
                  <nav className="space-y-1">
                    {tocItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm py-1.5 px-2 rounded-lg transition-all ${
                          activeSection === item.id
                            ? 'text-teal-400 bg-teal-500/10 font-medium'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        } ${item.level === 3 ? 'pl-6' : ''}`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}

            {/* Main Content */}
            <article className="flex-1 min-w-0 max-w-none">
              {/* Share Bar */}
              <div className="flex items-center justify-between mb-8">
                <Link
                  href="/blog"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 mr-1">Share:</span>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all"
                    aria-label="Copy link"
                  >
                    {copied ? (
                      <span className="text-xs text-teal-400">Copied!</span>
                    ) : (
                      <LinkIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="prose-custom"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-10 flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?search=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all border border-white/5 hover:border-teal-500/20"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              <Separator className="my-10 bg-white/5" />

              {/* Author Bio */}
              <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-white/5">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Written by
                  </p>
                  <h3 className="text-lg font-bold text-white">
                    {post.author.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{post.author.bio}</p>
                </div>
              </div>

              <Separator className="my-10 bg-white/5" />

              {/* Share Article CTA */}
              <div className="glass-strong rounded-2xl p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/5 rounded-full blur-[80px]" />
                <div className="relative">
                  <Share2 className="h-8 w-8 text-teal-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Enjoyed this article?
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Share it with your friends and fellow travelers!
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      onClick={() => handleShare('twitter')}
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                    <Button
                      onClick={() => handleShare('facebook')}
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button
                      onClick={() => handleShare('copy')}
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      {copied ? 'Copied!' : 'Copy Link'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Related Articles
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map((rPost, i) => (
                      <motion.article
                        key={rPost.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                      >
                        <Link
                          href={`/blog/${rPost.slug}`}
                          className="group block"
                        >
                          <div className="glass rounded-2xl overflow-hidden tilt-card transition-all duration-300 hover:glow-teal h-full">
                            <div className="relative aspect-[16/10] overflow-hidden">
                              <img
                                src={rPost.image}
                                alt={rPost.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
                              <div className="absolute top-3 left-3">
                                <Badge className={`${categoryColors[rPost.category] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'} text-xs font-semibold border`}>
                                  {rPost.category}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <Calendar className="h-3 w-3" />
                                {formatDate(rPost.date)}
                                <ChevronRight className="h-3 w-3" />
                                <Clock className="h-3 w-3" />
                                {rPost.readingTime}
                              </div>
                              <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-teal-300 transition-colors">
                                {rPost.title}
                              </h3>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
