'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  Heart,
  Target,
  Eye,
  Shield,
  Headphones,
  Award,
  RefreshCcw,
  Users,
  TrendingUp,
  MapPin,
  Star,
  Building2,
  ArrowRight,
  Plane,
  Globe,
  Sparkles,
} from 'lucide-react';
import PageHero from '@/components/wayfare/PageHero';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import PageTransition from '@/components/wayfare/PageTransition';

/* ── Stats ── */
const stats = [
  { value: 500, suffix: '+', label: 'Travel Packages', icon: TrendingUp, color: 'text-teal-400', bgColor: 'bg-teal-500/10' },
  { value: 50, suffix: '+', label: 'Destinations', icon: MapPin, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  { value: 10000, suffix: '+', label: 'Happy Travelers', icon: Users, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  { value: 4.8, suffix: '★', label: 'Average Rating', icon: Star, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  { value: 98, suffix: '%', label: 'Customer Satisfaction', icon: Heart, color: 'text-rose-400', bgColor: 'bg-rose-500/10' },
  { value: 500, suffix: '+', label: 'Hotel Partners', icon: Building2, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
];

/* ── Values ── */
const values = [
  { icon: Shield, title: 'Best Price Guarantee', desc: 'We match or beat any comparable price — you always get the best deal with Wayfare.', color: 'text-teal-400', bgColor: 'bg-teal-500/10' },
  { icon: Headphones, title: '24/7 Support', desc: 'Our dedicated team is available round the clock to assist you during your entire trip.', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  { icon: Award, title: 'Verified Hotels', desc: 'Every hotel in our network is hand-picked, verified, and reviewed by our team.', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  { icon: RefreshCcw, title: 'Flexible Cancellation', desc: 'Plans change — we get it. Free rescheduling on most packages up to 48 hours before.', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
  { icon: Users, title: '10K+ Happy Travelers', desc: 'Join thousands of satisfied travelers who trust Wayfare for their dream vacations.', color: 'text-rose-400', bgColor: 'bg-rose-500/10' },
];

/* ── Team ── */
const team = [
  {
    name: 'Arjun Mehta',
    role: 'Founder & CEO',
    bio: 'A travel enthusiast who visited 45+ countries before starting Wayfare. Passionate about making dream vacations accessible to everyone.',
    avatar: '👨‍💼',
    color: 'from-teal-500/20 to-emerald-500/20',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Operations',
    bio: 'With 12 years in hospitality, Priya ensures every trip runs seamlessly. She believes the journey matters as much as the destination.',
    avatar: '👩‍💼',
    color: 'from-amber-500/20 to-orange-500/20',
  },
  {
    name: 'Rahul Verma',
    role: 'Lead Travel Curator',
    bio: 'Rahul crafts unique itineraries that you won\'t find anywhere else. His insider knowledge turns ordinary trips into extraordinary memories.',
    avatar: '🧑‍✈️',
    color: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    name: 'Sneha Patel',
    role: 'Customer Experience Lead',
    bio: 'Sneha and her team of 20 travel experts provide personalized support 24/7. She\'s the reason our satisfaction rate is 98%.',
    avatar: '👩‍💻',
    color: 'from-rose-500/20 to-pink-500/20',
  },
];

/* ── Timeline ── */
const timeline = [
  { year: '2018', title: 'The Beginning', desc: 'Founded in New Delhi with a vision to make premium travel accessible to everyone.' },
  { year: '2019', title: 'First 1,000 Travelers', desc: 'Reached our first milestone with travelers across 15 domestic destinations.' },
  { year: '2020', title: 'Digital Transformation', desc: 'Launched our online platform and virtual trip planning during challenging times.' },
  { year: '2022', title: 'Going International', desc: 'Expanded to 20+ international destinations including Maldives, Dubai, and Thailand.' },
  { year: '2024', title: '10K+ Happy Travelers', desc: 'Surpassed 10,000 satisfied travelers with a 98% satisfaction rate and 500+ hotel partners.' },
];

/* ── CountUp Component ── */
function CountUpNumber({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current * 10) / 10);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, inView]);

  const display = Number.isInteger(value) ? Math.floor(count).toLocaleString() : count.toFixed(1);

  return (
    <span>
      {display}{suffix}
    </span>
  );
}

export default function AboutPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(statsRef, { once: true, margin: '-100px' });

  return (
    <PageTransition>
      <div className="bg-gray-950 min-h-screen">
        <PageHero
          badge="Our Story"
          badgeIcon={Heart}
          title="About Wayfare"
          subtitle="Born from a passion for travel, built to make dream vacations accessible to everyone"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'About' }]} />

          {/* ── Brand Story ── */}
          <section className="py-16 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Plane className="h-5 w-5 text-teal-400" />
                  <span className="text-sm font-semibold text-teal-400 uppercase tracking-wider">Est. 2018</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                  Turning <span className="gradient-text">Wanderlust</span> into{' '}
                  <span className="gradient-text">Unforgettable Journeys</span>
                </h2>
                <div className="space-y-4 text-gray-400 leading-relaxed">
                  <p>
                    Wayfare was born in 2018 from a simple idea: everyone deserves to experience the world&apos;s beauty
                    without the stress of planning. Our founder, Arjun Mehta, after exploring 45+ countries, realized
                    that the best travel experiences came from local expertise and personal touches — not generic packages.
                  </p>
                  <p>
                    What started as a small team of 3 passionate travelers in Connaught Place, New Delhi, has grown into
                    a trusted platform serving over 10,000 happy travelers. We curate each itinerary by hand, negotiate
                    the best rates, and provide round-the-clock support to ensure every trip exceeds expectations.
                  </p>
                  <p>
                    Today, we partner with 500+ verified hotels across 50+ destinations — from the backwaters of Kerala
                    to the overwater villas of the Maldives — and we&apos;re just getting started.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="rounded-2xl glass p-8 space-y-6">
                  {/* Mission */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/10">
                      <Target className="h-6 w-6 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Our Mission</h3>
                      <p className="text-sm text-gray-400">
                        To make premium travel experiences accessible, affordable, and stress-free for every traveler —
                        whether it&apos;s a romantic honeymoon or a family adventure.
                      </p>
                    </div>
                  </div>
                  {/* Vision */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                      <Eye className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Our Vision</h3>
                      <p className="text-sm text-gray-400">
                        To become the most trusted travel partner in India, known for personalized experiences,
                        transparent pricing, and unwavering customer support.
                      </p>
                    </div>
                  </div>
                  {/* Globe */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Globe className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Global Reach</h3>
                      <p className="text-sm text-gray-400">
                        From domestic gems like Kashmir and Kerala to international hotspots like Maldives, Dubai,
                        and Thailand — we&apos;ve got the world covered.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── Stats Section ── */}
          <section ref={statsRef} className="py-16 sm:py-20 relative overflow-hidden">
            <div className="absolute top-10 left-10 w-96 h-96 bg-teal-500/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px]" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                <span className="gradient-text">Our Journey in Numbers</span>
              </h2>
              <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
                Trusted by thousands of travelers worldwide
              </p>
            </motion.div>

            <div className="relative grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-2xl p-5 sm:p-6 text-center tilt-card transition-all duration-300 hover:glow-teal"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} mb-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <p className={`text-3xl sm:text-4xl font-bold ${stat.color}`}>
                    <CountUpNumber value={stat.value} suffix={stat.suffix} inView={isInView} />
                  </p>
                  <p className="mt-1 text-sm text-gray-400 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Timeline ── */}
          <section className="py-16 sm:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                <span className="gradient-text">Our Journey</span>
              </h2>
              <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
                From a small startup to India&apos;s trusted travel partner
              </p>
            </motion.div>

            <div className="relative max-w-3xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/50 via-amber-500/50 to-emerald-500/50" />

              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                >
                  {/* Dot */}
                  <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 border-2 border-gray-950 z-10 mt-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>

                  {/* Content */}
                  <div className={`ml-16 sm:ml-0 sm:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'sm:pr-8' : 'sm:pl-8'}`}>
                    <div className="glass rounded-xl p-5 hover:glow-teal transition-all duration-300">
                      <span className="text-xs font-bold text-teal-400 tracking-wider">{item.year}</span>
                      <h4 className="text-lg font-bold text-white mt-1">{item.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Values Section ── */}
          <section className="py-16 sm:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                <span className="gradient-text">What We Stand For</span>
              </h2>
              <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
                Our core values guide every trip we plan and every experience we deliver
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 tilt-card hover:glow-teal transition-all duration-300"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${value.bgColor} mb-4`}>
                    <value.icon className={`h-6 w-6 ${value.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── Team Section ── */}
          <section className="py-16 sm:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                <span className="gradient-text">Meet the Team</span>
              </h2>
              <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
                The passionate people behind your perfect vacations
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-2xl overflow-hidden tilt-card hover:glow-teal transition-all duration-300 group"
                >
                  {/* Avatar area */}
                  <div className={`relative h-32 bg-gradient-to-br ${member.color} flex items-center justify-center`}>
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{member.avatar}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-white">{member.name}</h4>
                    <p className="text-sm text-teal-400 font-medium">{member.role}</p>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed line-clamp-3">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── CTA Section ── */}
          <section className="py-16 sm:py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl glass-strong p-8 sm:p-16 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/8 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/8 rounded-full blur-[100px]" />

              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="inline-flex text-5xl mb-6"
                >
                  <Sparkles className="h-12 w-12 text-amber-400" />
                </motion.div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to Start Your <span className="gradient-text">Dream Trip?</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
                  Let our travel experts craft the perfect itinerary for you. No obligations, no hidden fees — just the trip of a lifetime.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-lg hover:opacity-90 transition-opacity glow-teal animate-glow-pulse"
                >
                  Start Planning Your Trip
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
