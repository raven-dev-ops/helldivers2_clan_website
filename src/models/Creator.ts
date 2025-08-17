// src/models/Creator.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICreator extends Document {
  discordUserId: string; // Store the *User* ID, not server ID
  discordUsername: string; // Their Discord username#discriminator or global name
  twitchChannelName: string; // Their main Twitch channel name (for linking/embed)
  displayName?: string; // Optional preferred display name
  profileImageUrl?: string; // Optional: Manually add URL to their Discord/Twitch avatar
  description?: string; // Optional: Brief bio you add
  isFeatured?: boolean; // Optional: Flag for featured creators
  // Add other fields like YouTube, Kick links etc.
}

const CreatorSchema = new Schema<ICreator>(
  {
    discordUserId: { type: String, required: true, unique: true, index: true },
    discordUsername: { type: String, required: true },
    twitchChannelName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    displayName: { type: String },
    profileImageUrl: { type: String },
    description: { type: String },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CreatorModel =
  (mongoose.models.Creator as Model<ICreator>) ||
  mongoose.model<ICreator>('Creator', CreatorSchema);

export default CreatorModel;
