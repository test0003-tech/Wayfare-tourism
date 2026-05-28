'use client';

import { Package } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  Clock,
  MapPin,
  Check,
  Calendar,
  Users,
  Phone,
} from 'lucide-react';

interface PackageDetailDialogProps {
  pkg: Package | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PackageDetailDialog({
  pkg,
  open,
  onOpenChange,
}: PackageDetailDialogProps) {
  if (!pkg) return null;

  const highlights = pkg.highlights.split(',').map((h) => h.trim());
  const included = pkg.included.split(',').map((i) => i.trim());
  const itinerary = JSON.parse(pkg.itinerary) as {
    day: number;
    title: string;
    desc: string;
  }[];

  const discount = pkg.originalPrice
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Hero Image */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {discount > 0 && (
            <div className="absolute top-4 left-4 rounded-full bg-rose-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg">
              {discount}% OFF
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${getCategoryColor(pkg.category)} text-xs font-semibold border`}>
                {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1).replace('-', ' ')}
              </Badge>
              <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs">
                <Clock className="mr-1 h-3 w-3" />
                {pkg.duration}
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {pkg.name}
            </DialogTitle>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {pkg.destination.name}, {pkg.destination.country}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {pkg.rating} ({pkg.reviewCount.toLocaleString()} reviews)
              </span>
            </div>
          </DialogHeader>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed">{pkg.description}</p>

          {/* Price Card */}
          <div className="mt-5 rounded-xl bg-teal-50 border border-teal-100 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-medium text-teal-600 uppercase tracking-wider">Starting from</p>
                <div className="flex items-baseline gap-2 mt-1">
                  {pkg.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ₹{pkg.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-teal-700">
                    ₹{pkg.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">/person</span>
                </div>
                {discount > 0 && (
                  <p className="text-sm text-teal-600 font-medium mt-1">
                    You save ₹{((pkg.originalPrice || 0) - pkg.price).toLocaleString()} per person!
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {pkg.nights} Nights / {pkg.days} Days
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <Users className="h-4 w-4" />
                  Per person on twin sharing
                </div>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-6">
            <h3 className="text-base font-bold text-gray-900 mb-3">Tour Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {highlights.map((highlight, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100">
                    <Check className="h-3 w-3 text-teal-600" />
                  </div>
                  {highlight}
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-5" />

          {/* Itinerary */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">Day-by-Day Itinerary</h3>
            <div className="space-y-3">
              {itinerary.map((day, i) => (
                <div
                  key={i}
                  className="relative flex gap-4 rounded-xl bg-gray-50 p-3 sm:p-4"
                >
                  <div className="flex flex-col items-center shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                      {day.day}
                    </div>
                    {i < itinerary.length - 1 && (
                      <div className="mt-1 w-0.5 flex-1 bg-teal-200" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900">{day.title}</h4>
                    <p className="mt-0.5 text-xs sm:text-sm text-gray-500">{day.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-5" />

          {/* Inclusions */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">What&apos;s Included</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {included.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-5" />

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white rounded-lg h-12 text-base"
              asChild
            >
              <a href="#contact" onClick={() => onOpenChange(false)}>
                Book This Package
              </a>
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-teal-200 text-teal-700 hover:bg-teal-50 rounded-lg h-12 text-base"
              asChild
            >
              <a href="tel:+919876543210">
                <Phone className="mr-2 h-4 w-4" />
                Call for Details
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
