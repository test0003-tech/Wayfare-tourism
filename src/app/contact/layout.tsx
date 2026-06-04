import type { Metadata } from 'next';
import { BUSINESS_PHONE, BUSINESS_EMAIL, generatePageMetadata, SITE_URL } from '@/lib/seo';
import { BreadcrumbJsonLd } from '@/components/wayfare/JsonLd';

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
  return (
    <>
      <BreadcrumbJsonLd items={{
        items: [
          { name: 'Home', url: SITE_URL },
          { name: 'Contact', url: `${SITE_URL}/contact` },
        ],
      }} />
      <section aria-labelledby="contact-heading">
        <h1 id="contact-heading" className="sr-only">Contact Us</h1>
        {children}
      </section>
    </>
  );
}
