import { Schema, model, type Document, Types } from "mongoose";

export type NodeStatus = "locked" | "current" | "in-progress" | "completed";

interface Position {
  x: number;
  y: number;
}

interface LessonContent {
  type: "text" | "video" | "interactive" | "mixed";
  textContent?: string; // Markdown/HTML content
  videoUrl?: string; // YouTube, Vimeo, or uploaded video
  videoDuration?: number; // in minutes
  attachments?: Array<{
    type: "pdf" | "image" | "document";
    url: string;
    name: string;
    size?: number;
  }>;
  interactiveElements?: Array<{
    type: "simulation" | "animation" | "tool";
    url: string;
    description: string;
  }>;
  learningObjectives?: string[]; // What students will learn
  keyPoints?: string[]; // Summary points
  examples?: Array<{
    title: string;
    description: string;
    code?: string; // For programming examples
  }>;
  estimatedMinutes: number; // Time to complete lesson
}

export interface SkillTreeNodeDocument extends Document {
  nodeId: string;
  moduleId: string;
  title: string;
  categoryId: string;
  categoryName: string;
  description: string;
  position: Position;
  xpReward: number;
  gemsReward?: number; // Direct gems reward (for backward compatibility)
  prerequisites: string[];
  isCheckpoint: boolean;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  estimatedDuration: string;
  order?: number; // Display order in skill tree
  minimumLevel?: number; // Minimum user level required
  requiresLessonView?: boolean; // Must view lesson before quiz
  
  // Enhanced fields for class-level support
  gradeLevel?: "SD" | "SMP" | "SMA" | "SMK";
  classNumber?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  semester?: 1 | 2;
  curriculum?: "Kurikulum Merdeka" | "K13";
  kompetensiDasar?: string; // KD code reference
  
  // Enhanced rewards
  rewards?: {
    xp: number;
    gems: number;
    hearts?: number;
    badge?: string;
    certificate?: string; // For checkpoint nodes
  };
  
  // Content organization
  subject?: Types.ObjectId; // Reference to Subject
  topic?: Types.ObjectId; // Reference to Topic
  school?: Types.ObjectId; // null for templates, schoolId for custom
  isTemplate?: boolean; // true for platform templates
  createdBy?: Types.ObjectId; // Teacher who created custom content
  content?: any; // Rich content (markdown, video URLs, attachments) - DEPRECATED
  lessonContent?: LessonContent; // Structured lesson content
  hasLesson?: boolean; // Flag to check if lesson is available
  status?: "draft" | "published" | "archived";
  version?: string; // For curriculum updates
  
  createdAt: Date;
  updatedAt: Date;
}

const positionSchema = new Schema<Position>(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  { _id: false }
);

const lessonContentSchema = new Schema<LessonContent>(
  {
    type: { type: String, enum: ["text", "video", "interactive", "mixed"], required: true },
    textContent: { type: String },
    videoUrl: { type: String },
    videoDuration: { type: Number },
    attachments: [{
      type: { type: String, enum: ["pdf", "image", "document"] },
      url: { type: String },
      name: { type: String },
      size: { type: Number }
    }],
    interactiveElements: [{
      type: { type: String, enum: ["simulation", "animation", "tool"] },
      url: { type: String },
      description: { type: String }
    }],
    learningObjectives: { type: [String], default: [] },
    keyPoints: { type: [String], default: [] },
    examples: [{
      title: { type: String },
      description: { type: String },
      code: { type: String }
    }],
    estimatedMinutes: { type: Number, required: true }
  },
  { _id: false }
);

const skillTreeNodeSchema = new Schema<SkillTreeNodeDocument>(
  {
    nodeId: { type: String, required: true, unique: true, index: true },
    moduleId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    description: { type: String, required: true },
    position: { type: positionSchema, required: true },
    xpReward: { type: Number, required: true, default: 50 },
    gemsReward: { type: Number, default: 5 }, // Direct gems reward
    prerequisites: { type: [String], default: [] },
    isCheckpoint: { type: Boolean, default: false },
    difficulty: { type: String, enum: ["Mudah", "Sedang", "Sulit"], required: true },
    estimatedDuration: { type: String, required: true },
    order: { type: Number, default: 0 }, // Display order
    minimumLevel: { type: Number, default: 1 }, // Minimum level required
    requiresLessonView: { type: Boolean, default: false }, // Must view lesson first
    
    // Enhanced fields for class-level support
    gradeLevel: { type: String, enum: ["SD", "SMP", "SMA", "SMK"], index: true },
    classNumber: { type: Number, min: 1, max: 12, index: true },
    semester: { type: Number, enum: [1, 2], index: true },
    curriculum: { type: String, enum: ["Kurikulum Merdeka", "K13"] },
    kompetensiDasar: { type: String },
    
    topicCode: { type: String },
    name: { type: String },
    icon: { type: String, default: "📘" },
    color: { type: String, default: "#3B82F6" },
    level: { type: Number, default: 1 },
    xpRequired: { type: Number, default: 0 },
    quizCount: { type: Number, default: 10 },
    estimatedMinutes: { type: Number, default: 60 },

    // Enhanced rewards structure
    rewards: {
      type: {
        xp: { type: Number, required: true },
        gems: { type: Number, required: true },
        hearts: { type: Number },
        badge: { type: String },
        certificate: { type: String }
      },
      _id: false
    },
    
    // Content organization
    subject: { type: Schema.Types.ObjectId, ref: "Subject", index: true },
    topic: { type: Schema.Types.ObjectId, ref: "Topic", index: true },
    school: { type: Schema.Types.ObjectId, ref: "School", index: true },
    isTemplate: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: Schema.Types.Mixed }, // Deprecated - use lessonContent
    metadata: { type: Schema.Types.Mixed },
    lessonContent: { type: lessonContentSchema },
    hasLesson: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published", "archived"], default: "published" },
    version: { type: String, default: "1.0" },
  },
  { timestamps: true }
);

export const SkillTreeNodeModel = model<SkillTreeNodeDocument>("SkillTreeNode", skillTreeNodeSchema);

export default SkillTreeNodeModel;
