'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calculator,
  MapPin,
  Users,
  Hotel,
  Plane,
  Activity,
  TrendingDown,
  ArrowRight,
  Info,
  Sparkles,
  IndianRupee,
} from 'lucide-react';

const destinations = [
  { name: 'Kerala', baseCost: 5000, flightCost: 3000, marketPremium: 1.2 },
  { name: 'Kashmir', baseCost: 6000, flightCost: 4000, marketPremium: 1.25 },
  { name: 'Goa', baseCost: 3500, flightCost: 2500, marketPremium: 1.15 },
  { name: 'Maldives', baseCost: 18000, flightCost: 12000, marketPremium: 1.3 },
  { name: 'Dubai', baseCost: 12000, flightCost: 8000, marketPremium: 1.2 },
  { name: 'Thailand', baseCost: 8000, flightCost: 6000, marketPremium: 1.2 },
  { name: 'Bali', baseCost: 10000, flightCost: 7000, marketPremium: 1.25 },
  { name: 'Singapore', baseCost: 9000, flightCost: 6500, marketPremium: 1.2 },
  { name: 'Andaman', baseCost: 7000, flightCost: 5000, marketPremium: 1.15 },
  { name: 'Manali', baseCost: 4000, flightCost: 0, marketPremium: 1.1 },
  { name: 'Sri Lanka', baseCost: 7500, flightCost: 5500, marketPremium: 1.2 },
  { name: 'Vietnam', baseCost: 6500, flightCost: 5000, marketPremium: 1.2 },
];

const hotelTiers = [
  { name: 'Budget', multiplier: 1, icon: '🏨', description: 'Clean & comfortable' },
  { name: 'Standard', multiplier: 1.5, icon: '🌟', description: 'Great amenities' },
  { name: 'Premium', multiplier: 2.5, icon: '💎', description: 'Luxury experience' },
  { name: 'Luxury', multiplier: 4, icon: '👑', description: '5-star excellence' },
];

const activities = [
  { id: 'adventure', name: 'Adventure Sports', cost: 3000, icon: '🪂' },
  { id: 'spa', name: 'Spa & Wellness', cost: 2500, icon: '💆' },
  { id: 'cultural', name: 'Cultural Tour', cost: 1500, icon: '🏛️' },
  { id: 'water', name: 'Water Activities', cost: 3500, icon: '🤿' },
  { id: 'food', name: 'Food & Culinary', cost: 2000, icon: '🍽️' },
  { id: 'photography', name: 'Photography Tour', cost: 2500, icon: '📸' },
  { id: 'nightlife', name: 'Nightlife Experience', cost: 2000, icon: '🎉' },
  { id: 'wildlife', name: 'Wildlife Safari', cost: 3000, icon: '🦁' },
];

export default function TripCostCalculator() {
  const [destination, setDestination] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [duration, setDuration] = useState([5]);
  const [hotelTier, setHotelTier] = useState('Standard');
  const [includeFlight, setIncludeFlight] = useState(true);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const toggleActivity = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const calculation = useMemo(() => {
    const dest = destinations.find((d) => d.name === destination);
    const tier = hotelTiers.find((t) => t.name === hotelTier);
    if (!dest || !tier) return null;

    const nights = duration[0];
    const totalTravelers = adults + children * 0.7;

    const accommodation = dest.baseCost * tier.multiplier * nights;
    const flight = includeFlight ? dest.flightCost * totalTravelers : 0;
    const activityCost = selectedActivities.reduce((sum, id) => {
      const activity = activities.find((a) => a.id === id);
      return sum + (activity ? activity.cost * totalTravelers : 0);
    }, 0);

    const subtotal = accommodation + flight + activityCost;
    const serviceFee = subtotal * 0.05;
    const total = subtotal + serviceFee;
    const marketPrice = total * dest.marketPremium;
    const savings = marketPrice - total;

    return {
      accommodation: Math.round(accommodation),
      flight: Math.round(flight),
      activities: Math.round(activityCost),
      serviceFee: Math.round(serviceFee),
      total: Math.round(total),
      marketPrice: Math.round(marketPrice),
      savings: Math.round(savings),
      perPerson: Math.round(total / totalTravelers),
    };
  }, [destination, adults, children, duration, hotelTier, includeFlight, selectedActivities]);

  const maxBarValue = calculation
    ? Math.max(calculation.accommodation, calculation.flight, calculation.activities, calculation.serviceFee)
    : 1;

  return (
    <section className="py-16 sm:py-20 bg-gray-950 relative overflow-hidden" id="calculator">
      {/* Background effects */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge variant="secondary" className="mb-3 bg-amber-500/10 text-amber-300 border-amber-500/30">
            <Calculator className="mr-1 h-3 w-3" />
            Trip Cost Calculator
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text-gold">Plan Your Budget</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
            Get an instant estimate for your dream trip. Transparent pricing, no hidden costs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl glass-strong p-6 sm:p-8 space-y-6"
          >
            {/* Destination */}
            <div>
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-teal-400" />
                Destination
              </label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {destinations.map((d) => (
                    <SelectItem key={d.name} value={d.name} className="text-gray-300 focus:text-white focus:bg-white/5">
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Travelers */}
            <div>
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-teal-400" />
                Travelers
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 border border-white/5 p-3">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Adults</p>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="h-7 w-7 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="text-lg font-bold text-white w-6 text-center">{adults}</span>
                    <button
                      onClick={() => setAdults(Math.min(10, adults + 1))}
                      className="h-7 w-7 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/5 p-3">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Children</p>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="h-7 w-7 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="text-lg font-bold text-white w-6 text-center">{children}</span>
                    <button
                      onClick={() => setChildren(Math.min(6, children + 1))}
                      className="h-7 w-7 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration Slider */}
            <div>
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
                <Hotel className="h-4 w-4 text-teal-400" />
                Duration: <span className="text-amber-400">{duration[0]} Nights</span>
              </label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={2}
                max={14}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2N</span>
                <span>8N</span>
                <span>14N</span>
              </div>
            </div>

            {/* Hotel Tier */}
            <div>
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
                <Hotel className="h-4 w-4 text-teal-400" />
                Hotel Tier
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {hotelTiers.map((tier) => (
                  <button
                    key={tier.name}
                    onClick={() => setHotelTier(tier.name)}
                    className={`rounded-xl p-3 text-center transition-all duration-300 border ${
                      hotelTier === tier.name
                        ? 'bg-teal-500/10 border-teal-500/30 text-teal-300 glow-teal'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xl">{tier.icon}</span>
                    <p className="text-xs font-bold mt-1">{tier.name}</p>
                    <p className="text-[10px] text-gray-500">{tier.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Flight Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-4">
              <div className="flex items-center gap-3">
                <Plane className="h-5 w-5 text-teal-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Include Flights</p>
                  <p className="text-xs text-gray-500">Round-trip airfare included</p>
                </div>
              </div>
              <Switch checked={includeFlight} onCheckedChange={setIncludeFlight} />
            </div>

            {/* Activities */}
            <div>
              <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4 text-teal-400" />
                Activities &amp; Add-ons
              </label>
              <div className="grid grid-cols-2 gap-2">
                {activities.map((activity) => (
                  <label
                    key={activity.id}
                    className={`flex items-center gap-2 rounded-xl p-2.5 cursor-pointer transition-all duration-300 border ${
                      selectedActivities.includes(activity.id)
                        ? 'bg-teal-500/10 border-teal-500/30'
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <Checkbox
                      checked={selectedActivities.includes(activity.id)}
                      onCheckedChange={() => toggleActivity(activity.id)}
                      className="border-white/20 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                    />
                    <span className="text-sm">{activity.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-300 truncate">{activity.name}</p>
                      <p className="text-[10px] text-gray-500">₹{activity.cost.toLocaleString('en-IN')}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Price Result */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {calculation ? (
              <>
                {/* Total Price Card */}
                <div className="rounded-2xl glass-strong p-6 sm:p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-amber-500 to-emerald-500" />
                  <p className="text-sm text-gray-400 mb-1">Estimated Trip Cost</p>
                  <motion.p
                    key={calculation.total}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl sm:text-5xl font-black gradient-text-gold"
                  >
                    ₹{calculation.total.toLocaleString('en-IN')}
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-1">
                    ₹{calculation.perPerson.toLocaleString('en-IN')} per person
                  </p>

                  {/* Market Comparison */}
                  <div className="mt-4 rounded-xl bg-teal-500/10 border border-teal-500/20 p-3 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-teal-400 shrink-0" />
                    <p className="text-sm text-teal-300">
                      You save <span className="font-bold">₹{calculation.savings.toLocaleString('en-IN')}</span> vs market average
                    </p>
                  </div>

                  {/* Market Price */}
                  <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <IndianRupee className="h-3 w-3" />
                    Market average: ₹{calculation.marketPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="rounded-2xl glass-strong p-6">
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="w-full flex items-center justify-between text-sm font-semibold text-gray-300 mb-4"
                  >
                    <span className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-teal-400" />
                      Price Breakdown
                    </span>
                    <motion.span
                      animate={{ rotate: showBreakdown ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ▾
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {showBreakdown && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3 overflow-hidden"
                      >
                        {[
                          { label: 'Accommodation', value: calculation.accommodation, color: 'bg-teal-500', icon: '🏨' },
                          { label: 'Flights', value: calculation.flight, color: 'bg-amber-500', icon: '✈️' },
                          { label: 'Activities', value: calculation.activities, color: 'bg-emerald-500', icon: '🎯' },
                          { label: 'Service Fee (5%)', value: calculation.serviceFee, color: 'bg-purple-500', icon: '📋' },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-400 flex items-center gap-1.5">
                                <span>{item.icon}</span>
                                {item.label}
                              </span>
                              <span className="font-semibold text-white">
                                ₹{item.value.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.value / maxBarValue) * 100}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className={`h-full rounded-full ${item.color}`}
                              />
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CTA */}
                <Button
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold rounded-xl h-12 glow-teal text-base"
                  asChild
                >
                  <a href="#contact">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Exact Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </>
            ) : (
              <div className="rounded-2xl glass-strong p-8 sm:p-12 text-center">
                <Calculator className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400">Select a Destination</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Choose your dream destination to see an instant cost estimate
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
