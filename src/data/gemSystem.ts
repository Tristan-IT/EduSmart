import { toast } from "sonner";

export interface GemTransaction {
  id: string;
  userId: string;
  type: "earn" | "spend";
  amount: number;
  reason: string;
  timestamp: string; // ISO date
  balance: number; // Balance after transaction
}

export interface GemEarningReason {
  type: "daily_login" | "achievement" | "perfect_quiz" | "league_promotion" | "daily_goal" | "module_completion" | "streak_milestone";
  amount: number;
  description: string;
}

export interface GemSpendingReason {
  type: "streak_freeze" | "streak_repair" | "unlimited_hearts" | "power_up" | "hint_token" | "time_warp";
  amount: number;
  description: string;
}

// Gem earning amounts
export const GEM_EARNINGS = {
  DAILY_LOGIN: { amount: 5, description: "Login harian" },
  ACHIEVEMENT_MILESTONE: { amount: 50, description: "Pencapaian milestone" },
  PERFECT_QUIZ: { amount: 10, description: "Quiz sempurna (100%)" },
  LEAGUE_PROMOTION_SILVER: { amount: 25, description: "Promosi ke Silver" },
  LEAGUE_PROMOTION_GOLD: { amount: 50, description: "Promosi ke Gold" },
  LEAGUE_PROMOTION_DIAMOND: { amount: 75, description: "Promosi ke Diamond" },
  LEAGUE_PROMOTION_PLATINUM: { amount: 100, description: "Promosi ke Platinum" },
  LEAGUE_PROMOTION_QUANTUM: { amount: 200, description: "Promosi ke Quantum" },
  DAILY_GOAL_CASUAL: { amount: 1, description: "Daily goal Casual" },
  DAILY_GOAL_REGULAR: { amount: 2, description: "Daily goal Regular" },
  DAILY_GOAL_SERIOUS: { amount: 5, description: "Daily goal Serious" },
  DAILY_GOAL_INTENSE: { amount: 10, description: "Daily goal Intense" },
  MODULE_COMPLETION_1_STAR: { amount: 3, description: "Modul selesai (1⭐)" },
  MODULE_COMPLETION_2_STAR: { amount: 5, description: "Modul selesai (2⭐)" },
  MODULE_COMPLETION_3_STAR: { amount: 10, description: "Modul selesai (3⭐)" },
  STREAK_7_DAYS: { amount: 15, description: "Streak 7 hari" },
  STREAK_14_DAYS: { amount: 30, description: "Streak 14 hari" },
  STREAK_30_DAYS: { amount: 75, description: "Streak 30 hari" },
  STREAK_100_DAYS: { amount: 250, description: "Streak 100 hari!" },
} as const;

// Gem spending amounts
export const GEM_COSTS = {
  STREAK_FREEZE: { amount: 10, description: "Streak Freeze (24h)" },
  STREAK_REPAIR: { amount: 50, description: "Streak Repair (pemulihan)" },
  UNLIMITED_HEARTS: { amount: 350, description: "Unlimited Hearts (30 menit)" },
  XP_BOOST: { amount: 100, description: "XP Boost 2x (30 menit)" },
  TIME_WARP: { amount: 25, description: "Time Warp (skip 1 jam refill)" },
  HINT_TOKEN: { amount: 30, description: "Hint Token (1 petunjuk)" },
} as const;

/**
 * Get gem transaction history for a user
 */
export function getGemTransactions(userId: string): GemTransaction[] {
  const stored = localStorage.getItem(`gem_transactions_${userId}`);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Add a gem transaction (earn or spend)
 */
export function addGemTransaction(
  userId: string,
  type: "earn" | "spend",
  amount: number,
  reason: string,
  currentBalance: number
): GemTransaction {
  const transaction: GemTransaction = {
    id: `gem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    amount,
    reason,
    timestamp: new Date().toISOString(),
    balance: type === "earn" ? currentBalance + amount : currentBalance - amount,
  };

  const transactions = getGemTransactions(userId);
  transactions.push(transaction);

  // Keep only last 100 transactions to avoid localStorage bloat
  const trimmed = transactions.slice(-100);
  localStorage.setItem(`gem_transactions_${userId}`, JSON.stringify(trimmed));

  return transaction;
}

/**
 * Earn gems with reason
 */
export function earnGems(
  userId: string,
  earning: keyof typeof GEM_EARNINGS,
  currentBalance: number,
  showToast: boolean = true
): number {
  const { amount, description } = GEM_EARNINGS[earning];
  
  addGemTransaction(userId, "earn", amount, description, currentBalance);
  
  if (showToast) {
    toast.success(`💎 +${amount} gems: ${description}`, {
      duration: 3000,
    });
  }

  return currentBalance + amount;
}

/**
 * Spend gems with reason
 */
export function spendGems(
  userId: string,
  cost: keyof typeof GEM_COSTS,
  currentBalance: number,
  showToast: boolean = true
): { success: boolean; newBalance: number; error?: string } {
  const { amount, description } = GEM_COSTS[cost];

  if (currentBalance < amount) {
    if (showToast) {
      toast.error(`Gems tidak cukup! Butuh ${amount} gems`, {
        duration: 3000,
      });
    }
    return { success: false, newBalance: currentBalance, error: "Insufficient gems" };
  }

  addGemTransaction(userId, "spend", amount, description, currentBalance);

  if (showToast) {
    toast.info(`💎 -${amount} gems: ${description}`, {
      duration: 3000,
    });
  }

  return { success: true, newBalance: currentBalance - amount };
}

/**
 * Get total gems earned and spent
 */
export function getGemStats(userId: string): {
  totalEarned: number;
  totalSpent: number;
  balance: number;
  transactionCount: number;
} {
  const transactions = getGemTransactions(userId);

  const totalEarned = transactions
    .filter((t) => t.type === "earn")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter((t) => t.type === "spend")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalEarned,
    totalSpent,
    balance: totalEarned - totalSpent,
    transactionCount: transactions.length,
  };
}

/**
 * Check if user has claimed daily login bonus today
 */
export function hasDailyLoginToday(userId: string): boolean {
  const today = new Date().toDateString();
  const lastClaim = localStorage.getItem(`daily_login_${userId}`);
  return lastClaim === today;
}

/**
 * Claim daily login bonus
 */
export function claimDailyLogin(userId: string, currentBalance: number): number | null {
  if (hasDailyLoginToday(userId)) {
    return null; // Already claimed today
  }

  const today = new Date().toDateString();
  localStorage.setItem(`daily_login_${userId}`, today);

  return earnGems(userId, "DAILY_LOGIN", currentBalance);
}

/**
 * Get gems for league promotion
 */
export function getLeaguePromotionGems(
  league: "silver" | "gold" | "diamond" | "platinum" | "quantum"
): { amount: number; description: string } {
  const mapping = {
    silver: GEM_EARNINGS.LEAGUE_PROMOTION_SILVER,
    gold: GEM_EARNINGS.LEAGUE_PROMOTION_GOLD,
    diamond: GEM_EARNINGS.LEAGUE_PROMOTION_DIAMOND,
    platinum: GEM_EARNINGS.LEAGUE_PROMOTION_PLATINUM,
    quantum: GEM_EARNINGS.LEAGUE_PROMOTION_QUANTUM,
  };

  return mapping[league];
}

/**
 * Get gems for module completion based on stars
 */
export function getModuleCompletionGems(stars: number): { amount: number; description: string } {
  if (stars === 3) return GEM_EARNINGS.MODULE_COMPLETION_3_STAR;
  if (stars === 2) return GEM_EARNINGS.MODULE_COMPLETION_2_STAR;
  if (stars === 1) return GEM_EARNINGS.MODULE_COMPLETION_1_STAR;
  return { amount: 0, description: "Tidak ada gems (0⭐)" };
}

/**
 * Get gems for daily goal based on target
 */
export function getDailyGoalGems(target: number): { amount: number; description: string } {
  if (target >= 100) return GEM_EARNINGS.DAILY_GOAL_INTENSE;
  if (target >= 50) return GEM_EARNINGS.DAILY_GOAL_SERIOUS;
  if (target >= 20) return GEM_EARNINGS.DAILY_GOAL_REGULAR;
  return GEM_EARNINGS.DAILY_GOAL_CASUAL;
}

/**
 * Get gems for streak milestone
 */
export function getStreakMilestoneGems(days: number): { amount: number; description: string } | null {
  if (days === 100) return GEM_EARNINGS.STREAK_100_DAYS;
  if (days === 30) return GEM_EARNINGS.STREAK_30_DAYS;
  if (days === 14) return GEM_EARNINGS.STREAK_14_DAYS;
  if (days === 7) return GEM_EARNINGS.STREAK_7_DAYS;
  return null;
}
