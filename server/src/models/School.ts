import mongoose, { Schema, Document } from "mongoose";

export interface ISMKMajor {
  code: string;
  name: string;
  description?: string;
}

export interface ISchool extends Document {
  schoolId: string;
  schoolName: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;

  // Admin/Owner info
  owner: mongoose.Types.ObjectId;
  ownerName: string;
  ownerEmail: string;

  // School Type Configuration
  schoolTypes: Array<"SD" | "SMP" | "SMA" | "SMK">; // Multiple school types for integrated schools (e.g., SD-SMA)
  schoolType: "SD" | "SMP" | "SMA" | "SMK"; // Legacy field - keep for backward compatibility
  smaSpecializations?: string[]; // ["IPA", "IPS", "Bahasa"]
  smkMajors?: ISMKMajor[];

  // School stats
  totalClasses: number;
  totalTeachers: number;
  totalStudents: number;
  academicYear: string;

  // Subscription info (for future paid plans)
  subscriptionPlan: "free" | "basic" | "premium";
  subscriptionStatus: "active" | "inactive" | "suspended";
  subscriptionExpiry?: Date;

  // Status
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SMKMajorSchema = new Schema<ISMKMajor>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const SchoolSchema = new Schema<ISchool>(
  {
    schoolId: {
      type: String,
      unique: true,
      index: true,
    },
    schoolName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    website: {
      type: String,
    },
    logoUrl: {
      type: String,
      default: "https://api.dicebear.com/7.x/initials/svg?seed=school",
    },

    // Owner info
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
    },

    // School Type Configuration
    schoolTypes: {
      type: [String],
      enum: ["SD", "SMP", "SMA", "SMK"],
      default: ["SMA"],
      validate: {
        validator: function(v: string[]) {
          return v && v.length > 0;
        },
        message: "At least one school type must be specified"
      }
    },
    schoolType: {
      type: String,
      enum: ["SD", "SMP", "SMA", "SMK"],
      required: true,
      default: "SMA",
      index: true,
    },
    smaSpecializations: {
      type: [String],
      default: undefined,
    },
    smkMajors: {
      type: [SMKMajorSchema],
      default: undefined,
    },

    // Stats
    totalClasses: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTeachers: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
      min: 0,
    },
    academicYear: {
      type: String,
      required: true,
      default: "2024/2025",
    },

    // Subscription
    subscriptionPlan: {
      type: String,
      enum: ["free", "basic", "premium"],
      default: "free",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    subscriptionExpiry: {
      type: Date,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique school ID before saving
SchoolSchema.pre("save", async function (next) {
  if (this.isNew && !this.schoolId) {
    // Generate SCH-XXXXX format
    const count = await mongoose.model("School").countDocuments();
    this.schoolId = `SCH-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

const SchoolModel = mongoose.model<ISchool>("School", SchoolSchema);

export default SchoolModel;
