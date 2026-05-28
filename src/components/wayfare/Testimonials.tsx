'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya & Rahul Sharma',
    location: 'Mumbai',
    trip: 'Kashmir Honeymoon',
    rating: 5,
    text: 'Our Kashmir honeymoon was absolutely magical! The houseboat stay on Dal Lake and the private shikara ride were dreams come true. Wayfare planned every detail perfectly.',
    avatar: '👩‍❤️‍👨',
  },
  {
    name: 'Ankit Verma',
    location: 'Delhi',
    trip: 'Dubai Luxury',
    rating: 5,
    text: 'Dubai was breathtaking! From the top of Burj Khalifa to the desert safari, every moment was unforgettable. The hotel was world-class and the itinerary was well-paced.',
    avatar: '👨',
  },
  {
    name: 'Meera Krishnan',
    location: 'Chennai',
    trip: 'Kerala Backwaters',
    rating: 5,
    text: 'Kerala is truly God\'s Own Country! The houseboat experience on the backwaters was serene and the Ayurvedic spa was rejuvenating. Highly recommend Wayfare!',
    avatar: '👩',
  },
  {
    name: 'Suresh & Family',
    location: 'Bangalore',
    trip: 'Singapore Family Trip',
    rating: 5,
    text: 'Our kids loved Universal Studios and the Night Safari! Singapore was perfect for a family vacation. Wayfare made sure everything was kid-friendly and convenient.',
    avatar: '👨‍👩‍👧‍👦',
  },
  {
    name: 'Deepika Patel',
    location: 'Ahmedabad',
    trip: 'Maldives Honeymoon',
    rating: 5,
    text: 'Maldives exceeded all our expectations! The overwater villa was luxurious, the snorkeling was incredible, and the sunset dolphin cruise was magical. Best honeymoon ever!',
    avatar: '👰',
  },
  {
    name: 'Raj Malhotra',
    location: 'Pune',
    trip: 'Manali Adventure',
    rating: 4,
    text: 'Manali adventure package was thrilling! Paragliding and river rafting were highlights. The hotel had great mountain views. Only wish the trip was longer!',
    avatar: '🧑',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What Our Travelers Say
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-lg">
            Join thousands of happy travelers who explored the world with Wayfare
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-6 shadow-md border border-gray-100 transition-all hover:shadow-lg"
            >
              <Quote className="h-8 w-8 text-teal-200 mb-3" />
              <p className="text-gray-600 text-sm leading-relaxed">{t.text}</p>

              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`h-4 w-4 ${
                      j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3 border-t pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-lg">
                  {t.avatar}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">
                    {t.location} • {t.trip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
