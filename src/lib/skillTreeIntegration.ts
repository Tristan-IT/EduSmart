/**
 * Skill Tree Quiz Integration
 * 
 * This module handles the integration between quiz completion and skill tree progress.
 * When a student completes a quiz from a skill tree node, this module:
 * 1. Calculates the score and time spent
 * 2. Calls the progress API to mark node as completed
 * 3. Awards XP, gems, hearts, badges, and certificates
 * 4. Shows rewards modal with level-up notifications
 * 5. Returns next recommended nodes
 */

import { apiClient } from "./apiClient";

export interface QuizCompletionData {
  nodeId: string;
  nodeName: string;
  score: number; // 0-100
  timeSpent: number; // minutes
  correctAnswers: number;
  totalQuestions: number;
}

export interface SkillTreeRewards {
  xp: number;
  gems: number;
  hearts?: number;
  badge?: string;
  certificate?: string;
  stars: number; // 0-3
  levelUp?: boolean;
  newLevel?: number;
}

export interface UserStats {
  totalXP: number;
  level: number;
  gems: number;
  hearts: number;
  badges: string[];
  certificates: string[];
}

export interface NextRecommendation {
  nodeId: string;
  name: string;
  subject: string;
  level: number;
  difficulty: string;
}

export interface SkillTreeCompletionResult {
  success: boolean;
  progress: {
    status: string;
    stars: number;
    completedAt: string;
    attempts: number;
    bestScore: number;
  };
  rewards: SkillTreeRewards;
  userStats: UserStats;
  recommendations: NextRecommendation[];
  message?: string;
}

/**
 * Complete a skill tree node after quiz completion
 */
export async function completeSkillTreeNode(
  data: QuizCompletionData
): Promise<SkillTreeCompletionResult> {
  try {
    const response = await apiClient.post<SkillTreeCompletionResult>(
      '/api/progress/skill-tree/complete',
      {
        nodeId: data.nodeId,
        score: data.score,
        timeSpent: data.timeSpent
      }
    );

    return response;
  } catch (error: any) {
    console.error('Error completing skill tree node:', error);
    throw new Error(error.response?.data?.message || 'Gagal menyimpan progress');
  }
}

/**
 * Unlock a skill tree node (mark as in-progress)
 */
export async function unlockSkillTreeNode(nodeId: string): Promise<boolean> {
  try {
    await apiClient.post('/api/progress/skill-tree/unlock', { nodeId });
    return true;
  } catch (error: any) {
    console.error('Error unlocking skill tree node:', error);
    throw new Error(error.response?.data?.message || 'Gagal unlock node');
  }
}

/**
 * Get next recommended nodes after completion
 */
export async function getRecommendedNodes(limit: number = 3): Promise<NextRecommendation[]> {
  try {
    const response = await apiClient.get<{
      recommendations: NextRecommendation[];
      total: number;
    }>('/api/progress/skill-tree/recommendations?limit=' + limit);
    
    return response.recommendations || [];
  } catch (error: any) {
    console.error('Error getting recommendations:', error);
    return [];
  }
}

/**
 * Calculate stars based on score
 * 90%+ = 3 stars
 * 75%+ = 2 stars  
 * 60%+ = 1 star
 * <60% = 0 stars
 */
export function calculateStars(score: number): number {
  if (score >= 90) return 3;
  if (score >= 75) return 2;
  if (score >= 60) return 1;
  return 0;
}

/**
 * Format time spent for display
 */
export function formatTimeSpent(minutes: number): string {
  if (minutes < 1) return "< 1 menit";
  if (minutes === 1) return "1 menit";
  return `${Math.round(minutes)} menit`;
}

/**
 * Get performance message based on score
 */
export function getPerformanceMessage(score: number): string {
  if (score >= 95) return "Sempurna! Kamu menguasai materi ini! 🌟";
  if (score >= 85) return "Luar biasa! Terus pertahankan! 🎉";
  if (score >= 75) return "Bagus! Kamu sudah memahami sebagian besar materi! 👍";
  if (score >= 60) return "Cukup baik! Terus belajar ya! 💪";
  if (score >= 50) return "Hampir sampai! Coba lagi! 📚";
  return "Jangan menyerah! Pelajari lagi materi ini. 🔥";
}

/**
 * Check if quiz is from skill tree node
 */
export function isSkillTreeQuiz(location: any): boolean {
  return !!(
    location.state?.nodeId || 
    location.state?.fromSkillTree
  );
}

/**
 * Extract skill tree data from location state
 */
export function extractSkillTreeData(location: any): {
  nodeId?: string;
  nodeName?: string;
} {
  return {
    nodeId: location.state?.nodeId,
    nodeName: location.state?.nodeName
  };
}
