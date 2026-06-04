'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle, Sparkles, PartyPopper, Shield } from 'lucide-react';

export default function HomeNewsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 6000);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-gray-950 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Gradient border wrapper */}
        <div className="gradient-border-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="gradient-border-inner rounded-3xl p-8 sm:p-12 text-center"
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

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                  className="mt-8 flex flex-col items-center gap-3"
                >
                  <div className="animate-success-bounce">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/20 border border-teal-500/30">
                      <CheckCircle className="h-8 w-8 text-teal-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white flex items-center justify-center gap-2">
                      <PartyPopper className="h-5 w-5 text-amber-400" />
                      You&apos;re subscribed!
                      <PartyPopper className="h-5 w-5 text-amber-400" />
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Welcome aboard. Exciting deals coming your way!</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
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
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-5 flex items-center justify-center gap-4">
              <p className="text-xs text-gray-500">
                No spam. Unsubscribe anytime.
              </p>
              <span className="text-gray-700">•</span>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Shield className="h-3 w-3 text-teal-500/50" />
                Your data is safe
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
