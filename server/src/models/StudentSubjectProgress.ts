import mongoose, { Document, Schema } from "mongoose";

/**
 * StudentSubjectProgress Interface
 * Tracks student's progress and performance in each subject
 */
export interface IStudentSubjectProgress extends Document {
  student: mongoose.Types.ObjectId; // Reference to User (student)
  subject: mongoose.Types.ObjectId; // Reference to Subject
  class: mongoose.Types.ObjectId; // Reference to Class
  school: mongoose.Types.ObjectId; // Reference to School (for queries)
  
  // Activity Counters
  totalLessonsCompleted: number;
  totalQuizzesCompleted: number;
  totalExercisesCompleted: number;
  totalAssignmentsCompleted: number;
  
  // Performance Metrics
  averageScore: number; // 0-100
  highestScore: number;
  lowestScore: number;
  totalXPEarned: number;
  
  // Time Tracking
  totalTimeSpent: number; // in minutes
  lastActivityAt: Date;
  
  // Analytics Arrays
  weakTopics: string[]; // Topics where student scores < 60%
  strongTopics: string[]; // Topics where student scores > 80%
  recentScores: number[]; // Last 10 quiz/assignment scores for trend analysis
  
  // Mastery Level
  masteryLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "MASTER";
  masteryPercentage: number; // 0-100
  
  // Engagement
  streakDays: number; // Consecutive days of activity in this subject
  lastStreakDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * StudentSubjectProgress Schema
 */
const studentSubjectProgressSchema = new Schema<IStudentSubjectProgress>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
      index: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject reference is required"],
      index: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class reference is required"],
      index: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: [true, "School reference is required"],
      index: true,
    },
    
    // Activity Counters
    totalLessonsCompleted: {
      type: Number,
      default: 0,
      min: [0, "Lessons completed cannot be negative"],
    },
    totalQuizzesCompleted: {
      type: Number,
      default: 0,
      min: [0, "Quizzes completed cannot be negative"],
    },
    totalExercisesCompleted: {
      type: Number,
      default: 0,
      min: [0, "Exercises completed cannot be negative"],
    },
    totalAssignmentsCompleted: {
      type: Number,
      default: 0,
      min: [0, "Assignments completed cannot be negative"],
    },
    
    // Performance Metrics
    averageScore: {
      type: Number,
      default: 0,
      min: [0, "Average score cannot be negative"],
      max: [100, "Average score cannot exceed 100"],
    },
    highestScore: {
      type: Number,
      default: 0,
      min: [0, "Highest score cannot be negative"],
      max: [100, "Highest score cannot exceed 100"],
    },
    lowestScore: {
      type: Number,
      default: 0,
      min: [0, "Lowest score cannot be negative"],
      max: [100, "Lowest score cannot exceed 100"],
    },
    totalXPEarned: {
      type: Number,
      default: 0,
      min: [0, "XP earned cannot be negative"],
    },
    
    // Time Tracking
    totalTimeSpent: {
      type: Number,
      default: 0,
      min: [0, "Time spent cannot be negative"],
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    
    // Analytics Arrays
    weakTopics: {
      type: [String],
      default: [],
    },
    strongTopics: {
      type: [String],
      default: [],
    },
    recentScores: {
      type: [Number],
      default: [],
      validate: {
        validator: function (v: number[]) {
          return v.every((score) => score >= 0 && score <= 100);
        },
        message: "All scores must be between 0 and 100",
      },
    },
    
    // Mastery Level
    masteryLevel: {
      type: String,
      enum: {
        values: ["BEGINNER", "INTERMEDIATE", "ADVANCED", "MASTER"],
        message: "Mastery level must be BEGINNER, INTERMEDIATE, ADVANCED, or MASTER",
      },
      default: "BEGINNER",
    },
    masteryPercentage: {
      type: Number,
      default: 0,
      min: [0, "Mastery percentage cannot be negative"],
      max: [100, "Mastery percentage cannot exceed 100"],
    },
    
    // Engagement
    streakDays: {
      type: Number,
      default: 0,
      min: [0, "Streak days cannot be negative"],
    },
    lastStreakDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Indexes for Performance
 */
// Compound unique index: one progress record per student per subject
studentSubjectProgressSchema.index({ student: 1, subject: 1 }, { unique: true });

// Compound index for finding all subjects of a student in a class
studentSubjectProgressSchema.index({ student: 1, class: 1 });

// Compound index for class-wide subject analytics
studentSubjectProgressSchema.index({ class: 1, subject: 1 });

// Compound index for school-wide subject analytics
studentSubjectProgressSchema.index({ school: 1, subject: 1 });

// Index for mastery level queries
studentSubjectProgressSchema.index({ subject: 1, masteryLevel: 1 });

// Index for recent activity
studentSubjectProgressSchema.index({ subject: 1, lastActivityAt: -1 });

/**
 * Virtual Fields
 */
// Total activities completed
studentSubjectProgressSchema.virtual("totalActivitiesCompleted").get(function () {
  return (
    this.totalLessonsCompleted +
    this.totalQuizzesCompleted +
    this.totalExercisesCompleted +
    this.totalAssignmentsCompleted
  );
});

// Calculate engagement rate (0-100)
studentSubjectProgressSchema.virtual("engagementRate").get(function () {
  const daysSinceCreation = Math.ceil(
    (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceCreation === 0) return 0;
  
  const totalActivities =
    this.totalLessonsCompleted +
    this.totalQuizzesCompleted +
    this.totalExercisesCompleted +
    this.totalAssignmentsCompleted;
  const expectedActivities = daysSinceCreation * 2; // Expect 2 activities per day
  
  return Math.min(100, Math.round((totalActivities / expectedActivities) * 100));
});

/**
 * Instance Methods
 */
studentSubjectProgressSchema.methods = {
  /**
   * Update progress after lesson completion
   */
  async updateLessonProgress(xpEarned: number = 10, timeSpent: number = 0) {
    this.totalLessonsCompleted += 1;
    this.totalXPEarned += xpEarned;
    this.totalTimeSpent += timeSpent;
    this.lastActivityAt = new Date();
    await this.updateStreak();
    await this.calculateMasteryLevel();
    return this.save();
  },

  /**
   * Update progress after quiz completion
   */
  async updateQuizProgress(score: number, topic: string, xpEarned: number = 0, timeSpent: number = 0) {
    this.totalQuizzesCompleted += 1;
    this.totalXPEarned += xpEarned;
    this.totalTimeSpent += timeSpent;
    this.lastActivityAt = new Date();
    
    // Update score metrics
    await this.updateScoreMetrics(score, topic);
    await this.updateStreak();
    await this.calculateMasteryLevel();
    
    return this.save();
  },

  /**
   * Update progress after exercise completion
   */
  async updateExerciseProgress(score: number, topic: string, xpEarned: number = 0, timeSpent: number = 0) {
    this.totalExercisesCompleted += 1;
    this.totalXPEarned += xpEarned;
    this.totalTimeSpent += timeSpent;
    this.lastActivityAt = new Date();
    
    await this.updateScoreMetrics(score, topic);
    await this.updateStreak();
    await this.calculateMasteryLevel();
    
    return this.save();
  },

  /**
   * Update progress after assignment completion
   */
  async updateAssignmentProgress(score: number, topic: string, xpEarned: number = 0, timeSpent: number = 0) {
    this.totalAssignmentsCompleted += 1;
    this.totalXPEarned += xpEarned;
    this.totalTimeSpent += timeSpent;
    this.lastActivityAt = new Date();
    
    await this.updateScoreMetrics(score, topic);
    await this.updateStreak();
    await this.calculateMasteryLevel();
    
    return this.save();
  },

  /**
   * Update score metrics and topic strengths
   */
  async updateScoreMetrics(score: number, topic: string) {
    // Update recent scores (keep last 10)
    this.recentScores.push(score);
    if (this.recentScores.length > 10) {
      this.recentScores.shift();
    }
    
    // Update average score
    if (this.recentScores.length > 0) {
      this.averageScore = Math.round(
        this.recentScores.reduce((a: number, b: number) => a + b, 0) / this.recentScores.length
      );
    }
    
    // Update highest/lowest scores
    if (score > this.highestScore) this.highestScore = score;
    if (this.lowestScore === 0 || score < this.lowestScore) this.lowestScore = score;
    
    // Update weak/strong topics
    if (score < 60 && !this.weakTopics.includes(topic)) {
      this.weakTopics.push(topic);
      // Remove from strong topics if exists
      this.strongTopics = this.strongTopics.filter((t: string) => t !== topic);
    } else if (score > 80 && !this.strongTopics.includes(topic)) {
      this.strongTopics.push(topic);
      // Remove from weak topics if exists
      this.weakTopics = this.weakTopics.filter((t: string) => t !== topic);
    }
    
    // Limit arrays to 10 items
    if (this.weakTopics.length > 10) this.weakTopics = this.weakTopics.slice(-10);
    if (this.strongTopics.length > 10) this.strongTopics = this.strongTopics.slice(-10);
  },

  /**
   * Calculate mastery level based on performance
   */
  async calculateMasteryLevel() {
    const totalActivities =
      this.totalLessonsCompleted +
      this.totalQuizzesCompleted +
      this.totalExercisesCompleted +
      this.totalAssignmentsCompleted;
    const avgScore = this.averageScore;
    
    // Calculate mastery percentage
    const activityFactor = Math.min(totalActivities / 50, 1) * 50; // Up to 50% from activities
    const scoreFactor = (avgScore / 100) * 50; // Up to 50% from scores
    
    this.masteryPercentage = Math.round(activityFactor + scoreFactor);
    
    // Determine mastery level
    if (this.masteryPercentage >= 90) {
      this.masteryLevel = "MASTER";
    } else if (this.masteryPercentage >= 70) {
      this.masteryLevel = "ADVANCED";
    } else if (this.masteryPercentage >= 40) {
      this.masteryLevel = "INTERMEDIATE";
    } else {
      this.masteryLevel = "BEGINNER";
    }
  },

  /**
   * Update streak days
   */
  async updateStreak() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!this.lastStreakDate) {
      // First activity
      this.streakDays = 1;
      this.lastStreakDate = today;
    } else {
      const lastStreak = new Date(this.lastStreakDate);
      lastStreak.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - lastStreak.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Same day, no change
        return;
      } else if (daysDiff === 1) {
        // Consecutive day
        this.streakDays += 1;
        this.lastStreakDate = today;
      } else {
        // Streak broken
        this.streakDays = 1;
        this.lastStreakDate = today;
      }
    }
  },
};

/**
 * Static Methods
 */
studentSubjectProgressSchema.statics = {
  /**
   * Get or create progress record
   */
  async getOrCreate(
    studentId: mongoose.Types.ObjectId,
    subjectId: mongoose.Types.ObjectId,
    classId: mongoose.Types.ObjectId,
    schoolId: mongoose.Types.ObjectId
  ) {
    let progress = await this.findOne({ student: studentId, subject: subjectId });
    
    if (!progress) {
      progress = await this.create({
        student: studentId,
        subject: subjectId,
        class: classId,
        school: schoolId,
      });
    }
    
    return progress;
  },

  /**
   * Get student's progress in all subjects
   */
  async getStudentProgress(studentId: mongoose.Types.ObjectId) {
    return this.find({ student: studentId })
      .populate("subject")
      .sort({ masteryPercentage: -1 });
  },

  /**
   * Get class leaderboard for a subject
   */
  async getSubjectLeaderboard(classId: mongoose.Types.ObjectId, subjectId: mongoose.Types.ObjectId, limit: number = 10) {
    return this.find({ class: classId, subject: subjectId })
      .populate("student", "name email")
      .sort({ averageScore: -1, totalXPEarned: -1 })
      .limit(limit);
  },

  /**
   * Get subject analytics for a class
   */
  async getClassSubjectAnalytics(classId: mongoose.Types.ObjectId, subjectId: mongoose.Types.ObjectId) {
    const students = await this.find({ class: classId, subject: subjectId });
    
    if (students.length === 0) {
      return null;
    }
    
    const avgScore = students.reduce((sum: number, s: IStudentSubjectProgress) => sum + s.averageScore, 0) / students.length;
    const avgActivities = students.reduce((sum: number, s: IStudentSubjectProgress) => sum + (s.totalLessonsCompleted + s.totalQuizzesCompleted + s.totalExercisesCompleted + s.totalAssignmentsCompleted), 0) / students.length;
    const masteryDistribution = {
      BEGINNER: students.filter((s: IStudentSubjectProgress) => s.masteryLevel === "BEGINNER").length,
      INTERMEDIATE: students.filter((s: IStudentSubjectProgress) => s.masteryLevel === "INTERMEDIATE").length,
      ADVANCED: students.filter((s: IStudentSubjectProgress) => s.masteryLevel === "ADVANCED").length,
      MASTER: students.filter((s: IStudentSubjectProgress) => s.masteryLevel === "MASTER").length,
    };
    
    return {
      totalStudents: students.length,
      averageScore: Math.round(avgScore),
      averageActivities: Math.round(avgActivities),
      masteryDistribution,
    };
  },
};

const StudentSubjectProgressModel = mongoose.model<IStudentSubjectProgress>(
  "StudentSubjectProgress",
  studentSubjectProgressSchema
);

export default StudentSubjectProgressModel;
