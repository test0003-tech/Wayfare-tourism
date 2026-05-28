'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'package',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', type: 'package', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+91 98765 43210', '+91 11 4567 8900'],
      action: 'tel:+919876543210',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['hello@wayfare.in', 'bookings@wayfare.in'],
      action: 'mailto:hello@wayfare.in',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Connaught Place, New Delhi', 'India - 110001'],
      action: '#',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon - Sat: 9 AM - 8 PM', 'Sun: 10 AM - 6 PM'],
      action: '#',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gray-950" id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 glass text-teal-300 border-teal-500/30">
            <MessageSquare className="mr-1 h-3 w-3" />
            Get In Touch
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">Plan Your Dream Trip</span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto text-lg">
            Our travel experts are ready to help you create the perfect itinerary
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((info, i) => (
              <a
                key={i}
                href={info.action}
                className="flex items-start gap-4 rounded-xl glass p-4 transition-all duration-300 hover:glow-teal hover:bg-white/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/10">
                  <info.icon className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{info.title}</h4>
                  {info.details.map((detail, j) => (
                    <p key={j} className="text-sm text-gray-400">{detail}</p>
                  ))}
                </div>
              </a>
            ))}

            {/* Trust Badges */}
            <div className="rounded-xl bg-gradient-to-br from-teal-600/20 to-emerald-600/20 border border-teal-500/20 p-5 text-white">
              <h4 className="font-bold text-lg">Why Choose Wayfare?</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-400 shrink-0" />
                  Best price guarantee on all packages
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-400 shrink-0" />
                  24/7 customer support during your trip
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-400 shrink-0" />
                  Verified hotels & trusted partners
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-400 shrink-0" />
                  Flexible cancellation & rescheduling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-400 shrink-0" />
                  10,000+ happy travelers and counting
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-3 border-0 glass shadow-none">
            <CardContent className="p-6 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/10 glow-teal">
                    <CheckCircle className="h-8 w-8 text-teal-400" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white">Thank You!</h3>
                  <p className="mt-2 text-gray-400">
                    We&apos;ve received your inquiry. Our travel expert will contact you within 2 hours!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-300">
                        Full Name *
                      </label>
                      <Input
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="rounded-lg bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-300">
                        Email *
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="rounded-lg bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-300">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-lg bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-300">
                        Inquiry Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="flex h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50 focus-visible:border-teal-500/50"
                      >
                        <option value="package" className="bg-gray-900">Tour Package</option>
                        <option value="hotel" className="bg-gray-900">Hotel Booking</option>
                        <option value="flight" className="bg-gray-900">Flight Booking</option>
                        <option value="custom" className="bg-gray-900">Custom Trip</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-300">
                      Your Message *
                    </label>
                    <Textarea
                      placeholder="Tell us about your dream trip — destinations, dates, budget, number of travelers..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="rounded-lg bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-950 rounded-lg h-11 font-bold glow-amber"
                  >
                    {loading ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Inquiry
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
