'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const galleryImages = [
  { src: '/images/gallery/honeymoon-maldives.png', caption: 'Honeymoon in Maldives', category: 'Honeymoon' },
  { src: '/images/gallery/goa-beach-party.png', caption: 'Goa Beach Party', category: 'Beach' },
  { src: '/images/gallery/family-andaman-beach.png', caption: 'Family Fun in Andaman', category: 'Beach' },
  { src: '/images/gallery/kashmir-shikara.png', caption: 'Shikara Ride, Kashmir', category: 'Culture' },
  { src: '/images/gallery/dubai-nightlife.png', caption: 'Dubai Nightlife', category: 'Nightlife' },
  { src: '/images/gallery/bali-resort-pool.png', caption: 'Bali Resort Pool', category: 'Luxury' },
  { src: '/images/gallery/manali-trekking.png', caption: 'Trekking in Manali', category: 'Adventure' },
  { src: '/images/gallery/thailand-market.png', caption: 'Thailand Floating Market', category: 'Culture' },
  { src: '/images/gallery/kerala-houseboat.png', caption: 'Kerala Houseboat', category: 'Luxury' },
  { src: '/images/gallery/singapore-gardens.png', caption: 'Gardens by the Bay, Singapore', category: 'Culture' },
  { src: '/images/gallery/andaman-scuba.png', caption: 'Scuba Diving, Andaman', category: 'Adventure' },
  { src: '/images/gallery/luxury-hotel-room.png', caption: 'Luxury Hotel Suite', category: 'Luxury' },
  { src: '/images/gallery/taj-mahal-visit.png', caption: 'Taj Mahal Visit', category: 'Culture' },
  { src: '/images/gallery/bangkok-nightclub.png', caption: 'Bangkok Nightlife', category: 'Nightlife' },
  { src: '/images/gallery/dubai-desert-safari.png', caption: 'Desert Safari, Dubai', category: 'Adventure' },
  { src: '/images/gallery/maldives-beach-dinner.png', caption: 'Beach Dinner, Maldives', category: 'Honeymoon' },
  { src: '/images/gallery/goa-jetski.png', caption: 'Jet Skiing in Goa', category: 'Adventure' },
  { src: '/images/gallery/bali-temple.png', caption: 'Bali Temple', category: 'Culture' },
  { src: '/images/gallery/hotel-breakfast.png', caption: 'Hotel Breakfast Spread', category: 'Luxury' },
  { src: '/images/gallery/vietnam-hoian.png', caption: 'Hoi An, Vietnam', category: 'Culture' },
  { src: '/images/gallery/darjeeling-sunrise.png', caption: 'Sunrise at Darjeeling', category: 'Adventure' },
  { src: '/images/gallery/malaysia-petronas.png', caption: 'Petronas Towers, Malaysia', category: 'Culture' },
  { src: '/images/gallery/pool-party.png', caption: 'Pool Party Vibes', category: 'Beach' },
  { src: '/images/gallery/srilanka-safari.png', caption: 'Safari in Sri Lanka', category: 'Adventure' },
  { src: '/images/gallery/kerala-spa.png', caption: 'Kerala Ayurvedic Spa', category: 'Luxury' },
  { src: '/images/gallery/manali-paragliding.png', caption: 'Paragliding in Manali', category: 'Adventure' },
  { src: '/images/gallery/beach-birthday.png', caption: 'Beach Birthday Celebration', category: 'Beach' },
  { src: '/images/gallery/srilanka-sigiriya.png', caption: 'Sigiriya, Sri Lanka', category: 'Culture' },
  { src: '/images/gallery/vietnam-halong.png', caption: 'Halong Bay, Vietnam', category: 'Culture' },
  { src: '/images/gallery/dubai-fine-dining.png', caption: 'Fine Dining, Dubai', category: 'Luxury' },
  { src: '/images/gallery/darjeeling-train.png', caption: 'Toy Train, Darjeeling', category: 'Adventure' },
  { src: '/images/gallery/thailand-fullmoon.png', caption: 'Full Moon Party, Thailand', category: 'Nightlife' },
  { src: '/images/gallery/kashmir-gondola.png', caption: 'Gondola Ride, Kashmir', category: 'Adventure' },
  { src: '/images/gallery/singapore-market.png', caption: 'Singapore Markets', category: 'Culture' },
  { src: '/images/gallery/kerala-sunset.png', caption: 'Sunset in Kerala', category: 'Honeymoon' },
  { src: '/images/gallery/singapore-universal.png', caption: 'Universal Studios, Singapore', category: 'Beach' },
  { src: '/images/gallery/rishikesh-rafting.png', caption: 'River Rafting, Rishikesh', category: 'Adventure' },
  { src: '/images/gallery/maldives-yacht.png', caption: 'Yacht Experience, Maldives', category: 'Luxury' },
  { src: '/images/gallery/kerala-kathakali.png', caption: 'Kathakali Dance, Kerala', category: 'Culture' },
  { src: '/images/gallery/hotel-cocktails.png', caption: 'Sunset Cocktails', category: 'Luxury' },
];

const filterTabs = ['All', 'Honeymoon', 'Adventure', 'Beach', 'Nightlife', 'Culture', 'Luxury'];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered = activeFilter === 'All'
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeFilter);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-gray-950" id="gallery">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 glass text-amber-300 border-amber-500/30">
            📸 Gallery
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">Travel Moments</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
            Real experiences from our happy travelers
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === tab
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white glow-teal'
                  : 'glass text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="break-inside-avoid group relative overflow-hidden rounded-xl glass"
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-sm font-semibold text-white">{img.caption}</p>
                  <span className="text-xs text-teal-400">{img.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
