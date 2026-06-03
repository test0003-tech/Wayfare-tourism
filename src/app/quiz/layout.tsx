import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Quiz | Wayfare — Find Your Dream Destination',
  description: "Take our 30-second travel quiz and get personalized destination recommendations. Answer 4 quick questions and we'll match you with the perfect trip!",
  keywords: ['travel quiz', 'destination finder', 'trip recommendation', 'where to travel', 'travel personality quiz'],
  openGraph: {
    title: 'Find Your Dream Destination | Wayfare',
    description: 'Take our 30-second quiz and find your perfect travel destination!',
    type: 'website',
    siteName: 'Wayfare',
  },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
