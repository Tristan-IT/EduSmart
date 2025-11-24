import * as schoolAnalyticsService from "../services/schoolAnalyticsService.js";

/**
 * School Dashboard Controller
 * Handles HTTP requests for school owner dashboard
 * All endpoints require school_owner role
 */

/**
 * Get school overview
 * GET /api/school-dashboard/overview
 */
export const getOverview = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { schoolId } = req.query;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can access this dashboard",
      });
    }

    if (!schoolId || typeof schoolId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameter: schoolId",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get overview
    const overview = await schoolAnalyticsService.getSchoolOverview(schoolId, ownerId);

    res.status(200).json({
      success: true,
      message: "School overview retrieved successfully",
      data: overview,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get teacher analytics
 * GET /api/school-dashboard/teachers
 */
export const getTeachers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { schoolId } = req.query;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can access teacher analytics",
      });
    }

    if (!schoolId || typeof schoolId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameter: schoolId",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get teacher analytics
    const teachers = await schoolAnalyticsService.getTeacherAnalytics(schoolId, ownerId);

    res.status(200).json({
      success: true,
      message: "Teacher analytics retrieved successfully",
      data: {
        teachers,
        total: teachers.length,
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
 * Get class analytics
 * GET /api/school-dashboard/classes
 */
export const getClasses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { schoolId } = req.query;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can access class analytics",
      });
    }

    if (!schoolId || typeof schoolId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameter: schoolId",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get class analytics
    const classes = await schoolAnalyticsService.getClassAnalytics(schoolId, ownerId);

    res.status(200).json({
      success: true,
      message: "Class analytics retrieved successfully",
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
 * Get student list
 * GET /api/school-dashboard/students
 */
export const getStudents = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { schoolId, classId, grade, search } = req.query;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can access student list",
      });
    }

    if (!schoolId || typeof schoolId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameter: schoolId",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Build filters
    const filters: any = {};
    if (classId && typeof classId === "string") filters.classId = classId;
    if (grade && typeof grade === "string") filters.grade = grade;
    if (search && typeof search === "string") filters.search = search;

    // Get student list
    const students = await schoolAnalyticsService.getStudentList(schoolId, ownerId, filters);

    res.status(200).json({
      success: true,
      message: "Student list retrieved successfully",
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
 * Get daily analytics timeline
 * GET /api/school-dashboard/analytics/daily
 */
export const getDailyAnalytics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { schoolId, days } = req.query;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can access analytics",
      });
    }

    if (!schoolId || typeof schoolId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameter: schoolId",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Parse days parameter
    const daysCount = days && typeof days === "string" ? parseInt(days, 10) : 7;

    // Get activity timeline
    const timeline = await schoolAnalyticsService.getActivityTimeline(
      schoolId,
      ownerId,
      daysCount
    );

    res.status(200).json({
      success: true,
      message: "Daily analytics retrieved successfully",
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
 * Get top performers
 * GET /api/school-dashboard/top-performers
 */
export const getTopPerformers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { schoolId, limit } = req.query;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can access top performers",
      });
    }

    if (!schoolId || typeof schoolId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameter: schoolId",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Parse limit parameter
    const limitCount = limit && typeof limit === "string" ? parseInt(limit, 10) : 10;

    // Get top performers
    const topPerformers = await schoolAnalyticsService.getTopPerformers(
      schoolId,
      ownerId,
      limitCount
    );

    res.status(200).json({
      success: true,
      message: "Top performers retrieved successfully",
      data: topPerformers,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get school alerts
 * GET /api/school-dashboard/alerts
 */
export const getSchoolAlerts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { schoolId } = req.query;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can access alerts",
      });
    }

    if (!schoolId || typeof schoolId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameter: schoolId",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get alerts
    const alerts = await schoolAnalyticsService.getSchoolAlerts(schoolId, ownerId);

    res.status(200).json({
      success: true,
      message: "School alerts retrieved successfully",
      data: alerts,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get school performance metrics
 * GET /api/school-dashboard/performance
 */
export const getSchoolPerformanceMetrics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { schoolId } = req.query;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can access performance metrics",
      });
    }

    if (!schoolId || typeof schoolId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameter: schoolId",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get performance metrics
    const performance = await schoolAnalyticsService.getSchoolPerformanceMetrics(schoolId, ownerId);

    res.status(200).json({
      success: true,
      message: "School performance metrics retrieved successfully",
      data: performance,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get recent activity
 * GET /api/school-dashboard/recent-activity
 */
export const getRecentActivity = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { schoolId, limit } = req.query;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can access recent activity",
      });
    }

    if (!schoolId || typeof schoolId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing required query parameter: schoolId",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Parse limit parameter
    const limitCount = limit && typeof limit === "string" ? parseInt(limit, 10) : 5;

    // Get recent activity
    const activities = await schoolAnalyticsService.getRecentActivity(schoolId, ownerId, limitCount);

    res.status(200).json({
      success: true,
      message: "Recent activity retrieved successfully",
      data: activities,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
