/**
 * Example Integration of Achievement System
 * 
 * This file demonstrates how to use the achievement unlock system
 * throughout the Adapti Belajar application.
 */

import { useAchievements } from "@/hooks/useAchievements";
import { AchievementUnlock } from "@/components/AchievementUnlock";
import achievementManager from "@/lib/achievementManager";

/**
 * USAGE EXAMPLE 1: In Quiz Component
 * 
 * Check for achievements when a quiz is completed
 */
export function QuizCompletionExample() {
  const { pendingAchievements, checkAchievements, dismissAchievement } = useAchievements();

  const handleQuizComplete = (score: number, timeSpent: number) => {
    // Check for achievements
    const newAchievements = checkAchievements({
      quizCount: 1, // User completed a quiz
      quizPerfectCount: score === 100 ? 1 : 0,
      speedRecords: timeSpent < 120 ? [timeSpent] : [], // 2 minutes = 120 seconds
      currentHour: new Date().getHours(),
    });

    // Achievements will automatically display via the AchievementUnlock component
    console.log("Unlocked achievements:", newAchievements);
  };

  return (
    <>
      {/* Add this component to your layout/page */}
      <AchievementUnlock
        achievements={pendingAchievements}
        onClose={dismissAchievement}
      />
      
      {/* Your quiz UI here */}
    </>
  );
}

/**
 * USAGE EXAMPLE 2: In Streak Tracker
 * 
 * Check for streak-based achievements
 */
export function StreakUpdateExample() {
  const { checkAchievements } = useAchievements();

  const handleStreakUpdate = (newStreak: number) => {
    checkAchievements({
      streak: newStreak,
    });
  };

  return null; // Component logic
}

/**
 * USAGE EXAMPLE 3: In Module Completion
 * 
 * Check for mastery and completion achievements
 */
export function ModuleCompletionExample() {
  const { checkAchievements } = useAchievements();

  const handleModuleComplete = (category: string, mastery: number) => {
    checkAchievements({
      moduleCount: 1,
      categoryMastery: {
        [category.toLowerCase()]: mastery,
      },
    });
  };

  return null; // Component logic
}

/**
 * USAGE EXAMPLE 4: Weekly XP Tracking
 * 
 * Check for weekly XP achievements
 */
export function WeeklyXPExample() {
  const { checkAchievements } = useAchievements();

  const handleWeeklyXPUpdate = (totalWeeklyXP: number) => {
    checkAchievements({
      weeklyXP: totalWeeklyXP,
    });
  };

  return null; // Component logic
}

/**
 * USAGE EXAMPLE 5: In Main App/Layout
 * 
 * Add the AchievementUnlock component to your main layout
 * so it shows achievements from anywhere in the app
 */
export function AppLayoutExample() {
  const { pendingAchievements, dismissAchievement } = useAchievements();

  return (
    <div>
      {/* Your main app content */}
      
      {/* Achievement notifications - add this once in your main layout */}
      <AchievementUnlock
        achievements={pendingAchievements}
        onClose={dismissAchievement}
      />
    </div>
  );
}

/**
 * USAGE EXAMPLE 6: Manual Achievement Check
 * 
 * Check all achievements for a user (e.g., on page load)
 */
export function ManualCheckExample() {
  const { checkAchievements } = useAchievements();

  const checkAllAchievements = (userData: {
    quizCount: number;
    streak: number;
    categoryMastery: Record<string, number>;
    weeklyXP: number;
  }) => {
    checkAchievements({
      quizCount: userData.quizCount,
      streak: userData.streak,
      categoryMastery: userData.categoryMastery,
      weeklyXP: userData.weeklyXP,
      currentHour: new Date().getHours(),
    });
  };

  return null; // Component logic
}

/**
 * INTEGRATION CHECKLIST:
 * 
 * 1. ✅ Add AchievementUnlock component to your main layout (App.tsx or _app.tsx)
 * 2. ✅ Use useAchievements hook in components that trigger achievements
 * 3. ✅ Call checkAchievements() with relevant context when events occur:
 *    - Quiz completion
 *    - Module completion
 *    - Streak updates
 *    - Weekly XP milestones
 *    - Time-based events
 * 4. ✅ Achievement notifications will automatically stack and display
 * 5. ✅ Users can configure sound effects in Profile > Settings
 * 
 * QUICK INTEGRATION SNIPPETS:
 * 
 * // In App.tsx or main layout:
 * import { useAchievements } from "@/hooks/useAchievements";
 * import { AchievementUnlock } from "@/components/AchievementUnlock";
 * 
 * const { pendingAchievements, dismissAchievement } = useAchievements();
 * 
 * return (
 *   <div>
 *     {/* your app */}
 *     <AchievementUnlock 
 *       achievements={pendingAchievements} 
 *       onClose={dismissAchievement} 
 *     />
 *   </div>
 * );
 * 
 * // In any component that needs to trigger achievements:
 * import { useAchievements } from "@/hooks/useAchievements";
 * 
 * const { checkAchievements } = useAchievements();
 * 
 * // When an event happens:
 * checkAchievements({ 
 *   quizCount: 1, 
 *   currentHour: new Date().getHours() 
 * });
 */

// Export utility functions for direct use
export { achievementManager };
