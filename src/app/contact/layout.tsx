import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Wayfare — Plan Your Dream Trip',
  description: 'Get in touch with Wayfare travel experts. Call +91 98765 43210 or email hello@wayfare.in. Plan your dream vacation with 24/7 support.',
  keywords: ['contact Wayfare', 'travel inquiry', 'book package', 'travel support', 'Wayfare contact'],
  openGraph: {
    title: 'Contact Wayfare',
    description: 'Plan your dream trip. Our travel experts are ready to help 24/7.',
    type: 'website',
    siteName: 'Wayfare',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
