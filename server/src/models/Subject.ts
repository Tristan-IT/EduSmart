import mongoose, { Document, Schema } from "mongoose";

/**
 * Subject Category Enum
 * WAJIB: Mandatory subjects (Matematika, Bahasa Indonesia, etc.)
 * PEMINATAN: Specialization subjects (for SMA)
 * MUATAN_LOKAL: Local content subjects
 * EKSTRAKURIKULER: Extracurricular activities
 */
export type SubjectCategory = "WAJIB" | "PEMINATAN" | "MUATAN_LOKAL" | "EKSTRAKURIKULER";

/**
 * Subject Interface
 * Represents a subject/mata pelajaran in the school curriculum
 */
export interface ISubject extends Document {
  school: mongoose.Types.ObjectId; // Reference to School
  code: string; // Subject code (e.g., "MAT", "IPA", "B.IND")
  name: string; // Subject name (e.g., "Matematika", "IPA Terpadu")
  category: SubjectCategory;
  schoolTypes: Array<"SD" | "SMP" | "SMA" | "SMK">; // Applicable school types
  grades: number[]; // Applicable grades (e.g., [1,2,3] or [10,11,12])
  smaSpecializations?: string[]; // For SMA: ["IPA", "IPS", "BAHASA"]
  smkMajors?: string[]; // For SMK: ["PPLG", "TKJ", etc.]
  description?: string; // Subject description
  color?: string; // Color code for UI (e.g., "#3B82F6")
  icon?: string; // Icon name for UI
  isActive: boolean; // Soft delete flag
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Subject Schema
 */
const subjectSchema = new Schema<ISubject>(
  {
    school: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School reference is required"],
      index: true,
    },
    code: {
      type: String,
      required: [true, "Subject code is required"],
      trim: true,
      uppercase: true,
      maxlength: [10, "Subject code cannot exceed 10 characters"],
    },
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
      maxlength: [100, "Subject name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      enum: {
        values: ["WAJIB", "PEMINATAN", "MUATAN_LOKAL", "EKSTRAKURIKULER"],
        message: "Category must be WAJIB, PEMINATAN, MUATAN_LOKAL, or EKSTRAKURIKULER",
      },
      required: [true, "Category is required"],
      index: true,
    },
    schoolTypes: {
      type: [String],
      enum: {
        values: ["SD", "SMP", "SMA", "SMK"],
        message: "School type must be SD, SMP, SMA, or SMK",
      },
      required: [true, "At least one school type is required"],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: "At least one school type must be specified",
      },
    },
    grades: {
      type: [Number],
      required: [true, "At least one grade is required"],
      validate: {
        validator: function (v: number[]) {
          if (!v || v.length === 0) return false;
          // Validate grade range 1-12
          return v.every((grade) => grade >= 1 && grade <= 12);
        },
        message: "Grades must be between 1 and 12",
      },
    },
    smaSpecializations: {
      type: [String],
      enum: {
        values: ["IPA", "IPS", "BAHASA"],
        message: "SMA specialization must be IPA, IPS, or BAHASA",
      },
      default: undefined,
    },
    smkMajors: {
      type: [String],
      default: undefined,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    color: {
      type: String,
      trim: true,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color must be a valid hex color code"],
      default: "#6B7280", // Default gray color
    },
    icon: {
      type: String,
      trim: true,
      maxlength: [50, "Icon name cannot exceed 50 characters"],
      default: "BookOpen", // Default Lucide icon
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Indexes for Performance and Uniqueness
 */
// Compound index for uniqueness: one school cannot have duplicate subject codes
subjectSchema.index({ school: 1, code: 1 }, { unique: true });

// Compound index for filtering by school and category
subjectSchema.index({ school: 1, category: 1 });

// Compound index for filtering by school types
subjectSchema.index({ school: 1, schoolTypes: 1 });

// Index for active subjects
subjectSchema.index({ school: 1, isActive: 1 });

/**
 * Pre-save Validation
 */
subjectSchema.pre("save", function (next) {
  // Validate SMA specializations
  if (this.schoolTypes.includes("SMA") && this.category === "PEMINATAN") {
    if (!this.smaSpecializations || this.smaSpecializations.length === 0) {
      return next(new Error("SMA peminatan subjects must specify specializations"));
    }
  }

  // Validate SMK majors
  if (this.schoolTypes.includes("SMK") && this.category === "PEMINATAN") {
    if (!this.smkMajors || this.smkMajors.length === 0) {
      return next(new Error("SMK peminatan subjects must specify majors"));
    }
  }

  // Validate grade ranges based on school type
  const hasSD = this.schoolTypes.includes("SD");
  const hasSMP = this.schoolTypes.includes("SMP");
  const hasSMA = this.schoolTypes.includes("SMA");
  const hasSMK = this.schoolTypes.includes("SMK");

  for (const grade of this.grades) {
    if (hasSD && grade >= 1 && grade <= 6) continue;
    if (hasSMP && grade >= 7 && grade <= 9) continue;
    if (hasSMA && grade >= 10 && grade <= 12) continue;
    if (hasSMK && grade >= 10 && grade <= 12) continue;

    return next(
      new Error(
        `Grade ${grade} is not valid for school types: ${this.schoolTypes.join(", ")}`
      )
    );
  }

  next();
});

/**
 * Static Methods
 */
subjectSchema.statics = {
  /**
   * Find active subjects for a school
   */
  async findActiveBySchool(schoolId: mongoose.Types.ObjectId) {
    return this.find({ school: schoolId, isActive: true }).sort({ category: 1, name: 1 });
  },

  /**
   * Find subjects by school type and grade
   */
  async findBySchoolTypeAndGrade(
    schoolId: mongoose.Types.ObjectId,
    schoolType: "SD" | "SMP" | "SMA" | "SMK",
    grade: number
  ) {
    return this.find({
      school: schoolId,
      schoolTypes: schoolType,
      grades: grade,
      isActive: true,
    }).sort({ category: 1, name: 1 });
  },

  /**
   * Find subjects by category
   */
  async findByCategory(schoolId: mongoose.Types.ObjectId, category: SubjectCategory) {
    return this.find({
      school: schoolId,
      category,
      isActive: true,
    }).sort({ name: 1 });
  },
};

/**
 * Instance Methods
 */
subjectSchema.methods = {
  /**
   * Soft delete subject
   */
  async softDelete() {
    this.isActive = false;
    return this.save();
  },

  /**
   * Restore soft-deleted subject
   */
  async restore() {
    this.isActive = true;
    return this.save();
  },

  /**
   * Check if subject is applicable for a specific grade and school type
   */
  isApplicableFor(schoolType: "SD" | "SMP" | "SMA" | "SMK", grade: number): boolean {
    return this.schoolTypes.includes(schoolType) && this.grades.includes(grade);
  },
};

const SubjectModel = mongoose.model<ISubject>("Subject", subjectSchema);

export default SubjectModel;
