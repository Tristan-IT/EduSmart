import mongoose, { Document, Schema, Types } from "mongoose";

/**
 * ContentTemplate Model
 * Stores template content (quizzes and lessons) that teachers can clone and customize
 * Supports both default platform templates and school-specific customizations
 */

export interface IContentTemplate extends Document {
  _id: Types.ObjectId;
  subject: Types.ObjectId;
  topic: Types.ObjectId;
  school?: Types.ObjectId; // null for platform templates
  contentType: "quiz" | "lesson" | "assignment" | "exercise";
  templateCode: string; // Unique identifier for templates
  title: string;
  description?: string;
  content: any; // Flexible JSON structure based on contentType
  difficulty: "mudah" | "sedang" | "sulit";
  tags: string[];
  estimatedTime?: number; // in minutes
  xpReward?: number;
  gemsReward?: number;
  
  // Template vs Custom
  isDefault: boolean; // true for platform templates, false for customizations
  clonedFrom?: Types.ObjectId; // Reference to original template if this is a clone
  
  // Ownership & Permissions
  createdBy?: Types.ObjectId; // Teacher who created (null for platform templates)
  lastEditedBy?: Types.ObjectId;
  
  // Publishing & Status
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  
  // Usage Analytics
  usageCount: number; // How many times used by students
  averageScore?: number;
  averageCompletionTime?: number;
  
  // Metadata
  metadata: {
    version?: number;
    gradeLevel?: string[];
    language?: string;
    imageUrl?: string;
    videoUrl?: string;
    attachments?: Array<{
      name: string;
      url: string;
      type: string;
    }>;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const ContentTemplateSchema = new Schema<IContentTemplate>(
  {
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      index: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: "School",
      default: null,
      index: true,
    },
    contentType: {
      type: String,
      enum: ["quiz", "lesson", "assignment", "exercise"],
      required: true,
      index: true,
    },
    templateCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["mudah", "sedang", "sulit"],
      required: true,
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    estimatedTime: {
      type: Number,
      default: 10,
    },
    xpReward: {
      type: Number,
      default: 50,
    },
    gemsReward: {
      type: Number,
      default: 5,
    },
    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
    clonedFrom: {
      type: Schema.Types.ObjectId,
      ref: "ContentTemplate",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
    },
    averageCompletionTime: {
      type: Number,
    },
    metadata: {
      version: {
        type: Number,
        default: 1,
      },
      gradeLevel: [String],
      language: {
        type: String,
        default: "id",
      },
      imageUrl: String,
      videoUrl: String,
      attachments: [
        {
          name: String,
          url: String,
          type: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
ContentTemplateSchema.index({ subject: 1, topic: 1, contentType: 1 });
ContentTemplateSchema.index({ school: 1, subject: 1, status: 1 });
ContentTemplateSchema.index({ isDefault: 1, contentType: 1, difficulty: 1 });
ContentTemplateSchema.index({ templateCode: 1, school: 1 }, { unique: true, sparse: true });
ContentTemplateSchema.index({ createdBy: 1, contentType: 1, status: 1 });

// Pre-save middleware to set publishedAt
ContentTemplateSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Method to clone template
ContentTemplateSchema.methods.clone = function (
  teacherId: Types.ObjectId,
  schoolId: Types.ObjectId
) {
  const clone = new ContentTemplateModel({
    ...this.toObject(),
    _id: new Types.ObjectId(),
    school: schoolId,
    isDefault: false,
    clonedFrom: this._id,
    createdBy: teacherId,
    lastEditedBy: teacherId,
    status: "draft",
    publishedAt: undefined,
    usageCount: 0,
    averageScore: undefined,
    averageCompletionTime: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return clone;
};

const ContentTemplateModel = mongoose.model<IContentTemplate>(
  "ContentTemplate",
  ContentTemplateSchema
);

export default ContentTemplateModel;
