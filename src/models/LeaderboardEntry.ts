// src/models/LeaderboardEntry.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  userId?: mongoose.Types.ObjectId;
  username?: string; // or store a separate user name?
  score: number;
  rank?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const LeaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, // if linking to User
    username: { type: String },
    score: { type: Number, required: true },
    rank: { type: Number },
  },
  { timestamps: true }
);

const LeaderboardEntryModel =
  (mongoose.models.LeaderboardEntry as Model<ILeaderboardEntry>) ||
  mongoose.model<ILeaderboardEntry>('LeaderboardEntry', LeaderboardEntrySchema);

export default LeaderboardEntryModel;
