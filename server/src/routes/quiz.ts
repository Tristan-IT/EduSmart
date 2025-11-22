import { Router } from "express";
import { listQuizQuestions, submitQuizAnswer } from "../controllers/quizController.js";

export const quizRouter = Router();

quizRouter.get("/questions", listQuizQuestions);
quizRouter.post("/answer", submitQuizAnswer);

export default quizRouter;
