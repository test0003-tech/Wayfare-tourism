'use client';

import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600">
      {/* Background Image Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.png"
          alt="Beautiful travel destination"
          className="h-full w-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/60 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <MapPin className="h-4 w-4" />
            Explore India & Beyond
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Discover Your Perfect
            <span className="block text-amber-300">Travel Experience</span>
          </h1>

          <p className="mt-4 text-lg text-teal-100 sm:text-xl max-w-2xl">
            From Kashmir to Kanyakumari, Dubai to Bali — handcrafted travel packages
            for honeymooners, families, and adventurers. Your dream vacation starts here.
          </p>

          {/* Search Bar */}
          <div className="mt-8 rounded-2xl bg-white p-3 shadow-2xl sm:p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
                <MapPin className="h-5 w-5 text-teal-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500">Destination</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">Where to?</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
                <Calendar className="h-5 w-5 text-teal-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500">Duration</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">4N5D - 6N7D</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
                <Users className="h-5 w-5 text-teal-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500">Travelers</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">2 Adults</p>
                </div>
              </div>
              <Button
                className="h-auto bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-2.5"
                asChild
              >
                <a href="#packages">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </a>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-8 text-white">
            <div>
              <p className="text-2xl font-bold sm:text-3xl">500+</p>
              <p className="text-sm text-teal-200">Travel Packages</p>
            </div>
            <div>
              <p className="text-2xl font-bold sm:text-3xl">50+</p>
              <p className="text-sm text-teal-200">Destinations</p>
            </div>
            <div>
              <p className="text-2xl font-bold sm:text-3xl">10K+</p>
              <p className="text-sm text-teal-200">Happy Travelers</p>
            </div>
            <div>
              <p className="text-2xl font-bold sm:text-3xl">4.8★</p>
              <p className="text-sm text-teal-200">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
