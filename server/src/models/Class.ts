import mongoose, { Schema, Document } from "mongoose";

export interface ISubjectTeacher {
  teacher: mongoose.Types.ObjectId;
  teacherName: string;
  subject: string;
}

export interface IClassSchedule {
  day: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu";
  startTime: string;
  endTime: string;
  subject: string;
  teacher: mongoose.Types.ObjectId;
}

export interface IClass extends Document {
  classId: string;
  className: string;
  grade: number;
  section: string;

  // School relationship
  school: mongoose.Types.ObjectId;
  schoolId: string;
  schoolName: string;
  schoolType: "SD" | "SMP" | "SMA" | "SMK";

  // For SMA - Specialization (only for grade 11 & 12)
  specialization?: string; // "IPA", "IPS", "Bahasa"

  // For SMK - Major (all grades)
  majorCode?: string; // "PPLG", "TKJ", "RPL"
  majorName?: string; // "Pengembangan Perangkat Lunak dan Gim"

  // Display names
  displayName: string; // "Kelas 10 PPLG 1"
  shortName: string; // "10 PPLG 1"

  // Academic info
  academicYear: string;
  maxStudents: number;
  currentStudents: number;

  // Teacher assignment
  homeRoomTeacher?: mongoose.Types.ObjectId;
  homeRoomTeacherName?: string;
  subjectTeachers: ISubjectTeacher[];

  // Subject assignments
  subjects?: mongoose.Types.ObjectId[];

  // Schedule (optional)
  schedule?: IClassSchedule[];

  // Status
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectTeacherSchema = new Schema<ISubjectTeacher>(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ClassScheduleSchema = new Schema<IClassSchedule>(
  {
    day: {
      type: String,
      enum: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { _id: false }
);

const ClassSchema = new Schema<IClass>(
  {
    classId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    className: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },

    // School relationship
    school: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    schoolId: {
      type: String,
      required: true,
      index: true,
    },
    schoolName: {
      type: String,
      required: true,
    },
    schoolType: {
      type: String,
      enum: ["SD", "SMP", "SMA", "SMK"],
      required: true,
      index: true,
    },

    // SMA Specialization
    specialization: {
      type: String,
      trim: true,
      uppercase: true,
    },

    // SMK Major
    majorCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    majorName: {
      type: String,
      trim: true,
    },

    // Display names
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    shortName: {
      type: String,
      required: true,
      trim: true,
    },

    // Academic info
    academicYear: {
      type: String,
      required: true,
      default: "2024/2025",
    },
    maxStudents: {
      type: Number,
      default: 40,
      min: 1,
    },
    currentStudents: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Teachers
    homeRoomTeacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    homeRoomTeacherName: {
      type: String,
    },
    subjectTeachers: {
      type: [SubjectTeacherSchema],
      default: [],
    },

    // Subject assignments
    subjects: {
      type: [Schema.Types.ObjectId],
      ref: "Subject",
      default: [],
    },

    // Schedule
    schedule: {
      type: [ClassScheduleSchema],
      default: [],
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

// Generate unique class ID before saving
ClassSchema.pre("save", async function (next) {
  if (this.isNew && !this.classId) {
    // Generate CLS-XXXXX format
    const count = await mongoose.model("Class").countDocuments();
    this.classId = `CLS-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

// Indexes for performance
ClassSchema.index({ school: 1, grade: 1, section: 1 });
ClassSchema.index({ school: 1, schoolType: 1 });
ClassSchema.index({ school: 1, grade: 1, specialization: 1 });
ClassSchema.index({ school: 1, grade: 1, majorCode: 1 });
ClassSchema.index({ homeRoomTeacher: 1 });
ClassSchema.index({ isActive: 1 });

// Compound index for class lookup within school
ClassSchema.index({ school: 1, displayName: 1 }, { unique: true });

const ClassModel = mongoose.model<IClass>("Class", ClassSchema);

export default ClassModel;
