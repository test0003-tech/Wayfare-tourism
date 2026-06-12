'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Calendar,
  Wallet,
  Users,
  Heart,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Plane,
  Hotel,
  Check,
  Star,
  Lightbulb,
  Loader2,
  Globe,
  Mountain,
  Waves,
  Building2,
  Compass,
} from 'lucide-react';
import type { TravelPlan } from '@/lib/types';

interface AITravelPlannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  { id: 1, label: 'Destination', icon: MapPin },
  { id: 2, label: 'Dates', icon: Calendar },
  { id: 3, label: 'Budget', icon: Wallet },
  { id: 4, label: 'Travelers', icon: Users },
  { id: 5, label: 'Preferences', icon: Heart },
];

const DESTINATIONS = [
  { name: 'Kashmir', region: 'domestic', image: '/images/destinations/kashmir.png', tag: 'Paradise on Earth' },
  { name: 'Kerala', region: 'domestic', image: '/images/destinations/kerala.png', tag: 'God\'s Own Country' },
  { name: 'Goa', region: 'domestic', image: '/images/destinations/goa.png', tag: 'Beach Capital' },
  { name: 'Manali', region: 'domestic', image: '/images/destinations/manali.png', tag: 'Valley of Gods' },
  { name: 'Andaman', region: 'domestic', image: '/images/destinations/andaman.png', tag: 'Island Paradise' },
  { name: 'Darjeeling', region: 'domestic', image: '/images/destinations/darjeeling.png', tag: 'Queen of Hills' },
  { name: 'Maldives', region: 'international', image: '/images/destinations/maldives.png', tag: 'Luxury Escapes' },
  { name: 'Bali', region: 'international', image: '/images/destinations/bali.png', tag: 'Island of Gods' },
  { name: 'Dubai', region: 'international', image: '/images/destinations/dubai.png', tag: 'City of Gold' },
  { name: 'Thailand', region: 'international', image: '/images/destinations/thailand.png', tag: 'Land of Smiles' },
  { name: 'Singapore', region: 'international', image: '/images/destinations/singapore.png', tag: 'Lion City' },
  { name: 'Nepal', region: 'international', image: '/images/destinations/nepal.png', tag: 'Himalayan Beauty' },
];

const BUDGET_OPTIONS = [
  { value: 'under-15000', label: 'Under ₹15,000', desc: 'Budget-friendly', icon: '💰' },
  { value: '15000-30000', label: '₹15,000 - ₹30,000', desc: 'Value picks', icon: '💎' },
  { value: '30000-60000', label: '₹30,000 - ₹60,000', desc: 'Premium trips', icon: '✨' },
  { value: '60000-100000', label: '₹60,000 - ₹1,00,000', desc: 'Luxury escapes', icon: '👑' },
  { value: 'above-100000', label: 'Above ₹1,00,000', desc: 'Ultra luxury', icon: '🌟' },
];

const CATEGORIES = [
  { value: 'honeymoon', label: 'Honeymoon', icon: Heart, color: 'rose' },
  { value: 'adventure', label: 'Adventure', icon: Mountain, color: 'orange' },
  { value: 'family', label: 'Family', icon: Users, color: 'teal' },
  { value: 'beach', label: 'Beach', icon: Waves, color: 'cyan' },
  { value: 'pilgrimage', label: 'Pilgrimage', icon: Compass, color: 'amber' },
  { value: 'wildlife', label: 'Wildlife', icon: Globe, color: 'emerald' },
  { value: 'tourism', label: 'Sightseeing', icon: Building2, color: 'purple' },
  { value: 'hill-station', label: 'Hill Station', icon: Mountain, color: 'indigo' },
];

export default function AITravelPlanner({ open, onOpenChange }: AITravelPlannerProps) {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [customDest, setCustomDest] = useState('');
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [category, setCategory] = useState('');
  const [preferences, setPreferences] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [error, setError] = useState('');

  const selectedDest = destination || customDest;

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedDest;
      case 2: return !!duration;
      case 3: return !!budget;
      case 4: return travelers >= 1;
      case 5: return !!category;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleGeneratePlan();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setError('');
    setTravelPlan(null);

    try {
      const response = await fetch('/api/travel-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: selectedDest,
          budget,
          duration,
          travelers,
          category,
          preferences: preferences || undefined,
        }),
      });

      const data = await response.json();

      if (data.success && data.plan) {
        setTravelPlan(data.plan);
      } else {
        setError(data.error || 'Failed to generate travel plan');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPlanner = () => {
    setStep(1);
    setDestination('');
    setCustomDest('');
    setDuration('');
    setBudget('');
    setTravelers(2);
    setCategory('');
    setPreferences('');
    setIsLoading(false);
    setTravelPlan(null);
    setError('');
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetPlanner, 300);
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      honeymoon: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      adventure: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      family: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      beach: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      pilgrimage: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      wildlife: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      tourism: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'hill-station': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    };
    return colors[cat] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getBudgetLabel = (val: string) => {
    return BUDGET_OPTIONS.find((b) => b.value === val)?.label || val;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0 bg-gray-950 border border-white/10 text-white">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-teal-600/20 to-emerald-600/20 border-b border-white/10 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              AI Travel Planner
            </DialogTitle>
          </DialogHeader>

          {/* Progress Steps */}
          {!travelPlan && (
            <div className="mt-4 flex items-center gap-1">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        step > s.id
                          ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white'
                          : step === s.id
                          ? 'bg-white/10 border border-teal-500/50 text-teal-400'
                          : 'bg-white/5 text-gray-600'
                      }`}
                    >
                      {step > s.id ? <Check className="h-3.5 w-3.5" /> : s.id}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:block ${
                        step >= s.id ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-full mx-1 rounded transition-all ${
                        step > s.id ? 'bg-teal-500/50' : 'bg-white/5'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Destination */}
              {step === 1 && !travelPlan && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-white mb-1">Where do you want to go?</h3>
                  <p className="text-sm text-gray-500 mb-4">Choose your dream destination or type a custom one</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {DESTINATIONS.map((dest) => (
                      <button
                        key={dest.name}
                        onClick={() => { setDestination(dest.name); setCustomDest(''); }}
                        className={`relative overflow-hidden rounded-xl border transition-all text-left group ${
                          destination === dest.name
                            ? 'border-teal-500/50 bg-teal-500/10 glow-teal'
                            : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="relative h-20 overflow-hidden">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
                          {destination === dest.name && (
                            <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <Badge
                            variant="secondary"
                            className="absolute bottom-1 left-1 text-[9px] glass text-gray-300 border-0"
                          >
                            {dest.region === 'domestic' ? '🇮🇳 India' : '🌍 International'}
                          </Badge>
                        </div>
                        <div className="p-2">
                          <p className="text-sm font-bold text-white">{dest.name}</p>
                          <p className="text-[10px] text-gray-500">{dest.tag}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full bg-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-gray-950 px-2 text-gray-500">Or type your own</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Input
                      placeholder="Enter a destination (e.g., Sri Lanka, Vietnam...)"
                      value={customDest}
                      onChange={(e) => { setCustomDest(e.target.value); setDestination(''); }}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-teal-500/50"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Duration */}
              {step === 2 && !travelPlan && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-white mb-1">How long is your trip?</h3>
                  <p className="text-sm text-gray-500 mb-4">Select your preferred duration</p>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: '2N3D', label: '2 Nights / 3 Days', desc: 'Quick getaway', icon: '⚡' },
                      { value: '3N4D', label: '3 Nights / 4 Days', desc: 'Short break', icon: '🌴' },
                      { value: '4N5D', label: '4 Nights / 5 Days', desc: 'Popular choice', icon: '✈️' },
                      { value: '5N6D', label: '5 Nights / 6 Days', desc: 'Extended trip', icon: '🏖️' },
                      { value: '6N7D', label: '6 Nights / 7 Days', desc: 'Week-long vacay', icon: '🌊' },
                      { value: '7N8D+', label: '7+ Nights', desc: 'Grand holiday', icon: '🏔️' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setDuration(opt.value)}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                          duration === opt.value
                            ? 'border-teal-500/50 bg-teal-500/10 glow-teal'
                            : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-white">{opt.label}</p>
                          <p className="text-xs text-gray-500">{opt.desc}</p>
                        </div>
                        {duration === opt.value && (
                          <Check className="ml-auto h-4 w-4 text-teal-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Budget */}
              {step === 3 && !travelPlan && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-white mb-1">What&apos;s your budget?</h3>
                  <p className="text-sm text-gray-500 mb-4">Per person for the entire trip</p>

                  <div className="space-y-3">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setBudget(opt.value)}
                        className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                          budget === opt.value
                            ? 'border-teal-500/50 bg-teal-500/10 glow-teal'
                            : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">{opt.label}</p>
                          <p className="text-xs text-gray-500">{opt.desc}</p>
                        </div>
                        {budget === opt.value && (
                          <Check className="h-4 w-4 text-teal-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Travelers */}
              {step === 4 && !travelPlan && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-white mb-1">How many travelers?</h3>
                  <p className="text-sm text-gray-500 mb-6">We&apos;ll customize recommendations for your group</p>

                  <div className="flex flex-col items-center gap-8">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl text-white transition-all hover:bg-white/10 hover:border-teal-500/30"
                      >
                        −
                      </button>
                      <div className="text-center">
                        <p className="text-5xl font-black gradient-text">{travelers}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {travelers === 1 ? 'Solo Traveler' : `${travelers} Travelers`}
                        </p>
                      </div>
                      <button
                        onClick={() => setTravelers(Math.min(20, travelers + 1))}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl text-white transition-all hover:bg-white/10 hover:border-teal-500/30"
                      >
                        +
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                      {[
                        { value: 1, label: 'Solo', icon: '🧳' },
                        { value: 2, label: 'Couple', icon: '💑' },
                        { value: 4, label: 'Family', icon: '👨‍👩‍👧‍👦' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setTravelers(opt.value)}
                          className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-all ${
                            travelers === opt.value
                              ? 'border-teal-500/50 bg-teal-500/10 glow-teal'
                              : 'border-white/5 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <span className="text-xl">{opt.icon}</span>
                          <span className="text-xs font-medium text-gray-400">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Preferences */}
              {step === 5 && !travelPlan && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-white mb-1">What kind of trip?</h3>
                  <p className="text-sm text-gray-500 mb-4">Select your travel style</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                          category === cat.value
                            ? 'border-teal-500/50 bg-teal-500/10 glow-teal'
                            : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <cat.icon className={`h-5 w-5 ${
                          category === cat.value ? 'text-teal-400' : 'text-gray-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          category === cat.value ? 'text-white' : 'text-gray-400'
                        }`}>
                          {cat.label}
                        </span>
                        {category === cat.value && (
                          <Check className="ml-auto h-4 w-4 text-teal-400" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div>
                    <Label className="text-sm text-gray-400 mb-2 block">
                      Any special preferences? (Optional)
                    </Label>
                    <Input
                      placeholder="e.g., vegetarian food, wheelchair accessible, romantic settings..."
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-teal-500/50"
                    />
                  </div>
                </motion.div>
              )}

              {/* Loading State */}
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full border-4 border-white/5 border-t-teal-500 animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-teal-400" />
                  </div>
                  <p className="mt-6 text-lg font-bold text-white">Creating your perfect trip...</p>
                  <p className="mt-2 text-sm text-gray-500">Our AI is crafting personalized recommendations</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
                    <Plane className="h-3 w-3 animate-bounce" />
                    <span>Analyzing destinations</span>
                    <span className="text-teal-500">•</span>
                    <Hotel className="h-3 w-3 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span>Finding hotels</span>
                    <span className="text-teal-500">•</span>
                    <Star className="h-3 w-3 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span>Curating tips</span>
                  </div>
                </motion.div>
              )}

              {/* Results */}
              {travelPlan && !isLoading && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Trip Header */}
                  <div className="text-center mb-6">
                    <Badge className={`${getCategoryColor(category)} border text-xs font-semibold mb-2`}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                    </Badge>
                    <h3 className="text-2xl font-black gradient-text">{travelPlan.title}</h3>
                    <div className="flex items-center justify-center gap-2 mt-1 text-sm text-gray-400">
                      <MapPin className="h-4 w-4 text-teal-400" />
                      {travelPlan.destination}
                      <span className="text-gray-600">•</span>
                      <span>{duration}</span>
                      <span className="text-gray-600">•</span>
                      <span>{travelers} travelers</span>
                    </div>
                    <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-lg mx-auto">
                      {travelPlan.summary}
                    </p>
                  </div>

                  {/* Budget Estimate */}
                  {travelPlan.estimatedBudget && (
                    <div className="rounded-xl glass-strong p-4 mb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="h-4 w-4 text-amber-400" />
                        <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Estimated Budget</span>
                      </div>
                      <p className="text-2xl font-bold gradient-text-gold">{travelPlan.estimatedBudget}</p>
                      <p className="text-xs text-gray-500 mt-1">Budget selected: {getBudgetLabel(budget)}</p>
                    </div>
                  )}

                  {/* Packages */}
                  {travelPlan.packages && travelPlan.packages.length > 0 && (
                    <div className="mb-6">
                      <h4 className="flex items-center gap-2 text-base font-bold text-white mb-3">
                        <Plane className="h-4 w-4 text-teal-400" />
                        Recommended Packages
                      </h4>
                      <div className="space-y-3">
                        {travelPlan.packages.map((pkg, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-white/5 bg-white/5 p-4 hover:bg-white/10 transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-bold text-white">{pkg.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{pkg.duration}</p>
                              </div>
                              <p className="text-lg font-bold gradient-text-gold">{pkg.price}</p>
                            </div>
                            {pkg.highlights && pkg.highlights.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {pkg.highlights.map((h, j) => (
                                  <span
                                    key={j}
                                    className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] text-teal-400"
                                  >
                                    <Check className="h-2.5 w-2.5" />
                                    {h}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hotels */}
                  {travelPlan.hotels && travelPlan.hotels.length > 0 && (
                    <div className="mb-6">
                      <h4 className="flex items-center gap-2 text-base font-bold text-white mb-3">
                        <Hotel className="h-4 w-4 text-teal-400" />
                        Suggested Hotels
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {travelPlan.hotels.map((hotel, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-white/5 bg-white/5 p-3 hover:bg-white/10 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-bold text-white">{hotel.name}</p>
                              <Badge variant="secondary" className="glass text-gray-300 text-[10px] border-0">
                                {hotel.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-amber-400 font-semibold mt-1">{hotel.pricePerNight}/night</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {travelPlan.tips && travelPlan.tips.length > 0 && (
                    <div className="mb-6">
                      <h4 className="flex items-center gap-2 text-base font-bold text-white mb-3">
                        <Lightbulb className="h-4 w-4 text-amber-400" />
                        Travel Tips
                      </h4>
                      <div className="space-y-2">
                        {travelPlan.tips.map((tip, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 rounded-lg bg-white/5 p-3"
                          >
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-400">
                              {i + 1}
                            </div>
                            <p className="text-sm text-gray-400">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button
                      onClick={resetPlanner}
                      variant="outline"
                      className="flex-1 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Plan Another Trip
                    </Button>
                    <Button
                      onClick={handleClose}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl font-bold glow-teal"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Start Booking
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Error */}
              {error && !isLoading && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center"
                >
                  <p className="text-sm text-red-400">{error}</p>
                  <Button
                    onClick={handleGeneratePlan}
                    variant="outline"
                    size="sm"
                    className="mt-3 border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    Try Again
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {!travelPlan && !isLoading && !error && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <Button
                  onClick={handleBack}
                  variant="ghost"
                  disabled={step === 1}
                  className="text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {step === 5 ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get AI Recommendations
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
