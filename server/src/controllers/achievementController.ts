import { Request, Response } from "express";
import UserAchievementModel from "../models/UserAchievement.js";

/**
 * Get student's achievements
 * GET /api/achievements/student/me
 */
export const getMyAchievements = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Get all achievements for the student
    const achievements = await UserAchievementModel.find({ user: userId })
      .populate("achievement", "name description icon category")
      .select("achievement unlocked unlockedAt progress total");

    // Filter only unlocked achievements
    const unlockedAchievements = achievements.filter(a => a.unlocked);

    return res.status(200).json({
      achievements: unlockedAchievements,
      total: unlockedAchievements.length,
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return res.status(500).json({ message: "Failed to fetch achievements" });
  }
};

/**
 * Get all achievements (locked and unlocked)
 * GET /api/achievements/student/all
 */
export const getAllAchievements = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const achievements = await UserAchievementModel.find({ user: userId })
      .populate("achievement", "name description icon category")
      .select("achievement unlocked unlockedAt progress total");

    return res.status(200).json({
      achievements,
      total: achievements.length,
      unlocked: achievements.filter(a => a.unlocked).length,
    });
  } catch (error) {
    console.error("Error fetching all achievements:", error);
    return res.status(500).json({ message: "Failed to fetch achievements" });
  }
};
