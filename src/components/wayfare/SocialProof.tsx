'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, TrendingDown, Sparkles, ShoppingBag } from 'lucide-react';

interface SocialProofNotification {
  id: number;
  type: 'booking' | 'viewing' | 'price_drop' | 'trending';
  text: string;
  icon: React.ReactNode;
  color: string;
}

const notifications: SocialProofNotification[] = [
  { id: 1, type: 'booking', text: 'John from Delhi just booked Kerala Honeymoon Package', icon: <ShoppingBag className="h-4 w-4" />, color: 'text-teal-400' },
  { id: 2, type: 'viewing', text: '5 people are viewing Dubai packages right now', icon: <Users className="h-4 w-4" />, color: 'text-amber-400' },
  { id: 3, type: 'price_drop', text: 'Kashmir package price dropped by 15%', icon: <TrendingDown className="h-4 w-4" />, color: 'text-emerald-400' },
  { id: 4, type: 'booking', text: 'Priya from Mumbai booked Maldives Paradise Escape', icon: <ShoppingBag className="h-4 w-4" />, color: 'text-teal-400' },
  { id: 5, type: 'trending', text: 'Thailand packages are trending this week!', icon: <Sparkles className="h-4 w-4" />, color: 'text-purple-400' },
  { id: 6, type: 'viewing', text: '12 people looking at Goa Beach Holiday now', icon: <Users className="h-4 w-4" />, color: 'text-amber-400' },
  { id: 7, type: 'price_drop', text: 'Bali Temple Tour — save ₹8,000 this week', icon: <TrendingDown className="h-4 w-4" />, color: 'text-emerald-400' },
  { id: 8, type: 'booking', text: 'Rahul from Bangalore booked Dubai Luxury Experience', icon: <ShoppingBag className="h-4 w-4" />, color: 'text-teal-400' },
  { id: 9, type: 'viewing', text: '8 travelers checking Singapore packages', icon: <Users className="h-4 w-4" />, color: 'text-amber-400' },
  { id: 10, type: 'trending', text: 'Andaman scuba packages are selling fast!', icon: <Sparkles className="h-4 w-4" />, color: 'text-purple-400' },
  { id: 11, type: 'price_drop', text: 'Maldives — 20% off for Valentine\'s week', icon: <TrendingDown className="h-4 w-4" />, color: 'text-emerald-400' },
  { id: 12, type: 'booking', text: 'Anita from Hyderabad booked Manali Adventure', icon: <ShoppingBag className="h-4 w-4" />, color: 'text-teal-400' },
  { id: 13, type: 'viewing', text: '3 people viewing Vietnam Explorer right now', icon: <Users className="h-4 w-4" />, color: 'text-amber-400' },
  { id: 14, type: 'trending', text: 'Sri Lanka Cultural Tour — most booked this month', icon: <Sparkles className="h-4 w-4" />, color: 'text-purple-400' },
  { id: 15, type: 'price_drop', text: 'Goa Beach Holiday now starting from ₹11,999', icon: <TrendingDown className="h-4 w-4" />, color: 'text-emerald-400' },
  { id: 16, type: 'booking', text: 'Vikram from Pune booked Bali Honeymoon Package', icon: <ShoppingBag className="h-4 w-4" />, color: 'text-teal-400' },
  { id: 17, type: 'viewing', text: '6 people exploring Kerala Backwaters packages', icon: <Users className="h-4 w-4" />, color: 'text-amber-400' },
  { id: 18, type: 'trending', text: 'Dubai Luxury Experience — highest rated package!', icon: <Sparkles className="h-4 w-4" />, color: 'text-purple-400' },
];

export default function SocialProof() {
  const [currentNotification, setCurrentNotification] = useState<SocialProofNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [shownIndices, setShownIndices] = useState<number[]>([]);

  const showNextNotification = useCallback(() => {
    if (isDismissed) return;

    // Pick a notification we haven't shown recently
    let availableIndices = notifications
      .map((_, i) => i)
      .filter((i) => !shownIndices.includes(i));

    if (availableIndices.length === 0) {
      availableIndices = notifications.map((_, i) => i);
      setShownIndices([]);
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setShownIndices((prev) => [...prev.slice(-10), randomIndex]);

    setCurrentNotification(notifications[randomIndex]);
    setIsVisible(true);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 4000);
  }, [isDismissed, shownIndices]);

  useEffect(() => {
    // Initial delay before first notification
    const initialDelay = setTimeout(() => {
      showNextNotification();
    }, 8000);

    // Show a new notification every 15-25 seconds
    const interval = setInterval(() => {
      showNextNotification();
    }, 15000 + Math.random() * 10000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [showNextNotification]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm">
      <AnimatePresence>
        {isVisible && currentNotification && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="rounded-xl glass-strong p-4 shadow-2xl shadow-black/30 border border-white/10"
          >
            <div className="flex items-start gap-3">
              <div className={`shrink-0 mt-0.5 ${currentNotification.color}`}>
                {currentNotification.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 leading-snug">
                  {currentNotification.text}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-teal-500/60" />
                  <span className="text-[10px] text-gray-500">Wayfare Travel</span>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="shrink-0 rounded-md p-1 text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Auto-dismiss progress bar */}
            <motion.div
              className="mt-3 h-0.5 bg-teal-500/30 rounded-full overflow-hidden"
              initial={{ opacity: 1 }}
            >
              <motion.div
                className="h-full bg-teal-500 rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
