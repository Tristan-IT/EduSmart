import { Router } from "express";
import {
  getStudentProgressController,
  getClassProgressController,
  getSchoolProgressController,
  getSubjectStatisticsController,
  updateLessonProgressController,
  updateQuizProgressController,
  updateExerciseProgressController,
  updateAssignmentProgressController,
  getSkillTreeProgress,
  unlockNode,
  completeNode,
  // updateNodeProgress, // TODO: Implement
  getRecommendations,
  getSubjectRecommendations,
  getSkillTreeStats,
} from "../controllers/progressController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

/**
 * Progress Routes
 * All routes require authentication
 */

// GET endpoints - View progress
router.get("/student/:studentId", authenticate, getStudentProgressController);
router.get("/class/:classId/subject/:subjectId", authenticate, getClassProgressController);
router.get("/school/:schoolId", authenticate, getSchoolProgressController);
router.get("/statistics/:schoolId/:subjectId", authenticate, getSubjectStatisticsController);

// POST endpoints - Update progress
router.post("/lesson", authenticate, updateLessonProgressController);
router.post("/quiz", authenticate, updateQuizProgressController);
router.post("/exercise", authenticate, updateExerciseProgressController);
router.post("/assignment", authenticate, updateAssignmentProgressController);

// Skill Tree Progress endpoints
router.get("/skill-tree", authenticate, getSkillTreeProgress);
router.get("/skill-tree/stats", authenticate, getSkillTreeStats);
router.get("/skill-tree/recommendations", authenticate, getRecommendations);
router.get("/skill-tree/recommendations/:subject", authenticate, getSubjectRecommendations);
router.post("/skill-tree/unlock", authenticate, unlockNode);
router.post("/skill-tree/complete", authenticate, completeNode);
// router.put("/skill-tree/:nodeId", authenticate, updateNodeProgress); // TODO: Implement updateNodeProgress

export default router;
