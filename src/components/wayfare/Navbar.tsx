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
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600">
            <Compass className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Way<span className="text-teal-600">fare</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-teal-50 hover:text-teal-700"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+919876543210" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-teal-700">
            <Phone className="h-4 w-4" />
            +91 98765 43210
          </a>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white" asChild>
            <a href="#contact">Book Now</a>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t">
            <a href="tel:+919876543210" className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              +91 98765 43210
            </a>
            <Button className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white" asChild>
              <a href="#contact" onClick={() => setMobileOpen(false)}>Book Now</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
