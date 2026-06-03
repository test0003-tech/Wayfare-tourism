import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Travel Tips | Wayfare — Expert Travel Insights',
  description: 'Expert travel tips, destination guides, and inspiration. Read about honeymoon destinations, budget travel, adventure sports, luxury hotels & more on the Wayfare blog.',
  keywords: ['travel blog', 'travel tips', 'honeymoon guide', 'budget travel', 'adventure travel', 'luxury hotels guide'],
  openGraph: {
    title: 'Blog & Travel Tips | Wayfare',
    description: 'Expert travel insights, destination guides & travel inspiration.',
    type: 'website',
    siteName: 'Wayfare',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
