import type { Request, Response } from "express";
import { QuizQuestionModel } from "../models/QuizQuestion.js";

export const listQuizQuestions = async (req: Request, res: Response) => {
  const { topicId, subjectId } = req.query;
  const filter: any = {};
  
  if (topicId) filter.topicId = topicId;
  if (subjectId) filter.subject = subjectId;
  
  const questions = await QuizQuestionModel.find(filter)
    .populate("subject", "code name category color")
    .limit(20)
    .exec();
  
  return res.json({ questions });
};

export const submitQuizAnswer = async (req: Request, res: Response) => {
  const { questionId } = req.body as { questionId: string };
  if (!questionId) {
    return res.status(400).json({ message: "questionId wajib diisi" });
  }
  const question = await QuizQuestionModel.findById(questionId)
    .populate("subject", "code name category color")
    .exec();
  
  return res.json({
    status: "received",
    feedback: "Jawaban diterima. Penilaian adaptif akan tersedia saat model produksi aktif.",
    question,
  });
};
