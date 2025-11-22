import { Schema, model, type Document, type Types } from "mongoose";
import type { UserDocument } from "./User.js";

export type MentorRole = "student" | "assistant";

export interface MentorMessage {
  id: string;
  role: MentorRole;
  content: string;
  topicId?: string;
  timestamp: Date;
}

export interface MentorSessionDocument extends Document {
  student: Types.ObjectId | UserDocument;
  messages: MentorMessage[];
  summary: string;
  updatedAt: Date;
  createdAt: Date;
}

const mentorMessageSchema = new Schema<MentorMessage>(
  {
    id: { type: String, required: true },
    role: { type: String, enum: ["student", "assistant"], required: true },
    content: { type: String, required: true },
    topicId: { type: String },
    timestamp: { type: Date, required: true },
  },
  { _id: false }
);

const mentorSessionSchema = new Schema<MentorSessionDocument>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    messages: { type: [mentorMessageSchema], default: [] },
    summary: { type: String, required: true },
  },
  { timestamps: true }
);

export const MentorSessionModel = model<MentorSessionDocument>("MentorSession", mentorSessionSchema);

export default MentorSessionModel;
