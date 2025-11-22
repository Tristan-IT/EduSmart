import { Router } from "express";
import {
  getSkillTreeController,
  getUserSkillTreeController,
  completeNodeController,
  getNextAvailableNodesController,
  getTreeProgressController,
  validateNodeAccessController,
  checkPrerequisitesController,
  getAccessibleNodesController,
  validateQuizAccessController,
  getPrerequisiteChainController,
  getNodeMetricsController,
  calibrateNodeController,
  getCalibrationSuggestionsController,
  autoCalibrationController,
  getDifficultyDistributionController,
  getPathAnalyticsController,
  getStudentPathProgressController,
  getSubjectComparisonController,
  getTrendingPathsController,
} from "../controllers/skillTreeController.js";
import { requireTeacher } from "../middleware/authenticate.js";

const router = Router();

// All routes require authentication (add middleware in app.ts)

// Public routes (students)
router.get("/", getSkillTreeController);
router.get("/user", getUserSkillTreeController);
router.get("/accessible", getAccessibleNodesController);
router.get("/progress", getTreeProgressController);
router.get("/next", getNextAvailableNodesController);
router.get("/validate/:nodeId", validateNodeAccessController);
router.get("/validate-quiz/:nodeId", validateQuizAccessController);
router.get("/prerequisites/:nodeId", checkPrerequisitesController);
router.get("/prerequisite-chain/:nodeId", getPrerequisiteChainController);
router.post("/node/:nodeId/complete", completeNodeController);

// Calibration routes (teachers only)
router.get("/nodes/:nodeId/metrics", requireTeacher, getNodeMetricsController);
router.patch("/nodes/:nodeId/calibrate", requireTeacher, calibrateNodeController);
router.get("/calibration/suggestions", requireTeacher, getCalibrationSuggestionsController);
router.post("/calibration/auto", requireTeacher, autoCalibrationController);
router.get("/calibration/distribution", requireTeacher, getDifficultyDistributionController);

// Analytics routes (teachers only)
router.get("/analytics/path", requireTeacher, getPathAnalyticsController);
router.get("/analytics/students", requireTeacher, getStudentPathProgressController);
router.get("/analytics/comparison", requireTeacher, getSubjectComparisonController);
router.get("/analytics/trending", requireTeacher, getTrendingPathsController);

export default router;
