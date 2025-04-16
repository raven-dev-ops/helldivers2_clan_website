// src/models/Creator.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICreator extends Document {
  name: string;
  platform?: string;
  url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CreatorSchema = new Schema<ICreator>(
  {
    name: { type: String, required: true },
    platform: { type: String },
    url: { type: String },
  },
  { timestamps: true }
);

const CreatorModel =
  (mongoose.models.Creator as Model<ICreator>) ||
  mongoose.model<ICreator>("Creator", CreatorSchema);

export default CreatorModel;
