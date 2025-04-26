// src/models/BotApplication.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./User"; // Assuming you have a User model interface
import { IBot } from "./Bot"; // Assuming you have a Bot model interface

// Interface for the plain JS object structure (e.g., from .lean())
export interface IBotApplication {
  _id: Types.ObjectId;
  userId: Types.ObjectId | IUser; // Can populate user info
  botId: string; // Stores the Bot's 'botIdentifier'
  // --- NEW/OPTIONAL FIELDS ---
  serverName?: string;
  serverId?: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected'; // Application status
  // --- END NEW/OPTIONAL FIELDS ---
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for the Mongoose Document
export interface IBotApplicationDocument extends Omit<IBotApplication, '_id' | 'userId'>, Document {
    userId: Types.ObjectId; // Keep userId as ObjectId in the document
}


const BotApplicationSchema = new Schema<IBotApplicationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    botId: { type: String, required: true, index: true }, // Stores botIdentifier string
    // --- NEW/OPTIONAL FIELDS ---
    serverName: { type: String },
    serverId: { type: String },
    reason: { type: String },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending', // Default status on creation
        required: true,
    },
    // --- END NEW/OPTIONAL FIELDS ---
  },
  { timestamps: true }
);

// Compound index to prevent duplicate applications (optional but recommended)
BotApplicationSchema.index({ userId: 1, botId: 1 }, { unique: true });


const BotApplicationModel =
  (mongoose.models.BotApplication as Model<IBotApplicationDocument>) ||
  mongoose.model<IBotApplicationDocument>("BotApplication", BotApplicationSchema);

export default BotApplicationModel;

// Export the lean type if needed elsewhere
export interface IBotApplicationLean extends IBotApplication {
    // Ensure populated types match if you populate later
    userId: Types.ObjectId; // Default lean result
}