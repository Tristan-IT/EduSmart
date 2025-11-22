import { Schema, model, type Document, type Types } from "mongoose";
import type { UserDocument } from "./User.js";

export type ProgressStatus = "locked" | "current" | "in-progress" | "completed";

export interface UserProgressDocument extends Document {
  user: Types.ObjectId | UserDocument;
  nodeId: string;
  status: ProgressStatus;
  stars: number;
  completedAt?: Date;
  attempts: number;
  bestScore: number;
  lessonViewed?: boolean;
  lessonViewedAt?: Date;
  lessonTimeSpent?: number; // minutes
  createdAt: Date;
  updatedAt: Date;
}

const userProgressSchema = new Schema<UserProgressDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    nodeId: { type: String, required: true, index: true },
    status: { 
      type: String, 
      enum: ["locked", "current", "in-progress", "completed"], 
      required: true,
      default: "locked"
    },
    stars: { type: Number, default: 0, min: 0, max: 3 },
    completedAt: { type: Date },
    attempts: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    lessonViewed: { type: Boolean, default: false },
    lessonViewedAt: { type: Date },
    lessonTimeSpent: { type: Number, default: 0 }, // minutes
  },
  { timestamps: true }
);

// Compound index untuk prevent duplicate user-node pairs
userProgressSchema.index({ user: 1, nodeId: 1 }, { unique: true });

export const UserProgressModel = model<UserProgressDocument>("UserProgress", userProgressSchema);

export default UserProgressModel;
