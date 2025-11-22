/**
 * Achievement Helper for Skill Tree
 * Calculate achievement context based on user progress
 */

import UserProgressModel from "../models/UserProgress.js";
import SkillTreeNodeModel from "../models/SkillTreeNode.js";

interface AchievementContext {
  nodesCompleted?: number;
  nodesCompletedToday?: number;
  perfectNodes?: number;
  checkpointsCompleted?: number;
  nodeStreak?: number;
  subjectNodesCompleted?: Record<string, number>;
  difficultyNodesCompleted?: Record<string, number>;
  [key: string]: any;
}

/**
 * Calculate achievement context for a user
 */
export async function calculateAchievementContext(
  userId: string
): Promise<AchievementContext> {
  try {
    // Get all user progress
    const allProgress = await UserProgressModel.find({
      user: userId,
      status: "completed",
    }).lean();

    const completedNodeIds = allProgress.map((p) => p.nodeId);

    // Get all completed nodes details
    const completedNodes = await SkillTreeNodeModel.find({
      nodeId: { $in: completedNodeIds },
    }).lean();

    // Total nodes completed
    const nodesCompleted = allProgress.length;

    // Nodes completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nodesCompletedToday = allProgress.filter((p) => {
      const completedAt = p.completedAt ? new Date(p.completedAt) : null;
      return completedAt && completedAt >= today;
    }).length;

    // Perfect nodes (3 stars)
    const perfectNodes = allProgress.filter((p) => p.stars === 3).length;

    // Checkpoints completed
    const checkpointsCompleted = completedNodes.filter(
      (n) => n.isCheckpoint
    ).length;

    // Calculate node streak (consecutive completions without failure)
    // For now, we'll use a simplified version
    // TODO: Track actual consecutive completions without failures
    const nodeStreak = calculateNodeStreak(allProgress);

    // Subject-specific completions
    const subjectNodesCompleted: Record<string, number> = {};
    completedNodes.forEach((node) => {
      const subject = String(node.subject || "Unknown");
      subjectNodesCompleted[subject] =
        (subjectNodesCompleted[subject] || 0) + 1;
    });

    // Difficulty-specific completions
    const difficultyNodesCompleted: Record<string, number> = {};
    completedNodes.forEach((node) => {
      const difficulty = String(node.difficulty || "Unknown");
      difficultyNodesCompleted[difficulty] =
        (difficultyNodesCompleted[difficulty] || 0) + 1;
    });

    return {
      nodesCompleted,
      nodesCompletedToday,
      perfectNodes,
      checkpointsCompleted,
      nodeStreak,
      subjectNodesCompleted,
      difficultyNodesCompleted,
    };
  } catch (error) {
    console.error("Error calculating achievement context:", error);
    return {};
  }
}

/**
 * Calculate node streak (consecutive completions)
 * Simplified version: count recent completions in sequence
 */
function calculateNodeStreak(progress: any[]): number {
  if (progress.length === 0) return 0;

  // Sort by completion date (newest first)
  const sorted = [...progress]
    .filter((p) => p.completedAt)
    .sort(
      (a, b) =>
        new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
    );

  if (sorted.length === 0) return 0;

  // Count consecutive completions with stars >= 1
  let streak = 0;
  for (const p of sorted) {
    if (p.stars && p.stars >= 1) {
      streak++;
    } else {
      break; // Streak broken
    }
  }

  return streak;
}

/**
 * Get achievement notifications to send to frontend
 */
export interface AchievementNotification {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  gemsReward?: number;
  category: string;
}

/**
 * Check if specific achievement milestones are reached
 * Returns array of achievement IDs that should be unlocked
 */
export function checkSkillTreeAchievements(
  context: AchievementContext
): string[] {
  const unlockedIds: string[] = [];

  // Node completion milestones
  if (context.nodesCompleted === 1) unlockedIds.push("node-first");
  if (context.nodesCompleted === 5) unlockedIds.push("node-5");
  if (context.nodesCompleted === 10) unlockedIds.push("node-10");
  if (context.nodesCompleted === 25) unlockedIds.push("node-25");
  if (context.nodesCompleted === 50) unlockedIds.push("node-50");
  if (context.nodesCompleted === 100) unlockedIds.push("node-100");

  // Perfect node milestones
  if (context.perfectNodes === 1) unlockedIds.push("perfect-node");
  if (context.perfectNodes === 10) unlockedIds.push("perfect-10");

  // Checkpoint milestones
  if (context.checkpointsCompleted === 1) unlockedIds.push("checkpoint-master");
  if (context.checkpointsCompleted === 5)
    unlockedIds.push("checkpoint-champion");

  // Node streak milestones
  if (context.nodeStreak === 3) unlockedIds.push("node-streak-3");
  if (context.nodeStreak === 5) unlockedIds.push("node-streak-5");

  // Daily dedication
  if ((context.nodesCompletedToday || 0) === 3)
    unlockedIds.push("daily-dedicated");

  // Subject-specific
  const mathNodes = context.subjectNodesCompleted?.["Matematika"] || 0;
  if (mathNodes === 10) unlockedIds.push("math-tree-explorer");

  // Difficulty-specific
  const hardNodes = context.difficultyNodesCompleted?.["Sulit"] || 0;
  if (hardNodes === 5) unlockedIds.push("difficulty-master-hard");

  return unlockedIds;
}
