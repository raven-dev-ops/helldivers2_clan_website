// src/app/api/partners/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Assuming Mongoose connector at this path
import ServerListingModel, { IServerListing } from '@/models/ServerListing'; // Import your model
import { Schema, model, models } from 'mongoose'; // Import necessary Mongoose types
import mongoose from 'mongoose'; // Import mongoose
import { logger } from '@/lib/logger';

// Define the structure of the data you want to return from this API
interface ApiPartnerData {
  id: string; // Document _id as string
  name: string;
  inviteLink: string;
  // Add other fields if needed by the API consumer
}

// --- GET Handler ---
export async function GET() {
  logger.info('[GET /api/partners] - Request received');
  try {
    await dbConnect();
    logger.info('[GET /api/partners] - Database connected');

    const partnersRaw = await ServerListingModel.find({})
      .select('_id discord_server_name discord_invite_link')
      .sort({ discord_server_name: 1 })
      .lean();

    logger.info(
      `[GET /api/partners] - Found ${partnersRaw?.length ?? 0} documents`
    );

    if (!partnersRaw || partnersRaw.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Map and serialize the data
    const partners: ApiPartnerData[] = partnersRaw.map((p: any) => ({
      id: p._id.toString(), // Convert ObjectId to string
      name: p.discord_server_name,
      inviteLink: p.discord_invite_link,
    }));

    logger.info(`[GET /api/partners] - Returning ${partners.length} partners`);
    return NextResponse.json(partners);
  } catch (error) {
    logger.error('[GET /api/partners] - Error fetching partners:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch partners',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// --- POST Handler (Implemented Creation Logic with Type Assertion) ---
export async function POST(req: NextRequest) {
  logger.info('[POST /api/partners] - Request received');
  try {
    const body = await req.json();
    logger.info('[POST /api/partners] - Received data:', body);

    // --- 1. Basic Validation ---
    if (
      !body.discord_server_id ||
      !body.discord_server_name ||
      !body.discord_invite_link
    ) {
      return NextResponse.json(
        {
          message:
            'Missing required fields: discord_server_id, discord_server_name, and discord_invite_link are required.',
        },
        { status: 400 } // Bad Request
      );
    }

    // --- 2. Extract invite code from link ---
    const inviteMatch = body.discord_invite_link.match(
      /discord(?:\.gg|app\.com\/invite)\/([a-zA-Z0-9-]+)/
    );
    const inviteCode = inviteMatch?.[1];

    if (!inviteCode) {
      return NextResponse.json(
        { message: 'Invalid Discord invite link format.' },
        { status: 400 }
      );
    }

    // --- 3. Validate with Discord API ---
    const discordApiUrl = `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`;
    const discordRes = await fetch(discordApiUrl);

    if (!discordRes.ok) {
      logger.error(
        `[POST /api/partners] - Discord API fetch failed for ${inviteCode}: ${discordRes.status}`
      );
      return NextResponse.json(
        { message: 'Discord invite is invalid or expired.' },
        { status: 400 }
      );
    }

    const discordData = await discordRes.json();
    const guild = discordData.guild;

    if (!guild?.id) {
      logger.error(
        `[POST /api/partners] - Discord API response missing guild data or guild ID for ${inviteCode}`
      );
      return NextResponse.json(
        { message: 'Discord invite does not link to a valid server.' },
        { status: 400 }
      );
    }

    // --- 4. Connect to Database (moved after API validation) ---
    await dbConnect();
    logger.info('[POST /api/partners] - Database connected');

    // --- 5. Map Incoming Data to Schema Fields and Add Validated Discord Data ---
    const newPartnerData = {
      // Use validated data from Discord API as primary source
      discord_server_id: guild.id,
      discord_server_name: guild.name,
      discord_invite_link: body.discord_invite_link,
      guild_icon: guild.icon || null, // Store icon hash
      guild_description: guild.description || null, // Store description
      member_count: discordData.approximate_member_count || 0, // Store online members
      presence_count: discordData.approximate_member_count || 0, // Store total members (approximate)

      // Add other optional fields from body if they exist and are defined in your schema
      gpt_channel_id: body.gpt_channel_id,
      lfg_role_id: body.lfg_role_id,
      category_id: body.category_id,
      gpt_stat_access_role_id: body.gpt_stat_access_role_id,
      stats_log_channel_id: body.stats_log_channel_id,
      leaderboard_channel_id: body.leaderboard_channel_id,
    };

    // --- 4. Check if partner already exists ---
    const existingPartner = await ServerListingModel.findOne({
      discord_server_id: newPartnerData.discord_server_id,
    });
    if (existingPartner) {
      return NextResponse.json(
        {
          message: `Partner with Server ID ${newPartnerData.discord_server_id} already exists.`,
        },
        { status: 409 } // Conflict
      );
    }

    // --- 7. Create New Document Instance ---
    const newPartner = new ServerListingModel(newPartnerData);

    // --- 8. Save Document ---
    const savedPartner = await newPartner.save();
    logger.info(
      '[POST /api/partners] - Partner saved successfully:',
      savedPartner._id
    );

    // --- 9. Type Assertion for savedPartner._id ---
    // Assert that the saved document includes _id as an ObjectId
    const savedPartnerTyped = savedPartner as IServerListing & {
      _id: mongoose.Types.ObjectId;
    };

    // --- 10. Construct Return Data ---
    const result: ApiPartnerData = {
      id: savedPartnerTyped._id.toString(),
      name: savedPartnerTyped.discord_server_name,
      inviteLink: savedPartnerTyped.discord_invite_link,
    };

    // --- 9. Return Success Response ---
    return NextResponse.json(
      { message: 'Partner created successfully', partner: result },
      { status: 201 }
    ); // 201 Created
  } catch (error: unknown) {
    logger.error('[POST /api/partners] - Error processing request:', error);

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
      {
        message: 'Failed to create partner',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Optional: Add PUT, DELETE handlers if needed
// export async function PUT(req: NextRequest) { ... }
// export async function DELETE(req: NextRequest) { ... }

// --- UPDATE src/models/ServerListing.ts ---
// Add the new fields to the Mongoose schema and TypeScript interface

/*
** NOTE: **
This part requires you to manually update your ServerListingModel file
at src/models/ServerListing.ts.

Here is the suggested structure for your IServerListing interface and
the corresponding schema definition within src/models/ServerListing.ts:

import { Document, Schema, model, models } from 'mongoose';

export interface IServerListing extends Document {
    discord_server_id: string; // Use guild.id from Discord API
    discord_server_name: string; // Use guild.name from Discord API
    discord_invite_link: string;
    guild_icon?: string | null; // Discord server icon hash
    guild_description?: string | null; // Discord server description
    member_count?: number; // Approximate online members
    presence_count?: number; // Approximate total members

    // Existing optional fields
    gpt_channel_id?: string;
    lfg_role_id?: string;
    category_id?: string; // Consider if this is still needed or if Discord category ID is better
    gpt_stat_access_role_id?: string;
    stats_log_channel_id?: string; // Assuming monitor_channel_id was a typo or combined
    leaderboard_channel_id?: string;
    // Add other fields as needed
}

const ServerListingSchema = new Schema<IServerListing>({
    discord_server_id: { type: String, required: true, unique: true },
    discord_server_name: { type: String, required: true },
    discord_invite_link: { type: String, required: true, unique: true }, // Ensure invite link is also unique if desired
    guild_icon: { type: String },
    guild_description: { type: String },
    member_count: { type: Number, default: 0 },
    presence_count: { type: Number, default: 0 },

    gpt_channel_id: { type: String },
    lfg_role_id: { type: String },
    category_id: { type: String },
    gpt_stat_access_role_id: { type: String },
    stats_log_channel_id: { type: String },
    leaderboard_channel_id: { type: String },
});

// Add indexes if helpful for performance (e.g., on discord_server_id, discord_invite_link)
ServerListingSchema.index({ discord_server_id: 1 }, { unique: true });
ServerListingSchema.index({ discord_invite_link: 1 }, { unique: true });

const ServerListingModel = (models.ServerListing as mongoose.Model<IServerListing>) || model<IServerListing>('ServerListing', ServerListingSchema);

export default ServerListingModel;

You need to manually add these fields to your actual ServerListingModel definition file
to ensure the data is saved correctly.
*/
