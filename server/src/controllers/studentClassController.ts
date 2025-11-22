import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authenticate.js";
import * as studentClassService from "../services/studentClassService.js";

/**
 * Student Class Controller
 * Handles student class-related requests
 * All endpoints require student role
 */

/**
 * Get student's class details
 * GET /api/student-class/my-class
 */
export const getMyClass = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "student") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only students can access this endpoint",
      });
    }

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get class details
    const classDetails = await studentClassService.getMyClass(studentId);

    res.status(200).json({
      success: true,
      message: "Class details retrieved successfully",
      data: classDetails,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get student's classmates
 * GET /api/student-class/my-classmates
 */
export const getMyClassmates = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "student") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only students can access this endpoint",
      });
    }

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get classmates
    const classmates = await studentClassService.getMyClassmates(studentId);

    res.status(200).json({
      success: true,
      message: "Classmates retrieved successfully",
      data: {
        classmates,
        total: classmates.length,
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
 * Get class leaderboard
 * GET /api/student-class/class-leaderboard
 */
export const getClassLeaderboard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit } = req.query;
    const studentId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "student") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only students can access this endpoint",
      });
    }

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Parse limit
    const limitCount = limit && typeof limit === "string" ? parseInt(limit, 10) : 10;

    // Get leaderboard
    const leaderboard = await studentClassService.getClassLeaderboard(studentId, limitCount);

    res.status(200).json({
      success: true,
      message: "Class leaderboard retrieved successfully",
      data: leaderboard,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get class assignments
 * GET /api/student-class/class-assignments
 */
export const getClassAssignments = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "student") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only students can access this endpoint",
      });
    }

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get assignments
    const assignments = await studentClassService.getClassAssignments(studentId);

    res.status(200).json({
      success: true,
      message: "Class assignments retrieved successfully",
      data: {
        assignments,
        total: assignments.length,
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
 * Get my class rank
 * GET /api/student-class/my-rank
 */
export const getMyClassRank = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "student") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only students can access this endpoint",
      });
    }

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get rank
    const rankData = await studentClassService.getMyClassRank(studentId);

    res.status(200).json({
      success: true,
      message: "Class rank retrieved successfully",
      data: rankData,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Compare class rank vs school rank
 * GET /api/student-class/compare-ranks
 */
export const compareRanks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const studentId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "student") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only students can access this endpoint",
      });
    }

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Compare ranks
    const comparison = await studentClassService.compareRanks(studentId);

    res.status(200).json({
      success: true,
      message: "Rank comparison retrieved successfully",
      data: comparison,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
