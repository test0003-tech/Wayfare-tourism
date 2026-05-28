'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Plane,
  Hotel,
  Map,
  Phone,
  Menu,
  X,
  Compass,
} from 'lucide-react';

const navLinks = [
  { href: '#packages', label: 'Packages', icon: Map },
  { href: '#hotels', label: 'Hotels', icon: Hotel },
  { href: '#flights', label: 'Flights', icon: Plane },
  { href: '#contact', label: 'Contact', icon: Phone },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 glow-teal">
            <Compass className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight gradient-text">
            Wayfare
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/5 hover:text-teal-400 hover:glow-teal"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+919876543210" className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-teal-400 transition-colors">
            <Phone className="h-4 w-4" />
            +91 98765 43210
          </a>
          <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-950 font-bold glow-amber rounded-lg" asChild>
            <a href="#contact">Book Now</a>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/5 text-gray-300 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/10 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-teal-400 transition-all"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-white/10">
            <a href="tel:+919876543210" className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-teal-400 transition-colors">
              <Phone className="h-4 w-4" />
              +91 98765 43210
            </a>
            <Button className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-950 font-bold glow-amber rounded-lg" asChild>
              <a href="#contact" onClick={() => setMobileOpen(false)}>Book Now</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
