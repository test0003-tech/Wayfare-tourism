'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useWishlist, WishlistItem } from '@/lib/wishlist';
import {
  Heart,
  X,
  MapPin,
  Clock,
  Star,
  Trash2,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';

export default function WishlistDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, clearWishlist } = useWishlist();
  const count = items.length;

  return (
    <>
      {/* Floating Wishlist Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 shadow-2xl shadow-rose-500/30 transition-all hover:shadow-rose-500/50"
        aria-label="Open wishlist"
      >
        <Heart className="h-5 w-5 text-white" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-gray-950">
            {count}
          </span>
        )}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-gray-950 border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-400 fill-rose-400" />
                <h3 className="text-lg font-bold text-white">My Wishlist</h3>
                <span className="text-sm text-gray-500">({count} items)</span>
              </div>
              <div className="flex items-center gap-1">
                {count > 0 && (
                  <button
                    onClick={clearWishlist}
                    className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-rose-400 transition-colors"
                    title="Clear all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {count === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-700 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-400">Your wishlist is empty</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Browse packages and tap the heart icon to save your favorites!
                  </p>
                  <Button
                    className="mt-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <a href="#packages">
                      Explore Packages
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3 rounded-xl glass p-3 group"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white leading-tight line-clamp-1">{item.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3" />
                          {item.destination}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <BadgeSmall text={item.duration} icon={<Clock className="h-2.5 w-2.5" />} />
                          <BadgeSmall text={item.category} />
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-amber-400">{item.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-end justify-between mt-2">
                          <div>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-xs text-gray-500 line-through">
                                ₹{item.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="text-sm font-bold text-amber-400 ml-1">
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="rounded-md p-1.5 text-gray-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                            title="Remove from wishlist"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {count > 0 && (
              <div className="border-t border-white/10 px-5 py-4">
                <Button
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold rounded-xl h-12 glow-teal"
                  asChild
                >
                  <a href="#contact" onClick={() => setIsOpen(false)}>
                    Book {count} Package{count > 1 ? 's' : ''}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function BadgeSmall({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-400 border border-white/5">
      {icon}
      {text}
    </span>
  );
}
