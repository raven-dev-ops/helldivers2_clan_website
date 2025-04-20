// src/models/Notification.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId; // User to notify
  type: 'reply' | 'mention' | 'moderation' | 'system'; // Type of notification
  message: string; // Short message
  link?: string; // Link to relevant content (e.g., post)
  relatedContentId?: mongoose.Types.ObjectId; // ID of thread/post/user
  isRead: boolean;
  createdAt?: Date;
}
const NotificationSchema = new Schema<INotification>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    relatedContentId: { type: Schema.Types.ObjectId },
    isRead: { type: Boolean, default: false, index: true },
}, { timestamps: true });

const NotificationModel = mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
export default NotificationModel;