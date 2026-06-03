// JsonLd.tsx - Structured Data for Google Rich Snippets

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  contactPoint: {
    telephone: string;
    contactType: string;
    availableLanguage: string[];
  };
  sameAs: string[];
  address: {
    streetAddress: string;
    addressLocality: string;
    addressCountry: string;
    postalCode: string;
  };
}

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
}

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
}

interface BreadcrumbData {
  items: { name: string; url: string }[];
}

// Organization Schema (for the root layout)
export function OrganizationJsonLd() {
  const data: OrganizationData = {
    name: 'Wayfare',
    url: 'https://wayfare.travel',
    logo: 'https://wayfare.travel/images/logo-wayfare-new.png',
    contactPoint: {
      telephone: '+91-98765-43210',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.instagram.com/wayfare',
      'https://www.facebook.com/wayfare',
      'https://twitter.com/wayfare',
    ],
    address: {
      streetAddress: 'Connaught Place',
      addressLocality: 'New Delhi',
      addressCountry: 'IN',
      postalCode: '110001',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TravelAgency',
          ...data,
        }),
      }}
    />
  );
}

// Website Schema with SearchAction
export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wayfare',
    url: 'https://wayfare.travel',
    description: 'Book domestic and international tour packages, hotels, and flights with Wayfare.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://wayfare.travel/packages?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Travel Package Schema (Product with Offer)
export function TravelPackageJsonLd({ data }: { data: TravelPackageData }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: data.image,
    brand: {
      '@type': 'Brand',
      name: 'Wayfare',
    },
    category: data.category,
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.priceCurrency,
      availability: 'https://schema.org/InStock',
      url: data.url,
      ...(data.originalPrice && {
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: data.originalPrice,
          priceCurrency: data.priceCurrency,
        },
      }),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: data.rating,
      reviewCount: data.reviewCount,
      bestRating: 5,
    },
    ...(data.duration && {
      additionalProperty: {
        '@type': 'PropertyValue',
        name: 'duration',
        value: data.duration,
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

// Hotel Schema (LodgingBusiness)
export function HotelJsonLd({ data }: { data: HotelData }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: data.name,
    description: data.description,
    image: data.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address,
      addressCountry: 'IN',
    },
    starRating: {
      '@type': 'Rating',
      ratingValue: data.stars,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: data.rating,
      reviewCount: data.reviewCount,
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
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb Schema
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

// FAQ Schema (for FAQ pages)
export function FAQJsonLd({ items }: { items: { question: string; answer: string }[] }) {
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
