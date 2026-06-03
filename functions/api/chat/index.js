// Chat API - simplified for Cloudflare Pages (no AI SDK available)
// Returns a helpful response based on keyword matching

function getAutoReply(message) {
  const msg = message.toLowerCase();

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Welcome to Wayfare! ✈️ I'm your travel assistant. How can I help you plan your dream vacation today? You can ask me about:\n\n• Tour packages (domestic & international)\n• Hotel recommendations\n• Flight deals\n• Destination information\n• Trip planning & budgets";
  }

  if (msg.includes('kerala')) {
    return "🌿 **Kerala Packages:**\n\n• **Kerala Backwaters & Beaches** - 5N6D from ₹18,999\n• **Kerala Honeymoon Special** - 4N5D from ₹22,999\n\nKerala is known as 'God's Own Country' with serene backwaters, lush hill stations, and beautiful beaches! 🏖️\n\nWould you like to know more or book a package?";
  }

  if (msg.includes('kashmir')) {
    return "🏔️ **Kashmir Packages:**\n\n• **Kashmir Valley Explorer** - 5N6D from ₹17,999\n• **Kashmir Honeymoon Delight** - 6N7D from ₹28,999\n\nKashmir is Paradise on Earth with pristine valleys, snow-capped mountains, and crystal-clear lakes! ❄️\n\nWant to explore more options?";
  }

  if (msg.includes('goa')) {
    return "🏖️ **Goa Package:**\n\n• **Goa Beach Getaway** - 4N5D from ₹12,999\n\nSun, sand, and party! Experience Goa's best beaches, vibrant nightlife, and Portuguese heritage! 🌊\n\nShall I help you book?";
  }

  if (msg.includes('dubai')) {
    return "🌟 **Dubai Packages:**\n\n• **Dubai Luxury Experience** - 4N5D from ₹44,999\n• **Dubai Honeymoon Special** - 5N6D from ₹59,999\n\nExperience the glitz and glamour of Dubai! Burj Khalifa, desert safari, and world-class shopping! 🏙️\n\nWant more details?";
  }

  if (msg.includes('maldives')) {
    return "🏝️ **Maldives Package:**\n\n• **Maldives Paradise Escape** - 4N5D from ₹79,999\n\nThe ultimate tropical paradise with overwater villas and crystal-clear lagoons! Perfect for honeymooners! 💎\n\nReady to book your dream escape?";
  }

  if (msg.includes('honeymoon')) {
    return "💕 **Honeymoon Packages:**\n\n• Kerala Honeymoon - 4N5D from ₹22,999\n• Kashmir Honeymoon - 6N7D from ₹28,999\n• Manali Honeymoon - 5N6D from ₹19,999\n• Dubai Honeymoon - 5N6D from ₹59,999\n• Maldives Paradise - 4N5D from ₹79,999\n• Bali Romantic - 5N6D from ₹45,999\n\nWhich destination interests you? 🌹";
  }

  if (msg.includes('adventure') || msg.includes('trekking')) {
    return "🏔️ **Adventure Packages:**\n\n• Manali Adventure - 4N5D from ₹11,999\n• Nepal Himalayan Adventure - 5N6D from ₹21,999\n\nThrilling experiences await! Paragliding, river rafting, trekking, and more! 🧗\n\nWant to explore these?";
  }

  if (msg.includes('international')) {
    return "🌏 **International Packages:**\n\n• Dubai - from ₹44,999\n• Maldives - from ₹79,999\n• Thailand - from ₹32,999\n• Singapore - from ₹38,999\n• Malaysia & Singapore - from ₹42,999\n• Bali - from ₹45,999\n• Sri Lanka - from ₹29,999\n• Vietnam - from ₹27,999\n\nWhich destination catches your eye? ✈️";
  }

  if (msg.includes('domestic') || msg.includes('india')) {
    return "🇮🇳 **Domestic Packages:**\n\n• Kerala - from ₹18,999\n• Kashmir - from ₹17,999\n• Goa - from ₹12,999\n• Darjeeling & Sikkim - from ₹15,999\n• Andaman - from ₹24,999\n• Manali - from ₹11,999\n• Golden Triangle - from ₹15,999\n\nWhere would you like to go? 🗺️";
  }

  if (msg.includes('book') || msg.includes('price') || msg.includes('cost') || msg.includes('budget')) {
    return "🎉 Great choice! To proceed with booking:\n\n📞 **Call us:** +91 98765 43210\n📧 **Email:** hello@wayfare.com\n\nOr fill out our contact form on the website. Our travel experts will get back to you within 2 hours!\n\nWe offer the best prices with flexible payment options! 💳";
  }

  if (msg.includes('hotel')) {
    return "🏨 **Popular Hotels:**\n\n• Taj Malabar Resort, Kerala - ₹12,000/night\n• The Lalit Grand Palace, Kashmir - ₹15,000/night\n• Burj Al Arab, Dubai - ₹65,000/night\n• Marina Bay Sands, Singapore - ₹35,000/night\n\nWe have options for every budget! What destination are you looking at? 🌟";
  }

  if (msg.includes('flight')) {
    return "✈️ **Flight Deals:**\n\n• Delhi → Dubai (Emirates) - ₹15,999\n• Mumbai → Maldives (IndiGo) - ₹18,999\n• Delhi → Bangkok (Thai Airways) - ₹16,999\n• Mumbai → Singapore (SIA) - ₹21,999\n• Delhi → Srinagar (Air India) - ₹5,999\n• Mumbai → Goa (Vistara) - ₹4,499\n\nAll prices are round-trip! 🛫";
  }

  return "I'd love to help you plan your trip! 🌟 You can ask me about:\n\n• **Packages** - Domestic & International tour packages\n• **Hotels** - Luxury, resort, and boutique options\n• **Flights** - Best airfare deals\n• **Destinations** - Weather, attractions, best time to visit\n• **Booking** - How to book and payment options\n\nOr call us at **+91 98765 43210** for immediate assistance! ✈️";
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { message } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = getAutoReply(message);

    return new Response(JSON.stringify({
      success: true,
      response,
      messageCount: 1,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to process message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestDelete(context) {
  return new Response(JSON.stringify({ success: true, message: 'Conversation cleared' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
