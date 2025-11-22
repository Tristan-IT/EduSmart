import { Schema, model, Document } from "mongoose";

export interface IAiMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    toolCalls?: Array<{
      name: string;
      arguments: Record<string, any>;
      result?: any;
    }>;
    tokensUsed?: number;
    latencyMs?: number;
  };
}

export interface IAiSession extends Document {
  sessionId: string;
  userId: Schema.Types.ObjectId;
  schoolId: Schema.Types.ObjectId;
  sessionType: "mentor" | "teacher_insight" | "parent_summary" | "content_copilot" | "quiz_feedback";
  messages: IAiMessage[];
  context: {
    studentProgress?: Record<string, any>;
    classData?: Record<string, any>;
    focusTopic?: string;
    metadata?: Record<string, any>;
  };
  feedback?: {
    rating?: "positive" | "negative";
    comment?: string;
    timestamp?: Date;
  };
  status: "active" | "completed" | "archived";
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

const aiMessageSchema = new Schema<IAiMessage>({
  role: { type: String, enum: ["user", "assistant", "system"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: {
    toolCalls: [
      {
        name: String,
        arguments: Schema.Types.Mixed,
        result: Schema.Types.Mixed,
      },
    ],
    tokensUsed: Number,
    latencyMs: Number,
  },
});

const aiSessionSchema = new Schema<IAiSession>(
  {
    sessionId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    sessionType: {
      type: String,
      enum: ["mentor", "teacher_insight", "parent_summary", "content_copilot", "quiz_feedback"],
      required: true,
    },
    messages: [aiMessageSchema],
    context: {
      studentProgress: Schema.Types.Mixed,
      classData: Schema.Types.Mixed,
      focusTopic: String,
      metadata: Schema.Types.Mixed,
    },
    feedback: {
      rating: { type: String, enum: ["positive", "negative"] },
      comment: String,
      timestamp: Date,
    },
    status: { type: String, enum: ["active", "completed", "archived"], default: "active" },
    lastActivityAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

aiSessionSchema.index({ userId: 1, sessionType: 1, createdAt: -1 });
aiSessionSchema.index({ schoolId: 1, createdAt: -1 });
aiSessionSchema.index({ sessionId: 1 });

export const AiSessionModel = model<IAiSession>("AiSession", aiSessionSchema);
