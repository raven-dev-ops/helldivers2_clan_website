// src/models/BotApplication.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBotApplication extends Document {
  userId: Types.ObjectId; // User who applied
  botId: string; // Identifier for the specific bot applied for
  // discordServerId?: string; // Optional: Store server ID if captured later
  status: 'pending' | 'approved' | 'rejected' | 'contacted'; // Application status
  createdAt?: Date;
  updatedAt?: Date;
}

const BotApplicationSchema = new Schema<IBotApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    botId: { type: String, required: true, index: true }, // e.g., 'lfg-linker', 'stats-tracker'
    // discordServerId: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'contacted'], default: 'pending' },
  },
  { timestamps: true }
);

// Ensure compound index for efficient lookup
BotApplicationSchema.index({ userId: 1, botId: 1 }, { unique: true });

const BotApplicationModel =
  (mongoose.models.BotApplication as Model<IBotApplication>) ||
  mongoose.model<IBotApplication>("BotApplication", BotApplicationSchema);

export default BotApplicationModel;