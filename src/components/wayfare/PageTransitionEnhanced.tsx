'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

type TransitionVariant = 'fade' | 'slide' | 'scale' | 'slideUp' | 'rotate';

interface PageTransitionProps {
  children: ReactNode;
  variant?: TransitionVariant;
  className?: string;
}

const variants: Record<TransitionVariant, {
  initial: { opacity?: number; x?: number; y?: number; scale?: number; rotate?: number };
  animate: { opacity?: number; x?: number; y?: number; scale?: number; rotate?: number };
  exit: { opacity?: number; x?: number; y?: number; scale?: number; rotate?: number };
}> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  rotate: {
    initial: { opacity: 0, rotate: -2, scale: 0.98 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 2, scale: 0.98 },
  },
};

function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/80 backdrop-blur-sm pointer-events-none"
    >
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="h-10 w-10 rounded-full border-2 border-teal-500/30 border-t-teal-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-400 font-medium"
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function PageTransition({ children, variant = 'slideUp', className }: PageTransitionProps) {
  const selectedVariant = variants[variant];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={selectedVariant.initial}
        animate={selectedVariant.animate}
        exit={selectedVariant.exit}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier for smooth feel
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Export the loading spinner for standalone use
export { LoadingSpinner };

// Export variant types for external use
export type { TransitionVariant, PageTransitionProps };
