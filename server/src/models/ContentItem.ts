import { Schema, model, type Document } from "mongoose";
import type mongoose from "mongoose";

export interface ContentItemDocument extends Document {
  topic: string;
  subject: mongoose.Types.ObjectId;
  type: "video" | "pdf" | "quiz" | "slide";
  difficulty: "beginner" | "intermediate" | "advanced";
  title: string;
  durationMinutes: number;
  author: string;
  tags: string[];
  updatedAt: Date;
  createdAt: Date;
}

const contentItemSchema = new Schema<ContentItemDocument>(
  {
    topic: { type: String, required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true, index: true },
    type: { type: String, enum: ["video", "pdf", "quiz", "slide"], required: true },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
    title: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    author: { type: String, required: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const ContentItemModel = model<ContentItemDocument>("ContentItem", contentItemSchema);

export default ContentItemModel;
