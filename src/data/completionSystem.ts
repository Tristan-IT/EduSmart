import { UserProgress } from "./skillTree";
import { getModuleCompletionGems } from "./gemSystem";

/**
 * Calculate stars based on quiz score percentage
 * 90-100% = 3 stars
 * 75-89% = 2 stars
 * 60-74% = 1 star
 * <60% = 0 stars
 */
export function calculateStars(scorePercentage: number): number {
  if (scorePercentage >= 90) return 3;
  if (scorePercentage >= 75) return 2;
  if (scorePercentage >= 60) return 1;
  return 0;
}

/**
 * Calculate XP earned from module completion
 * Base XP is multiplied by star count:
 * - 0 stars: 50% of base XP
 * - 1 star: 75% of base XP
 * - 2 stars: 100% of base XP
 * - 3 stars: 125% of base XP
 */
export function calculateModuleXP(baseXP: number, stars: number): number {
  const multipliers = {
    0: 0.5,
    1: 0.75,
    2: 1.0,
    3: 1.25,
  };

  const multiplier = multipliers[stars as keyof typeof multipliers] || 0.5;
  return Math.round(baseXP * multiplier);
}

/**
 * Calculate gems earned from module completion based on stars
 */
export function calculateModuleGems(stars: number): number {
  const gemReward = getModuleCompletionGems(stars);
  return gemReward.amount;
}

/**
 * Update user progress after module completion
 */
export function updateModuleProgress(
  currentProgress: UserProgress[],
  nodeId: string,
  score: number,
  stars: number
): UserProgress[] {
  return currentProgress.map((progress) => {
    if (progress.nodeId === nodeId) {
      const isNewBest = score > progress.bestScore;
      
      return {
        ...progress,
        status: stars > 0 ? "completed" : progress.status,
        stars: Math.max(stars, progress.stars), // Keep highest star count
        bestScore: Math.max(score, progress.bestScore),
        completedAt: stars > 0 ? new Date() : progress.completedAt,
      };
    }
    return progress;
  });
}

/**
 * Get nodes that should be unlocked after completing a node
 */
export function getUnlockedNodes(
  nodeId: string,
  allProgress: UserProgress[],
  skillTreePaths: any[]
): string[] {
  const unlockedNodes: string[] = [];

  // Find all nodes that have this node as a prerequisite
  const dependentPaths = skillTreePaths.filter((path) => path.from === nodeId);

  for (const path of dependentPaths) {
    const targetNode = allProgress.find((p) => p.nodeId === path.to);
    
    if (targetNode && targetNode.status === "locked") {
      // Check if all prerequisites are met
      const allPrerequisitesMet = skillTreePaths
        .filter((p) => p.to === path.to)
        .every((p) => {
          const prereqNode = allProgress.find((prog) => prog.nodeId === p.from);
          return prereqNode && prereqNode.status === "completed";
        });

      if (allPrerequisitesMet) {
        unlockedNodes.push(path.to);
      }
    }
  }

  return unlockedNodes;
}

/**
 * Unlock nodes that are now accessible
 */
export function unlockNodes(
  currentProgress: UserProgress[],
  nodeIds: string[]
): UserProgress[] {
  return currentProgress.map((progress) => {
    if (nodeIds.includes(progress.nodeId) && progress.status === "locked") {
      return {
        ...progress,
        status: "current",
      };
    }
    return progress;
  });
}

/**
 * Complete module flow: calculate rewards, update progress, unlock nodes
 */
export function completeModule(params: {
  nodeId: string;
  score: number;
  baseXP: number;
  currentProgress: UserProgress[];
  skillTreePaths: any[];
}): {
  stars: number;
  xpEarned: number;
  gemsEarned: number;
  updatedProgress: UserProgress[];
  unlockedNodes: string[];
  isNewBestScore: boolean;
  previousBestScore: number;
} {
  const { nodeId, score, baseXP, currentProgress, skillTreePaths } = params;

  // Calculate stars and rewards
  const stars = calculateStars(score);
  const xpEarned = calculateModuleXP(baseXP, stars);
  const gemsEarned = calculateModuleGems(stars);

  // Get previous best score
  const previousProgress = currentProgress.find((p) => p.nodeId === nodeId);
  const previousBestScore = previousProgress?.bestScore || 0;
  const isNewBestScore = score > previousBestScore;

  // Update progress for completed module
  let updatedProgress = updateModuleProgress(currentProgress, nodeId, score, stars);

  // Get and unlock new nodes if module passed (stars > 0)
  const unlockedNodes = stars > 0 
    ? getUnlockedNodes(nodeId, updatedProgress, skillTreePaths)
    : [];

  if (unlockedNodes.length > 0) {
    updatedProgress = unlockNodes(updatedProgress, unlockedNodes);
  }

  return {
    stars,
    xpEarned,
    gemsEarned,
    updatedProgress,
    unlockedNodes,
    isNewBestScore,
    previousBestScore,
  };
}

/**
 * Save progress to localStorage
 */
export function saveProgress(userId: string, progress: UserProgress[]): void {
  localStorage.setItem(`user_progress_${userId}`, JSON.stringify(progress));
}

/**
 * Load progress from localStorage
 */
export function loadProgress(userId: string): UserProgress[] | null {
  const stored = localStorage.getItem(`user_progress_${userId}`);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Add XP to weekly total for league standings
 */
export function addWeeklyXP(userId: string, xpAmount: number): number {
  const key = `weekly_xp_${userId}`;
  const currentWeeklyXP = parseInt(localStorage.getItem(key) || "0", 10);
  const newWeeklyXP = currentWeeklyXP + xpAmount;
  
  localStorage.setItem(key, newWeeklyXP.toString());
  return newWeeklyXP;
}

/**
 * Check if score is perfect (100%)
 */
export function isPerfectScore(score: number): boolean {
  return score === 100;
}

/**
 * Get completion statistics
 */
export function getCompletionStats(progress: UserProgress[]): {
  totalModules: number;
  completedModules: number;
  totalStars: number;
  maxStars: number;
  completionPercentage: number;
  averageScore: number;
} {
  const totalModules = progress.length;
  const completedModules = progress.filter((p) => p.status === "completed").length;
  const totalStars = progress.reduce((sum, p) => sum + p.stars, 0);
  const maxStars = totalModules * 3;
  const completionPercentage = (completedModules / totalModules) * 100;
  
  const completedScores = progress
    .filter((p) => p.status === "completed")
    .map((p) => p.bestScore);
  
  const averageScore = completedScores.length > 0
    ? completedScores.reduce((sum, score) => sum + score, 0) / completedScores.length
    : 0;

  return {
    totalModules,
    completedModules,
    totalStars,
    maxStars,
    completionPercentage,
    averageScore,
  };
}
