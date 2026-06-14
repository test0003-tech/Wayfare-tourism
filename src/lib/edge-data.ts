// Edge-compatible data access - no Prisma/SQLite needed
// Data is pre-exported from the database for Cloudflare Pages compatibility
import edgeData from './edge-data.json';

export type EdgePackage = {
  slug: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  image: string;
  destination: { name: string; country: string };
  featured?: boolean;
  originalPrice?: number | null;
  rating?: number;
  reviewCount?: number;
};

export type EdgeDestination = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  country: string;
  image: string;
  featured?: boolean;
};

export type EdgeHotel = {
  slug: string;
  name: string;
  description: string;
  pricePerNight: number;
  stars: number;
  category: string;
  image: string;
  destination: { name: string; country: string };
  featured?: boolean;
  originalPrice?: number | null;
  rating?: number;
  reviewCount?: number;
};

export type EdgeFlight = {
  id: string;
  from: string;
  to: string;
  airline: string;
  price: number;
  originalPrice: number | null;
  type: string;
  image: string;
  description: string;
  featured: boolean;
};

const data = edgeData as {
  packages: EdgePackage[];
  destinations: EdgeDestination[];
  hotels: EdgeHotel[];
  flights: EdgeFlight[];
};

export function getEdgePackage(slug: string): EdgePackage | undefined {
  return data.packages.find((p) => p.slug === slug);
}

export function getEdgeDestination(slug: string): EdgeDestination | undefined {
  return data.destinations.find((d) => d.slug === slug);
}

export function getEdgeHotel(slug: string): EdgeHotel | undefined {
  return data.hotels.find((h) => h.slug === slug);
}

export function getAllEdgePackages() {
  return data.packages;
}

export function getAllEdgeDestinations() {
  return data.destinations;
}

export function getAllEdgeHotels() {
  return data.hotels;
}

export function getAllEdgeFlights() {
  return data.flights;
}

// --- Enrichment helpers for frontend compatibility ---

function getRegion(country: string): 'domestic' | 'international' {
  return country === 'India' ? 'domestic' : 'international';
}

function parseDuration(duration: string): { nights: number; days: number } {
  const match = duration.match(/(\d+)N(\d+)D/);
  if (match) {
    return { nights: parseInt(match[1]), days: parseInt(match[2]) };
  }
  return { nights: 0, days: 0 };
}

function getDestinationSlugByName(name: string): string {
  const dest = data.destinations.find((d) => d.name === name);
  return dest?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function getDestinationImageByName(name: string): string {
  const dest = data.destinations.find((d) => d.name === name);
  return dest?.image || '';
}

const categoryHighlights: Record<string, string> = {
  honeymoon: 'Candlelight Dinner,Couples Spa,Romantic Setup,Private Transfers,Flower Decoration',
  adventure: 'Trekking,River Rafting,Paragliding,Camping,Bonfire',
  beach: 'Beach Activities,Water Sports,Sunset Cruise,Snorkeling,Beach Dinner',
  tourism: 'Sightseeing,Local Culture,Guided Tours,Photography,Shopping',
  'hill-station': 'Mountain Views,Nature Walks,Tea Gardens,Scenic Drives,Sunrise Point',
  family: 'Family Activities,Kids Zone,Entertainment,Swimming Pool,Games',
  pilgrimage: 'Temple Visits,Spiritual Walks,Cultural Programs,Guided Darshan,Pooja',
  wildlife: 'Safari,Bird Watching,Nature Trails,Photography,Camping',
};

const categoryIncluded: Record<string, string> = {
  honeymoon: 'Accommodation,Breakfast,Dinner,Airport Transfers,Sightseeing,Candlelight Dinner',
  adventure: 'Accommodation,Breakfast,Activity Equipment,Guide,First Aid,Transfers',
  beach: 'Accommodation,Breakfast,Water Sports,Beach Access,Airport Transfers',
  tourism: 'Accommodation,Breakfast,Sightseeing,Guide,Airport Transfers,Entry Tickets',
  'hill-station': 'Accommodation,Breakfast,Sightseeing,Transfers,Tea Tasting',
  family: 'Accommodation,Breakfast,Kids Activities,Sightseeing,Transfers,Entertainment',
  pilgrimage: 'Accommodation,Breakfast,Darshan Arrangements,Guide,Transfers',
  wildlife: 'Accommodation,Breakfast,Safari,Naturalist Guide,Transfers',
};

const hotelAmenitiesByCategory: Record<string, string> = {
  luxury: 'Wi-Fi,Swimming Pool,Restaurant,Gym,Spa,Parking,AC,Room Service,Concierge',
  boutique: 'Wi-Fi,Restaurant,Parking,AC,Room Service,Bar',
  resort: 'Wi-Fi,Swimming Pool,Restaurant,Parking,AC,Beach Access,Spa',
  heritage: 'Wi-Fi,Restaurant,Parking,AC,Heritage Walk,Cultural Programs',
  budget: 'Wi-Fi,Parking,AC,Room Service',
  homestay: 'Wi-Fi,Home Cooked Meals,Parking,AC,Local Experience',
};

// Featured slugs — sourced from seed data, used when edge-data.json lacks featured field
const featuredPackageSlugs = new Set([
  'kerala-backwaters-5n6d',
  'kashmir-valley-5n6d',
  'goa-beach-4n5d',
  'dubai-luxury-4n5d',
  'maldives-paradise-4n5d',
  'thailand-explorer-5n6d',
]);

const featuredDestinationSlugs = new Set([
  'kerala',
  'kashmir',
  'goa',
  'andaman',
  'manali',
  'dubai',
  'maldives',
  'thailand',
  'bali',
]);

const featuredHotelSlugs = new Set([
  'taj-malabar-kerala',
  'lalit-grand-kashmir',
  'burj-al-arab-dubai',
  'soneva-fushi-maldives',
  'marina-bay-sands',
]);

function generateItinerary(pkg: EdgePackage): string {
  const { days } = parseDuration(pkg.duration);
  const destName = pkg.destination.name;
  const itineraries: { day: number; title: string; desc: string }[] = [];

  if (days >= 1) {
    itineraries.push({
      day: 1,
      title: `Arrival in ${destName}`,
      desc: `Arrive at ${destName} and check into your hotel. Spend the evening at leisure exploring the local surroundings and enjoying the amenities.`,
    });
  }
  if (days >= 2) {
    itineraries.push({
      day: 2,
      title: `${destName} Sightseeing`,
      desc: `After breakfast, embark on a full-day sightseeing tour of ${destName}'s top attractions. Visit landmarks, enjoy local cuisine, and immerse yourself in the culture.`,
    });
  }
  if (days >= 3) {
    itineraries.push({
      day: 3,
      title: `Explore ${destName}`,
      desc: `Continue your exploration with visits to nearby attractions, nature walks, and authentic local experiences that make ${destName} special.`,
    });
  }
  if (days >= 4) {
    itineraries.push({
      day: 4,
      title: `${destName} Adventure`,
      desc: `Experience the best activities ${destName} has to offer. Whether it's adventure sports, cultural programs, or relaxation, today is about making memories.`,
    });
  }
  if (days >= 5) {
    itineraries.push({
      day: 5,
      title: `Leisure & Shopping`,
      desc: `Enjoy a leisurely morning. Visit local markets for souvenirs, try local delicacies, and soak in the last bits of ${destName}'s charm.`,
    });
  }
  if (days >= 6) {
    itineraries.push({
      day: 6,
      title: `Final Day in ${destName}`,
      desc: `Make the most of your last full day with optional activities, spa treatments, or simply relaxing at the property.`,
    });
  }
  if (days >= 7) {
    itineraries.push({
      day: 7,
      title: `Departure`,
      desc: `After breakfast, check out and transfer to the airport/station. Carry home unforgettable memories of your ${destName} trip!`,
    });
  }

  return JSON.stringify(itineraries);
}

// Enriched package type matching frontend Package interface
export type EnrichedPackage = {
  id: string;
  name: string;
  slug: string;
  destinationId: string;
  destination: { name: string; country: string; region: string; image: string };
  category: string;
  duration: string;
  nights: number;
  days: number;
  price: number;
  originalPrice: number | null;
  image: string;
  description: string;
  highlights: string;
  included: string;
  itinerary: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
};

// Enriched destination type matching frontend Destination interface
export type EnrichedDestination = {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: 'domestic' | 'international';
  image: string;
  description: string;
  tagline: string;
  featured: boolean;
  _count: { packages: number; hotels: number };
};

// Enriched hotel type matching frontend Hotel interface
export type EnrichedHotel = {
  id: string;
  name: string;
  slug: string;
  destinationId: string;
  destination: { name: string; country: string; region: string };
  category: string;
  stars: number;
  pricePerNight: number;
  originalPrice: number | null;
  image: string;
  description: string;
  amenities: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
};

// Enriched flight type matching frontend FlightDeal interface
export type EnrichedFlight = {
  id: string;
  from: string;
  to: string;
  airline: string;
  price: number;
  originalPrice: number | null;
  type: string;
  image: string;
  description: string;
  featured: boolean;
};

export function enrichPackage(pkg: EdgePackage): EnrichedPackage {
  const { nights, days } = parseDuration(pkg.duration);
  const destSlug = getDestinationSlugByName(pkg.destination.name);
  const destImage = getDestinationImageByName(pkg.destination.name);
  const region = getRegion(pkg.destination.country);

  return {
    id: pkg.slug,
    name: pkg.name,
    slug: pkg.slug,
    destinationId: destSlug,
    destination: {
      name: pkg.destination.name,
      country: pkg.destination.country,
      region,
      image: destImage,
    },
    category: pkg.category,
    duration: pkg.duration,
    nights,
    days,
    price: pkg.price,
    originalPrice: pkg.originalPrice !== undefined ? pkg.originalPrice : Math.round(pkg.price * 1.3),
    image: pkg.image,
    description: pkg.description,
    highlights: categoryHighlights[pkg.category] || 'Sightseeing,Transfers,Accommodation,Breakfast',
    included: categoryIncluded[pkg.category] || 'Accommodation,Breakfast,Transfers,Sightseeing',
    itinerary: generateItinerary(pkg),
    rating: pkg.rating ?? 4.5,
    reviewCount: pkg.reviewCount ?? 0,
    featured: pkg.featured !== undefined ? pkg.featured : featuredPackageSlugs.has(pkg.slug),
  };
}

export function enrichDestination(dest: EdgeDestination): EnrichedDestination {
  const region = getRegion(dest.country);
  const packagesCount = data.packages.filter(
    (p) => p.destination.name === dest.name
  ).length;
  const hotelsCount = data.hotels.filter(
    (h) => h.destination.name === dest.name
  ).length;

  return {
    id: dest.slug,
    name: dest.name,
    slug: dest.slug,
    country: dest.country,
    region,
    image: dest.image,
    description: dest.description,
    tagline: dest.tagline,
    featured: dest.featured !== undefined ? dest.featured : featuredDestinationSlugs.has(dest.slug),
    _count: {
      packages: packagesCount,
      hotels: hotelsCount,
    },
  };
}

export function enrichHotel(hotel: EdgeHotel): EnrichedHotel {
  const destSlug = getDestinationSlugByName(hotel.destination.name);
  const region = getRegion(hotel.destination.country);

  return {
    id: hotel.slug,
    name: hotel.name,
    slug: hotel.slug,
    destinationId: destSlug,
    destination: {
      name: hotel.destination.name,
      country: hotel.destination.country,
      region,
    },
    category: hotel.category,
    stars: hotel.stars,
    pricePerNight: hotel.pricePerNight,
    originalPrice: hotel.originalPrice !== undefined ? hotel.originalPrice : Math.round(hotel.pricePerNight * 1.25),
    image: hotel.image,
    description: hotel.description,
    amenities: hotelAmenitiesByCategory[hotel.category] || 'Wi-Fi,Parking,AC,Room Service',
    rating: hotel.rating ?? (4.0 + (hotel.stars * 0.1)),
    reviewCount: hotel.reviewCount ?? 0,
    featured: hotel.featured !== undefined ? hotel.featured : featuredHotelSlugs.has(hotel.slug),
  };
}

export function enrichFlight(flight: EdgeFlight): EnrichedFlight {
  return {
    id: flight.id,
    from: flight.from,
    to: flight.to,
    airline: flight.airline,
    price: flight.price,
    originalPrice: flight.originalPrice,
    type: flight.type,
    image: flight.image,
    description: flight.description,
    featured: flight.featured,
  };
}
