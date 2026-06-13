'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Download,
  Share2,
  Copy,
  Phone,
  MapPin,
  Calendar,
  Users,
  BedDouble,
  CreditCard,
  Check,
  ArrowRight,
} from 'lucide-react';

interface BookingConfirmationProps {
  bookingId: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  childCount: number;
  roomType: string;
  addOns: string[];
  totalPrice: number;
  packageName?: string;
  onClose: () => void;
  onNewBooking: () => void;
}

export default function BookingConfirmation({
  bookingId,
  travelerName,
  travelerEmail,
  travelerPhone,
  departureDate,
  returnDate,
  adults,
  childCount,
  roomType,
  addOns,
  totalPrice,
  packageName,
  onClose,
  onNewBooking,
}: BookingConfirmationProps) {
  const [copied, setCopied] = useState(false);

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareDetails = () => {
    const text = `🌍 Wayfare Travel Booking Confirmed!\n\n📋 Booking ID: ${bookingId}\n👤 Name: ${travelerName}\n📅 Trip: ${departureDate} → ${returnDate}\n👥 Travelers: ${adults} adults${childCount > 0 ? `, ${childCount} children` : ''}\n💰 Total: ₹${totalPrice.toLocaleString('en-IN')}\n\n📞 For queries: +91 98765 43210`;

    if (navigator.share) {
      navigator.share({
        title: 'Wayfare Travel Booking',
        text,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(text);
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const downloadItinerary = () => {
    const content = `
╔══════════════════════════════════════════════╗
║           WAYFARE TRAVEL BOOKING             ║
║              CONFIRMATION                    ║
╚══════════════════════════════════════════════╝

BOOKING ID: ${bookingId}
STATUS: Pending Confirmation
DATE: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRAVELER DETAILS
  Name: ${travelerName}
  Email: ${travelerEmail}
  Phone: ${travelerPhone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIP DETAILS
${packageName ? `  Package: ${packageName}` : ''}
  Departure: ${departureDate}
  Return: ${returnDate}
  Travelers: ${adults} adults${childCount > 0 ? `, ${childCount} children` : ''}
  Room Type: ${roomType}
${addOns.length > 0 ? `  Add-ons: ${addOns.join(', ')}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT SUMMARY
  Total Amount: ₹${totalPrice.toLocaleString('en-IN')}
  Payment Status: Pending

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAYMENT INSTRUCTIONS

Bank Transfer:
  Bank: State Bank of India
  Account Name: Wayfare Travel Pvt Ltd
  Account No: 1234 5678 9012 3456
  IFSC: SBIN0001234

UPI Payment:
  UPI ID: wayfare@upi

⚠️ Please include your Booking ID (${bookingId}) as
payment reference.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTACT US
  Phone: +91 98765 43210
  Email: bookings@wayfare.travel
  WhatsApp: +91 98765 43210

Thank you for choosing Wayfare! ✈️
We'll confirm your booking within 24 hours of payment.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wayfare-booking-${bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Success Animation */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
          className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 mx-auto glow-teal"
        >
          <CheckCircle2 className="h-8 w-8 text-white" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold text-white mt-4"
        >
          Booking Submitted!
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-500 mt-1"
        >
          We&apos;ll confirm your booking within 24 hours after payment
        </motion.p>
      </div>

      {/* Booking ID */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl glass-strong p-4 mb-4"
      >
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Booking ID</p>
        <div className="flex items-center gap-2">
          <p className="text-lg font-mono font-bold gradient-text">{bookingId}</p>
          <button
            onClick={copyBookingId}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
            title="Copy Booking ID"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-teal-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
        <Badge className="mt-2 bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
          ⏳ Pending Confirmation
        </Badge>
      </motion.div>

      {/* Trip Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl border border-white/5 bg-white/5 p-4 mb-4"
      >
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Trip Summary</p>
        <div className="space-y-2.5 text-sm">
          {packageName && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-teal-400 shrink-0" />
              <span className="text-gray-400">Package:</span>
              <span className="text-white font-medium">{packageName}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-teal-400 shrink-0" />
            <span className="text-gray-400">Dates:</span>
            <span className="text-white font-medium">{departureDate} → {returnDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-teal-400 shrink-0" />
            <span className="text-gray-400">Travelers:</span>
            <span className="text-white font-medium">
              {adults} adult{adults !== 1 ? 's' : ''}{childCount > 0 ? `, ${childCount} child${childCount !== 1 ? 'ren' : ''}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BedDouble className="h-3.5 w-3.5 text-teal-400 shrink-0" />
            <span className="text-gray-400">Room:</span>
            <span className="text-white font-medium">{roomType}</span>
          </div>
          {addOns.length > 0 && (
            <div className="flex items-center gap-2">
              <ArrowRight className="h-3.5 w-3.5 text-teal-400 shrink-0" />
              <span className="text-gray-400">Add-ons:</span>
              <span className="text-white font-medium">{addOns.join(', ')}</span>
            </div>
          )}
          <Separator className="bg-white/5" />
          <div className="flex items-center gap-2">
            <CreditCard className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="text-gray-400">Total:</span>
            <span className="text-lg font-black gradient-text-gold">₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </motion.div>

      {/* Payment Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-4"
      >
        <p className="text-xs text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5" />
          Payment Instructions
        </p>
        <div className="space-y-3 text-sm">
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bank Transfer</p>
            <div className="space-y-0.5 text-xs">
              <p className="text-gray-300">Bank: <span className="text-white font-medium">State Bank of India</span></p>
              <p className="text-gray-300">A/C: <span className="text-white font-mono font-medium">1234 5678 9012 3456</span></p>
              <p className="text-gray-300">IFSC: <span className="text-white font-mono font-medium">SBIN0001234</span></p>
            </div>
          </div>
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">UPI Payment</p>
            <p className="text-gray-300 text-xs">
              UPI ID: <span className="text-white font-mono font-medium">wayfare@upi</span>
            </p>
          </div>
          <p className="text-xs text-amber-400/80 flex items-start gap-1.5">
            <span>⚠️</span>
            <span>Include your Booking ID as payment reference for faster confirmation</span>
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col gap-3"
      >
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={downloadItinerary}
            variant="outline"
            className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl h-11"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            onClick={shareDetails}
            variant="outline"
            className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl h-11"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
        <Button
          asChild
          variant="outline"
          className="w-full border-teal-500/20 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300 rounded-xl h-11"
        >
          <a href="tel:+919876543210">
            <Phone className="mr-2 h-4 w-4" />
            Call for Support
          </a>
        </Button>
      </motion.div>
    </motion.div>
  );
}
