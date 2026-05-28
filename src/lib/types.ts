export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: 'domestic' | 'international';
  image: string;
  description: string;
  tagline: string;
  featured: boolean;
  _count?: {
    packages: number;
    hotels: number;
  };
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  destinationId: string;
  destination: {
    name: string;
    country: string;
    region: string;
    image: string;
  };
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
}

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  destinationId: string;
  destination: {
    name: string;
    country: string;
    region: string;
  };
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
}

export interface FlightDeal {
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
}

export interface InquiryData {
  name: string;
  email: string;
  phone?: string;
  type: string;
  message: string;
}
