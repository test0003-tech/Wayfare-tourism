import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Travel Quiz — Find Your Dream Destination',
  description: "Take our 30-second travel quiz and get personalized destination recommendations based on your preferences. Answer 4 quick questions and we'll match you with the perfect trip. Free & instant results!",
  keywords: [
    'travel quiz', 'destination finder quiz', 'trip recommendation quiz',
    'where should I travel quiz', 'travel personality quiz',
    'which destination suits me', 'travel quiz India',
    'destination match quiz', 'vacation quiz', 'holiday destination finder',
  ],
  path: '/quiz',
  ogImage: '/images/logo-wayfare-new.png',
});

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
