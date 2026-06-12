'use client';

import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

function ShimmerWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />
    </motion.div>
  );
}

export function PackageCardSkeleton() {
  return (
    <ShimmerWrapper>
      <div className="rounded-2xl glass p-0 overflow-hidden">
        <Skeleton className="h-48 w-full bg-white/5" />
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full bg-white/10" />
            <Skeleton className="h-3 w-24 bg-white/5" />
          </div>
          <Skeleton className="h-5 w-3/4 bg-white/5" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-14 rounded-full bg-white/5" />
            <Skeleton className="h-5 w-16 rounded-full bg-white/5" />
            <Skeleton className="h-5 w-10 rounded-full bg-white/5" />
          </div>
          <div className="flex items-end justify-between pt-2">
            <div className="space-y-1">
              <Skeleton className="h-3 w-16 bg-white/5" />
              <Skeleton className="h-6 w-24 bg-white/5" />
            </div>
            <Skeleton className="h-9 w-20 rounded-lg bg-white/5" />
          </div>
        </div>
      </div>
    </ShimmerWrapper>
  );
}

export function DestinationCardSkeleton() {
  return (
    <ShimmerWrapper>
      <div className="rounded-2xl overflow-hidden group relative">
        <Skeleton className="h-64 w-full bg-white/5" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Skeleton className="h-5 w-28 bg-white/10 mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full bg-white/10" />
            <Skeleton className="h-3 w-20 bg-white/10" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-5 w-20 rounded-full bg-white/10" />
            <Skeleton className="h-4 w-4 rounded-full bg-white/10" />
            <Skeleton className="h-3 w-8 bg-white/10" />
          </div>
        </div>
      </div>
    </ShimmerWrapper>
  );
}

export function HotelCardSkeleton() {
  return (
    <ShimmerWrapper>
      <div className="rounded-2xl glass overflow-hidden">
        <Skeleton className="h-48 w-full bg-white/5" />
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32 bg-white/5" />
            <div className="ml-auto flex items-center gap-1">
              <Skeleton className="h-3.5 w-3.5 rounded-full bg-white/10" />
              <Skeleton className="h-4 w-6 bg-white/5" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full bg-white/10" />
            <Skeleton className="h-3 w-28 bg-white/5" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full bg-white/5" />
            <Skeleton className="h-5 w-12 rounded-full bg-white/5" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <Skeleton className="h-3 w-20 bg-white/5" />
              <Skeleton className="h-6 w-28 bg-white/5" />
            </div>
            <Skeleton className="h-9 w-20 rounded-lg bg-white/5" />
          </div>
        </div>
      </div>
    </ShimmerWrapper>
  );
}

export function BlogCardSkeleton() {
  return (
    <ShimmerWrapper>
      <div className="rounded-2xl glass overflow-hidden">
        <Skeleton className="h-48 w-full bg-white/5" />
        <div className="p-5 space-y-3">
          <Skeleton className="h-5 w-20 rounded-full bg-white/5" />
          <Skeleton className="h-5 w-full bg-white/5" />
          <Skeleton className="h-5 w-3/4 bg-white/5" />
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-2/3 bg-white/5" />
          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="h-8 w-8 rounded-full bg-white/5" />
            <Skeleton className="h-3 w-20 bg-white/5" />
            <Skeleton className="h-3 w-16 bg-white/5 ml-auto" />
          </div>
        </div>
      </div>
    </ShimmerWrapper>
  );
}

export function ReviewSkeleton() {
  return (
    <ShimmerWrapper>
      <div className="rounded-2xl glass-strong p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full bg-white/10" />
          <Skeleton className="h-5 w-5 rounded-full bg-white/10" />
          <Skeleton className="h-5 w-5 rounded-full bg-white/10" />
          <Skeleton className="h-5 w-5 rounded-full bg-white/10" />
          <Skeleton className="h-5 w-5 rounded-full bg-white/10" />
          <Skeleton className="h-5 w-16 rounded-full bg-white/5 ml-2" />
        </div>
        <Skeleton className="h-4 w-full bg-white/5" />
        <Skeleton className="h-4 w-5/6 bg-white/5" />
        <Skeleton className="h-4 w-4/6 bg-white/5" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-10 w-10 rounded-full bg-white/5" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-28 bg-white/5" />
            <Skeleton className="h-3 w-20 bg-white/5" />
          </div>
          <div className="space-y-1.5 text-right">
            <Skeleton className="h-4 w-32 bg-white/5 ml-auto" />
            <Skeleton className="h-3 w-16 bg-white/5 ml-auto" />
          </div>
        </div>
      </div>
    </ShimmerWrapper>
  );
}

// Grid of skeletons for loading states
export function PackageCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PackageCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DestinationCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <DestinationCardSkeleton key={i} />
      ))}
    </div>
  );
}
