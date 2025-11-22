import { Schema, model, type Document, type Types } from "mongoose";
import type { UserDocument } from "./User.js";

interface Boost {
  id: string;
  label: string;
  remaining: number;
  type: "xp" | "streak" | "shield";
}

interface DailyPlanItem {
  time: string;
  activity: string;
  duration: string;
  topicId: string;
  status: "completed" | "in-progress" | "pending";
}

interface AiRecommendation {
  id: string;
  title: string;
  type: "lesson" | "quiz" | "video" | "challenge";
  topicId: string;
  estimatedMinutes: number;
  priority: "high" | "medium" | "low";
  reason: string;
  masteryDelta?: number;
  xpReward?: number;
  ctaLabel?: string;
  ctaHref?: string;
}

interface AiRewardQuest {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly";
  xpReward: number;
  powerUpReward?: string;
  aiRationale: string;
  expiresAt: Date;
}

interface LessonChallenge {
  id: string;
  title: string;
  description: string;
  type: "practice" | "challenge" | "story" | "review";
  xpReward: number;
  streakReward?: number;
  durationMinutes: number;
  status: "locked" | "available" | "in-progress" | "completed" | "mastered";
  skillId: string;
  topicId: string;
  prerequisites?: string[];
  completedAt?: Date;
  attempts?: number;
}

interface SkillNode {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "locked" | "current" | "completed";
  mastery: number;
  unitId: string;
  unlocked: boolean;
  pathIndex: number;
  lessons: LessonChallenge[];
}

interface SkillTreeUnit {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "upcoming" | "current" | "completed";
  reward?: {
    type: "chest" | "badge";
    xp: number;
    label: string;
  };
  rewardClaimed?: boolean;
  skills: SkillNode[];
}

export interface StudentProfileDocument extends Document {
  user: Types.ObjectId | UserDocument;
  masteryPerTopic: Record<string, number>;
  xp: number;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  streak: number;
  bestStreak: number;
  dailyGoalXP: number;
  dailyGoalProgress: number;
  dailyGoalMet: boolean;
  dailyGoalClaimed: boolean;
  league: "bronze" | "silver" | "gold" | "sapphire";
  riskLevel: "low" | "medium" | "high";
  boosts: Boost[];
  lastLessonId?: string;
  lastCompletedAt?: Date;
  dailyPlan: DailyPlanItem[];
  aiRecommendations: AiRecommendation[];
  aiRewardQuests: AiRewardQuest[];
  skillTree: SkillTreeUnit[];
  createdAt: Date;
  updatedAt: Date;
}

const studentProfileSchema = new Schema<StudentProfileDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    masteryPerTopic: { type: Schema.Types.Mixed, default: {} },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xpInLevel: { type: Number, default: 0 },
    xpForNextLevel: { type: Number, default: 100 },
    streak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    dailyGoalXP: { type: Number, default: 30 },
    dailyGoalProgress: { type: Number, default: 0 },
    dailyGoalMet: { type: Boolean, default: false },
    dailyGoalClaimed: { type: Boolean, default: false },
    league: { type: String, enum: ["bronze", "silver", "gold", "sapphire"], default: "bronze" },
  riskLevel: { type: String, enum: ["low", "medium", "high"], default: "low" },
    boosts: {
      type: [
        {
          id: { type: String, required: true },
          label: { type: String, required: true },
          remaining: { type: Number, required: true },
          type: { type: String, enum: ["xp", "streak", "shield"], required: true },
        },
      ],
      default: [],
    },
    lastLessonId: { type: String },
    lastCompletedAt: { type: Date },
    dailyPlan: {
      type: [
        {
          time: { type: String, required: true },
          activity: { type: String, required: true },
          duration: { type: String, required: true },
          topicId: { type: String, required: true },
          status: { type: String, enum: ["completed", "in-progress", "pending"], required: true },
        },
      ],
      default: [],
    },
    aiRecommendations: {
      type: [
        {
          id: { type: String, required: true },
          title: { type: String, required: true },
          type: { type: String, enum: ["lesson", "quiz", "video", "challenge"], required: true },
          topicId: { type: String, required: true },
          estimatedMinutes: { type: Number, required: true },
          priority: { type: String, enum: ["high", "medium", "low"], required: true },
          reason: { type: String, required: true },
          masteryDelta: { type: Number },
          xpReward: { type: Number },
          ctaLabel: { type: String },
          ctaHref: { type: String },
        },
      ],
      default: [],
    },
    aiRewardQuests: {
      type: [
        {
          id: { type: String, required: true },
          title: { type: String, required: true },
          description: { type: String, required: true },
          type: { type: String, enum: ["daily", "weekly"], required: true },
          xpReward: { type: Number, required: true },
          powerUpReward: { type: String },
          aiRationale: { type: String, required: true },
          expiresAt: { type: Date, required: true },
        },
      ],
      default: [],
    },
    skillTree: {
      type: [
        {
          id: { type: String, required: true },
          title: { type: String, required: true },
          description: { type: String, required: true },
          icon: { type: String, required: true },
          status: { type: String, enum: ["upcoming", "current", "completed"], required: true },
          reward: {
            type: {
              type: { type: String, enum: ["chest", "badge"] },
              xp: { type: Number },
              label: { type: String },
            },
          },
          rewardClaimed: { type: Boolean },
          skills: {
            type: [
              {
                id: { type: String, required: true },
                title: { type: String, required: true },
                description: { type: String, required: true },
                icon: { type: String, required: true },
                status: { type: String, enum: ["locked", "current", "completed"], required: true },
                mastery: { type: Number, required: true },
                unitId: { type: String, required: true },
                unlocked: { type: Boolean, required: true },
                pathIndex: { type: Number, required: true },
                lessons: {
                  type: [
                    {
                      id: { type: String, required: true },
                      title: { type: String, required: true },
                      description: { type: String, required: true },
                      type: { type: String, enum: ["practice", "challenge", "story", "review"], required: true },
                      xpReward: { type: Number, required: true },
                      streakReward: { type: Number },
                      durationMinutes: { type: Number, required: true },
                      status: {
                        type: String,
                        enum: ["locked", "available", "in-progress", "completed", "mastered"],
                        required: true,
                      },
                      skillId: { type: String, required: true },
                      topicId: { type: String, required: true },
                      prerequisites: { type: [String] },
                      completedAt: { type: Date },
                      attempts: { type: Number },
                    },
                  ],
                  default: [],
                },
              },
            ],
            default: [],
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const StudentProfileModel = model<StudentProfileDocument>("StudentProfile", studentProfileSchema);

export default StudentProfileModel;
