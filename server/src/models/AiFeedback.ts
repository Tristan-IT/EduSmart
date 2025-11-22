import { Schema, model, Document } from "mongoose";

export interface IAiFeedback extends Document {
  sessionId: string;
  userId: Schema.Types.ObjectId;
  schoolId: Schema.Types.ObjectId;
  feedbackType: "rating" | "flag" | "correction" | "suggestion";
  rating?: "positive" | "negative";
  flagReason?: string;
  originalResponse?: string;
  correctedResponse?: string;
  userComment?: string;
  metadata: {
    messageIndex?: number;
    endpoint?: string;
    modelVersion?: string;
  };
  status: "pending" | "reviewed" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const aiFeedbackSchema = new Schema<IAiFeedback>(
  {
    sessionId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    feedbackType: {
      type: String,
      enum: ["rating", "flag", "correction", "suggestion"],
      required: true,
    },
    rating: { type: String, enum: ["positive", "negative"] },
    flagReason: String,
    originalResponse: String,
    correctedResponse: String,
    userComment: String,
    metadata: {
      messageIndex: Number,
      endpoint: String,
      modelVersion: String,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

aiFeedbackSchema.index({ schoolId: 1, status: 1, createdAt: -1 });
aiFeedbackSchema.index({ sessionId: 1 });

export const AiFeedbackModel = model<IAiFeedback>("AiFeedback", aiFeedbackSchema);
