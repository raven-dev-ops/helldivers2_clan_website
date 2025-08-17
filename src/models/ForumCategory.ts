// src/models/ForumCategory.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// --- Updated Interface ---
export interface IForumCategory extends Document {
  name: string;
  description?: string;
  slug: string; // Added slug field
  order?: number; // Added optional order field
  createdAt?: Date; // Keep timestamps
  updatedAt?: Date; // Keep timestamps
}

// --- Updated Schema ---
const ForumCategorySchema = new Schema<IForumCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Good practice to trim whitespace
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      // Added slug definition
      type: String,
      required: true,
      unique: true, // Ensure slugs are unique
      index: true, // Add index for faster lookups by slug
      lowercase: true, // Store slugs in lowercase
      trim: true,
    },
    order: {
      // Added order definition
      type: Number,
      default: 0, // Default order value
      index: true, // Index if you sort by it often
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// --- Generate Slug Before Saving (Mongoose Middleware) ---
// This middleware automatically creates/updates the slug based on the name
// whenever a category document is saved.
ForumCategorySchema.pre<IForumCategory>('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    // Basic slug generation: lowercase, replace spaces with hyphens, remove invalid chars
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars except -
      .replace(/\-\-+/g, '-'); // Replace multiple - with single -
  }
  next();
});

// --- Model Export (No changes needed here) ---
const ForumCategoryModel =
  (mongoose.models.ForumCategory as Model<IForumCategory>) ||
  mongoose.model<IForumCategory>('ForumCategory', ForumCategorySchema);

export default ForumCategoryModel;
