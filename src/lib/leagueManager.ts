/**
 * League Management System
 * Handles weekly resets, promotions, demotions, and league standings
 */

import { 
  LeagueTier, 
  LeagueUser, 
  WeeklyStandings, 
  PromotionResult,
  getLeague,
  getNextLeague,
  getPreviousLeague,
  calculateWeeklyRank,
  calculatePromotionDemotion,
  getCurrentWeekDates,
  isWeekEnded
} from "@/data/leagueSystem";

const STORAGE_KEY_STANDINGS = 'league_weekly_standings';
const STORAGE_KEY_LAST_RESET = 'league_last_reset';
const STORAGE_KEY_USER_LEAGUE = 'user_league_data';

interface StoredLeagueData {
  currentLeague: LeagueTier;
  weeklyXP: number;
  rank: number;
  previousRank?: number;
  trend?: 'up' | 'down' | 'same';
  lastUpdated: string;
}

/**
 * Get current weekly standings from localStorage
 */
export function getWeeklyStandings(): WeeklyStandings[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_STANDINGS);
    if (!stored) return [];
    
    const standings: WeeklyStandings[] = JSON.parse(stored);
    return standings;
  } catch (error) {
    console.error('Error loading weekly standings:', error);
    return [];
  }
}

/**
 * Save weekly standings to localStorage
 */
export function saveWeeklyStandings(standings: WeeklyStandings[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_STANDINGS, JSON.stringify(standings));
  } catch (error) {
    console.error('Error saving weekly standings:', error);
  }
}

/**
 * Get user's league data from localStorage
 */
export function getUserLeagueData(userId: string): StoredLeagueData | null {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_USER_LEAGUE}_${userId}`);
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading user league data:', error);
    return null;
  }
}

/**
 * Save user's league data to localStorage
 */
export function saveUserLeagueData(userId: string, data: StoredLeagueData): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_USER_LEAGUE}_${userId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user league data:', error);
  }
}

/**
 * Get last reset timestamp
 */
export function getLastResetTime(): string | null {
  return localStorage.getItem(STORAGE_KEY_LAST_RESET);
}

/**
 * Save reset timestamp
 */
export function saveResetTime(timestamp: string): void {
  localStorage.setItem(STORAGE_KEY_LAST_RESET, timestamp);
}

/**
 * Check if weekly reset is needed
 */
export function needsWeeklyReset(): boolean {
  const lastReset = getLastResetTime();
  
  if (!lastReset) {
    return true; // First time setup
  }
  
  const { end } = getCurrentWeekDates();
  return isWeekEnded(end);
}

/**
 * Add XP to user's weekly total
 */
export function addWeeklyXP(userId: string, xpGained: number, currentLeague: LeagueTier): void {
  const userData = getUserLeagueData(userId);
  
  const newData: StoredLeagueData = {
    currentLeague: userData?.currentLeague ?? currentLeague,
    weeklyXP: (userData?.weeklyXP ?? 0) + xpGained,
    rank: userData?.rank ?? 1,
    previousRank: userData?.previousRank,
    trend: userData?.trend,
    lastUpdated: new Date().toISOString(),
  };
  
  saveUserLeagueData(userId, newData);
}

/**
 * Update user's rank in current standings
 */
export function updateUserRank(users: LeagueUser[]): void {
  const rankedUsers = calculateWeeklyRank(users);
  
  rankedUsers.forEach(user => {
    const userData = getUserLeagueData(user.userId);
    
    const newData: StoredLeagueData = {
      currentLeague: user.currentLeague,
      weeklyXP: user.weeklyXP,
      rank: user.rank,
      previousRank: userData?.rank,
      trend: userData?.rank 
        ? (user.rank < userData.rank ? 'up' : user.rank > userData.rank ? 'down' : 'same')
        : 'same',
      lastUpdated: new Date().toISOString(),
    };
    
    saveUserLeagueData(user.userId, newData);
  });
}

/**
 * Perform weekly reset - calculate promotions and demotions
 */
export function performWeeklyReset(allUsers: LeagueUser[]): {
  results: Map<LeagueTier, PromotionResult>;
  timestamp: string;
} {
  // Group users by league
  const usersByLeague = new Map<LeagueTier, LeagueUser[]>();
  
  allUsers.forEach(user => {
    const league = user.currentLeague;
    if (!usersByLeague.has(league)) {
      usersByLeague.set(league, []);
    }
    usersByLeague.get(league)!.push(user);
  });
  
  // Calculate promotions/demotions for each league
  const results = new Map<LeagueTier, PromotionResult>();
  
  usersByLeague.forEach((users, league) => {
    const rankedUsers = calculateWeeklyRank(users);
    const weeklyStanding: WeeklyStandings = {
      weekStart: getCurrentWeekDates().start,
      weekEnd: getCurrentWeekDates().end,
      league,
      users: rankedUsers,
      lastUpdated: new Date(),
    };
    const result = calculatePromotionDemotion(weeklyStanding);
    results.set(league, result);
    
    // Update user data
    result.promoted.forEach(user => {
      const nextLeague = getNextLeague(league);
      if (nextLeague) {
        const newData: StoredLeagueData = {
          currentLeague: nextLeague,
          weeklyXP: 0, // Reset for new week
          rank: 1,
          previousRank: user.rank,
          trend: 'up',
          lastUpdated: new Date().toISOString(),
        };
        saveUserLeagueData(user.userId, newData);
      }
    });
    
    result.stayed.forEach(user => {
      const newData: StoredLeagueData = {
        currentLeague: league,
        weeklyXP: 0,
        rank: user.rank,
        previousRank: user.rank,
        trend: 'same',
        lastUpdated: new Date().toISOString(),
      };
      saveUserLeagueData(user.userId, newData);
    });
    
    result.demoted.forEach(user => {
      const prevLeague = getPreviousLeague(league);
      if (prevLeague) {
        const newData: StoredLeagueData = {
          currentLeague: prevLeague,
          weeklyXP: 0,
          rank: user.rank,
          previousRank: user.rank,
          trend: 'down',
          lastUpdated: new Date().toISOString(),
        };
        saveUserLeagueData(user.userId, newData);
      }
    });
  });
  
  // Save weekly standings
  const { start, end } = getCurrentWeekDates();
  const standings: WeeklyStandings[] = [];
  
  usersByLeague.forEach((users, league) => {
    standings.push({
      weekStart: start,
      weekEnd: end,
      league,
      users: calculateWeeklyRank(users),
      lastUpdated: new Date(),
    });
  });
  
  saveWeeklyStandings(standings);
  
  // Save reset timestamp
  const timestamp = new Date().toISOString();
  saveResetTime(timestamp);
  
  return { results, timestamp };
}

/**
 * Get promotion/demotion status for a user
 */
export function getUserPromotionStatus(
  userId: string, 
  currentRank: number, 
  currentLeague: LeagueTier
): 'will-promote' | 'safe' | 'will-demote' {
  if (currentRank <= 10 && getNextLeague(currentLeague)) {
    return 'will-promote';
  }
  if (currentRank <= 20) {
    return 'safe';
  }
  if (getPreviousLeague(currentLeague)) {
    return 'will-demote';
  }
  return 'safe';
}

/**
 * Get weekly rewards for user based on league
 */
export function getWeeklyRewards(league: LeagueTier, rank: number): {
  xp: number;
  gems?: number;
  title?: string;
} {
  const leagueData = getLeague(league);
  let rewards = {
    xp: leagueData.rewards.weekly,
    gems: 0,
    title: undefined as string | undefined,
  };
  
  // Bonus rewards for top performers
  if (rank === 1) {
    rewards.gems = 100;
    rewards.xp += leagueData.rewards.weekly; // Double XP
    rewards.title = `🏆 Juara ${leagueData.displayName}`;
  } else if (rank <= 3) {
    rewards.gems = 50;
    rewards.xp += Math.floor(leagueData.rewards.weekly * 0.5);
    rewards.title = `🥇 Top 3 ${leagueData.displayName}`;
  } else if (rank <= 10) {
    rewards.gems = 25;
    rewards.title = `⭐ Top 10 ${leagueData.displayName}`;
  }
  
  return rewards;
}

/**
 * Initialize league system for new user
 */
export function initializeUserLeague(userId: string, initialLeague: LeagueTier = 'bronze'): void {
  const existing = getUserLeagueData(userId);
  if (existing) return; // Already initialized
  
  const initialData: StoredLeagueData = {
    currentLeague: initialLeague,
    weeklyXP: 0,
    rank: 1,
    lastUpdated: new Date().toISOString(),
  };
  
  saveUserLeagueData(userId, initialData);
}

/**
 * Get leaderboard for specific league
 */
export function getLeagueLeaderboard(league: LeagueTier): LeagueUser[] {
  const standings = getWeeklyStandings();
  const leagueStanding = standings.find(s => s.league === league);
  
  if (!leagueStanding) return [];
  
  return leagueStanding.users;
}

/**
 * Auto-check and perform reset if needed
 */
export function autoCheckWeeklyReset(allUsers: LeagueUser[]): PromotionResult | null {
  if (!needsWeeklyReset()) {
    return null;
  }
  
  const { results } = performWeeklyReset(allUsers);
  
  // Return results for current user's league if available
  const firstResult = results.values().next().value;
  return firstResult ?? null;
}
