'use client';

import Hero from '@/components/wayfare/Hero';
import FlashDeals from '@/components/wayfare/FlashDeals';
import HomeDestinations from '@/components/wayfare/HomeDestinations';
import HomeFeaturedPackages from '@/components/wayfare/HomeFeaturedPackages';
import HomeTestimonials from '@/components/wayfare/HomeTestimonials';
import HomeNewsletter from '@/components/wayfare/HomeNewsletter';
import PackageCategories from '@/components/wayfare/PackageCategories';

export default function Home() {
  return (
    <>
      <Hero />
      <FlashDeals />
      <HomeDestinations />
      <PackageCategories />
      <HomeFeaturedPackages />
      <HomeTestimonials />
      <HomeNewsletter />
    </>
  );
}
