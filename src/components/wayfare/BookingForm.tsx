'use client';

import { useState, useMemo } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  BedDouble,
  Plus,
  Minus,
  Shield,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Check,
  Plane,
  Umbrella,
  Utensils,
  Map,
  AlertCircle,
  Loader2,
  FileText,
} from 'lucide-react';
import BookingConfirmation from './BookingConfirmation';
import type { Package } from '@/lib/types';

interface BookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pkg?: Package | null;
}

const BOOKING_STEPS = [
  { id: 1, label: 'Traveler Details', icon: User },
  { id: 2, label: 'Trip Dates', icon: Calendar },
  { id: 3, label: 'Room & Add-ons', icon: BedDouble },
  { id: 4, label: 'Review & Pay', icon: CreditCard },
];

const ROOM_TYPES = [
  { value: 'standard', label: 'Standard Room', desc: 'Comfortable & budget-friendly', priceModifier: 0 },
  { value: 'deluxe', label: 'Deluxe Room', desc: 'Spacious with premium amenities', priceModifier: 0.2 },
  { value: 'superior', label: 'Superior Room', desc: 'Extra space & great views', priceModifier: 0.35 },
  { value: 'suite', label: 'Luxury Suite', desc: 'Premium suite with living area', priceModifier: 0.6 },
];

const ADD_ONS = [
  { id: 'airport-transfer', label: 'Airport Transfer', desc: 'Pickup & drop-off', icon: Plane, price: 2500 },
  { id: 'travel-insurance', label: 'Travel Insurance', desc: 'Full trip coverage', icon: Umbrella, price: 1500 },
  { id: 'meal-plan', label: 'Meal Plan Upgrade', desc: 'All-inclusive meals', icon: Utensils, price: 4000 },
  { id: 'guided-tour', label: 'Guided City Tour', desc: 'Expert local guide', icon: Map, price: 3000 },
];

export default function BookingForm({ open, onOpenChange, pkg }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Traveler Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');

  // Step 2: Trip Dates
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Step 3: Room & Add-ons
  const [roomType, setRoomType] = useState('standard');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');

  // Step 4: Terms
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Confirmation
  const [bookingId, setBookingId] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const basePrice = pkg?.price || 15000;

  const priceBreakdown = useMemo(() => {
    const roomTypeData = ROOM_TYPES.find((r) => r.value === roomType);
    const roomModifier = roomTypeData?.priceModifier || 0;

    const baseTotal = basePrice * adults + (basePrice * 0.5) * children;
    const roomUpgrade = baseTotal * roomModifier;
    const addOnTotal = selectedAddOns.reduce((sum, addOnId) => {
      const addon = ADD_ONS.find((a) => a.id === addOnId);
      return sum + (addon?.price || 0);
    }, 0);

    const subtotal = baseTotal + roomUpgrade + addOnTotal;
    const tax = subtotal * 0.05;
    const total = Math.round(subtotal + tax);

    return {
      baseTotal: Math.round(baseTotal),
      roomUpgrade: Math.round(roomUpgrade),
      addOnTotal,
      subtotal: Math.round(subtotal),
      tax: Math.round(tax),
      total,
    };
  }, [basePrice, adults, children, roomType, selectedAddOns]);

  const canProceed = () => {
    switch (step) {
      case 1:
        return name.trim().length >= 2 && email.includes('@') && phone.trim().length >= 8;
      case 2:
        return departureDate && returnDate && new Date(returnDate) > new Date(departureDate) && adults >= 1;
      case 3:
        return true;
      case 4:
        return agreedToTerms;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          age: age ? parseInt(age) : undefined,
          packageId: pkg?.id || undefined,
          adults,
          children,
          departureDate,
          returnDate,
          roomType,
          specialRequests: specialRequests.trim() || undefined,
          addOns: selectedAddOns,
          totalPrice: priceBreakdown.total,
        }),
      });

      const data = await response.json();

      if (data.success && data.booking) {
        setBookingId(data.booking.id);
        setShowConfirmation(true);
      } else {
        setError(data.error || 'Failed to create booking');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setName('');
    setEmail('');
    setPhone('');
    setAge('');
    setDepartureDate('');
    setReturnDate('');
    setAdults(2);
    setChildren(0);
    setRoomType('standard');
    setSelectedAddOns([]);
    setSpecialRequests('');
    setAgreedToTerms(false);
    setBookingId('');
    setError('');
    setShowConfirmation(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetForm, 300);
  };

  // Get minimum departure date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0 bg-gray-950 border border-white/10 text-white">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-teal-600/20 to-emerald-600/20 border-b border-white/10 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              Book Your Trip
              {pkg && (
                <Badge className="ml-2 glass text-teal-300 border-0 text-xs">
                  {pkg.name}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* Progress Steps */}
          {!showConfirmation && (
            <div className="mt-4 flex items-center gap-1">
              {BOOKING_STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex items-center gap-1.5 flex-1">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                        step > s.id
                          ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white'
                          : step === s.id
                          ? 'bg-white/10 border border-teal-500/50 text-teal-400'
                          : 'bg-white/5 text-gray-600'
                      }`}
                    >
                      {step > s.id ? <Check className="h-3 w-3" /> : s.id}
                    </div>
                    <span
                      className={`text-[10px] font-medium hidden sm:block ${
                        step >= s.id ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < BOOKING_STEPS.length - 1 && (
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
              {/* Step 1: Traveler Details */}
              {step === 1 && !showConfirmation && (
                <motion.div
                  key="bstep1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-white mb-1">Traveler Details</h3>
                  <p className="text-sm text-gray-500 mb-5">Tell us about the primary traveler</p>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-gray-400 mb-1.5 block">
                        Full Name <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                        <Input
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-teal-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-gray-400 mb-1.5 block">
                        Email Address <span className="text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-teal-500/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-400 mb-1.5 block">
                          Phone Number <span className="text-red-400">*</span>
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                          <Input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-teal-500/50"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-400 mb-1.5 block">Age</Label>
                        <Input
                          type="number"
                          placeholder="25"
                          min={1}
                          max={120}
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-teal-500/50"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Trip Dates */}
              {step === 2 && !showConfirmation && (
                <motion.div
                  key="bstep2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-white mb-1">Trip Dates & Travelers</h3>
                  <p className="text-sm text-gray-500 mb-5">When are you traveling and with whom?</p>

                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-400 mb-1.5 block">
                          Departure Date <span className="text-red-400">*</span>
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                          <Input
                            type="date"
                            min={minDate}
                            value={departureDate}
                            onChange={(e) => {
                              setDepartureDate(e.target.value);
                              if (returnDate && new Date(returnDate) <= new Date(e.target.value)) {
                                setReturnDate('');
                              }
                            }}
                            className="pl-10 bg-white/5 border-white/10 text-white focus:border-teal-500/50"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-400 mb-1.5 block">
                          Return Date <span className="text-red-400">*</span>
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                          <Input
                            type="date"
                            min={departureDate || minDate}
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="pl-10 bg-white/5 border-white/10 text-white focus:border-teal-500/50"
                          />
                        </div>
                      </div>
                    </div>

                    {departureDate && returnDate && (
                      <div className="rounded-lg glass p-3">
                        <p className="text-xs text-teal-400 font-medium">
                          Trip Duration: {Math.ceil((new Date(returnDate).getTime() - new Date(departureDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </p>
                      </div>
                    )}

                    <Separator className="bg-white/5" />

                    <div>
                      <Label className="text-sm text-gray-400 mb-3 block">
                        Number of Travelers <span className="text-red-400">*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Adults</p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xl font-bold text-white w-8 text-center">{adults}</span>
                            <button
                              onClick={() => setAdults(Math.min(10, adults + 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Children</p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setChildren(Math.max(0, children - 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xl font-bold text-white w-8 text-center">{children}</span>
                            <button
                              onClick={() => setChildren(Math.min(8, children + 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Total: {adults + children} traveler{adults + children !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Room & Add-ons */}
              {step === 3 && !showConfirmation && (
                <motion.div
                  key="bstep3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-white mb-1">Room & Add-ons</h3>
                  <p className="text-sm text-gray-500 mb-5">Customize your stay experience</p>

                  <div className="space-y-6">
                    {/* Room Type */}
                    <div>
                      <Label className="text-sm text-gray-400 mb-3 block">Room Type</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {ROOM_TYPES.map((room) => (
                          <button
                            key={room.value}
                            onClick={() => setRoomType(room.value)}
                            className={`flex flex-col rounded-xl border p-4 text-left transition-all ${
                              roomType === room.value
                                ? 'border-teal-500/50 bg-teal-500/10 glow-teal'
                                : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <BedDouble className={`h-4 w-4 ${roomType === room.value ? 'text-teal-400' : 'text-gray-600'}`} />
                              {room.priceModifier > 0 && (
                                <Badge className="bg-amber-500/10 text-amber-400 border-0 text-[10px]">
                                  +{Math.round(room.priceModifier * 100)}%
                                </Badge>
                              )}
                              {room.priceModifier === 0 && roomType === room.value && (
                                <Badge className="bg-teal-500/10 text-teal-400 border-0 text-[10px]">
                                  Included
                                </Badge>
                              )}
                            </div>
                            <p className={`text-sm font-bold mt-2 ${roomType === room.value ? 'text-white' : 'text-gray-300'}`}>
                              {room.label}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{room.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* Add-ons */}
                    <div>
                      <Label className="text-sm text-gray-400 mb-3 block">Add-ons</Label>
                      <div className="space-y-2">
                        {ADD_ONS.map((addon) => (
                          <button
                            key={addon.id}
                            onClick={() => toggleAddOn(addon.id)}
                            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                              selectedAddOns.includes(addon.id)
                                ? 'border-teal-500/50 bg-teal-500/10'
                                : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                            }`}
                          >
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              selectedAddOns.includes(addon.id)
                                ? 'bg-teal-500/20 text-teal-400'
                                : 'bg-white/5 text-gray-600'
                            }`}>
                              <addon.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${selectedAddOns.includes(addon.id) ? 'text-white' : 'text-gray-300'}`}>
                                {addon.label}
                              </p>
                              <p className="text-[10px] text-gray-500">{addon.desc}</p>
                            </div>
                            <p className="text-sm font-bold text-amber-400">
                              ₹{addon.price.toLocaleString('en-IN')}
                            </p>
                            {selectedAddOns.includes(addon.id) && (
                              <Check className="h-4 w-4 text-teal-400 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-white/5" />

                    {/* Special Requests */}
                    <div>
                      <Label className="text-sm text-gray-400 mb-1.5 block">Special Requests (Optional)</Label>
                      <Textarea
                        placeholder="Dietary requirements, accessibility needs, special occasions..."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-teal-500/50 min-h-[80px]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review & Pay */}
              {step === 4 && !showConfirmation && (
                <motion.div
                  key="bstep4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-white mb-1">Review & Pay</h3>
                  <p className="text-sm text-gray-500 mb-5">Review your booking details</p>

                  {/* Summary Cards */}
                  <div className="space-y-3 mb-5">
                    <div className="rounded-xl glass-strong p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Traveler Info</p>
                      <p className="text-sm font-bold text-white">{name}</p>
                      <p className="text-xs text-gray-400">{email} • {phone}</p>
                    </div>

                    <div className="rounded-xl glass-strong p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Trip Details</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Departure:</span>
                          <p className="text-white font-medium">{departureDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Return:</span>
                          <p className="text-white font-medium">{returnDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Travelers:</span>
                          <p className="text-white font-medium">{adults} adults{children > 0 ? `, ${children} children` : ''}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Room:</span>
                          <p className="text-white font-medium">{ROOM_TYPES.find((r) => r.value === roomType)?.label}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-5">
                    <p className="text-xs text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5" />
                      Price Breakdown
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Base price ({adults} adult{adults !== 1 ? 's' : ''} × ₹{basePrice.toLocaleString('en-IN')})
                        </span>
                        <span className="text-white">₹{priceBreakdown.baseTotal.toLocaleString('en-IN')}</span>
                      </div>
                      {children > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Children ({children} × ₹{Math.round(basePrice * 0.5).toLocaleString('en-IN')})
                          </span>
                          <span className="text-white">
                            ₹{(Math.round(basePrice * 0.5) * children).toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                      {priceBreakdown.roomUpgrade > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Room upgrade ({ROOM_TYPES.find((r) => r.value === roomType)?.label})
                          </span>
                          <span className="text-white">+₹{priceBreakdown.roomUpgrade.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {selectedAddOns.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Add-ons ({selectedAddOns.length} selected)
                          </span>
                          <span className="text-white">+₹{priceBreakdown.addOnTotal.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">GST (5%)</span>
                        <span className="text-white">₹{priceBreakdown.tax.toLocaleString('en-IN')}</span>
                      </div>
                      <Separator className="bg-amber-500/20" />
                      <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-white">Total</span>
                        <span className="text-xl font-black gradient-text-gold">
                          ₹{priceBreakdown.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                        className="mt-0.5 border-white/20 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                      />
                      <Label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed cursor-pointer">
                        I agree to the{' '}
                        <span className="text-teal-400 underline">Terms & Conditions</span>,{' '}
                        <span className="text-teal-400 underline">Cancellation Policy</span>, and{' '}
                        <span className="text-teal-400 underline">Privacy Policy</span>.
                        I understand that booking confirmation is subject to availability and payment verification.
                      </Label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Display */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Navigation */}
            {!showConfirmation && (
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
                  disabled={!canProceed() || isSubmitting}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : step === 4 ? (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Proceed to Payment
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

            {/* Booking Confirmation */}
            {showConfirmation && (
              <BookingConfirmation
                bookingId={bookingId}
                travelerName={name}
                travelerEmail={email}
                travelerPhone={phone}
                departureDate={departureDate}
                returnDate={returnDate}
                adults={adults}
                childCount={children}
                roomType={ROOM_TYPES.find((r) => r.value === roomType)?.label || roomType}
                addOns={selectedAddOns.map((id) => ADD_ONS.find((a) => a.id === id)?.label || id)}
                totalPrice={priceBreakdown.total}
                packageName={pkg?.name}
                onClose={handleClose}
                onNewBooking={resetForm}
              />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
