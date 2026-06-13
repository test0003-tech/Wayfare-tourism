'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type CountdownVariant = 'minimal' | 'detailed' | 'flip';

interface CountdownTimerProps {
  targetDate: Date | number;
  variant?: CountdownVariant;
  label?: string;
  onComplete?: () => void;
  className?: string;
}

function getTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    total: diff,
  };
}

function FlipDigit({ value, label }: { value: number; label: string }) {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (value !== prevValue) {
      const timeout = setTimeout(() => {
        setIsFlipping(true);
        setTimeout(() => {
          setPrevValue(value);
          setIsFlipping(false);
        }, 150);
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [value, prevValue]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-white/8 to-white/3 border border-white/10 shadow-lg min-w-[3rem] sm:min-w-[3.5rem]">
        {/* Top half */}
        <div className="relative h-[1.6rem] sm:h-[1.8rem] flex items-end justify-center overflow-hidden border-b border-white/5">
          <span className="text-xl sm:text-2xl font-black text-amber-300 translate-y-[50%]">
            {isFlipping ? prevValue : value}
          </span>
          {isFlipping && (
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -90 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 flex items-end justify-center bg-gradient-to-b from-white/8 to-white/5 origin-bottom"
            >
              <span className="text-xl sm:text-2xl font-black text-amber-300 translate-y-[50%]">
                {prevValue}
              </span>
            </motion.div>
          )}
        </div>
        {/* Bottom half */}
        <div className="relative h-[1.6rem] sm:h-[1.8rem] flex items-start justify-center overflow-hidden">
          <span className="text-xl sm:text-2xl font-black text-amber-300 -translate-y-[50%]">
            {isFlipping ? prevValue : value}
          </span>
          {isFlipping && (
            <motion.div
              initial={{ rotateX: 90 }}
              animate={{ rotateX: 0 }}
              transition={{ duration: 0.15, delay: 0.15 }}
              className="absolute inset-0 flex items-start justify-center bg-gradient-to-b from-white/5 to-white/3 origin-top"
            >
              <span className="text-xl sm:text-2xl font-black text-amber-300 -translate-y-[50%]">
                {value}
              </span>
            </motion.div>
          )}
        </div>
        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-black/30" />
      </div>
      <span className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider font-medium">{label}</span>
    </div>
  );
}

function AnimatedNumber({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.span
        key={value}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-sm sm:text-base font-black text-amber-300 bg-gradient-to-b from-amber-500/20 to-amber-500/5 rounded-lg px-2.5 py-1.5 min-w-[2.2rem] text-center border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="text-[9px] text-gray-500 mt-0.5 uppercase tracking-wider font-medium">{label}</span>
    </div>
  );
}

export default function CountdownTimer({
  targetDate,
  variant = 'detailed',
  label,
  onComplete,
  className = '',
}: CountdownTimerProps) {
  const target = typeof targetDate === 'number' ? targetDate : targetDate.getTime();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(target));
  const [isComplete, setIsComplete] = useState(false);
  const isCompleteRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = getTimeLeft(target);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total === 0 && !isCompleteRef.current) {
        isCompleteRef.current = true;
        setIsComplete(true);
        onComplete?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [target, onComplete]);

  const blocks = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hrs' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ];

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex flex-col items-center gap-2 ${className}`}
      >
        <div className="rounded-xl glass px-6 py-4 text-center">
          <p className="text-lg font-bold text-amber-400">🎉 Offer Expired!</p>
          <p className="text-sm text-gray-400 mt-1">This deal has ended. Check back for new offers!</p>
        </div>
      </motion.div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {label && <span className="text-xs text-gray-400 mr-1">{label}</span>}
        {blocks.map((block, i) => (
          <div key={block.label} className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-amber-300 tabular-nums">
              {String(block.value).padStart(2, '0')}
            </span>
            {i < blocks.length - 1 && (
              <span className="text-amber-500/50 font-bold text-xs animate-pulse">:</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'flip') {
    return (
      <div className={className}>
        {label && <p className="text-xs text-gray-400 mb-2 font-medium">{label}</p>}
        <div className="flex items-center gap-2">
          {blocks.map((block, i) => (
            <div key={block.label} className="flex items-center gap-2">
              <FlipDigit value={block.value} label={block.label} />
              {i < blocks.length - 1 && (
                <span className="text-amber-500/50 font-black text-xl -mt-4 animate-pulse">:</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // variant === 'detailed' (default)
  return (
    <div className={className}>
      {label && <p className="text-xs text-gray-400 mb-2 font-medium">{label}</p>}
      <div className="flex items-center gap-1.5">
        {blocks.map((block, i) => (
          <div key={block.label} className="flex items-center gap-1.5">
            <AnimatedNumber value={block.value} label={block.label} />
            {i < blocks.length - 1 && (
              <span className="text-amber-500/70 font-black text-lg -mt-4 animate-pulse">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
