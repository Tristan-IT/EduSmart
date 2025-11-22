import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * SkillTreePath Model
 * 
 * Represents a learning path that groups multiple skill tree nodes together
 * into a coherent curriculum sequence. Paths help organize the learning journey
 * for students by providing structured progressions through related topics.
 * 
 * Use cases:
 * - Semester-long curriculum paths (e.g., "SMP 7 Semester 1 - Matematika")
 * - Topic-specific paths (e.g., "Aljabar Dasar", "Geometri Bidang")
 * - Vocational skill paths for SMK (e.g., "Web Development Fundamentals")
 * - Remedial or enrichment paths
 */

export interface ISkillTreePath extends Document {
  pathId: string;                          // Unique identifier (e.g., "PATH-SMP-7-1-MAT-001")
  name: string;                            // Display name (e.g., "Aljabar Semester 1")
  description: string;                     // Detailed description
  gradeLevel: "SD" | "SMP" | "SMA" | "SMK"; // Education level
  classNumber: number;                     // 1-12
  semester: number;                        // 1-2
  subject: string;                         // Subject name (e.g., "Matematika")
  major?: string;                          // For SMK: PPLG, TJKT, DKV, BD, etc.
  curriculum: "Kurikulum Merdeka" | "K13"; // Curriculum type
  
  // Path structure
  nodeIds: string[];                       // Ordered array of skill tree node IDs
  totalNodes: number;                      // Calculated from nodeIds.length
  
  // Metadata
  totalXP: number;                         // Sum of all node XP rewards
  totalQuizzes: number;                    // Total quiz count across nodes
  estimatedHours: number;                  // Estimated completion time
  checkpointCount: number;                 // Number of checkpoint nodes
  
  // Learning outcomes
  learningOutcomes: string[];              // What students will learn
  kompetensiDasar?: string[];              // KD codes (Indonesian curriculum)
  
  // Prerequisites
  prerequisites: string[];                 // Other pathIds required before this
  
  // Template vs Custom
  isTemplate: boolean;                     // True for system-created, false for school-custom
  school?: mongoose.Types.ObjectId;        // Reference to School (if custom path)
  createdBy?: mongoose.Types.ObjectId;     // Teacher who created (if custom)
  
  // Visibility
  isPublic: boolean;                       // Visible to all schools or just creator's school
  isActive: boolean;                       // Can be assigned to students
  
  // Tracking
  tags: string[];                          // Searchable tags
  difficulty: "Mudah" | "Sedang" | "Sulit" | "Campuran"; // Overall difficulty
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const SkillTreePathSchema: Schema<ISkillTreePath> = new Schema(
  {
    pathId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    gradeLevel: {
      type: String,
      required: true,
      enum: ["SD", "SMP", "SMA", "SMK"],
      index: true,
    },
    classNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      index: true,
    },
    semester: {
      type: Number,
      required: true,
      enum: [1, 2],
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    major: {
      type: String,
      trim: true,
      index: true,
      // For SMK vocational programs
    },
    curriculum: {
      type: String,
      required: true,
      enum: ["Kurikulum Merdeka", "K13"],
      default: "Kurikulum Merdeka",
    },
    nodeIds: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr: string[]) {
          return arr.length > 0 && arr.length <= 100; // Max 100 nodes per path
        },
        message: "Path must contain 1-100 nodes",
      },
    },
    totalNodes: {
      type: Number,
      required: true,
      min: 1,
    },
    totalXP: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalQuizzes: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    estimatedHours: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    checkpointCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    learningOutcomes: {
      type: [String],
      default: [],
    },
    kompetensiDasar: {
      type: [String],
      default: [],
    },
    prerequisites: {
      type: [String],
      default: [],
    },
    isTemplate: {
      type: Boolean,
      default: false,
      index: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: "School",
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["Mudah", "Sedang", "Sulit", "Campuran"],
      default: "Sedang",
    },
  },
  {
    timestamps: true,
    collection: "skillTreePaths",
  }
);

// Indexes for efficient queries
SkillTreePathSchema.index({ gradeLevel: 1, classNumber: 1, semester: 1 });
SkillTreePathSchema.index({ subject: 1, major: 1 });
SkillTreePathSchema.index({ isTemplate: 1, isActive: 1 });
SkillTreePathSchema.index({ school: 1, isActive: 1 });
SkillTreePathSchema.index({ tags: 1 });

// Middleware to calculate totalNodes before save
SkillTreePathSchema.pre("save", function (next) {
  if (this.isModified("nodeIds")) {
    this.totalNodes = this.nodeIds.length;
  }
  next();
});

// Virtual for completion percentage (requires user context, so implemented in controller)
SkillTreePathSchema.virtual("progressPercentage").get(function () {
  // This will be populated in the API response with user's actual progress
  return 0;
});

// Methods
SkillTreePathSchema.methods.addNode = function (nodeId: string) {
  if (!this.nodeIds.includes(nodeId)) {
    this.nodeIds.push(nodeId);
    this.totalNodes = this.nodeIds.length;
  }
};

SkillTreePathSchema.methods.removeNode = function (nodeId: string) {
  this.nodeIds = this.nodeIds.filter((id: string) => id !== nodeId);
  this.totalNodes = this.nodeIds.length;
};

SkillTreePathSchema.methods.reorderNodes = function (newOrder: string[]) {
  if (newOrder.length === this.nodeIds.length) {
    this.nodeIds = newOrder;
  } else {
    throw new Error("New order must contain same number of nodes");
  }
};

// Static methods
SkillTreePathSchema.statics.findByFilters = function (filters: {
  gradeLevel?: string;
  classNumber?: number;
  semester?: number;
  subject?: string;
  major?: string;
  isTemplate?: boolean;
  school?: string;
  isActive?: boolean;
}) {
  const query: any = {};

  if (filters.gradeLevel) query.gradeLevel = filters.gradeLevel;
  if (filters.classNumber) query.classNumber = filters.classNumber;
  if (filters.semester) query.semester = filters.semester;
  if (filters.subject) query.subject = filters.subject;
  if (filters.major) query.major = filters.major;
  if (filters.isTemplate !== undefined) query.isTemplate = filters.isTemplate;
  if (filters.school) query.school = filters.school;
  if (filters.isActive !== undefined) query.isActive = filters.isActive;

  return this.find(query).sort({ classNumber: 1, semester: 1, name: 1 });
};

SkillTreePathSchema.statics.findTemplates = function (filters?: {
  gradeLevel?: string;
  classNumber?: number;
  subject?: string;
}) {
  const query: any = { isTemplate: true, isPublic: true, isActive: true };

  if (filters?.gradeLevel) query.gradeLevel = filters.gradeLevel;
  if (filters?.classNumber) query.classNumber = filters.classNumber;
  if (filters?.subject) query.subject = filters.subject;

  return this.find(query).sort({ gradeLevel: 1, classNumber: 1, subject: 1 });
};

SkillTreePathSchema.statics.findBySchool = function (
  schoolId: string,
  includeTemplates: boolean = true
) {
  const query: any = { isActive: true };

  if (includeTemplates) {
    query.$or = [{ school: schoolId }, { isTemplate: true, isPublic: true }];
  } else {
    query.school = schoolId;
  }

  return this.find(query).sort({ classNumber: 1, semester: 1 });
};

interface ISkillTreePathModel extends Model<ISkillTreePath> {
  findByFilters(filters: any): Promise<ISkillTreePath[]>;
  findTemplates(filters?: any): Promise<ISkillTreePath[]>;
  findBySchool(schoolId: string, includeTemplates?: boolean): Promise<ISkillTreePath[]>;
}

const SkillTreePathModel = mongoose.model<ISkillTreePath, ISkillTreePathModel>(
  "SkillTreePath",
  SkillTreePathSchema
);

export default SkillTreePathModel;
