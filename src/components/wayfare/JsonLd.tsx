// JsonLd.tsx - Comprehensive Structured Data for Google Rich Snippets
// Supports: Organization, WebSite, TravelPackage (Product), Hotel (LodgingBusiness),
// Destination (TouristDestination), Breadcrumb, FAQ, Review, ItemList

import {
  SITE_URL,
  SITE_NAME,
  BUSINESS_PHONE,
  BUSINESS_EMAIL,
  BUSINESS_ADDRESS,
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
}

export function TravelPackageJsonLd({ data }: { data: TravelPackageData }) {
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
    ...(data.highlights && {
      itineraryinerary: data.highlights.map((h, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: h,
      })),
    }),
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
}

export function HotelJsonLd({ data }: { data: HotelData }) {
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
    checkinTime: '14:00',
    checkoutTime: '11:00',
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

// ─── Review Schema ───────────────────────────────────────────────────────────

interface ReviewData {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  itemName: string;
  itemUrl: string;
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
      '@type': 'Product',
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
