'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Compass,
  Heart,
  Mountain,
  Palmtree,
  Waves,
  Camera,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Star,
  Clock,
  Users,
  RotateCcw,
} from 'lucide-react';
import PageHero from '@/components/wayfare/PageHero';
import Breadcrumbs from '@/components/wayfare/Breadcrumbs';
import PageTransition from '@/components/wayfare/PageTransition';

interface QuizStep {
  question: string;
  subtitle: string;
  options: {
    icon: React.ElementType;
    label: string;
    value: string;
    emoji: string;
  }[];
}

const quizSteps: QuizStep[] = [
  {
    question: 'What\'s your travel vibe?',
    subtitle: 'Choose the mood that speaks to you',
    options: [
      { icon: Heart, label: 'Romantic & Peaceful', value: 'romantic', emoji: '💑' },
      { icon: Mountain, label: 'Thrilling & Adventurous', value: 'adventure', emoji: '🏔️' },
      { icon: Palmtree, label: 'Chill & Relaxing', value: 'relax', emoji: '🌴' },
      { icon: Camera, label: 'Cultural & Exploring', value: 'cultural', emoji: '📸' },
    ],
  },
  {
    question: 'Where do you want to go?',
    subtitle: 'Domestic charm or international flair?',
    options: [
      { icon: MapPin, label: 'Within India', value: 'domestic', emoji: '🇮🇳' },
      { icon: Compass, label: 'International', value: 'international', emoji: '🌏' },
      { icon: Sparkles, label: 'Surprise Me!', value: 'surprise', emoji: '✨' },
    ],
  },
  {
    question: 'What\'s your budget per person?',
    subtitle: 'We have something for every budget',
    options: [
      { icon: Waves, label: 'Under ₹15,000', value: 'budget', emoji: '💰' },
      { icon: Star, label: '₹15,000 - ₹35,000', value: 'mid', emoji: '⭐' },
      { icon: Sparkles, label: '₹35,000 - ₹60,000', value: 'premium', emoji: '💎' },
      { icon: Palmtree, label: 'No Budget Limit', value: 'luxury', emoji: '👑' },
    ],
  },
  {
    question: 'How long should the trip be?',
    subtitle: 'Quick getaway or deep dive?',
    options: [
      { icon: Clock, label: '4 Nights / 5 Days', value: '4N5D', emoji: '⚡' },
      { icon: Users, label: '5 Nights / 6 Days', value: '5N6D', emoji: '🎒' },
      { icon: Compass, label: '6 Nights / 7 Days', value: '6N7D', emoji: '🗺️' },
      { icon: Palmtree, label: 'Whatever fits best', value: 'flexible', emoji: '🎯' },
    ],
  },
];

interface QuizResult {
  name: string;
  destination: string;
  image: string;
  price: string;
  originalPrice: string;
  duration: string;
  highlights: string;
  match: number;
  rating: number;
}

const resultMap: Record<string, QuizResult[]> = {
  'romantic-domestic': [
    { name: 'Kerala Honeymoon Special', destination: 'Kerala, India', image: '/images/destinations/kerala.png', price: '₹22,999', originalPrice: '₹29,999', duration: '4N5D', highlights: 'Private Houseboat, Candlelight Dinner, Couples Spa', match: 97, rating: 4.9 },
    { name: 'Kashmir Honeymoon Delight', destination: 'Kashmir, India', image: '/images/destinations/kashmir.png', price: '₹28,999', originalPrice: '₹35,999', duration: '6N7D', highlights: 'Luxury Houseboat, Romantic Shikara, Gulmarg', match: 94, rating: 4.9 },
    { name: 'Andaman Romantic Escape', destination: 'Andaman, India', image: '/images/destinations/andaman.png', price: '₹24,999', originalPrice: '₹32,999', duration: '5N6D', highlights: 'Private Beach, Snorkeling, Sunset Cruise', match: 91, rating: 4.8 },
  ],
  'romantic-international': [
    { name: 'Maldives Paradise Escape', destination: 'Maldives', image: '/images/destinations/maldives.png', price: '₹79,999', originalPrice: '₹99,999', duration: '4N5D', highlights: 'Overwater Villa, Snorkeling with Mantas, Underwater Dining', match: 98, rating: 4.9 },
    { name: 'Bali Romantic Getaway', destination: 'Bali, Indonesia', image: '/images/destinations/bali.png', price: '₹45,999', originalPrice: '₹55,999', duration: '5N6D', highlights: 'Private Pool Villa, Couples Spa, Rice Terraces', match: 93, rating: 4.8 },
    { name: 'Dubai Honeymoon Special', destination: 'Dubai, UAE', image: '/images/destinations/dubai.png', price: '₹59,999', originalPrice: '₹74,999', duration: '5N6D', highlights: 'Burj Khalifa, Private Desert Dinner, Yacht Cruise', match: 90, rating: 4.9 },
  ],
  'adventure-domestic': [
    { name: 'Manali Adventure Package', destination: 'Manali, India', image: '/images/destinations/manali.png', price: '₹14,999', originalPrice: '₹19,999', duration: '5N6D', highlights: 'Paragliding, River Rafting, Solang Valley', match: 96, rating: 4.7 },
    { name: 'Sikkim Explorer', destination: 'Sikkim, India', image: '/images/destinations/sikkim.png', price: '₹18,999', originalPrice: '₹24,999', duration: '6N7D', highlights: 'Trekking, Monastery Visits, Lake Tsomgo', match: 92, rating: 4.6 },
    { name: 'Darjeeling Mountain Trail', destination: 'Darjeeling, India', image: '/images/destinations/darjeeling.png', price: '₹11,999', originalPrice: '₹15,999', duration: '4N5D', highlights: 'Tiger Hill Sunrise, Toy Train, Tea Gardens', match: 88, rating: 4.5 },
  ],
  'adventure-international': [
    { name: 'Thailand Explorer', destination: 'Thailand', image: '/images/destinations/thailand.png', price: '₹32,999', originalPrice: '₹42,999', duration: '6N7D', highlights: 'Island Hopping, Snorkeling, Night Market', match: 95, rating: 4.7 },
    { name: 'Vietnam Discovery', destination: 'Vietnam', image: '/images/destinations/vietnam.png', price: '₹28,999', originalPrice: '₹36,999', duration: '6N7D', highlights: 'Ha Long Bay Cruise, Mekong Delta, Old Quarter', match: 91, rating: 4.6 },
    { name: 'Sri Lanka Adventure', destination: 'Sri Lanka', image: '/images/destinations/srilanka.png', price: '₹24,999', originalPrice: '₹32,999', duration: '5N6D', highlights: 'Safari, Sigiriya, Beach Sports', match: 89, rating: 4.5 },
  ],
  'relax-domestic': [
    { name: 'Goa Beach Holiday', destination: 'Goa, India', image: '/images/destinations/goa.png', price: '₹12,999', originalPrice: '₹16,999', duration: '4N5D', highlights: 'Beach Vibes, Casino Night, Spice Plantation', match: 95, rating: 4.6 },
    { name: 'Kerala Backwater Retreat', destination: 'Kerala, India', image: '/images/destinations/kerala.png', price: '₹22,999', originalPrice: '₹29,999', duration: '4N5D', highlights: 'Houseboat, Ayurvedic Spa, Sunset Cruise', match: 93, rating: 4.9 },
    { name: 'Andaman Beach Paradise', destination: 'Andaman, India', image: '/images/destinations/andaman.png', price: '₹24,999', originalPrice: '₹32,999', duration: '5N6D', highlights: 'Crystal Beaches, Scuba Diving, Island Hopping', match: 90, rating: 4.8 },
  ],
  'relax-international': [
    { name: 'Maldives Paradise Escape', destination: 'Maldives', image: '/images/destinations/maldives.png', price: '₹79,999', originalPrice: '₹99,999', duration: '4N5D', highlights: 'Overwater Villa, Private Beach, Spa Over Water', match: 97, rating: 4.9 },
    { name: 'Bali Wellness Retreat', destination: 'Bali, Indonesia', image: '/images/destinations/bali.png', price: '₹45,999', originalPrice: '₹55,999', duration: '5N6D', highlights: 'Yoga Retreat, Rice Terraces, Temple Ceremony', match: 94, rating: 4.8 },
    { name: 'Singapore Leisure Trip', destination: 'Singapore', image: '/images/destinations/singapore.png', price: '₹42,999', originalPrice: '₹54,999', duration: '5N6D', highlights: 'Gardens by the Bay, Marina Bay, Night Safari', match: 91, rating: 4.7 },
  ],
  'cultural-domestic': [
    { name: 'Golden Triangle Tour', destination: 'Delhi, India', image: '/images/destinations/delhi.png', price: '₹15,999', originalPrice: '₹21,999', duration: '5N6D', highlights: 'Taj Mahal, Amber Fort, Old Delhi Walks', match: 96, rating: 4.7 },
    { name: 'Kerala Cultural Experience', destination: 'Kerala, India', image: '/images/destinations/kerala.png', price: '₹22,999', originalPrice: '₹29,999', duration: '4N5D', highlights: 'Kathakali Show, Spice Gardens, Temple Visits', match: 92, rating: 4.9 },
    { name: 'Rajasthan Heritage Tour', destination: 'Delhi, India', image: '/images/destinations/delhi.png', price: '₹18,999', originalPrice: '₹24,999', duration: '6N7D', highlights: 'Palace Visits, Desert Camp, Folk Dance', match: 89, rating: 4.6 },
  ],
  'cultural-international': [
    { name: 'Vietnam Cultural Journey', destination: 'Vietnam', image: '/images/destinations/vietnam.png', price: '₹28,999', originalPrice: '₹36,999', duration: '6N7D', highlights: 'Ancient Towns, War Museum, Street Food Tour', match: 95, rating: 4.6 },
    { name: 'Sri Lanka Heritage Tour', destination: 'Sri Lanka', image: '/images/destinations/srilanka.png', price: '₹24,999', originalPrice: '₹32,999', duration: '5N6D', highlights: 'Sigiriya Rock, Temple of Tooth, Kandy Dance', match: 93, rating: 4.5 },
    { name: 'Thailand Temple Trail', destination: 'Thailand', image: '/images/destinations/thailand.png', price: '₹32,999', originalPrice: '₹42,999', duration: '6N7D', highlights: 'Grand Palace, Floating Market, Elephant Sanctuary', match: 90, rating: 4.7 },
  ],
};

function getResults(answers: string[]): QuizResult[] {
  const vibe = answers[0] || 'relax';
  const region = answers[1] || 'domestic';

  let key = `${vibe}-${region}`;
  if (region === 'surprise') {
    const regions = ['domestic', 'international'];
    const randomRegion = regions[Math.floor(Math.random() * regions.length)];
    key = `${vibe}-${randomRegion}`;
  }

  return resultMap[key] || resultMap['relax-domestic'];
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);

    if (currentStep < quizSteps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 500);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers([]);
    setShowResults(false);
  };

  const results = getResults(answers);
  const step = quizSteps[currentStep];

  return (
    <PageTransition>
      <div className="bg-gray-950 min-h-screen">
        <PageHero
          badge="AI-Powered Recommendation"
          badgeIcon={Sparkles}
          title="Find Your Dream Destination"
          subtitle="Answer 4 quick questions and we'll recommend the perfect trip for you!"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'Travel Quiz' }]} />

          <section className="py-8 sm:py-16 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />

            <div className="mx-auto max-w-3xl relative">
              {/* Quiz Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl glass-strong p-6 sm:p-10 relative overflow-hidden"
              >
                {/* Decorative streak */}
                <div className="streak-effect absolute inset-0 pointer-events-none" />

                {/* Progress Bar */}
                {!showResults && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <span>Question {currentStep + 1} of {quizSteps.length}</span>
                      <span>{Math.round(((currentStep + 1) / quizSteps.length) * 100)}% Complete</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                        initial={{ width: '0%' }}
                        animate={{ width: `${((currentStep + 1) / quizSteps.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    {/* Step indicators */}
                    <div className="flex items-center justify-between mt-3">
                      {quizSteps.map((_, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-1 text-xs ${
                            i < currentStep
                              ? 'text-teal-400'
                              : i === currentStep
                              ? 'text-white'
                              : 'text-gray-600'
                          }`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              i < currentStep
                                ? 'bg-teal-400'
                                : i === currentStep
                                ? 'bg-white'
                                : 'bg-gray-700'
                            }`}
                          />
                          <span className="hidden sm:inline">Step {i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quiz Steps */}
                <AnimatePresence mode="wait">
                  {!showResults ? (
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
                        {step.question}
                      </h3>
                      <p className="text-gray-400 text-center mb-8">{step.subtitle}</p>

                      <div className={`grid gap-3 ${step.options.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'}`}>
                        {step.options.map((option) => (
                          <motion.button
                            key={option.value}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleSelect(option.value)}
                            className={`flex flex-col items-center gap-2 rounded-2xl border p-5 sm:p-6 transition-all duration-200 ${
                              answers[currentStep] === option.value
                                ? 'border-teal-500/50 bg-teal-500/10 shadow-lg shadow-teal-500/10'
                                : 'border-white/10 bg-white/5 hover:border-teal-500/30 hover:bg-teal-500/5'
                            }`}
                          >
                            <span className="text-3xl sm:text-4xl">{option.emoji}</span>
                            <option.icon className={`h-5 w-5 ${answers[currentStep] === option.value ? 'text-teal-400' : 'text-gray-400'}`} />
                            <span className={`text-sm font-semibold ${answers[currentStep] === option.value ? 'text-teal-300' : 'text-gray-300'}`}>
                              {option.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>

                      {/* Navigation */}
                      {currentStep > 0 && (
                        <div className="mt-8 text-center">
                          <button
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-400 transition-colors"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    /* Results */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="text-center mb-8">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                          className="inline-flex text-6xl mb-4"
                        >
                          🎉
                        </motion.div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white">Your Perfect Trips!</h3>
                        <p className="text-gray-400 mt-2">Based on your preferences, we recommend:</p>
                      </div>

                      <div className="space-y-4">
                        {results.map((result, i) => (
                          <motion.div
                            key={result.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.15 }}
                            className="flex flex-col sm:flex-row gap-4 rounded-2xl glass p-4 sm:p-5 hover:glow-teal transition-all duration-300 tilt-card"
                          >
                            <div className="relative w-full sm:w-44 h-32 sm:h-auto rounded-xl overflow-hidden shrink-0">
                              <img src={result.image} alt={result.name} className="h-full w-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
                              {i === 0 && (
                                <div className="absolute top-2 left-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 py-0.5 text-xs font-bold text-gray-950">
                                  Best Match
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-bold text-white text-lg leading-tight">{result.name}</h4>
                                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                    <MapPin className="h-3 w-3" />
                                    {result.destination}
                                  </div>
                                </div>
                                <div className="shrink-0 text-right">
                                  <div className="flex items-center gap-1 justify-end">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    <span className="text-sm font-bold text-amber-400">{result.rating}</span>
                                  </div>
                                  <div className="text-xs text-teal-400 font-semibold mt-0.5">{result.match}% Match</div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-400 mt-2">{result.highlights}</p>
                              <div className="flex items-end justify-between mt-3">
                                <div>
                                  <span className="text-xs text-gray-500 line-through">{result.originalPrice}</span>
                                  <span className="text-xl font-bold text-amber-400 ml-1">{result.price}</span>
                                  <span className="text-xs text-gray-500">/person</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="glass text-white text-xs">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {result.duration}
                                  </Badge>
                                  <Link href="/contact">
                                    <Button size="sm" className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-semibold">
                                      Book Now
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-8 text-center">
                        <Button
                          onClick={restart}
                          variant="outline"
                          className="border-white/10 text-teal-400 hover:bg-white/5 hover:text-teal-300 rounded-xl"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Retake Quiz
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Helpful info below quiz */}
              {!showResults && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  {[
                    { emoji: '⚡', text: 'Takes only 30 seconds' },
                    { emoji: '🎯', text: 'Personalized recommendations' },
                    { emoji: '💰', text: 'Best price guaranteed' },
                  ].map((item, i) => (
                    <div key={i} className="glass rounded-xl p-4 text-center">
                      <span className="text-2xl">{item.emoji}</span>
                      <p className="text-sm text-gray-400 mt-1">{item.text}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
