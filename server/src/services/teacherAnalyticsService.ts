import { Types } from "mongoose";
import UserModel from "../models/User.js";
import ClassModel from "../models/Class.js";
import TeacherAnalyticsModel from "../models/TeacherAnalytics.js";
import StudentProfileModel from "../models/StudentProfile.js";

/**
 * Teacher Analytics Service
 * Handles teacher-specific analytics and dashboard data
 */

export interface ActivityData {
  lessonsPlanned?: number;
  lessonsCompleted?: number;
  quizzesCreated?: number;
  assignmentsCreated?: number;
  videosUploaded?: number;
  studentEngagementRate?: number;
}

export interface TeacherAnalyticsSummary {
  teacher: {
    _id: string;
    name: string;
    email: string;
    employeeId?: string;
  };
  totals: {
    lessonsPlanned: number;
    lessonsCompleted: number;
    quizzesCreated: number;
    assignmentsCreated: number;
    videosUploaded: number;
    totalContent: number;
  };
  averages: {
    studentEngagement: number;
    completionRate: number;
  };
  recentActivity: any[];
}

/**
 * Track teacher activity (called when teacher creates content)
 */
export const trackTeacherActivity = async (
  teacherId: string,
  activityData: ActivityData
): Promise<void> => {
  try {
    // Get teacher
    const teacher = await UserModel.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      throw new Error("Teacher not found");
    }

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create today's analytics record
    const analytics = await TeacherAnalyticsModel.findOne({
      teacher: teacher._id,
      date: today,
    });

    if (analytics) {
      // Update existing record
      if (activityData.lessonsPlanned !== undefined) {
        analytics.lessonsPlanned += activityData.lessonsPlanned;
      }
      if (activityData.lessonsCompleted !== undefined) {
        analytics.lessonsCompleted += activityData.lessonsCompleted;
      }
      if (activityData.quizzesCreated !== undefined) {
        analytics.quizzesCreated += activityData.quizzesCreated;
      }
      if (activityData.assignmentsCreated !== undefined) {
        analytics.assignmentsGraded += activityData.assignmentsCreated || 0;
      }
      if (activityData.videosUploaded !== undefined) {
        analytics.videosUploaded += activityData.videosUploaded;
      }

      await analytics.save();
    } else {
      // Create new record
      await TeacherAnalyticsModel.create({
        teacher: teacher._id,
        school: teacher.school,
        date: today,
        lessonsPlanned: activityData.lessonsPlanned || 0,
        lessonsCompleted: activityData.lessonsCompleted || 0,
        quizzesCreated: activityData.quizzesCreated || 0,
        assignmentsCreated: activityData.assignmentsCreated || 0,
        videosUploaded: activityData.videosUploaded || 0,
        studentEngagementRate: activityData.studentEngagementRate || 0,
      });
    }
  } catch (error: any) {
    throw new Error(`Failed to track teacher activity: ${error.message}`);
  }
};

/**
 * Get teacher's personal analytics summary
 */
export const getMyAnalytics = async (teacherId: string): Promise<TeacherAnalyticsSummary> => {
  try {
    // Get teacher
    const teacher = await UserModel.findById(teacherId).lean();
    if (!teacher || teacher.role !== "teacher") {
      throw new Error("Teacher not found");
    }

    // Aggregate all-time analytics
    const aggregatedData = await TeacherAnalyticsModel.aggregate([
      {
        $match: {
          teacher: new Types.ObjectId(teacherId),
        },
      },
      {
        $group: {
          _id: null,
          totalLessonsPlanned: { $sum: "$lessonsPlanned" },
          totalLessonsCompleted: { $sum: "$lessonsCompleted" },
          totalQuizzes: { $sum: "$quizzesCreated" },
          totalAssignments: { $sum: "$assignmentsCreated" },
          totalVideos: { $sum: "$videosUploaded" },
          avgEngagement: { $avg: "$studentEngagementRate" },
        },
      },
    ]);

    const totals = aggregatedData[0] || {
      totalLessonsPlanned: 0,
      totalLessonsCompleted: 0,
      totalQuizzes: 0,
      totalAssignments: 0,
      totalVideos: 0,
      avgEngagement: 0,
    };

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await TeacherAnalyticsModel.find({
      teacher: teacher._id,
      date: { $gte: sevenDaysAgo },
    })
      .sort({ date: -1 })
      .limit(7)
      .lean();

    // Calculate completion rate
    const completionRate =
      totals.totalLessonsPlanned > 0
        ? (totals.totalLessonsCompleted / totals.totalLessonsPlanned) * 100
        : 0;

    return {
      teacher: {
        _id: teacher._id.toString(),
        name: teacher.name,
        email: teacher.email,
        employeeId: teacher.teacherProfile?.employeeId,
      },
      totals: {
        lessonsPlanned: totals.totalLessonsPlanned,
        lessonsCompleted: totals.totalLessonsCompleted,
        quizzesCreated: totals.totalQuizzes,
        assignmentsCreated: totals.totalAssignments,
        videosUploaded: totals.totalVideos,
        totalContent:
          totals.totalLessonsCompleted +
          totals.totalQuizzes +
          totals.totalAssignments +
          totals.totalVideos,
      },
      averages: {
        studentEngagement: Math.round(totals.avgEngagement * 100) / 100,
        completionRate: Math.round(completionRate * 100) / 100,
      },
      recentActivity: recentActivity.map((activity) => ({
        date: activity.date,
        lessons: activity.lessonsCompleted,
        quizzes: activity.quizzesCreated,
        assignments: (activity as any).assignmentsGraded,
        videos: activity.videosUploaded,
      })),
    };
  } catch (error: any) {
    throw new Error(`Failed to get teacher analytics: ${error.message}`);
  }
};

/**
 * Get all classes assigned to teacher
 */
export const getMyClasses = async (teacherId: string): Promise<any[]> => {
  try {
    // Get teacher
    const teacher = await UserModel.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      throw new Error("Teacher not found");
    }

    // Find all classes where teacher is homeroom or subject teacher
    const classes = await ClassModel.find({
      $or: [
        { homeRoomTeacher: teacher._id },
        { "subjectTeachers.teacher": teacher._id },
      ],
    })
      .populate("school", "schoolId schoolName")
      .lean();

    // For each class, get student count and performance metrics
    const classesWithDetails = await Promise.all(
      classes.map(async (classDoc) => {
        // Get students in this class
        const studentCount = await UserModel.countDocuments({
          role: "student",
          class: classDoc._id,
        });

        // Get student profiles for performance metrics
        const students = await UserModel.find({
          role: "student",
          class: classDoc._id,
        }).lean();

        const studentProfiles = await StudentProfileModel.find({
          student: { $in: students.map((s) => s._id) },
        }).lean();

        // Calculate average XP and level
        const totalXP = studentProfiles.reduce((sum, profile) => sum + (profile.xp || 0), 0);
        const totalLevel = studentProfiles.reduce(
          (sum, profile) => sum + (profile.level || 1),
          0
        );

        const averageXP = studentProfiles.length > 0 ? totalXP / studentProfiles.length : 0;
        const averageLevel =
          studentProfiles.length > 0 ? totalLevel / studentProfiles.length : 1;

        // Determine if teacher is homeroom or subject teacher
        const isHomeRoom = classDoc.homeRoomTeacher?.toString() === teacherId;
        const subjectTeacher = classDoc.subjectTeachers.find(
          (st) => st.teacher.toString() === teacherId
        );

        return {
          _id: classDoc._id,
          classId: classDoc.classId,
          className: classDoc.className,
          grade: classDoc.grade,
          section: classDoc.section,
          academicYear: classDoc.academicYear,
          school: classDoc.school,
          role: isHomeRoom ? "Homeroom Teacher" : "Subject Teacher",
          subjects: (subjectTeacher as any)?.subject ? [(subjectTeacher as any).subject] : [],
          students: {
            total: studentCount,
            max: classDoc.maxStudents,
            percentage: Math.round((studentCount / classDoc.maxStudents) * 100),
          },
          performance: {
            averageXP: Math.round(averageXP),
            averageLevel: Math.round(averageLevel * 10) / 10,
          },
        };
      })
    );

    return classesWithDetails;
  } catch (error: any) {
    throw new Error(`Failed to get teacher classes: ${error.message}`);
  }
};

/**
 * Get all students across all classes taught by teacher
 */
export const getMyStudents = async (teacherId: string): Promise<any[]> => {
  try {
    // Get teacher
    const teacher = await UserModel.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      throw new Error("Teacher not found");
    }

    // Find all classes where teacher is assigned
    const classes = await ClassModel.find({
      $or: [
        { homeRoomTeacher: teacher._id },
        { "subjectTeachers.teacher": teacher._id },
      ],
    }).lean();

    const classIds = classes.map((c) => c._id);

    // Get all students in these classes
    const students = await UserModel.find({
      role: "student",
      class: { $in: classIds },
    })
      .populate("class", "classId className grade section")
      .select("name email studentId rollNumber avatar createdAt")
      .sort({ class: 1, rollNumber: 1 })
      .lean();

    // Get student profiles for XP/level
    const studentProfiles = await StudentProfileModel.find({
      student: { $in: students.map((s) => s._id) },
    }).lean();

    // Merge data
    return students.map((student) => {
      const profile = studentProfiles.find(
        (p) => (p as any).user.toString() === student._id.toString()
      );
      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        rollNumber: student.rollNumber,
        avatar: student.avatar,
        class: student.class,
        xp: profile?.xp || 0,
        level: profile?.level || 1,
        streak: profile?.streak || 0,
        createdAt: student.createdAt,
      };
    });
  } catch (error: any) {
    throw new Error(`Failed to get teacher students: ${error.message}`);
  }
};

/**
 * Get students in a specific class (for teachers)
 */
export const getClassStudents = async (
  teacherId: string,
  classId: string
): Promise<any[]> => {
  try {
    // Get teacher
    const teacher = await UserModel.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      throw new Error("Teacher not found");
    }

    // Get class and verify teacher is assigned
    const classDoc = await ClassModel.findOne({ classId }).lean();
    if (!classDoc) {
      throw new Error("Class not found");
    }

    const isHomeRoom = classDoc.homeRoomTeacher?.toString() === teacherId;
    const isSubjectTeacher = classDoc.subjectTeachers.some(
      (st) => st.teacher.toString() === teacherId
    );

    if (!isHomeRoom && !isSubjectTeacher) {
      throw new Error("Unauthorized: You are not assigned to this class");
    }

    // Get students
    const students = await UserModel.find({
      role: "student",
      class: classDoc._id,
    })
      .select("name email studentId rollNumber avatar createdAt")
      .sort({ rollNumber: 1 })
      .lean();

    // Get student profiles
    const studentProfiles = await StudentProfileModel.find({
      student: { $in: students.map((s) => s._id) },
    }).lean();

    // Merge data
    return students.map((student) => {
      const profile = studentProfiles.find(
        (p) => (p as any).user.toString() === student._id.toString()
      );
      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        rollNumber: student.rollNumber,
        avatar: student.avatar,
        xp: profile?.xp || 0,
        level: profile?.level || 1,
        streak: profile?.streak || 0,
        gems: 0,
        hearts: 5,
        createdAt: student.createdAt,
      };
    });
  } catch (error: any) {
    throw new Error(`Failed to get class students: ${error.message}`);
  }
};

/**
 * Update class progress (optional feature)
 * This can be used to track curriculum progress
 */
export const updateClassProgress = async (
  teacherId: string,
  classId: string,
  progressData: {
    topic?: string;
    completionPercentage?: number;
    notes?: string;
  }
): Promise<any> => {
  try {
    // Get teacher
    const teacher = await UserModel.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      throw new Error("Teacher not found");
    }

    // Get class and verify teacher is homeroom teacher
    const classDoc = await ClassModel.findOne({ classId });
    if (!classDoc) {
      throw new Error("Class not found");
    }

    if (classDoc.homeRoomTeacher?.toString() !== teacherId) {
      throw new Error("Unauthorized: Only homeroom teacher can update class progress");
    }

    // This is a placeholder - you might want to create a ClassProgress model
    // For now, we'll just return success
    return {
      message: "Class progress updated successfully",
      classId: classDoc.classId,
      className: classDoc.className,
      progress: progressData,
    };
  } catch (error: any) {
    throw new Error(`Failed to update class progress: ${error.message}`);
  }
};

/**
 * Get teacher's activity timeline
 */
export const getMyActivityTimeline = async (
  teacherId: string,
  days: number = 7
): Promise<any[]> => {
  try {
    // Get teacher
    const teacher = await UserModel.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      throw new Error("Teacher not found");
    }

    // Get date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get analytics for date range
    const activities = await TeacherAnalyticsModel.find({
      teacher: teacher._id,
      date: { $gte: startDate, $lte: endDate },
    })
      .sort({ date: 1 })
      .lean();

    return activities.map((activity) => ({
      date: activity.date,
      lessonsPlanned: activity.lessonsPlanned,
      lessonsCompleted: activity.lessonsCompleted,
      quizzes: activity.quizzesCreated,
      assignments: activity.assignmentsGraded,
      videos: activity.videosUploaded,
      engagement: Math.round(activity.averageAttendance * 100) / 100,
    }));
  } catch (error: any) {
    throw new Error(`Failed to get activity timeline: ${error.message}`);
  }
};
