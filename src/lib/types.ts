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

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  age?: number;
  packageId?: string;
  travelers: number;
  adults: number;
  children: number;
  departureDate: string;
  returnDate: string;
  roomType: string;
  specialRequests?: string;
  addOns?: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  age?: number;
  packageId?: string;
  adults: number;
  children: number;
  departureDate: string;
  returnDate: string;
  roomType: string;
  specialRequests?: string;
  addOns: string[];
  totalPrice: number;
}

export interface TravelPlannerRequest {
  destination: string;
  budget: string;
  duration: string;
  travelers: number;
  category: string;
  preferences?: string;
}

export interface TravelPlan {
  title: string;
  destination: string;
  summary: string;
  packages: Array<{
    name: string;
    duration: string;
    price: string;
    highlights: string[];
  }>;
  hotels: Array<{
    name: string;
    type: string;
    pricePerNight: string;
  }>;
  tips: string[];
  estimatedBudget: string;
}
