// src/models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// --- Define the Interface for the User Document ---
export interface IUser extends Document {
  name?: string | null;
  email?: string | null; // Ensure this is unique if needed
  emailVerified?: Date | null;
  image?: string | null;
  role: 'user' | 'moderator' | 'admin';
  division?: string | null;

  // --- Fields for OAuth Provider Information (MUST EXIST) ---
  provider?: string | null;          // <<< ADD THIS LINE
  providerAccountId?: string | null; // <<< ADD THIS LINE

  createdAt: Date; // from timestamps
  updatedAt: Date; // from timestamps
}

// --- Define the Mongoose Schema ---
const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, unique: true, sparse: true, lowercase: true },
    emailVerified: { type: Date, default: null },
    image: { type: String },
    role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user', required: true },
    division: { type: String, default: null },

    // --- Provider Fields Schema Definition (MUST EXIST) ---
    provider: { type: String, index: true }, // <<< ADD THIS LINE
    providerAccountId: { type: String },      // <<< ADD THIS LINE
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// --- Compound Index for Provider Lookups (Recommended) ---
UserSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true, sparse: true });

// --- Create and Export the Mongoose Model ---
const UserModel =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);

export default UserModel;