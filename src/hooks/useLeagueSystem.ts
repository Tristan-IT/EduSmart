/**
 * Custom Hook for League Management
 */

import { useState, useEffect, useCallback } from "react";
import { LeagueTier, LeagueUser } from "@/data/leagueSystem";
import {
  getUserLeagueData,
  addWeeklyXP,
  updateUserRank,
  needsWeeklyReset,
  performWeeklyReset,
  getUserPromotionStatus,
  getWeeklyRewards,
  initializeUserLeague,
  autoCheckWeeklyReset,
} from "@/lib/leagueManager";

interface UseLeagueSystemOptions {
  userId: string;
  initialLeague?: LeagueTier;
  allUsers?: LeagueUser[];
}

interface LeagueState {
  currentLeague: LeagueTier;
  weeklyXP: number;
  rank: number;
  previousRank?: number;
  trend?: 'up' | 'down' | 'same';
  promotionStatus: 'will-promote' | 'safe' | 'will-demote';
  needsReset: boolean;
}

export function useLeagueSystem({ 
  userId, 
  initialLeague = 'bronze',
  allUsers = []
}: UseLeagueSystemOptions) {
  const [leagueState, setLeagueState] = useState<LeagueState>({
    currentLeague: initialLeague,
    weeklyXP: 0,
    rank: 1,
    promotionStatus: 'safe',
    needsReset: false,
  });

  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showDemotionModal, setShowDemotionModal] = useState(false);
  const [showStayModal, setShowStayModal] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  // Initialize user on mount
  useEffect(() => {
    initializeUserLeague(userId, initialLeague);
    loadLeagueState();
  }, [userId]);

  // Load league state from localStorage
  const loadLeagueState = useCallback(() => {
    const userData = getUserLeagueData(userId);
    
    if (userData) {
      const promotionStatus = getUserPromotionStatus(
        userId,
        userData.rank,
        userData.currentLeague
      );

      setLeagueState({
        currentLeague: userData.currentLeague,
        weeklyXP: userData.weeklyXP,
        rank: userData.rank,
        previousRank: userData.previousRank,
        trend: userData.trend,
        promotionStatus,
        needsReset: needsWeeklyReset(),
      });
    }
  }, [userId]);

  // Add XP and update rank
  const addXP = useCallback((xpGained: number) => {
    const userData = getUserLeagueData(userId);
    if (!userData) return;

    addWeeklyXP(userId, xpGained, userData.currentLeague);
    
    // Update rank if we have all users data
    if (allUsers.length > 0) {
      const updatedUsers = allUsers.map(user => 
        user.userId === userId 
          ? { ...user, weeklyXP: user.weeklyXP + xpGained }
          : user
      );
      updateUserRank(updatedUsers);
    }

    loadLeagueState();
  }, [userId, allUsers, loadLeagueState]);

  // Check and perform weekly reset
  const checkWeeklyReset = useCallback(() => {
    if (allUsers.length === 0) return;

    const resetResult = autoCheckWeeklyReset(allUsers);
    
    if (resetResult) {
      const currentUser = allUsers.find(u => u.userId === userId);
      if (!currentUser) return;

      const rewards = getWeeklyRewards(currentUser.currentLeague, currentUser.rank);
      const userData = getUserLeagueData(userId);
      if (!userData) return;

      // Determine which modal to show
      const wasPromoted = resetResult.promoted.some(u => u.userId === userId);
      const wasDemoted = resetResult.demoted.some(u => u.userId === userId);

      if (wasPromoted) {
        const newLeague = userData.currentLeague;
        const oldLeague = currentUser.currentLeague;
        
        setModalData({
          fromLeague: oldLeague,
          toLeague: newLeague,
          rank: currentUser.rank,
          weeklyXP: currentUser.weeklyXP,
          rewards,
        });
        setShowPromotionModal(true);
      } else if (wasDemoted) {
        const newLeague = userData.currentLeague;
        const oldLeague = currentUser.currentLeague;
        
        setModalData({
          fromLeague: oldLeague,
          toLeague: newLeague,
          rank: currentUser.rank,
          weeklyXP: currentUser.weeklyXP,
        });
        setShowDemotionModal(true);
      } else {
        setModalData({
          league: currentUser.currentLeague,
          rank: currentUser.rank,
          weeklyXP: currentUser.weeklyXP,
          rewards,
        });
        setShowStayModal(true);
      }

      loadLeagueState();
    }
  }, [userId, allUsers, loadLeagueState]);

  // Auto-check for reset on mount and interval
  useEffect(() => {
    checkWeeklyReset();

    // Check every hour
    const interval = setInterval(() => {
      if (needsWeeklyReset()) {
        checkWeeklyReset();
      }
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkWeeklyReset]);

  return {
    leagueState,
    addXP,
    checkWeeklyReset,
    loadLeagueState,
    modals: {
      promotion: {
        isOpen: showPromotionModal,
        onClose: () => setShowPromotionModal(false),
        data: modalData,
      },
      demotion: {
        isOpen: showDemotionModal,
        onClose: () => setShowDemotionModal(false),
        data: modalData,
      },
      stay: {
        isOpen: showStayModal,
        onClose: () => setShowStayModal(false),
        data: modalData,
      },
    },
  };
}
