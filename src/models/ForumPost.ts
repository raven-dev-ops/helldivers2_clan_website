import { Schema, models, model, type Model, type Document, Types } from 'mongoose';

export interface ForumPostDocument extends Document {
  threadId: Types.ObjectId;
  authorId: Types.ObjectId | string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const ForumPostSchema = new Schema<ForumPostDocument>(
  {
    threadId: { type: Schema.Types.ObjectId, ref: 'ForumThread', required: true },
    authorId: { type: Schema.Types.Mixed, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

ForumPostSchema.index({ threadId: 1, createdAt: 1 });
ForumPostSchema.index({ authorId: 1, createdAt: -1 });

const ForumPostModel: Model<ForumPostDocument> =
  models.ForumPost || model<ForumPostDocument>('ForumPost', ForumPostSchema);

export default ForumPostModel;
