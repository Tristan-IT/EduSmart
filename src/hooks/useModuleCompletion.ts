import { useState, useCallback } from "react";
import { UserProgress, skillTreePaths } from "@/data/skillTree";
import {
  completeModule,
  saveProgress,
  addWeeklyXP,
  isPerfectScore,
} from "@/data/completionSystem";
import { earnGems, GEM_EARNINGS } from "@/data/gemSystem";
import { toast } from "sonner";

interface UseModuleCompletionParams {
  userId: string;
  currentProgress: UserProgress[];
  onProgressUpdate: (progress: UserProgress[]) => void;
  onXPGained: (amount: number) => void;
  onGemsGained: (amount: number) => void;
}

export function useModuleCompletion({
  userId,
  currentProgress,
  onProgressUpdate,
  onXPGained,
  onGemsGained,
}: UseModuleCompletionParams) {
  const [completionData, setCompletionData] = useState<{
    moduleTitle: string;
    score: number;
    stars: number;
    xpEarned: number;
    gemsEarned: number;
    unlockedNodes: string[];
    isNewBestScore: boolean;
    previousBestScore: number;
  } | null>(null);

  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const handleModuleComplete = useCallback(
    (params: {
      nodeId: string;
      moduleTitle: string;
      score: number;
      baseXP: number;
    }) => {
      const { nodeId, moduleTitle, score, baseXP } = params;

      // Complete the module and get all rewards/updates
      const result = completeModule({
        nodeId,
        score,
        baseXP,
        currentProgress,
        skillTreePaths,
      });

      const {
        stars,
        xpEarned,
        gemsEarned: moduleGems,
        updatedProgress,
        unlockedNodes,
        isNewBestScore,
        previousBestScore,
      } = result;

      // Add bonus gems for perfect score
      let totalGemsEarned = moduleGems;
      if (isPerfectScore(score)) {
        const perfectBonus = GEM_EARNINGS.PERFECT_QUIZ.amount;
        totalGemsEarned += perfectBonus;
        toast.success(`🎯 Perfect Score! +${perfectBonus} bonus gems!`, {
          duration: 4000,
        });
      }

      // Update progress
      onProgressUpdate(updatedProgress);
      saveProgress(userId, updatedProgress);

      // Award XP and gems
      onXPGained(xpEarned);
      onGemsGained(totalGemsEarned);

      // Add to weekly XP for league
      addWeeklyXP(userId, xpEarned);

      // Record gem transactions
      if (moduleGems > 0) {
        earnGems(userId, stars === 3 ? "MODULE_COMPLETION_3_STAR" : stars === 2 ? "MODULE_COMPLETION_2_STAR" : "MODULE_COMPLETION_1_STAR", 0, false);
      }

      if (isPerfectScore(score)) {
        earnGems(userId, "PERFECT_QUIZ", 0, false);
      }

      // Set completion data for modal
      setCompletionData({
        moduleTitle,
        score,
        stars,
        xpEarned,
        gemsEarned: totalGemsEarned,
        unlockedNodes,
        isNewBestScore,
        previousBestScore,
      });

      // Show completion modal
      setShowCompletionModal(true);

      // Show unlock toasts
      if (unlockedNodes.length > 0) {
        toast.success(
          `🔓 ${unlockedNodes.length} modul baru terbuka!`,
          { duration: 4000 }
        );
      }

      return result;
    },
    [userId, currentProgress, onProgressUpdate, onXPGained, onGemsGained]
  );

  const closeCompletionModal = useCallback(() => {
    setShowCompletionModal(false);
    setCompletionData(null);
  }, []);

  return {
    completionData,
    showCompletionModal,
    handleModuleComplete,
    closeCompletionModal,
  };
}
