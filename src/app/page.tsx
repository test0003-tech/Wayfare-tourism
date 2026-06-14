'use client';

import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import HeroEnhanced from '@/components/wayfare/HeroEnhanced';
import FlashDeals from '@/components/wayfare/FlashDeals';
import HomeDestinations from '@/components/wayfare/HomeDestinations';
import HomeFeaturedPackages from '@/components/wayfare/HomeFeaturedPackages';
import HomeTestimonials from '@/components/wayfare/HomeTestimonials';
import HomeNewsletter from '@/components/wayfare/HomeNewsletter';
import PackageCategories from '@/components/wayfare/PackageCategories';

// Lazy load heavy components for performance
const ReviewsSection = dynamic(() => import('@/components/wayfare/ReviewsSection'), { ssr: false });
const TripCostCalculator = dynamic(() => import('@/components/wayfare/TripCostCalculator'), { ssr: false });
const SocialProof = dynamic(() => import('@/components/wayfare/SocialProof'), { ssr: false });
const AITravelPlanner = dynamic(() => import('@/components/wayfare/AITravelPlanner'), { ssr: false });

// Lazy load dashboard (huge component)
const DashboardPage = dynamic(() => import('@/app/dashboard/page'), { ssr: false });

export default function Home() {
  const searchParams = useSearchParams();
  const showDashboard = searchParams.get('view') === 'dashboard';

  if (showDashboard) {
    return <DashboardPage />;
  }

  return (
    <>
      <HeroEnhanced />
      <FlashDeals />
      <HomeDestinations />
      <PackageCategories />
      <HomeFeaturedPackages />
      <ReviewsSection />
      <TripCostCalculator />
      <HomeTestimonials />
      <HomeNewsletter />
      <AITravelPlanner />
      <SocialProof />
    </>
  );
}
