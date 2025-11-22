import mongoose, { Types } from "mongoose";
import StudentSubjectProgressModel from "../models/StudentSubjectProgress.js";
import type { IStudentSubjectProgress } from "../models/StudentSubjectProgress.js";
import { UserModel } from "../models/User.js";

/**
 * Progress Service
 * Handles StudentSubjectProgress tracking and analytics
 */

/**
 * Get or create StudentSubjectProgress for a student in a subject
 */
export async function getOrCreateProgress(
  studentId: string | Types.ObjectId,
  subjectId: string | Types.ObjectId
): Promise<IStudentSubjectProgress> {
  try {
    const student = await UserModel.findById(studentId).select("class school");
    if (!student || !student.class || !student.school) {
      throw new Error("Student, class, or school not found");
    }

    // Find existing progress
    let progress = await StudentSubjectProgressModel.findOne({
      student: studentId,
      subject: subjectId,
    });

    // Create if not exists
    if (!progress) {
      progress = await StudentSubjectProgressModel.create({
        student: studentId,
        subject: subjectId,
        class: student.class,
        school: student.school,
        totalLessonsCompleted: 0,
        totalQuizzesCompleted: 0,
        totalExercisesCompleted: 0,
        totalAssignmentsCompleted: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        totalXPEarned: 0,
        totalTimeSpent: 0,
        lastActivityAt: new Date(),
        weakTopics: [],
        strongTopics: [],
        recentScores: [],
        masteryLevel: "BEGINNER",
        masteryPercentage: 0,
        streakDays: 0,
      });
    }

    return progress;
  } catch (error) {
    console.error("Error getting or creating progress:", error);
    throw error;
  }
}

/**
 * Update progress when a lesson is completed
 */
export async function updateLessonProgress(
  studentId: string | Types.ObjectId,
  subjectId: string | Types.ObjectId,
  data: {
    timeSpent?: number; // in minutes
    xpEarned?: number;
  }
): Promise<IStudentSubjectProgress> {
  try {
    const progress = await getOrCreateProgress(studentId, subjectId);

    // Update counters
    progress.totalLessonsCompleted += 1;
    progress.lastActivityAt = new Date();

    // Update time spent
    if (data.timeSpent) {
      progress.totalTimeSpent += data.timeSpent;
    }

    // Update XP
    if (data.xpEarned) {
      progress.totalXPEarned += data.xpEarned;
    }

    // Update streak
    await updateStreak(progress);

    // Recalculate mastery
    await calculateMastery(progress);

    await progress.save();
    return progress;
  } catch (error) {
    console.error("Error updating lesson progress:", error);
    throw error;
  }
}

/**
 * Update progress when a quiz is completed
 */
export async function updateQuizProgress(
  studentId: string | Types.ObjectId,
  subjectId: string | Types.ObjectId,
  data: {
    score: number; // 0-100
    topicId?: string;
    timeSpent?: number; // in seconds
    xpEarned?: number;
  }
): Promise<IStudentSubjectProgress> {
  try {
    const progress = await getOrCreateProgress(studentId, subjectId);

    // Update counters
    progress.totalQuizzesCompleted += 1;
    progress.lastActivityAt = new Date();

    // Update time spent (convert seconds to minutes)
    if (data.timeSpent) {
      progress.totalTimeSpent += Math.round(data.timeSpent / 60);
    }

    // Update XP
    if (data.xpEarned) {
      progress.totalXPEarned += data.xpEarned;
    }

    // Add to recent scores (keep last 10)
    progress.recentScores.push(data.score);
    if (progress.recentScores.length > 10) {
      progress.recentScores = progress.recentScores.slice(-10);
    }

    // Update average score
    const allScores = progress.recentScores;
    if (allScores.length > 0) {
      progress.averageScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    }

    // Update highest/lowest scores
    if (data.score > progress.highestScore) {
      progress.highestScore = data.score;
    }
    if (progress.lowestScore === 0 || data.score < progress.lowestScore) {
      progress.lowestScore = data.score;
    }

    // Update weak/strong topics
    if (data.topicId) {
      await updateTopicStrengths(progress, data.topicId, data.score);
    }

    // Update streak
    await updateStreak(progress);

    // Recalculate mastery
    await calculateMastery(progress);

    await progress.save();
    return progress;
  } catch (error) {
    console.error("Error updating quiz progress:", error);
    throw error;
  }
}

/**
 * Update progress when an exercise is completed
 */
export async function updateExerciseProgress(
  studentId: string | Types.ObjectId,
  subjectId: string | Types.ObjectId,
  data: {
    score?: number; // 0-100
    timeSpent?: number; // in minutes
    xpEarned?: number;
  }
): Promise<IStudentSubjectProgress> {
  try {
    const progress = await getOrCreateProgress(studentId, subjectId);

    // Update counters
    progress.totalExercisesCompleted += 1;
    progress.lastActivityAt = new Date();

    // Update time spent
    if (data.timeSpent) {
      progress.totalTimeSpent += data.timeSpent;
    }

    // Update XP
    if (data.xpEarned) {
      progress.totalXPEarned += data.xpEarned;
    }

    // Update scores if provided
    if (data.score !== undefined) {
      progress.recentScores.push(data.score);
      if (progress.recentScores.length > 10) {
        progress.recentScores = progress.recentScores.slice(-10);
      }

      // Recalculate average
      const allScores = progress.recentScores;
      if (allScores.length > 0) {
        progress.averageScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
      }
    }

    // Update streak
    await updateStreak(progress);

    // Recalculate mastery
    await calculateMastery(progress);

    await progress.save();
    return progress;
  } catch (error) {
    console.error("Error updating exercise progress:", error);
    throw error;
  }
}

/**
 * Update progress when an assignment is completed
 */
export async function updateAssignmentProgress(
  studentId: string | Types.ObjectId,
  subjectId: string | Types.ObjectId,
  data: {
    score: number; // 0-100
    timeSpent?: number; // in minutes
    xpEarned?: number;
  }
): Promise<IStudentSubjectProgress> {
  try {
    const progress = await getOrCreateProgress(studentId, subjectId);

    // Update counters
    progress.totalAssignmentsCompleted += 1;
    progress.lastActivityAt = new Date();

    // Update time spent
    if (data.timeSpent) {
      progress.totalTimeSpent += data.timeSpent;
    }

    // Update XP
    if (data.xpEarned) {
      progress.totalXPEarned += data.xpEarned;
    }

    // Add to recent scores
    progress.recentScores.push(data.score);
    if (progress.recentScores.length > 10) {
      progress.recentScores = progress.recentScores.slice(-10);
    }

    // Update average score
    const allScores = progress.recentScores;
    if (allScores.length > 0) {
      progress.averageScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    }

    // Update highest/lowest scores
    if (data.score > progress.highestScore) {
      progress.highestScore = data.score;
    }
    if (progress.lowestScore === 0 || data.score < progress.lowestScore) {
      progress.lowestScore = data.score;
    }

    // Update streak
    await updateStreak(progress);

    // Recalculate mastery
    await calculateMastery(progress);

    await progress.save();
    return progress;
  } catch (error) {
    console.error("Error updating assignment progress:", error);
    throw error;
  }
}

/**
 * Get all progress records for a student
 */
export async function getStudentProgress(
  studentId: string | Types.ObjectId,
  filters?: {
    subjectId?: string | Types.ObjectId;
    classId?: string | Types.ObjectId;
  }
): Promise<IStudentSubjectProgress[]> {
  try {
    const query: any = { student: studentId };

    if (filters?.subjectId) {
      query.subject = filters.subjectId;
    }

    if (filters?.classId) {
      query.class = filters.classId;
    }

    const progress = await StudentSubjectProgressModel.find(query)
      .populate("subject", "name code color icon category")
      .populate("class", "name grade")
      .sort({ lastActivityAt: -1 });

    return progress;
  } catch (error) {
    console.error("Error getting student progress:", error);
    throw error;
  }
}

/**
 * Get class-wide progress for a subject (for teacher analytics)
 */
export async function getClassSubjectProgress(
  classId: string | Types.ObjectId,
  subjectId: string | Types.ObjectId
): Promise<IStudentSubjectProgress[]> {
  try {
    const progress = await StudentSubjectProgressModel.find({
      class: classId,
      subject: subjectId,
    })
      .populate("student", "name email avatar")
      .sort({ averageScore: -1 });

    return progress;
  } catch (error) {
    console.error("Error getting class subject progress:", error);
    throw error;
  }
}

/**
 * Get school-wide progress for a subject (for school owner analytics)
 */
export async function getSchoolSubjectProgress(
  schoolId: string | Types.ObjectId,
  subjectId?: string | Types.ObjectId
): Promise<IStudentSubjectProgress[]> {
  try {
    const query: any = { school: schoolId };

    if (subjectId) {
      query.subject = subjectId;
    }

    const progress = await StudentSubjectProgressModel.find(query)
      .populate("student", "name email")
      .populate("subject", "name code color")
      .populate("class", "name grade")
      .sort({ averageScore: -1 });

    return progress;
  } catch (error) {
    console.error("Error getting school subject progress:", error);
    throw error;
  }
}

/**
 * Helper: Update topic strengths based on quiz performance
 */
async function updateTopicStrengths(
  progress: IStudentSubjectProgress,
  topicId: string,
  score: number
): Promise<void> {
  // Weak topic: score < 60%
  if (score < 60) {
    if (!progress.weakTopics.includes(topicId)) {
      progress.weakTopics.push(topicId);
    }
    // Remove from strong topics if present
    progress.strongTopics = progress.strongTopics.filter((t) => t !== topicId);
  }
  // Strong topic: score > 80%
  else if (score > 80) {
    if (!progress.strongTopics.includes(topicId)) {
      progress.strongTopics.push(topicId);
    }
    // Remove from weak topics if present
    progress.weakTopics = progress.weakTopics.filter((t) => t !== topicId);
  }
  // Middle ground: remove from both if score is 60-80%
  else {
    progress.weakTopics = progress.weakTopics.filter((t) => t !== topicId);
    progress.strongTopics = progress.strongTopics.filter((t) => t !== topicId);
  }
}

/**
 * Helper: Update streak days
 */
async function updateStreak(progress: IStudentSubjectProgress): Promise<void> {
  const now = new Date();
  const lastStreak = progress.lastStreakDate;

  if (!lastStreak) {
    // First activity
    progress.streakDays = 1;
    progress.lastStreakDate = now;
  } else {
    const lastStreakDate = new Date(lastStreak);
    const daysSinceLastActivity = Math.floor(
      (now.getTime() - lastStreakDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastActivity === 0) {
      // Same day, no change
      return;
    } else if (daysSinceLastActivity === 1) {
      // Consecutive day, increment streak
      progress.streakDays += 1;
      progress.lastStreakDate = now;
    } else {
      // Streak broken, reset to 1
      progress.streakDays = 1;
      progress.lastStreakDate = now;
    }
  }
}

/**
 * Helper: Calculate mastery level and percentage
 */
async function calculateMastery(progress: IStudentSubjectProgress): Promise<void> {
  // Mastery based on multiple factors:
  // 1. Average score (40% weight)
  // 2. Total activities completed (30% weight)
  // 3. Streak days (15% weight)
  // 4. Strong vs weak topics ratio (15% weight)

  let masteryScore = 0;

  // Factor 1: Average score (0-40 points)
  masteryScore += (progress.averageScore / 100) * 40;

  // Factor 2: Total activities (0-30 points)
  const totalActivities =
    progress.totalLessonsCompleted +
    progress.totalQuizzesCompleted +
    progress.totalExercisesCompleted +
    progress.totalAssignmentsCompleted;

  // Cap at 50 activities for full points
  const activityScore = Math.min(totalActivities / 50, 1) * 30;
  masteryScore += activityScore;

  // Factor 3: Streak days (0-15 points)
  // Cap at 30 days for full points
  const streakScore = Math.min(progress.streakDays / 30, 1) * 15;
  masteryScore += streakScore;

  // Factor 4: Topic strength ratio (0-15 points)
  const totalTopics = progress.weakTopics.length + progress.strongTopics.length;
  if (totalTopics > 0) {
    const strengthRatio = progress.strongTopics.length / totalTopics;
    masteryScore += strengthRatio * 15;
  }

  // Set mastery percentage
  progress.masteryPercentage = Math.round(masteryScore);

  // Set mastery level based on percentage
  if (masteryScore >= 80) {
    progress.masteryLevel = "MASTER";
  } else if (masteryScore >= 60) {
    progress.masteryLevel = "ADVANCED";
  } else if (masteryScore >= 30) {
    progress.masteryLevel = "INTERMEDIATE";
  } else {
    progress.masteryLevel = "BEGINNER";
  }
}

/**
 * Get progress statistics for a subject across all students in a school
 */
export async function getSubjectStatistics(
  schoolId: string | Types.ObjectId,
  subjectId: string | Types.ObjectId
): Promise<{
  totalStudents: number;
  averageScore: number;
  averageMastery: number;
  completionRate: number;
  topPerformers: Array<{ studentName: string; score: number; masteryLevel: string }>;
  strugglingStudents: Array<{ studentName: string; score: number; weakTopics: string[] }>;
}> {
  try {
    const progressRecords = await StudentSubjectProgressModel.find({
      school: schoolId,
      subject: subjectId,
    }).populate("student", "name");

    const totalStudents = progressRecords.length;
    
    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        averageMastery: 0,
        completionRate: 0,
        topPerformers: [],
        strugglingStudents: [],
      };
    }

    // Calculate averages
    const totalScore = progressRecords.reduce((sum: number, p: any) => sum + p.averageScore, 0);
    const totalMastery = progressRecords.reduce((sum: number, p: any) => sum + p.masteryPercentage, 0);
    const averageScore = totalScore / totalStudents;
    const averageMastery = totalMastery / totalStudents;

    // Calculate completion rate (students with at least 1 activity)
    const activeStudents = progressRecords.filter(
      (p: any) =>
        p.totalLessonsCompleted > 0 ||
        p.totalQuizzesCompleted > 0 ||
        p.totalExercisesCompleted > 0 ||
        p.totalAssignmentsCompleted > 0
    ).length;
    const completionRate = (activeStudents / totalStudents) * 100;

    // Get top performers (top 5 by average score)
    const topPerformers = progressRecords
      .sort((a: any, b: any) => b.averageScore - a.averageScore)
      .slice(0, 5)
      .map((p: any) => ({
        studentName: (p.student as any).name || "Unknown",
        score: p.averageScore,
        masteryLevel: p.masteryLevel,
      }));

    // Get struggling students (bottom 5 with score < 50)
    const strugglingStudents = progressRecords
      .filter((p: any) => p.averageScore < 50)
      .sort((a: any, b: any) => a.averageScore - b.averageScore)
      .slice(0, 5)
      .map((p: any) => ({
        studentName: (p.student as any).name || "Unknown",
        score: p.averageScore,
        weakTopics: p.weakTopics,
      }));

    return {
      totalStudents,
      averageScore: Math.round(averageScore),
      averageMastery: Math.round(averageMastery),
      completionRate: Math.round(completionRate),
      topPerformers,
      strugglingStudents,
    };
  } catch (error) {
    console.error("Error getting subject statistics:", error);
    throw error;
  }
}
