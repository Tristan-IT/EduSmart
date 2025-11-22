import { Schema, model, type Document, type Types } from "mongoose";
import type { UserDocument } from "./User.js";
import type { AchievementDocument } from "./Achievement.js";

export interface UserAchievementDocument extends Document {
  user: Types.ObjectId | UserDocument;
  achievement: Types.ObjectId | AchievementDocument;
  progress: number;
  total: number;
  unlocked: boolean;
  unlockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userAchievementSchema = new Schema<UserAchievementDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    achievement: { type: Schema.Types.ObjectId, ref: "Achievement", required: true },
    progress: { type: Number, default: 0 },
    total: { type: Number, required: true },
    unlocked: { type: Boolean, default: false },
    unlockedAt: { type: Date },
  },
  { timestamps: true }
);

// Compound index untuk prevent duplicate user-achievement pairs
userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

export const UserAchievementModel = model<UserAchievementDocument>("UserAchievement", userAchievementSchema);

export default UserAchievementModel;
