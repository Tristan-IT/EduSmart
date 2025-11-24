import NotificationModel from "../models/Notification.js";
import type { Types } from "mongoose";
import type { NotificationType, NotificationCategory, NotificationPriority } from "../models/Notification.js";

interface CreateNotificationParams {
  recipient: Types.ObjectId | string;
  recipientRole: "student" | "teacher" | "school_owner";
  sender?: Types.ObjectId | string;
  type: NotificationType;
  category: NotificationCategory;
  priority?: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

/**
 * Notification Service
 * Helper functions to create notifications from anywhere in the app
 */

/**
 * Create a single notification
 */
export async function createNotification(params: CreateNotificationParams) {
    try {
      return await NotificationModel.create({
        ...params,
        priority: params.priority || "medium",
        type: params.type || "info"
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

/**
 * Create notifications for multiple recipients
 */
export async function notifyMultipleUsers(
  recipients: Array<{ userId: Types.ObjectId | string; role: "student" | "teacher" | "school_owner" }>,
  notificationData: Omit<CreateNotificationParams, "recipient" | "recipientRole">
) {
  try {
    const notifications = recipients.map(recipient => ({
      recipient: recipient.userId,
      recipientRole: recipient.role,
      ...notificationData,
      priority: notificationData.priority || "medium"
    }));

    return await NotificationModel.insertMany(notifications);
  } catch (error) {
    console.error("Error creating bulk notifications:", error);
    throw error;
  }
}

/**
 * Notify all students in a class
 */
export async function notifyClassStudents(
  studentIds: Types.ObjectId[],
  notificationData: Omit<CreateNotificationParams, "recipient" | "recipientRole">
) {
  const recipients = studentIds.map(id => ({ userId: id, role: "student" as const }));
  return notifyMultipleUsers(recipients, notificationData);
}

/**
 * Notify all teachers in a school
 */
export async function notifySchoolTeachers(
  teacherIds: Types.ObjectId[],
  notificationData: Omit<CreateNotificationParams, "recipient" | "recipientRole">
) {
  const recipients = teacherIds.map(id => ({ userId: id, role: "teacher" as const }));
  return notifyMultipleUsers(recipients, notificationData);
}

/**
 * Student achievement notification
 */
export async function notifyAchievement(
  studentId: Types.ObjectId | string,
  achievementName: string,
  achievementDescription: string
) {
  return createNotification({
      recipient: studentId,
      recipientRole: "student",
      type: "success",
      category: "achievement",
      priority: "medium",
      title: `🏆 Pencapaian Baru: ${achievementName}`,
      message: achievementDescription,
      actionUrl: "/student/achievements"
    });
}

/**
 * Assignment notification for students
 */
export async function notifyNewAssignment(
  studentIds: Types.ObjectId[],
  teacherId: Types.ObjectId,
  assignmentTitle: string,
  dueDate: Date
) {
  return notifyClassStudents(studentIds, {
      sender: teacherId,
      type: "info",
      category: "assignment",
      priority: "high",
      title: "📝 Tugas Baru",
      message: `Tugas "${assignmentTitle}" telah diberikan. Deadline: ${dueDate.toLocaleDateString("id-ID")}`,
      actionUrl: "/student/assignments"
    });
}

/**
 * Quiz completion notification for teacher
 */
export async function notifyQuizCompleted(
  teacherId: Types.ObjectId | string,
  studentName: string,
  quizTitle: string,
  score: number
) {
  return createNotification({
      recipient: teacherId,
      recipientRole: "teacher",
      type: "info",
      category: "quiz",
      priority: "medium",
      title: "✅ Kuis Diselesaikan",
      message: `${studentName} telah menyelesaikan "${quizTitle}" dengan skor ${score}`,
      actionUrl: "/teacher/quizzes"
    });
}

/**
 * Student at-risk notification for teacher
 */
export async function notifyStudentAtRisk(
  teacherId: Types.ObjectId | string,
  studentName: string,
  reason: string
) {
  return createNotification({
      recipient: teacherId,
      recipientRole: "teacher",
      type: "warning",
      category: "student",
      priority: "urgent",
      title: "⚠️ Siswa Membutuhkan Perhatian",
      message: `${studentName} membutuhkan intervensi: ${reason}`,
      actionUrl: "/teacher/students"
    });
}

/**
 * Streak achievement notification
 */
export async function notifyStreakAchievement(
  studentId: Types.ObjectId | string,
  days: number
) {
  return createNotification({
      recipient: studentId,
      recipientRole: "student",
      type: "success",
      category: "streak",
      priority: "medium",
      title: `🔥 Streak ${days} Hari!`,
      message: `Luar biasa! Kamu telah belajar ${days} hari berturut-turut!`,
      actionUrl: "/student/dashboard"
    });
}

/**
 * Leaderboard position notification
 */
export async function notifyLeaderboardPosition(
  studentId: Types.ObjectId | string,
  position: number,
  totalStudents: number
) {
  return createNotification({
      recipient: studentId,
      recipientRole: "student",
      type: "success",
      category: "leaderboard",
      priority: "low",
      title: "🏅 Posisi Leaderboard",
      message: `Kamu berada di peringkat ${position} dari ${totalStudents} siswa!`,
      actionUrl: "/student/leaderboard"
    });
}

/**
 * System announcement for all users
 */
export async function broadcastAnnouncement(
  userIds: Array<{ userId: Types.ObjectId | string; role: "student" | "teacher" | "school_owner" }>,
  title: string,
  message: string,
  priority: NotificationPriority = "medium"
) {
  return notifyMultipleUsers(userIds, {
      type: "info",
      category: "announcement",
      priority,
      title: `📢 ${title}`,
      message
    });
}

/**
 * New teacher registration notification for school owner
 */
export async function notifyNewTeacher(
  schoolOwnerId: Types.ObjectId | string,
  teacherName: string,
  teacherId: Types.ObjectId | string
) {
  return createNotification({
      recipient: schoolOwnerId,
      recipientRole: "school_owner",
      type: "info",
      category: "teacher",
      priority: "medium",
      title: "👨‍🏫 Guru Baru Terdaftar",
      message: `${teacherName} telah mendaftar sebagai guru baru`,
      actionUrl: "/school-owner/teachers",
      metadata: { teacherId }
    });
}

/**
 * Class capacity warning for school owner
 */
export async function notifyClassCapacity(
  schoolOwnerId: Types.ObjectId | string,
  className: string,
  currentSize: number,
  maxSize: number
) {
  return createNotification({
      recipient: schoolOwnerId,
      recipientRole: "school_owner",
      type: "warning",
      category: "class",
      priority: "high",
      title: "⚠️ Kapasitas Kelas Hampir Penuh",
      message: `Kelas ${className} sudah terisi ${currentSize} dari ${maxSize} siswa`,
      actionUrl: "/school-owner/classes"
    });
}
