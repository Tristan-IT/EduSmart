/**
 * Real API Integration
 * This file provides real API functions to replace mock API calls
 */

import { gamificationApi, skillTreeApi, achievementApi, quizApi } from "./apiClient";

// ========================================
// GAMIFICATION
// ========================================

/**
 * Get user's gamification profile
 */
export async function getGamifiedProfile() {
  try {
    const response = await gamificationApi.getProfile();
    return response.profile;
  } catch (error) {
    console.error("Error fetching gamification profile:", error);
    throw error;
  }
}

/**
 * Add XP to user
 */
export async function addUserXP(amount: number, reason: string) {
  try {
    const response = await gamificationApi.addXP(amount, reason);
    return response;
  } catch (error) {
    console.error("Error adding XP:", error);
    throw error;
  }
}

/**
 * Claim daily goal reward
 */
export async function claimDailyGoalReward() {
  try {
    const response = await gamificationApi.claimDailyGoal();
    return response;
  } catch (error) {
    console.error("Error claiming daily goal:", error);
    throw error;
  }
}

/**
 * Get gem balance
 */
export async function getUserGemBalance() {
  try {
    const response = await gamificationApi.getGemBalance();
    return response.balance;
  } catch (error) {
    console.error("Error getting gem balance:", error);
    throw error;
  }
}

/**
 * Check and unlock achievements
 */
export async function checkUserAchievements() {
  try {
    const response = await gamificationApi.checkAchievements();
    return response;
  } catch (error) {
    console.error("Error checking achievements:", error);
    throw error;
  }
}

// ========================================
// SKILL TREE
// ========================================

/**
 * Get user's skill tree with progress
 */
export async function getUserSkillTreeData() {
  try {
    const response = await skillTreeApi.getUserSkillTree();
    return response.skillTree;
  } catch (error) {
    console.error("Error fetching skill tree:", error);
    throw error;
  }
}

/**
 * Complete a lesson/node
 */
export async function completeLesson(nodeId: string, score: number) {
  try {
    const response = await skillTreeApi.completeNode(nodeId, score);
    return {
      status: response.success ? "success" : "error",
      xpEarned: response.xpEarned,
      stars: response.stars,
      leveledUp: response.leveledUp,
      newLevel: response.newLevel,
    };
  } catch (error) {
    console.error("Error completing lesson:", error);
    throw error;
  }
}

/**
 * Get skill tree progress
 */
export async function getSkillTreeProgress() {
  try {
    const response = await skillTreeApi.getProgress();
    return {
      completedNodes: response.completedNodes,
      totalNodes: response.totalNodes,
      progressPercentage: response.progressPercentage,
    };
  } catch (error) {
    console.error("Error getting skill tree progress:", error);
    throw error;
  }
}

// ========================================
// ACHIEVEMENTS
// ========================================

/**
 * Get all user achievements with progress
 */
export async function getAllUserAchievements() {
  try {
    const response = await achievementApi.getUserAchievements();
    return {
      achievements: response.achievements,
      unlockedCount: response.unlockedCount,
    };
  } catch (error) {
    console.error("Error fetching achievements:", error);
    throw error;
  }
}

/**
 * Get recently unlocked achievements
 */
export async function getRecentAchievements(limit = 5) {
  try {
    const response = await achievementApi.getRecent(limit);
    return response.achievements;
  } catch (error) {
    console.error("Error fetching recent achievements:", error);
    throw error;
  }
}

// ========================================
// QUIZ
// ========================================

/**
 * Get quiz questions for a topic
 */
export async function getQuizQuestionsForTopic(topicId: string, difficulty?: number, limit = 10) {
  try {
    const response = await quizApi.getQuestions(topicId, difficulty, limit);
    return response;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    throw error;
  }
}

/**
 * Submit quiz answers
 */
export async function submitQuizAnswers(submission: {
  topicId: string;
  answers: Array<{ questionId: string; userAnswer: string | string[] }>;
  timeSpent: number;
}) {
  try {
    const response = await quizApi.submitQuiz(submission);
    return response;
  } catch (error) {
    console.error("Error submitting quiz:", error);
    throw error;
  }
}

// ========================================
// COMPATIBILITY LAYER (for gradual migration)
// ========================================

/**
 * Mock API compatible wrapper
 * Use this to gradually migrate from mock API to real API
 */
export const realApi = {
  // Skill Tree
  getSkillTree: getUserSkillTreeData,
  completeLesson: async (lessonId: string, data: { score: number }) => {
    return completeLesson(lessonId, data.score);
  },
  claimStreakReward: claimDailyGoalReward,

  // Profile
  getGamifiedProfile,

  // Achievements (you can add more wrappers as needed)
  getAchievements: getAllUserAchievements,
};

export default realApi;
