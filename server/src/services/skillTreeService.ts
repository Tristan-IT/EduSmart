import SkillTreeNodeModel from "../models/SkillTreeNode.js";
import UserProgressModel from "../models/UserProgress.js";
import { Types } from "mongoose";
import { addXP, updateStreak, checkAchievements } from "./gamificationService.js";

/**
 * Get full skill tree structure with optional filters
 */
export async function getSkillTree(filters: any = {}) {
  try {
    const nodes = await SkillTreeNodeModel.find(filters).sort({ 
      classNumber: 1, 
      semester: 1, 
      level: 1,
      "position.y": 1 
    });
    return nodes;
  } catch (error) {
    console.error("Error getting skill tree:", error);
    throw error;
  }
}

/**
 * Get user's personalized skill tree with progress
 */
export async function getUserSkillTree(userId: string | Types.ObjectId) {
  try {
    // Get all nodes
    const allNodes = await SkillTreeNodeModel.find({}).sort({ "position.y": 1 });
    
    // Get user's progress
    const userProgress = await UserProgressModel.find({ user: userId });
    const progressMap = new Map();
    
    userProgress.forEach(p => {
      progressMap.set(p.nodeId, {
        status: p.status,
        stars: p.stars,
        attempts: p.attempts,
        bestScore: p.bestScore,
        completedAt: p.completedAt,
      });
    });

    // Combine node data with progress
    const skillTreeWithProgress = allNodes.map(node => {
      const progress = progressMap.get(node.nodeId);
      const isUnlocked = checkIfNodeUnlocked(node.nodeId, allNodes, progressMap);
      
      return {
        ...node.toObject(),
        status: progress?.status || (isUnlocked ? "current" : "locked"),
        stars: progress?.stars || 0,
        attempts: progress?.attempts || 0,
        bestScore: progress?.bestScore || 0,
        completedAt: progress?.completedAt,
        unlocked: isUnlocked,
      };
    });

    return skillTreeWithProgress;
  } catch (error) {
    console.error("Error getting user skill tree:", error);
    throw error;
  }
}

/**
 * Check if a node should be unlocked based on prerequisites
 */
function checkIfNodeUnlocked(
  nodeId: string,
  allNodes: any[],
  progressMap: Map<string, any>
): boolean {
  const node = allNodes.find(n => n.nodeId === nodeId);
  if (!node) return false;

  // If no prerequisites, it's unlocked
  if (!node.prerequisites || node.prerequisites.length === 0) {
    return true;
  }

  // Check if all prerequisites are completed
  return node.prerequisites.every((prereqId: string) => {
    const prereqProgress = progressMap.get(prereqId);
    return prereqProgress && prereqProgress.status === "completed";
  });
}

/**
 * Complete a skill tree node
 */
export async function completeNode(
  userId: string | Types.ObjectId,
  nodeId: string,
  score: number // 0-100
) {
  try {
    // Get the node
    const node = await SkillTreeNodeModel.findOne({ nodeId });
    if (!node) {
      throw new Error("Node not found");
    }

    // Calculate stars based on score
    let stars = 0;
    if (score >= 90) stars = 3;
    else if (score >= 75) stars = 2;
    else if (score >= 60) stars = 1;

    // Calculate XP based on stars
    const xpMultiplier = [0.5, 0.75, 1.0, 1.25][stars];
    const xpEarned = Math.round(node.xpReward * xpMultiplier);

    // Update or create user progress
    const existingProgress = await UserProgressModel.findOne({
      user: userId,
      nodeId,
    });

    if (existingProgress) {
      // Update existing progress
      if (score > existingProgress.bestScore) {
        existingProgress.bestScore = score;
        existingProgress.stars = Math.max(existingProgress.stars, stars);
      }
      existingProgress.attempts += 1;
      existingProgress.status = "completed";
      existingProgress.completedAt = new Date();
      await existingProgress.save();
    } else {
      // Create new progress
      await UserProgressModel.create({
        user: userId,
        nodeId,
        status: "completed",
        stars,
        bestScore: score,
        attempts: 1,
        completedAt: new Date(),
      });
    }

    // Award XP
    const xpResult = await addXP(userId, xpEarned, `Completed: ${node.title}`);

    // Update streak
    await updateStreak(userId);

    // Unlock next nodes (nodes that have this as prerequisite)
    const allNodes = await SkillTreeNodeModel.find({});
    const nextNodes = allNodes.filter(n =>
      n.prerequisites.includes(nodeId)
    );

    for (const nextNode of nextNodes) {
      // Check if all prerequisites are met
      const userProgress = await UserProgressModel.find({ user: userId });
      const progressMap = new Map(
        userProgress.map(p => [p.nodeId, p])
      );

      const canUnlock = nextNode.prerequisites.every(prereqId => {
        const prereqProgress = progressMap.get(prereqId);
        return prereqProgress && prereqProgress.status === "completed";
      });

      if (canUnlock) {
        // Create progress entry with "current" status if not exists
        const existingNextProgress = await UserProgressModel.findOne({
          user: userId,
          nodeId: nextNode.nodeId,
        });

        if (!existingNextProgress) {
          await UserProgressModel.create({
            user: userId,
            nodeId: nextNode.nodeId,
            status: "current",
            stars: 0,
            bestScore: 0,
            attempts: 0,
          });
        }
      }
    }

    // Check for achievements
    await checkAchievements(userId);

    return {
      success: true,
      nodeId,
      score,
      stars,
      xpEarned,
      leveledUp: xpResult.leveledUp,
      newLevel: xpResult.newLevel,
      unlockedNodes: nextNodes.map(n => n.nodeId),
    };
  } catch (error) {
    console.error("Error completing node:", error);
    throw error;
  }
}

/**
 * Get next available nodes for user
 */
export async function getNextAvailableNodes(userId: string | Types.ObjectId) {
  try {
    const skillTree = await getUserSkillTree(userId);
    
    // Filter nodes that are unlocked but not completed
    const availableNodes = skillTree.filter(
      (node: any) => node.unlocked && node.status !== "completed"
    );

    return availableNodes;
  } catch (error) {
    console.error("Error getting next available nodes:", error);
    throw error;
  }
}

/**
 * Calculate overall skill tree progress percentage
 */
export async function calculateTreeProgress(userId: string | Types.ObjectId) {
  try {
    const allNodes = await SkillTreeNodeModel.find({});
    const completedNodes = await UserProgressModel.countDocuments({
      user: userId,
      status: "completed",
    });

    const totalNodes = allNodes.length;
    const progressPercentage = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;

    return {
      totalNodes,
      completedNodes,
      progressPercentage: Math.round(progressPercentage),
    };
  } catch (error) {
    console.error("Error calculating tree progress:", error);
    throw error;
  }
}
