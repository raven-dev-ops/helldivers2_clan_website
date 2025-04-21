// src/models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// --- Define the Interface for the User Document ---
export interface IUser extends Document {
  name?: string; // User's display name (optional on initial signup?)
  email?: string; // User's email (usually required & unique after initial signup)
  emailVerified?: Date | null; // Provided by NextAuth adapter
  image?: string; // URL to profile picture
  role: 'user' | 'moderator' | 'admin'; // Define specific roles using enum
  division?: string; // The selected game division identifier
  accounts?: any[]; // Embedded accounts from providers (handled by adapter)
  sessions?: any[]; // Embedded sessions (handled by adapter if DB sessions)
  createdAt?: Date; // Managed by Mongoose timestamps
  updatedAt?: Date; // Managed by Mongoose timestamps
}

// --- Define the Mongoose Schema ---
const UserSchema = new Schema<IUser>(
  {
    name: {
        type: String,
        // You might want basic length validation here too
        // minlength: 2,
        // maxlength: 50,
    },
    email: {
        type: String,
        unique: true, // Ensure emails are unique in the database
        // Use sparse index if email is not always required (allows multiple nulls)
        sparse: true,
        // Optional basic email format validation at schema level
        // match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill a valid email address'],
        // Consider lowercasing emails automatically before saving:
        // lowercase: true,
        // trim: true,
    },
    emailVerified: {
        type: Date, // NextAuth adapter usually stores verification timestamp
        default: null,
    },
    image: {
        type: String, // URL
    },
    role: {
        type: String,
        enum: ['user', 'moderator', 'admin'], // Define allowed roles
        default: 'user', // Default role for new users
        required: true,
    },
    division: {
        type: String, // Stores the identifier like 'helldivers-2'
        // Optional: Add validation if divisions must match a specific list
        // enum: ['helldivers-2', 'dune-awakening', 'future0', 'future1', 'future2', 'general']
    },
    // Note: `accounts` and `sessions` fields are typically managed automatically
    // by the @next-auth/mongodb-adapter if you are using it.
    // You generally don't need to define them explicitly unless customizing heavily.
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// --- Create and Export the Mongoose Model ---
// This pattern prevents redefining the model during hot reloads
const UserModel =
  (mongoose.models.User as Model<IUser>) || // Check if model already exists
  mongoose.model<IUser>("User", UserSchema); // Create model if it doesn't exist

export default UserModel;