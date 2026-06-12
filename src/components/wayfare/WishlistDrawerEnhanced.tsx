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
  Share2,
  Copy,
  CheckCircle,
  MessageSquare,
  Mail,
  Twitter,
  StickyNote,
  Columns3,
} from 'lucide-react';
import Link from 'next/link';

export default function WishlistDrawerEnhanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [compareMode, setCompareMode] = useState(false);
  const [compareItems, setCompareItems] = useState<string[]>([]);
  const { items, removeItem, clearWishlist } = useWishlist();
  const count = items.length;

  const generateShareLink = () => {
    const ids = items.map((i) => i.id).join(',');
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/packages?wishlist=${ids}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generateShareLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = generateShareLink();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareViaWhatsApp = () => {
    const text = `Check out my travel wishlist on Wayfare! 🌴✈️\n\n${items.map((i) => `✨ ${i.name} - ₹${i.price.toLocaleString('en-IN')}`).join('\n')}\n\nPlan yours at: ${generateShareLink()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = 'My Wayfare Travel Wishlist ✈️';
    const body = `Hey! I've been planning my next trip and saved these packages on Wayfare:\n\n${items.map((i) => `• ${i.name} (${i.destination}) - ₹${i.price.toLocaleString('en-IN')}`).join('\n')}\n\nCheck them out: ${generateShareLink()}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const shareViaTwitter = () => {
    const text = `Planning my next adventure! 🌍✈️ Check out my Wayfare travel wishlist: ${generateShareLink()}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const addNote = (itemId: string, note: string) => {
    setNotes((prev) => ({ ...prev, [itemId]: note }));
    setEditingNote(null);
  };

  const toggleCompare = (itemId: string) => {
    setCompareItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : prev.length < 3 ? [...prev, itemId] : prev
    );
  };

  const comparedItems = items.filter((item) => compareItems.includes(item.id));

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
                  <>
                    <button
                      onClick={() => setCompareMode(!compareMode)}
                      className={`rounded-lg p-2 transition-colors ${compareMode ? 'text-teal-400 bg-teal-500/10' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
                      title="Compare packages"
                    >
                      <Columns3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-teal-400 transition-colors"
                      title="Share wishlist"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={clearWishlist}
                      className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-rose-400 transition-colors"
                      title="Clear all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Share Menu */}
            <AnimatePresence>
              {showShareMenu && count > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-b border-white/10"
                >
                  <div className="px-5 py-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-300">Share your wishlist</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={shareViaWhatsApp}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs"
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                        WhatsApp
                      </Button>
                      <Button
                        size="sm"
                        onClick={shareViaEmail}
                        variant="outline"
                        className="flex-1 border-white/10 text-gray-300 hover:bg-white/5 rounded-lg text-xs"
                      >
                        <Mail className="h-3.5 w-3.5 mr-1.5" />
                        Email
                      </Button>
                      <Button
                        size="sm"
                        onClick={shareViaTwitter}
                        variant="outline"
                        className="flex-1 border-white/10 text-gray-300 hover:bg-white/5 rounded-lg text-xs"
                      >
                        <Twitter className="h-3.5 w-3.5 mr-1.5" />
                        Twitter
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-lg bg-white/5 border border-white/5 px-3 py-2 text-xs text-gray-400 truncate">
                        {generateShareLink()}
                      </div>
                      <Button
                        size="sm"
                        onClick={handleCopyLink}
                        className={`rounded-lg text-xs ${copied ? 'bg-teal-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/15'}`}
                      >
                        {copied ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Compare View */}
            <AnimatePresence>
              {compareMode && comparedItems.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-b border-white/10"
                >
                  <div className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-300 mb-3">Compare ({comparedItems.length}/3)</p>
                    <div className="grid grid-cols-2 gap-3">
                      {comparedItems.map((item) => (
                        <div key={item.id} className="rounded-xl glass p-3 text-center">
                          <img src={item.image} alt={item.name} className="w-full h-20 object-cover rounded-lg mb-2" />
                          <p className="text-xs font-bold text-white truncate">{item.name}</p>
                          <p className="text-xs text-amber-400 font-semibold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                          <p className="text-[10px] text-gray-500">{item.duration}</p>
                          <div className="flex items-center justify-center gap-0.5 mt-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-[10px] font-bold text-amber-400">{item.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {count === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    <ShoppingBag className="h-20 w-20 text-gray-700 mb-4" />
                  </motion.div>
                  <h4 className="text-lg font-semibold text-gray-400">Your wishlist is empty</h4>
                  <p className="text-sm text-gray-600 mt-1 max-w-[200px]">
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
                      className={`flex gap-3 rounded-xl glass p-3 group ${
                        compareMode && compareItems.includes(item.id) ? 'ring-1 ring-teal-500/50' : ''
                      }`}
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
                          <div className="flex items-center gap-1">
                            {/* Note button */}
                            <button
                              onClick={() => setEditingNote(editingNote === item.id ? null : item.id)}
                              className="rounded-md p-1.5 text-gray-500 hover:bg-teal-500/10 hover:text-teal-400 transition-colors"
                              title="Add note"
                            >
                              <StickyNote className="h-3.5 w-3.5" />
                            </button>
                            {/* Compare checkbox */}
                            {compareMode && (
                              <button
                                onClick={() => toggleCompare(item.id)}
                                className={`rounded-md p-1.5 transition-colors ${
                                  compareItems.includes(item.id)
                                    ? 'text-teal-400 bg-teal-500/10'
                                    : 'text-gray-500 hover:bg-white/5'
                                }`}
                                title="Compare"
                              >
                                <Columns3 className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {/* Remove button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="rounded-md p-1.5 text-gray-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                              title="Remove from wishlist"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Note display / edit */}
                        {notes[item.id] && editingNote !== item.id && (
                          <div className="mt-2 rounded-lg bg-teal-500/5 border border-teal-500/10 px-2.5 py-1.5">
                            <p className="text-[10px] text-gray-400">📝 {notes[item.id]}</p>
                          </div>
                        )}
                        <AnimatePresence>
                          {editingNote === item.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Add a note..."
                                  defaultValue={notes[item.id] || ''}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      addNote(item.id, (e.target as HTMLInputElement).value);
                                    }
                                  }}
                                  className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-gray-600 outline-none focus:border-teal-500/30"
                                  autoFocus
                                />
                                <button
                                  onClick={(e) => {
                                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                    addNote(item.id, input.value);
                                  }}
                                  className="rounded-lg bg-teal-500/20 text-teal-400 px-3 py-1.5 text-xs font-semibold hover:bg-teal-500/30 transition-colors"
                                >
                                  Save
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {count > 0 && (
              <div className="border-t border-white/10 px-5 py-4 space-y-2">
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
