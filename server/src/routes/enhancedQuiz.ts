import { Router } from "express";
import {
  getQuizQuestionsController,
  submitQuizController,
  getQuizStatsController,
} from "../controllers/enhancedQuizController.js";

const router = Router();

// Get quiz questions by topic
router.get("/:topicId/questions", getQuizQuestionsController);

// Submit quiz
router.post("/submit", submitQuizController);

// Get quiz statistics
router.get("/stats/:topicId?", getQuizStatsController);

export default router;
