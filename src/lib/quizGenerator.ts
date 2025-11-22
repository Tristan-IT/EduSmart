import { QuizQuestion } from "@/data/mockData";
import { algebraQuestions, geometryQuestions } from "@/data/quizBank";

// Interface for quiz history
export interface QuizHistory {
  categoryId: string;
  questionIds: string[];
  date: string;
}

/**
 * Get all questions for a specific category
 */
export const getQuestionsByCategory = (categoryId: string): QuizQuestion[] => {
  const categoryMap: Record<string, QuizQuestion[]> = {
    'algebra': algebraQuestions,
    'geometry': geometryQuestions,
    // Add more as they become available
    // 'calculus': calculusQuestions,
    // 'statistics': statisticsQuestions,
    // 'trigonometry': trigonometryQuestions,
    // 'logic': logicQuestions,
  };

  return categoryMap[categoryId] || [];
};

/**
 * Get questions filtered by difficulty
 */
export const getQuestionsByDifficulty = (
  questions: QuizQuestion[],
  difficulty: 1 | 2 | 3
): QuizQuestion[] => {
  return questions.filter(q => q.difficulty === difficulty);
};

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generate random quiz questions
 * 
 * @param categoryId - Category of questions (algebra, geometry, etc)
 * @param totalQuestions - Total number of questions to generate (default: 10)
 * @param difficultyDistribution - Distribution of difficulty levels
 * @param excludeIds - Question IDs to exclude (already used today)
 * @returns Array of random quiz questions
 */
export const generateRandomQuiz = (
  categoryId: string,
  totalQuestions: number = 10,
  difficultyDistribution: {
    easy: number;    // Percentage (0-100)
    medium: number;  // Percentage (0-100)
    hard: number;    // Percentage (0-100)
  } = { easy: 40, medium: 40, hard: 20 },
  excludeIds: string[] = []
): QuizQuestion[] => {
  // Get all questions for category
  const allQuestions = getQuestionsByCategory(categoryId);
  
  if (allQuestions.length === 0) {
    console.warn(`No questions found for category: ${categoryId}`);
    return [];
  }

  // Filter out excluded questions
  const availableQuestions = allQuestions.filter(
    q => !excludeIds.includes(q.id)
  );

  // Calculate how many questions needed per difficulty
  const easyCount = Math.round(totalQuestions * difficultyDistribution.easy / 100);
  const mediumCount = Math.round(totalQuestions * difficultyDistribution.medium / 100);
  const hardCount = totalQuestions - easyCount - mediumCount;

  // Get questions by difficulty
  const easyQuestions = shuffleArray(
    getQuestionsByDifficulty(availableQuestions, 1)
  ).slice(0, easyCount);

  const mediumQuestions = shuffleArray(
    getQuestionsByDifficulty(availableQuestions, 2)
  ).slice(0, mediumCount);

  const hardQuestions = shuffleArray(
    getQuestionsByDifficulty(availableQuestions, 3)
  ).slice(0, hardCount);

  // Combine and shuffle final quiz
  const quiz = shuffleArray([
    ...easyQuestions,
    ...mediumQuestions,
    ...hardQuestions,
  ]);

  return quiz.slice(0, totalQuestions);
};

/**
 * Get quiz history from localStorage
 */
export const getQuizHistory = (): QuizHistory[] => {
  try {
    const history = localStorage.getItem('quizHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading quiz history:', error);
    return [];
  }
};

/**
 * Save quiz to history
 */
export const saveQuizToHistory = (
  categoryId: string,
  questionIds: string[]
): void => {
  try {
    const history = getQuizHistory();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Add new quiz to history
    history.push({
      categoryId,
      questionIds,
      date: today,
    });

    // Keep only last 30 days of history
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filteredHistory = history.filter(h => 
      new Date(h.date) >= thirtyDaysAgo
    );

    localStorage.setItem('quizHistory', JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Error saving quiz history:', error);
  }
};

/**
 * Get question IDs used today for a category
 */
export const getTodayUsedQuestions = (categoryId: string): string[] => {
  const history = getQuizHistory();
  const today = new Date().toISOString().split('T')[0];

  const todayQuizzes = history.filter(
    h => h.categoryId === categoryId && h.date === today
  );

  // Flatten all question IDs from today's quizzes
  return todayQuizzes.flatMap(q => q.questionIds);
};

/**
 * Generate a fresh daily quiz (avoiding questions used today)
 */
export const generateDailyQuiz = (
  categoryId: string,
  totalQuestions: number = 10
): QuizQuestion[] => {
  const usedToday = getTodayUsedQuestions(categoryId);
  
  const quiz = generateRandomQuiz(
    categoryId,
    totalQuestions,
    { easy: 40, medium: 40, hard: 20 },
    usedToday
  );

  // Save to history
  saveQuizToHistory(categoryId, quiz.map(q => q.id));

  return quiz;
};

/**
 * Get statistics for a category
 */
export const getCategoryStats = (categoryId: string) => {
  const allQuestions = getQuestionsByCategory(categoryId);
  const easyCount = allQuestions.filter(q => q.difficulty === 1).length;
  const mediumCount = allQuestions.filter(q => q.difficulty === 2).length;
  const hardCount = allQuestions.filter(q => q.difficulty === 3).length;

  return {
    total: allQuestions.length,
    easy: easyCount,
    medium: mediumCount,
    hard: hardCount,
  };
};
