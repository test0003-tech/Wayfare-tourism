'use client';

import { useEffect, useState } from 'react';
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

export default function Packages({ region }: { region: 'domestic' | 'international' }) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/packages?region=${region}`)
      .then((res) => res.json())
      .then((data) => setPackages(data))
      .catch(console.error);
  }, [region]);

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
      honeymoon: 'bg-rose-50 text-rose-700 border-rose-200',
      adventure: 'bg-orange-50 text-orange-700 border-orange-200',
      family: 'bg-blue-50 text-blue-700 border-blue-200',
      pilgrimage: 'bg-amber-50 text-amber-700 border-amber-200',
      wildlife: 'bg-green-50 text-green-700 border-green-200',
      beach: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      tourism: 'bg-teal-50 text-teal-700 border-teal-200',
      'hill-station': 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const handleViewDetails = (pkg: Package) => {
    setSelectedPkg(pkg);
    setDialogOpen(true);
  };

  return (
    <>
      <section className="py-16 sm:py-20" id={region === 'domestic' ? 'domestic-packages' : 'international-packages'}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 bg-teal-50 text-teal-700 border-teal-200">
              <MapPin className="mr-1 h-3 w-3" />
              {region === 'domestic' ? '🇮🇳 India Tours' : '🌏 International Tours'}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-lg">
              {subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((pkg) => (
              <Card
                key={pkg.id}
                className="group overflow-hidden border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                onClick={() => handleViewDetails(pkg)}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Discount Badge */}
                  {pkg.originalPrice && getDiscount(pkg) > 0 && (
                    <div className="absolute top-3 left-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                      {getDiscount(pkg)}% OFF
                    </div>
                  )}

                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-gray-800 backdrop-blur-sm shadow-sm">
                    <Clock className="h-3 w-3" />
                    {pkg.duration}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3">
                    <Badge className={`${getCategoryColor(pkg.category)} text-xs font-semibold border`}>
                      {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1).replace('-', ' ')}
                    </Badge>
                  </div>

                  {/* Heart */}
                  <button
                    className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white hover:text-rose-500 transition-colors text-gray-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                <CardContent className="p-4 sm:p-5">
                  {/* Destination */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                    <MapPin className="h-3 w-3" />
                    {pkg.destination.name}, {pkg.destination.country}
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight line-clamp-2">
                    {pkg.name}
                  </h3>

                  {/* Highlights */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {pkg.highlights.split(',').slice(0, 3).map((h, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {h.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5">
                      <Star className="h-3.5 w-3.5 fill-teal-500 text-teal-500" />
                      <span className="text-xs font-bold text-teal-700">{pkg.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({pkg.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>

                  {/* Price & CTA */}
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      {pkg.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{pkg.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{pkg.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">/person</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
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
            ))}
          </div>

          {packages.length > 6 && (
            <div className="mt-10 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAll(!showAll)}
                className="border-teal-200 text-teal-700 hover:bg-teal-50 rounded-xl"
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
