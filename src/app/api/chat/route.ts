export const runtime = 'edge';
import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import {
  getAllEdgePackages,
  getAllEdgeDestinations,
  getAllEdgeHotels,
  getAllEdgeFlights,
} from '@/lib/edge-data';

const conversations = new Map<string, Array<{ role: string; content: string }>>();
const MAX_MESSAGES = 30;

async function getTravelContext(): Promise<string> {
  try {
    const packages = getAllEdgePackages();
    const destinations = getAllEdgeDestinations();
    const hotels = getAllEdgeHotels();
    const flights = getAllEdgeFlights();

    const domesticDests = destinations.filter((d) => d.country === 'India').map((d) => d.name);
    const internationalDests = destinations.filter((d) => d.country !== 'India').map((d) => d.name);

    const packageList = packages.map((p) => ({
      name: p.name, destination: p.destination.name, category: p.category,
      duration: p.duration, price: `₹${p.price.toLocaleString('en-IN')}`,
    }));

    const hotelList = hotels.map((h) => ({
      name: h.name, destination: h.destination.name, category: h.category,
      stars: h.stars, pricePerNight: `₹${h.pricePerNight.toLocaleString('en-IN')}`,
    }));

    const flightList = flights.map((f) => ({
      from: f.from, to: f.to, airline: f.airline,
      price: `₹${f.price.toLocaleString('en-IN')}`, type: f.type,
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
    return 'Travel data temporarily unavailable.';
  }
}

function getSystemPrompt(travelContext: string): string {
  return `You are Wayfare AI, the friendly and professional travel assistant for Wayfare — a premium tour and travel company based in India.

=== YOUR PERSONALITY ===
- Warm, enthusiastic, and knowledgeable about travel
- Professional yet conversational
- You use emojis sparingly but effectively (✈️ 🏖️ 🏔️ 🌴 🗺️ 💎 etc.)
- You always try to be helpful and guide customers toward booking

=== YOUR KNOWLEDGE BASE ===
${travelContext}

=== CONVERSATION GUIDELINES ===
1. When a customer asks about a destination, suggest specific packages
2. Always mention prices in INR (₹) format
3. If they ask about honeymoons, highlight honeymoon packages
4. If they ask about adventure, suggest adventure packages
5. If they mention a budget, suggest packages within that range
6. For families, suggest family-friendly packages
7. When they're interested in booking, encourage them to call +91 98765 43210
8. Keep responses concise and scannable
9. Never make up packages or prices not in the database
10. Respond in the same language the customer uses
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

    let history = conversations.get(sessionId) || [];

    if (history.length === 0) {
      const travelContext = await getTravelContext();
      const systemPrompt = getSystemPrompt(travelContext);
      history.push({ role: 'assistant', content: systemPrompt });
    }

    history.push({ role: 'user', content: message });

    if (history.length > MAX_MESSAGES) {
      history = [history[0], ...history.slice(-(MAX_MESSAGES - 1))];
    }

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: history as Array<{ role: 'assistant' | 'user'; content: string }>,
      thinking: { type: 'disabled' },
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    history.push({ role: 'assistant', content: aiResponse });
    conversations.set(sessionId, history);

    return NextResponse.json({ success: true, response: aiResponse, messageCount: history.length - 1 });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    if (sessionId) conversations.delete(sessionId);
    return NextResponse.json({ success: true, message: 'Conversation cleared' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear conversation' }, { status: 500 });
  }
}
