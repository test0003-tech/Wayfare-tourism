import type { Metadata } from 'next';
import { KEYWORDS, generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Blog & Travel Tips — Expert Travel Insights',
  description: 'Expert travel tips, destination guides, and vacation inspiration. Read about honeymoon destinations, budget travel hacks, adventure sports, luxury hotels & more on the Wayfare blog. Plan smarter, travel better!',
  keywords: [
    ...KEYWORDS.blog,
    'travel blog India', 'best travel tips', 'honeymoon destination guide',
    'budget travel India', 'luxury travel blog', 'adventure travel tips',
    'travel itinerary guide', 'destination review blog',
    'India travel guide', 'international travel tips from India',
    'travel packing tips', 'best time to visit India',
  ],
  path: '/blog',
  ogImage: '/images/logo-wayfare-new.png',
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
