'use client';

import Navbar from '@/components/wayfare/Navbar';
import Hero from '@/components/wayfare/Hero';
import Destinations from '@/components/wayfare/Destinations';
import PackageCategories from '@/components/wayfare/PackageCategories';
import Packages from '@/components/wayfare/Packages';
import Hotels from '@/components/wayfare/Hotels';
import Flights from '@/components/wayfare/Flights';
import Testimonials from '@/components/wayfare/Testimonials';
import Contact from '@/components/wayfare/Contact';
import Footer from '@/components/wayfare/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Destinations region="domestic" />
        <Destinations region="international" />
        <PackageCategories />
        <div id="packages">
          <Packages region="domestic" />
          <Packages region="international" />
        </div>
        <Hotels />
        <Flights />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
