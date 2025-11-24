import { Router } from "express";
import {
  getGamificationProfile,
  addXPController,
  claimDailyGoalController,
  getGemBalanceController,
  spendGemsController,
  getGemHistoryController,
  checkAchievementsController,
  getLeaderboard,
} from "../controllers/gamificationController.js";

const router = Router();

// All routes require authentication (add middleware in app.ts)

// Profile
router.get("/profile", getGamificationProfile);

// XP
router.post("/xp", addXPController);

// Daily Goal & Streak
router.post("/streak/claim", claimDailyGoalController);

// Gems
router.get("/gems", getGemBalanceController);
router.post("/gems/spend", spendGemsController);
router.get("/gems/history", getGemHistoryController);

// Achievements
router.post("/achievements/check", checkAchievementsController);

// Leaderboard
router.get("/leaderboard", getLeaderboard);

export default router;
