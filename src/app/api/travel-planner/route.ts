export const runtime = 'edge';

import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import {
  getAllEdgePackages,
  getAllEdgeDestinations,
  getAllEdgeHotels,
} from '@/lib/edge-data';

interface TravelPlannerBody {
  destination: string;
  budget: string;
  duration: string;
  travelers: number;
  category: string;
  preferences?: string;
}

async function getTravelContext(destination: string, category: string): Promise<string> {
  try {
    const packages = getAllEdgePackages();
    const destinations = getAllEdgeDestinations();
    const hotels = getAllEdgeHotels();

    const destLower = destination.toLowerCase();
    const matchedDest = destinations.find(
      (d) => d.name.toLowerCase().includes(destLower) || destLower.includes(d.name.toLowerCase())
    );

    const filteredPackages = matchedDest
      ? packages.filter((p) => p.destinationId === matchedDest.id)
      : packages.filter((p) => p.category === category);

    const filteredHotels = matchedDest
      ? hotels.filter((h) => h.destinationId === matchedDest.id)
      : hotels;

    const packageList = filteredPackages.slice(0, 10).map((p) => ({
      name: p.name,
      destination: p.destination.name,
      category: p.category,
      duration: p.duration,
      price: `\u20B9${p.price.toLocaleString('en-IN')}`,
      highlights: p.highlights,
    }));

    const hotelList = filteredHotels.slice(0, 8).map((h) => ({
      name: h.name,
      destination: h.destination.name,
      category: h.category,
      stars: h.stars,
      pricePerNight: `\u20B9${h.pricePerNight.toLocaleString('en-IN')}`,
    }));

    const allDests = destinations.map((d) => d.name);

    return `
=== WAYFARE TRAVEL DATABASE ===
ALL DESTINATIONS: ${allDests.join(', ')}

MATCHED PACKAGES (${filteredPackages.length} found):
${packageList.map((p) => `\u2022 ${p.name} | ${p.destination} | ${p.category} | ${p.duration} | ${p.price} | Highlights: ${p.highlights}`).join('\n')}

MATCHED HOTELS (${filteredHotels.length} found):
${hotelList.map((h) => `\u2022 ${h.name} | ${h.destination} | ${h.category} | ${'⭐'.repeat(h.stars)} | ${h.pricePerNight}/night`).join('\n')}
`;
  } catch {
    return 'Travel data temporarily unavailable.';
  }
}

function getSystemPrompt(travelContext: string): string {
  return `You are Wayfare AI Travel Planner, an expert travel advisor for Wayfare travel company. You create personalized, detailed travel plans.

${travelContext}

=== RESPONSE FORMAT ===
You MUST respond with valid JSON only. No markdown, no code fences, just raw JSON.

{
  "title": "Catchy trip title",
  "destination": "Destination name",
  "summary": "A warm, exciting 2-3 sentence overview of the trip",
  "packages": [
    {
      "name": "Package name from database or suggested",
      "duration": "e.g. 5N6D",
      "price": "e.g. ₹25,999",
      "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"]
    }
  ],
  "hotels": [
    {
      "name": "Hotel name from database or suggested",
      "type": "luxury/budget/resort/boutique/homestay",
      "pricePerNight": "e.g. ₹5,500"
    }
  ],
  "tips": [
    "Practical travel tip 1",
    "Practical travel tip 2",
    "Practical travel tip 3",
    "Practical travel tip 4",
    "Practical travel tip 5"
  ],
  "estimatedBudget": "e.g. ₹50,000 - ₹75,000 for 2 travelers"
}

=== GUIDELINES ===
1. Suggest 2-3 packages from the database when available, otherwise create realistic suggestions
2. Suggest 2-3 hotels from the database when available
3. Give 5 practical travel tips specific to the destination
4. Include realistic pricing in INR (₹)
5. Budget estimate should factor in the number of travelers
6. Keep tips practical: weather, local customs, packing, safety
7. NEVER make up packages that don't exist if database data is available
`;
}

export async function POST(request: Request) {
  try {
    const body: TravelPlannerBody = await request.json();
    const { destination, budget, duration, travelers, category, preferences } = body;

    if (!destination || !budget || !duration || !travelers || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, budget, duration, travelers, category' },
        { status: 400 }
      );
    }

    const travelContext = await getTravelContext(destination, category);
    const systemPrompt = getSystemPrompt(travelContext);

    const userMessage = `Plan a trip with these preferences:
- Destination: ${destination}
- Budget: ${budget}
- Duration: ${duration}
- Number of travelers: ${travelers}
- Trip category: ${category}
${preferences ? `- Additional preferences: ${preferences}` : ''}

Please provide a detailed travel plan in the specified JSON format.`;

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      thinking: { type: 'disabled' },
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    // Try to parse the AI response as JSON
    let travelPlan;
    try {
      // Strip markdown code fences if present
      const cleaned = aiResponse
        .replace(/^```json?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      travelPlan = JSON.parse(cleaned);
    } catch {
      // If parsing fails, return the raw response as a fallback
      travelPlan = {
        title: `${destination} Adventure`,
        destination,
        summary: aiResponse,
        packages: [],
        hotels: [],
        tips: [],
        estimatedBudget: budget,
      };
    }

    return NextResponse.json({ success: true, plan: travelPlan });
  } catch (error) {
    console.error('Travel Planner API error:', error);
    return NextResponse.json({ error: 'Failed to generate travel plan' }, { status: 500 });
  }
}
