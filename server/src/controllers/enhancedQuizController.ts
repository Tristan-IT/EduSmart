import { Request, Response } from "express";
import { getQuizQuestions, submitQuiz, getQuizStats } from "../services/quizService.js";

/**
 * Get quiz questions by topic
 * GET /api/quizzes/:topicId/questions
 */
export async function getQuizQuestionsController(req: Request, res: Response) {
  try {
    const { topicId } = req.params;
    const difficulty = req.query.difficulty ? parseInt(req.query.difficulty as string) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const questions = await getQuizQuestions(topicId, difficulty, limit);

    return res.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("Error getting quiz questions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get quiz questions",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Submit quiz
 * POST /api/quizzes/submit
 */
export async function submitQuizController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const submission = req.body;

    if (!submission.topicId || !submission.answers || !Array.isArray(submission.answers)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz submission format",
      });
    }

    const result = await submitQuiz(userId, submission);

    return res.json(result);
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Get quiz statistics
 * GET /api/quizzes/stats/:topicId?
 */
export async function getQuizStatsController(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const { topicId } = req.params;

    const stats = await getQuizStats(userId, topicId);

    return res.json({
      success: true,
      ...stats,
    });
  } catch (error) {
    console.error("Error getting quiz stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get quiz stats",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
