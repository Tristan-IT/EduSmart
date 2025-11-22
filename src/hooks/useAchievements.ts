/**
 * Achievement Notifications Hook
 * Manages achievement unlock notifications with stacking support
 */

import { useState, useCallback } from "react";
import { Achievement } from "@/components/AchievementUnlock";
import achievementManager, { AchievementContext } from "@/lib/achievementManager";

export function useAchievements() {
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([]);

  /**
   * Check for achievements based on context and trigger notifications
   */
  const checkAchievements = useCallback((context: AchievementContext) => {
    const newAchievements = achievementManager.checkAchievements(context);
    
    if (newAchievements.length > 0) {
      setPendingAchievements((prev) => [...prev, ...newAchievements]);
    }

    return newAchievements;
  }, []);

  /**
   * Remove an achievement from the pending list
   */
  const dismissAchievement = useCallback((achievementId: string) => {
    setPendingAchievements((prev) =>
      prev.filter((achievement) => achievement.id !== achievementId)
    );
  }, []);

  /**
   * Clear all pending achievements
   */
  const clearAll = useCallback(() => {
    setPendingAchievements([]);
  }, []);

  /**
   * Get all achievements with their progress
   */
  const getAllAchievements = useCallback(() => {
    return achievementManager.getAllAchievements();
  }, []);

  return {
    pendingAchievements,
    checkAchievements,
    dismissAchievement,
    clearAll,
    getAllAchievements,
  };
}
