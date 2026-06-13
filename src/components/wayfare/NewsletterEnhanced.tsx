'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  CheckCircle,
  Sparkles,
  PartyPopper,
  Shield,
  Heart,
  Mountain,
  Palmtree,
  Waves,
  Tent,
  Camera,
  Snowflake,
  Unlink,
} from 'lucide-react';

const interests = [
  { id: 'adventure', label: 'Adventure', icon: Mountain },
  { id: 'beach', label: 'Beach', icon: Waves },
  { id: 'hillstation', label: 'Hill Station', icon: Snowflake },
  { id: 'honeymoon', label: 'Honeymoon', icon: Heart },
  { id: 'wildlife', label: 'Wildlife', icon: Tent },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'tropical', label: 'Tropical', icon: Palmtree },
];

const destinationOptions = [
  'Kerala', 'Kashmir', 'Goa', 'Maldives', 'Dubai', 'Thailand',
  'Bali', 'Singapore', 'Andaman', 'Manali', 'Sri Lanka', 'Vietnam',
];

function ConfettiEffect() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#0d9488', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4'][i % 6],
    delay: Math.random() * 0.5,
    duration: Math.random() * 1 + 1.5,
    size: Math.random() * 6 + 4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: '-10px',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.id % 3 === 0 ? '50%' : '2px',
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: 0,
            rotate: Math.random() * 720 - 360,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

export default function NewsletterEnhanced() {
  const [email, setEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [preferredDestination, setPreferredDestination] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (email) {
        setSubmitted(true);
        setShowConfetti(true);
        setEmail('');
        setTimeout(() => {
          setSubmitted(false);
          setShowConfetti(false);
        }, 6000);
      }
    },
    [email]
  );

  return (
    <section className="py-16 sm:py-20 bg-gray-950 relative overflow-hidden">
      {/* Confetti Effect */}
      <AnimatePresence>{showConfetti && <ConfettiEffect />}</AnimatePresence>

      {/* Decorative */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px]" />
      {/* Destination image decorations */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full overflow-hidden opacity-20 hidden lg:block">
        <img src="/images/destinations/maldives.png" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-10 left-10 w-28 h-28 rounded-full overflow-hidden opacity-15 hidden lg:block">
        <img src="/images/destinations/kerala.png" alt="" className="w-full h-full object-cover" />
      </div>

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
                  className="mt-8 space-y-4"
                >
                  {/* Email Input */}
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
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
                  </div>

                  {/* Interest Selection */}
                  <div className="max-w-md mx-auto">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Select your interests:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {interests.map((interest) => {
                        const Icon = interest.icon;
                        return (
                          <label
                            key={interest.id}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs cursor-pointer transition-all duration-300 border ${
                              selectedInterests.includes(interest.id)
                                ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            <Checkbox
                              checked={selectedInterests.includes(interest.id)}
                              onCheckedChange={() => toggleInterest(interest.id)}
                              className="h-3 w-3 border-white/20 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                            />
                            <Icon className="h-3 w-3" />
                            {interest.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferred Destination */}
                  <div className="max-w-md mx-auto">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Preferred destination:</p>
                    <Select value={preferredDestination} onValueChange={setPreferredDestination}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-9 text-xs">
                        <SelectValue placeholder="Select destination (optional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/10">
                        {destinationOptions.map((d) => (
                          <SelectItem key={d} value={d} className="text-gray-300 focus:text-white focus:bg-white/5 text-xs">
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-5 flex items-center justify-center gap-4 flex-wrap">
              <a
                href="#"
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors flex items-center gap-1"
              >
                <Unlink className="h-3 w-3" />
                Unsubscribe anytime
              </a>
              <span className="text-gray-700">•</span>
              <a
                href="#"
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                Privacy Policy
              </a>
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
