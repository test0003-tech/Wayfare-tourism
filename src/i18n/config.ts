export const locales = ['en', 'hi', 'ta', 'te'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  hi: 'हिन्दी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  hi: '🇮🇳',
  ta: '🇮🇳',
  te: '🇮🇳',
};
