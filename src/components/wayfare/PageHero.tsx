'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface PageHeroProps {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  minHeight?: string;
}

export default function PageHero({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  backgroundImage,
  minHeight = 'min-h-[40vh]',
}: PageHeroProps) {
  return (
    <section className={`relative overflow-hidden bg-gray-950 ${minHeight} flex items-center`}>
      {/* Background Image */}
      {backgroundImage && (
        <>
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/80 to-gray-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/60" />
        </>
      )}

      {/* Decorative orbs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-teal-500/8 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 w-full">
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-medium text-gray-300"
          >
            {BadgeIcon && <BadgeIcon className="h-4 w-4 text-teal-400" />}
            {badge}
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight"
        >
          <span className="gradient-text">{title}</span>
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 text-lg text-gray-400 max-w-2xl leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
