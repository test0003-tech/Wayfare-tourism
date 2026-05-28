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
    <section className="py-16 sm:py-20 bg-gray-50" id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 bg-teal-50 text-teal-700 border-teal-200">
            <MessageSquare className="mr-1 h-3 w-3" />
            Get In Touch
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Plan Your Dream Trip
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-lg">
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
                className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                  <info.icon className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{info.title}</h4>
                  {info.details.map((detail, j) => (
                    <p key={j} className="text-sm text-gray-500">{detail}</p>
                  ))}
                </div>
              </a>
            ))}

            {/* Trust Badges */}
            <div className="rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 p-5 text-white">
              <h4 className="font-bold text-lg">Why Choose Wayfare?</h4>
              <ul className="mt-3 space-y-2 text-sm text-teal-100">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-300 shrink-0" />
                  Best price guarantee on all packages
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-300 shrink-0" />
                  24/7 customer support during your trip
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-300 shrink-0" />
                  Verified hotels & trusted partners
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-300 shrink-0" />
                  Flexible cancellation & rescheduling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-300 shrink-0" />
                  10,000+ happy travelers and counting
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-3 border-0 shadow-lg">
            <CardContent className="p-6 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-gray-900">Thank You!</h3>
                  <p className="mt-2 text-gray-500">
                    We&apos;ve received your inquiry. Our travel expert will contact you within 2 hours!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <Input
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Inquiry Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="package">Tour Package</option>
                        <option value="hotel">Hotel Booking</option>
                        <option value="flight">Flight Booking</option>
                        <option value="custom">Custom Trip</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Your Message *
                    </label>
                    <Textarea
                      placeholder="Tell us about your dream trip — destinations, dates, budget, number of travelers..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg h-11"
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
