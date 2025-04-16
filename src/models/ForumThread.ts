// src/models/ForumThread.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IForumThread extends Document {
  categoryId: mongoose.Types.ObjectId; // or string if you prefer
  title: string;
  authorId?: mongoose.Types.ObjectId; // link to User?
  createdAt?: Date;
  updatedAt?: Date;
}

const ForumThreadSchema = new Schema<IForumThread>(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "ForumCategory", required: true },
    title: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User" }, // if linking to a user
  },
  { timestamps: true }
);

const ForumThreadModel =
  (mongoose.models.ForumThread as Model<IForumThread>) ||
  mongoose.model<IForumThread>("ForumThread", ForumThreadSchema);

export default ForumThreadModel;
