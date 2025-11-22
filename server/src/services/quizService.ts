import QuizQuestionModel from "../models/QuizQuestion.js";
import StudentProfileModel from "../models/StudentProfile.js";
import { Types } from "mongoose";
import { addXP, updateStreak, checkAchievements } from "./gamificationService.js";
import { updateQuizProgress } from "./progressService.js";

interface QuizSubmission {
  topicId: string;
  answers: Array<{
    questionId: string;
    userAnswer: string | string[];
  }>;
  timeSpent: number; // in seconds
}

/**
 * Get quiz questions by topic
 */
export async function getQuizQuestions(
  topicId: string,
  difficulty?: number,
  limit = 10,
  subjectId?: string
) {
  try {
    const query: any = { topicId };
    
    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (subjectId) {
      query.subject = subjectId;
    }

    const questions = await QuizQuestionModel.aggregate([
      { $match: query },
      { $sample: { size: limit } },
    ]);

    // Don't send correct answers to client
    return questions.map(q => ({
      _id: q._id,
      topicId: q.topicId,
      subject: q.subject,
      question: q.question,
      type: q.type,
      options: q.options,
      difficulty: q.difficulty,
      hintCount: q.hintCount,
      hints: q.hints,
    }));
  } catch (error) {
    console.error("Error getting quiz questions:", error);
    throw error;
  }
}

/**
 * Submit quiz and calculate score
 */
export async function submitQuiz(
  userId: string | Types.ObjectId,
  submission: QuizSubmission
) {
  try {
    const { topicId, answers, timeSpent } = submission;

    // Get questions
    const questionIds = answers.map(a => a.questionId);
    const questions = await QuizQuestionModel.find({
      _id: { $in: questionIds },
    });

    // Calculate score
    let correct = 0;
    let total = questions.length;
    const results = [];

    for (const answer of answers) {
      const question = questions.find(q => (q._id as any).toString() === answer.questionId);
      
      if (!question) continue;

      const isCorrect = checkAnswer(question.correctAnswer, answer.userAnswer, question.type);
      
      if (isCorrect) {
        correct++;
      }

      results.push({
        questionId: answer.questionId,
        question: question.question,
        userAnswer: answer.userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      });
    }

    const scorePercentage = total > 0 ? (correct / total) * 100 : 0;

    // Calculate XP based on score
    let xpEarned = 0;
    if (scorePercentage >= 90) xpEarned = 100;
    else if (scorePercentage >= 75) xpEarned = 75;
    else if (scorePercentage >= 60) xpEarned = 50;
    else if (scorePercentage >= 40) xpEarned = 25;
    else xpEarned = 10;

    // Bonus for perfect score
    if (scorePercentage === 100) {
      xpEarned += 50;
    }

    // Bonus for speed (if completed in under 30 seconds per question)
    const avgTimePerQuestion = timeSpent / total;
    if (avgTimePerQuestion < 30 && scorePercentage >= 80) {
      xpEarned += 25;
    }

    // Award XP
    const xpResult = await addXP(userId, xpEarned, `Quiz completed: ${topicId}`);

    // Update streak
    await updateStreak(userId);

    // Check achievements
    await checkAchievements(userId);

    // Update StudentSubjectProgress if quiz has a subject
    if (questions.length > 0 && questions[0].subject) {
      const subjectId = questions[0].subject;
      try {
        await updateQuizProgress(userId, subjectId, {
          score: scorePercentage,
          topicId,
          timeSpent,
          xpEarned,
        });
      } catch (progressError) {
        console.error("Error updating quiz progress:", progressError);
        // Don't fail the quiz submission if progress tracking fails
      }
    }

    return {
      success: true,
      score: scorePercentage,
      correct,
      total,
      xpEarned,
      leveledUp: xpResult.leveledUp,
      newLevel: xpResult.newLevel,
      results,
      timeSpent,
    };
  } catch (error) {
    console.error("Error submitting quiz:", error);
    throw error;
  }
}

/**
 * Check if answer is correct
 */
function checkAnswer(
  correctAnswer: string | string[],
  userAnswer: string | string[],
  questionType: string
): boolean {
  if (questionType === "mcq" || questionType === "short-answer") {
    // Single answer
    if (typeof correctAnswer === "string" && typeof userAnswer === "string") {
      return correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
    }
  } else if (questionType === "multiple-choice" || questionType === "multi-select") {
    // Multiple answers
    if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
      if (correctAnswer.length !== userAnswer.length) return false;
      
      const sortedCorrect = [...correctAnswer].sort();
      const sortedUser = [...userAnswer].sort();
      
      return sortedCorrect.every((val, idx) => 
        val.toLowerCase().trim() === sortedUser[idx]?.toLowerCase().trim()
      );
    }
  }

  return false;
}

/**
 * Update topic mastery
 */
async function updateTopicMastery(
  userId: string | Types.ObjectId,
  topicId: string,
  scorePercentage: number
) {
  try {
    const profile = await StudentProfileModel.findOne({ user: userId });
    
    if (!profile) {
      throw new Error("Student profile not found");
    }

    // Calculate new mastery (weighted average with existing mastery)
    const currentMastery = profile.masteryPerTopic[topicId] || 0;
    const newMastery = currentMastery * 0.7 + scorePercentage * 0.3;

    profile.masteryPerTopic[topicId] = Math.round(newMastery);
    profile.markModified("masteryPerTopic");
    
    await profile.save();

    return newMastery;
  } catch (error) {
    console.error("Error updating topic mastery:", error);
    throw error;
  }
}

/**
 * Get quiz statistics for user
 */
export async function getQuizStats(userId: string | Types.ObjectId, topicId?: string) {
  try {
    const profile = await StudentProfileModel.findOne({ user: userId });
    
    if (!profile) {
      throw new Error("Student profile not found");
    }

    if (topicId) {
      return {
        topicId,
        mastery: profile.masteryPerTopic[topicId] || 0,
      };
    }

    // Return all topic masteries
    return {
      masteryPerTopic: profile.masteryPerTopic,
      averageMastery: calculateAverageMastery(profile.masteryPerTopic),
    };
  } catch (error) {
    console.error("Error getting quiz stats:", error);
    throw error;
  }
}

/**
 * Calculate average mastery across all topics
 */
function calculateAverageMastery(masteryPerTopic: Record<string, number>): number {
  const topics = Object.keys(masteryPerTopic);
  
  if (topics.length === 0) return 0;

  const total = topics.reduce((sum, topic) => sum + masteryPerTopic[topic], 0);
  return Math.round(total / topics.length);
}
