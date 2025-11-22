// League System - Duolingo-style Competitive Learning
// 6 Tiers: Bronze → Silver → Gold → Diamond → Platinum → Quantum

export type LeagueTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'platinum' | 'quantum';

export interface League {
  id: LeagueTier;
  name: string;
  displayName: string;
  color: {
    from: string;
    to: string;
    text: string;
    border: string;
    bg: string;
  };
  minXP: number; // Minimum XP to stay in this league
  promotionSlots: number; // Top N users get promoted
  demotionSlots: number; // Bottom N users get demoted
  rewards: {
    weekly: number; // XP bonus for staying
    promotion: number; // XP bonus for promotion
  };
  icon: string; // Will use Lucide icon names
}

export interface LeagueUser {
  userId: string;
  name: string;
  avatar: string;
  profileImage?: string;
  currentLeague: LeagueTier;
  weeklyXP: number; // XP earned this week
  totalXP: number;
  rank: number; // Current rank in league (1-based)
  previousRank?: number; // Previous week rank
  trend: 'up' | 'down' | 'same'; // Rank change
  streak: number;
}

export interface WeeklyStandings {
  weekStart: Date;
  weekEnd: Date;
  league: LeagueTier;
  users: LeagueUser[];
  lastUpdated: Date;
}

export interface PromotionResult {
  promoted: LeagueUser[]; // Changed from string[] to LeagueUser[]
  stayed: LeagueUser[];
  demoted: LeagueUser[];
}

// League Definitions
export const leagues: Record<LeagueTier, League> = {
  bronze: {
    id: 'bronze',
    name: 'Bronze',
    displayName: 'Liga Perunggu',
    color: {
      from: '#CD7F32',
      to: '#8B4513',
      text: 'text-orange-700',
      border: 'border-orange-600',
      bg: 'bg-gradient-to-br from-orange-600 to-orange-800',
    },
    minXP: 0,
    promotionSlots: 10,
    demotionSlots: 0, // Cannot demote from Bronze
    rewards: {
      weekly: 50,
      promotion: 200,
    },
    icon: 'Shield',
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    displayName: 'Liga Perak',
    color: {
      from: '#C0C0C0',
      to: '#808080',
      text: 'text-gray-700',
      border: 'border-gray-400',
      bg: 'bg-gradient-to-br from-gray-300 to-gray-500',
    },
    minXP: 500,
    promotionSlots: 10,
    demotionSlots: 10, // Bottom 10 demoted
    rewards: {
      weekly: 100,
      promotion: 300,
    },
    icon: 'Award',
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    displayName: 'Liga Emas',
    color: {
      from: '#FFD700',
      to: '#FFA500',
      text: 'text-yellow-700',
      border: 'border-yellow-500',
      bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    },
    minXP: 1500,
    promotionSlots: 10,
    demotionSlots: 10,
    rewards: {
      weekly: 200,
      promotion: 500,
    },
    icon: 'Trophy',
  },
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    displayName: 'Liga Berlian',
    color: {
      from: '#00CED1',
      to: '#4169E1',
      text: 'text-cyan-700',
      border: 'border-cyan-400',
      bg: 'bg-gradient-to-br from-cyan-400 to-blue-500',
    },
    minXP: 3000,
    promotionSlots: 10,
    demotionSlots: 10,
    rewards: {
      weekly: 350,
      promotion: 750,
    },
    icon: 'Gem',
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum',
    displayName: 'Liga Platinum',
    color: {
      from: '#E5E4E2',
      to: '#B19CD9',
      text: 'text-purple-700',
      border: 'border-purple-400',
      bg: 'bg-gradient-to-br from-purple-300 to-purple-600',
    },
    minXP: 5000,
    promotionSlots: 10,
    demotionSlots: 10,
    rewards: {
      weekly: 500,
      promotion: 1000,
    },
    icon: 'Crown',
  },
  quantum: {
    id: 'quantum',
    name: 'Quantum',
    displayName: 'Liga Quantum',
    color: {
      from: '#FF1493',
      to: '#8A2BE2',
      text: 'text-pink-700',
      border: 'border-pink-500',
      bg: 'bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500',
    },
    minXP: 10000,
    promotionSlots: 0, // Top league, no promotion
    demotionSlots: 10,
    rewards: {
      weekly: 1000,
      promotion: 0,
    },
    icon: 'Sparkles',
  },
};

// Helper Functions

/**
 * Get league by tier
 */
export const getLeague = (tier: LeagueTier): League => {
  return leagues[tier];
};

/**
 * Get next league tier
 */
export const getNextLeague = (currentTier: LeagueTier): LeagueTier | null => {
  const order: LeagueTier[] = ['bronze', 'silver', 'gold', 'diamond', 'platinum', 'quantum'];
  const currentIndex = order.indexOf(currentTier);
  if (currentIndex === order.length - 1) return null; // Already at top
  return order[currentIndex + 1];
};

/**
 * Get previous league tier
 */
export const getPreviousLeague = (currentTier: LeagueTier): LeagueTier | null => {
  const order: LeagueTier[] = ['bronze', 'silver', 'gold', 'diamond', 'platinum', 'quantum'];
  const currentIndex = order.indexOf(currentTier);
  if (currentIndex === 0) return null; // Already at bottom
  return order[currentIndex - 1];
};

/**
 * Calculate weekly rank based on XP
 */
export const calculateWeeklyRank = (users: LeagueUser[]): LeagueUser[] => {
  const sorted = [...users].sort((a, b) => b.weeklyXP - a.weeklyXP);
  return sorted.map((user, index) => ({
    ...user,
    rank: index + 1,
    trend: user.previousRank
      ? user.rank < user.previousRank
        ? 'up'
        : user.rank > user.previousRank
        ? 'down'
        : 'same'
      : 'same',
  }));
};

/**
 * Determine promotion/demotion based on weekly standings
 */
export const calculatePromotionDemotion = (
  standings: WeeklyStandings
): PromotionResult => {
  const league = getLeague(standings.league);
  const sortedUsers = calculateWeeklyRank(standings.users);

  const promoted: LeagueUser[] = [];
  const stayed: LeagueUser[] = [];
  const demoted: LeagueUser[] = [];

  sortedUsers.forEach((user) => {
    if (user.rank <= league.promotionSlots && getNextLeague(standings.league)) {
      // Top 10 get promoted (if not in top league)
      promoted.push(user);
    } else if (
      user.rank > 20 &&
      league.demotionSlots > 0 &&
      getPreviousLeague(standings.league)
    ) {
      // Rank 21+ get demoted (if not in bottom league)
      demoted.push(user);
    } else {
      // Rank 11-20 stay in same league
      stayed.push(user);
    }
  });

  return { promoted, stayed, demoted };
};

/**
 * Get week start and end dates
 */
export const getCurrentWeekDates = (): { start: Date; end: Date } => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Week starts Monday

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { start: weekStart, end: weekEnd };
};

/**
 * Check if current week has ended
 */
export const isWeekEnded = (weekEnd: Date): boolean => {
  return new Date() > weekEnd;
};

/**
 * Get time remaining in week
 */
export const getTimeRemainingInWeek = (): {
  days: number;
  hours: number;
  minutes: number;
} => {
  const { end } = getCurrentWeekDates();
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
};

/**
 * Get league tier based on total XP
 */
export const getLeagueTierByXP = (totalXP: number): LeagueTier => {
  if (totalXP >= leagues.quantum.minXP) return 'quantum';
  if (totalXP >= leagues.platinum.minXP) return 'platinum';
  if (totalXP >= leagues.diamond.minXP) return 'diamond';
  if (totalXP >= leagues.gold.minXP) return 'gold';
  if (totalXP >= leagues.silver.minXP) return 'silver';
  return 'bronze';
};

/**
 * Get XP needed for next league
 */
export const getXPForNextLeague = (currentTier: LeagueTier, currentXP: number): number => {
  const nextTier = getNextLeague(currentTier);
  if (!nextTier) return 0; // Already at top
  return leagues[nextTier].minXP - currentXP;
};

/**
 * Get progress percentage to next league
 */
export const getLeagueProgress = (currentTier: LeagueTier, currentXP: number): number => {
  const nextTier = getNextLeague(currentTier);
  if (!nextTier) return 100; // Already at top

  const currentLeagueMin = leagues[currentTier].minXP;
  const nextLeagueMin = leagues[nextTier].minXP;
  const xpRange = nextLeagueMin - currentLeagueMin;
  const xpInRange = currentXP - currentLeagueMin;

  return Math.min(100, Math.max(0, (xpInRange / xpRange) * 100));
};
