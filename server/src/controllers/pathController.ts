import { Request, Response } from "express";
import SkillTreePathModel, { ISkillTreePath } from "../models/SkillTreePath";
import SkillTreeNodeModel from "../models/SkillTreeNode";
import UserProgressModel from "../models/UserProgress";
import mongoose from "mongoose";

/**
 * Path Controller
 * 
 * Manages learning paths that group skill tree nodes into structured curricula.
 * Provides CRUD operations, filtering, and progress tracking for paths.
 */

/**
 * GET /api/paths
 * Get all paths with optional filters
 * Query params: gradeLevel, classNumber, semester, subject, major, isTemplate, schoolId
 */
export const getPaths = async (req: Request, res: Response) => {
  try {
    const {
      gradeLevel,
      classNumber,
      semester,
      subject,
      major,
      isTemplate,
      schoolId,
      isActive = "true",
    } = req.query;

    const filters: any = {};

    if (gradeLevel) filters.gradeLevel = gradeLevel;
    if (classNumber) filters.classNumber = parseInt(classNumber as string);
    if (semester) filters.semester = parseInt(semester as string);
    if (subject) filters.subject = subject;
    if (major) filters.major = major;
    if (isTemplate !== undefined) filters.isTemplate = isTemplate === "true";
    if (schoolId) filters.school = schoolId;
    if (isActive !== undefined) filters.isActive = isActive === "true";

    // @ts-ignore - Custom static method
    const paths = await SkillTreePathModel.findByFilters(filters);

    res.json({
      success: true,
      count: paths.length,
      paths,
    });
  } catch (error: any) {
    console.error("Error fetching paths:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch paths",
      error: error.message,
    });
  }
};

/**
 * GET /api/paths/templates
 * Get all template paths (system-created, public)
 * Query params: gradeLevel, classNumber, subject
 */
export const getTemplatePaths = async (req: Request, res: Response) => {
  try {
    const { gradeLevel, classNumber, subject } = req.query;

    const filters: any = {};
    if (gradeLevel) filters.gradeLevel = gradeLevel;
    if (classNumber) filters.classNumber = parseInt(classNumber as string);
    if (subject) filters.subject = subject;

    // @ts-ignore - Custom static method
    const paths = await SkillTreePathModel.findTemplates(filters);

    res.json({
      success: true,
      count: paths.length,
      paths,
    });
  } catch (error: any) {
    console.error("Error fetching template paths:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch template paths",
      error: error.message,
    });
  }
};

/**
 * GET /api/paths/school/:schoolId
 * Get paths for a specific school (custom + templates)
 * Query param: includeTemplates (default true)
 */
export const getSchoolPaths = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;
    const { includeTemplates = "true" } = req.query;

    // @ts-ignore - Custom static method
    const paths = await SkillTreePathModel.findBySchool(
      schoolId,
      includeTemplates === "true"
    );

    res.json({
      success: true,
      count: paths.length,
      paths,
    });
  } catch (error: any) {
    console.error("Error fetching school paths:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch school paths",
      error: error.message,
    });
  }
};

/**
 * GET /api/paths/:id
 * Get a single path by pathId
 */
export const getPathById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const path = await SkillTreePathModel.findOne({ pathId: id });

    if (!path) {
      return res.status(404).json({
        success: false,
        message: "Path not found",
      });
    }

    res.json({
      success: true,
      path,
    });
  } catch (error: any) {
    console.error("Error fetching path:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch path",
      error: error.message,
    });
  }
};

/**
 * GET /api/paths/:id/nodes
 * Get all nodes in a path with their details
 */
export const getPathNodes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const path = await SkillTreePathModel.findOne({ pathId: id });

    if (!path) {
      return res.status(404).json({
        success: false,
        message: "Path not found",
      });
    }

    // Fetch all nodes in the path
    const nodes = await SkillTreeNodeModel.find({
      nodeId: { $in: path.nodeIds },
    });

    // Sort nodes by the order in path.nodeIds
    const sortedNodes = path.nodeIds
      .map((nodeId) => nodes.find((n) => n.nodeId === nodeId))
      .filter((n) => n !== undefined);

    res.json({
      success: true,
      path: {
        pathId: path.pathId,
        name: path.name,
        description: path.description,
      },
      nodes: sortedNodes,
      totalNodes: sortedNodes.length,
    });
  } catch (error: any) {
    console.error("Error fetching path nodes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch path nodes",
      error: error.message,
    });
  }
};

/**
 * GET /api/paths/:id/progress/:userId
 * Get user's progress on a specific path
 */
export const getPathProgress = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;

    const path = await SkillTreePathModel.findOne({ pathId: id });

    if (!path) {
      return res.status(404).json({
        success: false,
        message: "Path not found",
      });
    }

    // Fetch user's progress for all nodes in this path
    const userProgress = await UserProgressModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      nodeId: { $in: path.nodeIds },
    });

    // Calculate progress statistics
    const completedNodes = userProgress.filter((p) => p.status === "completed");
    const inProgressNodes = userProgress.filter((p) => p.status === "in-progress");
    // @ts-ignore - UserProgress extended field
    const totalXPEarned = userProgress.reduce((sum, p) => sum + (p.xpEarned || 0), 0);
    const totalStars = userProgress.reduce((sum, p) => sum + (p.stars || 0), 0);
    const maxPossibleStars = path.totalNodes * 3;

    const progressPercentage =
      path.totalNodes > 0 ? (completedNodes.length / path.totalNodes) * 100 : 0;

    res.json({
      success: true,
      pathId: path.pathId,
      pathName: path.name,
      progress: {
        totalNodes: path.totalNodes,
        completedNodes: completedNodes.length,
        inProgressNodes: inProgressNodes.length,
        lockedNodes: path.totalNodes - completedNodes.length - inProgressNodes.length,
        progressPercentage: Math.round(progressPercentage * 10) / 10,
        totalXPEarned,
        totalXPAvailable: path.totalXP,
        totalStars,
        maxPossibleStars,
        starPercentage: maxPossibleStars > 0 ? Math.round((totalStars / maxPossibleStars) * 100) : 0,
      },
      nodeProgress: userProgress.map((p) => ({
        nodeId: p.nodeId,
        status: p.status,
        stars: p.stars,
        // @ts-ignore - UserProgress extended field
        xpEarned: p.xpEarned,
        completedAt: p.completedAt,
        attempts: p.attempts,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching path progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch path progress",
      error: error.message,
    });
  }
};

/**
 * POST /api/teacher/paths
 * Create a new path (teacher only)
 */
export const createPath = async (req: Request, res: Response) => {
  try {
    const {
      pathId,
      name,
      description,
      gradeLevel,
      classNumber,
      semester,
      subject,
      major,
      curriculum = "Kurikulum Merdeka",
      nodeIds,
      learningOutcomes = [],
      kompetensiDasar = [],
      prerequisites = [],
      isTemplate = false,
      school,
      isPublic = false,
      tags = [],
      difficulty = "Sedang",
    } = req.body;

    // Validate required fields
    if (!pathId || !name || !gradeLevel || !classNumber || !semester || !subject || !nodeIds) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if pathId already exists
    const existingPath = await SkillTreePathModel.findOne({ pathId });
    if (existingPath) {
      return res.status(400).json({
        success: false,
        message: "Path ID already exists",
      });
    }

    // Validate all node IDs exist
    const nodes = await SkillTreeNodeModel.find({ nodeId: { $in: nodeIds } });
    if (nodes.length !== nodeIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some node IDs are invalid",
      });
    }

    // Calculate aggregate statistics
    const totalXP = nodes.reduce((sum, node) => sum + (node.xpReward || 0), 0);
    // @ts-ignore - SkillTreeNode extended field
    const totalQuizzes = nodes.reduce((sum, node) => sum + (node.quizCount || 0), 0);
    const estimatedHours = nodes.reduce(
      // @ts-ignore - SkillTreeNode extended field
      (sum, node) => sum + (node.estimatedMinutes || 0),
      0
    ) / 60;
    const checkpointCount = nodes.filter((node) => node.isCheckpoint).length;

    // Create path
    const newPath = new SkillTreePathModel({
      pathId,
      name,
      description,
      gradeLevel,
      classNumber,
      semester,
      subject,
      major,
      curriculum,
      nodeIds,
      totalNodes: nodeIds.length,
      totalXP,
      totalQuizzes,
      estimatedHours: Math.round(estimatedHours * 10) / 10,
      checkpointCount,
      learningOutcomes,
      kompetensiDasar,
      prerequisites,
      isTemplate,
      school: school ? new mongoose.Types.ObjectId(school) : undefined,
      createdBy: (req as any).user?.id ? new mongoose.Types.ObjectId((req as any).user.id) : undefined,
      isPublic,
      isActive: true,
      tags,
      difficulty,
    });

    await newPath.save();

    res.status(201).json({
      success: true,
      message: "Path created successfully",
      path: newPath,
    });
  } catch (error: any) {
    console.error("Error creating path:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create path",
      error: error.message,
    });
  }
};

/**
 * PUT /api/teacher/paths/:id
 * Update an existing path (teacher only)
 */
export const updatePath = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const path = await SkillTreePathModel.findOne({ pathId: id });

    if (!path) {
      return res.status(404).json({
        success: false,
        message: "Path not found",
      });
    }

    // If nodeIds are being updated, recalculate statistics
    if (updates.nodeIds) {
      const nodes = await SkillTreeNodeModel.find({
        nodeId: { $in: updates.nodeIds },
      });

      if (nodes.length !== updates.nodeIds.length) {
        return res.status(400).json({
          success: false,
          message: "Some node IDs are invalid",
        });
      }

      updates.totalNodes = updates.nodeIds.length;
      updates.totalXP = nodes.reduce((sum, node) => sum + (node.xpReward || 0), 0);
      // @ts-ignore - SkillTreeNode extended field
      updates.totalQuizzes = nodes.reduce((sum, node) => sum + (node.quizCount || 0), 0);
      updates.estimatedHours =
        Math.round(
          // @ts-ignore - SkillTreeNode extended field
          (nodes.reduce((sum, node) => sum + (node.estimatedMinutes || 0), 0) / 60) * 10
        ) / 10;
      updates.checkpointCount = nodes.filter((node) => node.isCheckpoint).length;
    }

    // Update path
    Object.assign(path, updates);
    await path.save();

    res.json({
      success: true,
      message: "Path updated successfully",
      path,
    });
  } catch (error: any) {
    console.error("Error updating path:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update path",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/teacher/paths/:id
 * Delete a path (teacher only)
 */
export const deletePath = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const path = await SkillTreePathModel.findOne({ pathId: id });

    if (!path) {
      return res.status(404).json({
        success: false,
        message: "Path not found",
      });
    }

    // Prevent deletion of template paths
    if (path.isTemplate && path.isPublic) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete public template paths",
      });
    }

    await SkillTreePathModel.deleteOne({ pathId: id });

    res.json({
      success: true,
      message: "Path deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting path:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete path",
      error: error.message,
    });
  }
};

/**
 * POST /api/teacher/paths/:id/clone
 * Clone a path (useful for creating custom versions of templates)
 */
export const clonePath = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newPathId, newName, school } = req.body;

    if (!newPathId || !newName) {
      return res.status(400).json({
        success: false,
        message: "New path ID and name are required",
      });
    }

    const existingPath = await SkillTreePathModel.findOne({ pathId: id });

    if (!existingPath) {
      return res.status(404).json({
        success: false,
        message: "Path not found",
      });
    }

    // Check if new pathId already exists
    const duplicate = await SkillTreePathModel.findOne({ pathId: newPathId });
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "New path ID already exists",
      });
    }

    // Create clone
    const clonedPath = new SkillTreePathModel({
      ...existingPath.toObject(),
      _id: new mongoose.Types.ObjectId(),
      pathId: newPathId,
      name: newName,
      isTemplate: false,
      school: school ? new mongoose.Types.ObjectId(school) : undefined,
      createdBy: (req as any).user?.id ? new mongoose.Types.ObjectId((req as any).user.id) : undefined,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await clonedPath.save();

    res.status(201).json({
      success: true,
      message: "Path cloned successfully",
      path: clonedPath,
    });
  } catch (error: any) {
    console.error("Error cloning path:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clone path",
      error: error.message,
    });
  }
};

/**
 * POST /api/teacher/paths/:id/reorder
 * Reorder nodes in a path
 */
export const reorderPathNodes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nodeIds } = req.body;

    if (!nodeIds || !Array.isArray(nodeIds)) {
      return res.status(400).json({
        success: false,
        message: "Node IDs array is required",
      });
    }

    const path = await SkillTreePathModel.findOne({ pathId: id });

    if (!path) {
      return res.status(404).json({
        success: false,
        message: "Path not found",
      });
    }

    // @ts-ignore - Custom instance method
    (path as any).reorderNodes(nodeIds);
    await path.save();

    res.json({
      success: true,
      message: "Path nodes reordered successfully",
      path,
    });
  } catch (error: any) {
    console.error("Error reordering path nodes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reorder path nodes",
      error: error.message,
    });
  }
};

export default {
  getPaths,
  getTemplatePaths,
  getSchoolPaths,
  getPathById,
  getPathNodes,
  getPathProgress,
  createPath,
  updatePath,
  deletePath,
  clonePath,
  reorderPathNodes,
};
