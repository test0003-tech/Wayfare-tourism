'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import PageHero from '@/components/wayfare/PageHero';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import PageTransition from '@/components/wayfare/PageTransition';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

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

const categoryColors: Record<string, string> = {
  Honeymoon: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Beach: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Culture: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Nightlife: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Luxury: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Adventure: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
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

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const goNext = () => {
    setLightboxIndex((prev) => (prev + 1) % filtered.length);
  };

  const goPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, filtered.length]);

  return (
    <PageTransition>
      <div className="bg-gray-950 min-h-screen">
        <PageHero
          badge="Travel Moments"
          badgeIcon={Camera}
          title="Photo Gallery"
          subtitle="Real experiences from our happy travelers — explore moments that inspire your next adventure"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Gallery' }]} />

          <section ref={sectionRef} className="py-8 sm:py-12">
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === tab
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white glow-teal'
                      : 'glass text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                  {tab !== 'All' && (
                    <span className="ml-1.5 text-xs opacity-70">
                      ({galleryImages.filter((img) => img.category === tab).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((img, i) => (
                  <motion.div
                    key={img.src}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: i * 0.03 }}
                    className="break-inside-avoid group relative overflow-hidden rounded-xl glass cursor-pointer tilt-card hover:glow-teal"
                    onClick={() => openLightbox(i)}
                  >
                    <img
                      src={img.src}
                      alt={img.caption}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Zoom icon */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                        <ZoomIn className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    {/* Caption on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-sm font-semibold text-white">{img.caption}</p>
                      <span className={`inline-block mt-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${categoryColors[img.category] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                        {img.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Image count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-gray-500 mt-8"
            >
              Showing {filtered.length} of {galleryImages.length} photos
            </motion.p>
          </section>
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="sm:max-w-4xl bg-gray-950/95 border-white/10 backdrop-blur-xl p-0 overflow-hidden rounded-2xl">
            <DialogTitle className="sr-only">
              {filtered[lightboxIndex]?.caption || 'Gallery Image'}
            </DialogTitle>
            {filtered[lightboxIndex] && (
              <div className="relative">
                <img
                  src={filtered[lightboxIndex].src}
                  alt={filtered[lightboxIndex].caption}
                  className="w-full max-h-[75vh] object-contain bg-black/50"
                />
                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950/90 to-transparent p-6">
                  <h3 className="text-lg font-bold text-white">{filtered[lightboxIndex].caption}</h3>
                  <span className={`inline-block mt-1 rounded-full px-3 py-1 text-xs font-medium border ${categoryColors[filtered[lightboxIndex].category] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                    {filtered[lightboxIndex].category}
                  </span>
                </div>

                {/* Navigation arrows */}
                {filtered.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); goPrev(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 text-white" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); goNext(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-white" />
                    </button>
                  </>
                )}

                {/* Counter */}
                <div className="absolute top-4 left-4 flex h-8 items-center rounded-full bg-white/10 backdrop-blur-sm px-3 text-xs font-medium text-white">
                  {lightboxIndex + 1} / {filtered.length}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
