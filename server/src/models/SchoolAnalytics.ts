import mongoose, { Schema, Document } from "mongoose";

export interface ISchoolAnalytics extends Document {
  school: mongoose.Types.ObjectId;
  schoolId: string;

  date: Date;

  // Overall counts
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;

  // Daily activity
  activeTeachers: number;
  activeStudents: number;
  totalLessons: number;
  totalQuizzes: number;
  totalAssignments: number;

  // Engagement metrics
  averageStudentXP: number;
  averageStudentLevel: number;
  averageClassAttendance: number;
  totalStudentLogins: number;

  // Content metrics
  totalVideos: number;
  totalExercises: number;
  totalModules: number;
  totalAchievementsUnlocked: number;

  // Performance metrics
  topPerformingClass?: mongoose.Types.ObjectId;
  topPerformingClassId?: string;
  topPerformingClassName?: string;

  topPerformingTeacher?: mongoose.Types.ObjectId;
  topPerformingTeacherId?: string;
  topPerformingTeacherName?: string;

  topPerformingStudent?: mongoose.Types.ObjectId;
  topPerformingStudentId?: string;
  topPerformingStudentName?: string;

  // Quiz & Assignment stats
  averageQuizScore: number;
  totalQuizzesTaken: number;
  totalQuizzesGraded: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const SchoolAnalyticsSchema = new Schema<ISchoolAnalytics>(
  {
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

    date: {
      type: Date,
      required: true,
      index: true,
    },

    // Overall counts
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
    totalClasses: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Daily activity
    activeTeachers: {
      type: Number,
      default: 0,
      min: 0,
    },
    activeStudents: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalQuizzes: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAssignments: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Engagement metrics
    averageStudentXP: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageStudentLevel: {
      type: Number,
      default: 1,
      min: 1,
    },
    averageClassAttendance: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalStudentLogins: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Content metrics
    totalVideos: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalExercises: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalModules: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAchievementsUnlocked: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Top performers
    topPerformingClass: {
      type: Schema.Types.ObjectId,
      ref: "Class",
    },
    topPerformingClassId: {
      type: String,
    },
    topPerformingClassName: {
      type: String,
    },

    topPerformingTeacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    topPerformingTeacherId: {
      type: String,
    },
    topPerformingTeacherName: {
      type: String,
    },

    topPerformingStudent: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    topPerformingStudentId: {
      type: String,
    },
    topPerformingStudentName: {
      type: String,
    },

    // Quiz & Assignment stats
    averageQuizScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalQuizzesTaken: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalQuizzesGraded: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one record per school per date
SchoolAnalyticsSchema.index({ school: 1, date: 1 }, { unique: true });

// Indexes for queries
SchoolAnalyticsSchema.index({ schoolId: 1, date: -1 });
SchoolAnalyticsSchema.index({ date: -1 });

// Static method to calculate and save daily analytics for a school
SchoolAnalyticsSchema.statics.calculateDaily = async function (schoolId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const School = mongoose.model("School");
  const User = mongoose.model("User");
  const Class = mongoose.model("Class");
  const StudentProfile = mongoose.model("StudentProfile");

  const school = await School.findOne({ schoolId });
  if (!school) throw new Error("School not found");

  // Count teachers and students
  const totalTeachers = await User.countDocuments({
    school: school._id,
    role: "teacher",
  });

  const totalStudents = await User.countDocuments({
    school: school._id,
    role: "student",
  });

  const totalClasses = await Class.countDocuments({
    school: school._id,
    isActive: true,
  });

  // Calculate average student XP and level
  const studentProfiles = await StudentProfile.find({
    user: { $in: await User.find({ school: school._id, role: "student" }).distinct("_id") },
  });

  const averageStudentXP =
    studentProfiles.length > 0
      ? studentProfiles.reduce((sum, p) => sum + p.xp, 0) / studentProfiles.length
      : 0;

  const averageStudentLevel =
    studentProfiles.length > 0
      ? studentProfiles.reduce((sum, p) => sum + p.level, 0) / studentProfiles.length
      : 1;

  // Find top performing student (highest XP)
  const topStudent = await StudentProfile.findOne({
    user: { $in: await User.find({ school: school._id, role: "student" }).distinct("_id") },
  })
    .sort({ xp: -1 })
    .populate("user", "name");

  // Update or create analytics record
  return await this.findOneAndUpdate(
    {
      school: school._id,
      date: today,
    },
    {
      schoolId: school.schoolId,
      totalTeachers,
      totalStudents,
      totalClasses,
      averageStudentXP: Math.round(averageStudentXP),
      averageStudentLevel: Math.round(averageStudentLevel * 10) / 10,
      topPerformingStudent: topStudent?.user?._id,
      topPerformingStudentId: topStudent?.user?._id?.toString(),
      topPerformingStudentName: (topStudent?.user as any)?.name,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
};

const SchoolAnalyticsModel = mongoose.model<ISchoolAnalytics>(
  "SchoolAnalytics",
  SchoolAnalyticsSchema
);

export default SchoolAnalyticsModel;
