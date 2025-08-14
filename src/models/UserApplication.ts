// src/models/UserApplication.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "./User";

export interface IUserApplication extends Document {
  userId: Types.ObjectId | IUser;
  type: string;
  interviewAvailability?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserApplicationSchema = new Schema<IUserApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    interviewAvailability: { type: Date },
  },
  { timestamps: true, collection: 'User_Applications' }
);

const UserApplicationModel =
  (mongoose.models.UserApplication as Model<IUserApplication>) ||
  mongoose.model<IUserApplication>('UserApplication', UserApplicationSchema);

export default UserApplicationModel;
