import { Schema, model, type Document, type Types, type Model } from "mongoose";

export type NotificationType = "success" | "info" | "warning" | "error";
export type NotificationCategory = "achievement" | "assignment" | "quiz" | "lesson" | "class" | "system" | "announcement" | "social" | "streak" | "leaderboard" | "teacher" | "student";
export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface NotificationDocument extends Document {
  recipient: Types.ObjectId; // User ID
  recipientRole: "student" | "teacher" | "school_owner";
  sender?: Types.ObjectId; // Optional sender user ID
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string;
  read: boolean;
  readAt?: Date;
  actionUrl?: string; // Optional URL for action button
  metadata?: Record<string, any>; // Additional data (student ID, quiz ID, etc.)
  expiresAt?: Date; // Optional expiration date
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    recipient: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      index: true 
    },
    recipientRole: { 
      type: String, 
      enum: ["student", "teacher", "school_owner"], 
      required: true,
      index: true
    },
    sender: { 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    },
    type: { 
      type: String, 
      enum: ["success", "info", "warning", "error"], 
      required: true,
      default: "info"
    },
    category: { 
      type: String, 
      enum: ["achievement", "assignment", "quiz", "lesson", "class", "system", "announcement", "social", "streak", "leaderboard", "teacher", "student"], 
      required: true,
      index: true
    },
    priority: { 
      type: String, 
      enum: ["low", "medium", "high", "urgent"], 
      default: "medium"
    },
    title: { 
      type: String, 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    read: { 
      type: Boolean, 
      default: false,
      index: true
    },
    readAt: { 
      type: Date 
    },
    actionUrl: { 
      type: String 
    },
    metadata: { 
      type: Schema.Types.Mixed 
    },
    expiresAt: { 
      type: Date,
      index: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound index for efficient queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, category: 1, createdAt: -1 });
notificationSchema.index({ recipientRole: 1, createdAt: -1 });

// TTL index to auto-delete expired notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static methods
notificationSchema.statics.createBulkNotifications = async function(notifications: Partial<NotificationDocument>[]) {
  return this.insertMany(notifications);
};

notificationSchema.statics.getUnreadCount = async function(userId: Types.ObjectId) {
  return this.countDocuments({ recipient: userId, read: false });
};

notificationSchema.statics.markAsRead = async function(notificationId: string) {
  return this.findByIdAndUpdate(
    notificationId,
    { read: true, readAt: new Date() },
    { new: true }
  );
};

notificationSchema.statics.markAllAsRead = async function(userId: Types.ObjectId) {
  return this.updateMany(
    { recipient: userId, read: false },
    { read: true, readAt: new Date() }
  );
};

notificationSchema.statics.deleteOldNotifications = async function(daysOld: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.deleteMany({
    createdAt: { $lt: cutoffDate },
    read: true
  });
};

// Instance methods
notificationSchema.methods.markRead = async function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Interface for static methods
interface NotificationModel extends Model<NotificationDocument> {
  createBulkNotifications(notifications: Partial<NotificationDocument>[]): Promise<any>;
  getUnreadCount(userId: Types.ObjectId): Promise<number>;
  markAsRead(notificationId: string): Promise<any>;
  markAllAsRead(userId: Types.ObjectId): Promise<any>;
  deleteOldNotifications(daysOld?: number): Promise<any>;
}

export const NotificationModel = model<NotificationDocument, NotificationModel>("Notification", notificationSchema);

export default NotificationModel;
