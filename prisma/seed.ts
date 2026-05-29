import { db } from '@/lib/db';

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await db.inquiry.deleteMany();
  await db.flightDeal.deleteMany();
  await db.hotel.deleteMany();
  await db.package.deleteMany();
  await db.destination.deleteMany();

  // ============ DOMESTIC DESTINATIONS ============
  const kerala = await db.destination.create({
    data: {
      name: 'Kerala',
      slug: 'kerala',
      country: 'India',
      region: 'domestic',
      image: '/images/destinations/kerala.png',
      description: 'Known as "God\'s Own Country," Kerala is a tropical paradise with serene backwaters, lush hill stations, exotic wildlife, and beautiful beaches. Experience the magic of houseboat stays on tranquil backwaters surrounded by palm trees.',
      tagline: 'God\'s Own Country',
      featured: true,
    },
  });

  const kashmir = await db.destination.create({
    data: {
      name: 'Kashmir',
      slug: 'kashmir',
      country: 'India',
      region: 'domestic',
      image: '/images/destinations/kashmir.png',
      description: 'Paradise on Earth, Kashmir enchants with its pristine valleys, snow-capped mountains, crystal-clear lakes, and vibrant Mughal gardens. Sail on Dal Lake in a shikara and experience the breathtaking beauty of the Himalayas.',
      tagline: 'Paradise on Earth',
      featured: true,
    },
  });

  const goa = await db.destination.create({
    data: {
      name: 'Goa',
      slug: 'goa',
      country: 'India',
      region: 'domestic',
      image: '/images/destinations/goa.png',
      description: 'India\'s sunshine state, Goa is famous for its golden beaches, vibrant nightlife, Portuguese heritage, and delicious seafood. From sun-kissed beaches to spice plantations, Goa offers the perfect blend of relaxation and adventure.',
      tagline: 'Sun, Sand & Surf',
      featured: true,
    },
  });

  const darjeeling = await db.destination.create({
    data: {
      name: 'Darjeeling',
      slug: 'darjeeling',
      country: 'India',
      region: 'domestic',
      image: '/images/destinations/darjeeling.png',
      description: 'The Queen of Hills, Darjeeling captivates with its tea gardens, the iconic toy train, and stunning views of Kanchenjunga. Sip world-famous tea while watching the sunrise paint the Himalayas in golden hues.',
      tagline: 'Queen of the Hills',
      featured: true,
    },
  });

  const andaman = await db.destination.create({
    data: {
      name: 'Andaman & Nicobar',
      slug: 'andaman',
      country: 'India',
      region: 'domestic',
      image: '/images/destinations/andaman.png',
      description: 'A tropical archipelago in the Bay of Bengal, the Andaman Islands boast pristine white-sand beaches, crystal-clear turquoise waters, and vibrant coral reefs. Perfect for snorkeling, scuba diving, and beach lovers.',
      tagline: 'Emerald Islands',
      featured: true,
    },
  });

  const manali = await db.destination.create({
    data: {
      name: 'Manali',
      slug: 'manali',
      country: 'India',
      region: 'domestic',
      image: '/images/destinations/manali.png',
      description: 'A picturesque hill station nestled in the Beas River Valley, Manali is a haven for adventure enthusiasts and nature lovers. From skiing in Solang Valley to trekking through pine forests, Manali offers thrilling experiences year-round.',
      tagline: 'Valley of the Gods',
      featured: true,
    },
  });

  const dharamshala = await db.destination.create({
    data: {
      name: 'Dharamshala',
      slug: 'dharamshala',
      country: 'India',
      region: 'domestic',
      image: '/images/destinations/dharamshala.png',
      description: 'Nestled in the Kangra Valley, Dharamshala is a serene hill station with Tibetan culture, stunning mountain views, and the famous cricket stadium. McLeod Ganj, its upper suburb, offers a unique cultural experience.',
      tagline: 'Little Lhasa of India',
      featured: false,
    },
  });

  const delhi = await db.destination.create({
    data: {
      name: 'Delhi - Golden Triangle',
      slug: 'delhi-golden-triangle',
      country: 'India',
      region: 'domestic',
      image: '/images/destinations/delhi.png',
      description: 'The Golden Triangle circuit covers Delhi, Agra, and Jaipur — three cities that showcase India\'s rich heritage. From the Taj Mahal to the Amber Fort, experience the best of Indian history, culture, and architecture.',
      tagline: 'Heritage Triangle',
      featured: true,
    },
  });

  const sikkim = await db.destination.create({
    data: {
      name: 'Sikkim',
      slug: 'sikkim',
      country: 'India',
      region: 'domestic',
      image: '/images/destinations/sikkim.png',
      description: 'A small but stunning state in northeast India, Sikkim offers breathtaking views of Kanchenjunga, ancient Buddhist monasteries, pristine lakes, and vibrant rhododendron forests. A perfect blend of nature and spirituality.',
      tagline: 'The Land of Monasteries',
      featured: false,
    },
  });

  const himachal = await db.destination.create({
    data: {
      name: 'Himachal Pradesh',
      slug: 'himachal',
      country: 'India',
      region: 'domestic',
      image: '/images/destinations/himachal.png',
      description: 'From the colonial charm of Shimla to the adventure capital of Manali, Himachal Pradesh is a land of diverse landscapes. Snow-capped peaks, lush valleys, apple orchards, and warm hospitality await you.',
      tagline: 'Land of Gods & Beauty',
      featured: true,
    },
  });

  // ============ INTERNATIONAL DESTINATIONS ============
  const dubai = await db.destination.create({
    data: {
      name: 'Dubai',
      slug: 'dubai',
      country: 'UAE',
      region: 'international',
      image: '/images/destinations/dubai.png',
      description: 'A gleaming metropolis of luxury and innovation, Dubai dazzles with its iconic Burj Khalifa, pristine beaches, world-class shopping, and desert safaris. Experience the perfect blend of tradition and modernity.',
      tagline: 'City of Gold',
      featured: true,
    },
  });

  const maldives = await db.destination.create({
    data: {
      name: 'Maldives',
      slug: 'maldives',
      country: 'Maldives',
      region: 'international',
      image: '/images/destinations/maldives.png',
      description: 'The ultimate tropical paradise, the Maldives features overwater villas, crystal-clear lagoons, and vibrant coral reefs. A bucket-list destination for honeymooners and luxury seekers with unmatched serenity.',
      tagline: 'Sun, Sand & Serenity',
      featured: true,
    },
  });

  const thailand = await db.destination.create({
    data: {
      name: 'Thailand',
      slug: 'thailand',
      country: 'Thailand',
      region: 'international',
      image: '/images/destinations/thailand.png',
      description: 'The Land of Smiles offers ornate temples, pristine beaches, vibrant street markets, and world-famous cuisine. From Bangkok\'s bustling streets to Phuket\'s serene shores, Thailand has something for everyone.',
      tagline: 'Land of Smiles',
      featured: true,
    },
  });

  const singapore = await db.destination.create({
    data: {
      name: 'Singapore',
      slug: 'singapore',
      country: 'Singapore',
      region: 'international',
      image: '/images/destinations/singapore.png',
      description: 'A futuristic city-state, Singapore blends stunning architecture, lush gardens, and a melting pot of cultures. From Marina Bay Sands to Gardens by the Bay, it\'s a city that never fails to amaze.',
      tagline: 'The Lion City',
      featured: true,
    },
  });

  const malaysia = await db.destination.create({
    data: {
      name: 'Malaysia',
      slug: 'malaysia',
      country: 'Malaysia',
      region: 'international',
      image: '/images/destinations/malaysia.png',
      description: 'Truly Asia! Malaysia offers a rich cultural tapestry, from the Petronas Twin Towers to the lush rainforests of Borneo. Enjoy diverse cuisine, stunning islands, and vibrant cities all in one destination.',
      tagline: 'Truly Asia',
      featured: true,
    },
  });

  const bali = await db.destination.create({
    data: {
      name: 'Bali (Indonesia)',
      slug: 'bali',
      country: 'Indonesia',
      region: 'international',
      image: '/images/destinations/bali.png',
      description: 'The Island of the Gods, Bali mesmerizes with its terraced rice paddies, ancient temples, volcanic hills, and stunning beaches. A spiritual and cultural haven with world-class surfing and wellness retreats.',
      tagline: 'Island of the Gods',
      featured: true,
    },
  });

  const srilanka = await db.destination.create({
    data: {
      name: 'Sri Lanka',
      slug: 'srilanka',
      country: 'Sri Lanka',
      region: 'international',
      image: '/images/destinations/srilanka.png',
      description: 'The Pearl of the Indian Ocean, Sri Lanka offers ancient ruins, lush tea plantations, exotic wildlife, and golden beaches. A compact island with incredible diversity from culture to nature.',
      tagline: 'Pearl of the Indian Ocean',
      featured: false,
    },
  });

  const vietnam = await db.destination.create({
    data: {
      name: 'Vietnam',
      slug: 'vietnam',
      country: 'Vietnam',
      region: 'international',
      image: '/images/destinations/vietnam.png',
      description: 'From the emerald waters of Ha Long Bay to the charming streets of Hoi An, Vietnam captivates with its natural beauty, rich history, and incredible cuisine. An affordable yet unforgettable destination.',
      tagline: 'Hidden Charm',
      featured: false,
    },
  });

  const nepal = await db.destination.create({
    data: {
      name: 'Nepal',
      slug: 'nepal',
      country: 'Nepal',
      region: 'international',
      image: '/images/destinations/nepal.png',
      description: 'Home to the Himalayas and Mount Everest, Nepal offers trekking adventures, ancient temples, and warm hospitality. From Kathmandu\'s cultural heritage to Pokhara\'s serene lakes, Nepal is a trekker\'s paradise.',
      tagline: 'Roof of the World',
      featured: true,
    },
  });

  // ============ PACKAGES ============
  // Kerala Packages
  await db.package.createMany({
    data: [
      {
        name: 'Kerala Backwaters & Beaches',
        slug: 'kerala-backwaters-5n6d',
        destinationId: kerala.id,
        category: 'tourism',
        duration: '5N6D',
        nights: 5,
        days: 6,
        price: 18999,
        originalPrice: 24999,
        image: '/images/destinations/kerala.png',
        description: 'Experience the magical backwaters of Kerala with houseboat stays, visit pristine beaches, explore tea plantations in Munnar, and witness traditional Kathakali performances.',
        highlights: 'Alleppey Houseboat,Munnar Tea Gardens,Kovalam Beach,Kathakali Show,Spice Plantation Tour',
        included: 'Accommodation,Breakfast & Dinner,Houseboat Stay,Airport Transfers,Sightseeing Tours',
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival in Kochi', desc: 'Airport pickup, check-in, evening visit to Fort Kochi and Chinese Fishing Nets' },
          { day: 2, title: 'Munnar Hill Station', desc: 'Drive to Munnar, visit tea gardens, Mattupetty Dam, and Echo Point' },
          { day: 3, title: 'Munnar to Thekkady', desc: 'Visit Eravikulam National Park, drive to Thekkady, spice plantation tour' },
          { day: 4, title: 'Alleppey Houseboat', desc: 'Board traditional houseboat, cruise through backwaters, overnight on houseboat' },
          { day: 5, title: 'Kovalam Beach', desc: 'Disembark houseboat, drive to Kovalam, beach relaxation and Ayurvedic massage' },
          { day: 6, title: 'Departure', desc: 'Morning at leisure, airport drop-off' },
        ]),
        rating: 4.7,
        reviewCount: 342,
        featured: true,
      },
      {
        name: 'Kerala Honeymoon Special',
        slug: 'kerala-honeymoon-4n5d',
        destinationId: kerala.id,
        category: 'honeymoon',
        duration: '4N5D',
        nights: 4,
        days: 5,
        price: 22999,
        originalPrice: 29999,
        image: '/images/packages/honeymoon.png',
        description: 'A romantic getaway through Kerala\'s most enchanting destinations. Private houseboat stays, candlelight dinners, and couples spa treatments make this the perfect honeymoon.',
        highlights: 'Private Houseboat,Candlelight Dinner,Couples Spa,Munnar Romantic Walk,Sunset Cruise',
        included: 'Premium Accommodation,Breakfast & Dinner,Private Houseboat,Couples Spa,Airport Transfers',
        itinerary: JSON.stringify([
          { day: 1, title: 'Welcome to Kerala', desc: 'Airport pickup with flower garlands, transfer to resort, candlelight welcome dinner' },
          { day: 2, title: 'Romantic Munnar', desc: 'Drive to Munnar, visit tea gardens, romantic walk through tea estates' },
          { day: 3, title: 'Houseboat Romance', desc: 'Private houseboat cruise through Alleppey backwaters, couples spa on board' },
          { day: 4, title: 'Kovalam Beach', desc: 'Beach day, sunset cruise, Ayurvedic couples massage' },
          { day: 5, title: 'Farewell', desc: 'Morning at leisure, airport drop-off with memories' },
        ]),
        rating: 4.9,
        reviewCount: 189,
        featured: true,
      },
    ],
  });

  // Kashmir Packages
  await db.package.createMany({
    data: [
      {
        name: 'Kashmir Valley Explorer',
        slug: 'kashmir-valley-5n6d',
        destinationId: kashmir.id,
        category: 'tourism',
        duration: '5N6D',
        nights: 5,
        days: 6,
        price: 17999,
        originalPrice: 22999,
        image: '/images/destinations/kashmir.png',
        description: 'Discover the breathtaking beauty of Kashmir with stays in Srinagar, Gulmarg, and Pahalgam. Experience shikara rides, gondola cable car, and the stunning Mughal Gardens.',
        highlights: 'Shikara Ride on Dal Lake,Gulmarg Gondola,Mughal Gardens,Pahalgam Valley,Betaab Valley',
        included: 'Accommodation,Breakfast & Dinner,Shikara Ride,Airport Transfers,Sightseeing Tours',
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival in Srinagar', desc: 'Airport pickup, shikara ride on Dal Lake, evening visit to Mughal Gardens' },
          { day: 2, title: 'Gulmarg Adventure', desc: 'Drive to Gulmarg, gondola ride to Phase 1 & 2, snow activities' },
          { day: 3, title: 'Pahalgam Valley', desc: 'Drive to Pahalgam, visit Betaab Valley, Aru Valley, and Lidder River' },
          { day: 4, title: 'Srinagar Local', desc: 'Visit Shankaracharya Temple, local market, walnut wood craft shopping' },
          { day: 5, title: 'Sonmarg Day Trip', desc: 'Drive to Sonmarg, Thajiwas Glacier, horse riding' },
          { day: 6, title: 'Departure', desc: 'Morning at leisure, airport drop-off' },
        ]),
        rating: 4.8,
        reviewCount: 456,
        featured: true,
      },
      {
        name: 'Kashmir Honeymoon Delight',
        slug: 'kashmir-honeymoon-6n7d',
        destinationId: kashmir.id,
        category: 'honeymoon',
        duration: '6N7D',
        nights: 6,
        days: 7,
        price: 28999,
        originalPrice: 35999,
        image: '/images/packages/honeymoon.png',
        description: 'A dreamy honeymoon in paradise with luxury houseboat stays, romantic shikara rides, candlelight dinners, and the stunning backdrop of the Himalayas.',
        highlights: 'Luxury Houseboat,Romantic Shikara,Candlelight Dinner,Gulmarg Snow Play,Pahalgam Walks',
        included: 'Premium Houseboat & Hotel,Breakfast & Dinner,Shikara Rides,Candlelight Dinner,Transfers',
        itinerary: JSON.stringify([
          { day: 1, title: 'Welcome to Paradise', desc: 'Airport pickup, check-in to luxury houseboat, romantic shikara ride' },
          { day: 2, title: 'Srinagar Romance', desc: 'Mughal Gardens, floating market visit, candlelight dinner on houseboat' },
          { day: 3, title: 'Gulmarg Magic', desc: 'Gondola ride, snow play together, cozy cafe lunch' },
          { day: 4, title: 'Pahalgam Retreat', desc: 'Drive to Pahalgam, riverside walk, Betaab Valley' },
          { day: 5, title: 'Pahalgam Leisure', desc: 'Aru Valley, horse riding, picnic by the river' },
          { day: 6, title: 'Back to Srinagar', desc: 'Return to Srinagar, shopping for Pashmina, farewell dinner' },
          { day: 7, title: 'Departure', desc: 'Morning at leisure, airport drop-off' },
        ]),
        rating: 4.9,
        reviewCount: 234,
        featured: true,
      },
    ],
  });

  // Goa Packages
  await db.package.createMany({
    data: [
      {
        name: 'Goa Beach Getaway',
        slug: 'goa-beach-4n5d',
        destinationId: goa.id,
        category: 'beach',
        duration: '4N5D',
        nights: 4,
        days: 5,
        price: 12999,
        originalPrice: 16999,
        image: '/images/destinations/goa.png',
        description: 'Sun, sand, and party! Experience Goa\'s best beaches, vibrant nightlife, water sports, Portuguese heritage, and mouthwatering seafood on this unforgettable beach vacation.',
        highlights: 'Baga & Calangute Beach,Water Sports,Dolphelphin Spotting,Old Goa Churches,Spice Plantation',
        included: 'Beach Resort Stay,Breakfast,Water Sports,Spice Plantation Tour,Transfers',
        itinerary: JSON.stringify([
          { day: 1, title: 'Welcome to Goa', desc: 'Airport/railway pickup, check-in to beach resort, evening at Baga Beach' },
          { day: 2, title: 'Beach & Water Sports', desc: 'Calangute Beach, parasailing, jet ski, banana boat rides' },
          { day: 3, title: 'Heritage & Culture', desc: 'Old Goa churches, Basilica of Bom Jesus, Mangueshi Temple, spice plantation' },
          { day: 4, title: 'Adventure Day', desc: 'Dolphin spotting cruise, Aguada Fort, shopping at Anjuna Flea Market' },
          { day: 5, title: 'Departure', desc: 'Morning at leisure, airport/railway drop-off' },
        ]),
        rating: 4.5,
        reviewCount: 567,
        featured: true,
      },
    ],
  });

  // Darjeeling Package
  await db.package.createMany({
    data: [
      {
        name: 'Darjeeling & Sikkim Combo',
        slug: 'darjeeling-sikkim-5n6d',
        destinationId: darjeeling.id,
        category: 'hill-station',
        duration: '5N6D',
        nights: 5,
        days: 6,
        price: 15999,
        originalPrice: 20999,
        image: '/images/destinations/darjeeling.png',
        description: 'Explore the Queen of Hills and the magical land of Sikkim. Witness sunrise at Tiger Hill, ride the toy train, visit Buddhist monasteries, and enjoy stunning mountain views.',
        highlights: 'Tiger Hill Sunrise,Toy Train Ride,Tsomgo Lake,Rumtek Monastery,Batasia Loop',
        included: 'Accommodation,Breakfast & Dinner,Toy Train Ride,Transfers,Sightseeing',
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival in Darjeeling', desc: 'Pickup from NJP/Bagdogra, check-in, evening walk on Mall Road' },
          { day: 2, title: 'Darjeeling Sights', desc: 'Tiger Hill sunrise, Batasia Loop, Toy Train, Tea Garden visit' },
          { day: 3, title: 'Gangtok Bound', desc: 'Drive to Gangtok, evening at MG Marg' },
          { day: 4, title: 'Gangtk Excursion', desc: 'Tsomgo Lake, Baba Mandir, Nathula Pass (if open)' },
          { day: 5, title: 'Sikkim Monasteries', desc: 'Rumtek Monastery, Do Drul Chorten, Institute of Tibetology' },
          { day: 6, title: 'Departure', desc: 'Morning at leisure, drop-off at NJP/Bagdogra' },
        ]),
        rating: 4.6,
        reviewCount: 278,
        featured: true,
      },
    ],
  });

  // Andaman Package
  await db.package.createMany({
    data: [
      {
        name: 'Andaman Island Escape',
        slug: 'andaman-island-5n6d',
        destinationId: andaman.id,
        category: 'beach',
        duration: '5N6D',
        nights: 5,
        days: 6,
        price: 24999,
        originalPrice: 31999,
        image: '/images/destinations/andaman.png',
        description: 'Escape to the pristine islands of Andaman with crystal-clear waters, vibrant coral reefs, and untouched beaches. Perfect for snorkeling, scuba diving, and tropical relaxation.',
        highlights: 'Radhanagar Beach,Scuba Diving,Snorkeling at North Bay,Cellular Jail,Ross Island',
        included: 'Island Resort Stay,Breakfast & Dinner,Scuba Diving,Ferry Transfers,Sightseeing',
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival in Port Blair', desc: 'Airport pickup, Cellular Jail & Light & Sound Show' },
          { day: 2, title: 'North Bay & Ross Island', desc: 'Snorkeling at North Bay, Ross Island exploration' },
          { day: 3, title: 'Havelock Island', desc: 'Ferry to Havelock, Radhanagar Beach - Asia\'s best beach' },
          { day: 4, title: 'Scuba Diving', desc: 'Scuba diving experience, Elephant Beach, water sports' },
          { day: 5, title: 'Port Blair Return', desc: 'Return to Port Blair, Chidiya Tapu, local markets' },
          { day: 6, title: 'Departure', desc: 'Morning at leisure, airport drop-off' },
        ]),
        rating: 4.7,
        reviewCount: 198,
        featured: true,
      },
    ],
  });

  // Manali Packages
  await db.package.createMany({
    data: [
      {
        name: 'Manali Adventure Package',
        slug: 'manali-adventure-4n5d',
        destinationId: manali.id,
        category: 'adventure',
        duration: '4N5D',
        nights: 4,
        days: 5,
        price: 11999,
        originalPrice: 15999,
        image: '/images/packages/adventure.png',
        description: 'An adventure-packed trip to Manali with paragliding, river rafting, trekking, and skiing (seasonal). Experience the thrill of the Himalayas with stunning valley views.',
        highlights: 'Solang Valley,Paragliding,River Rafting in Beas,Hadimba Temple,Old Manali Cafe Hopping',
        included: 'Accommodation,Breakfast & Dinner,Adventure Activities,Transfers,Sightseeing',
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival in Manali', desc: 'Volvo/bus pickup, check-in, evening at Mall Road' },
          { day: 2, title: 'Solang Valley Thrills', desc: 'Paragliding, zorbing, rope way, snow activities (seasonal)' },
          { day: 3, title: 'River Rafting Day', desc: 'Beas river rafting, Hadimba Temple, Vashisht Hot Springs' },
          { day: 4, title: 'Old Manali & Leisure', desc: 'Old Manali cafes, Manu Temple, Jagatsukh, evening free' },
          { day: 5, title: 'Departure', desc: 'Morning at leisure, Volvo/bus drop-off' },
        ]),
        rating: 4.5,
        reviewCount: 389,
        featured: true,
      },
      {
        name: 'Manali Honeymoon Retreat',
        slug: 'manali-honeymoon-5n6d',
        destinationId: manali.id,
        category: 'honeymoon',
        duration: '5N6D',
        nights: 5,
        days: 6,
        price: 19999,
        originalPrice: 25999,
        image: '/images/packages/honeymoon.png',
        description: 'A romantic escape to the mountains with cozy resort stays, candlelight dinners, scenic walks, and unforgettable sunsets. The perfect honeymoon in the Himalayas.',
        highlights: 'Candlelight Dinner,Solang Valley Visit,Romantic Mountain Walks,Hot Spring Bath,Couples Activity',
        included: 'Premium Resort,Breakfast & Dinner,Candlelight Dinner,Sightseeing,Transfers',
        itinerary: JSON.stringify([
          { day: 1, title: 'Welcome to the Mountains', desc: 'Pickup, check-in to premium resort, welcome drinks, evening walk' },
          { day: 2, title: 'Solang Valley Romance', desc: 'Solang Valley visit, gondola ride, snow play, hot chocolate dates' },
          { day: 3, title: 'Manali Local', desc: 'Hadimba Temple, Club House, Vashisht Hot Spring bath together' },
          { day: 4, title: 'Naggar Castle', desc: 'Day trip to Naggar, Roerich Art Gallery, castle visit, riverside picnic' },
          { day: 5, title: 'Leisure & Love', desc: 'Free day for shopping, cafes, candlelight farewell dinner' },
          { day: 6, title: 'Departure', desc: 'Morning at leisure, drop-off' },
        ]),
        rating: 4.8,
        reviewCount: 167,
        featured: true,
      },
    ],
  });

  // Delhi Golden Triangle
  await db.package.createMany({
    data: [
      {
        name: 'Golden Triangle Tour',
        slug: 'golden-triangle-5n6d',
        destinationId: delhi.id,
        category: 'tourism',
        duration: '5N6D',
        nights: 5,
        days: 6,
        price: 15999,
        originalPrice: 19999,
        image: '/images/destinations/delhi.png',
        description: 'Explore India\'s most iconic circuit — Delhi, Agra, and Jaipur. Visit the magnificent Taj Mahal, explore majestic forts, and experience the vibrant culture of Rajasthan.',
        highlights: 'Taj Mahal at Sunrise,Amber Fort Jaipur,India Gate,Qutub Minar,Hawa Mahal',
        included: 'Accommodation,Breakfast & Dinner,All Transfers,Monument Entries,Guide',
        itinerary: JSON.stringify([
          { day: 1, title: 'Delhi Arrival', desc: 'Airport pickup, India Gate, Rashtrapati Bhavan drive past' },
          { day: 2, title: 'Delhi to Agra', desc: 'Drive to Agra, Taj Mahal visit at sunset, Agra Fort' },
          { day: 3, title: 'Agra to Jaipur', desc: 'Sunrise Taj Mahal, Fatehpur Sikri, drive to Jaipur' },
          { day: 4, title: 'Jaipur Exploration', desc: 'Amber Fort, City Palace, Hawa Mahal, Jantar Mantar' },
          { day: 5, title: 'Jaipur to Delhi', desc: 'Morning at leisure, drive back to Delhi, local markets' },
          { day: 6, title: 'Delhi & Departure', desc: 'Qutub Minar, Humayun\'s Tomb, Lotus Temple, airport drop' },
        ]),
        rating: 4.7,
        reviewCount: 623,
        featured: true,
      },
    ],
  });

  // Sikkim Package
  await db.package.createMany({
    data: [
      {
        name: 'Sikkim Serenity Tour',
        slug: 'sikkim-serenity-5n6d',
        destinationId: sikkim.id,
        category: 'hill-station',
        duration: '5N6D',
        nights: 5,
        days: 6,
        price: 16999,
        originalPrice: 21999,
        image: '/images/destinations/sikkim.png',
        description: 'Discover the mystical beauty of Sikkim with its ancient monasteries, pristine lakes, and panoramic mountain views. A journey of peace and natural wonder.',
        highlights: 'Tsomgo Lake,Nathula Pass,Rumtek Monastery,Pelling Skywalk,Kanchenjunga View',
        included: 'Accommodation,Breakfast & Dinner,Permits,Transfers,Sightseeing',
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival in Gangtok', desc: 'Pickup from NJP/Bagdogra, check-in, evening at MG Marg' },
          { day: 2, title: 'Gangtok Excursion', desc: 'Tsomgo Lake, Baba Mandir, Nathula Pass' },
          { day: 3, title: 'Gangtok to Pelling', desc: 'Rumtek Monastery, drive to Pelling via Ravangla' },
          { day: 4, title: 'Pelling Sights', desc: 'Pelling Skywalk, Kanchenjunga Falls, Rabdentse Ruins' },
          { day: 5, title: 'Pelling to Gangtok', desc: 'Return to Gangtok, Do Drul Chorten, flower exhibition' },
          { day: 6, title: 'Departure', desc: 'Morning at leisure, drop-off' },
        ]),
        rating: 4.6,
        reviewCount: 145,
        featured: false,
      },
    ],
  });

  // Himachal Package
  await db.package.createMany({
    data: [
      {
        name: 'Himachal Himalayan Journey',
        slug: 'himachal-himalayan-6n7d',
        destinationId: himachal.id,
        category: 'hill-station',
        duration: '6N7D',
        nights: 6,
        days: 7,
        price: 21999,
        originalPrice: 27999,
        image: '/images/destinations/himachal.png',
        description: 'A complete Himachal Pradesh experience covering Shimla, Manali, and Dharamshala. From colonial charm to adventure sports and Tibetan culture, this trip has it all.',
        highlights: 'Shimla Mall Road,Manali Solang Valley,Dharamshala Cricket Stadium,Toy Train,Kullu Valley',
        included: 'Accommodation,Breakfast & Dinner,Toy Train,Transfers,Sightseeing',
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival in Shimla', desc: 'Pickup from Kalka/Chandigarh, check-in, evening on Mall Road' },
          { day: 2, title: 'Shimla Sights', desc: 'Kufri, Jakhoo Temple, Christ Church, Lakkar Bazaar' },
          { day: 3, title: 'Shimla to Manali', desc: 'Scenic drive via Kullu, check-in Manali, Hadimba Temple' },
          { day: 4, title: 'Manali Adventure', desc: 'Solang Valley, adventure activities, river rafting' },
          { day: 5, title: 'Manali to Dharamshala', desc: 'Drive to Dharamshala, evening at McLeod Ganj' },
          { day: 6, title: 'Dharamshala Exploration', desc: 'Bhagsu Waterfall, Dal Lake, St. John\'s Church, local markets' },
          { day: 7, title: 'Departure', desc: 'Morning at leisure, drop-off at Pathankot/Kangra' },
        ]),
        rating: 4.7,
        reviewCount: 234,
        featured: true,
      },
    ],
  });

  // Dharamshala Package
  await db.package.createMany({
    data: [
      {
        name: 'Dharamshala & McLeod Ganj',
        slug: 'dharamshala-mcleod-4n5d',
        destinationId: dharamshala.id,
        category: 'hill-station',
        duration: '4N5D',
        nights: 4,
        days: 5,
        price: 12999,
        originalPrice: 16999,
        image: '/images/destinations/dharamshala.png',
        description: 'Experience the serene beauty of Dharamshala and McLeod Ganj with Tibetan culture, stunning mountain views, and peaceful monasteries. A perfect mountain retreat.',
        highlights: 'McLeod Ganj,Bhagsu Waterfall,Dal Lake,Tibetan Markets,Mountain Views',
        included: 'Accommodation,Breakfast & Dinner,Transfers,Sightseeing,Guide',
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival in Dharamshala', desc: 'Pickup from Pathankot/Kangra, check-in, evening at McLeod Ganj' },
          { day: 2, title: 'McLeod Ganj Exploration', desc: 'Bhagsu Temple & Waterfall, Dal Lake, Tibetan markets' },
          { day: 3, title: 'Triund Trek', desc: 'Day trek to Triund, panoramic mountain views, return by evening' },
          { day: 4, title: 'Dharamshala Local', desc: 'Cricket Stadium, St. John\'s Church, War Memorial, Kangra Fort' },
          { day: 5, title: 'Departure', desc: 'Morning at leisure, drop-off' },
        ]),
        rating: 4.5,
        reviewCount: 112,
        featured: false,
      },
    ],
  });

  // ============ INTERNATIONAL PACKAGES ============
  // Dubai Packages
  await db.package.createMany({
    data: [
      {
        name: 'Dubai Luxury Experience',
        slug: 'dubai-luxury-4n5d',
        destinationId: dubai.id,
        category: 'tourism',
        duration: '4N5D',
        nights: 4,
        days: 5,
        price: 44999,
        originalPrice: 54999,
        image: '/images/destinations/dubai.png',
        description: 'Experience the glitz and glamour of Dubai with Burj Khalifa, desert safari, dhow cruise, and world-class shopping. A luxurious getaway in the city of gold.',
        highlights: 'Burj Khalifa,Desert Safari,Dhow Cruise,Dubai Mall,Marina Walk',
        included: '4-star Hotel,Breakfast,Desert Safari,Burj Khalifa Ticket,Transfers',
        itinerary: JSON.stringify([
          { day: 1, title: 'Welcome to Dubai', desc: 'Airport pickup, check-in, evening Dhow Cruise in Dubai Marina' },
          { day: 2, title: 'Dubai City Tour', desc: 'Burj Khalifa, Dubai Mall, Dubai Frame, Jumeirah Beach' },
          { day: 3, title: 'Desert Adventure', desc: 'Morning free, afternoon desert safari with BBQ dinner & belly dance' },
          { day: 4, title: 'Shopping & Leisure', desc: 'Gold Souk, Spice Souk, Miracle Garden, evening at Palm Jumeirah' },
          { day: 5, title: 'Departure', desc: 'Morning at leisure, airport drop-off' },
        ]),
        rating: 4.8,
        reviewCount: 567,
        featured: true,
      },
      {
        name: 'Dubai Honeymoon Special',
        slug: 'dubai-honeymoon-5n6d',
        destinationId: dubai.id,
        category: 'honeymoon',
        duration: '5N6D',
        nights: 5,
        days: 6,
        price: 59999,
        originalPrice: 74999,
        image: '/images/packages/honeymoon.png',
        description: 'A romantic honeymoon in Dubai with luxury stays, private desert dinner, couples spa, and unforgettable skyline views. The perfect blend of romance and luxury.',
        highlights: 'Private Desert Dinner,Burj Khalifa At The Top,Couples Spa,Yacht Cruise,Fine Dining',
        included: '5-star Hotel,Breakfast,Private Desert Dinner,Burj Khalifa,Transfers',
        itinerary: JSON.stringify([
          { day: 1, title: 'Romantic Arrival', desc: 'Airport pickup in luxury car, check-in, welcome cake & flowers' },
          { day: 2, title: 'Dubai Wonders', desc: 'Burj Khalifa, Dubai Mall, evening yacht cruise for two' },
          { day: 3, title: 'Desert Romance', desc: 'Private desert dinner under the stars, camel ride, stargazing' },
          { day: 4, title: 'Couples Spa Day', desc: 'Full day couples spa, evening at La Mer beach' },
          { day: 5, title: 'Shopping & Celebration', desc: 'Dubai Marina, Mall of Emirates, farewell dinner at fine restaurant' },
          { day: 6, title: 'Departure', desc: 'Morning at leisure, luxury airport drop-off' },
        ]),
        rating: 4.9,
        reviewCount: 234,
        featured: true,
      },
    ],
  });

  // Maldives Packages
  await db.package.createMany({
    data: [
      {
        name: 'Maldives Paradise Escape',
        slug: 'maldives-paradise-4n5d',
        destinationId: maldives.id,
        category: 'honeymoon',
        duration: '4N5D',
        nights: 4,
        days: 5,
        price: 79999,
        originalPrice: 99999,
        image: '/images/destinations/maldives.png',
        description: 'The ultimate tropical paradise experience with overwater villa, crystal-clear lagoon, underwater restaurant, and sunset dolphin cruise. A once-in-a-lifetime luxury escape.',
        highlights: 'Overwater Villa,Snorkeling with Mantas,Sunset Dolphin Cruise,Underwater Dining,Spa Over Water',
        included: 'Overwater Villa,All Meals,Snorkeling,Dolphin Cruise,Speedboat Transfers',
        itinerary: JSON.stringify([
          { day: 1, title: 'Welcome to Paradise', desc: 'Speedboat transfer to resort, welcome drink, check-in to overwater villa' },
          { day: 2, title: 'Ocean Adventures', desc: 'Snorkeling with manta rays, sandbank picnic, sunset dolphin cruise' },
          { day: 3, title: 'Luxury & Relaxation', desc: 'Couples spa, underwater restaurant lunch, bioluminescent beach night' },
          { day: 4, title: 'Island Exploration', desc: 'Local island visit, water sports, farewell dinner on the beach' },
          { day: 5, title: 'Departure', desc: 'Morning swim, breakfast, speedboat to airport' },
        ]),
        rating: 4.9,
        reviewCount: 345,
        featured: true,
      },
    ],
  });

  // Thailand Packages
  await db.package.createMany({
    data: [
      {
        name: 'Thailand Explorer',
        slug: 'thailand-explorer-5n6d',
        destinationId: thailand.id,
        category: 'tourism',
        duration: '5N6D',
        nights: 5,
        days: 6,
        price: 32999,
        originalPrice: 39999,
        image: '/images/destinations/thailand.png',
        description: 'Explore the best of Thailand from Bangkok\'s vibrant streets to Phuket\'s stunning beaches. Temples, street food, island hopping, and nightlife — Thailand has it all!',
        highlights: 'Grand Palace Bangkok,Phi Phi Island Tour,Phuket Beaches,Floating Market,Thai Massage',
        included: 'Hotels,Breakfast,Phi Phi Island Tour,City Tour,Transfers',
        itinerary: JSON.stringify([
          { day: 1, title: 'Welcome to Bangkok', desc: 'Airport pickup, check-in, evening street food tour' },
          { day: 2, title: 'Bangkok Explorer', desc: 'Grand Palace, Wat Pho, Wat Arun, floating market, Thai massage' },
          { day: 3, title: 'Fly to Phuket', desc: 'Morning flight, check-in, Patong Beach evening' },
          { day: 4, title: 'Phi Phi Islands', desc: 'Full day Phi Phi Island tour, Maya Bay, snorkeling' },
          { day: 5, title: 'Phuket Leisure', desc: 'Free day for beaches, water sports, or Phang Nga Bay tour' },
          { day: 6, title: 'Departure', desc: 'Morning at leisure, airport drop-off' },
        ]),
        rating: 4.6,
        reviewCount: 789,
        featured: true,
      },
    ],
  });

  // Singapore Package
  await db.package.createMany({
    data: [
      {
        name: 'Singapore Delight',
        slug: 'singapore-delight-4n5d',
        destinationId: singapore.id,
        category: 'tourism',
        duration: '4N5D',
        nights: 4,
        days: 5,
        price: 38999,
        originalPrice: 45999,
        image: '/images/destinations/singapore.png',
        description: 'Experience the futuristic city of Singapore with Gardens by the Bay, Universal Studios, Sentosa Island, and the iconic Marina Bay Sands. A perfect family destination.',
        highlights: 'Gardens by the Bay,Universal Studios,Sentosa Island,Marina Bay Sands,Night Safari',
        included: 'Hotel,Breakfast,Universal Studios Ticket,City Tour,Transfers',
        itinerary: JSON.stringify([
          { day: 1, title: 'Welcome to Singapore', desc: 'Airport pickup, check-in, Gardens by the Bay, Marina Bay light show' },
          { day: 2, title: 'Universal Studios', desc: 'Full day at Universal Studios Singapore' },
          { day: 3, title: 'Sentosa Island', desc: 'Sentosa attractions, beach time, Wings of Time show' },
          { day: 4, title: 'City & Culture', desc: 'Chinatown, Little India, Night Safari, Orchard Road shopping' },
          { day: 5, title: 'Departure', desc: 'Morning at leisure, airport drop-off' },
        ]),
        rating: 4.7,
        reviewCount: 456,
        featured: true,
      },
    ],
  });

  // Malaysia Package
  await db.package.createMany({
    data: [
      {
        name: 'Malaysia & Singapore Combo',
        slug: 'malaysia-singapore-6n7d',
        destinationId: malaysia.id,
        category: 'tourism',
        duration: '6N7D',
        nights: 6,
        days: 7,
        price: 42999,
        originalPrice: 52999,
        image: '/images/destinations/malaysia.png',
        description: 'The best of two amazing countries! Explore Kuala Lumpur\'s Petronas Towers, Genting Highlands, and then Singapore\'s iconic attractions. Double the fun!',
        highlights: 'Petronas Twin Towers,Genting Highlands,Batu Caves,Gardens by the Bay,Universal Studios',
        included: 'Hotels,Breakfast,City Tours,Universal Studios,Transfers',
        itinerary: JSON.stringify([
          { day: 1, title: 'Welcome to KL', desc: 'Airport pickup, check-in, Petronas Towers at night' },
          { day: 2, title: 'KL Explorer', desc: 'Batu Caves, King\'s Palace, National Mosque, Chinatown' },
          { day: 3, title: 'Genting Highlands', desc: 'Cable car ride, theme park, casino, return to KL' },
          { day: 4, title: 'Fly to Singapore', desc: 'Flight to Singapore, check-in, Marina Bay evening' },
          { day: 5, title: 'Universal Studios', desc: 'Full day at Universal Studios' },
          { day: 6, title: 'Singapore Sights', desc: 'Gardens by the Bay, Sentosa, Night Safari' },
          { day: 7, title: 'Departure', desc: 'Morning at leisure, airport drop-off' },
        ]),
        rating: 4.6,
        reviewCount: 345,
        featured: true,
      },
    ],
  });

  // Bali Package
  await db.package.createMany({
    data: [
      {
        name: 'Bali Romantic Getaway',
        slug: 'bali-romantic-5n6d',
        destinationId: bali.id,
        category: 'honeymoon',
        duration: '5N6D',
        nights: 5,
        days: 6,
        price: 45999,
        originalPrice: 55999,
        image: '/images/destinations/bali.png',
        description: 'A romantic escape to Bali with private pool villas, sunset temple visits, rice terrace walks, and couples spa. The Island of the Gods sets the stage for love.',
        highlights: 'Private Pool Villa,Uluwatu Temple Sunset,Tegallalang Rice Terraces,Couples Spa,Mount Batur Sunrise',
        included: 'Private Villa,Breakfast,Couples Spa,Sunset Dinner,Transfers',
        itinerary: JSON.stringify([
          { day: 1, title: 'Welcome to Bali', desc: 'Airport pickup, check-in to private pool villa, welcome flower bath' },
          { day: 2, title: 'Ubud & Culture', desc: 'Tegallalang Rice Terraces, Monkey Forest, traditional dance show' },
          { day: 3, title: 'Adventure Day', desc: 'Mount Batur sunrise trek, coffee plantation, Tirta Empul temple' },
          { day: 4, title: 'Beach & Relaxation', desc: 'Seminyak Beach, couples Balinese spa, beach club' },
          { day: 5, title: 'Uluwatu & Sunset', desc: 'Uluwatu Temple, Kecak dance, cliffside sunset dinner' },
          { day: 6, title: 'Departure', desc: 'Morning at leisure, airport drop-off' },
        ]),
        rating: 4.8,
        reviewCount: 267,
        featured: true,
      },
    ],
  });

  // Sri Lanka Package
  await db.package.createMany({
    data: [
      {
        name: 'Sri Lanka Cultural Tour',
        slug: 'srilanka-cultural-5n6d',
        destinationId: srilanka.id,
        category: 'tourism',
        duration: '5N6D',
        nights: 5,
        days: 6,
        price: 29999,
        originalPrice: 36999,
        image: '/images/destinations/srilanka.png',
        description: 'Discover the Pearl of the Indian Ocean with ancient ruins, lush tea plantations, wildlife safaris, and golden beaches. Sri Lanka offers incredible diversity in a compact island.',
        highlights: 'Sigiriya Rock Fortress,Tea Plantations,Yala Safari,Galle Fort,Bentota Beach',
        included: 'Hotels,Breakfast & Dinner,Safari,City Tour,Transfers',
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival in Colombo', desc: 'Airport pickup, drive to Sigiriya, evening at leisure' },
          { day: 2, title: 'Sigiriya & Dambulla', desc: 'Sigiriya Rock climb, Dambulla Cave Temple' },
          { day: 3, title: 'Kandy & Tea', desc: 'Drive to Kandy, Temple of the Tooth, tea plantation visit' },
          { day: 4, title: 'Yala Safari', desc: 'Drive to Yala, afternoon wildlife safari' },
          { day: 5, title: 'Galle & Beach', desc: 'Galle Fort exploration, Bentota Beach relaxation' },
          { day: 6, title: 'Departure', desc: 'Colombo city tour, airport drop-off' },
        ]),
        rating: 4.5,
        reviewCount: 178,
        featured: false,
      },
    ],
  });

  // Vietnam Package
  await db.package.createMany({
    data: [
      {
        name: 'Vietnam Discovery',
        slug: 'vietnam-discovery-5n6d',
        destinationId: vietnam.id,
        category: 'tourism',
        duration: '5N6D',
        nights: 5,
        days: 6,
        price: 27999,
        originalPrice: 34999,
        image: '/images/destinations/vietnam.png',
        description: 'From the emerald waters of Ha Long Bay to the lantern-lit streets of Hoi An, Vietnam captivates with its beauty, history, and incredible cuisine. An affordable yet unforgettable experience.',
        highlights: 'Ha Long Bay Cruise,Hoi An Ancient Town,Ha Noi Old Quarter,Cu Chi Tunnels,Mekong Delta',
        included: 'Hotels,Breakfast,Ha Long Bay Cruise,City Tours,Transfers',
        itinerary: JSON.stringify([
          { day: 1, title: 'Welcome to Hanoi', desc: 'Airport pickup, Old Quarter walk, street food tour' },
          { day: 2, title: 'Ha Long Bay', desc: 'Cruise through limestone karsts, cave visits, sunset on deck' },
          { day: 3, title: 'Hanoi to Da Nang', desc: 'Flight to Da Nang, Marble Mountains, Hoi An evening' },
          { day: 4, title: 'Hoi An Magic', desc: 'Ancient town exploration, lantern boat ride, cooking class' },
          { day: 5, title: 'Ho Chi Minh City', desc: 'Flight to HCMC, Cu Chi Tunnels, War Museum, Ben Thanh Market' },
          { day: 6, title: 'Departure', desc: 'Mekong Delta morning tour, airport drop-off' },
        ]),
        rating: 4.6,
        reviewCount: 156,
        featured: false,
      },
    ],
  });

  // Nepal Package
  await db.package.createMany({
    data: [
      {
        name: 'Nepal Himalayan Adventure',
        slug: 'nepal-himalayan-5n6d',
        destinationId: nepal.id,
        category: 'adventure',
        duration: '5N6D',
        nights: 5,
        days: 6,
        price: 21999,
        originalPrice: 26999,
        image: '/images/destinations/nepal.png',
        description: 'Experience the majesty of the Himalayas in Nepal with temple visits in Kathmandu, lakeside serenity in Pokhara, and stunning mountain views. An affordable yet epic adventure.',
        highlights: 'Pashupatinath Temple,Phewa Lake,Sarangkot Sunrise,World Peace Pagoda,Nagarkot Himalayan View',
        included: 'Hotels,Breakfast & Dinner,City Tours,Sarangkot Trip,Transfers',
        itinerary: JSON.stringify([
          { day: 1, title: 'Welcome to Kathmandu', desc: 'Airport pickup, Thamel exploration, welcome dinner' },
          { day: 2, title: 'Kathmandu Valley', desc: 'Pashupatinath, Boudhanath, Swayambhunath (Monkey Temple)' },
          { day: 3, title: 'Fly to Pokhara', desc: 'Flight to Pokhara, Phewa Lake boating, Lakeside evening' },
          { day: 4, title: 'Pokhara Sights', desc: 'Sarangkot sunrise, Davis Falls, Gupteshwor Cave, Peace Pagoda' },
          { day: 5, title: 'Nagarkot', desc: 'Return to Kathmandu, drive to Nagarkot, Himalayan sunset' },
          { day: 6, title: 'Departure', desc: 'Sunrise over Himalayas, Bhaktapur Durbar Square, airport drop' },
        ]),
        rating: 4.6,
        reviewCount: 189,
        featured: true,
      },
    ],
  });

  // ============ HOTELS ============
  const hotels = [
    // Domestic Hotels
    { name: 'Taj Malabar Resort & Spa', slug: 'taj-malabar-kerala', destId: kerala.id, cat: 'luxury', stars: 5, price: 12000, orig: 15000, img: '/images/hotels/luxury-resort.png', desc: 'A luxury waterfront resort on Willingdon Island offering world-class amenities, Ayurvedic spa, and stunning views of the Kochi harbor.', amenities: 'Swimming Pool,Ayurvedic Spa,Multi-cuisine Restaurant,Bar,Wi-Fi,Room Service,Concierge', rating: 4.8, reviews: 234, featured: true },
    { name: 'Coconut Lagoon Resort', slug: 'coconut-lagoon-kerala', destId: kerala.id, cat: 'resort', stars: 4, price: 8000, orig: 10000, img: '/images/hotels/luxury-resort.png', desc: 'A heritage resort set on the banks of Vembanad Lake, offering authentic Kerala experiences with houseboat stays and traditional cuisine.', amenities: 'Heritage Rooms,Swimming Pool,Ayurvedic Spa,Lake View Restaurant,Wi-Fi,Cycling', rating: 4.6, reviews: 189, featured: false },
    { name: 'The Lalit Grand Palace', slug: 'lalit-grand-kashmir', destId: kashmir.id, cat: 'luxury', stars: 5, price: 15000, orig: 18000, img: '/images/hotels/luxury-resort.png', desc: 'A grand palace hotel overlooking Dal Lake with magnificent Mughal-inspired architecture, lush gardens, and world-class hospitality.', amenities: 'Heated Pool,Spa,Fine Dining,Golf Course,Wi-Fi,Room Service,Royal Suites', rating: 4.9, reviews: 312, featured: true },
    { name: 'Houseboat Heavenly Kashmir', slug: 'houseboat-kashmir', destId: kashmir.id, cat: 'boutique', stars: 4, price: 6500, orig: 8500, img: '/images/hotels/beach-hotel.png', desc: 'Experience authentic Kashmiri hospitality on a luxury houseboat on Dal Lake with carved walnut interiors and traditional Kashmiri cuisine.', amenities: 'Lake View,Traditional Cuisine,Shikara Rides,Room Service,Cultural Evenings', rating: 4.7, reviews: 278, featured: true },
    { name: 'Taj Holiday Village Goa', slug: 'taj-holiday-goa', destId: goa.id, cat: 'resort', stars: 5, price: 10000, orig: 13000, img: '/images/hotels/beach-hotel.png', desc: 'A charming Portuguese-style resort on Sinquerim Beach with lush tropical gardens, multiple pools, and direct beach access.', amenities: 'Beach Access,3 Swimming Pools,Spa,3 Restaurants,Bar,Wi-Fi,Water Sports', rating: 4.7, reviews: 456, featured: true },
    { name: 'Windamere Hotel Darjeeling', slug: 'windamere-darjeeling', destId: darjeeling.id, cat: 'boutique', stars: 4, price: 7000, orig: 9000, img: '/images/hotels/mountain-resort.png', desc: 'A colonial heritage hotel on Observatory Hill offering old-world charm, roaring fireplaces, and panoramic views of the Himalayas.', amenities: 'Heritage Rooms,Fireplace,Mountain View,Dining Room,High Tea,Gardens,Wi-Fi', rating: 4.8, reviews: 167, featured: true },
    { name: 'Wildflower Hall Shimla', slug: 'wildflower-shimla', destId: himachal.id, cat: 'luxury', stars: 5, price: 18000, orig: 22000, img: '/images/hotels/mountain-resort.png', desc: 'A luxury Oberoi resort at 8,250 feet offering panoramic Himalayan views, world-class spa, and colonial elegance in the lap of nature.', amenities: 'Infinity Pool,Spa,Fine Dining,Mountain View,Trekking,Library,Wi-Fi', rating: 4.9, reviews: 189, featured: true },
    { name: 'Welcomhotel By ITC Bay Island', slug: 'welcomhotel-andaman', destId: andaman.id, cat: 'resort', stars: 4, price: 9000, orig: 11000, img: '/images/hotels/beach-hotel.png', desc: 'A beautiful beachfront resort in Port Blair offering stunning ocean views, water sports, and easy access to the best Andaman attractions.', amenities: 'Beach Access,Pool,Water Sports,Restaurant,Bar,Wi-Fi,Scuba Center', rating: 4.5, reviews: 145, featured: false },
    { name: 'The Taj Palace Delhi', slug: 'taj-palace-delhi', destId: delhi.id, cat: 'luxury', stars: 5, price: 14000, orig: 17000, img: '/images/hotels/luxury-resort.png', desc: 'An iconic luxury hotel in the heart of New Delhi offering world-class dining, spa, and impeccable service near major attractions.', amenities: 'Swimming Pool,Spa,6 Restaurants,Bar,Business Center,Wi-Fi,Concierge', rating: 4.8, reviews: 567, featured: true },
    { name: 'The Leela Palace Manali', slug: 'leela-manali', destId: manali.id, cat: 'luxury', stars: 5, price: 13000, orig: 16000, img: '/images/hotels/mountain-resort.png', desc: 'A riverside luxury resort in Manali with stunning mountain views, heated pools, and adventure sports facilities.', amenities: 'Heated Pool,Spa,River View,Adventure Desk,Restaurant,Bar,Wi-Fi', rating: 4.7, reviews: 234, featured: false },

    // International Hotels
    { name: 'Burj Al Arab Dubai', slug: 'burj-al-arab-dubai', destId: dubai.id, cat: 'luxury', stars: 5, price: 65000, orig: 80000, img: '/images/hotels/luxury-resort.png', desc: 'The world\'s most luxurious hotel, shaped like a sail on its own island. Offers unparalleled opulence, 9 restaurants, and a private beach.', amenities: 'Private Beach,9 Restaurants,Spa,Butler Service,Helipad,Rolls Royce Transfer,Wi-Fi', rating: 4.9, reviews: 678, featured: true },
    { name: 'Atlantis The Palm Dubai', slug: 'atlantis-dubai', destId: dubai.id, cat: 'resort', stars: 5, price: 25000, orig: 30000, img: '/images/hotels/beach-hotel.png', desc: 'An iconic resort on Palm Jumeirah with Aquaventure Waterpark, private beach, underwater aquarium, and 23 restaurants.', amenities: 'Waterpark,Aquarium,Private Beach,23 Restaurants,Spa,Kids Club,Wi-Fi', rating: 4.7, reviews: 890, featured: true },
    { name: 'Soneva Fushi Maldives', slug: 'soneva-fushi-maldives', destId: maldives.id, cat: 'luxury', stars: 5, price: 85000, orig: 100000, img: '/images/hotels/beach-hotel.png', desc: 'A barefoot luxury resort with private villa, personal butler, world-class snorkeling, and an observatory for stargazing.', amenities: 'Private Villa,Personal Butler,Snorkeling,Observatory,Spa,Multi-cuisine,Wi-Fi', rating: 4.9, reviews: 234, featured: true },
    { name: 'Marina Bay Sands Singapore', slug: 'marina-bay-sands', destId: singapore.id, cat: 'luxury', stars: 5, price: 35000, orig: 42000, img: '/images/hotels/luxury-resort.png', desc: 'The iconic three-tower hotel with the world-famous infinity pool on the 57th floor, offering breathtaking views of the Singapore skyline.', amenities: 'Infinity Pool,SkyPark,20 Restaurants,Casino,Spa,Shopping Mall,Wi-Fi', rating: 4.8, reviews: 1234, featured: true },
    { name: 'Mandarin Oriental Bangkok', slug: 'mandarin-oriental-bangkok', destId: thailand.id, cat: 'luxury', stars: 5, price: 20000, orig: 25000, img: '/images/hotels/luxury-resort.png', desc: 'A legendary riverside hotel offering timeless elegance, world-class dining, and authentic Thai experiences in the heart of Bangkok.', amenities: 'River View,Spa,3 Restaurants,Cooking School,River Cruise,Wi-Fi,Butler', rating: 4.8, reviews: 567, featured: false },
    { name: 'COMO Uma Canggu Bali', slug: 'como-uma-bali', destId: bali.id, cat: 'boutique', stars: 5, price: 18000, orig: 22000, img: '/images/hotels/beach-hotel.png', desc: 'A chic beachfront resort in Bali with surf school, holistic wellness programs, and stunning ocean views from every room.', amenities: 'Beachfront,Surf School,Wellness Center,Pool,Restaurant,Yoga,Wi-Fi', rating: 4.7, reviews: 189, featured: false },
    { name: 'Shangri-La Kuala Lumpur', slug: 'shangri-la-kl', destId: malaysia.id, cat: 'luxury', stars: 5, price: 12000, orig: 15000, img: '/images/hotels/luxury-resort.png', desc: 'A premier luxury hotel with stunning Petronas Twin Towers views, award-winning restaurants, and a serene spa in the heart of KL.', amenities: 'Pool,Spa,5 Restaurants,Bar,Gym,Petronas View,Wi-Fi', rating: 4.7, reviews: 345, featured: false },
  ];

  for (const hotel of hotels) {
    await db.hotel.create({
      data: {
        name: hotel.name,
        slug: hotel.slug,
        destinationId: hotel.destId,
        category: hotel.cat,
        stars: hotel.stars,
        pricePerNight: hotel.price,
        originalPrice: hotel.orig,
        image: hotel.img,
        description: hotel.desc,
        amenities: hotel.amenities,
        rating: hotel.rating,
        reviewCount: hotel.reviews,
        featured: hotel.featured,
      },
    });
  }

  // ============ FLIGHT DEALS ============
  const flightDeals = [
    { from: 'Delhi', to: 'Dubai', airline: 'Emirates', price: 15999, orig: 22000, type: 'round-trip', img: '/images/flights-hero.png', desc: 'Direct flight to Dubai with Emirates. Includes meals, entertainment, and 30kg baggage.', featured: true },
    { from: 'Mumbai', to: 'Maldives', airline: 'IndiGo', price: 18999, orig: 25000, type: 'round-trip', img: '/images/flights-hero.png', desc: 'Connecting flight to Malé via IndiGo. Great value for a paradise escape.', featured: true },
    { from: 'Delhi', to: 'Bangkok', airline: 'Thai Airways', price: 16999, orig: 23000, type: 'round-trip', img: '/images/flights-hero.png', desc: 'Direct flight to Bangkok with Thai Airways. Full service with meals and entertainment.', featured: true },
    { from: 'Mumbai', to: 'Singapore', airline: 'Singapore Airlines', price: 21999, orig: 29000, type: 'round-trip', img: '/images/flights-hero.png', desc: 'Premium direct flight to Singapore. World-class service and comfort.', featured: true },
    { from: 'Delhi', to: 'Kathmandu', airline: 'IndiGo', price: 7999, orig: 11000, type: 'round-trip', img: '/images/flights-hero.png', desc: 'Quick direct flight to Kathmandu. Perfect for a Himalayan adventure.', featured: false },
    { from: 'Chennai', to: 'Colombo', airline: 'SriLankan Airlines', price: 9999, orig: 14000, type: 'round-trip', img: '/images/flights-hero.png', desc: 'Short direct flight to Colombo. Start your Sri Lankan adventure quickly.', featured: false },
    { from: 'Delhi', to: 'Srinagar', airline: 'Air India', price: 5999, orig: 8500, type: 'round-trip', img: '/images/flights-hero.png', desc: 'Direct flight to Srinagar. Gateway to the paradise of Kashmir.', featured: true },
    { from: 'Mumbai', to: 'Goa', airline: 'Vistara', price: 4499, orig: 6500, type: 'round-trip', img: '/images/flights-hero.png', desc: 'Quick direct flight to Goa. Sun, sand, and fun await!', featured: true },
    { from: 'Kolkata', to: 'Port Blair', airline: 'Air India', price: 8999, orig: 12000, type: 'round-trip', img: '/images/flights-hero.png', desc: 'Direct flight to Port Blair. Your Andaman island adventure starts here.', featured: false },
    { from: 'Delhi', to: 'Kuala Lumpur', airline: 'Malaysia Airlines', price: 18999, orig: 25000, type: 'round-trip', img: '/images/flights-hero.png', desc: 'Direct flight to Kuala Lumpur with full service and great comfort.', featured: false },
    { from: 'Mumbai', to: 'Bali', airline: 'Garuda Indonesia', price: 24999, orig: 32000, type: 'round-trip', img: '/images/flights-hero.png', desc: 'Connecting flight to Denpasar, Bali. Premium service included.', featured: false },
    { from: 'Delhi', to: 'Ho Chi Minh', airline: 'Vietnam Airlines', price: 19999, orig: 26000, type: 'round-trip', img: '/images/flights-hero.png', desc: 'Direct flight to Ho Chi Minh City. Discover the charm of Vietnam.', featured: false },
  ];

  for (const deal of flightDeals) {
    await db.flightDeal.create({
      data: {
        from: deal.from,
        to: deal.to,
        airline: deal.airline,
        price: deal.price,
        originalPrice: deal.orig,
        type: deal.type,
        image: deal.img,
        description: deal.desc,
        featured: deal.featured,
      },
    });
  }

  console.log('✅ Seeding completed!');
  console.log(`📍 Destinations: ${await db.destination.count()}`);
  console.log(`📦 Packages: ${await db.package.count()}`);
  console.log(`🏨 Hotels: ${await db.hotel.count()}`);
  console.log(`✈️ Flight Deals: ${await db.flightDeal.count()}`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
