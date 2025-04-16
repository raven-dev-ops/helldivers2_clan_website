// src/models/Bot.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBot extends Document {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BotSchema = new Schema<IBot>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

/**
 * Singleton pattern: Check if model is already compiled
 * to avoid recompilation in dev mode (hot-reload).
 */
const BotModel =
  (mongoose.models.Bot as Model<IBot>) || mongoose.model<IBot>("Bot", BotSchema);

export default BotModel;
