import { Request, Response } from "express";
import {
  addXP,
  updateStreak,
  claimDailyGoal,
  addGems,
  spendGems,
  getGemBalance,
  getGemHistory,
  checkAchievements,
} from "../services/gamificationService.js";
import StudentProfileModel from "../models/StudentProfile.js";

/**
 * Get gamification profile
 * GET /api/gamification/profile
 */
export async function getGamificationProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;

    const profile = await StudentProfileModel.findOne({ user: userId }).populate("user");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Get gem balance
    const gemBalance = await getGemBalance(userId);

    return res.json({
      success: true,
      profile: {
        ...profile.toObject(),
        gems: gemBalance,
      },
    });
  } catch (error) {
    console.error("Error getting gamification profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Add XP
 * POST /api/gamification/xp
 */
export async function addXPController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const { amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid XP amount",
      });
    }

    const result = await addXP(userId, amount, reason || "Manual XP add");

    return res.json(result);
  } catch (error) {
    console.error("Error adding XP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add XP",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Claim daily goal
 * POST /api/gamification/streak/claim
 */
export async function claimDailyGoalController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;

    const result = await claimDailyGoal(userId);

    return res.json(result);
  } catch (error) {
    console.error("Error claiming daily goal:", error);
    
    if (error instanceof Error) {
      if (error.message === "Daily goal not yet met") {
        return res.status(400).json({
          success: false,
          message: "Daily goal not yet completed",
        });
      }
      if (error.message === "Daily goal already claimed") {
        return res.status(400).json({
          success: false,
          message: "Daily goal already claimed today",
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to claim daily goal",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get gem balance
 * GET /api/gamification/gems
 */
export async function getGemBalanceController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;

    const balance = await getGemBalance(userId);

    return res.json({
      success: true,
      balance,
    });
  } catch (error) {
    console.error("Error getting gem balance:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get gem balance",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Spend gems
 * POST /api/gamification/gems/spend
 */
export async function spendGemsController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const { amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid gem amount",
      });
    }

    const result = await spendGems(userId, amount, reason || "Purchase");

    return res.json(result);
  } catch (error) {
    console.error("Error spending gems:", error);
    
    if (error instanceof Error && error.message === "Insufficient gems") {
      return res.status(400).json({
        success: false,
        message: "Insufficient gems",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to spend gems",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get gem history
 * GET /api/gamification/gems/history
 */
export async function getGemHistoryController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const limit = parseInt(req.query.limit as string) || 50;

    const history = await getGemHistory(userId, limit);

    return res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Error getting gem history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get gem history",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Check achievements
 * POST /api/gamification/achievements/check
 */
export async function checkAchievementsController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;

    const result = await checkAchievements(userId);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error checking achievements:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check achievements",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
