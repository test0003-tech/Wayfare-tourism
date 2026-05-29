'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Plane,
  Hotel,
  Map,
  Phone,
  Menu,
  X,
  Compass,
  Camera,
  BookOpen,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const navLinks = [
  { href: '/destinations', label: 'Destinations', icon: Map },
  { href: '/packages', label: 'Packages', icon: Compass },
  { href: '/hotels', label: 'Hotels', icon: Hotel },
  { href: '/flights', label: 'Flights', icon: Plane },
];

const moreLinks = [
  { href: '/gallery', label: 'Gallery', icon: Camera },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/quiz', label: 'Travel Quiz', icon: Sparkles },
  { href: '/about', label: 'About', icon: Compass },
  { href: '/contact', label: 'Contact', icon: MessageSquare },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo-wayfare-new.png"
            alt="Wayfare Logo"
            width={40}
            height={40}
            className="rounded-lg glow-teal"
          />
          <span className="text-xl font-bold tracking-tight gradient-text">
            Wayfare
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                isActive(link.href)
                  ? 'bg-teal-500/10 text-teal-400 glow-teal'
                  : 'text-gray-300 hover:bg-white/5 hover:text-teal-400 hover:glow-teal'
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}

          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 200)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/5 hover:text-teal-400"
            >
              More
              <svg className={`h-3 w-3 transition-transform ${moreOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-xl glass-strong border border-white/10 py-2 shadow-xl">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${
                      isActive(link.href)
                        ? 'text-teal-400 bg-teal-500/10'
                        : 'text-gray-300 hover:text-teal-400 hover:bg-white/5'
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a href="tel:+919876543210" className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-teal-400 transition-colors">
            <Phone className="h-4 w-4" />
            +91 98765 43210
          </a>
          <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-950 font-bold glow-amber rounded-lg" asChild>
            <Link href="/contact">Book Now</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-gray-300 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden glass border-t border-white/10 px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive(link.href)
                  ? 'bg-teal-500/10 text-teal-400'
                  : 'text-gray-300 hover:bg-white/5 hover:text-teal-400'
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-white/10 mt-2">
            <p className="px-3 py-1 text-xs text-gray-500 uppercase tracking-wider">Explore</p>
            {moreLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-teal-500/10 text-teal-400'
                    : 'text-gray-300 hover:bg-white/5 hover:text-teal-400'
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <a href="tel:+919876543210" className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-teal-400 transition-colors">
              <Phone className="h-4 w-4" />
              +91 98765 43210
            </a>
            <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-950 font-bold glow-amber rounded-lg" asChild>
              <Link href="/contact" onClick={() => setMobileOpen(false)}>Book Now</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
