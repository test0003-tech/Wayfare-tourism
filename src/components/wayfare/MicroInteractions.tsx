'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Bookmark, Star, Copy, CheckCircle } from 'lucide-react';

// LikeButton - heart animation on click
export function LikeButton({
  liked = false,
  onToggle,
  size = 'md',
}: {
  liked?: boolean;
  onToggle?: (liked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [isLiked, setIsLiked] = useState(liked);
  const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };
  const btnSizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };

  const handleClick = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    onToggle?.(newLiked);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`flex items-center justify-center rounded-full ${btnSizes[size]} transition-colors ${
        isLiked ? 'bg-rose-500/20' : 'bg-white/5 hover:bg-white/10'
      }`}
      whileTap={{ scale: 0.85 }}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      <motion.div
        animate={
          isLiked
            ? {
                scale: [1, 1.4, 0.9, 1.1, 1],
                rotate: [0, -15, 15, 0],
              }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <Heart
          className={`${sizes[size]} transition-colors duration-300 ${
            isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'
          }`}
        />
      </motion.div>

      {/* Particle burst on like */}
      <AnimatePresence>
        {isLiked && (
          <>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <motion.div
                key={angle}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: Math.cos((angle * Math.PI) / 180) * 20,
                  y: Math.sin((angle * Math.PI) / 180) * 20,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: i * 0.02 }}
                className="absolute h-1.5 w-1.5 rounded-full bg-rose-400 pointer-events-none"
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ShareButton - share ripple effect
export function ShareButton({
  onClick,
  size = 'md',
}: {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [rippled, setRippled] = useState(false);
  const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };
  const btnSizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };

  const handleClick = () => {
    setRippled(true);
    setTimeout(() => setRippled(false), 600);
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative flex items-center justify-center rounded-full ${btnSizes[size]} bg-white/5 hover:bg-teal-500/10 transition-colors overflow-hidden`}
      whileTap={{ scale: 0.9 }}
      aria-label="Share"
    >
      <Share2 className={`${sizes[size]} text-gray-400 hover:text-teal-400 transition-colors`} />
      <AnimatePresence>
        {rippled && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 rounded-full bg-teal-500/20"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// BookmarkButton - bookmark bounce
export function BookmarkButton({
  bookmarked = false,
  onToggle,
  size = 'md',
}: {
  bookmarked?: boolean;
  onToggle?: (bookmarked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };
  const btnSizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };

  const handleClick = () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    onToggle?.(newBookmarked);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`flex items-center justify-center rounded-full ${btnSizes[size]} transition-colors ${
        isBookmarked ? 'bg-amber-500/20' : 'bg-white/5 hover:bg-white/10'
      }`}
      whileTap={{ scale: 0.8 }}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
    >
      <motion.div
        animate={
          isBookmarked
            ? {
                y: [0, -8, 0, -4, 0],
              }
            : { y: 0 }
        }
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Bookmark
          className={`${sizes[size]} transition-colors duration-300 ${
            isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-gray-400'
          }`}
        />
      </motion.div>
    </motion.button>
  );
}

// RatingStars - interactive star rating with hover
export function RatingStars({
  rating = 0,
  onRate,
  maxStars = 5,
  size = 'md',
  readonly = false,
}: {
  rating?: number;
  onRate?: (rating: number) => void;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= displayRating;

        return (
          <motion.button
            key={i}
            onClick={() => !readonly && onRate?.(starValue)}
            onMouseEnter={() => !readonly && setHoverRating(starValue)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            className={`relative ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
            whileHover={!readonly ? { scale: 1.2 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            aria-label={`Rate ${starValue} stars`}
          >
            <Star
              className={`${sizes[size]} transition-colors duration-200 ${
                isFilled ? 'fill-amber-400 text-amber-400' : 'text-gray-600'
              }`}
            />
            {isFilled && !readonly && (
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 pointer-events-none"
              >
                <Star className={`${sizes[size]} fill-amber-300 text-amber-300`} />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// CopyButton - copy with checkmark animation
export function CopyButton({
  text,
  size = 'md',
  label,
}: {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const sizes = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <motion.button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
        copied
          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
      }`}
      whileTap={{ scale: 0.95 }}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <CheckCircle className={sizes[size]} />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className={sizes[size]} />
          </motion.div>
        )}
      </AnimatePresence>
      {label && <span>{copied ? 'Copied!' : label}</span>}
    </motion.button>
  );
}

// PulseDot - live indicator pulse
export function PulseDot({
  color = 'teal',
  size = 'sm',
  label,
}: {
  color?: 'teal' | 'amber' | 'rose' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}) {
  const colorMap = {
    teal: 'bg-teal-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    emerald: 'bg-emerald-500',
  };

  const sizeMap = { sm: 'h-2 w-2', md: 'h-3 w-3', lg: 'h-4 w-4' };
  const ringSizeMap = { sm: 'h-2 w-2', md: 'h-3 w-3', lg: 'h-4 w-4' };

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex">
        <motion.span
          className={`absolute inline-flex ${ringSizeMap[size]} rounded-full ${colorMap[color]} opacity-75`}
          animate={{ scale: [1, 2, 1], opacity: [0.75, 0, 0.75] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className={`relative inline-flex rounded-full ${sizeMap[size]} ${colorMap[color]}`} />
      </span>
      {label && <span className="text-xs font-medium text-gray-400">{label}</span>}
    </span>
  );
}
