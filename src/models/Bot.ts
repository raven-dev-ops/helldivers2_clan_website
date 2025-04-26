// src/models/Bot.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

// 1. Interface for the core data structure (WITHOUT _id or Document)
export interface IBotBase { // Exporting this is optional, but can be useful
  botIdentifier: string;
  name: string;
  description?: string;
  discordClientId: string;
  iconUrl?: string;
  videoUrl?: string;
  serverCount?: number;
  applyEmailSubject: string;
  applyEmailBody: string;
  order?: number;
}

// 2. Interface for the Mongoose Document (extends the base + Document)
export interface IBotDocument extends IBotBase, Document {
  // Inherits fields from IBotBase
  // Document provides _id: Types.ObjectId;
  // Timestamps option adds createdAt and updatedAt types
}

// 3. Define the Schema using the DOCUMENT interface
const BotSchema = new Schema<IBotDocument>(
  {
    botIdentifier: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    discordClientId: { type: String, required: true },
    iconUrl: { type: String },
    videoUrl: { type: String },
    serverCount: { type: Number, default: 0 },
    applyEmailSubject: { type: String, required: true },
    applyEmailBody: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 4. Define the Model using the DOCUMENT interface
const BotModel =
  (mongoose.models.Bot as Model<IBotDocument>) ||
  mongoose.model<IBotDocument>("Bot", BotSchema);

// 5. *** EXPORT the type for LEAN results ***
// This interface combines the base fields with the auto-generated ones (_id, timestamps)
export interface IBotLean extends IBotBase { // <--- Added 'export' keyword here
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// Default export the model
export default BotModel;