import type { Metadata } from 'next';
import { BUSINESS_PHONE, BUSINESS_EMAIL, generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us — Plan Your Dream Trip',
  description: `Get in touch with Wayfare travel experts. Call ${BUSINESS_PHONE} or email ${BUSINESS_EMAIL}. Plan your dream vacation with 24/7 support. Quick response guaranteed for tour packages, hotel bookings & flight deals.`,
  keywords: [
    'contact Wayfare Travel', 'Wayfare phone number', 'Wayfare email',
    'travel inquiry India', 'book tour package', 'travel support',
    'travel consultation', 'Wayfare customer care', 'travel helpline India',
    'book holiday package', 'Wayfare contact details',
  ],
  path: '/contact',
  ogImage: '/images/logo-wayfare-new.png',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
