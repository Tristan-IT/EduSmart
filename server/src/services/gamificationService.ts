import StudentProfileModel from "../models/StudentProfile.js";
import GemTransactionModel from "../models/GemTransaction.js";
import UserAchievementModel from "../models/UserAchievement.js";
import AchievementModel from "../models/Achievement.js";
import { Types } from "mongoose";
import { notifyAchievement } from "./notificationService.js";

/**
 * Calculate XP needed for next level
 * Formula: 100 * level^1.5
 */
function calculateXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Add XP to user and handle level ups
 */
export async function addXP(userId: string | Types.ObjectId, amount: number, reason: string) {
  try {
    const profile = await StudentProfileModel.findOne({ user: userId });
    
    if (!profile) {
      throw new Error("Student profile not found");
    }

    let newXP = profile.xp + amount;
    let newLevel = profile.level;
    let newXPInLevel = profile.xpInLevel + amount;
    let newXPForNextLevel = profile.xpForNextLevel;
    let leveledUp = false;
    let levelsGained = 0;

    // Check for level ups
    while (newXPInLevel >= newXPForNextLevel) {
      newXPInLevel -= newXPForNextLevel;
      newLevel += 1;
      levelsGained += 1;
      leveledUp = true;
      newXPForNextLevel = calculateXPForLevel(newLevel);
    }

    // Update profile
    profile.xp = newXP;
    profile.level = newLevel;
    profile.xpInLevel = newXPInLevel;
    profile.xpForNextLevel = newXPForNextLevel;
    profile.dailyGoalProgress += amount;

    // Check if daily goal met
    if (profile.dailyGoalProgress >= profile.dailyGoalXP && !profile.dailyGoalMet) {
      profile.dailyGoalMet = true;
    }

    await profile.save();

    return {
      success: true,
      xpAdded: amount,
      newXP,
      leveledUp,
      levelsGained,
      newLevel,
      reason,
      dailyGoalProgress: profile.dailyGoalProgress,
      dailyGoalMet: profile.dailyGoalMet,
    };
  } catch (error) {
    console.error("Error adding XP:", error);
    throw error;
  }
}

/**
 * Update daily streak
 */
export async function updateStreak(userId: string | Types.ObjectId) {
  try {
    const profile = await StudentProfileModel.findOne({ user: userId });
    
    if (!profile) {
      throw new Error("Student profile not found");
    }

    const now = new Date();
    const lastCompleted = profile.lastCompletedAt;

    if (!lastCompleted) {
      // First time
      profile.streak = 1;
      profile.bestStreak = 1;
      profile.lastCompletedAt = now;
    } else {
      const hoursSinceLastActivity = (now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastActivity < 24) {
        // Same day, no streak change
        return { streakUpdated: false, streak: profile.streak };
      } else if (hoursSinceLastActivity < 48) {
        // Next day, increment streak
        profile.streak += 1;
        if (profile.streak > profile.bestStreak) {
          profile.bestStreak = profile.streak;
        }
        profile.lastCompletedAt = now;
      } else {
        // Streak broken
        profile.streak = 1;
        profile.lastCompletedAt = now;
      }
    }

    await profile.save();

    return {
      streakUpdated: true,
      streak: profile.streak,
      bestStreak: profile.bestStreak,
    };
  } catch (error) {
    console.error("Error updating streak:", error);
    throw error;
  }
}

/**
 * Claim daily goal reward
 */
export async function claimDailyGoal(userId: string | Types.ObjectId) {
  try {
    const profile = await StudentProfileModel.findOne({ user: userId });
    
    if (!profile) {
      throw new Error("Student profile not found");
    }

    if (!profile.dailyGoalMet) {
      throw new Error("Daily goal not yet met");
    }

    if (profile.dailyGoalClaimed) {
      throw new Error("Daily goal already claimed");
    }

    // Award bonus XP and gems based on streak
    const bonusXP = 50 + (profile.streak * 5);
    const bonusGems = Math.floor(profile.streak / 7) + 1; // 1 gem per week of streak

    // Update profile
    profile.dailyGoalClaimed = true;
    profile.xp += bonusXP;
    profile.xpInLevel += bonusXP;
    
    // Check for level up
    let leveledUp = false;
    if (profile.xpInLevel >= profile.xpForNextLevel) {
      profile.xpInLevel -= profile.xpForNextLevel;
      profile.level += 1;
      profile.xpForNextLevel = calculateXPForLevel(profile.level);
      leveledUp = true;
    }

    await profile.save();

    // Add gems
    await addGems(userId, bonusGems, "daily_goal_claimed");

    // Update streak
    await updateStreak(userId);

    return {
      success: true,
      bonusXP,
      bonusGems,
      streak: profile.streak,
      leveledUp,
      newLevel: profile.level,
    };
  } catch (error) {
    console.error("Error claiming daily goal:", error);
    throw error;
  }
}

/**
 * Add gems to user balance
 */
export async function addGems(userId: string | Types.ObjectId, amount: number, reason: string) {
  try {
    // Get current balance
    const lastTransaction = await GemTransactionModel.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .limit(1);

    const currentBalance = lastTransaction ? lastTransaction.balance : 0;
    const newBalance = currentBalance + amount;

    // Create transaction
    const transaction = await GemTransactionModel.create({
      user: userId,
      type: "earn",
      amount,
      reason,
      balance: newBalance,
    });

    return {
      success: true,
      amount,
      balance: newBalance,
      transaction,
    };
  } catch (error) {
    console.error("Error adding gems:", error);
    throw error;
  }
}

/**
 * Spend gems from user balance
 */
export async function spendGems(userId: string | Types.ObjectId, amount: number, reason: string) {
  try {
    // Get current balance
    const lastTransaction = await GemTransactionModel.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .limit(1);

    const currentBalance = lastTransaction ? lastTransaction.balance : 0;

    if (currentBalance < amount) {
      throw new Error("Insufficient gems");
    }

    const newBalance = currentBalance - amount;

    // Create transaction
    const transaction = await GemTransactionModel.create({
      user: userId,
      type: "spend",
      amount,
      reason,
      balance: newBalance,
    });

    return {
      success: true,
      amount,
      balance: newBalance,
      transaction,
    };
  } catch (error) {
    console.error("Error spending gems:", error);
    throw error;
  }
}

/**
 * Get gem balance
 */
export async function getGemBalance(userId: string | Types.ObjectId) {
  try {
    const lastTransaction = await GemTransactionModel.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .limit(1);

    return lastTransaction ? lastTransaction.balance : 0;
  } catch (error) {
    console.error("Error getting gem balance:", error);
    throw error;
  }
}

/**
 * Get gem transaction history
 */
export async function getGemHistory(userId: string | Types.ObjectId, limit = 50) {
  try {
    const transactions = await GemTransactionModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    return transactions;
  } catch (error) {
    console.error("Error getting gem history:", error);
    throw error;
  }
}

/**
 * Reset daily goals (called by CRON at midnight)
 */
export async function resetDailyGoals() {
  try {
    const result = await StudentProfileModel.updateMany(
      {},
      {
        $set: {
          dailyGoalProgress: 0,
          dailyGoalMet: false,
          dailyGoalClaimed: false,
        },
      }
    );

    console.log(`Reset daily goals for ${result.modifiedCount} students`);
    return result;
  } catch (error) {
    console.error("Error resetting daily goals:", error);
    throw error;
  }
}

/**
 * Check and unlock achievements
 */
export async function checkAchievements(userId: string | Types.ObjectId) {
  try {
    const profile = await StudentProfileModel.findOne({ user: userId });
    if (!profile) {
      throw new Error("Student profile not found");
    }

    // Get all achievements
    const allAchievements = await AchievementModel.find({});
    
    // Get user's current achievements
    const userAchievements = await UserAchievementModel.find({ user: userId }).populate('achievement');
    const unlockedIds = new Set(
      userAchievements.filter(ua => ua.unlocked).map(ua => {
        const ach = ua.achievement as any;
        return ach.achievementId;
      })
    );

    const newlyUnlocked = [];

    // Check each achievement
    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.achievementId)) {
        continue; // Already unlocked
      }

      let shouldUnlock = false;
      let progress = 0;
      const total = achievement.conditionValue;

      // Check conditions based on type
      switch (achievement.conditionType) {
        case "streak":
          progress = profile.streak;
          shouldUnlock = profile.streak >= achievement.conditionValue;
          break;
        case "total_xp":
          progress = profile.xp;
          shouldUnlock = profile.xp >= achievement.conditionValue;
          break;
        // Add more condition types as needed
      }

      // Create or update user achievement
      const userAch = await UserAchievementModel.findOneAndUpdate(
        { user: userId, achievement: achievement._id },
        {
          progress,
          total,
          unlocked: shouldUnlock,
          unlockedAt: shouldUnlock ? new Date() : undefined,
        },
        { upsert: true, new: true }
      );

      if (shouldUnlock && !unlockedIds.has(achievement.achievementId)) {
        newlyUnlocked.push({
          achievement,
          xpReward: achievement.xpReward,
          gemsReward: achievement.gemsReward,
        });

        // Award XP and gems
        await addXP(userId, achievement.xpReward, `Achievement unlocked: ${achievement.title}`);
        await addGems(userId, achievement.gemsReward, `Achievement unlocked: ${achievement.title}`);

        // Notify student about achievement unlock
        try {
          await notifyAchievement(
            userId.toString(),
            achievement.title,
            achievement.description
          );
          console.log(`[Notification] Student notified about achievement: ${achievement.title}`);
        } catch (notifError) {
          console.error('Failed to send achievement notification:', notifError);
        }
      }
    }

    return {
      newlyUnlocked,
      totalUnlocked: unlockedIds.size + newlyUnlocked.length,
    };
  } catch (error) {
    console.error("Error checking achievements:", error);
    throw error;
  }
}
