'use client';

import { Badge } from '@/components/ui/badge';
import { Heart, Mountain, Users, Umbrella, Trees, Waves } from 'lucide-react';

const categories = [
  {
    id: 'honeymoon',
    name: 'Honeymoon',
    icon: Heart,
    color: 'bg-rose-50 text-rose-600 border-rose-200',
    iconBg: 'bg-rose-100',
    description: 'Romantic getaways for couples with private dinners, spa & more',
    image: '/images/packages/honeymoon.png',
  },
  {
    id: 'adventure',
    name: 'Adventure',
    icon: Mountain,
    color: 'bg-orange-50 text-orange-600 border-orange-200',
    iconBg: 'bg-orange-100',
    description: 'Trekking, rafting, paragliding & thrilling outdoor activities',
    image: '/images/packages/adventure.png',
  },
  {
    id: 'family',
    name: 'Family',
    icon: Users,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    iconBg: 'bg-blue-100',
    description: 'Kid-friendly destinations with activities for all ages',
    image: '/images/packages/family.png',
  },
  {
    id: 'pilgrimage',
    name: 'Pilgrimage',
    icon: Umbrella,
    color: 'bg-amber-50 text-amber-600 border-amber-200',
    iconBg: 'bg-amber-100',
    description: 'Spiritual journeys to sacred temples and holy sites',
    image: '/images/packages/pilgrimage.png',
  },
  {
    id: 'wildlife',
    name: 'Wildlife',
    icon: Trees,
    color: 'bg-green-50 text-green-600 border-green-200',
    iconBg: 'bg-green-100',
    description: 'Safari tours, nature reserves & exotic wildlife spotting',
    image: '/images/packages/wildlife.png',
  },
  {
    id: 'beach',
    name: 'Beach',
    icon: Waves,
    color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    iconBg: 'bg-cyan-100',
    description: 'Sun, sand & surf — tropical beach escapes & water sports',
    image: '/images/destinations/goa.png',
  },
];

export default function PackageCategories() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 bg-teal-50 text-teal-700 border-teal-200">
            ✨ Travel Styles
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose Your Travel Style
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-lg">
            Whether you seek romance, adventure, or relaxation — we have the perfect package for you
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href="#packages"
              className="group relative overflow-hidden rounded-2xl bg-white border p-5 sm:p-6 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${cat.iconBg}`}>
                  <cat.icon className={`h-6 w-6 ${cat.color.split(' ')[1]}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg">{cat.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{cat.description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-teal-600 group-hover:text-teal-700">
                Explore packages
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
