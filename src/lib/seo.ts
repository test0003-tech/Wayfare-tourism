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
  ],
  
  // International destination keywords
  international: [
    'Dubai tours', 'Maldives packages', 'Thailand travel',
    'Singapore packages', 'Bali honeymoon', 'Sri Lanka tours',
    'Malaysia packages', 'Vietnam travel', 'Europe tour packages',
    'international tour packages', 'overseas travel India',
  ],
  
  // Price & booking keywords
  priceBooking: [
    'cheap tour packages', 'affordable travel deals',
    'best price guarantee travel', 'holiday packages under 20000',
    'honeymoon packages under 15000', 'international packages from India',
    'tour packages with flights', 'all inclusive holiday packages',
    'book tour packages online', 'last minute travel deals India',
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
