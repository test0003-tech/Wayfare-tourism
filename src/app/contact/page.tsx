'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Shield,
  Headphones,
  Award,
  RefreshCcw,
  Users,
} from 'lucide-react';
import PageHero from '@/components/wayfare/PageHero';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import PageTransition from '@/components/wayfare/PageTransition';

const contactInfo = [
  {
    icon: Phone,
    title: 'Call Us',
    details: ['+91 98765 43210', '+91 11 4567 8900'],
    action: 'tel:+919876543210',
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: ['hello@wayfare.in', 'bookings@wayfare.in'],
    action: 'mailto:hello@wayfare.in',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    details: ['Connaught Place, New Delhi', 'India - 110001'],
    action: '#',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    details: ['Mon - Sat: 9 AM - 8 PM', 'Sun: 10 AM - 6 PM'],
    action: '#',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
];

const trustBadges = [
  { icon: Shield, label: 'Best Price Guarantee', desc: 'We match or beat any comparable price' },
  { icon: Headphones, label: '24/7 Support', desc: 'Help during your entire trip' },
  { icon: Award, label: 'Verified Hotels', desc: 'Only trusted & reviewed partners' },
  { icon: RefreshCcw, label: 'Flexible Cancellation', desc: 'Free rescheduling on most trips' },
  { icon: Users, label: '10K+ Happy Travelers', desc: 'And counting every day' },
];

export default function ContactPage() {
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
        setTimeout(() => setSubmitted(false), 8000);
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="bg-gray-950 min-h-screen">
        <PageHero
          badge="Get In Touch"
          badgeIcon={MessageSquare}
          title="Plan Your Dream Trip"
          subtitle="Our travel experts are ready to help you create the perfect itinerary"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Contact' }]} />

          <section className="py-8 sm:py-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
              {/* Contact Info Column */}
              <div className="lg:col-span-2 space-y-4">
                {contactInfo.map((info, i) => (
                  <motion.a
                    key={i}
                    href={info.action}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-4 rounded-xl glass p-4 transition-all duration-300 hover:glow-teal hover:bg-white/5 tilt-card"
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${info.bgColor}`}>
                      <info.icon className={`h-5 w-5 ${info.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{info.title}</h4>
                      {info.details.map((detail, j) => (
                        <p key={j} className="text-sm text-gray-400">{detail}</p>
                      ))}
                    </div>
                  </motion.a>
                ))}

                {/* Trust Badges Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="rounded-xl bg-gradient-to-br from-teal-600/20 to-emerald-600/20 border border-teal-500/20 p-5 text-white"
                >
                  <h4 className="font-bold text-lg mb-4">Why Choose Wayfare?</h4>
                  <ul className="space-y-3">
                    {trustBadges.map((badge, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <badge.icon className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-white">{badge.label}</span>
                          <span className="block text-xs text-gray-400">{badge.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Contact Form Column */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-3"
              >
                <Card className="border-0 glass-strong shadow-none">
                  <CardContent className="p-6 sm:p-8">
                    {submitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-16 text-center"
                      >
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-500/10 glow-teal mb-6">
                          <CheckCircle className="h-10 w-10 text-teal-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Thank You!</h3>
                        <p className="mt-3 text-gray-400 max-w-sm">
                          We&apos;ve received your inquiry. Our travel expert will contact you within 2 hours!
                        </p>
                        <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
                          <Mail className="h-4 w-4" />
                          <span>Confirmation sent to your email</span>
                        </div>
                      </motion.div>
                    ) : (
                      <>
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-white">Send Us a Message</h3>
                          <p className="text-sm text-gray-400 mt-1">Fill out the form below and we&apos;ll get back to you shortly</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                                Full Name <span className="text-rose-400">*</span>
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
                                Email <span className="text-rose-400">*</span>
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
                              Your Message <span className="text-rose-400">*</span>
                            </label>
                            <Textarea
                              placeholder="Tell us about your dream trip — destinations, dates, budget, number of travelers..."
                              rows={5}
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
                              <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin" />
                                Sending...
                              </span>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Inquiry
                              </>
                            )}
                          </Button>
                        </form>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Map placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-12 rounded-2xl glass overflow-hidden"
            >
              <div className="relative aspect-[21/9] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="absolute top-10 left-10 w-64 h-64 bg-teal-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-amber-500/5 rounded-full blur-[80px]" />
                <div className="text-center relative">
                  <MapPin className="h-12 w-12 text-teal-400 mx-auto mb-4 animate-float" />
                  <h3 className="text-xl font-bold text-white mb-1">Visit Our Office</h3>
                  <p className="text-gray-400">Connaught Place, New Delhi, India - 110001</p>
                  <p className="text-sm text-gray-500 mt-2">Mon - Sat: 9 AM - 8 PM</p>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
