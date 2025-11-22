import { Router } from "express";
import {
  getMyClass,
  getMyClassmates,
  getClassLeaderboard,
  getClassAssignments,
  getMyClassRank,
  compareRanks,
} from "../controllers/studentClassController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// All student class routes require authentication
router.use(authenticate);

// Student class endpoints (student only)
router.get("/my-class", getMyClass as any);
router.get("/my-classmates", getMyClassmates as any);
router.get("/class-leaderboard", getClassLeaderboard as any);
router.get("/class-assignments", getClassAssignments as any);
router.get("/my-rank", getMyClassRank as any);
router.get("/compare-ranks", compareRanks as any);

export default router;
