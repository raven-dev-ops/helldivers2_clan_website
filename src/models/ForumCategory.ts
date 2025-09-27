import { Schema, models, model, type Model, type Document } from 'mongoose';

export interface ForumCategoryDocument extends Document {
  name: string;
  description?: string;
  slug?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ForumCategorySchema = new Schema<ForumCategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    slug: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

ForumCategorySchema.index({ slug: 1 }, { unique: true, sparse: true });

const ForumCategoryModel: Model<ForumCategoryDocument> =
  models.ForumCategory || model<ForumCategoryDocument>('ForumCategory', ForumCategorySchema);

export default ForumCategoryModel;
