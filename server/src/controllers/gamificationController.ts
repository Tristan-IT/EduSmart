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
    const userId = (req as any).user?._id || (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Try to get from StudentProfile first (old system)
    let profile = await StudentProfileModel.findOne({ user: userId }).populate("user");

    if (profile) {
      const gemBalance = await getGemBalance(userId);
      return res.json({
        success: true,
        profile: {
          ...profile.toObject(),
          gems: gemBalance,
        },
      });
    }

    // Fallback to User model directly (new system)
    const UserModel = (await import("../models/User.js")).default;
    const user = await UserModel.findById(userId).select("xp level gems hearts");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      xp: user.xp || 0,
      level: user.level || 1,
      gems: user.gems || 0,
      hearts: user.hearts || 5,
      streak: 0, // TODO: Implement streak tracking
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

/**
 * Get global leaderboard
 * GET /api/gamification/leaderboard
 * Query params: league, limit
 */
export async function getLeaderboard(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;
    const { league, limit = 50 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const UserModel = (await import("../models/User.js")).default;

    // Get current user's info
    const currentUser = await UserModel.findById(userId)
      .select("name email school xp level streak bestStreak league weeklyXP")
      .lean();

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Build query filter
    const filter: any = { school: currentUser.school, role: "student" };
    if (league) {
      filter.league = league;
    }

    // Get leaderboard - sorted by total XP or weeklyXP depending on context
    const sortField = league ? { weeklyXP: -1 } : { xp: -1 };
    const leaderboard = await UserModel.find(filter)
      .select("name email xp level streak bestStreak league weeklyXP avatar")
      .sort(sortField)
      .limit(parseInt(limit as string))
      .lean();

    // Add rank and format data
    const formattedLeaderboard = leaderboard.map((user, index) => ({
      studentId: user._id.toString(),
      name: user.name,
      rank: index + 1,
      xp: user.xp || 0,
      weeklyXP: user.weeklyXP || 0,
      level: user.level || 1,
      streak: user.streak || 0,
      bestStreak: user.bestStreak || 0,
      league: user.league || 'bronze',
      avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`,
    }));

    // Find current user's rank
    const currentUserRank = formattedLeaderboard.findIndex(
      (entry) => entry.studentId === userId.toString()
    ) + 1;

    return res.json({
      success: true,
      data: {
        leaderboard: formattedLeaderboard,
        currentUser: {
          ...currentUser,
          _id: currentUser._id.toString(),
          rank: currentUserRank || null,
        },
      },
    });
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get leaderboard",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
