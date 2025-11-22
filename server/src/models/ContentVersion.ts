import mongoose, { Document, Schema, Types } from "mongoose";

/**
 * ContentVersion Model
 * Tracks all versions of content templates for rollback capability
 */

export interface IContentVersion extends Document {
  _id: Types.ObjectId;
  contentTemplate: Types.ObjectId;
  version: number;
  content: any; // Snapshot of content at this version
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  editedBy: Types.ObjectId;
  reason?: string;
  createdAt: Date;
}

const ContentVersionSchema = new Schema<IContentVersion>(
  {
    contentTemplate: {
      type: Schema.Types.ObjectId,
      ref: "ContentTemplate",
      required: true,
      index: true,
    },
    version: {
      type: Number,
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
    changes: [
      {
        field: String,
        oldValue: Schema.Types.Mixed,
        newValue: Schema.Types.Mixed,
      },
    ],
    editedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
ContentVersionSchema.index({ contentTemplate: 1, version: -1 });
ContentVersionSchema.index({ editedBy: 1, createdAt: -1 });

const ContentVersionModel = mongoose.model<IContentVersion>(
  "ContentVersion",
  ContentVersionSchema
);

export default ContentVersionModel;

/**
 * ContentAuditLog Model
 * Comprehensive audit trail for all content operations
 */

export interface IContentAuditLog extends Document {
  _id: Types.ObjectId;
  action: "create" | "update" | "delete" | "publish" | "unpublish" | "clone" | "rollback" | "archive";
  contentType: "quiz" | "lesson" | "assignment" | "exercise";
  contentId: Types.ObjectId;
  userId: Types.ObjectId;
  userRole: string;
  school?: Types.ObjectId;
  changes?: any;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    previousVersion?: number;
    newVersion?: number;
    originalTemplateId?: any;
    rolledBackTo?: number;
  };
  timestamp: Date;
}

const ContentAuditLogSchema = new Schema<IContentAuditLog>(
  {
    action: {
      type: String,
      enum: ["create", "update", "delete", "publish", "unpublish", "clone", "rollback", "archive"],
      required: true,
      index: true,
    },
    contentType: {
      type: String,
      enum: ["quiz", "lesson", "assignment", "exercise"],
      required: true,
      index: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: "School",
    },
    changes: {
      type: Schema.Types.Mixed,
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      previousVersion: Number,
      newVersion: Number,
      originalTemplateId: Schema.Types.Mixed,
      rolledBackTo: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Indexes for audit queries
ContentAuditLogSchema.index({ contentId: 1, timestamp: -1 });
ContentAuditLogSchema.index({ userId: 1, action: 1, timestamp: -1 });
ContentAuditLogSchema.index({ school: 1, timestamp: -1 });
ContentAuditLogSchema.index({ action: 1, contentType: 1, timestamp: -1 });

export const ContentAuditLogModel = mongoose.model<IContentAuditLog>(
  "ContentAuditLog",
  ContentAuditLogSchema
);
