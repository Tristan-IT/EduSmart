import { Schema, model, type Document, type Types } from "mongoose";
import type { UserDocument } from "./User.js";

interface TeacherClassSummary {
  className: string;
  studentCount: number;
  masteryAverage: number;
  riskCount: number;
}

export interface TeacherProfileDocument extends Document {
  user: Types.ObjectId | UserDocument;
  schoolName?: string;
  subjects: string[];
  classSummaries: TeacherClassSummary[];
  createdAt: Date;
  updatedAt: Date;
}

const teacherProfileSchema = new Schema<TeacherProfileDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    schoolName: { type: String },
    subjects: { type: [String], default: [] },
    classSummaries: {
      type: [
        {
          className: { type: String, required: true },
          studentCount: { type: Number, required: true },
          masteryAverage: { type: Number, required: true },
          riskCount: { type: Number, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const TeacherProfileModel = model<TeacherProfileDocument>("TeacherProfile", teacherProfileSchema);

export default TeacherProfileModel;
