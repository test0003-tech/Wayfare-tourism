'use client';

import Navbar from '@/components/wayfare/Navbar';
import Hero from '@/components/wayfare/Hero';
import Destinations from '@/components/wayfare/Destinations';
import PackageCategories from '@/components/wayfare/PackageCategories';
import Packages from '@/components/wayfare/Packages';
import Portfolio from '@/components/wayfare/Portfolio';
import Hotels from '@/components/wayfare/Hotels';
import Flights from '@/components/wayfare/Flights';
import Gallery from '@/components/wayfare/Gallery';
import Blog from '@/components/wayfare/Blog';
import Testimonials from '@/components/wayfare/Testimonials';
import Contact from '@/components/wayfare/Contact';
import Footer from '@/components/wayfare/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
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
        <Portfolio />
        <Hotels />
        <Flights />
        <Gallery />
        <Blog />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
