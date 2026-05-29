'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from 'lucide-react';

const footerLinks = {
  destinations: {
    title: 'Domestic',
    links: [
      { name: 'Kerala', href: '/destinations/kerala' },
      { name: 'Kashmir', href: '/destinations/kashmir' },
      { name: 'Goa', href: '/destinations/goa' },
      { name: 'Manali', href: '/destinations/manali' },
      { name: 'Darjeeling', href: '/destinations/darjeeling' },
      { name: 'Andaman', href: '/destinations/andaman' },
      { name: 'Delhi (Golden Triangle)', href: '/destinations/delhi' },
      { name: 'Sikkim', href: '/destinations/sikkim' },
    ],
  },
  international: {
    title: 'International',
    links: [
      { name: 'Dubai', href: '/destinations/dubai' },
      { name: 'Maldives', href: '/destinations/maldives' },
      { name: 'Thailand', href: '/destinations/thailand' },
      { name: 'Singapore', href: '/destinations/singapore' },
      { name: 'Bali (Indonesia)', href: '/destinations/bali' },
      { name: 'Malaysia', href: '/destinations/malaysia' },
      { name: 'Sri Lanka', href: '/destinations/srilanka' },
      { name: 'Vietnam', href: '/destinations/vietnam' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Gallery', href: '/gallery' },
      { name: 'Travel Quiz', href: '/quiz' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Partner With Us', href: '/contact' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/contact' },
      { name: 'Tour Packages', href: '/packages' },
      { name: 'Hotel Booking', href: '/hotels' },
      { name: 'Flight Deals', href: '/flights' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  },
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-white/5">
      {/* Gradient divider line */}
      <div className="h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo-wayfare-new.png"
                alt="Wayfare Logo"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-xl font-bold gradient-text">
                Wayfare
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Your trusted travel partner for domestic and international tour packages.
              Crafting unforgettable journeys since 2018.
            </p>

            <div className="mt-4 space-y-2">
              <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-400 transition-colors">
                <Phone className="h-4 w-4" />
                +91 98765 43210
              </a>
              <a href="mailto:hello@wayfare.in" className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-400 transition-colors">
                <Mail className="h-4 w-4" />
                hello@wayfare.in
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                Connaught Place, New Delhi
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-500 transition-all duration-300 hover:bg-teal-500/20 hover:text-teal-400 hover:glow-teal"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-teal-400"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-600">
              © 2025 <span className="text-gray-400">Wayfare</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>🌐 English</span>
              <span className="text-amber-500">💰 INR (₹)</span>
              <span>🇮🇳 India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
