import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const logs = await db.deployLog.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching deploy logs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch deploy logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const triggeredBy = body?.triggeredBy || 'admin';

    // Create a deploy log entry first
    const deployLog = await db.deployLog.create({
      data: {
        action: 'deploy',
        details: 'Generating edge-data.json and updating Cloudflare Functions data from database',
        status: 'running',
        triggeredBy,
      },
    });

    try {
      // Fetch all data from the database
      const [packages, destinations, hotels, flights] = await Promise.all([
        db.package.findMany({
          where: { status: 'active' },
          include: {
            destination: { select: { name: true, country: true } },
          },
        }),
        db.destination.findMany({
          where: { status: 'active' },
        }),
        db.hotel.findMany({
          where: { status: 'active' },
          include: {
            destination: { select: { name: true, country: true } },
          },
        }),
        db.flightDeal.findMany(),
      ]);

      // Transform to edge-data.json format
      const edgePackages = packages.map((pkg) => ({
        slug: pkg.slug,
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        duration: pkg.duration,
        category: pkg.category,
        image: pkg.image,
        destination: {
          name: pkg.destination.name,
          country: pkg.destination.country,
        },
      }));

      const edgeDestinations = destinations.map((dest) => ({
        slug: dest.slug,
        name: dest.name,
        tagline: dest.tagline,
        description: dest.description,
        country: dest.country,
        image: dest.image,
      }));

      const edgeHotels = hotels.map((hotel) => ({
        slug: hotel.slug,
        name: hotel.name,
        description: hotel.description,
        pricePerNight: hotel.pricePerNight,
        stars: hotel.stars,
        category: hotel.category,
        image: hotel.image,
        destination: {
          name: hotel.destination.name,
          country: hotel.destination.country,
        },
      }));

      const edgeFlights = flights.map((flight) => ({
        id: flight.id,
        from: flight.from,
        to: flight.to,
        airline: flight.airline,
        price: flight.price,
        originalPrice: flight.originalPrice,
        type: flight.type,
        image: flight.image,
        description: flight.description,
        featured: flight.featured,
        createdAt: flight.createdAt.toISOString(),
        updatedAt: flight.updatedAt.toISOString(),
      }));

      const edgeData = {
        packages: edgePackages,
        destinations: edgeDestinations,
        hotels: edgeHotels,
        flights: edgeFlights,
      };

      // Write to edge-data.json (pretty-printed)
      const edgeDataPath = join(process.cwd(), 'src/lib/edge-data.json');
      writeFileSync(edgeDataPath, JSON.stringify(edgeData, null, 2), 'utf-8');

      // Also update the Cloudflare Functions data file at functions/data.js
      const cfDataPath = join(process.cwd(), 'functions/data.js');
      try {
        const existingFile = readFileSync(cfDataPath, 'utf-8');

        // Replace the const data = {...}; line with the new data
        // The data is written as compact JSON (same format as original)
        const newDataLine = `const data = ${JSON.stringify(edgeData)};`;
        const updatedFile = existingFile.replace(
          /const data = \{[\s\S]*?\};\n/,
          newDataLine + '\n'
        );

        writeFileSync(cfDataPath, updatedFile, 'utf-8');
      } catch (cfError) {
        console.error('Warning: Could not update Cloudflare Functions data file:', cfError);
        // Non-fatal — the main edge-data.json is still written
      }

      // Update deploy log to success
      await db.deployLog.update({
        where: { id: deployLog.id },
        data: {
          status: 'success',
          details: `Generated edge-data.json with ${edgePackages.length} packages, ${edgeDestinations.length} destinations, ${edgeHotels.length} hotels, ${edgeFlights.length} flights. Also updated Cloudflare Functions data.`,
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          deployLogId: deployLog.id,
          stats: {
            packages: edgePackages.length,
            destinations: edgeDestinations.length,
            hotels: edgeHotels.length,
            flights: edgeFlights.length,
          },
        },
      });
    } catch (innerError) {
      // Update deploy log to failed
      await db.deployLog.update({
        where: { id: deployLog.id },
        data: {
          status: 'failed',
          details: innerError instanceof Error ? innerError.message : 'Unknown error during deploy',
        },
      });

      throw innerError;
    }
  } catch (error) {
    console.error('Error during deploy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to deploy' },
      { status: 500 }
    );
  }
}
