'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';

export default function HomeNewsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-gray-950 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl glass-strong p-8 sm:p-12 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-teal-300 mb-4">
            <Sparkles className="h-4 w-4" />
            Stay Updated
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Get Exclusive Travel Deals
          </h2>
          <p className="mt-3 text-gray-400 max-w-lg mx-auto">
            Subscribe to our newsletter and be the first to know about flash sales, new destinations, and travel tips!
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 flex items-center justify-center gap-2 text-teal-400"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">You&apos;re subscribed! Welcome aboard.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20 h-11"
                />
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl h-11 font-bold glow-teal"
              >
                Subscribe
              </Button>
            </form>
          )}

          <p className="mt-4 text-xs text-gray-600">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
