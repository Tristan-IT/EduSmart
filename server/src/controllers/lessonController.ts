import { Request, Response } from "express";
import SkillTreeNodeModel from "../models/SkillTreeNode.js";

/**
 * Get lesson content for a specific node
 * GET /api/lessons/:nodeId
 */
export const getLessonContent = async (req: Request, res: Response) => {
  try {
    const { nodeId } = req.params;

    const node = await SkillTreeNodeModel.findOne({ nodeId }).select(
      "nodeId title description lessonContent hasLesson difficulty estimatedDuration learningOutcomes kompetensiDasar"
    );

    if (!node) {
      return res.status(404).json({
        success: false,
        message: "Skill tree node not found",
      });
    }

    if (!node.hasLesson || !node.lessonContent) {
      return res.status(404).json({
        success: false,
        message: "Lesson content not available for this node",
        nodeId,
        hasLesson: false,
      });
    }

    res.json({
      success: true,
      lesson: {
        nodeId: node.nodeId,
        title: node.title,
        description: node.description,
        difficulty: node.difficulty,
        estimatedDuration: node.estimatedDuration,
        // @ts-ignore - lessonContent exists
        content: node.lessonContent,
        // @ts-ignore - learningOutcomes may exist
        learningOutcomes: node.learningOutcomes || [],
        kompetensiDasar: node.kompetensiDasar,
      },
    });
  } catch (error: any) {
    console.error("Error fetching lesson content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lesson content",
      error: error.message,
    });
  }
};

/**
 * Add/Update lesson content for a node (teacher only)
 * PUT /api/lessons/:nodeId
 */
export const updateLessonContent = async (req: Request, res: Response) => {
  try {
    const { nodeId } = req.params;
    const {
      type,
      textContent,
      videoUrl,
      videoDuration,
      attachments,
      interactiveElements,
      learningObjectives,
      keyPoints,
      examples,
      estimatedMinutes,
    } = req.body;

    // Validation
    if (!type || !["text", "video", "interactive", "mixed"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson type. Must be: text, video, interactive, or mixed",
      });
    }

    if (!estimatedMinutes || estimatedMinutes <= 0) {
      return res.status(400).json({
        success: false,
        message: "Estimated minutes is required and must be greater than 0",
      });
    }

    const node = await SkillTreeNodeModel.findOne({ nodeId });

    if (!node) {
      return res.status(404).json({
        success: false,
        message: "Skill tree node not found",
      });
    }

    // Build lesson content object
    const lessonContent = {
      type,
      textContent: type === "text" || type === "mixed" ? textContent : undefined,
      videoUrl: type === "video" || type === "mixed" ? videoUrl : undefined,
      videoDuration: type === "video" || type === "mixed" ? videoDuration : undefined,
      attachments: attachments || [],
      interactiveElements: interactiveElements || [],
      learningObjectives: learningObjectives || [],
      keyPoints: keyPoints || [],
      examples: examples || [],
      estimatedMinutes,
    };

    // @ts-ignore - lessonContent field exists
    node.lessonContent = lessonContent;
    // @ts-ignore - hasLesson field exists
    node.hasLesson = true;
    await node.save();

    res.json({
      success: true,
      message: "Lesson content updated successfully",
      lesson: {
        nodeId: node.nodeId,
        title: node.title,
        // @ts-ignore
        content: node.lessonContent,
      },
    });
  } catch (error: any) {
    console.error("Error updating lesson content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update lesson content",
      error: error.message,
    });
  }
};

/**
 * Delete lesson content from a node (teacher only)
 * DELETE /api/lessons/:nodeId
 */
export const deleteLessonContent = async (req: Request, res: Response) => {
  try {
    const { nodeId } = req.params;

    const node = await SkillTreeNodeModel.findOne({ nodeId });

    if (!node) {
      return res.status(404).json({
        success: false,
        message: "Skill tree node not found",
      });
    }

    // @ts-ignore - fields exist
    node.lessonContent = undefined;
    // @ts-ignore
    node.hasLesson = false;
    await node.save();

    res.json({
      success: true,
      message: "Lesson content deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting lesson content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete lesson content",
      error: error.message,
    });
  }
};

/**
 * Get all nodes with lesson content (filter by subject/topic)
 * GET /api/lessons
 */
export const getNodesWithLessons = async (req: Request, res: Response) => {
  try {
    const { subject, gradeLevel, classNumber, semester } = req.query;

    const filter: any = { hasLesson: true, status: "published" };

    if (subject) filter.subject = subject;
    if (gradeLevel) filter.gradeLevel = gradeLevel;
    if (classNumber) filter.classNumber = Number(classNumber);
    if (semester) filter.semester = Number(semester);

    const nodes = await SkillTreeNodeModel.find(filter)
      .select("nodeId title description difficulty estimatedDuration hasLesson gradeLevel classNumber semester")
      .sort({ gradeLevel: 1, classNumber: 1, semester: 1 });

    res.json({
      success: true,
      count: nodes.length,
      nodes,
    });
  } catch (error: any) {
    console.error("Error fetching nodes with lessons:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nodes with lessons",
      error: error.message,
    });
  }
};

/**
 * Mark lesson as viewed by student
 * POST /api/lessons/:nodeId/view
 */
export const markLessonViewed = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user injected by authenticate middleware
    const userId = (req as any).user?.id;
    const { nodeId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not authenticated",
      });
    }

    const node = await SkillTreeNodeModel.findOne({ nodeId });

    if (!node) {
      return res.status(404).json({
        success: false,
        message: "Skill tree node not found",
      });
    }

    if (!node.hasLesson) {
      return res.status(400).json({
        success: false,
        message: "This node does not have lesson content",
      });
    }

    // Track lesson view in UserProgress model
    const { timeSpent } = req.body; // Optional: time spent in minutes
    const UserProgress = (await import("../models/UserProgress.js")).default;
    
    const updateData: any = {
      lessonViewed: true,
      lessonViewedAt: new Date(),
    };
    
    if (timeSpent && timeSpent > 0) {
      updateData.lessonTimeSpent = timeSpent;
    }
    
    const progress = await UserProgress.findOneAndUpdate(
      { user: userId, nodeId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    console.log(`Lesson viewed: User ${userId}, Node ${nodeId}, Time ${timeSpent || 0}m`);

    res.json({
      success: true,
      message: "Lesson marked as viewed",
      nodeId,
      userId,
      progress: {
        lessonViewed: progress.lessonViewed,
        lessonViewedAt: progress.lessonViewedAt,
        lessonTimeSpent: progress.lessonTimeSpent,
      },
    });
  } catch (error: any) {
    console.error("Error marking lesson viewed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark lesson as viewed",
      error: error.message,
    });
  }
};
