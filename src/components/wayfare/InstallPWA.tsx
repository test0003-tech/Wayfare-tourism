'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone, AndroidIcon } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed - non-critical
      });
    }

    // Check if already installed
    const installedTimer = setTimeout(() => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    }, 0);

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    if (isIOS && !isInStandaloneMode) {
      setShowIOSHint(true);
    }

    // Listen for beforeinstallprompt (Chrome/Android)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      clearTimeout(installedTimer);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa-dismissed', 'true');
  };

  if (isInstalled) return null;

  if (typeof window !== 'undefined' && sessionStorage.getItem('pwa-dismissed') && !showPrompt) return null;

  return (
    <>
      {/* Floating Android Download Button - Always visible on mobile */}
      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <a
          href="/WayfareTravel.apk"
          download="WayfareTravel.apk"
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-4 py-3 rounded-full shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all active:scale-95"
        >
          <Smartphone className="h-5 w-5" />
          <span className="text-sm font-bold">Get App</span>
        </a>
      </div>

      {/* PWA Install Prompt (Chrome/Android) */}
      <AnimatePresence>
        {deferredPrompt && !sessionStorage.getItem('pwa-dismissed') && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md lg:hidden"
          >
            <div className="rounded-2xl glass-strong p-5 shadow-2xl shadow-black/40 border border-teal-500/20">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 shrink-0">
                  <Smartphone className="h-5 w-5 text-teal-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white">Install Wayfare App</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Add to home screen for quick access &amp; offline browsing!
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={handleInstall}
                      className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg text-xs font-bold"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Add to Home
                    </Button>
                    <a
                      href="/WayfareTravel.apk"
                      download="WayfareTravel.apk"
                      className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 px-3 py-1.5 rounded-lg text-xs font-bold hover:from-amber-600 hover:to-orange-600 transition-all"
                    >
                      <Download className="h-3.5 w-3.5" />
                      APK
                    </a>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDismiss}
                      className="text-gray-400 hover:text-white text-xs"
                    >
                      Later
                    </Button>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="rounded-md p-1 text-gray-500 hover:text-white transition-colors shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Hint */}
      <AnimatePresence>
        {showIOSHint && !sessionStorage.getItem('pwa-dismissed') && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="rounded-2xl glass-strong p-5 shadow-2xl shadow-black/40 border border-teal-500/20">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 shrink-0">
                  <Smartphone className="h-5 w-5 text-teal-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white">Add Wayfare to Home Screen</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Tap <span className="text-teal-400 font-bold">Share</span> → <span className="text-teal-400 font-bold">Add to Home Screen</span> for the app experience
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowIOSHint(false);
                      sessionStorage.setItem('pwa-dismissed', 'true');
                    }}
                    className="text-gray-400 hover:text-white text-xs mt-2"
                  >
                    Got it
                  </Button>
                </div>
                <button
                  onClick={() => {
                    setShowIOSHint(false);
                    sessionStorage.setItem('pwa-dismissed', 'true');
                  }}
                  className="rounded-md p-1 text-gray-500 hover:text-white transition-colors shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
