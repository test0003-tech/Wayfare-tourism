'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer to avoid synchronous setState warning
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-full glass flex items-center justify-center">
        <div className="h-4 w-4 rounded-full bg-white/10 animate-pulse" />
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  return (
    <motion.button
      onClick={cycleTheme}
      className="relative h-9 w-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors overflow-hidden"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
          >
            <Moon className="h-4 w-4 text-amber-400" />
          </motion.div>
        ) : theme === 'system' ? (
          <motion.div
            key="system"
            initial={{ y: -20, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
          >
            <Monitor className="h-4 w-4 text-teal-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0, rotate: 90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: -90 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
          >
            <Sun className="h-4 w-4 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow ring animation */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isDark
            ? '0 0 0px rgba(245,158,11,0)'
            : '0 0 8px rgba(245,158,11,0.3)',
        }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
}
