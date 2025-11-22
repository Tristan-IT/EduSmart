import { Request, Response } from 'express';
import UserProgressModel from '../models/UserProgress.js';
import SkillTreeNodeModel from '../models/SkillTreeNode.js';
import UserModel from '../models/User.js';

/**
 * Recommendation Engine for Learning Paths
 * Analyzes student progress and suggests optimal next steps
 */

interface RecommendationScore {
  nodeId: string;
  score: number;
  reasons: string[];
}

/**
 * Calculate recommendation score for a node based on multiple factors
 */
export const calculateRecommendationScore = async (
  userId: string,
  node: any,
  userProgress: any,
  user: any
): Promise<RecommendationScore> => {
  let score = 0;
  const reasons: string[] = [];

  // Factor 1: Subject Affinity (20 points)
  // Prioritize subjects where user performs well
  const completedInSubject = userProgress.completedNodes.filter((cn: any) => {
    const completedNode = node.subject === cn.subject;
    return completedNode;
  });
  
  if (completedInSubject.length > 0) {
    const avgSubjectScore = completedInSubject.reduce((sum: number, cn: any) => sum + cn.score, 0) / completedInSubject.length;
    if (avgSubjectScore >= 85) {
      score += 20;
      reasons.push('Strong performance in this subject');
    } else if (avgSubjectScore >= 70) {
      score += 10;
      reasons.push('Good progress in this subject');
    }
  } else {
    score += 5;
    reasons.push('New subject to explore');
  }

  // Factor 2: Difficulty Matching (25 points)
  // Match difficulty to user's level and performance
  const userLevel = user.level || 1;
  const difficultyMapping: Record<string, number> = {
    beginner: 1,
    intermediate: 5,
    advanced: 10,
    expert: 15,
    hard: 20
  };

  const nodeDifficultyLevel = difficultyMapping[node.difficulty] || 1;
  const levelDiff = Math.abs(userLevel - nodeDifficultyLevel);

  if (levelDiff === 0) {
    score += 25;
    reasons.push('Perfect difficulty match for your level');
  } else if (levelDiff === 1) {
    score += 20;
    reasons.push('Appropriate difficulty for growth');
  } else if (levelDiff === 2) {
    score += 10;
    reasons.push('Slight challenge to advance skills');
  } else if (levelDiff > 5) {
    score -= 10;
    reasons.push('May be too challenging currently');
  }

  // Factor 3: Prerequisites Completion (30 points)
  // Heavily favor nodes where all prerequisites are met
  const completedNodeIds = userProgress.completedNodes.map((cn: any) => cn.nodeId.toString());
  const prerequisitesMet = node.prerequisites.every((prereq: string) => 
    completedNodeIds.includes(prereq.toString())
  );

  if (prerequisitesMet) {
    score += 30;
    reasons.push('All prerequisites completed');
  } else {
    const metCount = node.prerequisites.filter((prereq: string) => 
      completedNodeIds.includes(prereq.toString())
    ).length;
    const metPercentage = (metCount / node.prerequisites.length) * 100;
    
    if (metPercentage >= 50) {
      score += 15;
      reasons.push(`${Math.round(metPercentage)}% of prerequisites met`);
    } else {
      score -= 20;
      reasons.push('Prerequisites not yet completed');
    }
  }

  // Factor 4: Learning Path Continuity (15 points)
  // Favor nodes that continue current learning path
  const recentNodes = userProgress.completedNodes
    .slice(-3)
    .map((cn: any) => cn.nodeId.toString());
  
  const isContinuation = node.dependencies.some((dep: string) => 
    recentNodes.includes(dep.toString())
  );

  if (isContinuation) {
    score += 15;
    reasons.push('Continues your recent learning path');
  }

  // Factor 5: Time Investment (10 points)
  // Consider nodes that match user's typical study time
  const avgTimeSpent = userProgress.completedNodes.length > 0
    ? userProgress.completedNodes.reduce((sum: any, cn: any) => sum + (cn.timeSpent || 0), 0) / userProgress.completedNodes.length
    : 300;

  const estimatedTime = (node.lessonContent?.estimatedTime || 10) * 60; // Convert to seconds
  const timeDiff = Math.abs(estimatedTime - avgTimeSpent);

  if (timeDiff < 300) { // Within 5 minutes
    score += 10;
    reasons.push('Matches your typical study session');
  } else if (timeDiff < 600) { // Within 10 minutes
    score += 5;
  }

  // Factor 6: Reward Value (5 points)
  // Slightly favor high-reward nodes
  if (node.xpReward >= 100) {
    score += 5;
    reasons.push('High XP reward');
  } else if (node.xpReward >= 75) {
    score += 3;
  }

  // Factor 7: Streak Bonus (10 points)
  // Encourage daily engagement
  const today = new Date();
  const lastActivity = userProgress.lastActivityDate ? new Date(userProgress.lastActivityDate) : null;
  
  if (lastActivity) {
    const daysSinceActivity = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceActivity === 1) {
      score += 10;
      reasons.push('Continue your learning streak!');
    } else if (daysSinceActivity === 0) {
      score += 5;
      reasons.push('Keep the momentum going');
    }
  }

  // Factor 8: Checkpoint Progression (-5 to +10 points)
  // Balance checkpoint nodes vs regular nodes
  if (node.isCheckpoint) {
    const checkpointsCompleted = userProgress.checkpointsCompleted?.length || 0;
    if (checkpointsCompleted >= 3) {
      score += 10;
      reasons.push('Important checkpoint to unlock new areas');
    } else {
      score += 5;
      reasons.push('Checkpoint milestone');
    }
  }

  return {
    nodeId: node._id.toString(),
    score,
    reasons
  };
};

/**
 * Get personalized learning path recommendations
 */
export const getPathRecommendations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Fetch user data
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch user progress
    let userProgress = await UserProgressModel.findOne({ userId });
    if (!userProgress) {
      userProgress = await UserProgressModel.create({
        userId,
        completedNodes: [],
        currentStreak: 0,
        longestStreak: 0
      });
    }

    // Get all available nodes
    const allNodes = await SkillTreeNodeModel.find();

    // Filter out completed nodes
    const userProgressRecords = await UserProgressModel.find({ 
      user: userId, 
      status: 'completed' 
    });
    const completedNodeIds = userProgressRecords.map((p: any) => p.nodeId.toString());
    const incompleteNodes = allNodes.filter((node: any) => 
      !completedNodeIds.includes(node._id.toString())
    );

    // Calculate scores for all incomplete nodes
    const scoredNodes = await Promise.all(
      incompleteNodes.map(node => 
        calculateRecommendationScore(userId, node, userProgress, user)
      )
    );

    // Sort by score descending
    scoredNodes.sort((a, b) => b.score - a.score);

    // Get top 5 recommendations
    const topRecommendations = scoredNodes.slice(0, 5);

    // Fetch full node details for recommendations
    const recommendedNodes = await Promise.all(
      topRecommendations.map(async (scored) => {
        const node = allNodes.find((n: any) => n._id.toString() === scored.nodeId);
        return {
          ...node?.toObject(),
          recommendationScore: scored.score,
          recommendationReasons: scored.reasons
        };
      })
    );

    // Generate personalized insights
    const insights = generateInsights(userProgress, user, recommendedNodes);

    return res.status(200).json({
      success: true,
      recommendations: recommendedNodes,
      insights,
      userStats: {
        level: 1, // User model doesn't have level field yet
        xp: 0, // User model doesn't have xp field yet  
        completedNodes: completedNodeIds.length,
        currentStreak: 0, // Will be calculated from activity
        strongSubjects: getStrongSubjects(userProgressRecords),
        preferredDifficulty: getPreferredDifficulty(userProgressRecords)
      }
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Generate personalized insights based on progress patterns
 */
const generateInsights = (userProgress: any, user: any, recommendations: any[]): string[] => {
  const insights: string[] = [];

  // Completion rate insight
  const completedCount = userProgress.completedNodes.length;
  if (completedCount === 0) {
    insights.push("Welcome! Start with beginner nodes to build your foundation.");
  } else if (completedCount < 5) {
    insights.push("Great start! Complete a few more nodes to unlock advanced paths.");
  } else if (completedCount >= 10) {
    insights.push("You're making excellent progress! Keep up the momentum.");
  }

  // Streak insight
  if (userProgress.currentStreak >= 7) {
    insights.push("🔥 Amazing 7-day streak! You're developing a strong learning habit.");
  } else if (userProgress.currentStreak >= 3) {
    insights.push("Keep your streak alive! Try to complete at least one node daily.");
  }

  // Performance insight
  const avgScore = completedCount > 0
    ? userProgress.completedNodes.reduce((sum: number, cn: any) => sum + cn.score, 0) / completedCount
    : 0;

  if (avgScore >= 90) {
    insights.push("Outstanding performance! Consider trying harder difficulty levels.");
  } else if (avgScore >= 75) {
    insights.push("Solid performance! You're mastering the material well.");
  } else if (avgScore < 70 && completedCount > 3) {
    insights.push("Take your time reviewing lessons before quizzes for better scores.");
  }

  // Subject diversity insight
  const subjects = new Set(userProgress.completedNodes.map((cn: any) => cn.subject));
  if (subjects.size === 1 && completedCount >= 5) {
    insights.push("Try exploring different subjects to broaden your knowledge.");
  } else if (subjects.size >= 3) {
    insights.push("Great subject variety! Well-rounded learning approach.");
  }

  // Recommendation-specific insights
  if (recommendations.length > 0) {
    const topRec = recommendations[0];
    insights.push(`Next recommended: "${topRec.title}" - ${topRec.recommendationReasons[0]}`);
  }

  return insights;
};

/**
 * Identify strong subjects based on completion and scores
 */
const getStrongSubjects = (userProgress: any): string[] => {
  const subjectStats: Record<string, { count: number; avgScore: number }> = {};

  userProgress.completedNodes.forEach((cn: any) => {
    const subject = cn.subject || 'unknown';
    if (!subjectStats[subject]) {
      subjectStats[subject] = { count: 0, avgScore: 0 };
    }
    subjectStats[subject].count++;
    subjectStats[subject].avgScore += cn.score;
  });

  // Calculate averages
  Object.keys(subjectStats).forEach(subject => {
    subjectStats[subject].avgScore /= subjectStats[subject].count;
  });

  // Return subjects with good performance
  return Object.entries(subjectStats)
    .filter(([_, stats]) => stats.avgScore >= 80 && stats.count >= 3)
    .map(([subject]) => subject);
};

/**
 * Determine preferred difficulty based on completion patterns
 */
const getPreferredDifficulty = (userProgress: any): string => {
  const difficultyCount: Record<string, number> = {};

  userProgress.completedNodes.forEach((cn: any) => {
    const diff = cn.difficulty || 'beginner';
    difficultyCount[diff] = (difficultyCount[diff] || 0) + 1;
  });

  // Return most completed difficulty
  const preferred = Object.entries(difficultyCount).sort((a, b) => b[1] - a[1])[0];
  return preferred ? preferred[0] : 'beginner';
};

/**
 * Get recommended next nodes for a specific subject
 */
export const getSubjectRecommendations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const { subject } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await UserModel.findById(userId);
    let userProgress = await UserProgressModel.findOne({ userId });

    if (!userProgress) {
      userProgress = await UserProgressModel.create({
        userId,
        completedNodes: [],
        currentStreak: 0
      });
    }

    // Get nodes for specific subject
    const subjectNodes = await SkillTreeNodeModel.find({ subject });
    const userProgressRecords = await UserProgressModel.find({ 
      user: userId, 
      status: 'completed' 
    });
    const completedNodeIds = userProgressRecords.map((p: any) => p.nodeId.toString());
    const incompleteNodes = subjectNodes.filter((node: any) => 
      !completedNodeIds.includes(node._id.toString())
    );

    // Score and sort
    const scoredNodes = await Promise.all(
      incompleteNodes.map(node => 
        calculateRecommendationScore(userId, node, userProgress, user)
      )
    );

    scoredNodes.sort((a, b) => b.score - a.score);

    const recommendations = await Promise.all(
      scoredNodes.slice(0, 5).map(async (scored) => {
        const node = subjectNodes.find((n: any) => n._id.toString() === scored.nodeId);
        return {
          ...node?.toObject(),
          recommendationScore: scored.score,
          recommendationReasons: scored.reasons
        };
      })
    );

    return res.status(200).json({
      success: true,
      subject,
      recommendations,
      totalNodesInSubject: subjectNodes.length,
      completedInSubject: subjectNodes.length - incompleteNodes.length
    });
  } catch (error) {
    console.error('Error generating subject recommendations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate subject recommendations'
    });
  }
};
