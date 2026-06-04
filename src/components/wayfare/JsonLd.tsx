// JsonLd.tsx - Comprehensive Structured Data for Google Rich Snippets
// Supports: Organization, WebSite, TravelPackage (Product), Hotel (LodgingBusiness),
// Destination (TouristDestination), Breadcrumb, FAQ, Review, ItemList,
// LocalBusiness, VideoObject, HowTo

import {
  SITE_URL,
  SITE_NAME,
  BUSINESS_PHONE,
  BUSINESS_EMAIL,
  BUSINESS_ADDRESS,
  GEO_POSITION,
} from '@/lib/seo';

// ─── Organization Schema (TravelAgency) ──────────────────────────────────────

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['TravelAgency', 'Organization'],
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-wayfare-new.png`,
    image: `${SITE_URL}/images/logo-wayfare-new.png`,
    description: 'Book domestic and international tour packages, hotels, and flights with Wayfare. Premium travel experiences starting from ₹11,999.',
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    foundingDate: '2023',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 50,
      maxValue: 200,
    },
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Credit Card, UPI, Net Banking, Cash',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: BUSINESS_PHONE,
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi', 'Tamil', 'Telugu'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      },
      {
        '@type': 'ContactPoint',
        telephone: BUSINESS_PHONE,
        contactType: 'sales',
        availableLanguage: ['English', 'Hindi'],
      },
    ],
    sameAs: [
      'https://www.instagram.com/wayfare',
      'https://www.facebook.com/wayfare',
      'https://twitter.com/wayfaretravel',
      'https://www.youtube.com/@wayfaretravel',
      'https://www.linkedin.com/company/wayfaretravel',
    ],
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS_ADDRESS,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '2450',
      bestRating: '5',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Website Schema with SearchAction ────────────────────────────────────────

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: ['Wayfare Travel', 'Wayfare Tours', 'Wayfare Holidays'],
    url: SITE_URL,
    description: 'Book domestic and international tour packages, hotels, and flights with Wayfare.',
    inLanguage: ['en-IN', 'hi-IN', 'ta-IN', 'te-IN'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/packages?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'TravelAgency',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Travel Package Schema (Product + TouristTrip) ───────────────────────────

interface TravelPackageData {
  name: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  priceCurrency: string;
  destination: string;
  duration: string;
  rating: number;
  reviewCount: number;
  url: string;
  category: string;
  highlights?: string[];
  included?: string[];
  itinerary?: { day: number; title: string; description: string }[];
  reviews?: ReviewItem[];
}

interface ReviewItem {
  author: string;
  rating: number;
  datePublished: string;
  reviewBody: string;
}

export function TravelPackageJsonLd({ data }: { data: TravelPackageData }) {
  const [lat, lng] = GEO_POSITION.split(';');

  // Build itinerary as TripLeg entries if provided
  const itineraryItems = data.itinerary
    ? data.itinerary.map((leg) => ({
        '@type': 'TripLeg',
        position: leg.day,
        name: leg.title,
        description: leg.description,
      }))
    : data.highlights
    ? data.highlights.map((h, i) => ({
        '@type': 'TripLeg',
        position: i + 1,
        name: h,
      }))
    : undefined;

  // Build review entries if provided
  const reviewEntries = data.reviews
    ? data.reviews.map((r) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: r.author,
        },
        datePublished: r.datePublished,
        reviewBody: r.reviewBody,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
        },
      }))
    : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Product', 'TouristTrip'],
    name: data.name,
    description: data.description,
    image: data.image,
    url: data.url,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    category: data.category,
    ...(itineraryItems && { itinerary: itineraryItems }),
    ...(reviewEntries && { review: reviewEntries }),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: data.priceCurrency,
      lowPrice: data.price,
      highPrice: data.originalPrice || data.price,
      offerCount: 1,
      availability: 'https://schema.org/InStock',
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: data.priceCurrency,
        availability: 'https://schema.org/InStock',
        url: data.url,
        priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        seller: {
          '@type': 'TravelAgency',
          name: SITE_NAME,
        },
        ...(data.originalPrice && {
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: data.originalPrice,
            priceCurrency: data.priceCurrency,
          },
        }),
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: data.rating,
      reviewCount: data.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    ...(data.duration && {
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'duration',
          value: data.duration,
        },
        {
          '@type': 'PropertyValue',
          name: 'destination',
          value: data.destination,
        },
        {
          '@type': 'PropertyValue',
          name: 'tourCategory',
          value: data.category,
        },
      ],
    }),
    ...(data.included && {
      includesObject: data.included.map((item) => ({
        '@type': 'TypeAndQuantityNode',
        typeOfGood: {
          '@type': 'Product',
          name: item,
        },
      })),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Hotel Schema (LodgingBusiness) ──────────────────────────────────────────

interface HotelData {
  name: string;
  description: string;
  image: string;
  pricePerNight: number;
  priceCurrency: string;
  rating: number;
  reviewCount: number;
  stars: number;
  address: string;
  url: string;
  amenities: string[];
  destination?: string;
  category?: string;
  checkinTime?: string;
  checkoutTime?: string;
  smokingAllowed?: boolean;
  petsAllowed?: boolean;
  reviews?: ReviewItem[];
}

export function HotelJsonLd({ data }: { data: HotelData }) {
  // Build review entries if provided
  const reviewEntries = data.reviews
    ? data.reviews.map((r) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: r.author,
        },
        datePublished: r.datePublished,
        reviewBody: r.reviewBody,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
        },
      }))
    : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LodgingBusiness', 'Hotel'],
    name: data.name,
    description: data.description,
    image: data.image,
    url: data.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address,
      addressCountry: 'IN',
      addressLocality: data.destination || 'India',
    },
    starRating: {
      '@type': 'Rating',
      ratingValue: data.stars,
      bestRating: 5,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: data.rating,
      reviewCount: data.reviewCount,
      bestRating: 5,
    },
    amenityFeature: data.amenities.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
    priceRange: `₹${data.pricePerNight}/night`,
    offers: {
      '@type': 'Offer',
      price: data.pricePerNight,
      priceCurrency: data.priceCurrency,
      availability: 'https://schema.org/InStock',
      url: data.url,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      seller: {
        '@type': 'TravelAgency',
        name: SITE_NAME,
      },
    },
    checkinTime: data.checkinTime || '14:00',
    checkoutTime: data.checkoutTime || '11:00',
    smokingAllowed: data.smokingAllowed ?? false,
    petsAllowed: data.petsAllowed ?? false,
    ...(reviewEntries && { review: reviewEntries }),
    ...(data.category && {
      additionalType: data.category,
    }),
    ...(data.destination && {
      containedInPlace: {
        '@type': 'City',
        name: data.destination,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
        },
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Destination Schema (TouristDestination + Place) ─────────────────────────

interface DestinationData {
  name: string;
  description: string;
  image: string;
  url: string;
  country: string;
  tagline?: string;
  packageCount?: number;
  hotelCount?: number;
  region?: 'domestic' | 'international';
}

export function DestinationJsonLd({ data }: { data: DestinationData }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['TouristDestination', 'Place'],
    name: data.name,
    description: data.description,
    image: data.image,
    url: data.url,
    ...(data.tagline && { slogan: data.tagline }),
    address: {
      '@type': 'PostalAddress',
      addressCountry: data.country === 'India' ? 'IN' : undefined,
      addressLocality: data.name,
      addressRegion: data.country,
    },
    geographicArea: {
      '@type': 'AdministrativeArea',
      name: data.country,
    },
    touristType: [
      { '@type': 'Audience', audienceType: 'Adventure Travelers' },
      { '@type': 'Audience', audienceType: 'Family Vacationers' },
      { '@type': 'Audience', audienceType: 'Honeymooners' },
    ],
    ...(data.packageCount && {
      availableLanguage: [{ '@type': 'Language', name: 'English' }, { '@type': 'Language', name: 'Hindi' }],
    }),
    includesAttraction: [],
    ...(data.region === 'domestic' && {
      containedInPlace: {
        '@type': 'Country',
        name: 'India',
        '@id': 'https://schema.org/India',
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Breadcrumb Schema ───────────────────────────────────────────────────────

interface BreadcrumbData {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbData }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── FAQ Schema ──────────────────────────────────────────────────────────────

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQJsonLd({ items }: { items: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── ItemList Schema (for list pages like /packages, /destinations, /hotels) ─

interface ItemListData {
  name: string;
  description: string;
  url: string;
  items: { name: string; url: string; position: number }[];
}

export function ItemListJsonLd({ data }: { data: ItemListData }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data.name,
    description: data.description,
    url: data.url,
    numberOfItems: data.items.length,
    itemListElement: data.items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Review Schema (standalone, for single or multiple reviews) ──────────────

interface ReviewData {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  itemName: string;
  itemUrl: string;
  itemType?: string;
}

export function ReviewJsonLd({ data }: { data: ReviewData }) {
  const schema = {
    '@context': 'https://schema.org',
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
    itemReviewed: {
      '@type': data.itemType || 'Product',
      name: data.itemName,
      url: data.itemUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Multiple Reviews Schema (outputs a single script with multiple reviews) ─

interface MultiReviewData {
  itemName: string;
  itemUrl: string;
  itemType?: string;
  reviews: ReviewItem[];
}

export function MultiReviewJsonLd({ data }: { data: MultiReviewData }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.itemName,
    url: data.itemUrl,
    review: data.reviews.map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.author,
      },
      datePublished: r.datePublished,
      reviewBody: r.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── LocalBusiness Schema ────────────────────────────────────────────────────

export function LocalBusinessJsonLd() {
  const [lat, lng] = GEO_POSITION.split(';');

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TravelAgency'],
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-wayfare-new.png`,
    image: `${SITE_URL}/images/logo-wayfare-new.png`,
    description: 'Book domestic and international tour packages, hotels, and flights with Wayfare. Premium travel experiences starting from ₹11,999.',
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Credit Card, UPI, Net Banking, Cash',
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS_ADDRESS,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '10:00',
        closes: '16:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '2450',
      bestRating: '5',
    },
    sameAs: [
      'https://www.instagram.com/wayfare',
      'https://www.facebook.com/wayfare',
      'https://twitter.com/wayfaretravel',
      'https://www.youtube.com/@wayfaretravel',
      'https://www.linkedin.com/company/wayfaretravel',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── VideoObject Schema ──────────────────────────────────────────────────────

interface VideoObjectData {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
}

export function VideoObjectJsonLd({ data }: { data: VideoObjectData }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: data.name,
    description: data.description,
    thumbnailUrl: data.thumbnailUrl,
    uploadDate: data.uploadDate,
    ...(data.duration && { duration: data.duration }),
    ...(data.contentUrl && { contentUrl: data.contentUrl }),
    ...(data.embedUrl && { embedUrl: data.embedUrl }),
    publisher: {
      '@type': 'TravelAgency',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo-wayfare-new.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── HowTo Schema (How to Book a Travel Package) ────────────────────────────

export function HowToJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Book a Travel Package on Wayfare',
    description: 'Step-by-step guide to finding and booking your dream travel package on Wayfare — from browsing destinations to confirming your booking.',
    totalTime: 'PT15M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: '11999',
    },
    tool: [
      { '@type': 'HowToTool', name: 'Wayfare Website' },
      { '@type': 'HowToTool', name: 'Phone' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        name: 'Browse Tour Packages',
        text: 'Visit wayfare.travel/packages to explore our curated collection of honeymoon, adventure, family, and pilgrimage tour packages across 50+ destinations.',
        url: `${SITE_URL}/packages`,
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: 'Choose Your Destination',
        text: 'Filter packages by destination, category, price range, or duration. Use our destination guide to find the perfect match for your travel style and budget.',
        url: `${SITE_URL}/destinations`,
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Review Package Details',
        text: 'Click on any package to view the full itinerary, included amenities, hotel options, pricing, and traveler reviews. Check what\'s included and what\'s not.',
        position: 3,
      },
      {
        '@type': 'HowToStep',
        name: 'Customize Your Trip',
        text: 'Want to add extra nights, upgrade your hotel, or include special experiences? Contact our travel experts to customize any package to your preferences.',
        position: 4,
      },
      {
        '@type': 'HowToStep',
        name: 'Book and Confirm',
        text: 'Fill in your travel details, select your preferred payment method (Credit Card, UPI, Net Banking), and confirm your booking. You\'ll receive an instant confirmation email with your itinerary.',
        position: 5,
      },
      {
        '@type': 'HowToStep',
        name: 'Get Ready to Travel',
        text: 'Receive your detailed travel voucher, hotel confirmations, and pre-trip checklist. Our 24/7 support team is available throughout your trip for any assistance.',
        position: 6,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
