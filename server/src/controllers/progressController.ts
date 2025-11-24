import { Request, Response } from "express";
import {
  getStudentProgress,
  getClassSubjectProgress,
  getSchoolSubjectProgress,
  getSubjectStatistics,
  updateLessonProgress,
  updateQuizProgress,
  updateExerciseProgress,
  updateAssignmentProgress,
} from "../services/progressService.js";
import UserProgressModel from "../models/UserProgress.js";
import SkillTreeNodeModel from "../models/SkillTreeNode.js";
import UserModel from "../models/User.js";
import {
  calculateAchievementContext,
  checkSkillTreeAchievements,
} from "../utils/achievementHelper.js";

/**
 * Progress Controller
 * Handles StudentSubjectProgress API endpoints
 */

/**
 * GET /api/progress/student/:studentId
 * Get all progress records for a student
 * Query params: subjectId, classId
 */
export async function getStudentProgressController(req: Request, res: Response) {
  try {
    const { studentId } = req.params;
    const { subjectId, classId } = req.query;

    // Authorization: Students can only view their own progress
    // Teachers/School owners can view any student in their school
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    if (userRole === "student" && userId && userId.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own progress",
      });
    }

    const progress = await getStudentProgress(studentId, {
      subjectId: subjectId as string,
      classId: classId as string,
    });

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("Error in getStudentProgressController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get student progress",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * GET /api/progress/class/:classId/subject/:subjectId
 * Get all students' progress in a class for a specific subject
 * For teachers to view their class performance
 */
export async function getClassProgressController(req: Request, res: Response) {
  try {
    const { classId, subjectId } = req.params;

    // Authorization: Only teachers and school owners
    const userRole = (req as any).user?.role;
    if (userRole !== "teacher" && userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Only teachers and school owners can view class progress",
      });
    }

    const progress = await getClassSubjectProgress(classId, subjectId);

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("Error in getClassProgressController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get class progress",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * GET /api/progress/school/:schoolId
 * Get all students' progress in a school, optionally filtered by subject
 * Query params: subjectId
 */
export async function getSchoolProgressController(req: Request, res: Response) {
  try {
    const { schoolId } = req.params;
    const { subjectId } = req.query;

    // Authorization: Only school owners
    const userRole = (req as any).user?.role;
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Only school owners can view school-wide progress",
      });
    }

    const progress = await getSchoolSubjectProgress(
      schoolId,
      subjectId as string | undefined
    );

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("Error in getSchoolProgressController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get school progress",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * GET /api/progress/statistics/:schoolId/:subjectId
 * Get aggregated statistics for a subject in a school
 */
export async function getSubjectStatisticsController(req: Request, res: Response) {
  try {
    const { schoolId, subjectId } = req.params;

    // Authorization: Only school owners and teachers
    const userRole = (req as any).user?.role;
    if (userRole !== "school_owner" && userRole !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only school owners and teachers can view subject statistics",
      });
    }

    const statistics = await getSubjectStatistics(schoolId, subjectId);

    return res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error("Error in getSubjectStatisticsController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get subject statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * POST /api/progress/lesson
 * Update progress when a lesson is completed
 * Body: { studentId, subjectId, timeSpent, xpEarned }
 */
export async function updateLessonProgressController(req: Request, res: Response) {
  try {
    const { studentId, subjectId, timeSpent, xpEarned } = req.body;

    if (!studentId || !subjectId) {
      return res.status(400).json({
        success: false,
        message: "studentId and subjectId are required",
      });
    }

    // Authorization: Students can only update their own progress
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    if (userRole === "student" && userId !== studentId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own progress",
      });
    }

    const progress = await updateLessonProgress(studentId, subjectId, {
      timeSpent,
      xpEarned,
    });

    return res.status(200).json({
      success: true,
      data: progress,
      message: "Lesson progress updated successfully",
    });
  } catch (error) {
    console.error("Error in updateLessonProgressController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lesson progress",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * POST /api/progress/quiz
 * Update progress when a quiz is completed
 * Body: { studentId, subjectId, score, topicId, timeSpent, xpEarned }
 */
export async function updateQuizProgressController(req: Request, res: Response) {
  try {
    const { studentId, subjectId, score, topicId, timeSpent, xpEarned } = req.body;

    if (!studentId || !subjectId || score === undefined) {
      return res.status(400).json({
        success: false,
        message: "studentId, subjectId, and score are required",
      });
    }

    // Authorization: Students can only update their own progress
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    if (userRole === "student" && userId !== studentId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own progress",
      });
    }

    const progress = await updateQuizProgress(studentId, subjectId, {
      score,
      topicId,
      timeSpent,
      xpEarned,
    });

    return res.status(200).json({
      success: true,
      data: progress,
      message: "Quiz progress updated successfully",
    });
  } catch (error) {
    console.error("Error in updateQuizProgressController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update quiz progress",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * POST /api/progress/exercise
 * Update progress when an exercise is completed
 * Body: { studentId, subjectId, score, timeSpent, xpEarned }
 */
export async function updateExerciseProgressController(req: Request, res: Response) {
  try {
    const { studentId, subjectId, score, timeSpent, xpEarned } = req.body;

    if (!studentId || !subjectId) {
      return res.status(400).json({
        success: false,
        message: "studentId and subjectId are required",
      });
    }

    // Authorization: Students can only update their own progress
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    if (userRole === "student" && userId !== studentId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own progress",
      });
    }

    const progress = await updateExerciseProgress(studentId, subjectId, {
      score,
      timeSpent,
      xpEarned,
    });

    return res.status(200).json({
      success: true,
      data: progress,
      message: "Exercise progress updated successfully",
    });
  } catch (error) {
    console.error("Error in updateExerciseProgressController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update exercise progress",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * POST /api/progress/assignment
 * Update progress when an assignment is completed
 * Body: { studentId, subjectId, score, timeSpent, xpEarned }
 */
export async function updateAssignmentProgressController(req: Request, res: Response) {
  try {
    const { studentId, subjectId, score, timeSpent, xpEarned } = req.body;

    if (!studentId || !subjectId || score === undefined) {
      return res.status(400).json({
        success: false,
        message: "studentId, subjectId, and score are required",
      });
    }

    // Authorization: Students can only update their own progress
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    if (userRole === "student" && userId !== studentId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own progress",
      });
    }

    const progress = await updateAssignmentProgress(studentId, subjectId, {
      score,
      timeSpent,
      xpEarned,
    });

    return res.status(200).json({
      success: true,
      data: progress,
      message: "Assignment progress updated successfully",
    });
  } catch (error) {
    console.error("Error in updateAssignmentProgressController:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update assignment progress",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// ============================================
// SKILL TREE PROGRESS CONTROLLERS
// ============================================

/**
 * GET /api/progress/skill-tree
 * Get skill tree progress for current user
 */
export async function getSkillTreeProgress(req: Request, res: Response) {
  try {
    // @ts-ignore - req.user from middleware
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { gradeLevel, classNumber, semester, subject } = req.query;

    // Build query for nodes
    const nodeQuery: any = {};
    if (gradeLevel) nodeQuery.gradeLevel = gradeLevel;
    if (classNumber) nodeQuery.classNumber = parseInt(classNumber as string);
    if (semester) nodeQuery.semester = parseInt(semester as string);
    if (subject) nodeQuery.subject = subject;

    // Get all relevant nodes
    const nodes = await SkillTreeNodeModel.find(nodeQuery).lean();
    const nodeIds = nodes.map(n => n.nodeId);

    // Get user's progress for these nodes
    const progressRecords = await UserProgressModel.find({
      user: userId,
      nodeId: { $in: nodeIds }
    }).lean();

    // Create progress map
    const progressMap = new Map(progressRecords.map(p => [p.nodeId, p]));

    // Calculate which nodes should be unlocked
    const unlockedNodeIds = new Set<string>();
    const completedNodeIds = new Set(
      progressRecords.filter(p => p.status === "completed").map(p => p.nodeId)
    );

    // First pass: nodes with no prerequisites are unlocked
    for (const node of nodes) {
      if (!node.prerequisites || node.prerequisites.length === 0) {
        unlockedNodeIds.add(node.nodeId);
      }
    }

    // Second pass: unlock nodes whose prerequisites are all completed
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of nodes) {
        if (unlockedNodeIds.has(node.nodeId)) continue;
        
        const allPrereqsCompleted = node.prerequisites?.every(prereqId =>
          completedNodeIds.has(prereqId)
        );

        if (allPrereqsCompleted) {
          unlockedNodeIds.add(node.nodeId);
          changed = true;
        }
      }
    }

    // Build response with progress status
    const nodesWithProgress = nodes.map(node => {
      const progress = progressMap.get(node.nodeId);
      const isUnlocked = unlockedNodeIds.has(node.nodeId);
      const isCompleted = completedNodeIds.has(node.nodeId);

      return {
        ...node,
        progress: {
          status: isCompleted ? "completed" : isUnlocked ? "unlocked" : "locked",
          stars: progress?.stars || 0,
          completedAt: progress?.completedAt,
          attempts: progress?.attempts || 0,
          bestScore: progress?.bestScore || 0,
        }
      };
    });

    res.json({
      nodes: nodesWithProgress,
      stats: {
        totalNodes: nodes.length,
        completedNodes: completedNodeIds.size,
        unlockedNodes: unlockedNodeIds.size,
        lockedNodes: nodes.length - unlockedNodeIds.size,
      }
    });
  } catch (error: any) {
    console.error("Error getting skill tree progress:", error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * POST /api/progress/skill-tree/unlock
 * Unlock a skill tree node (check prerequisites)
 */
export async function unlockNode(req: Request, res: Response) {
  try {
    // @ts-ignore - req.user from middleware
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { nodeId } = req.body;
    if (!nodeId) {
      return res.status(400).json({ message: "nodeId is required" });
    }

    // Get the node
    const node = await SkillTreeNodeModel.findOne({ nodeId }).lean();
    if (!node) {
      return res.status(404).json({ message: "Node not found" });
    }

    // Check if prerequisites are met
    if (node.prerequisites && node.prerequisites.length > 0) {
      const completedPrereqs = await UserProgressModel.countDocuments({
        user: userId,
        nodeId: { $in: node.prerequisites },
        status: "completed"
      });

      if (completedPrereqs < node.prerequisites.length) {
        return res.status(403).json({
          message: "Prerequisites not met",
          required: node.prerequisites.length,
          completed: completedPrereqs
        });
      }
    }

    // Create or update progress record
    const progress = await UserProgressModel.findOneAndUpdate(
      { user: userId, nodeId },
      {
        status: "in-progress",
        $inc: { attempts: 1 }
      },
      { upsert: true, new: true }
    );

    res.json({
      message: "Node unlocked successfully",
      progress
    });
  } catch (error: any) {
    console.error("Error unlocking node:", error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * POST /api/progress/skill-tree/complete
 * Complete a skill tree node (after quiz)
 */
export async function completeNode(req: Request, res: Response) {
  try {
    // @ts-ignore - req.user from middleware
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { nodeId, score, timeSpent } = req.body;
    if (!nodeId || score === undefined) {
      return res.status(400).json({ message: "nodeId and score are required" });
    }

    // Get the node
    const node = await SkillTreeNodeModel.findOne({ nodeId }).lean();
    if (!node) {
      return res.status(404).json({ message: "Node not found" });
    }

    // Calculate stars (0-3 based on score percentage)
    let stars = 0;
    if (score >= 90) stars = 3;
    else if (score >= 75) stars = 2;
    else if (score >= 60) stars = 1;

    // Update progress
    const currentProgress = await UserProgressModel.findOne({
      user: userId,
      nodeId
    });

    const isNewCompletion = !currentProgress || currentProgress.status !== "completed";
    const isBetterScore = !currentProgress || score > currentProgress.bestScore;

    const progress = await UserProgressModel.findOneAndUpdate(
      { user: userId, nodeId },
      {
        status: "completed",
        stars: Math.max(stars, currentProgress?.stars || 0),
        bestScore: Math.max(score, currentProgress?.bestScore || 0),
        completedAt: new Date(),
        $inc: { attempts: 1 }
      },
      { upsert: true, new: true }
    );

    // Award XP, gems, and other rewards
    const user = await UserModel.findById(userId);
    if (user) {
      const rewards = {
        xp: 0,
        gems: 0,
        hearts: 0,
        badge: null as string | null,
        certificate: null as string | null,
      };

      // Only award full rewards on first completion or better score
      if (isNewCompletion || isBetterScore) {
        // @ts-ignore - node.rewards exists
        rewards.xp = node.rewards?.xp || 0;
        // @ts-ignore - node.rewards exists
        rewards.gems = node.rewards?.gems || 0;

        // Update user stats
        // @ts-ignore - User extended field
        user.totalXP = (user.totalXP || 0) + rewards.xp;
        // @ts-ignore - User extended field
        user.gems = (user.gems || 0) + rewards.gems;

        // Award checkpoint rewards
        if (node.isCheckpoint) {
          // @ts-ignore - node.rewards exists
          rewards.hearts = node.rewards?.hearts || 3;
          // @ts-ignore - node.rewards exists
          rewards.badge = node.rewards?.badge || null;
          // @ts-ignore - node.rewards exists
          rewards.certificate = node.rewards?.certificate || null;

          // @ts-ignore - User extended field
          user.hearts = (user.hearts || 0) + rewards.hearts;

          // Add badge to user's collection
          if (rewards.badge) {
            // @ts-ignore - User extended field
            if (!user.badges) user.badges = [];
            // @ts-ignore - User extended field
            if (!user.badges.includes(rewards.badge)) {
              // @ts-ignore - User extended field
              user.badges.push(rewards.badge);
            }
          }

          // Add certificate
          if (rewards.certificate) {
            // @ts-ignore - User extended field
            if (!user.certificates) user.certificates = [];
            // @ts-ignore - User extended field
            if (!user.certificates.includes(rewards.certificate)) {
              // @ts-ignore - User extended field
              user.certificates.push(rewards.certificate);
            }
          }
        }

        // Update level based on XP
        // @ts-ignore - User extended field
        const newLevel = Math.floor(user.totalXP / 1000) + 1;
        // @ts-ignore - User extended field
        if (newLevel > (user.level || 1)) {
          // @ts-ignore - User extended field
          user.level = newLevel;
        }

        await user.save();
      }

      // NEW: Check for achievements
      const achievementContext = await calculateAchievementContext(userId);
      const unlockedAchievements = checkSkillTreeAchievements(achievementContext);

      res.json({
        message: "Node completed successfully",
        progress,
        rewards,
        userStats: {
          // @ts-ignore - User extended field
          totalXP: user.totalXP,
          // @ts-ignore - User extended field
          level: user.level,
          // @ts-ignore - User extended field
          gems: user.gems,
          // @ts-ignore - User extended field
          hearts: user.hearts,
        },
        // NEW: Achievement data
        achievements: {
          context: achievementContext,
          unlocked: unlockedAchievements,
        },
      });
    } else {
      res.json({
        message: "Node completed successfully",
        progress
      });
    }
  } catch (error: any) {
    console.error("Error completing node:", error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * PUT /api/progress/skill-tree/:nodeId
 * Update node progress (for partial completion)
 */
export async function getNodeProgress(req: Request, res: Response) {
  try {
    // @ts-ignore - req.user from middleware
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { nodeId } = req.params;
    const { status } = req.body;

    if (!["locked", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const progress = await UserProgressModel.findOneAndUpdate(
      { user: userId, nodeId },
      { status },
      { upsert: true, new: true }
    );

    res.json({ progress });
  } catch (error: any) {
    console.error("Error updating node progress:", error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * GET /api/progress/skill-tree/stats
 * Get overall skill tree statistics for user
 */
export async function getSkillTreeStats(req: Request, res: Response) {
  try {
    // @ts-ignore - req.user from middleware
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Get all user's progress
    const allProgress = await UserProgressModel.find({ user: userId }).lean();

    // Get total nodes count
    const totalNodes = await SkillTreeNodeModel.countDocuments();

    // Calculate stats
    const completedNodes = allProgress.filter(p => p.status === "completed").length;
    const inProgressNodes = allProgress.filter(p => p.status === "in-progress").length;
    const totalStars = allProgress.reduce((sum, p) => sum + p.stars, 0);
    const perfectNodes = allProgress.filter(p => p.stars === 3).length;

    // Get user data
    const user = await UserModel.findById(userId).lean();

    res.json({
      totalNodes,
      completedNodes,
      inProgressNodes,
      lockedNodes: totalNodes - completedNodes - inProgressNodes,
      totalStars,
      perfectNodes,
      completionRate: totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0,
      stats: {
        // @ts-ignore - User extended field
        totalXP: user?.totalXP || 0,
        // @ts-ignore - User extended field
        level: user?.level || 1,
        // @ts-ignore - User extended field
        gems: user?.gems || 0,
        // @ts-ignore - User extended field
        hearts: user?.hearts || 0,
        // @ts-ignore - User extended field
        badges: user?.badges?.length || 0,
        // @ts-ignore - User extended field
        certificates: user?.certificates?.length || 0,
      }
    });
  } catch (error: any) {
    console.error("Error getting skill tree stats:", error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * GET /api/progress/skill-tree/recommendations
 * Get personalized learning path recommendations
 */
export { 
  getPathRecommendations as getRecommendations,
  getSubjectRecommendations 
} from "../services/recommendationService.js";

/**
 * GET /api/progress/student/me
 * Get current student's overall learning progress
 */
export async function getMyProgress(req: Request, res: Response) {
  try {
    const userId = (req as any).user?._id || (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Import models dynamically to avoid circular dependencies
    const StudentSubjectProgressModel = (await import("../models/StudentSubjectProgress.js")).default;

    // Get skill tree progress
    const skillTreeProgress = await UserProgressModel.find({ user: userId });
    
    // Get subject progress
    const subjectProgress = await StudentSubjectProgressModel.find({ student: userId })
      .populate("subject", "name")
      .select("subject averageScore masteryPercentage totalLessonsCompleted totalQuizzesCompleted");

    // Calculate overall stats
    const completedLessons = skillTreeProgress.filter(p => p.status === "completed").length;
    const totalLessons = skillTreeProgress.length;
    
    // Calculate average score from all subjects
    let averageScore = 0;
    if (subjectProgress.length > 0) {
      const totalScore = subjectProgress.reduce((sum: number, sp: any) => sum + sp.averageScore, 0);
      averageScore = Math.round(totalScore / subjectProgress.length);
    }

    // Build mastery progress array with colors
    const masteryProgress = subjectProgress.map((sp: any, index: number) => {
      const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-amber-500", "bg-red-500", "bg-pink-500"];
      return {
        subject: sp.subject?.name || "Unknown Subject",
        percentage: sp.masteryPercentage,
        color: colors[index % colors.length],
      };
    });

    return res.status(200).json({
      completedLessons,
      totalLessons,
      averageScore,
      masteryProgress,
    });
  } catch (error) {
    console.error("Error fetching student progress:", error);
    return res.status(500).json({ message: "Failed to fetch progress data" });
  }
}

/**
 * GET /api/progress/stats
 * Get dashboard statistics for current student
 */
export async function getStudentStats(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get all subject progress for the student
    const subjectProgress = await UserProgressModel.find({ student: userId })
      .select("subject masteryPercentage completedTopics totalLessonsCompleted totalQuizzesCompleted")
      .populate("subject", "name code");

    // Calculate overall mastery
    const masteryValues = subjectProgress
      .map(sp => sp.masteryPercentage || 0)
      .filter(v => v > 0);
    const averageMastery = masteryValues.length > 0
      ? Math.round(masteryValues.reduce((a, b) => a + b, 0) / masteryValues.length)
      : 0;

    // Build mastery per topic object
    const masteryPerTopic: Record<string, number> = {};
    subjectProgress.forEach(sp => {
      if (sp.subject && typeof sp.subject === 'object' && 'code' in sp.subject) {
        masteryPerTopic[(sp.subject as any).code] = sp.masteryPercentage || 0;
      }
    });

    // Calculate completed topics
    const completedTopics = subjectProgress.reduce(
      (sum, sp) => sum + (sp.completedTopics || 0),
      0
    );

    // Get user for streak data
    const user = await UserModel.findById(userId).select("streak bestStreak");
    
    return res.status(200).json({
      success: true,
      data: {
        averageMastery,
        masteryPerTopic,
        completedTopics,
        totalTopics: subjectProgress.length * 10, // Estimate
        streak: user?.streak || 0,
        bestStreak: user?.bestStreak || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching student stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

