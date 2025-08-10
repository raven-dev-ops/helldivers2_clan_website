// src/models/StoreItem.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStoreItem extends Document {
  _id: string;
  name: string;
  type: 'armor_set' | 'helmet' | 'cape' | 'weapon' | 'emote' | 'other';
  price_sc: number;
  image_url: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const StoreItemSchema = new Schema<IStoreItem>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['armor_set', 'helmet', 'cape', 'weapon', 'emote', 'other'], required: true },
  price_sc: { type: Number, required: true, min: 0 },
  image_url: { type: String, required: true },
  tags: [{ type: String }],
}, { timestamps: true });

const StoreItemModel: Model<IStoreItem> = (mongoose.models.StoreItem as Model<IStoreItem>) ||
  mongoose.model<IStoreItem>('StoreItem', StoreItemSchema);

export default StoreItemModel;