/**
 * Exercise Generator - Generate random exercises from quiz bank
 */

import { algebraQuestions } from "@/data/quizBank";
import { QuizQuestion } from "@/data/mockData";

// Map module ID to quiz bank
const quizBankMap: Record<string, QuizQuestion[]> = {
  'alg-linear-eq': algebraQuestions.filter(q => 
    q.id.startsWith('alg') && q.difficulty <= 2
  ),
  'alg-quadratic': algebraQuestions.filter(q => 
    q.id.startsWith('alg') && q.difficulty >= 2 && q.difficulty <= 3
  ),
  'alg-systems': algebraQuestions.filter(q => 
    q.id.startsWith('alg') && q.difficulty >= 3
  ),
  // Add more mappings as needed
};

/**
 * Get random exercises from quiz bank for a specific module
 */
export function generateExercises(
  moduleId: string, 
  count: number = 5,
  excludeIds: string[] = []
): QuizQuestion[] {
  const bank = quizBankMap[moduleId] || algebraQuestions;
  
  // Filter out excluded questions
  const available = bank.filter(q => !excludeIds.includes(q.id));
  
  if (available.length === 0) {
    console.warn('No more questions available, resetting pool');
    // If no questions left, allow reuse
    return shuffleArray(bank).slice(0, count);
  }
  
  // Shuffle and take N questions
  return shuffleArray(available).slice(0, Math.min(count, available.length));
}

/**
 * Get a single random exercise (for refresh)
 */
export function getRandomExercise(
  moduleId: string,
  excludeIds: string[] = []
): QuizQuestion | null {
  const exercises = generateExercises(moduleId, 1, excludeIds);
  return exercises.length > 0 ? exercises[0] : null;
}

/**
 * Convert QuizQuestion to LearningModule exercise format
 */
export function convertToModuleExercise(question: QuizQuestion) {
  return {
    id: question.id,
    question: question.question,
    type: question.type as "mcq" | "short-answer" | "multiple-choice",
    options: question.options,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    difficulty: question.difficulty,
  };
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
