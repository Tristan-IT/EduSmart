import mongoose, { Schema, Document } from "mongoose";

export interface ITeacherAnalytics extends Document {
  teacher: mongoose.Types.ObjectId;
  teacherId: string;
  teacherName: string;

  school: mongoose.Types.ObjectId;
  schoolId: string;

  class?: mongoose.Types.ObjectId;
  classId?: string;

  // Date for daily tracking
  date: Date;

  // Teaching metrics
  lessonsPlanned: number;
  lessonsCompleted: number;
  quizzesCreated: number;
  quizzesGraded: number;
  assignmentsGiven: number;
  assignmentsGraded: number;

  // Student engagement
  studentsActive: number;
  studentsAbsent: number;
  averageAttendance: number;

  // Content metrics
  videosUploaded: number;
  exercisesCreated: number;
  modulesCreated: number;

  // Interaction metrics
  chatMessagesWithStudents: number;
  feedbackGiven: number;
  questionsAnswered: number;

  // Performance metrics
  averageQuizScore: number;
  averageStudentXP: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const TeacherAnalyticsSchema = new Schema<ITeacherAnalytics>(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    teacherId: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },

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

    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
    },
    classId: {
      type: String,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    // Teaching metrics
    lessonsPlanned: {
      type: Number,
      default: 0,
      min: 0,
    },
    lessonsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    quizzesCreated: {
      type: Number,
      default: 0,
      min: 0,
    },
    quizzesGraded: {
      type: Number,
      default: 0,
      min: 0,
    },
    assignmentsGiven: {
      type: Number,
      default: 0,
      min: 0,
    },
    assignmentsGraded: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Student engagement
    studentsActive: {
      type: Number,
      default: 0,
      min: 0,
    },
    studentsAbsent: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageAttendance: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Content metrics
    videosUploaded: {
      type: Number,
      default: 0,
      min: 0,
    },
    exercisesCreated: {
      type: Number,
      default: 0,
      min: 0,
    },
    modulesCreated: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Interaction metrics
    chatMessagesWithStudents: {
      type: Number,
      default: 0,
      min: 0,
    },
    feedbackGiven: {
      type: Number,
      default: 0,
      min: 0,
    },
    questionsAnswered: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Performance metrics
    averageQuizScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    averageStudentXP: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: one record per teacher per date
TeacherAnalyticsSchema.index({ teacher: 1, date: 1 }, { unique: true });

// Indexes for queries
TeacherAnalyticsSchema.index({ school: 1, date: 1 });
TeacherAnalyticsSchema.index({ class: 1, date: 1 });
TeacherAnalyticsSchema.index({ schoolId: 1, date: -1 });

// Static method to create or update daily analytics
TeacherAnalyticsSchema.statics.trackActivity = async function (
  teacherId: string,
  activityType: string,
  metadata: any = {}
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const teacher = await mongoose.model("User").findById(teacherId);
  if (!teacher) throw new Error("Teacher not found");

  const update: any = {};

  switch (activityType) {
    case "lesson_planned":
      update.$inc = { lessonsPlanned: 1 };
      break;
    case "lesson_completed":
      update.$inc = { lessonsCompleted: 1 };
      break;
    case "quiz_created":
      update.$inc = { quizzesCreated: 1 };
      break;
    case "quiz_graded":
      update.$inc = { quizzesGraded: 1 };
      break;
    case "assignment_given":
      update.$inc = { assignmentsGiven: 1 };
      break;
    case "assignment_graded":
      update.$inc = { assignmentsGraded: 1 };
      break;
    case "video_uploaded":
      update.$inc = { videosUploaded: 1 };
      break;
    case "exercise_created":
      update.$inc = { exercisesCreated: 1 };
      break;
    case "module_created":
      update.$inc = { modulesCreated: 1 };
      break;
    case "chat_message":
      update.$inc = { chatMessagesWithStudents: 1 };
      break;
    case "feedback_given":
      update.$inc = { feedbackGiven: 1 };
      break;
    case "question_answered":
      update.$inc = { questionsAnswered: 1 };
      break;
    default:
      break;
  }

  return await this.findOneAndUpdate(
    {
      teacher: teacherId,
      date: today,
    },
    {
      ...update,
      teacherId: teacher._id.toString(),
      teacherName: teacher.name,
      school: teacher.school,
      schoolId: teacher.schoolId,
      class: metadata.classId || undefined,
      classId: metadata.classId || undefined,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
};

const TeacherAnalyticsModel = mongoose.model<ITeacherAnalytics>(
  "TeacherAnalytics",
  TeacherAnalyticsSchema
);

export default TeacherAnalyticsModel;
