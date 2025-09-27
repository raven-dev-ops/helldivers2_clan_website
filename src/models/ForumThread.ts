import { Schema, models, model, type Model, type Document, Types } from 'mongoose';

export interface ForumThreadDocument extends Document {
  title: string;
  body?: string;
  categoryId: Types.ObjectId;
  authorId: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const ForumThreadSchema = new Schema<ForumThreadDocument>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, default: '' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'ForumCategory', required: true },
    authorId: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  }
);

ForumThreadSchema.index({ categoryId: 1, createdAt: -1 });
ForumThreadSchema.index({ authorId: 1, createdAt: -1 });

const ForumThreadModel: Model<ForumThreadDocument> =
  models.ForumThread || model<ForumThreadDocument>('ForumThread', ForumThreadSchema);

export default ForumThreadModel;
