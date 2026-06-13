'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('wayfare-locale') as Locale | null;
  return saved && locales.includes(saved) ? saved : 'en';
}

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>(getInitialLocale);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for locale changes from other components/tabs
  useEffect(() => {
    function onLocaleChange(e: Event) {
      const detail = (e as CustomEvent).detail as Locale;
      if (detail && locales.includes(detail)) {
        setCurrentLocale(detail);
      }
    }
    function onStorageChange(e: StorageEvent) {
      if (e.key === 'wayfare-locale' && e.newValue) {
        const locale = e.newValue as Locale;
        if (locales.includes(locale)) {
          setCurrentLocale(locale);
        }
      }
    }
    window.addEventListener('wayfare-locale-change', onLocaleChange);
    window.addEventListener('storage', onStorageChange);
    return () => {
      window.removeEventListener('wayfare-locale-change', onLocaleChange);
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  const handleLocaleChange = useCallback((locale: Locale) => {
    setCurrentLocale(locale);
    localStorage.setItem('wayfare-locale', locale);
    setIsOpen(false);
    // Dispatch a custom event so other components can react to locale change
    window.dispatchEvent(
      new CustomEvent('wayfare-locale-change', { detail: locale })
    );
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/5 hover:text-teal-400"
        aria-label="Switch language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
        <span className="sm:hidden">{localeFlags[currentLocale]}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-xl glass-strong border border-white/10 py-2 shadow-xl z-50"
          role="listbox"
          aria-label="Select language"
        >
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${
                currentLocale === locale
                  ? 'text-teal-400 bg-teal-500/10'
                  : 'text-gray-300 hover:text-teal-400 hover:bg-white/5'
              }`}
              role="option"
              aria-selected={currentLocale === locale}
            >
              <span className="text-lg">{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
              {currentLocale === locale && (
                <span className="ml-auto text-xs text-teal-400">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
