// src/models/ServerListing.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interface matching the data structure you provided
export interface IServerListing extends Document {
  discord_server_id: string;
  discord_server_name: string;
  discord_invite_link: string;
  gpt_channel_id?: string; // Optional fields based on sample data
  lfg_role_id?: string;
  category_id?: string;
  gpt_stat_access_role_id?: string;
  monitor_channel_id?: string;
  stats_log_channel_id?: string;
  leaderboard_channel_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ServerListingSchema = new Schema<IServerListing>(
  {
    discord_server_id: { type: String, required: true, unique: true, index: true }, // Added index
    discord_server_name: { type: String, required: true },
    discord_invite_link: { type: String, required: true },
    gpt_channel_id: { type: String },
    lfg_role_id: { type: String },
    category_id: { type: String },
    gpt_stat_access_role_id: { type: String },
    monitor_channel_id: { type: String },
    stats_log_channel_id: { type: String },
    leaderboard_channel_id: { type: String },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    // --- Explicitly define the collection name ---
    collection: 'Server_Listing', 
  }
);

// Optional: Add index for sorting if you use discord_server_name frequently
ServerListingSchema.index({ discord_server_name: 1 });

// Prevent model overwrite during HMR
const ServerListingModel =
  (mongoose.models.ServerListing as Model<IServerListing>) ||
  mongoose.model<IServerListing>("ServerListing", ServerListingSchema); // Keep model name "ServerListing"

export default ServerListingModel;