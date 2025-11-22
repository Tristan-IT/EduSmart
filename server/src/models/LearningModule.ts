import { Schema, model, type Document } from "mongoose";
import type mongoose from "mongoose";

interface TheorySection {
  title: string;
  content: string;
  examples?: string[];
  keyPoints?: string[];
}

interface VideoInfo {
  title: string;
  youtubeUrl: string;
  duration: string;
  description: string;
  channel: string;
}

interface Exercise {
  id: string;
  question: string;
  type: "mcq" | "short-answer" | "multiple-choice";
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: number;
}

export interface LearningModuleDocument extends Document {
  moduleId: string;
  categoryId: string;
  categoryName: string;
  subject: mongoose.Types.ObjectId;
  title: string;
  description: string;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  estimatedDuration: string;
  prerequisites: string[];
  learningObjectives: string[];
  theory: {
    sections: TheorySection[];
  };
  video: VideoInfo;
  exercises: Exercise[];
  createdAt: Date;
  updatedAt: Date;
}

const theorySectionSchema = new Schema<TheorySection>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    examples: { type: [String], default: [] },
    keyPoints: { type: [String], default: [] },
  },
  { _id: false }
);

const videoInfoSchema = new Schema<VideoInfo>(
  {
    title: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    channel: { type: String, required: true },
  },
  { _id: false }
);

const exerciseSchema = new Schema<Exercise>(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    type: { type: String, enum: ["mcq", "short-answer", "multiple-choice"], required: true },
    options: { type: [String] },
    correctAnswer: { type: Schema.Types.Mixed, required: true },
    explanation: { type: String, required: true },
    difficulty: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

const learningModuleSchema = new Schema<LearningModuleDocument>(
  {
    moduleId: { type: String, required: true, unique: true, index: true },
    categoryId: { type: String, required: true, index: true },
    categoryName: { type: String, required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["Mudah", "Sedang", "Sulit"], required: true },
    estimatedDuration: { type: String, required: true },
    prerequisites: { type: [String], default: [] },
    learningObjectives: { type: [String], default: [] },
    theory: {
      sections: { type: [theorySectionSchema], default: [] },
    },
    video: { type: videoInfoSchema, required: true },
    exercises: { type: [exerciseSchema], default: [] },
  },
  { timestamps: true }
);

export const LearningModuleModel = model<LearningModuleDocument>("LearningModule", learningModuleSchema);

export default LearningModuleModel;
