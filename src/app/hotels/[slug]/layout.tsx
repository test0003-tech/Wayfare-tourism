import type { Metadata } from 'next';
import { getEdgeHotel } from '@/lib/edge-data';
import { generateDetailPageMetadata, KEYWORDS, SITE_URL, HOTEL_FAQS } from '@/lib/seo';
import { HotelJsonLd, FAQJsonLd, BreadcrumbJsonLd, MultiReviewJsonLd } from '@/components/wayfare/JsonLd';

// Sample reviews for hotels
const HOTEL_REVIEWS = [
  {
    author: 'Sneha Reddy',
    rating: 5,
    datePublished: '2024-12-01',
    reviewBody: 'A truly luxurious stay! The room was spacious and impeccably clean. The staff went above and beyond to make us feel welcome. The breakfast buffet had an amazing variety. We loved the pool area and the sunset views from the terrace. Highly recommended!',
  },
  {
    author: 'Vikram Joshi',
    rating: 4,
    datePublished: '2024-11-18',
    reviewBody: 'Beautiful property with excellent amenities. The location is perfect for exploring the area. Check-in was smooth and the concierge helped us plan our daily activities. Only minor issue was the Wi-Fi being a bit slow in the evenings. Would stay again.',
  },
  {
    author: 'Ananya Gupta',
    rating: 5,
    datePublished: '2024-10-05',
    reviewBody: 'One of the best hotel experiences we have ever had. The heritage charm combined with modern comforts was exactly what we wanted. The in-house restaurant served delicious local cuisine. The spa treatment was the highlight of our stay. Wayfare got us a great deal!',
  },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hotel = getEdgeHotel(slug);

  if (!hotel) {
    return {
      title: 'Hotel Not Found',
      description: 'The hotel you are looking for does not exist. Browse our collection of 200+ luxury, boutique & heritage hotels on Wayfare.',
    };
  }

  const categoryLabel = hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1);
  const priceRange = hotel.pricePerNight < 5000 ? 'budget' : hotel.pricePerNight < 10000 ? 'mid-range' : 'luxury';

  return generateDetailPageMetadata({
    name: `${hotel.name} — ${hotel.stars}-Star ${categoryLabel} Hotel in ${hotel.destination.name}`,
    description: hotel.description,
    path: `/hotels/${slug}`,
    image: hotel.image,
    category: `${categoryLabel} Hotel`,
    price: hotel.pricePerNight,
    priceCurrency: 'INR',
    location: `${hotel.destination.name}, ${hotel.destination.country}`,
    rating: 4.0 + (hotel.stars * 0.1),
    keywords: [
      hotel.name,
      `${hotel.destination.name} hotel`,
      `${hotel.destination.name} ${hotel.category} hotel`,
      `${hotel.stars} star hotel ${hotel.destination.name}`,
      `hotel in ${hotel.destination.name}`,
      `${hotel.category} hotel ${hotel.destination.country}`,
      `₹${hotel.pricePerNight.toLocaleString()} hotel ${hotel.destination.name}`,
      `${priceRange} hotel ${hotel.destination.name}`,
      `${hotel.destination.name} resort`,
      `best hotel in ${hotel.destination.name}`,
      `Wayfare ${hotel.destination.name} hotel`,
      ...KEYWORDS.hotels.filter(k => k.toLowerCase().includes(hotel.destination.name.toLowerCase()) || k.toLowerCase().includes(hotel.category.toLowerCase())),
    ],
    ...(true && {
      robots: { index: true, follow: true },
    }),
  });
}

export async function generateStaticParams() {
  const { getAllEdgeHotels } = await import('@/lib/edge-data');
  return getAllEdgeHotels().map((hotel) => ({ slug: hotel.slug }));
}

export default async function HotelSlugLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hotel = getEdgeHotel(slug);

  // Parse amenities from the hotel data
  const hotelAmenitiesByCategory: Record<string, string> = {
    luxury: 'Wi-Fi,Swimming Pool,Restaurant,Gym,Spa,Parking,AC,Room Service,Concierge',
    boutique: 'Wi-Fi,Restaurant,Parking,AC,Room Service,Bar',
    resort: 'Wi-Fi,Swimming Pool,Restaurant,Parking,AC,Beach Access,Spa',
    heritage: 'Wi-Fi,Restaurant,Parking,AC,Heritage Walk,Cultural Programs',
    budget: 'Wi-Fi,Parking,AC,Room Service',
    homestay: 'Wi-Fi,Home Cooked Meals,Parking,AC,Local Experience',
  };

  const amenities = hotel
    ? (hotelAmenitiesByCategory[hotel.category] || 'Wi-Fi,Parking,AC,Room Service').split(',')
    : [];

  return (
    <>
      {hotel && (
        <>
          <HotelJsonLd data={{
            name: hotel.name,
            description: hotel.description,
            image: hotel.image,
            pricePerNight: hotel.pricePerNight,
            priceCurrency: 'INR',
            rating: 4.0 + (hotel.stars * 0.1),
            reviewCount: 50,
            stars: hotel.stars,
            address: hotel.destination.name,
            url: `${SITE_URL}/hotels/${slug}`,
            amenities: amenities,
            destination: hotel.destination.name,
            category: hotel.category,
            checkinTime: '14:00',
            checkoutTime: '11:00',
            smokingAllowed: false,
            petsAllowed: hotel.category === 'resort' || hotel.category === 'homestay',
            reviews: HOTEL_REVIEWS,
          }} />
          <MultiReviewJsonLd data={{
            itemName: hotel.name,
            itemUrl: `${SITE_URL}/hotels/${slug}`,
            itemType: 'LodgingBusiness',
            reviews: HOTEL_REVIEWS,
          }} />
          <FAQJsonLd items={HOTEL_FAQS} />
          <BreadcrumbJsonLd items={{
            items: [
              { name: 'Home', url: SITE_URL },
              { name: 'Hotels', url: `${SITE_URL}/hotels` },
              { name: hotel.name, url: `${SITE_URL}/hotels/${slug}` },
            ],
          }} />
        </>
      )}
      {children}
    </>
  );
}
