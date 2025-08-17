// src/models/StatsSubmission.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStatsSubmission extends Document {
  userId?: mongoose.Types.ObjectId;
  kills: number;
  deaths: number;
  assists: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const StatsSubmissionSchema = new Schema<IStatsSubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    kills: { type: Number, default: 0 },
    deaths: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const StatsSubmissionModel =
  (mongoose.models.StatsSubmission as Model<IStatsSubmission>) ||
  mongoose.model<IStatsSubmission>('StatsSubmission', StatsSubmissionSchema);

export default StatsSubmissionModel;
