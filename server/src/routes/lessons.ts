import express from "express";
import {
  getLessonContent,
  updateLessonContent,
  deleteLessonContent,
  getNodesWithLessons,
  markLessonViewed,
} from "../controllers/lessonController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

// Public routes (students can view lessons)
router.get("/", getNodesWithLessons); // GET /api/lessons?subject=xxx&gradeLevel=SMP
router.get("/:nodeId", getLessonContent); // GET /api/lessons/NODE-001

// Protected routes (students)
router.post("/:nodeId/view", authenticate, markLessonViewed); // POST /api/lessons/NODE-001/view

// Teacher routes (create/update/delete lessons)
router.put("/:nodeId", authenticate, updateLessonContent); // PUT /api/lessons/NODE-001
router.delete("/:nodeId", authenticate, deleteLessonContent); // DELETE /api/lessons/NODE-001

export default router;
