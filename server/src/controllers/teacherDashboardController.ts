import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authenticate.js";
import * as teacherAnalyticsService from "../services/teacherAnalyticsService.js";

/**
 * Teacher Dashboard Controller
 * Handles HTTP requests for teacher dashboard
 * All endpoints require teacher role
 */

/**
 * Get teacher's personal analytics
 * GET /api/teacher-dashboard/my-analytics
 */
export const getMyAnalytics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const teacherId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only teachers can access this endpoint",
      });
    }

    if (!teacherId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get analytics
    const analytics = await teacherAnalyticsService.getMyAnalytics(teacherId);

    res.status(200).json({
      success: true,
      message: "Teacher analytics retrieved successfully",
      data: analytics,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get teacher's assigned classes
 * GET /api/teacher-dashboard/my-classes
 */
export const getMyClasses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const teacherId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only teachers can access this endpoint",
      });
    }

    if (!teacherId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get classes
    const classes = await teacherAnalyticsService.getMyClasses(teacherId);

    res.status(200).json({
      success: true,
      message: "Teacher classes retrieved successfully",
      data: {
        classes,
        total: classes.length,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all students across teacher's classes
 * GET /api/teacher-dashboard/my-students
 */
export const getMyStudents = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const teacherId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only teachers can access this endpoint",
      });
    }

    if (!teacherId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get students
    const students = await teacherAnalyticsService.getMyStudents(teacherId);

    res.status(200).json({
      success: true,
      message: "Teacher students retrieved successfully",
      data: {
        students,
        total: students.length,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get students in a specific class
 * GET /api/teacher-dashboard/class/:classId/students
 */
export const getClassStudents = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only teachers can access this endpoint",
      });
    }

    if (!teacherId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get students
    const students = await teacherAnalyticsService.getClassStudents(teacherId, classId);

    res.status(200).json({
      success: true,
      message: "Class students retrieved successfully",
      data: {
        students,
        total: students.length,
        classId,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Track teacher activity
 * POST /api/teacher-dashboard/track-activity
 */
export const trackActivity = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      lessonsPlanned,
      lessonsCompleted,
      quizzesCreated,
      assignmentsCreated,
      videosUploaded,
      studentEngagementRate,
    } = req.body;
    const teacherId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only teachers can track activity",
      });
    }

    if (!teacherId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Track activity
    await teacherAnalyticsService.trackTeacherActivity(teacherId, {
      lessonsPlanned,
      lessonsCompleted,
      quizzesCreated,
      assignmentsCreated,
      videosUploaded,
      studentEngagementRate,
    });

    res.status(200).json({
      success: true,
      message: "Activity tracked successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get teacher's activity timeline
 * GET /api/teacher-dashboard/activity-timeline
 */
export const getActivityTimeline = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { days } = req.query;
    const teacherId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only teachers can access this endpoint",
      });
    }

    if (!teacherId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Parse days parameter
    const daysCount = days && typeof days === "string" ? parseInt(days, 10) : 7;

    // Get timeline
    const timeline = await teacherAnalyticsService.getMyActivityTimeline(
      teacherId,
      daysCount
    );

    res.status(200).json({
      success: true,
      message: "Activity timeline retrieved successfully",
      data: {
        timeline,
        days: daysCount,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update class progress
 * PUT /api/teacher-dashboard/class/:classId/progress
 */
export const updateClassProgress = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;
    const { topic, completionPercentage, notes } = req.body;
    const teacherId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only teachers can update class progress",
      });
    }

    if (!teacherId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Update progress
    const result = await teacherAnalyticsService.updateClassProgress(teacherId, classId, {
      topic,
      completionPercentage,
      notes,
    });

    res.status(200).json({
      success: true,
      message: "Class progress updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
