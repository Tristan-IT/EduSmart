import { Request, Response } from "express";
import {
  getSkillTree,
  getUserSkillTree,
  completeNode,
  getNextAvailableNodes,
  calculateTreeProgress,
} from "../services/skillTreeService.js";
import {
  validateNodeAccess,
  checkPrerequisites,
  getAccessibleNodes,
  validateQuizAccess,
  getPrerequisiteChain,
} from "../utils/prerequisiteValidator.js";
import {
  calculateNodeMetrics,
  applyDifficultyAdjustment,
  getCalibrationSuggestions,
  autoCalibrate,
  getDifficultyDistribution,
} from "../services/difficultyCalibrationService.js";
import {
  getPathAnalytics,
  getStudentPathProgress,
  getSubjectComparison,
  getTrendingPaths,
} from "../services/pathAnalyticsService.js";
import UserModel from "../models/User.js";

/**
 * Get full skill tree with optional filters
 * GET /api/skill-tree?gradeLevel=SD&classNumber=4&semester=1&subject=Matematika
 */
export async function getSkillTreeController(req: Request, res: Response) {
  try {
    const { gradeLevel, classNumber, semester, subject, curriculum } = req.query;
    
    // Build filter object
    const filters: any = {};
    if (gradeLevel) filters.gradeLevel = gradeLevel;
    if (classNumber) filters.classNumber = Number(classNumber);
    if (semester) filters.semester = Number(semester);
    if (subject) filters.subject = subject;
    if (curriculum) filters.curriculum = curriculum;

    const nodes = await getSkillTree(filters);

    return res.json({
      success: true,
      nodes,
      filters,
      total: nodes.length
    });
  } catch (error) {
    console.error("Error getting skill tree:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get skill tree",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get user's personalized skill tree
 * GET /api/skill-tree/user
 */
export async function getUserSkillTreeController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;

    const skillTree = await getUserSkillTree(userId);

    return res.json({
      success: true,
      skillTree,
    });
  } catch (error) {
    console.error("Error getting user skill tree:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get user skill tree",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Complete a node
 * POST /api/skill-tree/node/:nodeId/complete
 */
export async function completeNodeController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const { nodeId } = req.params;
    const { score } = req.body;

    if (score === undefined || score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid score. Must be between 0-100",
      });
    }

    const result = await completeNode(userId, nodeId, score);

    return res.json(result);
  } catch (error) {
    console.error("Error completing node:", error);
    
    if (error instanceof Error && error.message === "Node not found") {
      return res.status(404).json({
        success: false,
        message: "Node not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to complete node",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get next available nodes
 * GET /api/skill-tree/next
 */
export async function getNextAvailableNodesController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;

    const nodes = await getNextAvailableNodes(userId);

    return res.json({
      success: true,
      nodes,
    });
  } catch (error) {
    console.error("Error getting next available nodes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get next available nodes",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get skill tree progress
 * GET /api/skill-tree/progress
 */
export async function getTreeProgressController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;

    const progress = await calculateTreeProgress(userId);

    return res.json({
      success: true,
      ...progress,
    });
  } catch (error) {
    console.error("Error getting tree progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get tree progress",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Validate node access for a user
 * GET /api/skill-tree/validate/:nodeId
 */
export async function validateNodeAccessController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const { nodeId } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const validation = await validateNodeAccess(userId, nodeId, user.level || 1);

    return res.json({
      success: true,
      validation
    });
  } catch (error) {
    console.error("Error validating node access:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to validate node access",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Check prerequisites for a specific node
 * GET /api/skill-tree/prerequisites/:nodeId
 */
export async function checkPrerequisitesController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const { nodeId } = req.params;

    const prerequisiteCheck = await checkPrerequisites(userId, nodeId);

    return res.json({
      success: true,
      prerequisiteCheck
    });
  } catch (error) {
    console.error("Error checking prerequisites:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check prerequisites",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get accessible, locked, and completed nodes
 * GET /api/skill-tree/accessible?subject=mathematics
 */
export async function getAccessibleNodesController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const { subject } = req.query;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const result = await getAccessibleNodes(
      userId,
      user.level || 1,
      subject as string | undefined
    );

    return res.json({
      success: true,
      ...result,
      counts: {
        accessible: result.accessible.length,
        locked: result.locked.length,
        completed: result.completed.length,
        total: result.accessible.length + result.locked.length + result.completed.length
      }
    });
  } catch (error) {
    console.error("Error getting accessible nodes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get accessible nodes",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Validate quiz access for a node
 * GET /api/skill-tree/validate-quiz/:nodeId
 */
export async function validateQuizAccessController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const { nodeId } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const validation = await validateQuizAccess(userId, nodeId, user.level || 1);

    return res.json({
      success: true,
      validation
    });
  } catch (error) {
    console.error("Error validating quiz access:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to validate quiz access",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get prerequisite chain for a node
 * GET /api/skill-tree/prerequisite-chain/:nodeId
 */
export async function getPrerequisiteChainController(req: Request, res: Response) {
  try {
    const { nodeId } = req.params;

    const chain = await getPrerequisiteChain(nodeId);

    return res.json({
      success: true,
      chain,
      depth: chain.length
    });
  } catch (error) {
    console.error("Error getting prerequisite chain:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get prerequisite chain",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get performance metrics for a node
 * GET /api/skill-tree/nodes/:nodeId/metrics
 */
export async function getNodeMetricsController(req: Request, res: Response) {
  try {
    const { nodeId } = req.params;

    const metrics = await calculateNodeMetrics(nodeId);

    return res.json({
      success: true,
      metrics
    });
  } catch (error) {
    console.error("Error getting node metrics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get node metrics",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Apply difficulty adjustment to a node
 * PATCH /api/skill-tree/nodes/:nodeId/calibrate
 */
export async function calibrateNodeController(req: Request, res: Response) {
  try {
    const { nodeId } = req.params;
    const { newDifficulty, autoAdjustRewards } = req.body;

    if (!newDifficulty) {
      return res.status(400).json({
        success: false,
        message: "newDifficulty is required"
      });
    }

    const adjustment = await applyDifficultyAdjustment(
      nodeId,
      newDifficulty,
      autoAdjustRewards !== false
    );

    return res.json({
      success: true,
      adjustment
    });
  } catch (error) {
    console.error("Error calibrating node:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to calibrate node",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get calibration suggestions
 * GET /api/skill-tree/calibration/suggestions?subject=Math&minStudents=10
 */
export async function getCalibrationSuggestionsController(req: Request, res: Response) {
  try {
    const { subject, minStudents } = req.query;

    const suggestions = await getCalibrationSuggestions(
      subject as string | undefined,
      minStudents ? Number(minStudents) : 10
    );

    return res.json({
      success: true,
      suggestions,
      count: suggestions.length
    });
  } catch (error) {
    console.error("Error getting calibration suggestions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get calibration suggestions",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Auto-calibrate nodes
 * POST /api/skill-tree/calibration/auto
 */
export async function autoCalibrationController(req: Request, res: Response) {
  try {
    const { subject, minStudents, dryRun } = req.body;

    const adjustments = await autoCalibrate(
      subject,
      minStudents || 20,
      dryRun === true
    );

    return res.json({
      success: true,
      adjustments,
      count: adjustments.length,
      dryRun: dryRun === true
    });
  } catch (error) {
    console.error("Error in auto-calibration:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to auto-calibrate",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get difficulty distribution
 * GET /api/skill-tree/calibration/distribution?subject=Math
 */
export async function getDifficultyDistributionController(req: Request, res: Response) {
  try {
    const { subject } = req.query;

    const distribution = await getDifficultyDistribution(subject as string | undefined);

    return res.json({
      success: true,
      ...distribution
    });
  } catch (error) {
    console.error("Error getting difficulty distribution:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get difficulty distribution",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get path analytics
 * GET /api/skill-tree/analytics/path?gradeLevel=SD&classNumber=4&semester=1&subject=Math
 */
export async function getPathAnalyticsController(req: Request, res: Response) {
  try {
    const { gradeLevel, classNumber, semester, subject } = req.query;

    if (!gradeLevel || !classNumber || !semester || !subject) {
      return res.status(400).json({
        success: false,
        message: "gradeLevel, classNumber, semester, and subject are required"
      });
    }

    const analytics = await getPathAnalytics(
      gradeLevel as string,
      Number(classNumber),
      Number(semester),
      subject as string
    );

    return res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error("Error getting path analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get path analytics",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get student progress for a path
 * GET /api/skill-tree/analytics/students?gradeLevel=SD&classNumber=4&semester=1&subject=Math
 */
export async function getStudentPathProgressController(req: Request, res: Response) {
  try {
    const { gradeLevel, classNumber, semester, subject } = req.query;

    if (!gradeLevel || !classNumber || !semester || !subject) {
      return res.status(400).json({
        success: false,
        message: "gradeLevel, classNumber, semester, and subject are required"
      });
    }

    const progress = await getStudentPathProgress(
      gradeLevel as string,
      Number(classNumber),
      Number(semester),
      subject as string
    );

    return res.json({
      success: true,
      students: progress,
      count: progress.length
    });
  } catch (error) {
    console.error("Error getting student path progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get student path progress",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get subject comparison
 * GET /api/skill-tree/analytics/comparison?gradeLevel=SD&classNumber=4&semester=1
 */
export async function getSubjectComparisonController(req: Request, res: Response) {
  try {
    const { gradeLevel, classNumber, semester } = req.query;

    if (!gradeLevel || !classNumber || !semester) {
      return res.status(400).json({
        success: false,
        message: "gradeLevel, classNumber, and semester are required"
      });
    }

    const comparison = await getSubjectComparison(
      gradeLevel as string,
      Number(classNumber),
      Number(semester)
    );

    return res.json({
      success: true,
      comparison
    });
  } catch (error) {
    console.error("Error getting subject comparison:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get subject comparison",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get trending paths
 * GET /api/skill-tree/analytics/trending?limit=10
 */
export async function getTrendingPathsController(req: Request, res: Response) {
  try {
    const { limit } = req.query;

    const trending = await getTrendingPaths(limit ? Number(limit) : 10);

    return res.json({
      success: true,
      trending,
      count: trending.length
    });
  } catch (error) {
    console.error("Error getting trending paths:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get trending paths",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
