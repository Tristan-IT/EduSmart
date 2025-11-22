import { Schema, model, type Document } from "mongoose";
import type mongoose from "mongoose";

export type QuizQuestionType = "mcq" | "multi-select" | "short-answer";

export interface QuizQuestionDocument extends Document {
  topicId: string; // Legacy string-based topic ID
  topic?: mongoose.Types.ObjectId; // New Topic model reference
  subject: mongoose.Types.ObjectId;
  school?: mongoose.Types.ObjectId; // null for templates, schoolId for custom
  question: string;
  type: QuizQuestionType;
  options?: string[];
  correctAnswer: string | string[];
  difficulty: number;
  hintCount: number;
  hints: string[];
  explanation: string;
  
  // Template & customization fields
  isTemplate?: boolean; // true for platform templates
  createdBy?: mongoose.Types.ObjectId; // Teacher who created
  clonedFrom?: mongoose.Types.ObjectId; // Original template if cloned
  status?: "draft" | "published" | "archived";
  tags?: string[];
  imageUrl?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const quizQuestionSchema = new Schema<QuizQuestionDocument>(
  {
    topicId: { type: String, required: true },
    topic: { type: Schema.Types.ObjectId, ref: "Topic", index: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
    school: { type: Schema.Types.ObjectId, ref: "School", index: true },
    question: { type: String, required: true },
    type: { type: String, enum: ["mcq", "multi-select", "short-answer"], required: true },
    options: { type: [String] },
    correctAnswer: { type: Schema.Types.Mixed, required: true },
    difficulty: { type: Number, default: 1 },
    hintCount: { type: Number, default: 0 },
    hints: { type: [String], default: [] },
    explanation: { type: String, required: true },
    
    // Template & customization fields
    isTemplate: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    clonedFrom: { type: Schema.Types.ObjectId, ref: "QuizQuestion" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "published" },
    tags: { type: [String], default: [] },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export const QuizQuestionModel = model<QuizQuestionDocument>("QuizQuestion", quizQuestionSchema);

export default QuizQuestionModel;
