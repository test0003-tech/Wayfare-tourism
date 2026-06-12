// SEO Utility Library for Wayfare Travel
// Centralized metadata generation, structured data helpers, and SEO constants

import type { Metadata } from 'next';

// ─── Constants ───────────────────────────────────────────────────────────────

export const SITE_URL = 'https://wayfare.travel';
export const SITE_NAME = 'Wayfare';
export const SITE_DESCRIPTION = 'Book domestic and international tour packages, hotels, and flights with Wayfare. Kerala, Kashmir, Goa, Dubai, Maldives, Thailand & more. Honeymoon, adventure, family packages starting from ₹11,999.';
export const DEFAULT_OG_IMAGE = '/images/logo-wayfare-new.png';
export const TWITTER_HANDLE = '@wayfaretravel';
export const LOCALE = 'en_IN';
export const CURRENCY = 'INR';

// ─── Geo & Business Constants ────────────────────────────────────────────────

export const GEO_REGION = 'IN-DL';
export const GEO_PLACENAME = 'New Delhi';
export const GEO_POSITION = '28.6139;77.2090';
export const ICBM = '28.6139, 77.2090';
export const BUSINESS_PHONE = '+91-98765-43210';
export const BUSINESS_EMAIL = 'hello@wayfare.in';
export const BUSINESS_ADDRESS = {
  streetAddress: 'Connaught Place',
  addressLocality: 'New Delhi',
  addressRegion: 'Delhi',
  postalCode: '110001',
  addressCountry: 'IN',
};

// ─── Keyword Sets ─────────────────────────────────────────────────────────────

export const KEYWORDS = {
  // Core brand keywords
  brand: ['Wayfare', 'Wayfare Travel', 'Wayfare tours', 'Wayfare packages'],

  // Service keywords
  services: [
    'travel packages', 'tour packages', 'holiday packages',
    'hotel booking', 'flight deals', 'flight booking',
    'travel agency India', 'travel company India',
    'online travel booking', 'tour operator India',
  ],

  // Category keywords
  categories: [
    'honeymoon packages', 'adventure tours', 'family packages',
    'beach holidays', 'hill station tours', 'pilgrimage tours',
    'wildlife safari packages', 'romantic getaways',
    'luxury travel packages', 'budget tour packages',
    'group tour packages', 'solo travel packages',
  ],

  // Domestic destination keywords
  domestic: [
    'Kerala tours', 'Kashmir packages', 'Goa holidays',
    'Rajasthan tours', 'Himachal Pradesh packages',
    'Uttarakhand tours', 'Tamil Nadu travel',
    'Karnataka packages', 'Darjeeling tours',
    'Andaman packages', 'Ladakh bike trip',
    'Manali honeymoon', 'Shimla tour packages',
    'Munnar holiday packages', 'Ooty hill station',
    'domestic tours India', 'India tour packages',
    'India travel packages', 'incredible India tours',
    'best honeymoon packages in Kerala under 30000',
    'Kashmir tour packages from Delhi with flights',
    'Goa beach holiday packages for couples',
    'family trip to Rajasthan package price',
  ],

  // International destination keywords
  international: [
    'Dubai tours', 'Maldives packages', 'Thailand travel',
    'Singapore packages', 'Bali honeymoon', 'Sri Lanka tours',
    'Malaysia packages', 'Vietnam travel', 'Europe tour packages',
    'international tour packages', 'overseas travel India',
    'Dubai tour package from Mumbai all inclusive',
    'Maldives honeymoon package from India with flights',
    'Thailand travel package from Chennai',
    'Singapore Malaysia tour package from India',
    'Bali honeymoon package from Bangalore',
    'Europe tour packages from India 2025',
    'cheap international tour packages from India',
    'best travel agency in Delhi for international tours',
  ],

  // Price & booking keywords
  priceBooking: [
    'cheap tour packages', 'affordable travel deals',
    'best price guarantee travel', 'holiday packages under 20000',
    'honeymoon packages under 15000', 'international packages from India',
    'tour packages with flights', 'all inclusive holiday packages',
    'book tour packages online', 'last minute travel deals India',
  ],

  // Audience-specific keywords
  audience: [
    'tour packages for senior citizens India',
    'women\'s travel groups India packages',
    'student tour packages India',
    'corporate tour packages India',
    'weekend getaway packages from Delhi',
    'weekend getaway packages from Mumbai',
    'weekend getaway packages from Bangalore',
  ],

  // Season-based keywords
  seasonal: [
    'summer vacation packages India',
    'winter holiday packages',
    'monsoon tour packages',
    'Christmas vacation packages India',
    'New Year tour packages',
    'Diwali holiday packages',
    'long weekend trip packages India',
  ],

  // Near me keywords
  nearMe: [
    'tour packages near me',
    'travel agency near me',
    'best tour operator near me',
    'holiday packages near me',
    'travel agent near me',
    'tour planner near me',
  ],

  // Hotel keywords
  hotels: [
    'luxury hotels India', 'boutique hotels', 'heritage hotels India',
    'resort booking', 'hotel deals India', 'best hotels in Kerala',
    'best hotels in Goa', 'best hotels in Dubai',
    '5 star hotels booking', 'beach resorts India',
    'hill station resorts', 'homestay India',
  ],

  // Flight keywords
  flights: [
    'cheap flights India', 'flight deals', 'domestic flights India',
    'international flights from India', 'round trip flights',
    'one way flights', 'flight offers', 'airline deals India',
  ],

  // Blog & info keywords
  blog: [
    'travel tips India', 'destination guide', 'travel blog India',
    'honeymoon destination guide', 'budget travel tips',
    'travel itinerary guide', 'best time to visit',
  ],
};

// ─── Helper: Build Keywords Array ────────────────────────────────────────────

export function buildKeywords(...keywordGroups: (keyof typeof KEYWORDS)[]): string[] {
  const result: string[] = [];
  for (const group of keywordGroups) {
    result.push(...KEYWORDS[group]);
  }
  return result;
}

// ─── Helper: Generate Page Metadata ──────────────────────────────────────────

interface PageMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  keywords,
  path,
  ogImage,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    keywords: keywords || [],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      type: ogType,
      locale: LOCALE,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
    }),
  };
}

// ─── Helper: Generate Detail Page Metadata ───────────────────────────────────

interface DetailPageMetadataOptions {
  name: string;
  description: string;
  path: string;
  image: string;
  keywords?: string[];
  category?: string;
  price?: number;
  priceCurrency?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
}

export function generateDetailPageMetadata({
  name,
  description,
  path,
  image,
  keywords,
  category,
  price,
  location,
  rating,
}: DetailPageMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const titleSuffix = category ? `${category} | Wayfare` : 'Wayfare';
  const title = `${name} | ${titleSuffix}`;

  // Build rich description with price and location
  let richDescription = description;
  if (richDescription.length > 155) {
    richDescription = richDescription.slice(0, 152) + '...';
  }
  if (price) {
    richDescription += ` Starting from ₹${price.toLocaleString()}.`;
  }
  if (location) {
    richDescription += ` Located in ${location}.`;
  }
  if (rating) {
    richDescription += ` Rated ${rating}/5.`;
  }

  return {
    title,
    description: richDescription,
    keywords: keywords || [],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description: richDescription,
      type: 'website',
      locale: LOCALE,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: richDescription,
      images: [image],
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// ─── Helper: FAQ Data for Detail Pages ───────────────────────────────────────

export const PACKAGE_FAQS = [
  {
    question: 'What is included in the tour package price?',
    answer: 'Our tour packages typically include accommodation, daily breakfast, airport transfers, sightseeing as per itinerary, and applicable taxes. Some packages also include dinner and activity passes.',
  },
  {
    question: 'Can I customize the tour package itinerary?',
    answer: 'Yes! All Wayfare packages are fully customizable. Contact our travel experts to add extra days, upgrade hotels, or include special experiences like candlelight dinners or adventure activities.',
  },
  {
    question: 'What is the cancellation policy?',
    answer: 'Free cancellation up to 7 days before the travel date. Cancellations within 7 days may incur charges as per our cancellation policy. We recommend travel insurance for complete peace of mind.',
  },
  {
    question: 'Are flights included in the package price?',
    answer: 'Package prices shown are per person on twin sharing basis. Flights can be included at an additional cost. Check the "What\'s Included" section or contact us for flight-inclusive pricing.',
  },
  {
    question: 'How do I book a Wayfare tour package?',
    answer: 'You can book online through our website, call us at +91-98765-43210, or email hello@wayfare.in. Our travel experts will help you plan and book your dream vacation.',
  },
];

export const HOTEL_FAQS = [
  {
    question: 'What amenities are included with the hotel booking?',
    answer: 'Amenities vary by property but typically include Wi-Fi, breakfast, swimming pool access, and parking. Check the amenities section on the hotel page for the complete list.',
  },
  {
    question: 'Can I get early check-in or late check-out?',
    answer: 'Early check-in and late check-out are subject to availability. Contact the hotel directly or our support team to arrange this. Additional charges may apply.',
  },
  {
    question: 'Is breakfast included in the room rate?',
    answer: 'Most Wayfare hotel bookings include complimentary breakfast. This is clearly mentioned in the booking details. Premium packages may also include dinner.',
  },
  {
    question: 'What is the check-in and check-out time?',
    answer: 'Standard check-in time is 2:00 PM and check-out time is 11:00 AM. These may vary by property.',
  },
  {
    question: 'Do you offer free cancellation on hotel bookings?',
    answer: 'Yes, most of our hotel bookings come with free cancellation up to 24 hours before check-in. Check the specific cancellation policy on the hotel page.',
  },
];

export const DESTINATION_FAQS = [
  {
    question: 'What is the best time to visit this destination?',
    answer: 'The best time to visit depends on the season and your preferences. Generally, the peak tourist season offers the best weather. Contact our travel experts for month-by-month guidance.',
  },
  {
    question: 'How many days are enough for this destination?',
    answer: 'We recommend 4-7 days for a comfortable trip covering all major attractions. Our packages range from short weekend getaways to extended vacations.',
  },
  {
    question: 'Is this destination safe for solo travelers?',
    answer: 'Yes, most destinations on Wayfare are safe for solo travelers. We provide 24/7 support, verified accommodations, and guided tour options for added safety.',
  },
  {
    question: 'What activities can I do at this destination?',
    answer: 'Activities vary by destination and include sightseeing, adventure sports, cultural experiences, water sports, nature walks, and more. Check our packages for curated activity lists.',
  },
];

// ─── Internal Linking: Related Pages Map ─────────────────────────────────────
// Maps each section to related pages for internal linking and SEO

export const RELATED_PAGES: Record<string, { label: string; href: string; description: string }[]> = {
  '/': [
    { label: 'Tour Packages', href: '/packages', description: 'Explore 50+ curated tour packages starting from ₹11,999' },
    { label: 'Destinations', href: '/destinations', description: 'Discover 50+ stunning travel destinations' },
    { label: 'Hotels', href: '/hotels', description: 'Book 200+ luxury hotels & resorts' },
    { label: 'Flight Deals', href: '/flights', description: 'Find cheap flights starting from ₹4,999' },
  ],
  '/packages': [
    { label: 'Destinations', href: '/destinations', description: 'Explore destinations before choosing a package' },
    { label: 'Hotels', href: '/hotels', description: 'Find hotels for your trip' },
    { label: 'Flight Deals', href: '/flights', description: 'Book flights to your destination' },
    { label: 'Blog', href: '/blog', description: 'Travel tips and guides' },
    { label: 'Contact Us', href: '/contact', description: 'Get help planning your trip' },
  ],
  '/destinations': [
    { label: 'Tour Packages', href: '/packages', description: 'Browse packages for each destination' },
    { label: 'Hotels', href: '/hotels', description: 'Find hotels at each destination' },
    { label: 'Flight Deals', href: '/flights', description: 'Book flights to your destination' },
    { label: 'Gallery', href: '/gallery', description: 'See photos from each destination' },
  ],
  '/hotels': [
    { label: 'Tour Packages', href: '/packages', description: 'Packages with included hotel stays' },
    { label: 'Destinations', href: '/destinations', description: 'Explore destinations with great hotels' },
    { label: 'Flight Deals', href: '/flights', description: 'Book flights along with your hotel' },
    { label: 'Contact Us', href: '/contact', description: 'Get help with hotel booking' },
  ],
  '/flights': [
    { label: 'Tour Packages', href: '/packages', description: 'Packages that include flights' },
    { label: 'Destinations', href: '/destinations', description: 'Explore flight destinations' },
    { label: 'Hotels', href: '/hotels', description: 'Book hotels at your destination' },
  ],
  '/about': [
    { label: 'Tour Packages', href: '/packages', description: 'See what we offer' },
    { label: 'Contact Us', href: '/contact', description: 'Get in touch with our team' },
    { label: 'Blog', href: '/blog', description: 'Read our travel insights' },
  ],
  '/contact': [
    { label: 'Tour Packages', href: '/packages', description: 'Browse packages before contacting us' },
    { label: 'About Us', href: '/about', description: 'Learn about Wayfare' },
    { label: 'Hotels', href: '/hotels', description: 'Browse hotels' },
  ],
  '/blog': [
    { label: 'Destinations', href: '/destinations', description: 'Explore destinations from our guides' },
    { label: 'Tour Packages', href: '/packages', description: 'Book packages inspired by our articles' },
    { label: 'Gallery', href: '/gallery', description: 'See real travel photos' },
  ],
  '/gallery': [
    { label: 'Destinations', href: '/destinations', description: 'Visit the destinations in our photos' },
    { label: 'Tour Packages', href: '/packages', description: 'Book a trip to these places' },
    { label: 'Blog', href: '/blog', description: 'Read about these destinations' },
  ],
};

// ─── Helper: Build Breadcrumb Structured Data ────────────────────────────────

export function buildBreadcrumbItems(items: { label: string; href?: string }[]) {
  return [
    { name: 'Home', url: SITE_URL },
    ...items.map((item) => ({
      name: item.label,
      url: item.href ? `${SITE_URL}${item.href}` : SITE_URL,
    })),
  ];
}

// ─── Helper: Get related pages for internal linking ─────────────────────────

export function getRelatedPages(path: string): { label: string; href: string; description: string }[] {
  return RELATED_PAGES[path] || [];
}

// ─── Structured Data Helpers ─────────────────────────────────────────────────

export interface AggregateRatingData {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export function buildAggregateRating(data: AggregateRatingData) {
  return {
    '@type': 'AggregateRating',
    ratingValue: data.ratingValue,
    reviewCount: data.reviewCount,
    bestRating: data.bestRating ?? 5,
    worstRating: data.worstRating ?? 1,
  };
}

export interface ReviewData {
  author: string;
  rating: number;
  datePublished: string;
  reviewBody: string;
}

export function buildReview(data: ReviewData) {
  return {
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: data.author,
    },
    datePublished: data.datePublished,
    reviewBody: data.reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: data.rating,
      bestRating: 5,
    },
  };
}

export interface OfferData {
  price: number;
  priceCurrency?: string;
  availability?: string;
  url?: string;
  priceValidUntil?: string;
  sellerName?: string;
  originalPrice?: number;
}

export function buildOffer(data: OfferData) {
  return {
    '@type': 'Offer',
    price: data.price,
    priceCurrency: data.priceCurrency ?? 'INR',
    availability: data.availability ?? 'https://schema.org/InStock',
    ...(data.url && { url: data.url }),
    ...(data.priceValidUntil && { priceValidUntil: data.priceValidUntil }),
    seller: {
      '@type': 'TravelAgency',
      name: data.sellerName ?? SITE_NAME,
    },
    ...(data.originalPrice && {
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: data.originalPrice,
        priceCurrency: data.priceCurrency ?? 'INR',
      },
    }),
  };
}

export interface AggregateOfferData {
  lowPrice: number;
  highPrice: number;
  priceCurrency?: string;
  offerCount?: number;
  offers?: ReturnType<typeof buildOffer>[];
}

export function buildAggregateOffer(data: AggregateOfferData) {
  return {
    '@type': 'AggregateOffer',
    lowPrice: data.lowPrice,
    highPrice: data.highPrice,
    priceCurrency: data.priceCurrency ?? 'INR',
    offerCount: data.offerCount ?? 1,
    ...(data.offers && { offers: data.offers }),
  };
}

// ─── Sample Review Data for Structured Data ──────────────────────────────────

export const SAMPLE_REVIEWS: ReviewData[] = [
  {
    author: 'Priya Sharma',
    rating: 5,
    datePublished: '2025-01-15',
    reviewBody: 'Amazing experience! The itinerary was perfectly planned and every detail was taken care of. Highly recommend Wayfare for anyone looking for a hassle-free vacation.',
  },
  {
    author: 'Rahul Mehta',
    rating: 5,
    datePublished: '2025-01-10',
    reviewBody: 'Best travel agency I have used. The hotel was fantastic and the local guides were very knowledgeable. Will definitely book again.',
  },
  {
    author: 'Ananya Patel',
    rating: 4,
    datePublished: '2024-12-28',
    reviewBody: 'Great value for money. The package included everything as promised. Only suggestion would be to add more free time in the itinerary.',
  },
];
