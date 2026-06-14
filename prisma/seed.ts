import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// HELPER FUNCTIONS
// ============================================

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseDuration(duration: string): { nights: number; days: number } {
  const match = duration.match(/(\d+)N(\d+)D/);
  if (match) {
    return { nights: parseInt(match[1]), days: parseInt(match[2]) };
  }
  return { nights: 5, days: 6 };
}

// ============================================
// DESTINATIONS DATA
// ============================================

const destinationsData = [
  // Domestic (10)
  { name: 'Kerala', slug: 'kerala', country: 'India', region: 'domestic', tagline: "God's Own Country", image: '/images/destinations/kerala.png', description: 'Known as "God\'s Own Country," Kerala is a tropical paradise with serene backwaters, lush hill stations, exotic wildlife, and beautiful beaches. Experience the magic of houseboat stays on tranquil backwaters surrounded by palm trees.', featured: true },
  { name: 'Kashmir', slug: 'kashmir', country: 'India', region: 'domestic', tagline: 'Paradise on Earth', image: '/images/destinations/kashmir.png', description: 'Paradise on Earth, Kashmir enchants with its pristine valleys, snow-capped mountains, crystal-clear lakes, and vibrant Mughal gardens. Sail on Dal Lake in a shikara and experience the breathtaking beauty of the Himalayas.', featured: true },
  { name: 'Goa', slug: 'goa', country: 'India', region: 'domestic', tagline: 'Sun, Sand & Surf', image: '/images/destinations/goa.png', description: 'India\'s sunshine state, Goa is famous for its golden beaches, vibrant nightlife, Portuguese heritage, and delicious seafood. From sun-kissed beaches to spice plantations, Goa offers the perfect blend of relaxation and adventure.', featured: true },
  { name: 'Darjeeling', slug: 'darjeeling', country: 'India', region: 'domestic', tagline: 'Queen of the Hills', image: '/images/destinations/darjeeling.png', description: 'The Queen of Hills, Darjeeling captivates with its tea gardens, the iconic toy train, and stunning views of Kanchenjunga. Sip world-famous tea while watching the sunrise paint the Himalayas in golden hues.', featured: false },
  { name: 'Andaman & Nicobar', slug: 'andaman', country: 'India', region: 'domestic', tagline: 'Emerald Islands', image: '/images/destinations/andaman.png', description: 'A tropical archipelago in the Bay of Bengal, the Andaman Islands boast pristine white-sand beaches, crystal-clear turquoise waters, and vibrant coral reefs. Perfect for snorkeling, scuba diving, and beach lovers.', featured: true },
  { name: 'Manali', slug: 'manali', country: 'India', region: 'domestic', tagline: 'Valley of the Gods', image: '/images/destinations/manali.png', description: 'A picturesque hill station nestled in the Beas River Valley, Manali is a haven for adventure enthusiasts and nature lovers. From skiing in Solang Valley to trekking through pine forests, Manali offers thrilling experiences year-round.', featured: true },
  { name: 'Dharamshala', slug: 'dharamshala', country: 'India', region: 'domestic', tagline: 'Little Lhasa of India', image: '/images/destinations/dharamshala.png', description: 'Nestled in the Kangra Valley, Dharamshala is a serene hill station with Tibetan culture, stunning mountain views, and the famous cricket stadium. McLeod Ganj, its upper suburb, offers a unique cultural experience.', featured: false },
  { name: 'Delhi - Golden Triangle', slug: 'delhi-golden-triangle', country: 'India', region: 'domestic', tagline: 'Heritage Triangle', image: '/images/destinations/delhi.png', description: 'The Golden Triangle circuit covers Delhi, Agra, and Jaipur — three cities that showcase India\'s rich heritage. From the Taj Mahal to the Amber Fort, experience the best of Indian history, culture, and architecture.', featured: false },
  { name: 'Sikkim', slug: 'sikkim', country: 'India', region: 'domestic', tagline: 'The Land of Monasteries', image: '/images/destinations/sikkim.png', description: 'A small but stunning state in northeast India, Sikkim offers breathtaking views of Kanchenjunga, ancient Buddhist monasteries, pristine lakes, and vibrant rhododendron forests. A perfect blend of nature and spirituality.', featured: false },
  { name: 'Himachal Pradesh', slug: 'himachal', country: 'India', region: 'domestic', tagline: 'Land of Gods & Beauty', image: '/images/destinations/himachal.png', description: 'From the colonial charm of Shimla to the adventure capital of Manali, Himachal Pradesh is a land of diverse landscapes. Snow-capped peaks, lush valleys, apple orchards, and warm hospitality await you.', featured: false },
  // International (9)
  { name: 'Dubai', slug: 'dubai', country: 'UAE', region: 'international', tagline: 'City of Gold', image: '/images/destinations/dubai.png', description: 'A gleaming metropolis of luxury and innovation, Dubai dazzles with its iconic Burj Khalifa, pristine beaches, world-class shopping, and desert safaris. Experience the perfect blend of tradition and modernity.', featured: true },
  { name: 'Maldives', slug: 'maldives', country: 'Maldives', region: 'international', tagline: 'Sun, Sand & Serenity', image: '/images/destinations/maldives.png', description: 'The ultimate tropical paradise, the Maldives features overwater villas, crystal-clear lagoons, and vibrant coral reefs. A bucket-list destination for honeymooners and luxury seekers with unmatched serenity.', featured: true },
  { name: 'Thailand', slug: 'thailand', country: 'Thailand', region: 'international', tagline: 'Land of Smiles', image: '/images/destinations/thailand.png', description: 'The Land of Smiles offers ornate temples, pristine beaches, vibrant street markets, and world-famous cuisine. From Bangkok\'s bustling streets to Phuket\'s serene shores, Thailand has something for everyone.', featured: true },
  { name: 'Singapore', slug: 'singapore', country: 'Singapore', region: 'international', tagline: 'The Lion City', image: '/images/destinations/singapore.png', description: 'A futuristic city-state, Singapore blends stunning architecture, lush gardens, and a melting pot of cultures. From Marina Bay Sands to Gardens by the Bay, it\'s a city that never fails to amaze.', featured: false },
  { name: 'Malaysia', slug: 'malaysia', country: 'Malaysia', region: 'international', tagline: 'Truly Asia', image: '/images/destinations/malaysia.png', description: 'Truly Asia! Malaysia offers a rich cultural tapestry, from the Petronas Twin Towers to the lush rainforests of Borneo. Enjoy diverse cuisine, stunning islands, and vibrant cities all in one destination.', featured: false },
  { name: 'Bali (Indonesia)', slug: 'bali', country: 'Indonesia', region: 'international', tagline: 'Island of the Gods', image: '/images/destinations/bali.png', description: 'The Island of the Gods, Bali mesmerizes with its terraced rice paddies, ancient temples, volcanic hills, and stunning beaches. A spiritual and cultural haven with world-class surfing and wellness retreats.', featured: true },
  { name: 'Sri Lanka', slug: 'srilanka', country: 'Sri Lanka', region: 'international', tagline: 'Pearl of the Indian Ocean', image: '/images/destinations/srilanka.png', description: 'The Pearl of the Indian Ocean, Sri Lanka offers ancient ruins, lush tea plantations, exotic wildlife, and golden beaches. A compact island with incredible diversity from culture to nature.', featured: false },
  { name: 'Vietnam', slug: 'vietnam', country: 'Vietnam', region: 'international', tagline: 'Hidden Charm', image: '/images/destinations/vietnam.png', description: 'From the emerald waters of Ha Long Bay to the charming streets of Hoi An, Vietnam captivates with its natural beauty, rich history, and incredible cuisine. An affordable yet unforgettable destination.', featured: false },
  { name: 'Nepal', slug: 'nepal', country: 'Nepal', region: 'international', tagline: 'Roof of the World', image: '/images/destinations/nepal.png', description: 'Home to the Himalayas and Mount Everest, Nepal offers trekking adventures, ancient temples, and warm hospitality. From Kathmandu\'s cultural heritage to Pokhara\'s serene lakes, Nepal is a trekker\'s paradise.', featured: false },
];

// ============================================
// PACKAGES DATA (with highlights, inclusions, itinerary)
// ============================================

const featuredPackageSlugs = ['kerala-backwaters-5n6d', 'kashmir-valley-5n6d', 'goa-beach-4n5d', 'dubai-luxury-4n5d', 'maldives-paradise-4n5d', 'thailand-explorer-5n6d'];

interface PackageInput {
  slug: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  image: string;
  destinationSlug: string;
  highlights: string[];
  included: string[];
  itinerary: { day: number; title: string; description: string }[];
}

const packagesData: PackageInput[] = [
  {
    slug: 'kerala-backwaters-5n6d',
    name: 'Kerala Backwaters & Beaches',
    description: 'Experience the magical backwaters of Kerala with houseboat stays, visit pristine beaches, explore tea plantations in Munnar, and witness traditional Kathakali performances.',
    price: 18999,
    duration: '5N6D',
    category: 'tourism',
    image: '/images/destinations/kerala.png',
    destinationSlug: 'kerala',
    highlights: ['Overnight houseboat stay in Alleppey', 'Tea plantation tour in Munnar', 'Kathakali dance performance', 'Kovalam beach relaxation', 'Periyar wildlife boat safari', 'Traditional Kerala Ayurvedic massage'],
    included: ['5 nights accommodation', 'Daily breakfast & dinner', 'Houseboat stay with meals', 'All transfers by AC vehicle', 'Sightseeing as per itinerary', 'Kathakali show tickets', 'English-speaking guide', 'All applicable taxes'],
    itinerary: [
      { day: 1, title: 'Arrival in Kochi', description: 'Arrive at Kochi airport. Transfer to hotel. Evening visit to Fort Kochi, Chinese Fishing Nets, and Jew Town.' },
      { day: 2, title: 'Kochi to Munnar', description: 'Drive to Munnar (4 hrs). En route visit Cheeyappara & Valara waterfalls. Afternoon tea plantation visit and Tea Museum.' },
      { day: 3, title: 'Munnar Sightseeing', description: 'Full day Munnar sightseeing - Eravikulam National Park, Mattupetty Dam, Echo Point, and Kundala Lake.' },
      { day: 4, title: 'Munnar to Thekkady', description: 'Drive to Thekkady (3 hrs). Afternoon Periyar wildlife boat safari and spice plantation tour.' },
      { day: 5, title: 'Thekkady to Alleppey Houseboat', description: 'Drive to Alleppey. Board traditional houseboat for overnight backwater cruise with all meals onboard.' },
      { day: 6, title: 'Departure from Kochi', description: 'Disembark houseboat. Transfer to Kochi airport for departure.' },
    ],
  },
  {
    slug: 'kerala-honeymoon-4n5d',
    name: 'Kerala Honeymoon Special',
    description: 'A romantic getaway through Kerala\'s most enchanting destinations. Private houseboat stays, candlelight dinners, and couples spa treatments make this the perfect honeymoon.',
    price: 22999,
    duration: '4N5D',
    category: 'honeymoon',
    image: '/images/packages/honeymoon.png',
    destinationSlug: 'kerala',
    highlights: ['Private houseboat with candlelight dinner', 'Couples Ayurvedic spa treatment', 'Romantic beach sunset in Kovalam', 'Tea garden walks in Munnar', 'Flower decoration in room'],
    included: ['4 nights accommodation in premium hotels', 'Daily breakfast & dinner', 'Private houseboat stay with meals', 'Candlelight dinner arrangement', 'Couples spa session', 'All transfers by AC vehicle', 'Flower bed decoration', 'Honeymoon cake & fruit basket'],
    itinerary: [
      { day: 1, title: 'Arrival in Kochi - Transfer to Munnar', description: 'Welcome at Kochi airport with flower garlands. Scenic drive to Munnar. Check-in to romantic resort. Evening at leisure.' },
      { day: 2, title: 'Munnar Romance & Tea Gardens', description: 'Morning tea plantation walk. Visit Eravikulam National Park. Afternoon couples spa. Evening candlelight dinner at resort.' },
      { day: 3, title: 'Munnar to Alleppey Houseboat', description: 'Drive to Alleppey. Board private houseboat with flower decoration. Cruise through backwaters. Candlelight dinner on houseboat.' },
      { day: 4, title: 'Alleppey to Kovalam', description: 'Disembark houseboat. Drive to Kovalam beach. Afternoon relaxation at beach. Romantic sunset view from lighthouse beach.' },
      { day: 5, title: 'Departure', description: 'Morning beach walk. Breakfast at hotel. Transfer to Trivandrum/Kochi airport.' },
    ],
  },
  {
    slug: 'kashmir-valley-5n6d',
    name: 'Kashmir Valley Explorer',
    description: 'Discover the breathtaking beauty of Kashmir with stays in Srinagar, Gulmarg, and Pahalgam. Experience shikara rides, gondola cable car, and the stunning Mughal Gardens.',
    price: 17999,
    duration: '5N6D',
    category: 'tourism',
    image: '/images/destinations/kashmir.png',
    destinationSlug: 'kashmir',
    highlights: ['Shikara ride on Dal Lake', 'Gondola cable car in Gulmarg', 'Mughal Gardens tour', 'Pahalgam valley exploration', 'Traditional Wazwan dinner', 'Houseboat stay on Dal Lake'],
    included: ['5 nights accommodation (houseboat + hotels)', 'Daily breakfast & dinner', 'Shikara ride on Dal Lake', 'Gondola cable car ride (Phase 1)', 'All transfers by non-AC vehicle (hill terrain)', 'Sightseeing as per itinerary', 'Wazwan dinner experience', 'All applicable taxes'],
    itinerary: [
      { day: 1, title: 'Arrival in Srinagar', description: 'Arrive at Srinagar airport. Transfer to houseboat on Dal Lake. Evening shikara ride witnessing the floating gardens and sunset.' },
      { day: 2, title: 'Srinagar - Mughal Gardens', description: 'Visit the famous Mughal Gardens - Nishat Bagh, Shalimar Bagh, and Chashme Shahi. Afternoon visit to local handicraft emporium.' },
      { day: 3, title: 'Srinagar to Gulmarg', description: 'Drive to Gulmarg (2.5 hrs). Gondola cable car ride to Apharwat peak. Evening at leisure in the meadow of flowers.' },
      { day: 4, title: 'Gulmarg to Pahalgam', description: 'Drive to Pahalgam (4 hrs). En route visit saffron fields and Awantipura ruins. Afternoon visit to Betaab Valley and Aru Valley.' },
      { day: 5, title: 'Pahalgam Sightseeing', description: 'Full day at Pahalgam. Visit Chandanwari, Baisaran meadows, and Lidder River. Optional pony rides available.' },
      { day: 6, title: 'Departure from Srinagar', description: 'Drive back to Srinagar airport for departure. Shopping for Kashmiri handicrafts if time permits.' },
    ],
  },
  {
    slug: 'kashmir-honeymoon-6n7d',
    name: 'Kashmir Honeymoon Delight',
    description: 'A dreamy honeymoon in paradise with luxury houseboat stays, romantic shikara rides, candlelight dinners, and the stunning backdrop of the Himalayas.',
    price: 28999,
    duration: '6N7D',
    category: 'honeymoon',
    image: '/images/packages/honeymoon.png',
    destinationSlug: 'kashmir',
    highlights: ['Luxury houseboat with romantic setup', 'Private shikara ride at sunset', 'Candlelight dinner on houseboat', 'Gondola ride in Gulmarg', 'Couples trek in Pahalgam', 'Kahwa & Wazwan experience'],
    included: ['6 nights accommodation in premium hotels & houseboat', 'Daily breakfast & dinner', 'Private shikara ride', 'Gondola cable car ride', 'Candlelight dinner on houseboat', 'Flower decoration & honeymoon cake', 'All transfers by private vehicle', 'English-speaking guide', 'All applicable taxes'],
    itinerary: [
      { day: 1, title: 'Arrival - Welcome to Paradise', description: 'Arrive at Srinagar. Welcome with flowers and Kahwa. Transfer to luxury houseboat. Romantic shikara ride at sunset.' },
      { day: 2, title: 'Srinagar Romance', description: 'Visit Mughal Gardens. Afternoon romantic walk by Dal Lake. Evening candlelight dinner on the houseboat.' },
      { day: 3, title: 'Srinagar to Gulmarg', description: 'Drive to Gulmarg. Gondola ride to snow point. Play in the snow together. Evening bonfire at resort.' },
      { day: 4, title: 'Gulmarg at Leisure', description: 'Full day at leisure in Gulmarg. Optional ATV rides, horse riding, or simply enjoy the meadows together.' },
      { day: 5, title: 'Gulmarg to Pahalgam', description: 'Drive to Pahalgam. Visit Betaab Valley and Aru Valley. Evening riverside walk along the Lidder.' },
      { day: 6, title: 'Pahalgam - Valley of Love', description: 'Couples trek to Baisaran meadows. Afternoon at leisure. Farewell Wazwan dinner.' },
      { day: 7, title: 'Departure', description: 'Drive to Srinagar airport. Last-minute shopping for pashmina and saffron.' },
    ],
  },
  {
    slug: 'goa-beach-4n5d',
    name: 'Goa Beach Getaway',
    description: 'Sun, sand, and party! Experience Goa\'s best beaches, vibrant nightlife, water sports, Portuguese heritage, and mouthwatering seafood on this unforgettable beach vacation.',
    price: 12999,
    duration: '4N5D',
    category: 'beach',
    image: '/images/destinations/goa.png',
    destinationSlug: 'goa',
    highlights: ['Baga & Calangute beach fun', 'Dolphin spotting boat ride', 'Spice plantation tour', 'Casino night experience', 'Portuguese heritage walk in Old Goa', 'Water sports activities'],
    included: ['4 nights accommodation in beach resort', 'Daily breakfast', 'Dolphin spotting boat ride', 'Spice plantation tour with lunch', 'Casino entry with chips', 'All transfers by AC vehicle', 'Water sports (banana ride, jet ski)', 'All applicable taxes'],
    itinerary: [
      { day: 1, title: 'Arrival in Goa', description: 'Arrive at Goa airport/railway station. Transfer to beach resort. Evening at Baga Beach and Tito\'s Lane for nightlife.' },
      { day: 2, title: 'North Goa Beaches & Forts', description: 'Visit Calangute, Baga, and Anjuna beaches. Fort Aguada and Chapora Fort. Afternoon water sports. Evening casino visit.' },
      { day: 3, title: 'South Goa & Old Goa', description: 'Visit Old Goa churches - Basilica of Bom Jesus and Se Cathedral. Dona Paula, Miramar Beach. Afternoon spice plantation tour.' },
      { day: 4, title: 'Dolphin Ride & Leisure', description: 'Morning dolphin spotting boat ride. Rest of day at leisure - beach hopping, shopping at flea markets, or spa.' },
      { day: 5, title: 'Departure', description: 'Morning at leisure. Check-out and transfer to airport/railway station.' },
    ],
  },
  {
    slug: 'darjeeling-sikkim-5n6d',
    name: 'Darjeeling & Sikkim Combo',
    description: 'Explore the Queen of Hills and the magical land of Sikkim. Witness sunrise at Tiger Hill, ride the toy train, visit Buddhist monasteries, and enjoy stunning mountain views.',
    price: 15999,
    duration: '5N6D',
    category: 'hill-station',
    image: '/images/destinations/darjeeling.png',
    destinationSlug: 'darjeeling',
    highlights: ['Sunrise at Tiger Hill', 'UNESCO Toy Train ride', 'Tsomgo Lake visit', 'Rumtek Monastery tour', 'Batasia Loop & Ghoom Monastery', 'Tea garden visits'],
    included: ['5 nights accommodation', 'Daily breakfast & dinner', 'Tiger Hill sunrise tour', 'Toy Train ride (Joy Ride)', 'All sightseeing as per itinerary', 'All transfers by non-AC vehicle', 'Permit for Tsomgo Lake & Nathula', 'English-speaking guide'],
    itinerary: [
      { day: 1, title: 'Arrival in Darjeeling', description: 'Arrive at Bagdogra/NJP. Drive to Darjeeling (3 hrs). Check-in and evening stroll on Mall Road.' },
      { day: 2, title: 'Darjeeling Sightseeing', description: 'Early morning Tiger Hill sunrise. Visit Ghoom Monastery, Batasia Loop, Himalayan Mountaineering Institute, and Padmaja Naidu Zoo.' },
      { day: 3, title: 'Darjeeling - Toy Train & Tea', description: 'Morning Toy Train Joy Ride. Visit Happy Valley Tea Estate. Afternoon visit to Japanese Temple and Peace Pagoda.' },
      { day: 4, title: 'Darjeeling to Gangtok', description: 'Drive to Gangtok (4 hrs). Afternoon visit to Rumtek Monastery and Do Drul Chorten.' },
      { day: 5, title: 'Gangtok - Tsomgo Lake & Baba Mandir', description: 'Full day excursion to Tsomgo Lake, Baba Mandir, and (subject to permit) Nathula Pass at Indo-China border.' },
      { day: 6, title: 'Departure', description: 'Morning at leisure in Gangtok. Drive to Bagdogra/NJP for departure.' },
    ],
  },
  {
    slug: 'andaman-island-5n6d',
    name: 'Andaman Island Escape',
    description: 'Escape to the pristine islands of Andaman with crystal-clear waters, vibrant coral reefs, and untouched beaches. Perfect for snorkeling, scuba diving, and tropical relaxation.',
    price: 24999,
    duration: '5N6D',
    category: 'beach',
    image: '/images/destinations/andaman.png',
    destinationSlug: 'andaman',
    highlights: ['Radhanagar Beach - Asia\'s best', 'Scuba diving at Havelock', 'Snorkeling at North Bay Island', 'Cellular Jail Light & Sound Show', 'Ross Island heritage walk', 'Bioluminescent beach visit'],
    included: ['5 nights accommodation in beach resort', 'Daily breakfast & dinner', 'Inter-island ferry transfers', 'Scuba diving session', 'Snorkeling equipment', 'Cellular Jail entry & show', 'All transfers by AC vehicle', 'All applicable taxes & permits'],
    itinerary: [
      { day: 1, title: 'Arrival in Port Blair', description: 'Arrive at Port Blair. Visit Cellular Jail and attend the Light & Sound Show. Evening at Aberdeen Bazaar.' },
      { day: 2, title: 'Port Blair - Ross & North Bay', description: 'Visit Ross Island (by boat). Snorkeling at North Bay Island (Coral Island). Visit Chidiya Tapu in evening.' },
      { day: 3, title: 'Port Blair to Havelock Island', description: 'Ferry to Havelock Island. Visit world-famous Radhanagar Beach for sunset. Overnight at Havelock.' },
      { day: 4, title: 'Havelock - Scuba & Beach', description: 'Morning scuba diving session. Afternoon visit to Elephant Beach for snorkeling and water sports.' },
      { day: 5, title: 'Havelock to Port Blair', description: 'Morning at leisure. Afternoon ferry back to Port Blair. Evening visit to Marina Park and Water Sports Complex.' },
      { day: 6, title: 'Departure', description: 'Morning visit to Anthropological Museum. Transfer to airport for departure.' },
    ],
  },
  {
    slug: 'manali-adventure-4n5d',
    name: 'Manali Adventure Package',
    description: 'An adventure-packed trip to Manali with paragliding, river rafting, trekking, and skiing (seasonal). Experience the thrill of the Himalayas with stunning valley views.',
    price: 11999,
    duration: '4N5D',
    category: 'adventure',
    image: '/images/packages/adventure.png',
    destinationSlug: 'manali',
    highlights: ['Paragliding in Solang Valley', 'River rafting on Beas River', 'Rohtang Pass visit (seasonal)', 'Hadimba Temple & Old Manali', 'Bonfire & music evening', 'Zorbing & ATV rides'],
    included: ['4 nights accommodation in adventure resort', 'Daily breakfast & dinner', 'Paragliding session', 'River rafting experience', 'Bonfire evening with music', 'All transfers by non-AC vehicle', 'Sightseeing as per itinerary', 'Adventure activity coordinator'],
    itinerary: [
      { day: 1, title: 'Arrival in Manali', description: 'Arrive at Manali. Check-in to resort. Evening visit to Hadimba Temple, Manu Temple, and Old Manali cafe hopping.' },
      { day: 2, title: 'Solang Valley Adventure', description: 'Full day at Solang Valley. Paragliding, zorbing, ATV rides, and rope way. Winter: skiing and snow play.' },
      { day: 3, title: 'Rohtang Pass & Rafting', description: 'Morning excursion to Rohtang Pass (subject to permit/season). Afternoon river rafting on the Beas River.' },
      { day: 4, title: 'Manali Exploration', description: 'Visit Vashisht Hot Springs, Jogini Waterfalls trek, and Tibetan Monastery. Evening bonfire with fellow travelers.' },
      { day: 5, title: 'Departure', description: 'Morning at leisure. Check-out and transfer to bus stand/airport.' },
    ],
  },
  {
    slug: 'manali-honeymoon-5n6d',
    name: 'Manali Honeymoon Retreat',
    description: 'A romantic escape to the mountains with cozy resort stays, candlelight dinners, scenic walks, and unforgettable sunsets. The perfect honeymoon in the Himalayas.',
    price: 19999,
    duration: '5N6D',
    category: 'honeymoon',
    image: '/images/packages/honeymoon.png',
    destinationSlug: 'manali',
    highlights: ['Romantic riverside resort', 'Candlelight dinner with mountain views', 'Couples spa session', 'Scenic walk through pine forests', 'Private bonfire evening', 'Solang Valley snow play'],
    included: ['5 nights in premium riverside resort', 'Daily breakfast & dinner', 'Candlelight dinner arrangement', 'Couples spa session', 'Flower bed decoration', 'Bonfire with snacks', 'All transfers by private vehicle', 'Honeymoon cake on arrival'],
    itinerary: [
      { day: 1, title: 'Welcome to the Mountains', description: 'Arrive in Manali. Welcome drink and honeymoon cake. Check-in to riverside resort. Evening romantic walk along Beas River.' },
      { day: 2, title: 'Manali Romance', description: 'Morning visit to Hadimba Temple. Afternoon couples spa. Evening candlelight dinner with mountain views.' },
      { day: 3, title: 'Solang Valley Fun', description: 'Day trip to Solang Valley. Play in snow, rope way ride, and adventure activities together. Evening bonfire.' },
      { day: 4, title: 'Rohtang Pass Excursion', description: 'Day excursion to Rohtang Pass (seasonal). Snow play and photography. Evening at leisure in resort.' },
      { day: 5, title: 'Old Manali & Nature Walk', description: 'Morning nature walk through pine forests. Explore Old Manali cafes and shops. Afternoon at leisure.' },
      { day: 6, title: 'Departure', description: 'Morning breakfast. Check-out and transfer with beautiful memories.' },
    ],
  },
  {
    slug: 'golden-triangle-5n6d',
    name: 'Golden Triangle Tour',
    description: 'Explore India\'s most iconic circuit — Delhi, Agra, and Jaipur. Visit the magnificent Taj Mahal, explore majestic forts, and experience the vibrant culture of Rajasthan.',
    price: 15999,
    duration: '5N6D',
    category: 'tourism',
    image: '/images/destinations/delhi.png',
    destinationSlug: 'delhi-golden-triangle',
    highlights: ['Taj Mahal sunrise visit', 'Amber Fort elephant ride', 'Delhi monument tour', 'Jaipur City Palace & Hawa Mahal', 'Rickshaw ride in Old Delhi', 'Rajasthani cultural evening'],
    included: ['5 nights accommodation in heritage hotels', 'Daily breakfast & dinner', 'Taj Mahal entry tickets', 'Amber Fort elephant ride', 'All transfers by AC vehicle', 'Rickshaw ride in Old Delhi', 'English-speaking guide at each city', 'All applicable taxes'],
    itinerary: [
      { day: 1, title: 'Arrival in Delhi', description: 'Arrive in Delhi. Afternoon tour of New Delhi - India Gate, Parliament House, Qutub Minar, and Humayun\'s Tomb.' },
      { day: 2, title: 'Old Delhi Exploration', description: 'Morning Old Delhi tour - Red Fort, Jama Masjid, Raj Ghat. Cycle rickshaw ride through Chandni Chowk. Afternoon drive to Agra.' },
      { day: 3, title: 'Agra - The Taj Mahal', description: 'Sunrise visit to Taj Mahal. After breakfast visit Agra Fort and Itmad-ud-Daulah (Baby Taj). Afternoon drive to Jaipur via Fatehpur Sikri.' },
      { day: 4, title: 'Jaipur - Pink City', description: 'Morning Amber Fort with elephant ride. Afternoon City Palace, Jantar Mantar, and Hawa Mahal. Evening cultural show.' },
      { day: 5, title: 'Jaipur at Leisure', description: 'Morning visit to Nahargarh Fort and Sisodia Garden. Afternoon shopping for textiles, jewelry, and handicrafts.' },
      { day: 6, title: 'Return to Delhi', description: 'Drive back to Delhi. Last-minute shopping or sightseeing. Transfer to airport for departure.' },
    ],
  },
  {
    slug: 'sikkim-serenity-5n6d',
    name: 'Sikkim Serenity Tour',
    description: 'Discover the mystical beauty of Sikkim with its ancient monasteries, pristine lakes, and panoramic mountain views. A journey of peace and natural wonder.',
    price: 16999,
    duration: '5N6D',
    category: 'hill-station',
    image: '/images/destinations/sikkim.png',
    destinationSlug: 'sikkim',
    highlights: ['Tsomgo Lake at 12,400 ft', 'Nathula Pass (Indo-China border)', 'Rumtek Monastery visit', 'Pelling skywalk & views', 'Buddha Park Ravangla', 'Rhinoceros waterfalls trek'],
    included: ['5 nights accommodation', 'Daily breakfast & dinner', 'Tsomgo Lake & Nathula permit', 'All sightseeing as per itinerary', 'All transfers by non-AC vehicle', 'English-speaking guide', 'Inner Line Permit', 'All applicable taxes'],
    itinerary: [
      { day: 1, title: 'Arrival in Gangtok', description: 'Arrive at Bagdogra/NJP. Drive to Gangtok (4 hrs). Evening stroll on MG Marg.' },
      { day: 2, title: 'Gangtok - Tsomgo Lake & Nathula', description: 'Excursion to Tsomgo Lake, Baba Mandir, and Nathula Pass (subject to permit). Return to Gangtok by evening.' },
      { day: 3, title: 'Gangtok Monastery Trail', description: 'Visit Rumtek Monastery, Do Drul Chorten, Institute of Tibetology, and Enchey Monastery. Afternoon at MG Marg.' },
      { day: 4, title: 'Gangtok to Pelling', description: 'Drive to Pelling via Ravangla (Buddha Park). Afternoon visit to Pelling Skywalk and Rimbi Waterfalls.' },
      { day: 5, title: 'Pelling Sightseeing', description: 'Visit Khecheopalri Lake, Kanchenjunga Falls, and Rabdentse Ruins. Stunning views of Kanchenjunga range.' },
      { day: 6, title: 'Departure', description: 'Drive from Pelling to Bagdogra/NJP for departure.' },
    ],
  },
  {
    slug: 'himachal-himalayan-6n7d',
    name: 'Himachal Himalayan Journey',
    description: 'A complete Himachal Pradesh experience covering Shimla, Manali, and Dharamshala. From colonial charm to adventure sports and Tibetan culture, this trip has it all.',
    price: 21999,
    duration: '6N7D',
    category: 'hill-station',
    image: '/images/destinations/himachal.png',
    destinationSlug: 'himachal',
    highlights: ['Shimla Mall Road & Ridge', 'Kalka-Shimla toy train', 'Solang Valley adventure', 'Dharamshala cricket stadium', 'McLeod Ganj Tibetan culture', 'Dalai Lama Temple visit'],
    included: ['6 nights accommodation', 'Daily breakfast & dinner', 'Toy train tickets (Kalka-Shimla)', 'Solang Valley activities', 'All transfers by non-AC vehicle', 'Sightseeing as per itinerary', 'English-speaking guide', 'All applicable taxes'],
    itinerary: [
      { day: 1, title: 'Arrival in Shimla', description: 'Arrive at Kalka. Board the UNESCO toy train to Shimla. Evening walk on Mall Road and Ridge.' },
      { day: 2, title: 'Shimla Sightseeing', description: 'Visit Jakhu Temple, Christ Church, State Museum, and Indian Institute of Advanced Studies. Evening at Lakkar Bazaar.' },
      { day: 3, title: 'Shimla to Manali', description: 'Scenic drive from Shimla to Manali (7-8 hrs) via Kullu. En route visit Pandoh Dam and Kullu shawl factories.' },
      { day: 4, title: 'Manali - Solang Valley', description: 'Full day at Solang Valley for adventure activities - paragliding, zorbing, rope way, and ATV rides.' },
      { day: 5, title: 'Manali to Dharamshala', description: 'Drive to Dharamshala (6-7 hrs). Evening visit to Dalai Lama Temple Complex in McLeod Ganj.' },
      { day: 6, title: 'Dharamshala Exploration', description: 'Visit Bhagsunag Temple & Waterfall, Dharamshala Cricket Stadium, Norbulingka Institute, and St. John Church.' },
      { day: 7, title: 'Departure', description: 'Morning at leisure. Drive to Pathankot/Kangra airport for departure.' },
    ],
  },
  {
    slug: 'dharamshala-mcleod-4n5d',
    name: 'Dharamshala & McLeod Ganj',
    description: 'Experience the serene beauty of Dharamshala and McLeod Ganj with Tibetan culture, stunning mountain views, and peaceful monasteries. A perfect mountain retreat.',
    price: 12999,
    duration: '4N5D',
    category: 'hill-station',
    image: '/images/destinations/dharamshala.png',
    destinationSlug: 'dharamshala',
    highlights: ['Dalai Lama Temple Complex', 'Triund Trek', 'Bhagsunag Waterfall', 'Tibetan culture & monasteries', 'Cricket stadium tour', 'Norbulingka Institute'],
    included: ['4 nights accommodation', 'Daily breakfast & dinner', 'Triund trek guide', 'All transfers by non-AC vehicle', 'Sightseeing as per itinerary', 'Monastery entry fees', 'English-speaking guide', 'All applicable taxes'],
    itinerary: [
      { day: 1, title: 'Arrival in Dharamshala', description: 'Arrive at Pathankot/Kangra. Drive to Dharamshala. Evening visit to Dalai Lama Temple Complex and McLeod Ganj market.' },
      { day: 2, title: 'McLeod Ganj & Tibetan Culture', description: 'Visit Norbulingka Institute, Gyuto Monastery, and St. John in the Wilderness. Afternoon Tibetan cooking class.' },
      { day: 3, title: 'Triund Trek', description: 'Moderate trek to Triund (9 km). Stunning views of Dhauladhar range. Packed lunch at the top. Return by evening.' },
      { day: 4, title: 'Dharamshala Sightseeing', description: 'Visit Dharamshala Cricket Stadium, Bhagsunag Temple & Waterfall, and Kangra Fort. Evening at leisure.' },
      { day: 5, title: 'Departure', description: 'Morning at leisure. Transfer to Pathankot/Kangra for departure.' },
    ],
  },
  {
    slug: 'dubai-luxury-4n5d',
    name: 'Dubai Luxury Experience',
    description: 'Experience the glitz and glamour of Dubai with Burj Khalifa, desert safari, dhow cruise, and world-class shopping. A luxurious getaway in the city of gold.',
    price: 44999,
    duration: '4N5D',
    category: 'tourism',
    image: '/images/destinations/dubai.png',
    destinationSlug: 'dubai',
    highlights: ['Burj Khalifa At The Top', 'Desert safari with BBQ dinner', 'Dhow cruise on Dubai Creek', 'Dubai Mall & Aquarium', 'Dubai Frame visit', 'Gold Souk shopping'],
    included: ['4 nights in 5-star hotel', 'Daily breakfast', 'Burj Khalifa entry (124th floor)', 'Desert safari with BBQ dinner & belly dance', 'Dhow cruise with dinner', 'Dubai Mall Aquarium entry', 'All transfers by AC vehicle', 'Visa assistance'],
    itinerary: [
      { day: 1, title: 'Arrival in Dubai', description: 'Arrive at Dubai airport. Transfer to 5-star hotel. Evening Dhow Cruise on Dubai Creek with dinner and entertainment.' },
      { day: 2, title: 'Dubai City Tour & Burj Khalifa', description: 'Morning Dubai city tour - Jumeirah Mosque, Dubai Frame, Palm Jumeirah. Afternoon Burj Khalifa visit. Evening Dubai Fountain Show.' },
      { day: 3, title: 'Desert Safari', description: 'Morning at Dubai Mall & Aquarium. Afternoon at leisure. Evening desert safari with dune bashing, camel ride, BBQ dinner, and belly dance.' },
      { day: 4, title: 'Shopping & Leisure', description: 'Morning Gold Souk and Spice Souk visit. Afternoon at leisure for shopping at Mall of Emirates or Ibn Battuta. Evening at leisure.' },
      { day: 5, title: 'Departure', description: 'Morning at leisure. Check-out and transfer to Dubai airport.' },
    ],
  },
  {
    slug: 'dubai-honeymoon-5n6d',
    name: 'Dubai Honeymoon Special',
    description: 'A romantic honeymoon in Dubai with luxury stays, private desert dinner, couples spa, and unforgettable skyline views. The perfect blend of romance and luxury.',
    price: 59999,
    duration: '5N6D',
    category: 'honeymoon',
    image: '/images/packages/honeymoon.png',
    destinationSlug: 'dubai',
    highlights: ['Luxury suite with Burj Khalifa view', 'Private desert dinner for two', 'Couples spa at premium resort', 'Yacht cruise at sunset', 'Fine dining experience', 'Beach club access'],
    included: ['5 nights in luxury 5-star hotel', 'Daily breakfast', 'Private desert dinner arrangement', 'Couples spa session', 'Yacht cruise with drinks', 'Burj Khalifa VIP entry', 'All transfers by luxury vehicle', 'Visa assistance', 'Honeymoon amenities'],
    itinerary: [
      { day: 1, title: 'Welcome to Dubai', description: 'Arrive at Dubai. Private transfer to luxury hotel. Room with Burj Khalifa view. Evening romantic dinner at hotel.' },
      { day: 2, title: 'Dubai Romance & Burj Khalifa', description: 'Morning Burj Khalifa VIP experience. Afternoon couples spa. Evening dinner at Atmosphere (Level 122).' },
      { day: 3, title: 'Desert Romance', description: 'Morning at leisure. Afternoon private desert setup with dinner under the stars, campfire, and stargazing.' },
      { day: 4, title: 'Yacht & Beach', description: 'Morning beach club access. Afternoon private yacht cruise along Dubai Marina at sunset. Evening at leisure.' },
      { day: 5, title: 'Shopping & Farewell', description: 'Morning shopping at Dubai Mall. Afternoon at leisure. Farewell dinner at Pierchic (overwater restaurant).' },
      { day: 6, title: 'Departure', description: 'Morning at leisure. Private transfer to airport.' },
    ],
  },
  {
    slug: 'maldives-paradise-4n5d',
    name: 'Maldives Paradise Escape',
    description: 'The ultimate tropical paradise experience with overwater villa, crystal-clear lagoon, underwater restaurant, and sunset dolphin cruise. A once-in-a-lifetime luxury escape.',
    price: 79999,
    duration: '4N5D',
    category: 'honeymoon',
    image: '/images/destinations/maldives.png',
    destinationSlug: 'maldives',
    highlights: ['Overwater villa with glass floor', 'Underwater restaurant dining', 'Sunset dolphin cruise', 'Couples snorkeling excursion', 'Private beach dinner', 'Spa over water treatment'],
    included: ['4 nights in overwater villa', 'All meals (breakfast, lunch, dinner)', 'Speedboat transfers', 'Sunset dolphin cruise', 'Snorkeling equipment & guided excursion', 'Private beach dinner for two', 'Couples spa treatment', 'Welcome champagne & fruit basket'],
    itinerary: [
      { day: 1, title: 'Welcome to Paradise', description: 'Arrive at Malé. Speedboat transfer to resort. Welcome champagne. Check-in to overwater villa. Evening at leisure.' },
      { day: 2, title: 'Ocean Adventures', description: 'Morning guided snorkeling excursion to coral reef. Afternoon overwater spa treatment. Evening sunset dolphin cruise.' },
      { day: 3, title: 'Luxury & Indulgence', description: 'Morning at leisure. Afternoon underwater restaurant dining experience. Evening private beach dinner under the stars.' },
      { day: 4, title: 'Island Exploration', description: 'Morning local island visit. Afternoon water sports - kayaking, paddle boarding. Farewell dinner at resort.' },
      { day: 5, title: 'Departure', description: 'Morning at leisure. Speedboat transfer to Malé airport.' },
    ],
  },
  {
    slug: 'thailand-explorer-5n6d',
    name: 'Thailand Explorer',
    description: 'Explore the best of Thailand from Bangkok\'s vibrant streets to Phuket\'s stunning beaches. Temples, street food, island hopping, and nightlife — Thailand has it all!',
    price: 32999,
    duration: '5N6D',
    category: 'tourism',
    image: '/images/destinations/thailand.png',
    destinationSlug: 'thailand',
    highlights: ['Grand Palace & Emerald Buddha', 'Phi Phi Island hopping', 'Street food tour in Bangkok', 'Phuket beach relaxation', 'Floating market visit', 'Thai massage & spa'],
    included: ['5 nights accommodation (3-star+ hotels)', 'Daily breakfast', 'Phi Phi Island tour by speedboat', 'Bangkok city & temple tour', 'Street food tour', 'All transfers by AC vehicle', 'English-speaking guide', 'All applicable taxes'],
    itinerary: [
      { day: 1, title: 'Arrival in Bangkok', description: 'Arrive at Suvarnabhumi Airport. Transfer to hotel. Evening street food tour on Yaowarat Road (Chinatown).' },
      { day: 2, title: 'Bangkok Temples & Markets', description: 'Morning Grand Palace, Emerald Buddha, and Wat Pho. Afternoon floating market visit. Evening Asiatique night market.' },
      { day: 3, title: 'Bangkok to Phuket', description: 'Fly to Phuket. Check-in to hotel. Afternoon Patong Beach. Evening Bangla Road nightlife experience.' },
      { day: 4, title: 'Phi Phi Islands', description: 'Full day Phi Phi Islands tour by speedboat. Maya Bay, Pileh Lagoon, Monkey Beach, and snorkeling. Lunch on the island.' },
      { day: 5, title: 'Phuket at Leisure', description: 'Day at leisure. Optional: James Bond Island tour, Thai cooking class, or spa and wellness day.' },
      { day: 6, title: 'Departure', description: 'Morning at leisure. Transfer to Phuket airport for departure.' },
    ],
  },
  {
    slug: 'singapore-delight-4n5d',
    name: 'Singapore Delight',
    description: 'Experience the futuristic city of Singapore with Gardens by the Bay, Universal Studios, Sentosa Island, and the iconic Marina Bay Sands. A perfect family destination.',
    price: 38999,
    duration: '4N5D',
    category: 'tourism',
    image: '/images/destinations/singapore.png',
    destinationSlug: 'singapore',
    highlights: ['Gardens by the Bay light show', 'Universal Studios Singapore', 'Sentosa Island attractions', 'Marina Bay Sands SkyPark', 'Night Safari experience', 'Chinatown & Little India'],
    included: ['4 nights in 4-star hotel', 'Daily breakfast', 'Universal Studios entry tickets', 'Gardens by the Bay entry', 'Night Safari tour', 'Sentosa Island tour', 'All transfers by AC vehicle', 'English-speaking guide'],
    itinerary: [
      { day: 1, title: 'Arrival in Singapore', description: 'Arrive at Changi Airport. Transfer to hotel. Evening Gardens by the Bay light show and Marina Bay Sands area.' },
      { day: 2, title: 'Universal Studios', description: 'Full day at Universal Studios Singapore. Thrilling rides, shows, and character meet-and-greets.' },
      { day: 3, title: 'Sentosa Island', description: 'Full day Sentosa Island - S.E.A. Aquarium, Adventure Cove Waterpark, and Skyline Luge. Evening Wings of Time show.' },
      { day: 4, title: 'City Tour & Night Safari', description: 'Morning city tour - Merlion Park, Chinatown, Little India. Afternoon at leisure. Evening Night Safari.' },
      { day: 5, title: 'Departure', description: 'Morning shopping at Orchard Road. Transfer to Changi Airport for departure.' },
    ],
  },
  {
    slug: 'malaysia-singapore-6n7d',
    name: 'Malaysia & Singapore Combo',
    description: 'The best of two amazing countries! Explore Kuala Lumpur\'s Petronas Towers, Genting Highlands, and then Singapore\'s iconic attractions. Double the fun!',
    price: 42999,
    duration: '6N7D',
    category: 'tourism',
    image: '/images/destinations/malaysia.png',
    destinationSlug: 'malaysia',
    highlights: ['Petronas Twin Towers Sky Bridge', 'Genting Highlands theme park', 'Batu Caves visit', 'Singapore Gardens by the Bay', 'Universal Studios Singapore', 'Chinatown food trail'],
    included: ['6 nights accommodation (3-star+ hotels)', 'Daily breakfast', 'Petronas Towers entry', 'Genting Highlands cable car & park', 'Universal Studios Singapore entry', 'Gardens by the Bay entry', 'All transfers by AC vehicle', 'Kuala Lumpur-Singapore flight'],
    itinerary: [
      { day: 1, title: 'Arrival in Kuala Lumpur', description: 'Arrive at KLIA. Transfer to hotel. Evening Petronas Twin Towers visit and KLCC Park fountain show.' },
      { day: 2, title: 'KL City Tour', description: 'Morning city tour - Independence Square, National Mosque, Istana Negara, and Batu Caves. Evening at Bukit Bintang.' },
      { day: 3, title: 'Genting Highlands', description: 'Full day Genting Highlands. Cable car ride, theme park, and casino. Cool mountain escape from the city.' },
      { day: 4, title: 'KL to Singapore', description: 'Fly to Singapore. Check-in to hotel. Evening Clarke Quay riverside dining and nightlife.' },
      { day: 5, title: 'Singapore - Universal Studios', description: 'Full day Universal Studios Singapore. Movie-themed rides, shows, and attractions.' },
      { day: 6, title: 'Singapore Sightseeing', description: 'Gardens by the Bay, Sentosa Island, and Chinatown food trail. Evening Marina Bay Sands area.' },
      { day: 7, title: 'Departure', description: 'Morning at Orchard Road for shopping. Transfer to Changi Airport for departure.' },
    ],
  },
  {
    slug: 'bali-romantic-5n6d',
    name: 'Bali Romantic Getaway',
    description: 'A romantic escape to Bali with private pool villas, sunset temple visits, rice terrace walks, and couples spa. The Island of the Gods sets the stage for love.',
    price: 45999,
    duration: '5N6D',
    category: 'honeymoon',
    image: '/images/destinations/bali.png',
    destinationSlug: 'bali',
    highlights: ['Private pool villa stay', 'Uluwatu Temple sunset & Kecak dance', 'Tegallalang Rice Terrace walk', 'Couples Balinese spa', 'Mount Batur sunrise trek', 'Seminyak beach club day'],
    included: ['5 nights in private pool villa', 'Daily breakfast', 'Uluwatu Temple tour with Kecak dance', 'Tegallalang Rice Terrace & Tirta Empul tour', 'Couples spa package', 'All transfers by AC vehicle', 'English-speaking guide', 'Welcome flower arrangement'],
    itinerary: [
      { day: 1, title: 'Welcome to Bali', description: 'Arrive at Ngurah Rai Airport. Welcome with flower garlands. Transfer to private pool villa in Seminyak.' },
      { day: 2, title: 'Ubud Cultural Day', description: 'Drive to Ubud. Visit Tegallalang Rice Terraces, Tirta Empul water temple, and Ubud Monkey Forest. Afternoon couples spa.' },
      { day: 3, title: 'Temples & Sunsets', description: 'Morning visit to Tanah Lot sea temple. Afternoon Uluwatu Temple. Sunset Kecak dance performance. Seafood dinner at Jimbaran Bay.' },
      { day: 4, title: 'Adventure Day', description: 'Early morning Mount Batur sunrise trek (optional). Afternoon Seminyak beach club relaxation and sunset cocktails.' },
      { day: 5, title: 'Bali at Leisure', description: 'Full day at leisure. Optional: cooking class, snorkeling, or Nusa Penida day trip. Farewell dinner.' },
      { day: 6, title: 'Departure', description: 'Morning at leisure. Transfer to airport.' },
    ],
  },
  {
    slug: 'srilanka-cultural-5n6d',
    name: 'Sri Lanka Cultural Tour',
    description: 'Discover the Pearl of the Indian Ocean with ancient ruins, lush tea plantations, wildlife safaris, and golden beaches. Sri Lanka offers incredible diversity in a compact island.',
    price: 29999,
    duration: '5N6D',
    category: 'tourism',
    image: '/images/destinations/srilanka.png',
    destinationSlug: 'srilanka',
    highlights: ['Sigiriya Rock Fortress climb', 'Yala National Park safari', 'Nuwara Eliya tea gardens', 'Kandy Temple of the Tooth', 'Galle Fort heritage walk', 'Bentota beach relaxation'],
    included: ['5 nights accommodation', 'Daily breakfast & dinner', 'Sigiriya entry ticket', 'Yala Safari jeep tour', 'Tea plantation tour', 'All transfers by AC vehicle', 'English-speaking guide', 'All applicable taxes'],
    itinerary: [
      { day: 1, title: 'Arrival in Colombo', description: 'Arrive at Bandaranaike Airport. Transfer to hotel. Evening Colombo city tour - Galle Face, Independence Square.' },
      { day: 2, title: 'Colombo to Sigiriya', description: 'Drive to Sigiriya (4 hrs). Afternoon climb Sigiriya Rock Fortress - UNESCO World Heritage Site with stunning frescoes.' },
      { day: 3, title: 'Sigiriya to Kandy', description: 'Morning Dambulla Cave Temple visit. Drive to Kandy. Visit Temple of the Tooth Relic. Evening Kandyan dance show.' },
      { day: 4, title: 'Kandy to Nuwara Eliya', description: 'Morning Peradeniya Botanical Gardens. Drive to Nuwara Eliya via scenic tea plantations. Tea factory tour and tasting.' },
      { day: 5, title: 'Nuwara Eliya to Bentota', description: 'Morning at Nuwara Eliya (Little England). Drive to Bentota. Afternoon beach relaxation. Optional water sports.' },
      { day: 6, title: 'Departure', description: 'Morning visit to Galle Fort. Drive to Colombo airport for departure.' },
    ],
  },
  {
    slug: 'vietnam-discovery-5n6d',
    name: 'Vietnam Discovery',
    description: 'From the emerald waters of Ha Long Bay to the lantern-lit streets of Hoi An, Vietnam captivates with its beauty, history, and incredible cuisine. An affordable yet unforgettable experience.',
    price: 27999,
    duration: '5N6D',
    category: 'tourism',
    image: '/images/destinations/vietnam.png',
    destinationSlug: 'vietnam',
    highlights: ['Ha Long Bay overnight cruise', 'Hoi An lantern-lit old town', 'Ho Chi Minh War Museum', 'Mekong Delta boat tour', 'Vietnamese cooking class', 'Cu Chi Tunnels visit'],
    included: ['5 nights accommodation (3-star+ hotels)', 'Daily breakfast', 'Ha Long Bay overnight cruise with meals', 'Mekong Delta day tour', 'Cu Chi Tunnels half-day tour', 'All transfers by AC vehicle', 'English-speaking guide', 'All applicable taxes'],
    itinerary: [
      { day: 1, title: 'Arrival in Hanoi', description: 'Arrive at Noi Bai Airport. Transfer to hotel. Evening walking tour of Old Quarter and street food trail.' },
      { day: 2, title: 'Ha Long Bay Cruise', description: 'Drive to Ha Long Bay. Board overnight cruise. Kayaking, cave visit, and sunset on deck. Dinner onboard.' },
      { day: 3, title: 'Ha Long to Hanoi', description: 'Morning Tai Chi on sundeck. Continue cruising. Afternoon return to Hanoi. Water puppet show in evening.' },
      { day: 4, title: 'Fly to Ho Chi Minh City', description: 'Fly to HCMC. Afternoon Cu Chi Tunnels tour. Evening at Bui Vien walking street.' },
      { day: 5, title: 'Mekong Delta', description: 'Full day Mekong Delta tour - boat rides, floating markets, fruit orchards, and coconut candy workshop.' },
      { day: 6, title: 'Departure', description: 'Morning War Remnants Museum and Ben Thanh Market. Transfer to airport for departure.' },
    ],
  },
  {
    slug: 'nepal-himalayan-5n6d',
    name: 'Nepal Himalayan Adventure',
    description: 'Experience the majesty of the Himalayas in Nepal with temple visits in Kathmandu, lakeside serenity in Pokhara, and stunning mountain views. An affordable yet epic adventure.',
    price: 21999,
    duration: '5N6D',
    category: 'adventure',
    image: '/images/destinations/nepal.png',
    destinationSlug: 'nepal',
    highlights: ['Sarangkot sunrise & Himalayan views', 'Pashupatinath Temple visit', 'Pokhara lakeside relaxation', 'Boudhanath Stupa', 'Davis Falls & Gupteshwor Cave', 'Mountain flight (optional)'],
    included: ['5 nights accommodation', 'Daily breakfast & dinner', 'All sightseeing as per itinerary', 'All transfers by AC vehicle', 'Sarangkot sunrise trip', 'English-speaking guide', 'Trekking permit assistance', 'All applicable taxes'],
    itinerary: [
      { day: 1, title: 'Arrival in Kathmandu', description: 'Arrive at Tribhuvan Airport. Transfer to hotel. Evening visit to Thamel market for shopping and local food.' },
      { day: 2, title: 'Kathmandu Heritage Tour', description: 'Visit Pashupatinath Temple, Boudhanath Stupa, Swayambhunath (Monkey Temple), and Kathmandu Durbar Square.' },
      { day: 3, title: 'Kathmandu to Pokhara', description: 'Drive to Pokhara (6 hrs) or fly (25 min). Afternoon lakeside stroll at Phewa Lake. Boating at sunset.' },
      { day: 4, title: 'Pokhara Adventure Day', description: 'Early morning Sarangkot sunrise with Annapurna range views. Visit Davis Falls, Gupteshwor Cave, and World Peace Pagoda.' },
      { day: 5, title: 'Pokhara at Leisure', description: 'Day at leisure. Optional: paragliding, zip-line, or short trek to Australian Camp. Farewell dinner.' },
      { day: 6, title: 'Departure', description: 'Drive/fly back to Kathmandu. Transfer to airport for departure.' },
    ],
  },
];

// ============================================
// HOTELS DATA
// ============================================

const featuredHotelSlugs = ['taj-malabar-kerala', 'lalit-grand-kashmir', 'burj-al-arab-dubai', 'soneva-fushi-maldives', 'marina-bay-sands'];

interface HotelInput {
  slug: string;
  name: string;
  description: string;
  pricePerNight: number;
  stars: number;
  category: string;
  image: string;
  destinationSlug: string;
  amenities: string[];
}

const hotelsData: HotelInput[] = [
  {
    slug: 'taj-malabar-kerala',
    name: 'Taj Malabar Resort & Spa',
    description: 'A luxury waterfront resort on Willingdon Island offering world-class amenities, Ayurvedic spa, and stunning views of the Kochi harbor.',
    pricePerNight: 12000,
    stars: 5,
    category: 'luxury',
    image: '/images/hotels/luxury-resort.png',
    destinationSlug: 'kerala',
    amenities: ['Free Wi-Fi', 'Ayurvedic Spa', 'Infinity Pool', 'Multi-cuisine Restaurant', 'Harbor View Rooms', 'Fitness Center', 'Yoga Pavilion', 'Jiva Spa', 'Concierge Service', 'Airport Transfer'],
  },
  {
    slug: 'coconut-lagoon-kerala',
    name: 'Coconut Lagoon Resort',
    description: 'A heritage resort set on the banks of Vembanad Lake, offering authentic Kerala experiences with houseboat stays and traditional cuisine.',
    pricePerNight: 8000,
    stars: 4,
    category: 'resort',
    image: '/images/hotels/luxury-resort.png',
    destinationSlug: 'kerala',
    amenities: ['Free Wi-Fi', 'Lake View Cottages', 'Swimming Pool', 'Kerala Cuisine Restaurant', 'Ayurvedic Center', 'Heritage Bungalow Rooms', 'Boat Rides', 'Cultural Performances'],
  },
  {
    slug: 'lalit-grand-kashmir',
    name: 'The Lalit Grand Palace',
    description: 'A grand palace hotel overlooking Dal Lake with magnificent Mughal-inspired architecture, lush gardens, and world-class hospitality.',
    pricePerNight: 15000,
    stars: 5,
    category: 'luxury',
    image: '/images/hotels/luxury-resort.png',
    destinationSlug: 'kashmir',
    amenities: ['Free Wi-Fi', 'Dal Lake View', 'Palace Heritage Rooms', 'Mughal Garden', 'Spa & Wellness', 'Indoor Heated Pool', 'Multi-cuisine Restaurant', 'Royal Dining Experience', 'Golf Course', 'Shikara Ride'],
  },
  {
    slug: 'houseboat-kashmir',
    name: 'Houseboat Heavenly Kashmir',
    description: 'Experience authentic Kashmiri hospitality on a luxury houseboat on Dal Lake with carved walnut interiors and traditional Kashmiri cuisine.',
    pricePerNight: 6500,
    stars: 4,
    category: 'boutique',
    image: '/images/hotels/beach-hotel.png',
    destinationSlug: 'kashmir',
    amenities: ['Walnut Wood Interiors', 'Lake Views', 'Kashmiri Cuisine', 'Shikara Service', 'Room Heating', 'Personal Attendant', 'Traditional Kahwa Service', 'Cultural Evening'],
  },
  {
    slug: 'taj-holiday-goa',
    name: 'Taj Holiday Village Goa',
    description: 'A charming Portuguese-style resort on Sinquerim Beach with lush tropical gardens, multiple pools, and direct beach access.',
    pricePerNight: 10000,
    stars: 5,
    category: 'resort',
    image: '/images/hotels/beach-hotel.png',
    destinationSlug: 'goa',
    amenities: ['Free Wi-Fi', 'Direct Beach Access', '3 Swimming Pools', 'Portuguese Architecture', 'Seafood Restaurant', 'Spa & Wellness', 'Water Sports', 'Beach Bar', 'Kids Club'],
  },
  {
    slug: 'windamere-darjeeling',
    name: 'Windamere Hotel Darjeeling',
    description: 'A colonial heritage hotel on Observatory Hill offering old-world charm, roaring fireplaces, and panoramic views of the Himalayas.',
    pricePerNight: 7000,
    stars: 4,
    category: 'boutique',
    image: '/images/hotels/mountain-resort.png',
    destinationSlug: 'darjeeling',
    amenities: ['Colonial Heritage Rooms', 'Fireplace in Rooms', 'Himalayan Views', 'Traditional Afternoon Tea', 'Heritage Dining', 'Garden Lounge', 'Library', 'Toy Train Proximity'],
  },
  {
    slug: 'wildflower-shimla',
    name: 'Wildflower Hall Shimla',
    description: 'A luxury Oberoi resort at 8,250 feet offering panoramic Himalayan views, world-class spa, and colonial elegance in the lap of nature.',
    pricePerNight: 18000,
    stars: 5,
    category: 'luxury',
    image: '/images/hotels/mountain-resort.png',
    destinationSlug: 'himachal',
    amenities: ['Free Wi-Fi', 'Panoramic Himalayan Views', 'Oberoi Spa', 'Heated Indoor Pool', 'Fine Dining', 'Whisky Bar', 'Trekking Trails', 'Colonial Heritage', 'Butler Service', 'Helipad'],
  },
  {
    slug: 'welcomhotel-andaman',
    name: 'Welcomhotel By ITC Bay Island',
    description: 'A beautiful beachfront resort in Port Blair offering stunning ocean views, water sports, and easy access to the best Andaman attractions.',
    pricePerNight: 9000,
    stars: 4,
    category: 'resort',
    image: '/images/hotels/beach-hotel.png',
    destinationSlug: 'andaman',
    amenities: ['Ocean View Rooms', 'Beach Access', 'Swimming Pool', 'Water Sports Center', 'Seafood Restaurant', 'Spa Services', 'Island Tours Desk', 'Diving Center'],
  },
  {
    slug: 'taj-palace-delhi',
    name: 'The Taj Palace Delhi',
    description: 'An iconic luxury hotel in the heart of New Delhi offering world-class dining, spa, and impeccable service near major attractions.',
    pricePerNight: 14000,
    stars: 5,
    category: 'luxury',
    image: '/images/hotels/luxury-resort.png',
    destinationSlug: 'delhi-golden-triangle',
    amenities: ['Free Wi-Fi', 'Jiva Spa', 'Multiple Restaurants', 'Grand Ballroom', 'Fitness Center', 'Concierge Service', 'Business Center', 'Airport Transfer', 'Rooftop Lounge'],
  },
  {
    slug: 'leela-manali',
    name: 'The Leela Palace Manali',
    description: 'A riverside luxury resort in Manali with stunning mountain views, heated pools, and adventure sports facilities.',
    pricePerNight: 13000,
    stars: 5,
    category: 'luxury',
    image: '/images/hotels/mountain-resort.png',
    destinationSlug: 'manali',
    amenities: ['Free Wi-Fi', 'Mountain View Suites', 'Heated Indoor Pool', 'Spa & Wellness', 'Adventure Sports Desk', 'Riverside Dining', 'Bonfire Area', 'Yoga Sessions', 'Ski Storage'],
  },
  {
    slug: 'burj-al-arab-dubai',
    name: 'Burj Al Arab Dubai',
    description: 'The world\'s most luxurious hotel, shaped like a sail on its own island. Offers unparalleled opulence, 9 restaurants, and a private beach.',
    pricePerNight: 65000,
    stars: 5,
    category: 'luxury',
    image: '/images/hotels/luxury-resort.png',
    destinationSlug: 'dubai',
    amenities: ['Private Beach', '9 World-Class Restaurants', '24K Gold Interiors', 'Butler Service', 'Assawan Spa', 'Infinity Pool', 'Helipad', 'Rolls-Royce Chauffeur', 'Private Check-in', 'Gold iPad Concierge'],
  },
  {
    slug: 'atlantis-dubai',
    name: 'Atlantis The Palm Dubai',
    description: 'An iconic resort on Palm Jumeirah with Aquaventure Waterpark, private beach, underwater aquarium, and 23 restaurants.',
    pricePerNight: 25000,
    stars: 5,
    category: 'resort',
    image: '/images/hotels/beach-hotel.png',
    destinationSlug: 'dubai',
    amenities: ['Aquaventure Waterpark', 'Private Beach', 'Underwater Aquarium', '23 Restaurants & Bars', 'Shark Safari', 'Dolphin Bay', 'Spa & Fitness', 'Kids Club', 'Nobu Restaurant'],
  },
  {
    slug: 'soneva-fushi-maldives',
    name: 'Soneva Fushi Maldives',
    description: 'A barefoot luxury resort with private villa, personal butler, world-class snorkeling, and an observatory for stargazing.',
    pricePerNight: 85000,
    stars: 5,
    category: 'luxury',
    image: '/images/hotels/beach-hotel.png',
    destinationSlug: 'maldives',
    amenities: ['Private Villa with Pool', 'Personal Butler (Mr./Ms. Friday)', 'Observatory & Stargazing', 'World-Class Snorkeling', 'Overwater Spa', 'Organic Gardens', 'Cinema Paradiso', 'Glass Floor Panels', 'Barefoot Philosophy'],
  },
  {
    slug: 'marina-bay-sands',
    name: 'Marina Bay Sands Singapore',
    description: 'The iconic three-tower hotel with the world-famous infinity pool on the 57th floor, offering breathtaking views of the Singapore skyline.',
    pricePerNight: 35000,
    stars: 5,
    category: 'luxury',
    image: '/images/hotels/luxury-resort.png',
    destinationSlug: 'singapore',
    amenities: ['Infinity Pool (57th Floor)', 'SkyPark Observation Deck', 'Banyan Tree Spa', 'ArtScience Museum', 'Casino', 'Celebrity Chef Restaurants', 'The Shoppes Mall', 'Fitness Center', 'Smart Room Technology'],
  },
  {
    slug: 'mandarin-oriental-bangkok',
    name: 'Mandarin Oriental Bangkok',
    description: 'A legendary riverside hotel offering timeless elegance, world-class dining, and authentic Thai experiences in the heart of Bangkok.',
    pricePerNight: 20000,
    stars: 5,
    category: 'luxury',
    image: '/images/hotels/luxury-resort.png',
    destinationSlug: 'thailand',
    amenities: ['Chao Phraya River Views', 'Award-Winning Restaurants', 'Thai Cooking Class', 'Mandarin Spa', 'Riverside Pool', 'Cultural Experiences', 'Butler Service', 'Jim Thompson Suite'],
  },
  {
    slug: 'como-uma-bali',
    name: 'COMO Uma Canggu Bali',
    description: 'A chic beachfront resort in Bali with surf school, holistic wellness programs, and stunning ocean views from every room.',
    pricePerNight: 18000,
    stars: 5,
    category: 'boutique',
    image: '/images/hotels/beach-hotel.png',
    destinationSlug: 'bali',
    amenities: ['Beachfront Location', 'Surf School', 'COMO Shambhala Wellness', 'Ocean View Rooms', 'Yoga Pavilion', 'Organic Restaurant', 'Spa Treatments', 'Bike Rental'],
  },
  {
    slug: 'shangri-la-kl',
    name: 'Shangri-La Kuala Lumpur',
    description: 'A premier luxury hotel with stunning Petronas Twin Towers views, award-winning restaurants, and a serene spa in the heart of KL.',
    pricePerNight: 12000,
    stars: 5,
    category: 'luxury',
    image: '/images/hotels/luxury-resort.png',
    destinationSlug: 'malaysia',
    amenities: ['Petronas Towers View', 'Chi The Spa', 'Multiple Restaurants', 'Infinity Pool', 'Kids Club', 'Fitness Center', 'Lobby Lounge', 'Executive Lounge', 'Limousine Service'],
  },
];

// ============================================
// FLIGHT DEALS DATA
// ============================================

const flightsData = [
  { from: 'Delhi', to: 'Dubai', airline: 'Emirates', price: 15999, originalPrice: 22000, type: 'round-trip', image: '/images/flights-hero.png', description: 'Direct flight to Dubai with Emirates. Includes meals, entertainment, and 30kg baggage.', featured: true },
  { from: 'Mumbai', to: 'Maldives', airline: 'IndiGo', price: 18999, originalPrice: 25000, type: 'round-trip', image: '/images/flights-hero.png', description: 'Connecting flight to Malé via IndiGo. Great value for a paradise escape.', featured: true },
  { from: 'Delhi', to: 'Bangkok', airline: 'Thai Airways', price: 16999, originalPrice: 23000, type: 'round-trip', image: '/images/flights-hero.png', description: 'Direct flight to Bangkok with Thai Airways. Full service with meals and entertainment.', featured: true },
  { from: 'Mumbai', to: 'Singapore', airline: 'Singapore Airlines', price: 21999, originalPrice: 29000, type: 'round-trip', image: '/images/flights-hero.png', description: 'Premium direct flight to Singapore. World-class service and comfort.', featured: true },
  { from: 'Delhi', to: 'Kathmandu', airline: 'IndiGo', price: 7999, originalPrice: 11000, type: 'round-trip', image: '/images/flights-hero.png', description: 'Quick direct flight to Kathmandu. Perfect for a Himalayan adventure.', featured: false },
  { from: 'Chennai', to: 'Colombo', airline: 'SriLankan Airlines', price: 9999, originalPrice: 14000, type: 'round-trip', image: '/images/flights-hero.png', description: 'Short direct flight to Colombo. Start your Sri Lankan adventure quickly.', featured: false },
  { from: 'Delhi', to: 'Srinagar', airline: 'Air India', price: 5999, originalPrice: 8500, type: 'round-trip', image: '/images/flights-hero.png', description: 'Direct flight to Srinagar. Gateway to the paradise of Kashmir.', featured: true },
  { from: 'Mumbai', to: 'Goa', airline: 'Vistara', price: 4499, originalPrice: 6500, type: 'round-trip', image: '/images/flights-hero.png', description: 'Quick direct flight to Goa. Sun, sand, and fun await!', featured: true },
  { from: 'Kolkata', to: 'Port Blair', airline: 'Air India', price: 8999, originalPrice: 12000, type: 'round-trip', image: '/images/flights-hero.png', description: 'Direct flight to Port Blair. Your Andaman island adventure starts here.', featured: false },
  { from: 'Delhi', to: 'Kuala Lumpur', airline: 'Malaysia Airlines', price: 18999, originalPrice: 25000, type: 'round-trip', image: '/images/flights-hero.png', description: 'Direct flight to Kuala Lumpur with full service and great comfort.', featured: false },
  { from: 'Mumbai', to: 'Bali', airline: 'Garuda Indonesia', price: 24999, originalPrice: 32000, type: 'round-trip', image: '/images/flights-hero.png', description: 'Connecting flight to Denpasar, Bali. Premium service included.', featured: false },
  { from: 'Delhi', to: 'Ho Chi Minh', airline: 'Vietnam Airlines', price: 19999, originalPrice: 26000, type: 'round-trip', image: '/images/flights-hero.png', description: 'Direct flight to Ho Chi Minh City. Discover the charm of Vietnam.', featured: false },
];

// ============================================
// REVIEWS DATA
// ============================================

const reviewsData = [
  { name: 'Rajesh Sharma', avatar: 'RS', location: 'Delhi, India', destinationSlug: 'kerala', tripName: 'Kerala Honeymoon Special', packageSlug: 'kerala-honeymoon-4n5d', rating: 5, text: 'Absolutely magical experience! The houseboat in Alleppey was the highlight of our honeymoon. The team arranged a candlelight dinner on the boat which was beyond our expectations. Highly recommended for couples!', date: '2 weeks ago', verified: true, category: 'Honeymoon', photos: 8 },
  { name: 'Priya Menon', avatar: 'PM', location: 'Mumbai, India', destinationSlug: 'maldives', tripName: 'Maldives Paradise Escape', packageSlug: 'maldives-paradise-4n5d', rating: 5, text: 'From the moment we landed to the farewell, everything was seamless. The overwater villa was breathtaking. Wayfare handled all the transfers and activities perfectly. Worth every rupee!', date: '1 month ago', verified: true, category: 'Luxury', photos: 12 },
  { name: 'Amit Patel', avatar: 'AP', location: 'Ahmedabad, India', destinationSlug: 'dubai', tripName: 'Dubai Luxury Experience', packageSlug: 'dubai-luxury-4n5d', rating: 4, text: 'Great value for money package! The desert safari and Burj Khalifa visit were unforgettable. The hotel was premium and well-located. Only suggestion: add more shopping time at Dubai Mall.', date: '3 weeks ago', verified: true, category: 'Luxury', photos: 6 },
  { name: 'Sneha Reddy', avatar: 'SR', location: 'Hyderabad, India', destinationSlug: 'kashmir', tripName: 'Kashmir Valley Explorer', packageSlug: 'kashmir-valley-5n6d', rating: 5, text: 'Kashmir is truly paradise on earth! The shikara ride on Dal Lake and the gondola ride in Gulmarg were surreal. Our guide was extremely knowledgeable. Would love to visit again in winter!', date: '1 week ago', verified: true, category: 'Adventure', photos: 15 },
  { name: 'Vikram Joshi', avatar: 'VJ', location: 'Pune, India', destinationSlug: 'goa', tripName: 'Goa Beach Holiday', packageSlug: 'goa-beach-4n5d', rating: 4, text: 'Perfect family vacation! Kids loved the beach activities and the spice plantation tour. The resort had great amenities. The Baga beach party was a bonus. Good for a quick getaway!', date: '2 months ago', verified: true, category: 'Beach', photos: 9 },
  { name: 'Ananya Gupta', avatar: 'AG', location: 'Bangalore, India', destinationSlug: 'thailand', tripName: 'Thailand Explorer', packageSlug: 'thailand-explorer-5n6d', rating: 5, text: 'Thailand was amazing! From the temples in Bangkok to the beaches in Phuket, every day was an adventure. The street food tour was a fantastic addition. Wayfare planned everything flawlessly.', date: '3 weeks ago', verified: true, category: 'Adventure', photos: 20 },
  { name: 'Rohit Nair', avatar: 'RN', location: 'Chennai, India', destinationSlug: 'andaman', tripName: 'Andaman Island Escape', packageSlug: 'andaman-island-5n6d', rating: 5, text: 'The scuba diving experience was out of this world! Radhanagar Beach is the most beautiful beach I have ever seen. The team arranged everything including PADI certification. Incredible trip!', date: '1 month ago', verified: true, category: 'Adventure', photos: 11 },
  { name: 'Kavita Desai', avatar: 'KD', location: 'Jaipur, India', destinationSlug: 'singapore', tripName: 'Singapore Dreams Tour', packageSlug: 'singapore-delight-4n5d', rating: 4, text: 'Perfect for families with kids! Universal Studios and Gardens by the Bay were the highlights. The itinerary was well-balanced between sightseeing and leisure. Clean and well-organized.', date: '5 weeks ago', verified: true, category: 'Family', photos: 7 },
  { name: 'Arjun Mehta', avatar: 'AM', location: 'Kolkata, India', destinationSlug: 'bali', tripName: 'Bali Temple & Beach Tour', packageSlug: 'bali-romantic-5n6d', rating: 5, text: 'Bali exceeded all our expectations! The Tegallalang rice terraces and Uluwatu temple at sunset were magical. The private pool villa was the perfect romantic touch. Will definitely book again!', date: '2 weeks ago', verified: true, category: 'Honeymoon', photos: 14 },
  { name: 'Deepa Krishnan', avatar: 'DK', location: 'Coimbatore, India', destinationSlug: 'srilanka', tripName: 'Sri Lanka Cultural Trip', packageSlug: 'srilanka-cultural-5n6d', rating: 4, text: 'Rich cultural experience! Sigiriya rock fortress was awe-inspiring. The tea gardens in Nuwara Eliya were beautiful. The local cuisine was a delightful surprise. Very well-curated itinerary.', date: '6 weeks ago', verified: true, category: 'Adventure', photos: 10 },
  { name: 'Suresh Iyer', avatar: 'SI', location: 'Madurai, India', destinationSlug: 'manali', tripName: 'Manali Adventure Package', packageSlug: 'manali-adventure-4n5d', rating: 5, text: 'The paragliding in Solang Valley was thrilling! Rohtang Pass was breathtaking. Our hotel had stunning mountain views. The bonfire evening was a perfect end to each adventurous day.', date: '3 weeks ago', verified: true, category: 'Adventure', photos: 8 },
  { name: 'Nisha Bhatt', avatar: 'NB', location: 'Surat, India', destinationSlug: 'dubai', tripName: 'Dubai Family Fun Tour', packageSlug: 'dubai-honeymoon-5n6d', rating: 5, text: 'Kids had the time of their lives! From Ferrari World to the Dubai Aquarium, every activity was perfect for families. The hotel was kids-friendly with amazing pools. Five stars all around!', date: '1 month ago', verified: true, category: 'Family', photos: 16 },
];

// ============================================
// TESTIMONIALS DATA
// ============================================

const testimonialsData = [
  { name: 'Priya & Rahul Sharma', location: 'Mumbai', trip: 'Kashmir Honeymoon Package', rating: 5, text: 'Our Kashmir honeymoon was absolutely magical! The houseboat stay on Dal Lake and the private shikara ride were dreams come true. Wayfare planned every detail perfectly.', avatar: '\u{1F469}\u200D\u2764\uFE0F\u200D\u{1F468}', happyNote: 'Best honeymoon ever — still dreaming of Dal Lake!', verified: true, featured: true },
  { name: 'Ankit Verma', location: 'Delhi', trip: 'Dubai Luxury Experience', rating: 5, text: 'Dubai was breathtaking! From the top of Burj Khalifa to the desert safari, every moment was unforgettable. The hotel was world-class and the itinerary was well-paced.', avatar: '\u{1F466}', happyNote: 'Burj Khalifa view from our room was insane!', verified: true, featured: true },
  { name: 'Deepika Patel', location: 'Ahmedabad', trip: 'Maldives Honeymoon Package', rating: 5, text: 'Maldives exceeded all our expectations! The overwater villa was luxurious, the snorkeling was incredible, and the sunset dolphin cruise was magical. Best honeymoon ever!', avatar: '\u{1F470}', happyNote: 'Sunset dolphin cruise was pure magic!', verified: true, featured: true },
];

// ============================================
// GALLERY IMAGES DATA
// ============================================

const galleryData = [
  { title: 'Honeymoon in Maldives', image: '/images/gallery/honeymoon-maldives.png', caption: 'Romantic overwater villa experience in the Maldives', category: 'Honeymoon', featured: true },
  { title: 'Goa Beach Party', image: '/images/gallery/goa-beach-party.png', caption: 'Vibrant beach party vibes in Goa', category: 'Beach', featured: true },
  { title: 'Family Fun in Andaman', image: '/images/gallery/family-andaman-beach.png', caption: 'Family beach fun in the Andaman Islands', category: 'Beach', featured: false },
  { title: 'Shikara Ride, Kashmir', image: '/images/gallery/kashmir-shikara.png', caption: 'Traditional shikara ride on Dal Lake', category: 'Culture', featured: true },
  { title: 'Dubai Nightlife', image: '/images/gallery/dubai-nightlife.png', caption: 'Dazzling Dubai skyline at night', category: 'Nightlife', featured: false },
  { title: 'Bali Resort Pool', image: '/images/gallery/bali-resort-pool.png', caption: 'Infinity pool overlooking Bali rice terraces', category: 'Luxury', featured: true },
  { title: 'Trekking in Manali', image: '/images/gallery/manali-trekking.png', caption: 'Adventure trekking in Manali mountains', category: 'Adventure', featured: false },
  { title: 'Thailand Floating Market', image: '/images/gallery/thailand-market.png', caption: 'Colorful floating market in Thailand', category: 'Culture', featured: false },
  { title: 'Kerala Houseboat', image: '/images/gallery/kerala-houseboat.png', caption: 'Serene houseboat cruise through Kerala backwaters', category: 'Luxury', featured: true },
  { title: 'Gardens by the Bay, Singapore', image: '/images/gallery/singapore-gardens.png', caption: 'Spectacular Supertree Grove at Gardens by the Bay', category: 'Culture', featured: false },
  { title: 'Scuba Diving, Andaman', image: '/images/gallery/andaman-scuba.png', caption: 'Explore vibrant coral reefs while scuba diving', category: 'Adventure', featured: false },
  { title: 'Luxury Hotel Suite', image: '/images/gallery/luxury-hotel-room.png', caption: 'Elegant luxury hotel suite with ocean view', category: 'Luxury', featured: false },
  { title: 'Taj Mahal Visit', image: '/images/gallery/taj-mahal-visit.png', caption: 'The magnificent Taj Mahal at sunrise', category: 'Culture', featured: true },
  { title: 'Bangkok Nightlife', image: '/images/gallery/bangkok-nightclub.png', caption: 'Electric nightlife on Khao San Road, Bangkok', category: 'Nightlife', featured: false },
  { title: 'Desert Safari, Dubai', image: '/images/gallery/dubai-desert-safari.png', caption: 'Thrilling desert dune bashing in Dubai', category: 'Adventure', featured: false },
  { title: 'Beach Dinner, Maldives', image: '/images/gallery/maldives-beach-dinner.png', caption: 'Romantic private beach dinner under the stars', category: 'Honeymoon', featured: true },
  { title: 'Jet Skiing in Goa', image: '/images/gallery/goa-jetski.png', caption: 'Exciting jet ski ride on Goan waters', category: 'Adventure', featured: false },
  { title: 'Bali Temple', image: '/images/gallery/bali-temple.png', caption: 'Ancient Balinese temple at sunset', category: 'Culture', featured: false },
  { title: 'Hotel Breakfast Spread', image: '/images/gallery/hotel-breakfast.png', caption: 'Indulgent breakfast spread at a luxury resort', category: 'Luxury', featured: false },
  { title: 'Hoi An, Vietnam', image: '/images/gallery/vietnam-hoian.png', caption: 'Lantern-lit streets of Hoi An ancient town', category: 'Culture', featured: false },
  { title: 'Sunrise at Darjeeling', image: '/images/gallery/darjeeling-sunrise.png', caption: 'Golden sunrise over the Himalayas at Tiger Hill', category: 'Adventure', featured: false },
  { title: 'Petronas Towers, Malaysia', image: '/images/gallery/malaysia-petronas.png', caption: 'Iconic Petronas Twin Towers at night', category: 'Culture', featured: false },
  { title: 'Pool Party Vibes', image: '/images/gallery/pool-party.png', caption: 'Fun pool party at a beach resort', category: 'Beach', featured: false },
  { title: 'Safari in Sri Lanka', image: '/images/gallery/srilanka-safari.png', caption: 'Wild elephant encounter on safari in Sri Lanka', category: 'Adventure', featured: false },
  { title: 'Kerala Ayurvedic Spa', image: '/images/gallery/kerala-spa.png', caption: 'Traditional Ayurvedic spa treatment in Kerala', category: 'Luxury', featured: false },
  { title: 'Paragliding in Manali', image: '/images/gallery/manali-paragliding.png', caption: 'Soaring above Solang Valley on a paraglider', category: 'Adventure', featured: false },
  { title: 'Beach Birthday Celebration', image: '/images/gallery/beach-birthday.png', caption: 'Birthday celebration on a tropical beach', category: 'Beach', featured: false },
  { title: 'Sigiriya, Sri Lanka', image: '/images/gallery/srilanka-sigiriya.png', caption: 'The ancient Sigiriya Rock Fortress', category: 'Culture', featured: false },
  { title: 'Halong Bay, Vietnam', image: '/images/gallery/vietnam-halong.png', caption: 'Emerald waters of Ha Long Bay', category: 'Culture', featured: false },
  { title: 'Fine Dining, Dubai', image: '/images/gallery/dubai-fine-dining.png', caption: 'World-class fine dining experience in Dubai', category: 'Luxury', featured: false },
  { title: 'Toy Train, Darjeeling', image: '/images/gallery/darjeeling-train.png', caption: 'The iconic UNESCO toy train ride', category: 'Adventure', featured: false },
  { title: 'Full Moon Party, Thailand', image: '/images/gallery/thailand-fullmoon.png', caption: 'Legendary Full Moon Party on Koh Phangan', category: 'Nightlife', featured: false },
  { title: 'Gondola Ride, Kashmir', image: '/images/gallery/kashmir-gondola.png', caption: 'Gondola cable car ride in Gulmarg', category: 'Adventure', featured: false },
  { title: 'Singapore Markets', image: '/images/gallery/singapore-market.png', caption: 'Vibrant street markets of Singapore', category: 'Culture', featured: false },
  { title: 'Sunset in Kerala', image: '/images/gallery/kerala-sunset.png', caption: 'Breathtaking sunset over Kerala backwaters', category: 'Honeymoon', featured: false },
  { title: 'Universal Studios, Singapore', image: '/images/gallery/singapore-universal.png', caption: 'Thrilling rides at Universal Studios Singapore', category: 'Beach', featured: false },
  { title: 'River Rafting, Rishikesh', image: '/images/gallery/rishikesh-rafting.png', caption: 'White water river rafting in Rishikesh', category: 'Adventure', featured: false },
  { title: 'Yacht Experience, Maldives', image: '/images/gallery/maldives-yacht.png', caption: 'Luxury yacht cruise in the Maldives', category: 'Luxury', featured: false },
  { title: 'Kathakali Dance, Kerala', image: '/images/gallery/kerala-kathakali.png', caption: 'Traditional Kathakali dance performance', category: 'Culture', featured: false },
  { title: 'Sunset Cocktails', image: '/images/gallery/hotel-cocktails.png', caption: 'Signature cocktails at sunset by the pool', category: 'Luxury', featured: false },
];

// ============================================
// SITE SETTINGS DATA
// ============================================

const siteSettingsData = [
  { key: 'site_name', value: 'Wayfare Travel', type: 'text', group: 'general', label: 'Site Name' },
  { key: 'site_tagline', value: 'Your Journey Begins Here', type: 'text', group: 'general', label: 'Site Tagline' },
  { key: 'site_url', value: 'https://travelwithwayfare.pages.dev', type: 'text', group: 'general', label: 'Site URL' },
  { key: 'contact_email', value: 'hello@wayfare.travel', type: 'text', group: 'contact', label: 'Contact Email' },
  { key: 'contact_phone', value: '+91 98765 43210', type: 'text', group: 'contact', label: 'Contact Phone' },
  { key: 'hero_video', value: '/videos/hero-bg.mp4', type: 'text', group: 'appearance', label: 'Hero Video' },
  { key: 'primary_color', value: '#0d9488', type: 'text', group: 'appearance', label: 'Primary Color' },
  { key: 'social_instagram', value: 'https://instagram.com/wayfare', type: 'text', group: 'social', label: 'Instagram URL' },
  { key: 'social_facebook', value: 'https://facebook.com/wayfare', type: 'text', group: 'social', label: 'Facebook URL' },
  { key: 'social_twitter', value: 'https://twitter.com/wayfare', type: 'text', group: 'social', label: 'Twitter URL' },
  { key: 'google_analytics_id', value: '', type: 'text', group: 'seo', label: 'Google Analytics ID' },
  { key: 'google_site_verification', value: 'google25d1cc1f32304e7b', type: 'text', group: 'seo', label: 'Google Site Verification' },
];

// ============================================
// BLOG POSTS DATA
// ============================================

const blogPostsData = [
  {
    slug: 'best-honeymoon-destinations-india-2025',
    title: '10 Best Honeymoon Destinations in India for 2025',
    excerpt: 'From the backwaters of Kerala to the snowy valleys of Kashmir, discover the most romantic destinations in India for your perfect honeymoon getaway.',
    content: `<h2 id="introduction">Why India is Perfect for Honeymoons</h2><p>India offers an incredible diversity of honeymoon experiences — from serene backwaters and misty hill stations to golden beaches and royal palaces. Whether you want adventure, relaxation, or cultural immersion, there's a perfect destination waiting for you.</p><h2 id="kerala">1. Kerala — The God's Own Country</h2><p>Kerala remains the undisputed king of honeymoon destinations in India. Imagine cruising through tranquil backwaters on a traditional houseboat, watching palm-fringed shores glide by as you sip tender coconut water. Munnar's rolling tea plantations, Alleppey's backwater cruises, and Kovalam's pristine beaches create the perfect romantic trifecta.</p><p><strong>Best Time:</strong> September to March | <strong>Budget:</strong> ₹15,000–₹30,000 per person for 5 nights</p><h2 id="kashmir">2. Kashmir — Paradise on Earth</h2><p>If your idea of romance involves snow-capped mountains, pristine lakes, and Mughal gardens, Kashmir is your dream destination. A shikara ride on Dal Lake at sunset, a stay in a luxurious houseboat, and a drive through the breathtaking Srinagar-Leh highway — every moment is picture-perfect.</p><p><strong>Best Time:</strong> April to October | <strong>Budget:</strong> ₹18,000–₹35,000 per person for 5 nights</p><h2 id="goa">3. Goa — Beach Romance</h2><p>Goa needs no introduction. Sun-kissed beaches, vibrant nightlife, Portuguese architecture, and some of the best seafood in the country. Whether you prefer the lively North Goa beaches or the serene South Goa stretches, a Goan honeymoon is always unforgettable.</p><p><strong>Best Time:</strong> November to February | <strong>Budget:</strong> ₹12,000–₹25,000 per person for 4 nights</p><h2 id="tips">Tips for Planning Your Honeymoon</h2><ul><li>Book at least 2-3 months in advance for the best hotel deals</li><li>Consider off-season travel for lower prices and fewer crowds</li><li>Always check weather conditions before finalizing dates</li><li>Look for honeymoon packages that include special experiences</li><li>Don't forget travel insurance for international destinations</li></ul>`,
    authorName: 'Priya Sharma',
    authorAvatar: '/images/logo-wayfare-new.png',
    authorBio: 'Travel writer and honeymoon specialist with 8+ years of experience exploring romantic destinations across India and Southeast Asia.',
    date: '2025-01-15',
    category: 'Destinations',
    image: '/images/blog/honeymoon-guide.png',
    readingTime: '8 min read',
    tags: JSON.stringify(['honeymoon', 'romantic getaways', 'India travel', 'Kerala', 'Kashmir', 'Goa']),
    featured: true,
  },
  {
    slug: 'complete-kerala-travel-guide',
    title: 'Complete Kerala Travel Guide: Backwaters, Hills & Beaches',
    excerpt: 'Your ultimate guide to exploring God\'s Own Country — from Alleppey houseboats to Munnar tea estates, discover the best of Kerala.',
    content: `<h2 id="introduction">Welcome to Kerala</h2><p>Kerala, known as "God's Own Country," is a narrow strip of land along India's southwestern coast that packs an extraordinary diversity of landscapes into a small area. From the misty Western Ghats to the tranquil Arabian Sea coast, Kerala offers backwaters, hill stations, beaches, wildlife sanctuaries, and a rich cultural heritage.</p><h2 id="best-time">Best Time to Visit Kerala</h2><p>The ideal time to visit Kerala is from <strong>September to March</strong> when the weather is pleasant and dry. The monsoon season (June-August) has its own charm with lush greenery and Ayurvedic wellness season.</p><h2 id="top-destinations">Top Destinations in Kerala</h2><h3>Alleppey (Alappuzha) — The Venice of the East</h3><p>No Kerala trip is complete without a houseboat cruise through Alleppey's backwaters. These traditional kettuvallams have been converted into floating luxury hotels.</p><h3>Munnar — Tea Garden Paradise</h3><p>Munnar's rolling hills covered in tea plantations are among the most photographed landscapes in India.</p><h2 id="itinerary">Suggested 7-Day Kerala Itinerary</h2><ol><li><strong>Day 1-2:</strong> Arrive in Kochi, explore Fort Kochi, watch a Kathakali show</li><li><strong>Day 3-4:</strong> Drive to Munnar, visit tea gardens and Eravikulam National Park</li><li><strong>Day 5:</strong> Drive to Thekkady, spice plantation tour and Periyar boat safari</li><li><strong>Day 6:</strong> Drive to Alleppey, board houseboat for overnight backwater cruise</li><li><strong>Day 7:</strong> Disembark, drive to Kovalam or Kochi airport for departure</li></ol>`,
    authorName: 'Arjun Menon',
    authorAvatar: '/images/logo-wayfare-new.png',
    authorBio: 'Kerala native and travel photographer who has documented every corner of God\'s Own Country over the past decade.',
    date: '2025-01-10',
    category: 'Guides',
    image: '/images/destinations/kerala.png',
    readingTime: '10 min read',
    tags: JSON.stringify(['Kerala', 'backwaters', 'Munnar', 'travel guide', 'India', 'houseboat']),
    featured: true,
  },
  {
    slug: 'dubai-on-budget-indian-travelers',
    title: 'Dubai on a Budget: Tips for Indian Travelers',
    excerpt: 'Think Dubai is only for the rich? Think again! Our insider guide shows you how to experience the best of Dubai without burning a hole in your pocket.',
    content: `<h2 id="introduction">Dubai Doesn't Have to Break the Bank</h2><p>Dubai has a reputation for luxury, but it's surprisingly accessible for budget-conscious Indian travelers. With smart planning, you can experience the best of this glittering city for under ₹50,000 for a 4-night trip (including flights!).</p><h2 id="flights">Getting Cheap Flights to Dubai</h2><ul><li><strong>Budget Airlines:</strong> Flydubai, Air India Express, SpiceJet offer direct flights starting at ₹8,000-₹12,000 round trip</li><li><strong>Off-Peak Travel:</strong> February-May and September-November offer the best deals</li><li><strong>Mid-Week Flights:</strong> Tuesday and Wednesday departures are typically 20-30% cheaper</li></ul><h2 id="free-activities">Free Things to Do in Dubai</h2><ul><li><strong>Dubai Fountain Show:</strong> The world's largest choreographed fountain — absolutely free</li><li><strong>Dubai Marina Walk:</strong> Stunning waterfront promenade</li><li><strong>Kite Beach:</strong> Beautiful public beach with Burj Al Arab views</li><li><strong>Dubai Creek Abra Ride:</strong> Traditional boat ride for just AED 1</li></ul><h2 id="budget-breakdown">Sample 4-Night Budget Breakdown</h2><ul><li>Flights (round trip): ₹10,000-₹15,000</li><li>Accommodation (4 nights): ₹10,000-₹16,000</li><li>Food (4 days): ₹6,000-₹8,000</li><li>Activities: ₹8,000-₹12,000</li><li>Transport: ₹3,000-₹4,000</li><li>Visa: ₹5,500-₹6,500</li><li><strong>Total: ₹42,500-₹61,500 per person</strong></li></ul>`,
    authorName: 'Rahul Verma',
    authorAvatar: '/images/logo-wayfare-new.png',
    authorBio: 'Travel hacker and budget travel expert who has visited 25+ countries on a shoestring budget.',
    date: '2025-01-05',
    category: 'Tips',
    image: '/images/destinations/dubai.png',
    readingTime: '9 min read',
    tags: JSON.stringify(['Dubai', 'budget travel', 'tips', 'international travel', 'UAE']),
    featured: false,
  },
  {
    slug: 'maldives-vs-bali-honeymoon-comparison',
    title: 'Maldives vs Bali: Which is Better for Your Honeymoon?',
    excerpt: 'Torn between the overwater villas of Maldives and the cultural charm of Bali? Our detailed comparison helps you decide the perfect honeymoon destination.',
    content: `<h2 id="introduction">The Great Honeymoon Debate</h2><p>Maldives and Bali are two of the most popular honeymoon destinations for Indian couples. Both offer stunning natural beauty and romantic experiences, but they're completely different in character.</p><h2 id="budget">Budget Comparison</h2><p><strong>Maldives (5 nights):</strong></p><ul><li>Budget: ₹80,000-₹1,20,000 per couple</li><li>Mid-range: ₹1,50,000-₹2,50,000 per couple</li><li>Luxury: ₹3,00,000+ per couple</li></ul><p><strong>Bali (5 nights):</strong></p><ul><li>Budget: ₹50,000-₹80,000 per couple</li><li>Mid-range: ₹1,00,000-₹1,80,000 per couple</li><li>Luxury: ₹2,00,000+ per couple</li></ul><h2 id="activities">Activities & Experiences</h2><p><strong>Maldives:</strong> Snorkeling with manta rays, private sandbank dining, underwater restaurants, sunset dolphin cruises</p><p><strong>Bali:</strong> Tegallalang Rice Terrace, Uluwatu Temple sunset, Mount Batur sunrise trek, Seminyak beach clubs, cooking classes</p><h2 id="verdict">The Verdict</h2><p><strong>Choose Maldives if:</strong> You want pure relaxation, luxury, and privacy.</p><p><strong>Choose Bali if:</strong> You want a mix of adventure, culture, and relaxation.</p>`,
    authorName: 'Neha Kapoor',
    authorAvatar: '/images/logo-wayfare-new.png',
    authorBio: 'Luxury travel consultant specializing in honeymoon planning. Has planned 500+ honeymoons across Asia and the Indian Ocean.',
    date: '2024-12-20',
    category: 'Reviews',
    image: '/images/destinations/maldives.png',
    readingTime: '8 min read',
    tags: JSON.stringify(['Maldives', 'Bali', 'honeymoon', 'comparison', 'luxury travel', 'Indonesia']),
    featured: true,
  },
  {
    slug: 'ladakh-bike-trip-complete-guide',
    title: 'Ladakh Bike Trip: Everything You Need to Know',
    excerpt: 'The ultimate guide to planning your dream Ladakh bike trip — routes, permits, packing list, budget, and insider tips from experienced riders.',
    content: `<h2 id="introduction">The Call of the Mountains</h2><p>A Ladakh bike trip is a bucket-list adventure for every rider in India. The journey through the world's highest motorable passes, across vast barren landscapes and beside pristine lakes, is an experience like no other.</p><h2 id="when-to-go">When to Go</h2><ul><li><strong>Mid-June to Mid-September:</strong> The only reliable window</li><li><strong>Best Month:</strong> July offers the best weather and road conditions</li><li><strong>Avoid:</strong> October onwards — unpredictable weather and road closures</li></ul><h2 id="routes">Popular Routes</h2><h3>Route 1: Srinagar-Leh Highway (425 km)</h3><p>The gentler approach. This route gradually gains altitude, helping with acclimatization.</p><h3>Route 2: Manali-Leh Highway (473 km)</h3><p>The more dramatic and challenging route. Higher passes, stunning landscapes.</p><h2 id="budget">Budget Breakdown (Per Person)</h2><ul><li>Bike rental (12 days): ₹18,000-₹24,000</li><li>Fuel (2,500 km approx): ₹8,000-₹10,000</li><li>Accommodation (12 nights): ₹9,000-₹18,000</li><li>Food (12 days): ₹8,000-₹12,000</li><li>Permits & entry fees: ₹1,500-₹2,000</li><li>Miscellaneous: ₹3,000-₹5,000</li><li><strong>Total: ₹47,500-₹71,000 per person</strong></li></ul><h2 id="tips">Pro Tips</h2><ul><li>Acclimatize for 2 days in Leh before riding to high passes</li><li>Start early — weather changes rapidly in the afternoon</li><li>Ride in a group of 4-6 bikes for safety</li><li>Stay hydrated — the dry mountain air dehydrates you faster than you realize</li></ul>`,
    authorName: 'Vikram Singh',
    authorAvatar: '/images/logo-wayfare-new.png',
    authorBio: 'Adventure motorcyclist who has completed 6 Ladakh expeditions. Founder of the Delhi Riders motorcycle club.',
    date: '2024-12-15',
    category: 'Guides',
    image: '/images/blog/adventure-tips.png',
    readingTime: '12 min read',
    tags: JSON.stringify(['Ladakh', 'bike trip', 'adventure', 'road trip', 'motorcycle', 'Himalayas']),
    featured: true,
  },
];

// ============================================
// VIDEOS DATA
// ============================================

const videosData = [
  { title: 'Kerala Backwaters Experience', url: 'https://www.youtube.com/embed/example1', thumbnail: '/images/destinations/kerala.png', description: 'Experience the serene backwaters of Kerala', category: 'destination', featured: true },
  { title: 'Dubai City Tour', url: 'https://www.youtube.com/embed/example2', thumbnail: '/images/destinations/dubai.png', description: 'Explore the magnificent city of Dubai', category: 'destination', featured: true },
  { title: 'Customer Testimonial - Maldives', url: 'https://www.youtube.com/embed/example3', thumbnail: '/images/destinations/maldives.png', description: 'Hear from our happy travelers', category: 'testimonial', featured: false },
  { title: 'Adventure in Manali', url: 'https://www.youtube.com/embed/example4', thumbnail: '/images/destinations/manali.png', description: 'Thrilling adventures await in Manali', category: 'experience', featured: false },
];

// ============================================
// INQUIRIES DATA
// ============================================

const inquiriesData = [
  { name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210', type: 'package', message: 'I am interested in the Kerala Backwaters package for 2 adults.', status: 'new' },
  { name: 'Jane Smith', email: 'jane@example.com', phone: '+91 87654 32109', type: 'hotel', message: 'Looking for a luxury hotel in Dubai for December.', status: 'read' },
  { name: 'Rahul Kumar', email: 'rahul@example.com', phone: '', type: 'custom', message: 'Planning a family trip to Thailand for 4 adults and 2 children.', status: 'new' },
];

// ============================================
// MAIN SEED FUNCTION
// ============================================

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ============================================
  // STEP 0: Delete all existing data (reverse dependency order)
  // ============================================
  console.log('🗑️  Cleaning existing data...');

  await prisma.deployLog.deleteMany({});
  console.log('  ✓ Deploy logs deleted');

  await prisma.booking.deleteMany({});
  console.log('  ✓ Bookings deleted');

  await prisma.inquiry.deleteMany({});
  console.log('  ✓ Inquiries deleted');

  await prisma.review.deleteMany({});
  console.log('  ✓ Reviews deleted');

  await prisma.testimonial.deleteMany({});
  console.log('  ✓ Testimonials deleted');

  await prisma.blogPost.deleteMany({});
  console.log('  ✓ Blog posts deleted');

  await prisma.galleryImage.deleteMany({});
  console.log('  ✓ Gallery images deleted');

  await prisma.video.deleteMany({});
  console.log('  ✓ Videos deleted');

  await prisma.flightDeal.deleteMany({});
  console.log('  ✓ Flight deals deleted');

  await prisma.hotel.deleteMany({});
  console.log('  ✓ Hotels deleted');

  await prisma.package.deleteMany({});
  console.log('  ✓ Packages deleted');

  await prisma.siteSetting.deleteMany({});
  console.log('  ✓ Site settings deleted');

  await prisma.destination.deleteMany({});
  console.log('  ✓ Destinations deleted');

  console.log('  ✅ All existing data cleared!\n');

  // ============================================
  // STEP 1: Create Destinations
  // ============================================
  console.log('🌍 Creating destinations...');

  const destinationMap: Record<string, string> = {};

  for (const dest of destinationsData) {
    const destination = await prisma.destination.create({
      data: {
        name: dest.name,
        slug: dest.slug,
        country: dest.country,
        region: dest.region,
        tagline: dest.tagline,
        image: dest.image,
        description: dest.description,
        featured: dest.featured,
        status: 'active',
      },
    });
    destinationMap[dest.slug] = destination.id;
  }

  console.log(`  ✅ Created ${destinationsData.length} destinations\n`);

  // ============================================
  // STEP 2: Create Packages
  // ============================================
  console.log('📦 Creating packages...');

  const packageMap: Record<string, string> = {};

  for (const pkg of packagesData) {
    const { nights, days } = parseDuration(pkg.duration);
    const destinationId = destinationMap[pkg.destinationSlug];

    if (!destinationId) {
      console.warn(`  ⚠️  Destination not found for package ${pkg.slug}: ${pkg.destinationSlug}`);
      continue;
    }

    const created = await prisma.package.create({
      data: {
        name: pkg.name,
        slug: pkg.slug,
        destinationId,
        category: pkg.category,
        duration: pkg.duration,
        nights,
        days,
        price: pkg.price,
        originalPrice: Math.round(pkg.price * 1.3),
        image: pkg.image,
        gallery: JSON.stringify([]),
        description: pkg.description,
        highlights: JSON.stringify(pkg.highlights),
        included: JSON.stringify(pkg.included),
        itinerary: JSON.stringify(pkg.itinerary),
        rating: 4.5,
        reviewCount: randomBetween(15, 85),
        featured: featuredPackageSlugs.includes(pkg.slug),
        status: 'active',
      },
    });
    packageMap[pkg.slug] = created.id;
  }

  console.log(`  ✅ Created ${packagesData.length} packages\n`);

  // ============================================
  // STEP 3: Create Hotels
  // ============================================
  console.log('🏨 Creating hotels...');

  for (const hotel of hotelsData) {
    const destinationId = destinationMap[hotel.destinationSlug];

    if (!destinationId) {
      console.warn(`  ⚠️  Destination not found for hotel ${hotel.slug}: ${hotel.destinationSlug}`);
      continue;
    }

    await prisma.hotel.create({
      data: {
        name: hotel.name,
        slug: hotel.slug,
        destinationId,
        category: hotel.category,
        stars: hotel.stars,
        pricePerNight: hotel.pricePerNight,
        originalPrice: Math.round(hotel.pricePerNight * 1.25),
        image: hotel.image,
        gallery: JSON.stringify([]),
        description: hotel.description,
        amenities: JSON.stringify(hotel.amenities),
        rating: 4.0 + (hotel.stars * 0.1),
        reviewCount: randomBetween(20, 120),
        featured: featuredHotelSlugs.includes(hotel.slug),
        status: 'active',
      },
    });
  }

  console.log(`  ✅ Created ${hotelsData.length} hotels\n`);

  // ============================================
  // STEP 4: Create Flight Deals
  // ============================================
  console.log('✈️  Creating flight deals...');

  for (const flight of flightsData) {
    await prisma.flightDeal.create({
      data: {
        from: flight.from,
        to: flight.to,
        airline: flight.airline,
        price: flight.price,
        originalPrice: flight.originalPrice,
        type: flight.type,
        image: flight.image,
        description: flight.description,
        featured: flight.featured,
        status: 'active',
      },
    });
  }

  console.log(`  ✅ Created ${flightsData.length} flight deals\n`);

  // ============================================
  // STEP 5: Create Reviews
  // ============================================
  console.log('⭐ Creating reviews...');

  for (const review of reviewsData) {
    const destinationId = destinationMap[review.destinationSlug];
    const packageId = review.packageSlug ? packageMap[review.packageSlug] : null;

    if (!destinationId) {
      console.warn(`  ⚠️  Destination not found for review: ${review.destinationSlug}`);
      continue;
    }

    await prisma.review.create({
      data: {
        name: review.name,
        avatar: review.avatar,
        location: review.location,
        rating: review.rating,
        title: review.tripName,
        text: review.text,
        date: review.date,
        verified: review.verified,
        category: review.category,
        photos: review.photos,
        status: 'active',
        destinationId,
        packageId: packageId || null,
      },
    });
  }

  console.log(`  ✅ Created ${reviewsData.length} reviews\n`);

  // ============================================
  // STEP 6: Create Testimonials
  // ============================================
  console.log('💬 Creating testimonials...');

  for (const testimonial of testimonialsData) {
    await prisma.testimonial.create({
      data: {
        name: testimonial.name,
        location: testimonial.location,
        trip: testimonial.trip,
        rating: testimonial.rating,
        text: testimonial.text,
        avatar: testimonial.avatar,
        happyNote: testimonial.happyNote,
        verified: testimonial.verified,
        featured: testimonial.featured,
        status: 'active',
      },
    });
  }

  console.log(`  ✅ Created ${testimonialsData.length} testimonials\n`);

  // ============================================
  // STEP 7: Create Gallery Images
  // ============================================
  console.log('🖼️  Creating gallery images...');

  for (const img of galleryData) {
    await prisma.galleryImage.create({
      data: {
        title: img.title,
        image: img.image,
        caption: img.caption,
        category: img.category,
        featured: img.featured,
        status: 'active',
      },
    });
  }

  console.log(`  ✅ Created ${galleryData.length} gallery images\n`);

  // ============================================
  // STEP 8: Create Site Settings
  // ============================================
  console.log('⚙️  Creating site settings...');

  for (const setting of siteSettingsData) {
    await prisma.siteSetting.create({
      data: {
        key: setting.key,
        value: setting.value,
        type: setting.type,
        group: setting.group,
        label: setting.label,
      },
    });
  }

  console.log(`  ✅ Created ${siteSettingsData.length} site settings\n`);

  // ============================================
  // STEP 9: Create Blog Posts
  // ============================================
  console.log('📝 Creating blog posts...');

  for (const post of blogPostsData) {
    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        authorName: post.authorName,
        authorAvatar: post.authorAvatar,
        authorBio: post.authorBio,
        date: post.date,
        category: post.category,
        image: post.image,
        readingTime: post.readingTime,
        tags: post.tags,
        featured: post.featured,
        status: 'active',
      },
    });
  }

  console.log(`  ✅ Created ${blogPostsData.length} blog posts\n`);

  // ============================================
  // STEP 10: Create Videos
  // ============================================
  console.log('🎬 Creating videos...');

  for (const video of videosData) {
    await prisma.video.create({
      data: {
        title: video.title,
        url: video.url,
        thumbnail: video.thumbnail,
        description: video.description,
        category: video.category,
        featured: video.featured,
        status: 'active',
      },
    });
  }

  console.log(`  ✅ Created ${videosData.length} videos\n`);

  // ============================================
  // STEP 11: Create Inquiries
  // ============================================
  console.log('📩 Creating inquiries...');

  for (const inquiry of inquiriesData) {
    await prisma.inquiry.create({
      data: {
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone || null,
        type: inquiry.type,
        message: inquiry.message,
        status: inquiry.status,
      },
    });
  }

  console.log(`  ✅ Created ${inquiriesData.length} inquiries\n`);

  // ============================================
  // STEP 12: Create Bookings
  // ============================================
  console.log('📋 Creating bookings...');

  const bookingsData = [
    { name: 'Amit Sharma', email: 'amit@example.com', phone: '+91 99887 76655', packageSlug: 'kerala-backwaters-5n6d', travelers: 2, adults: 2, children: 0, departureDate: '2025-03-15', returnDate: '2025-03-20', roomType: 'deluxe', totalPrice: 37998, status: 'confirmed' },
    { name: 'Priya Patel', email: 'priya@example.com', phone: '+91 88776 65544', packageSlug: 'dubai-luxury-4n5d', travelers: 2, adults: 2, children: 0, departureDate: '2025-04-10', returnDate: '2025-04-14', roomType: 'suite', totalPrice: 89998, status: 'pending' },
    { name: 'Suresh Reddy', email: 'suresh@example.com', phone: '+91 77665 54433', packageSlug: 'maldives-paradise-4n5d', travelers: 2, adults: 2, children: 0, departureDate: '2025-05-01', returnDate: '2025-05-05', roomType: 'overwater-villa', totalPrice: 159998, status: 'pending' },
  ];

  for (const booking of bookingsData) {
    const packageId = packageMap[booking.packageSlug];

    if (!packageId) {
      console.warn(`  ⚠️  Package not found for booking: ${booking.packageSlug}`);
      continue;
    }

    await prisma.booking.create({
      data: {
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        packageId,
        travelers: booking.travelers,
        adults: booking.adults,
        children: booking.children,
        departureDate: booking.departureDate,
        returnDate: booking.returnDate,
        roomType: booking.roomType,
        totalPrice: booking.totalPrice,
        status: booking.status,
      },
    });
  }

  console.log(`  ✅ Created ${bookingsData.length} bookings\n`);

  // ============================================
  // STEP 13: Create Deploy Log
  // ============================================
  console.log('🚀 Creating deploy log...');

  await prisma.deployLog.create({
    data: {
      action: 'deploy',
      details: 'Initial database setup',
      status: 'success',
      triggeredBy: 'system',
    },
  });

  console.log('  ✅ Created deploy log\n');

  // ============================================
  // SUMMARY
  // ============================================
  console.log('========================================');
  console.log('🎉 Seed completed successfully!');
  console.log('========================================');
  console.log(`  Destinations:     ${destinationsData.length}`);
  console.log(`  Packages:         ${packagesData.length}`);
  console.log(`  Hotels:           ${hotelsData.length}`);
  console.log(`  Flight Deals:     ${flightsData.length}`);
  console.log(`  Reviews:          ${reviewsData.length}`);
  console.log(`  Testimonials:     ${testimonialsData.length}`);
  console.log(`  Gallery Images:   ${galleryData.length}`);
  console.log(`  Site Settings:    ${siteSettingsData.length}`);
  console.log(`  Blog Posts:       ${blogPostsData.length}`);
  console.log(`  Videos:           ${videosData.length}`);
  console.log(`  Inquiries:        ${inquiriesData.length}`);
  console.log(`  Bookings:         3`);
  console.log(`  Deploy Logs:      1`);
  console.log('========================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
