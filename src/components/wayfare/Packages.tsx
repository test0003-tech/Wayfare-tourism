'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Package } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Star,
  Clock,
  MapPin,
  Heart,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import PackageDetailDialog from './PackageDetailDialog';
import { useWishlist } from '@/lib/wishlist';

export default function Packages({ region }: { region: 'domestic' | 'international' }) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { addItem, removeItem, isInWishlist } = useWishlist();

  useEffect(() => {
    fetch(`/api/packages?region=${region}`)
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch(console.error);
  }, [region]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const title = region === 'domestic' ? 'Domestic Tour Packages' : 'International Tour Packages';
  const subtitle = region === 'domestic'
    ? 'Handcrafted packages for India\'s most beautiful destinations — starting from ₹11,999'
    : 'Explore the world with our curated international packages — starting from ₹21,999';

  const displayed = showAll ? packages : packages.slice(0, 6);

  const getDiscount = (pkg: Package) => {
    if (!pkg.originalPrice) return 0;
    return Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      honeymoon: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      adventure: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      family: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      pilgrimage: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      wildlife: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      beach: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      tourism: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      'hill-station': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };
    return colors[category] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const handleViewDetails = (pkg: Package) => {
    setSelectedPkg(pkg);
    setDialogOpen(true);
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="py-16 sm:py-20 bg-gradient-to-b from-gray-950 to-gray-900"
        id={region === 'domestic' ? 'domestic-packages' : 'international-packages'}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 glass text-teal-300 border-teal-500/30">
              <MapPin className="mr-1 h-3 w-3" />
              {region === 'domestic' ? '🇮🇳 India Tours' : '🌏 International Tours'}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="gradient-text">{title}</span>
            </h2>
            <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
              {subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card
                  className="group overflow-hidden border-0 glass tilt-card cursor-pointer transition-all duration-300 hover:glow-teal"
                  onClick={() => handleViewDetails(pkg)}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

                    {/* Discount Badge */}
                    {pkg.originalPrice && getDiscount(pkg) > 0 && (
                      <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-1 text-xs font-bold text-gray-950 shadow-lg glow-amber">
                        {getDiscount(pkg)}% OFF
                      </div>
                    )}

                    {/* Duration Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full glass px-2.5 py-1 text-xs font-bold text-white">
                      <Clock className="h-3 w-3" />
                      {pkg.duration}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                      <Badge className={`${getCategoryColor(pkg.category)} text-xs font-semibold border`}>
                        {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1).replace('-', ' ')}
                      </Badge>
                    </div>

                    {/* Heart / Wishlist */}
                    <button
                      className={`absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full glass transition-all duration-200 ${
                        isInWishlist(pkg.id)
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'text-gray-300 hover:bg-white/20 hover:text-rose-400'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isInWishlist(pkg.id)) {
                          removeItem(pkg.id);
                        } else {
                          addItem({
                            id: pkg.id,
                            name: pkg.name,
                            destination: `${pkg.destination.name}, ${pkg.destination.country}`,
                            image: pkg.image,
                            price: pkg.price,
                            originalPrice: pkg.originalPrice || undefined,
                            duration: pkg.duration,
                            rating: pkg.rating,
                            category: pkg.category,
                          });
                        }
                      }}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(pkg.id) ? 'fill-rose-400' : ''}`} />
                    </button>
                  </div>

                  <CardContent className="p-4 sm:p-5">
                    {/* Destination */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                      <MapPin className="h-3 w-3" />
                      {pkg.destination.name}, {pkg.destination.country}
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-white text-base sm:text-lg leading-tight line-clamp-2">
                      {pkg.name}
                    </h3>

                    {/* Highlights */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {pkg.highlights.split(',').slice(0, 3).map((h, idx) => (
                        <span key={idx} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full border border-white/5">
                          {h.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-md bg-teal-500/10 px-2 py-0.5">
                        <Star className="h-3.5 w-3.5 fill-teal-400 text-teal-400" />
                        <span className="text-xs font-bold text-teal-400">{pkg.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({pkg.reviewCount.toLocaleString()} reviews)
                      </span>
                    </div>

                    {/* Price & CTA */}
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        {pkg.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{pkg.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-amber-400">
                            ₹{pkg.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">/person</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-lg font-semibold"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(pkg);
                        }}
                      >
                        View Details
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {packages.length > 6 && (
            <div className="mt-10 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAll(!showAll)}
                className="border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-xl"
              >
                {showAll ? (
                  <>
                    Show Less <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    View All {packages.length} Packages <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      <PackageDetailDialog
        pkg={selectedPkg}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
