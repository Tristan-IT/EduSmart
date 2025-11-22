import SkillTreeNodeModel from '../models/SkillTreeNode.js';
import UserProgressModel from '../models/UserProgress.js';

/**
 * Difficulty Calibration Service
 * Analyzes student performance and adjusts node difficulty/rewards dynamically
 */

export interface NodePerformanceMetrics {
  nodeId: string;
  totalAttempts: number;
  uniqueStudents: number;
  completionRate: number; // % of students who attempted and passed
  averageScore: number;
  averageAttempts: number;
  averageTimeSpent: number;
  perfectScoreRate: number;
  dropoffRate: number; // % who attempted but never completed
  recommendedDifficulty: string;
  currentDifficulty: string;
  shouldAdjust: boolean;
  adjustmentReason?: string;
}

export interface DifficultyAdjustment {
  nodeId: string;
  oldDifficulty: string;
  newDifficulty: string;
  oldXpReward: number;
  newXpReward: number;
  oldGemsReward: number;
  newGemsReward: number;
  reason: string;
  confidence: number; // 0-100
}

const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert', 'hard'];

const DIFFICULTY_XP_MULTIPLIERS = {
  beginner: 1.0,
  intermediate: 1.5,
  advanced: 2.0,
  expert: 2.5,
  hard: 3.0
};

/**
 * Calculate performance metrics for a node
 */
export async function calculateNodeMetrics(nodeId: string): Promise<NodePerformanceMetrics> {
  try {
    const node = await SkillTreeNodeModel.findById(nodeId);
    if (!node) {
      throw new Error('Node not found');
    }

    // Get all student progress records that include this node
    const progressRecords = await UserProgressModel.find({
      'completedNodes.nodeId': nodeId
    });

    if (progressRecords.length === 0) {
      return {
        nodeId,
        totalAttempts: 0,
        uniqueStudents: 0,
        completionRate: 0,
        averageScore: 0,
        averageAttempts: 0,
        averageTimeSpent: 0,
        perfectScoreRate: 0,
        dropoffRate: 0,
        recommendedDifficulty: node.difficulty,
        currentDifficulty: node.difficulty,
        shouldAdjust: false
      };
    }

    // Aggregate metrics
    let totalAttempts = 0;
    let totalScore = 0;
    let totalTimeSpent = 0;
    let perfectScores = 0;
    let completedCount = 0;

    progressRecords.forEach(progress => {
      // UserProgress now stores per-node data directly
      if (progress.nodeId === nodeId && progress.status === 'completed') {
        totalAttempts += progress.attempts || 1;
        totalScore += progress.bestScore || 0;
        totalTimeSpent += progress.lessonTimeSpent || 0;
        if (progress.bestScore === 100) perfectScores++;
        if (progress.bestScore >= 70) completedCount++; // Assuming 70% is passing
      }
    });

    const uniqueStudents = progressRecords.length;
    const averageScore = totalScore / uniqueStudents;
    const averageAttempts = totalAttempts / uniqueStudents;
    const averageTimeSpent = totalTimeSpent / uniqueStudents;
    const completionRate = (completedCount / uniqueStudents) * 100;
    const perfectScoreRate = (perfectScores / uniqueStudents) * 100;
    const dropoffRate = ((uniqueStudents - completedCount) / uniqueStudents) * 100;

    // Determine recommended difficulty
    const { recommendedDifficulty, shouldAdjust, reason } = analyzeDifficultyFit(
      node.difficulty,
      averageScore,
      completionRate,
      averageAttempts,
      perfectScoreRate,
      dropoffRate
    );

    return {
      nodeId,
      totalAttempts,
      uniqueStudents,
      completionRate,
      averageScore,
      averageAttempts,
      averageTimeSpent,
      perfectScoreRate,
      dropoffRate,
      recommendedDifficulty,
      currentDifficulty: node.difficulty,
      shouldAdjust,
      adjustmentReason: reason
    };
  } catch (error) {
    console.error('Error calculating node metrics:', error);
    throw error;
  }
}

/**
 * Analyze if current difficulty matches actual performance
 */
function analyzeDifficultyFit(
  currentDifficulty: string,
  averageScore: number,
  completionRate: number,
  averageAttempts: number,
  perfectScoreRate: number,
  dropoffRate: number
): { recommendedDifficulty: string; shouldAdjust: boolean; reason?: string } {
  
  // Too Easy Indicators
  if (averageScore >= 90 && completionRate >= 85 && perfectScoreRate >= 40) {
    const currentIndex = DIFFICULTY_LEVELS.indexOf(currentDifficulty);
    if (currentIndex < DIFFICULTY_LEVELS.length - 1) {
      return {
        recommendedDifficulty: DIFFICULTY_LEVELS[currentIndex + 1],
        shouldAdjust: true,
        reason: 'Node is too easy - high scores and completion rate'
      };
    }
  }

  // Too Hard Indicators
  if (averageScore < 65 || completionRate < 40 || dropoffRate > 50 || averageAttempts > 3) {
    const currentIndex = DIFFICULTY_LEVELS.indexOf(currentDifficulty);
    if (currentIndex > 0) {
      return {
        recommendedDifficulty: DIFFICULTY_LEVELS[currentIndex - 1],
        shouldAdjust: true,
        reason: 'Node is too hard - low scores or high dropoff rate'
      };
    }
  }

  // Slightly Hard (could be one level easier)
  if (averageScore >= 65 && averageScore < 75 && completionRate < 60) {
    const currentIndex = DIFFICULTY_LEVELS.indexOf(currentDifficulty);
    if (currentIndex > 0) {
      return {
        recommendedDifficulty: DIFFICULTY_LEVELS[currentIndex - 1],
        shouldAdjust: true,
        reason: 'Node is slightly difficult - moderate scores with lower completion'
      };
    }
  }

  // Difficulty is appropriate
  return {
    recommendedDifficulty: currentDifficulty,
    shouldAdjust: false
  };
}

/**
 * Apply difficulty adjustment to a node
 */
export async function applyDifficultyAdjustment(
  nodeId: string,
  newDifficulty: string,
  autoAdjustRewards: boolean = true
): Promise<DifficultyAdjustment> {
  try {
    const node = await SkillTreeNodeModel.findById(nodeId);
    if (!node) {
      throw new Error('Node not found');
    }

    const oldDifficulty = node.difficulty;
    const oldXpReward = node.xpReward;
    const oldGemsReward = node.gemsReward || 5; // Default if not set

    // Calculate new rewards if auto-adjust enabled
    let newXpReward = oldXpReward;
    let newGemsReward = oldGemsReward;

    if (autoAdjustRewards) {
      const baseXp = 50; // Base XP for beginner
      const baseGems = 5; // Base gems for beginner
      
      const multiplier = DIFFICULTY_XP_MULTIPLIERS[newDifficulty as keyof typeof DIFFICULTY_XP_MULTIPLIERS] || 1.0;
      newXpReward = Math.round(baseXp * multiplier);
      newGemsReward = Math.round(baseGems * multiplier);
    }

    // Update node with type assertion for difficulty
    node.difficulty = newDifficulty as "Mudah" | "Sedang" | "Sulit";
    node.xpReward = newXpReward;
    node.gemsReward = newGemsReward;
    await node.save();

    // Calculate confidence based on sample size
    const metrics = await calculateNodeMetrics(nodeId);
    const confidence = Math.min(100, (metrics.uniqueStudents / 20) * 100);

    return {
      nodeId,
      oldDifficulty,
      newDifficulty,
      oldXpReward,
      newXpReward,
      oldGemsReward,
      newGemsReward,
      reason: metrics.adjustmentReason || 'Manual adjustment',
      confidence: Math.round(confidence)
    };
  } catch (error) {
    console.error('Error applying difficulty adjustment:', error);
    throw error;
  }
}

/**
 * Get calibration suggestions for all nodes
 */
export async function getCalibrationSuggestions(
  subject?: string,
  minStudents: number = 10
): Promise<NodePerformanceMetrics[]> {
  try {
    const query = subject ? { subject } : {};
    const nodes = await SkillTreeNodeModel.find(query);

    const suggestions: NodePerformanceMetrics[] = [];

    for (const node of nodes) {
      const metrics = await calculateNodeMetrics((node._id as any).toString());
      
      // Only include if enough data and adjustment recommended
      if (metrics.uniqueStudents >= minStudents && metrics.shouldAdjust) {
        suggestions.push(metrics);
      }
    }

    // Sort by confidence (more students = higher confidence)
    suggestions.sort((a, b) => b.uniqueStudents - a.uniqueStudents);

    return suggestions;
  } catch (error) {
    console.error('Error getting calibration suggestions:', error);
    throw error;
  }
}

/**
 * Auto-calibrate all eligible nodes
 */
export async function autoCalibrate(
  subject?: string,
  minStudents: number = 20,
  dryRun: boolean = false
): Promise<DifficultyAdjustment[]> {
  try {
    const suggestions = await getCalibrationSuggestions(subject, minStudents);
    const adjustments: DifficultyAdjustment[] = [];

    for (const suggestion of suggestions) {
      if (!dryRun) {
        const adjustment = await applyDifficultyAdjustment(
          suggestion.nodeId,
          suggestion.recommendedDifficulty,
          true
        );
        adjustments.push(adjustment);
      } else {
        // Simulate adjustment
        const node = await SkillTreeNodeModel.findById(suggestion.nodeId);
        if (node) {
          const multiplier = DIFFICULTY_XP_MULTIPLIERS[suggestion.recommendedDifficulty as keyof typeof DIFFICULTY_XP_MULTIPLIERS] || 1.0;
          adjustments.push({
            nodeId: suggestion.nodeId,
            oldDifficulty: suggestion.currentDifficulty,
            newDifficulty: suggestion.recommendedDifficulty,
            oldXpReward: node.xpReward,
            newXpReward: Math.round(50 * multiplier),
            oldGemsReward: node.gemsReward || 5,
            newGemsReward: Math.round(5 * multiplier),
            reason: suggestion.adjustmentReason || 'Auto-calibration',
            confidence: Math.min(100, (suggestion.uniqueStudents / 20) * 100)
          });
        }
      }
    }

    return adjustments;
  } catch (error) {
    console.error('Error in auto-calibrate:', error);
    throw error;
  }
}

/**
 * Get difficulty distribution across all nodes
 */
export async function getDifficultyDistribution(subject?: string): Promise<{
  distribution: Record<string, number>;
  totalNodes: number;
  averageScoreByDifficulty: Record<string, number>;
}> {
  try {
    const query = subject ? { subject } : {};
    const nodes = await SkillTreeNodeModel.find(query);

    const distribution: Record<string, number> = {};
    const scoresByDifficulty: Record<string, number[]> = {};

    for (const node of nodes) {
      const difficulty = node.difficulty;
      distribution[difficulty] = (distribution[difficulty] || 0) + 1;

      // Get average score for this difficulty
      const metrics = await calculateNodeMetrics((node._id as any).toString());
      if (!scoresByDifficulty[difficulty]) {
        scoresByDifficulty[difficulty] = [];
      }
      if (metrics.uniqueStudents > 0) {
        scoresByDifficulty[difficulty].push(metrics.averageScore);
      }
    }

    const averageScoreByDifficulty: Record<string, number> = {};
    Object.keys(scoresByDifficulty).forEach(difficulty => {
      const scores = scoresByDifficulty[difficulty];
      averageScoreByDifficulty[difficulty] = scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;
    });

    return {
      distribution,
      totalNodes: nodes.length,
      averageScoreByDifficulty
    };
  } catch (error) {
    console.error('Error getting difficulty distribution:', error);
    throw error;
  }
}
