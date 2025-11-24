import { Router } from "express";
import { Request, Response } from "express";
import {
  getAllAchievements,
  getUserAchievements,
  getUnlockedCount,
  getRecentlyUnlocked,
} from "../services/achievementService.js";
import { getMyAchievements, getAllAchievements as getAllAchievementsController } from "../controllers/achievementController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

/**
 * Get all achievements
 * GET /api/achievements
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const achievements = await getAllAchievements();

    return res.json({
      success: true,
      achievements,
    });
  } catch (error) {
    console.error("Error getting achievements:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get achievements",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * Get user's achievements
 * GET /api/achievements/user
 */
router.get("/user", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;

    const achievements = await getUserAchievements(userId);
    const unlockedCount = await getUnlockedCount(userId);

    return res.json({
      success: true,
      achievements,
      unlockedCount,
    });
  } catch (error) {
    console.error("Error getting user achievements:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get user achievements",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * Get recently unlocked achievements
 * GET /api/achievements/recent
 */
router.get("/recent", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const limit = parseInt(req.query.limit as string) || 5;

    const recent = await getRecentlyUnlocked(userId, limit);

    return res.json({
      success: true,
      achievements: recent,
    });
  } catch (error) {
    console.error("Error getting recent achievements:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get recent achievements",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * Get current student's unlocked achievements
 * GET /api/achievements/student/me
 */
router.get("/student/me", authenticate, getMyAchievements);

/**
 * Get all achievements for current student (locked and unlocked)
 * GET /api/achievements/student/all
 */
router.get("/student/all", authenticate, getAllAchievementsController);

export default router;
