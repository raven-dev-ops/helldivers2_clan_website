// src/models/ForumThread.ts (Updated)
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IForumThread extends Document {
  categoryId: mongoose.Types.ObjectId;
  title: string;
  authorId?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date; // Mongoose timestamps handle this automatically
  // Optional but useful additions:
  lastActivity?: Date; // Timestamp of the last post
  replyCount?: number; // Number of posts (minus the first one)
}

const ForumThreadSchema = new Schema<IForumThread>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'ForumCategory',
      required: true,
    },
    title: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    lastActivity: { type: Date, default: Date.now, index: true }, // Index for sorting
    replyCount: { type: Number, default: 0 },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Update lastActivity whenever a post is added/updated (can be done via middleware or explicitly in actions)
// We will update it explicitly in the server action for creating posts.

const ForumThreadModel =
  (mongoose.models.ForumThread as Model<IForumThread>) ||
  mongoose.model<IForumThread>('ForumThread', ForumThreadSchema);

export default ForumThreadModel;
