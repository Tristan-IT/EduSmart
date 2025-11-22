import AchievementModel from "../models/Achievement.js";
import UserAchievementModel from "../models/UserAchievement.js";
import { Types } from "mongoose";

/**
 * Get all achievement definitions
 */
export async function getAllAchievements() {
  try {
    const achievements = await AchievementModel.find({}).sort({ category: 1, conditionValue: 1 });
    return achievements;
  } catch (error) {
    console.error("Error getting achievements:", error);
    throw error;
  }
}

/**
 * Get user's achievements with progress
 */
export async function getUserAchievements(userId: string | Types.ObjectId) {
  try {
    const userAchievements = await UserAchievementModel.find({ user: userId })
      .populate("achievement")
      .sort({ unlocked: -1, "achievement.category": 1 });

    return userAchievements;
  } catch (error) {
    console.error("Error getting user achievements:", error);
    throw error;
  }
}

/**
 * Get unlocked achievements count
 */
export async function getUnlockedCount(userId: string | Types.ObjectId) {
  try {
    const count = await UserAchievementModel.countDocuments({
      user: userId,
      unlocked: true,
    });

    return count;
  } catch (error) {
    console.error("Error getting unlocked count:", error);
    throw error;
  }
}

/**
 * Get achievements by category
 */
export async function getAchievementsByCategory(category: string) {
  try {
    const achievements = await AchievementModel.find({ category }).sort({ conditionValue: 1 });
    return achievements;
  } catch (error) {
    console.error("Error getting achievements by category:", error);
    throw error;
  }
}

/**
 * Get recently unlocked achievements
 */
export async function getRecentlyUnlocked(userId: string | Types.ObjectId, limit = 5) {
  try {
    const recent = await UserAchievementModel.find({
      user: userId,
      unlocked: true,
    })
      .populate("achievement")
      .sort({ unlockedAt: -1 })
      .limit(limit);

    return recent;
  } catch (error) {
    console.error("Error getting recently unlocked achievements:", error);
    throw error;
  }
}
