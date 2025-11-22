import mongoose, { Schema, model, type Document, Types } from "mongoose";

/**
 * Topic Model - Enhanced for Content Management
 * Represents a learning topic within a subject (e.g., Aljabar in Matematika)
 * Organizes lessons and quizzes into coherent learning units
 */

export interface TopicDocument extends Document {
  _id: Types.ObjectId;
  subject: Types.ObjectId; // Reference to Subject
  school?: Types.ObjectId; // null for template, schoolId for custom
  topicCode: string; // e.g., "ALG-01", "GEOM-02"
  title: string; // e.g., "Aljabar", "Persamaan Linear"
  description: string;
  slug: string;
  order: number; // Display order within subject
  estimatedMinutes: number; // Expected time to complete (renamed from estimatedHours for consistency)
  progressPercent: number; // For backward compatibility
  prerequisites: Types.ObjectId[]; // Other topics that should be completed first
  dependencies: string[]; // For backward compatibility
  learningObjectives: string[]; // What students will learn
  icon?: string; // Lucide icon name
  color?: string; // Color for UI
  difficulty: "beginner" | "intermediate" | "advanced";
  isActive: boolean;
  isTemplate: boolean; // true for default templates, false for school customizations
  metadata: {
    gradeLevel?: string[]; // e.g., ["10", "11", "12"] for SMA
    tags?: string[];
    createdBy?: Types.ObjectId; // Teacher who created (for custom topics)
    totalLessons?: number;
    totalQuizzes?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const topicSchema = new Schema<TopicDocument>(
  {
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: "School",
      default: null,
      index: true,
    },
    topicCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    title: { 
      type: String, 
      required: true,
      trim: true,
    },
    description: { 
      type: String, 
      required: true 
    },
    slug: { 
      type: String, 
      required: true,
      index: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    estimatedMinutes: { 
      type: Number, 
      required: true,
      default: 120, // 2 hours default
    },
    progressPercent: { 
      type: Number, 
      default: 0 
    },
    prerequisites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
    dependencies: { 
      type: [String], 
      default: [] 
    },
    learningObjectives: [
      {
        type: String,
      },
    ],
    icon: {
      type: String,
      default: "BookOpen",
    },
    color: {
      type: String,
      default: "#3B82F6",
    },
    difficulty: { 
      type: String, 
      enum: ["beginner", "intermediate", "advanced"], 
      required: true 
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isTemplate: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      gradeLevel: [String],
      tags: [String],
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      totalLessons: Number,
      totalQuizzes: Number,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
topicSchema.index({ subject: 1, school: 1, order: 1 });
topicSchema.index({ subject: 1, isTemplate: 1 });
topicSchema.index({ topicCode: 1, subject: 1 });
topicSchema.index({ slug: 1, subject: 1 }, { unique: true });

// Virtual for lessons count
topicSchema.virtual("lessonsCount", {
  ref: "SkillTreeNode",
  localField: "_id",
  foreignField: "topic",
  count: true,
});

// Virtual for quizzes count
topicSchema.virtual("quizzesCount", {
  ref: "Quiz",
  localField: "_id",
  foreignField: "topic",
  count: true,
});

export const TopicModel = model<TopicDocument>("Topic", topicSchema);

export default TopicModel;
