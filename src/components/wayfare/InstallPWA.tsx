'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed - non-critical
      });
    }

    // Check if already installed (defer to avoid synchronous setState)
    const installedTimer = setTimeout(() => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    }, 0);

    // Listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay
      setTimeout(() => setShowPrompt(true), 10000);
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
    // Don't show again for this session
    sessionStorage.setItem('pwa-dismissed', 'true');
  };

  if (isInstalled) return null;

  // Check if dismissed this session
  if (typeof window !== 'undefined' && sessionStorage.getItem('pwa-dismissed')) return null;

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
        >
          <div className="rounded-2xl glass-strong p-5 shadow-2xl shadow-black/40 border border-teal-500/20">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 shrink-0">
                <Smartphone className="h-5 w-5 text-teal-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white">Install Wayfare App</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Add to your home screen for quick access to travel deals and offline browsing!
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={handleInstall}
                    className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg text-xs font-bold"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Install Now
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDismiss}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    Maybe Later
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
  );
}
