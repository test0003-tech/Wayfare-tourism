// Blog data store for Wayfare Travel
// Static blog articles with rich content

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  date: string;
  category: string;
  image: string;
  readingTime: string;
  tags: string[];
  featured: boolean;
}

export const blogCategories = [
  'Destinations',
  'Tips',
  'Guides',
  'News',
  'Reviews',
] as const;

export type BlogCategory = (typeof blogCategories)[number];

export const categoryColors: Record<string, string> = {
  Destinations: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  Tips: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Guides: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  News: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Reviews: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'best-honeymoon-destinations-india-2025',
    title: '10 Best Honeymoon Destinations in India for 2025',
    excerpt:
      'From the backwaters of Kerala to the snowy valleys of Kashmir, discover the most romantic destinations in India for your perfect honeymoon getaway.',
    content: `
      <h2 id="introduction">Why India is Perfect for Honeymoons</h2>
      <p>India offers an incredible diversity of honeymoon experiences — from serene backwaters and misty hill stations to golden beaches and royal palaces. Whether you want adventure, relaxation, or cultural immersion, there's a perfect destination waiting for you.</p>

      <h2 id="kerala">1. Kerala — The God's Own Country</h2>
      <p>Kerala remains the undisputed king of honeymoon destinations in India. Imagine cruising through tranquil backwaters on a traditional houseboat, watching palm-fringed shores glide by as you sip tender coconut water. Munnar's rolling tea plantations, Alleppey's backwater cruises, and Kovalam's pristine beaches create the perfect romantic trifecta.</p>
      <p><strong>Best Time:</strong> September to March | <strong>Budget:</strong> ₹15,000–₹30,000 per person for 5 nights</p>

      <h2 id="kashmir">2. Kashmir — Paradise on Earth</h2>
      <p>If your idea of romance involves snow-capped mountains, pristine lakes, and Mughal gardens, Kashmir is your dream destination. A shikara ride on Dal Lake at sunset, a stay in a luxurious houseboat, and a drive through the breathtaking Srinagar-Leh highway — every moment is picture-perfect.</p>
      <p><strong>Best Time:</strong> April to October | <strong>Budget:</strong> ₹18,000–₹35,000 per person for 5 nights</p>

      <h2 id="goa">3. Goa — Beach Romance</h2>
      <p>Goa needs no introduction. Sun-kissed beaches, vibrant nightlife, Portuguese architecture, and some of the best seafood in the country. Whether you prefer the lively North Goa beaches or the serene South Goa stretches, a Goan honeymoon is always unforgettable.</p>
      <p><strong>Best Time:</strong> November to February | <strong>Budget:</strong> ₹12,000–₹25,000 per person for 4 nights</p>

      <h2 id="rajasthan">4. Rajasthan — Royal Romance</h2>
      <p>For couples who want a regal experience, Rajasthan offers palace hotels, desert safaris, and timeless forts. Udaipur, the "City of Lakes," is often called India's most romantic city. A candlelight dinner at the Taj Lake Palace is a memory that lasts forever.</p>
      <p><strong>Best Time:</strong> October to March | <strong>Budget:</strong> ₹20,000–₹40,000 per person for 5 nights</p>

      <h2 id="andaman">5. Andaman & Nicobar Islands</h2>
      <p>Crystal-clear waters, white sand beaches, and vibrant coral reefs — the Andamans are India's answer to the Maldives. Havelock Island (now Swaraj Dweep) offers world-class scuba diving and the famous Radhanagar Beach, rated among Asia's best.</p>
      <p><strong>Best Time:</strong> November to April | <strong>Budget:</strong> ₹20,000–₹35,000 per person for 5 nights</p>

      <h2 id="manali">6. Manali — Mountain Magic</h2>
      <p>Nestled in the Beas River valley, Manali offers the perfect blend of adventure and romance. Snow-covered peaks, apple orchards, hot springs, and the famous Rohtang Pass make it a beloved honeymoon spot. Don't miss the Solang Valley for paragliding!</p>
      <p><strong>Best Time:</strong> October to June | <strong>Budget:</strong> ₹10,000–₹20,000 per person for 4 nights</p>

      <h2 id="darjeeling">7. Darjeeling — Tea & Tranquility</h2>
      <p>The "Queen of Hills" offers breathtaking views of Kanchenjunga, charming tea gardens, and the iconic toy train ride. A sunrise at Tiger Hill, a visit to a tea estate, and a cozy stay in a colonial-era hotel — Darjeeling is old-world romance at its best.</p>
      <p><strong>Best Time:</strong> April to June, September to November | <strong>Budget:</strong> ₹8,000–₹18,000 per person for 4 nights</p>

      <h2 id="sikkim">8. Sikkim — The Hidden Gem</h3>
      <p>Sikkim is one of India's best-kept honeymoon secrets. The stunning Tsomgo Lake, the dramatic Nathula Pass, and the charming capital Gangtok offer a unique mountain experience. The Ravangla Buddha Park and Pelling's views of Kanchenjunga are breathtaking.</p>
      <p><strong>Best Time:</strong> March to June, October to December | <strong>Budget:</strong> ₹12,000–₹22,000 per person for 5 nights</p>

      <h2 id="udaipur">9. Udaipur — The Venice of the East</h2>
      <p>Udaipur deserves a special mention beyond Rajasthan itself. The city's magnificent lakes, ornate palaces, and narrow winding streets create an incredibly romantic atmosphere. Stay at the Oberoi Udaivilas or Taj Lake Palace for the ultimate luxury honeymoon.</p>
      <p><strong>Best Time:</strong> September to March | <strong>Budget:</strong> ₹15,000–₹45,000 per person for 4 nights</p>

      <h2 id="coorg">10. Coorg — Scotland of India</h2>
      <p>Coorg (Kodagu) in Karnataka is a lush, green paradise of coffee plantations, misty hills, and cascading waterfalls. It's perfect for couples who want a quiet, nature-focused honeymoon. Abbey Falls, Raja's Seat, and a homestay amidst coffee estates are must-dos.</p>
      <p><strong>Best Time:</strong> October to March | <strong>Budget:</strong> ₹8,000–₹15,000 per person for 3 nights</p>

      <h2 id="tips">Tips for Planning Your Honeymoon</h2>
      <ul>
        <li>Book at least 2-3 months in advance for the best hotel deals</li>
        <li>Consider off-season travel for lower prices and fewer crowds</li>
        <li>Always check weather conditions before finalizing dates</li>
        <li>Look for honeymoon packages that include special experiences</li>
        <li>Don't forget travel insurance for international destinations</li>
      </ul>
    `,
    author: {
      name: 'Priya Sharma',
      avatar: '/images/logo-wayfare-new.png',
      bio: 'Travel writer and honeymoon specialist with 8+ years of experience exploring romantic destinations across India and Southeast Asia.',
    },
    date: '2025-01-15',
    category: 'Destinations',
    image: '/images/blog/honeymoon-guide.png',
    readingTime: '8 min read',
    tags: ['honeymoon', 'romantic getaways', 'India travel', 'Kerala', 'Kashmir', 'Goa'],
    featured: true,
  },
  {
    slug: 'complete-kerala-travel-guide',
    title: 'Complete Kerala Travel Guide: Backwaters, Hills & Beaches',
    excerpt:
      'Your ultimate guide to exploring God\'s Own Country — from Alleppey houseboats to Munnar tea estates, discover the best of Kerala.',
    content: `
      <h2 id="introduction">Welcome to Kerala</h2>
      <p>Kerala, known as "God's Own Country," is a narrow strip of land along India's southwestern coast that packs an extraordinary diversity of landscapes into a small area. From the misty Western Ghats to the tranquil Arabian Sea coast, Kerala offers backwaters, hill stations, beaches, wildlife sanctuaries, and a rich cultural heritage.</p>

      <h2 id="best-time">Best Time to Visit Kerala</h2>
      <p>The ideal time to visit Kerala is from <strong>September to March</strong> when the weather is pleasant and dry. The monsoon season (June-August) has its own charm with lush greenery and Ayurvedic wellness season, but outdoor activities may be limited.</p>

      <h2 id="top-destinations">Top Destinations in Kerala</h2>

      <h3>Alleppey (Alappuzha) — The Venice of the East</h3>
      <p>No Kerala trip is complete without a houseboat cruise through Alleppey's backwaters. These traditional kettuvallams have been converted into floating luxury hotels with bedrooms, bathrooms, and even a kitchen where your personal chef prepares Kerala cuisine fresh.</p>
      <p><strong>Must-do:</strong> Overnight houseboat stay, village walk, coir-making demonstration</p>

      <h3>Munnar — Tea Garden Paradise</h3>
      <p>Munnar's rolling hills covered in tea plantations are among the most photographed landscapes in India. Visit the Tea Museum, hike to Echo Point, and drive through the winding roads for breathtaking views.</p>
      <p><strong>Must-do:</strong> Tea plantation tour, Eravikulam National Park, Mattupetty Dam</p>

      <h3>Kovalam & Varkala — Beach Bliss</h3>
      <p>Kovalam's crescent-shaped beach with its iconic lighthouse and Varkala's dramatic cliffside setting offer two distinct beach experiences. Both are perfect for swimming, surfing, and watching spectacular sunsets.</p>
      <p><strong>Must-do:</strong> Lighthouse Beach (Kovalam), cliff walk (Varkala), Ayurvedic massage</p>

      <h3>Thekkady (Periyar) — Wildlife & Spice</h3>
      <p>Home to the Periyar Tiger Reserve, Thekkady offers boat safaris where you might spot elephants, bison, and even tigers. The spice plantations here produce cardamom, pepper, cinnamon, and vanilla.</p>
      <p><strong>Must-do:</strong> Periyar boat safari, spice plantation tour, bamboo rafting</p>

      <h3>Kochi (Cochin) — Cultural Capital</h3>
      <p>Kochi blends colonial history with contemporary culture. The Chinese fishing nets, Jewish synagogue, Dutch Palace, and vibrant Fort Kochi art scene make it a fascinating urban experience.</p>
      <p><strong>Must-do:</strong> Fort Kochi walk, Kathakali performance, Jew Town shopping</p>

      <h2 id="itinerary">Suggested 7-Day Kerala Itinerary</h2>
      <ol>
        <li><strong>Day 1-2:</strong> Arrive in Kochi, explore Fort Kochi, watch a Kathakali show</li>
        <li><strong>Day 3-4:</strong> Drive to Munnar, visit tea gardens and Eravikulam National Park</li>
        <li><strong>Day 5:</strong> Drive to Thekkady, spice plantation tour and Periyar boat safari</li>
        <li><strong>Day 6:</strong> Drive to Alleppey, board houseboat for overnight backwater cruise</li>
        <li><strong>Day 7:</strong> Disembark, drive to Kovalam or Kochi airport for departure</li>
      </ol>

      <h2 id="food">Kerala Cuisine You Must Try</h2>
      <ul>
        <li><strong>Sadya:</strong> Traditional vegetarian feast served on banana leaf</li>
        <li><strong>Karimeen Pollichathu:</strong> Pearl spot fish wrapped in banana leaf</li>
        <li><strong>Appam & Stew:</strong> Rice pancakes with coconut milk stew</li>
        <li><strong>Puttu & Kadala Curry:</strong> Steamed rice cylinders with black chickpea curry</li>
        <li><strong>Malabar Biryani:</strong> Fragrant rice dish from Northern Kerala</li>
      </ul>

      <h2 id="budget">Budget Guide</h2>
      <p>A 7-day Kerala trip can range from ₹12,000 per person (budget) to ₹40,000 per person (luxury). This includes accommodation, meals, transport, and activities. Houseboat stays range from ₹7,000 to ₹25,000 per night depending on luxury level.</p>
    `,
    author: {
      name: 'Arjun Menon',
      avatar: '/images/logo-wayfare-new.png',
      bio: 'Kerala native and travel photographer who has documented every corner of God\'s Own Country over the past decade.',
    },
    date: '2025-01-10',
    category: 'Guides',
    image: '/images/destinations/kerala.png',
    readingTime: '10 min read',
    tags: ['Kerala', 'backwaters', 'Munnar', 'travel guide', 'India', 'houseboat'],
    featured: true,
  },
  {
    slug: 'dubai-on-budget-indian-travelers',
    title: 'Dubai on a Budget: Tips for Indian Travelers',
    excerpt:
      'Think Dubai is only for the rich? Think again! Our insider guide shows you how to experience the best of Dubai without burning a hole in your pocket.',
    content: `
      <h2 id="introduction">Dubai Doesn't Have to Break the Bank</h2>
      <p>Dubai has a reputation for luxury, but it's surprisingly accessible for budget-conscious Indian travelers. With smart planning, you can experience the best of this glittering city — from the Burj Khalifa to the Gold Souk — for under ₹50,000 for a 4-night trip (including flights!).</p>

      <h2 id="flights">Getting Cheap Flights to Dubai</h2>
      <p>The key to a budget Dubai trip starts with affordable flights. Book 6-8 weeks in advance and consider these options:</p>
      <ul>
        <li><strong>Budget Airlines:</strong> Flydubai, Air India Express, SpiceJet, and IndiGo offer direct flights from Mumbai, Delhi, Kochi, and other Indian cities starting at ₹8,000-₹12,000 round trip</li>
        <li><strong>Off-Peak Travel:</strong> Avoid December-January and summer school holidays. February-May and September-November offer the best deals</li>
        <li><strong>Mid-Week Flights:</strong> Tuesday and Wednesday departures are typically 20-30% cheaper</li>
      </ul>

      <h2 id="accommodation">Budget Accommodation Options</h2>
      <p>Dubai has excellent budget accommodations that don't compromise on comfort:</p>
      <ul>
        <li><strong>Deira & Bur Dubai:</strong> The old city area has clean, comfortable hotels starting at ₹2,500-₹4,000 per night. You'll be close to the Creek, Gold Souk, and Spice Souk</li>
        <li><strong>Al Barsha:</strong> Near Mall of the Emirates, budget hotels start at ₹3,000 per night</li>
        <li><strong>Hostels:</strong> Dubai now has several modern hostels with pod beds starting at ₹1,200 per night</li>
        <li><strong>Apartment Hotels:</strong> Great for families — kitchen access saves on meals. Starting at ₹4,000 per night for a studio</li>
      </ul>

      <h2 id="free-activities">Free Things to Do in Dubai</h2>
      <ul>
        <li><strong>Dubai Fountain Show:</strong> The world's largest choreographed fountain — absolutely free, every 30 minutes after 6 PM</li>
        <li><strong>Dubai Marina Walk:</strong> Stunning waterfront promenade with skyscraper views</li>
        <li><strong>Kite Beach:</strong> Beautiful public beach with Burj Al Arab views</li>
        <li><strong>Al Fahidi Historical District:</strong> Free art galleries and cultural sites in old Dubai</li>
        <li><strong>Dubai Creek Abra Ride:</strong> Traditional boat ride for just AED 1 (₹22)</li>
        <li><strong>Gold Souk & Spice Souk:</strong> Window shopping is free, and the atmosphere is priceless</li>
      </ul>

      <h2 id="budget-activities">Affordable Paid Experiences</h2>
      <ul>
        <li><strong>Burj Khalifa At The Top:</strong> Book online 3-4 weeks ahead for ₹3,000-₹4,000 (vs. walk-in ₹6,000+)</li>
        <li><strong>Desert Safari:</strong> Group tours start at ₹2,000 per person including BBQ dinner</li>
        <li><strong>Dubai Frame:</strong> AED 50 (₹1,100) for panoramic city views</li>
        <li><strong>Miracle Garden:</strong> AED 95 (₹2,100) for the world's largest flower garden</li>
      </ul>

      <h2 id="food">Eating on a Budget</h2>
      <p>Dubai has an incredible cheap eats scene, especially in areas like Al Karama, Deira, and Satwa:</p>
      <ul>
        <li><strong>Shawarma:</strong> AED 5-10 (₹110-₹220) at street stalls</li>
        <li><strong>Indian Restaurants:</strong> Thali meals for AED 15-25 (₹330-₹550)</li>
        <li><strong>Ravi Restaurant:</strong> Legendary Pakistani eatery, full meal for AED 30 (₹660)</li>
        <li><strong>Supermarket Meals:</strong> Carrefour and Lulu have affordable ready-to-eat sections</li>
      </ul>

      <h2 id="transport">Getting Around Cheaply</h2>
      <p>Dubai Metro is clean, efficient, and affordable. A day pass costs AED 20 (₹440). Taxis start at AED 12 (₹265) and are much cheaper than Indian metro taxis. For short distances, use the Metro and walk — Dubai is surprisingly walkable in the cooler months.</p>

      <h2 id="budget-breakdown">Sample 4-Night Budget Breakdown</h2>
      <ul>
        <li>Flights (round trip): ₹10,000-₹15,000</li>
        <li>Accommodation (4 nights): ₹10,000-₹16,000</li>
        <li>Food (4 days): ₹6,000-₹8,000</li>
        <li>Activities & entry fees: ₹8,000-₹12,000</li>
        <li>Transport: ₹3,000-₹4,000</li>
        <li>Visa: ₹5,500-₹6,500</li>
        <li><strong>Total: ₹42,500-₹61,500 per person</strong></li>
      </ul>
    `,
    author: {
      name: 'Rahul Verma',
      avatar: '/images/logo-wayfare-new.png',
      bio: 'Travel hacker and budget travel expert who has visited 25+ countries on a shoestring budget. Dubai is his second home.',
    },
    date: '2025-01-05',
    category: 'Tips',
    image: '/images/destinations/dubai.png',
    readingTime: '9 min read',
    tags: ['Dubai', 'budget travel', 'tips', 'international travel', 'UAE'],
    featured: false,
  },
  {
    slug: 'family-friendly-destinations-rajasthan',
    title: 'Top 5 Family-Friendly Destinations in Rajasthan',
    excerpt:
      'Planning a family trip to the Land of Kings? Here are the 5 best destinations in Rajasthan that kids and adults will both love.',
    content: `
      <h2 id="introduction">Rajasthan: A Family Adventure</h2>
      <p>Rajasthan is one of India's most family-friendly states, offering a magical mix of history, culture, wildlife, and adventure that captivates travelers of all ages. From majestic forts to desert safaris, here are our top 5 picks for a memorable family vacation.</p>

      <h2 id="jaipur">1. Jaipur — The Pink City</h2>
      <p>Jaipur is the perfect starting point for any Rajasthan family trip. The city offers a wonderful blend of history, culture, and modern amenities.</p>
      <ul>
        <li><strong>Amber Fort:</strong> The elephant ride up to the fort is a highlight for kids. The light and sound show in the evening is spectacular</li>
        <li><strong>City Palace:</strong> Explore the royal quarters and the fascinating museum</li>
        <li><strong>Jantar Mantar:</strong> The world's largest stone sundial — a fun science lesson for kids</li>
        <li><strong>Hawa Mahal:</strong> The iconic "Palace of Winds" with its 953 small windows</li>
        <li><strong>Chokhi Dhani:</strong> A mock Rajasthani village with food, folk performances, camel rides, and activities</li>
      </ul>
      <p><strong>Family Tip:</strong> Stay at a heritage hotel for the full royal experience without breaking the bank.</p>

      <h2 id="udaipur">2. Udaipur — The City of Lakes</h2>
      <p>Udaipur's serene lakes and palaces create a fairy-tale setting that kids absolutely love.</p>
      <ul>
        <li><strong>City Palace:</strong> Take the boat ride across Lake Pichola to reach the palace</li>
        <li><strong>Saheliyon Ki Bari:</strong> Beautiful garden with fountains — perfect for kids to explore</li>
        <li><strong>Bagore Ki Haveli:</strong> Evening puppet show and cultural performance</li>
        <li><strong>Lake Pichola Boat Ride:</strong> Sunset cruise with views of Jag Mandir and the Lake Palace</li>
      </ul>
      <p><strong>Family Tip:</strong> The ropeway to Karni Mata Temple offers panoramic city views that kids love.</p>

      <h2 id="jaisalmer">3. Jaisalmer — The Golden City</h2>
      <p>Jaisalmer is like stepping into an Arabian Nights story — a living fort rising from the Thar Desert.</p>
      <ul>
        <li><strong>Jaisalmer Fort:</strong> One of the world's few "living forts" with shops, hotels, and residences inside</li>
        <li><strong>Desert Safari:</strong> Overnight camel safari with camping under the stars — the highlight of any Rajasthan trip</li>
        <li><strong>Sam Sand Dunes:</strong> Sunset over the dunes is magical, with folk performances at the camps</li>
        <li><strong>Patwon Ki Haveli:</strong> Intricate carvings that will amaze both kids and adults</li>
      </ul>
      <p><strong>Family Tip:</strong> Book a luxury desert camp for comfort with adventure — kids love the cultural evening programs.</p>

      <h2 id="jodhpur">4. Jodhpur — The Blue City</h2>
      <p>Jodhpur's striking blue-washed houses and mighty Mehrangarh Fort make it one of Rajasthan's most photogenic cities.</p>
      <ul>
        <li><strong>Mehrangarh Fort:</strong> One of India's largest forts with a fantastic museum and zip line (for adventurous families!)</li>
        <li><strong>Clock Tower & Sardar Market:</strong> Vibrant bazaar perfect for souvenir shopping</li>
        <li><strong>Jaswant Thada:</strong> Beautiful marble cenotaph with peaceful gardens</li>
        <li><strong>Umaid Bhawan Palace:</strong> Part royal residence, part hotel, part museum — truly grand</li>
      </ul>
      <p><strong>Family Tip:</strong> The Flying Fox zip line at Mehrangarh is safe for kids 10+ and offers incredible views.</p>

      <h2 id="ranthambore">5. Ranthambore — Wildlife Safari</h2>
      <p>For families who love wildlife, Ranthambore National Park is an unmissable destination. It's one of the best places in India to spot wild tigers.</p>
      <ul>
        <li><strong>Tiger Safari:</strong> Morning and afternoon jeep/canter safaris through the national park</li>
        <li><strong>Ranthambore Fort:</strong> A UNESCO World Heritage Site within the park</li>
        <li><strong>Surwal Lake:</strong> Bird watching paradise with migratory species</li>
        <li><strong>Dastkar Ranthambore:</strong> Craft center where kids can try traditional art forms</li>
      </ul>
      <p><strong>Family Tip:</strong> Book safaris well in advance (2-3 months) for the best zone allocations.</p>

      <h2 id="tips">General Tips for Rajasthan Family Travel</h2>
      <ul>
        <li>Best time: October to March (avoid scorching summer)</li>
        <li>Carry sunscreen, hats, and water bottles — Rajasthan can be very sunny</li>
        <li>Book heritage hotels for a unique experience kids will remember</li>
        <li>Plan 2-3 nights per city to avoid travel fatigue</li>
        <li>Hire a private car with driver for intercity travel — it's affordable and comfortable</li>
      </ul>
    `,
    author: {
      name: 'Priya Sharma',
      avatar: '/images/logo-wayfare-new.png',
      bio: 'Travel writer and honeymoon specialist with 8+ years of experience exploring romantic destinations across India and Southeast Asia.',
    },
    date: '2024-12-28',
    category: 'Destinations',
    image: '/images/blog/adventure-tips.png',
    readingTime: '7 min read',
    tags: ['Rajasthan', 'family travel', 'Jaipur', 'Udaipur', 'Jaisalmer', 'wildlife'],
    featured: false,
  },
  {
    slug: 'maldives-vs-bali-honeymoon-comparison',
    title: 'Maldives vs Bali: Which is Better for Your Honeymoon?',
    excerpt:
      'Torn between the overwater villas of Maldives and the cultural charm of Bali? Our detailed comparison helps you decide the perfect honeymoon destination.',
    content: `
      <h2 id="introduction">The Great Honeymoon Debate</h2>
      <p>Maldives and Bali are two of the most popular honeymoon destinations for Indian couples. Both offer stunning natural beauty and romantic experiences, but they're completely different in character. Let's break down everything you need to know to make the right choice.</p>

      <h2 id="vibe">Overall Vibe</h2>
      <p><strong>Maldives:</strong> Pure, undisturbed luxury. Think overwater villas, crystal-clear lagoons, private beach dinners, and world-class snorkeling. It's about doing nothing — beautifully.</p>
      <p><strong>Bali:</strong> Cultural immersion meets natural beauty. Think ancient temples, rice terraces, yoga retreats, vibrant nightlife, and diverse landscapes from mountains to beaches. It's about experiencing everything.</p>

      <h2 id="budget">Budget Comparison</h2>
      <p><strong>Maldives (5 nights):</strong></p>
      <ul>
        <li>Budget: ₹80,000-₹1,20,000 per couple</li>
        <li>Mid-range: ₹1,50,000-₹2,50,000 per couple</li>
        <li>Luxury: ₹3,00,000+ per couple</li>
      </ul>
      <p><strong>Bali (5 nights):</strong></p>
      <ul>
        <li>Budget: ₹50,000-₹80,000 per couple</li>
        <li>Mid-range: ₹1,00,000-₹1,80,000 per couple</li>
        <li>Luxury: ₹2,00,000+ per couple</li>
      </ul>
      <p><strong>Winner:</strong> Bali is significantly more affordable at every price point.</p>

      <h2 id="flights">Flight Connectivity from India</h2>
      <p><strong>Maldives:</strong> Direct flights from Delhi, Mumbai, Bangalore, Kochi (3-5 hours). Prices range from ₹15,000-₹30,000 round trip.</p>
      <p><strong>Bali:</strong> No direct flights from India. Connecting flights via Singapore, Kuala Lumpur, or Bangkok (8-12 hours total). Prices range from ₹25,000-₹45,000 round trip.</p>
      <p><strong>Winner:</strong> Maldives wins on convenience and flight cost.</p>

      <h2 id="accommodation">Accommodation Experience</h2>
      <p><strong>Maldives:</strong> Overwater villas are the star attraction. Waking up above turquoise water with a glass floor panel, stepping directly into the ocean from your deck — it's unmatched luxury. Most resorts are on private islands with all-inclusive options.</p>
      <p><strong>Bali:</strong> Incredible variety — from clifftop villas in Uluwatu to jungle retreats in Ubud. Private pool villas are surprisingly affordable. Boutique resorts offer personalized service at a fraction of Maldives prices.</p>
      <p><strong>Winner:</strong> Maldives for pure luxury, Bali for variety and value.</p>

      <h2 id="activities">Activities & Experiences</h2>
      <p><strong>Maldives:</strong></p>
      <ul>
        <li>Snorkeling with manta rays and whale sharks</li>
        <li>Private sandbank dining</li>
        <li>Underwater restaurant experiences</li>
        <li>Sunset dolphin cruises</li>
        <li>Couples spa treatments over water</li>
      </ul>
      <p><strong>Bali:</strong></p>
      <ul>
        <li>Tegallalang Rice Terrace sunrise walk</li>
        <li>Uluwatu Temple sunset Kecak dance</li>
        <li>Mount Batur sunrise trek</li>
        <li>Seminyak beach clubs and nightlife</li>
        <li>Traditional Balinese cooking class</li>
        <li>White water rafting in Ayung River</li>
      </ul>
      <p><strong>Winner:</strong> Bali wins on variety of activities. Maldives is more limited but excels at what it offers.</p>

      <h2 id="food">Food & Dining</h2>
      <p><strong>Maldives:</strong> Resort dining is excellent but expensive. All-inclusive packages are worth it. Limited local food options outside resorts.</p>
      <p><strong>Bali:</strong> Incredible food scene from ₹300 street food to ₹10,000 fine dining. Warungs (local eateries) serve amazing Nasi Goreng, Babi Guling, and fresh seafood at Jimbaran Bay.</p>
      <p><strong>Winner:</strong> Bali by a mile for food lovers.</p>

      <h2 id="verdict">The Verdict</h2>
      <p><strong>Choose Maldives if:</strong> You want pure relaxation, luxury, and privacy. Best for couples who want to just "be" together without planning activities.</p>
      <p><strong>Choose Bali if:</strong> You want a mix of adventure, culture, and relaxation. Best for active couples who get bored just lounging.</p>
      <p><strong>Can't decide?</strong> Do both! Many couples combine 3 nights in Maldives (relaxation) with 4 nights in Bali (exploration) for the ultimate honeymoon.</p>
    `,
    author: {
      name: 'Neha Kapoor',
      avatar: '/images/logo-wayfare-new.png',
      bio: 'Luxury travel consultant specializing in honeymoon planning. Has planned 500+ honeymoons across Asia and the Indian Ocean.',
    },
    date: '2024-12-20',
    category: 'Reviews',
    image: '/images/destinations/maldives.png',
    readingTime: '8 min read',
    tags: ['Maldives', 'Bali', 'honeymoon', 'comparison', 'luxury travel', 'Indonesia'],
    featured: true,
  },
  {
    slug: 'ladakh-bike-trip-complete-guide',
    title: 'Ladakh Bike Trip: Everything You Need to Know',
    excerpt:
      'The ultimate guide to planning your dream Ladakh bike trip — routes, permits, packing list, budget, and insider tips from experienced riders.',
    content: `
      <h2 id="introduction">The Call of the Mountains</h2>
      <p>A Ladakh bike trip is a bucket-list adventure for every rider in India. The journey through the world's highest motorable passes, across vast barren landscapes and beside pristine lakes, is an experience like no other. But it requires careful planning. Here's everything you need to know.</p>

      <h2 id="when-to-go">When to Go</h2>
      <p>The riding season in Ladakh is short:</p>
      <ul>
        <li><strong>Mid-June to Mid-September:</strong> The only reliable window. All passes (Khardung La, Chang La, Tanglang La) are typically open</li>
        <li><strong>Best Month:</strong> July offers the best weather and road conditions</li>
        <li><strong>Avoid:</strong> October onwards — unpredictable weather, road closures, and sub-zero temperatures</li>
      </ul>

      <h2 id="routes">Popular Routes</h2>

      <h3>Route 1: Srinagar-Leh Highway (425 km)</h3>
      <p>The gentler approach. This route gradually gains altitude, helping with acclimatization.</p>
      <p><strong>Day 1:</strong> Srinagar → Sonamarg (80 km) | <strong>Day 2:</strong> Sonamarg → Drass → Kargil (130 km) | <strong>Day 3:</strong> Kargil → Mulbekh → Lamayuru → Leh (215 km)</p>

      <h3>Route 2: Manali-Leh Highway (473 km)</h3>
      <p>The more dramatic and challenging route. Higher passes, stunning landscapes.</p>
      <p><strong>Day 1:</strong> Manali → Keylong/Jispa (160 km) | <strong>Day 2:</strong> Keylong → Sarchu (110 km) | <strong>Day 3:</strong> Sarchu → Leh (205 km)</p>

      <h3>Route 3: The Complete Circuit (12-15 days)</h3>
      <p>Manali → Leh → Nubra Valley → Pangong Tso → Leh → Srinagar. The most comprehensive Ladakh experience.</p>

      <h2 id="permits">Permits & Documents</h2>
      <ul>
        <li><strong>Inner Line Permit (ILP):</strong> Required for Nubra Valley, Pangong Tso, Tso Moriri. Apply online at ladakh.nic.in or at the DC office in Leh</li>
        <li><strong>Protected Area Permit (PAP):</strong> Needed for foreign nationals</li>
        <li>Carry original + multiple photocopies of: Driving license, RC book, vehicle insurance, pollution certificate, Aadhar/Passport</li>
        <li>Get your bike serviced and carry the service receipt</li>
      </ul>

      <h2 id="bike">Choosing Your Bike</h2>
      <ul>
        <li><strong>Royal Enfield Himalayan (411cc):</strong> The most popular choice. Comfortable, reliable, great for long distances. Rent: ₹1,500-₹2,000/day</li>
        <li><strong>Royal Enfield Classic 500:</strong> The classic Ladakh bike. Raw power and character. Rent: ₹1,200-₹1,600/day</li>
        <li><strong>Bajaj Dominar 400:</strong> Modern, powerful, and comfortable. Great fuel injection system. Rent: ₹1,400-₹1,800/day</li>
        <li><strong>KTM Duke 200/390:</strong> For experienced riders who want agility. Rent: ₹1,200-₹1,600/day</li>
      </ul>

      <h2 id="packing">Essential Packing List</h2>
      <ul>
        <li>Riding jacket with thermal liner, riding pants, gloves (2 pairs), riding boots</li>
        <li>Thermal innerwear, fleece jacket, windcheater, rain suit</li>
        <li>Helmet with clear visor + sunglasses</li>
        <li>Bungee cords, tank bag, saddle bags</li>
        <li>First aid kit, Diamox (for altitude sickness), sunscreen (SPF 50+)</li>
        <li>Tool kit, puncture kit, clutch/accelerator cables, extra tube</li>
        <li>Water bottles (2L minimum), energy bars, ORS packets</li>
        <li>Power bank, phone mount, bungee cords</li>
      </ul>

      <h2 id="budget">Budget Breakdown (Per Person)</h2>
      <ul>
        <li>Bike rental (12 days): ₹18,000-₹24,000</li>
        <li>Fuel (2,500 km approx): ₹8,000-₹10,000</li>
        <li>Accommodation (12 nights): ₹9,000-₹18,000</li>
        <li>Food (12 days): ₹8,000-₹12,000</li>
        <li>Permits & entry fees: ₹1,500-₹2,000</li>
        <li>Miscellaneous (spares, repairs): ₹3,000-₹5,000</li>
        <li><strong>Total: ₹47,500-₹71,000 per person</strong></li>
      </ul>

      <h2 id="tips">Pro Tips</h2>
      <ul>
        <li>Acclimatize for 2 days in Leh before riding to high passes</li>
        <li>Start early — weather changes rapidly in the afternoon</li>
        <li>Ride in a group of 4-6 bikes for safety</li>
        <li>Never ride after dark — roads have no lights and livestock roams freely</li>
        <li>Stay hydrated — the dry mountain air dehydrates you faster than you realize</li>
        <li>Respect the mountains — don't litter, don't honk unnecessarily</li>
      </ul>
    `,
    author: {
      name: 'Vikram Singh',
      avatar: '/images/logo-wayfare-new.png',
      bio: 'Adventure motorcyclist who has completed 6 Ladakh expeditions. Founder of the Delhi Riders motorcycle club.',
    },
    date: '2024-12-15',
    category: 'Guides',
    image: '/images/blog/adventure-tips.png',
    readingTime: '12 min read',
    tags: ['Ladakh', 'bike trip', 'adventure', 'road trip', 'motorcycle', 'Himalayas'],
    featured: true,
  },
  {
    slug: 'goa-beyond-beaches-hidden-gems',
    title: 'Goa Beyond Beaches: Hidden Gems and Local Experiences',
    excerpt:
      'Most tourists never see the real Goa. Discover hidden waterfalls, secret beaches, spice farms, and authentic local experiences that go far beyond the usual tourist trail.',
    content: `
      <h2 id="introduction">The Real Goa Awaits</h2>
      <p>Goa is India's most visited beach destination, but most visitors only experience a fraction of what this incredible state has to offer. Beyond the beach shacks and nightclubs lies a world of hidden waterfalls, centuries-old churches, lush spice plantations, and charming villages where time seems to stand still.</p>

      <h2 id="hidden-beaches">Secret Beaches</h2>

      <h3>Kakolem Beach (Tiger Beach)</h3>
      <p>Accessible only via a steep, hidden path, this pristine cove near Cabo de Rama is one of Goa's best-kept secrets. You'll likely have the entire beach to yourself.</p>

      <h3>Hollant Beach</h3>
      <p>Near Vasco da Gama, this is one of the few beaches in Goa where you can watch the sunrise over the Arabian Sea. Calm waters make it perfect for swimming.</p>

      <h3>Betul Beach</h3>
      <p>A quiet fishing village beach in South Goa where you can watch traditional fishing boats bring in the daily catch and buy the freshest fish you'll ever taste.</p>

      <h3>Galgibag Beach</h3>
      <p>Known as "Turtle Beach," this isolated stretch near the Karnataka border is where Olive Ridley turtles come to nest. No shacks, no crowds — just pristine sand and surf.</p>

      <h2 id="waterfalls">Hidden Waterfalls</h2>

      <h3>Dudhsagar Falls (Off the Beaten Path)</h3>
      <p>Everyone knows Dudhsagar, but most visit via the tourist jeep safari. Instead, take the 12km trek through the Bhagwan Mahavir Wildlife Sanctuary — the journey through the forest is as magical as the falls themselves.</p>

      <h3>Kuskem Waterfall</h3>
      <p>Located near Kuskem village in the Canacona taluka, this lesser-known waterfall is surrounded by dense forest and offers a refreshing swim in its natural pool.</p>

      <h3>Hivre Waterfall</h3>
      <p>A beautiful waterfall near Valpoi that requires a short trek through a cashew plantation. The locals are friendly and often guide visitors to the spot.</p>

      <h2 id="spice-farms">Spice Plantation Tours</h2>
      <p>Goa's spice farms are a feast for the senses. Unlike the touristy ones, try these authentic options:</p>
      <ul>
        <li><strong>Savoi Plantation:</strong> A 200-year-old organic spice farm in Ponda. The guided walk explains how vanilla, pepper, cardamom, and nutmeg grow. Ends with a traditional Goan Hindu lunch on banana leaves</li>
        <li><strong>Pascol Spice Village:</strong> A smaller, more intimate farm where you can actually participate in spice harvesting</li>
      </ul>

      <h2 id="heritage">Heritage & Culture Beyond Churches</h2>
      <ul>
        <li><strong>Fountainhas (Panjim):</strong> Goa's Latin Quarter with colorful Portuguese-era homes, art galleries, and the best bakeries</li>
        <li><strong>Chandor Village:</strong> Home to the 500-year-old Menezes Braganza House, one of India's largest colonial mansions</li>
        <li><strong>Divar Island:</strong> Take a ferry from Old Goa to this peaceful island village with ancient temples and Portuguese ruins</li>
        <li><strong>Carmona Village:</strong> A charming village with beautiful Indo-Portuguese architecture and zero tourist crowds</li>
      </ul>

      <h2 id="food">Authentic Goan Food Experiences</h2>
      <ul>
        <li><strong>Vinayak Family Restaurant (Margao):</strong> The best Goan fish curry rice in South Goa — always packed with locals</li>
        <li><strong>Café Alorna (Mapusa):</strong> Famous for sorpotel, sannas, and bebinca since 1935</li>
        <li><strong>Martin's Corner (Betalbatim):</strong> Seafood so fresh it was swimming that morning</li>
        <li><strong>Ritz Classic (Panjim):</strong> The go-to spot for Goan prawn curry and fish fry — no tourists, only locals</li>
      </ul>

      <h2 id="tips">Tips for Exploring Hidden Goa</h2>
      <ul>
        <li>Rent a scooter or car — hidden gems aren't accessible by public transport</li>
        <li>Visit during the monsoon (June-September) for lush greenery and waterfalls at their peak</li>
        <li>Talk to locals — they'll point you to spots that aren't on any map</li>
        <li>Stay in a homestay rather than a resort for an authentic experience</li>
        <li>Explore the hinterlands — the real Goa is in its villages, not its beaches</li>
      </ul>
    `,
    author: {
      name: 'Arjun Menon',
      avatar: '/images/logo-wayfare-new.png',
      bio: 'Kerala native and travel photographer who has documented every corner of God\'s Own Country over the past decade.',
    },
    date: '2024-12-10',
    category: 'Destinations',
    image: '/images/destinations/goa.png',
    readingTime: '9 min read',
    tags: ['Goa', 'hidden gems', 'beaches', 'waterfalls', 'local experiences', 'offbeat'],
    featured: false,
  },
  {
    slug: 'plan-international-trip-from-india-guide',
    title: 'How to Plan an International Trip from India: Step-by-Step Guide',
    excerpt:
      'First time traveling abroad? From passport application to forex, visa to travel insurance — our comprehensive guide covers everything you need to know.',
    content: `
      <h2 id="introduction">Your First International Trip: No More Confusion</h2>
      <p>Planning your first international trip from India can feel overwhelming — passports, visas, forex, insurance, packing, itineraries... where do you even start? Don't worry. This step-by-step guide breaks it all down so you can plan with confidence.</p>

      <h2 id="step1">Step 1: Get Your Passport (4-6 weeks before)</h2>
      <ul>
        <li>Apply online at passportindia.gov.in</li>
        <li>Book an appointment at your nearest Passport Seva Kendra</li>
        <li>Carry: Aadhar card, PAN card, birth certificate, address proof</li>
        <li>Normal processing: 30-45 days | Tatkal: 1-3 weeks (additional fee)</li>
        <li><strong>Tip:</strong> Ensure your passport is valid for at least 6 months beyond your travel date</li>
      </ul>

      <h2 id="step2">Step 2: Choose Your Destination</h2>
      <p>For first-time international travelers from India, consider these beginner-friendly options:</p>
      <ul>
        <li><strong>Visa-on-Arrival / e-Visa:</strong> Thailand, Maldives, Sri Lanka, Indonesia (Bali), Vietnam, Cambodia</li>
        <li><strong>Easy Tourist Visa:</strong> Singapore, Malaysia, UAE (Dubai), Nepal, Bhutan</li>
        <li><strong>Requires More Planning:</strong> Europe (Schengen), USA, UK, Japan, Australia</li>
      </ul>
      <p><strong>Recommendation:</strong> Start with Southeast Asia — affordable, visa-friendly, incredible food, and stunning landscapes.</p>

      <h2 id="step3">Step 3: Apply for Visa (3-8 weeks before)</h2>
      <ul>
        <li><strong>e-Visa:</strong> Apply online, receive via email. Available for 160+ countries</li>
        <li><strong>Visa-on-Arrival:</strong> Get your visa at the destination airport. Carry passport photos and visa fee in cash (USD)</li>
        <li><strong>Embassy Visa:</strong> Requires appointment, documentation, and interview (for US, UK, Schengen, etc.)</li>
        <li><strong>Documents typically needed:</strong> Passport (6+ months validity), return tickets, hotel bookings, bank statements (3-6 months), salary slips, IT returns, passport-size photos</li>
      </ul>

      <h2 id="step4">Step 4: Book Flights (8-12 weeks before)</h2>
      <ul>
        <li>Use Google Flights, Skyscanner, or MakeMyTrip to compare prices</li>
        <li>Book 8-12 weeks in advance for the best fares</li>
        <li>Tuesday/Wednesday departures are usually cheapest</li>
        <li>Consider budget airlines: AirAsia, Scoot, VietJet for Southeast Asia</li>
        <li><strong>Tip:</strong> Set price alerts and be flexible with dates</li>
      </ul>

      <h2 id="step5">Step 5: Book Accommodation (4-8 weeks before)</h2>
      <ul>
        <li><strong>Budget:</strong> Hostels (Hostelworld, Booking.com) — ₹500-₹1,500/night</li>
        <li><strong>Mid-range:</strong> 3-star hotels, Airbnb — ₹2,000-₹5,000/night</li>
        <li><strong>Luxury:</strong> 4-5 star hotels, villas — ₹8,000+/night</li>
        <li><strong>Tip:</strong> Book with free cancellation — plans change!</li>
      </ul>

      <h2 id="step6">Step 6: Get Travel Insurance (1-2 weeks before)</h2>
      <p><strong>Never skip travel insurance.</strong> It covers medical emergencies, trip cancellations, lost baggage, and more. Plans start at just ₹500-₹1,500 for a week-long trip.</p>
      <ul>
        <li>Popular providers: ICICI Lombard, HDFC Ergo, Bajaj Allianz, World Nomads</li>
        <li>Compare on: Policybazaar, Coverfox</li>
        <li>Ensure coverage for: Medical emergencies (₹10L+), trip cancellation, baggage loss, flight delays</li>
      </ul>

      <h2 id="step7">Step 7: Manage Forex (1-2 weeks before)</h2>
      <ul>
        <li><strong>Multi-currency Forex Card:</strong> Load multiple currencies at locked-in rates. Much cheaper than using Indian debit/credit cards abroad. Get from BookMyForex, Thomas Cook, or your bank</li>
        <li><strong>Cash:</strong> Carry USD 100-200 for emergencies. Exchange at authorized counters, not airports (terrible rates)</li>
        <li><strong>International Debit/Credit Cards:</strong> As backup. Check foreign markup fees (usually 3.5%)</li>
        <li><strong>UPI:</strong> Now works in UAE, Singapore, Sri Lanka, Mauritius, and Nepal!</li>
      </ul>

      <h2 id="step8">Step 8: Pack Smart</h2>
      <ul>
        <li>Check baggage allowance before packing (usually 20-30 kg for check-in, 7 kg cabin)</li>
        <li>Essential documents folder: Passport, visa, tickets, insurance, hotel bookings, forex card — hard copies + digital copies in email</li>
        <li>Universal travel adapter (different countries have different sockets)</li>
        <li>Medications with prescriptions</li>
        <li>Power bank (under 100Wh for cabin baggage)</li>
        <li><strong>Pro tip:</strong> Roll clothes instead of folding — saves space and reduces wrinkles</li>
      </ul>

      <h2 id="step9">Step 9: At the Airport & Immigration</h2>
      <ul>
        <li>Arrive 3 hours before international departure</li>
        <li>Fill departure card (if required) at the Indian immigration counter</li>
        <li>Keep all documents accessible, not buried in checked luggage</li>
        <li>At destination immigration: Be confident, have hotel address and return ticket ready</li>
        <li>Fill arrival card if required</li>
      </ul>

      <h2 id="budget">Sample Budget: 5-Day Thailand Trip</h2>
      <ul>
        <li>Flights (round trip): ₹15,000-₹25,000</li>
        <li>Visa fee: ₹2,500 (visa-on-arrival)</li>
        <li>Accommodation (5 nights): ₹10,000-₹20,000</li>
        <li>Food (5 days): ₹8,000-₹12,000</li>
        <li>Activities: ₹5,000-₹10,000</li>
        <li>Local transport: ₹3,000-₹5,000</li>
        <li>Travel insurance: ₹800</li>
        <li>Forex/misc: ₹5,000</li>
        <li><strong>Total: ₹49,300-₹80,300 per person</strong></li>
      </ul>
    `,
    author: {
      name: 'Rahul Verma',
      avatar: '/images/logo-wayfare-new.png',
      bio: 'Travel hacker and budget travel expert who has visited 25+ countries on a shoestring budget. Dubai is his second home.',
    },
    date: '2024-12-05',
    category: 'Guides',
    image: '/images/blog/travel-tips.png',
    readingTime: '11 min read',
    tags: ['international travel', 'beginner guide', 'visa', 'passport', 'forex', 'travel tips'],
    featured: false,
  },
];

// Helper functions
export function getAllBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getBlogPostBySlug(slug);
  if (!post) return [];
  return blogPosts
    .filter(
      (p) =>
        p.slug !== slug &&
        (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
    )
    .slice(0, limit);
}

export function getRecentPosts(limit = 5): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function searchPosts(query: string): BlogPost[] {
  const q = query.toLowerCase();
  return blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}
