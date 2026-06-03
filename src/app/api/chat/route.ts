export const runtime = 'edge';
import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import {
  getAllEdgePackages,
  getAllEdgeDestinations,
  getAllEdgeHotels,
  getAllEdgeFlights,
} from '@/lib/edge-data';

// In-memory conversation store (use DB in production)
const conversations = new Map<string, Array<{ role: string; content: string }>>();

// Max messages per conversation to prevent token overflow
const MAX_MESSAGES = 30;

async function getTravelContext(): Promise<string> {
  try {
    const packages = getAllEdgePackages();
    const destinations = getAllEdgeDestinations();
    const hotels = getAllEdgeHotels();
    const flights = getAllEdgeFlights();

    const domesticDests = destinations
      .filter((d) => d.country === 'India')
      .map((d) => d.name);
    const internationalDests = destinations
      .filter((d) => d.country !== 'India')
      .map((d) => d.name);

    const packageList = packages.map((p) => ({
      name: p.name,
      destination: p.destination.name,
      category: p.category,
      duration: p.duration,
      price: `₹${p.price.toLocaleString('en-IN')}`,
    }));

    const hotelList = hotels.map((h) => ({
      name: h.name,
      destination: h.destination.name,
      category: h.category,
      stars: h.stars,
      pricePerNight: `₹${h.pricePerNight.toLocaleString('en-IN')}`,
    }));

    const flightList = flights.map((f) => ({
      from: f.from,
      to: f.to,
      airline: f.airline,
      price: `₹${f.price.toLocaleString('en-IN')}`,
      type: f.type,
    }));

    return `
=== WAYFARE TRAVEL DATABASE ===

DOMESTIC DESTINATIONS (India): ${domesticDests.join(', ')}
INTERNATIONAL DESTINATIONS: ${internationalDests.join(', ')}

PACKAGES (${packages.length} total):
${packageList.map((p) => `• ${p.name} | ${p.destination} | ${p.category} | ${p.duration} | ${p.price}`).join('\n')}

HOTELS (${hotels.length} total):
${hotelList.map((h) => `• ${h.name} | ${h.destination} | ${h.category} | ${'⭐'.repeat(h.stars)} | ${h.pricePerNight}/night`).join('\n')}

FLIGHT DEALS (${flights.length} total):
${flightList.map((f) => `• ${f.from} → ${f.to} | ${f.airline} | ${f.price} | ${f.type}`).join('\n')}
`;
  } catch (error) {
    console.error('Error fetching travel context:', error);
    return 'Travel data temporarily unavailable.';
  }
}

function getSystemPrompt(travelContext: string): string {
  return `You are Wayfare AI, the friendly and professional travel assistant for Wayfare — a premium tour and travel company based in India. You help customers find perfect travel packages, hotels, and flight deals.

=== YOUR PERSONALITY ===
- Warm, enthusiastic, and knowledgeable about travel
- Professional yet conversational — like a trusted travel advisor
- You use emojis sparingly but effectively (✈️ 🏖️ 🏔️ 🌴 🗺️ 💎 etc.)
- You always try to be helpful and guide customers toward booking

=== WHAT YOU CAN HELP WITH ===
1. **Finding Travel Packages** — Domestic & International tour packages
2. **Hotel Recommendations** — Luxury, budget, resort, boutique options
3. **Flight Deals** — Best airfare options
4. **Destination Information** — Weather, best time to visit, attractions
5. **Trip Planning** — Duration suggestions, budget estimates
6. **Booking Assistance** — Guide customers to the contact form

=== YOUR KNOWLEDGE BASE ===
${travelContext}

=== CONVERSATION GUIDELINES ===
1. When a customer asks about a destination, suggest specific packages from the database
2. Always mention prices in INR (₹) format
3. If they ask about honeymoons, highlight honeymoon packages (Maldives, Kerala, Andaman, etc.)
4. If they ask about adventure, suggest adventure packages (Manali, Sikkim, Darjeeling, etc.)
5. If they mention a budget, suggest packages within that range
6. For families, suggest family-friendly packages (Goa, Singapore, Malaysia, etc.)
7. When they're interested in booking, encourage them to fill out the contact form or call +91 98765 43210
8. If asked about something not in the database, be honest and suggest alternatives from what's available
9. Package durations are in format like "4N5D" (4 Nights, 5 Days), "5N6D", "6N7D"
10. Always highlight discounts when available

=== QUICK RESPONSE PATTERNS ===
- Greeting: "Welcome to Wayfare! ✈️ I'm your travel assistant. How can I help you plan your dream vacation today?"
- Package inquiry: Provide name, destination, duration, price, and highlights
- Hotel inquiry: Provide name, destination, stars, price/night, and amenities
- Flight inquiry: Provide route, airline, price, and type
- Booking intent: "That sounds like a wonderful choice! 🎉 To proceed with booking, you can fill out our contact form at the bottom of the page or call us at +91 98765 43210. Our travel experts will get back to you within 2 hours!"
- Closing: "Thank you for chatting with Wayfare! 🌟 We'd love to help you create unforgettable memories. Don't hesitate to reach out anytime!"

=== IMPORTANT ===
- Keep responses concise and scannable (use bullet points)
- Never make up packages or prices not in the database
- Always be accurate with the data provided
- If unsure, say "Let me help you find the best option!" and suggest what's available
- Respond in the same language the customer uses (English or Hindi/Hinglish)
`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Get or create conversation history
    let history = conversations.get(sessionId) || [];

    // If new conversation, build system prompt with travel context
    if (history.length === 0) {
      const travelContext = await getTravelContext();
      const systemPrompt = getSystemPrompt(travelContext);
      history.push({
        role: 'assistant',
        content: systemPrompt,
      });
    }

    // Add user message
    history.push({
      role: 'user',
      content: message,
    });

    // Trim old messages if exceeding limit (keep system prompt)
    if (history.length > MAX_MESSAGES) {
      history = [history[0], ...history.slice(-(MAX_MESSAGES - 1))];
    }

    // Call LLM
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: history as Array<{ role: 'assistant' | 'user'; content: string }>,
      thinking: { type: 'disabled' },
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    // Add AI response to history
    history.push({
      role: 'assistant',
      content: aiResponse,
    });

    // Save updated history
    conversations.set(sessionId, history);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      messageCount: history.length - 1,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      conversations.delete(sessionId);
    }

    return NextResponse.json({ success: true, message: 'Conversation cleared' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    return NextResponse.json({ error: 'Failed to clear conversation' }, { status: 500 });
  }
}
