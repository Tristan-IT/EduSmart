import mongoose, { Schema, Document } from "mongoose";

export interface IIntervention extends Document {
  teacher: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  school: mongoose.Types.ObjectId;
  type: "remedial" | "tutoring" | "peer" | "parent" | "other";
  title: string;
  note: string;
  dueDate?: Date;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const InterventionSchema = new Schema<IIntervention>(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["remedial", "tutoring", "peer", "parent", "other"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    note: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
InterventionSchema.index({ teacher: 1, createdAt: -1 });
InterventionSchema.index({ student: 1, status: 1 });
InterventionSchema.index({ school: 1, status: 1 });

const InterventionModel = mongoose.model<IIntervention>(
  "Intervention",
  InterventionSchema
);

export default InterventionModel;
