import { Schema, model, type Document } from "mongoose";

export interface AchievementDocument extends Document {
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  gemsReward: number;
  conditionType: string;
  conditionValue: number;
  createdAt: Date;
  updatedAt: Date;
}

const achievementSchema = new Schema<AchievementDocument>(
  {
    achievementId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    category: { type: String, required: true },
    xpReward: { type: Number, required: true, default: 0 },
    gemsReward: { type: Number, required: true, default: 0 },
    conditionType: { type: String, required: true }, // e.g., "quiz_count", "streak", "perfect_score"
    conditionValue: { type: Number, required: true }, // e.g., 1, 7, 100
  },
  { timestamps: true }
);

export const AchievementModel = model<AchievementDocument>("Achievement", achievementSchema);

export default AchievementModel;
