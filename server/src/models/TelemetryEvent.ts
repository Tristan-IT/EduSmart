import { Schema, model, type Document } from "mongoose";

export type TelemetryEventType =
  | "lesson_completed"
  | "lesson_unlocked"
  | "skill_unlocked"
  | "unit_progressed"
  | "reward_claimed"
  | "daily_goal_claimed";

export interface TelemetryEventDocument extends Document {
  type: TelemetryEventType;
  studentId: string;
  studentName: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const telemetryEventSchema = new Schema<TelemetryEventDocument>(
  {
    type: { type: String, enum: [
      "lesson_completed",
      "lesson_unlocked",
      "skill_unlocked",
      "unit_progressed",
      "reward_claimed",
      "daily_goal_claimed",
    ], required: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    timestamp: { type: Date, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const TelemetryEventModel = model<TelemetryEventDocument>("TelemetryEvent", telemetryEventSchema);

export default TelemetryEventModel;
