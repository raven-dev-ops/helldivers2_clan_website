// src/models/Partner.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPartner extends Document {
  name: string;
  website?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PartnerSchema = new Schema<IPartner>(
  {
    name: { type: String, required: true },
    website: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const PartnerModel =
  (mongoose.models.Partner as Model<IPartner>) ||
  mongoose.model<IPartner>("Partner", PartnerSchema);

export default PartnerModel;
