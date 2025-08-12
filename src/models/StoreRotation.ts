// src/models/StoreRotation.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStoreRotation extends Document {
  starts_at: Date;
  ends_at: Date;
  items: string[]; // references StoreItem _id
  source: 'admin' | 'community';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StoreRotationSchema = new Schema<IStoreRotation>({
  starts_at: { type: Date, required: true },
  ends_at: { type: Date, required: true },
  items: [{ type: String, ref: 'StoreItem', required: true }],
  source: { type: String, enum: ['admin', 'community'], default: 'admin' },
  notes: { type: String },
}, { timestamps: true });

StoreRotationSchema.index({ starts_at: 1, ends_at: 1 });

const StoreRotationModel: Model<IStoreRotation> = (mongoose.models.StoreRotation as Model<IStoreRotation>) ||
  mongoose.model<IStoreRotation>('StoreRotation', StoreRotationSchema);

export default StoreRotationModel;