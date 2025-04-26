// src/app/api/partners/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Assuming Mongoose connector at this path
import ServerListingModel, { IServerListing } from '@/models/ServerListing'; // Import your model
import mongoose from 'mongoose'; // Import mongoose

// Define the structure of the data you want to return from this API
interface ApiPartnerData {
    id: string; // Document _id as string
    name: string;
    inviteLink: string;
    // Add other fields if needed by the API consumer
}

// --- GET Handler ---
export async function GET() {
  console.log('[GET /api/partners] - Request received');
  try {
    await dbConnect();
    console.log("[GET /api/partners] - Database connected");

    const partnersRaw = await ServerListingModel.find({})
      .select('_id discord_server_name discord_invite_link')
      .sort({ discord_server_name: 1 })
      .lean();

    console.log(`[GET /api/partners] - Found ${partnersRaw?.length ?? 0} documents`);

    if (!partnersRaw || partnersRaw.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Map and serialize the data
    const partners: ApiPartnerData[] = partnersRaw.map((p: any) => ({
      id: p._id.toString(), // Convert ObjectId to string
      name: p.discord_server_name,
      inviteLink: p.discord_invite_link,
    }));

    console.log(`[GET /api/partners] - Returning ${partners.length} partners`);
    return NextResponse.json(partners);

  } catch (error) {
    console.error('[GET /api/partners] - Error fetching partners:', error);
    return NextResponse.json(
      { message: 'Failed to fetch partners', error: (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

// --- POST Handler (Implemented Creation Logic with Type Assertion) ---
export async function POST(req: NextRequest) {
  console.log('[POST /api/partners] - Request received');
  try {
    const body = await req.json();
    console.log('[POST /api/partners] - Received data:', body);

    // --- 1. Basic Validation ---
    if (!body.discord_server_id || !body.discord_server_name || !body.discord_invite_link) {
      return NextResponse.json(
        { message: 'Missing required fields: discord_server_id, discord_server_name, and discord_invite_link are required.' },
        { status: 400 } // Bad Request
      );
    }

    // --- 2. Connect to Database ---
    await dbConnect();
    console.log("[POST /api/partners] - Database connected");

    // --- 3. Map Incoming Data to Schema Fields ---
    const newPartnerData = {
        discord_server_id: body.discord_server_id,
        discord_server_name: body.discord_server_name,
        discord_invite_link: body.discord_invite_link,
        // Add other optional fields from body if they exist and are defined in your schema
        gpt_channel_id: body.gpt_channel_id,
        lfg_role_id: body.lfg_role_id,
        category_id: body.category_id,
        gpt_stat_access_role_id: body.gpt_stat_access_role_id,
        monitor_channel_id: body.monitor_channel_id,
        stats_log_channel_id: body.stats_log_channel_id,
        leaderboard_channel_id: body.leaderboard_channel_id,
    };

    // --- 4. Check if partner already exists ---
    const existingPartner = await ServerListingModel.findOne({ discord_server_id: newPartnerData.discord_server_id });
    if (existingPartner) {
        return NextResponse.json(
            { message: `Partner with Server ID ${newPartnerData.discord_server_id} already exists.` },
            { status: 409 } // Conflict
        );
    }

    // --- 5. Create New Document Instance ---
    const newPartner = new ServerListingModel(newPartnerData);

    // --- 6. Save Document ---
    const savedPartner = await newPartner.save();
    console.log('[POST /api/partners] - Partner saved successfully:', savedPartner._id);

    // --- 7. Type Assertion for savedPartner._id ---
    // Assert that the saved document includes _id as an ObjectId
    const savedPartnerTyped = savedPartner as IServerListing & { _id: mongoose.Types.ObjectId };

    // --- 8. Construct Return Data ---
    const result: ApiPartnerData = {
        id: savedPartnerTyped._id.toString(), // Use .toString() on the asserted ObjectId
        name: savedPartnerTyped.discord_server_name,
        inviteLink: savedPartnerTyped.discord_invite_link,
    };

    // --- 9. Return Success Response ---
    return NextResponse.json({ message: 'Partner created successfully', partner: result }, { status: 201 }); // 201 Created

  } catch (error: unknown) {
    console.error('[POST /api/partners] - Error processing request:', error);

    // Handle Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json(
            { message: 'Validation failed', errors: error.errors },
            { status: 400 } // Bad Request
         );
    }
    // Handle duplicate key errors
     if (error instanceof Error && (error as any).code === 11000) {
         // Extract the field that caused the duplicate error if possible
         const field = Object.keys((error as any).keyPattern || {})[0] || 'field';
         return NextResponse.json(
            { message: `Partner with this ${field} already exists.` }, // More specific message
            { status: 409 } // Conflict
        );
    }

    // Generic error
    return NextResponse.json(
      { message: 'Failed to create partner', error: (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

// Optional: Add PUT, DELETE handlers if needed
// export async function PUT(req: NextRequest) { ... }
// export async function DELETE(req: NextRequest) { ... }