import { Schema, model, Document } from "mongoose";

export interface IParentSummaryCache extends Document {
  userId: Schema.Types.ObjectId;
  schoolId: Schema.Types.ObjectId;
  periodStart: Date;
  periodEnd: Date;
  summary: {
    narrative: string;
    highlights: string[];
    concerns: string[];
    recommendations: string[];
  };
  metrics: {
    completedLessons: number;
    averageScore: number;
    streak: number;
    xpGained: number;
    timeSpentMinutes: number;
  };
  generatedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const parentSummaryCacheSchema = new Schema<IParentSummaryCache>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    summary: {
      narrative: { type: String, required: true },
      highlights: [String],
      concerns: [String],
      recommendations: [String],
    },
    metrics: {
      completedLessons: Number,
      averageScore: Number,
      streak: Number,
      xpGained: Number,
      timeSpentMinutes: Number,
    },
    generatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

parentSummaryCacheSchema.index({ userId: 1, periodEnd: -1 });
parentSummaryCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ParentSummaryCacheModel = model<IParentSummaryCache>(
  "ParentSummaryCache",
  parentSummaryCacheSchema
);
