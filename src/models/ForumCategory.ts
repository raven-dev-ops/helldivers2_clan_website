// src/models/ForumCategory.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IForumCategory extends Document {
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ForumCategorySchema = new Schema<IForumCategory>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const ForumCategoryModel =
  (mongoose.models.ForumCategory as Model<IForumCategory>) ||
  mongoose.model<IForumCategory>("ForumCategory", ForumCategorySchema);

export default ForumCategoryModel;
