// src/models/ForumPost.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IForumPost extends Document {
  threadId: mongoose.Types.ObjectId;
  authorId?: mongoose.Types.ObjectId;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ForumPostSchema = new Schema<IForumPost>(
  {
    threadId: {
      type: Schema.Types.ObjectId,
      ref: 'ForumThread',
      required: true,
    },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const ForumPostModel =
  (mongoose.models.ForumPost as Model<IForumPost>) ||
  mongoose.model<IForumPost>('ForumPost', ForumPostSchema);

export default ForumPostModel;
