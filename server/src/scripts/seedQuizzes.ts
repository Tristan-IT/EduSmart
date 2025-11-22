import QuizQuestionModel from "../models/QuizQuestion.js";

// Sample quiz questions - in production, import from your quizBank data
export const sampleQuizzes = [
  // Algebra questions
  {
    topicId: "algebra",
    question: "Berapakah nilai x dalam persamaan: 2x + 5 = 13?",
    type: "mcq",
    options: ["2", "4", "6", "8"],
    correctAnswer: "4",
    difficulty: 1,
    hintCount: 2,
    hints: ["Kurangi kedua sisi dengan 5", "Bagi kedua sisi dengan 2"],
    explanation: "2x + 5 = 13 → 2x = 8 → x = 4",
  },
  {
    topicId: "algebra",
    question: "Sederhanakan: 3x + 5x",
    type: "mcq",
    options: ["8x", "15x", "8", "15x²"],
    correctAnswer: "8x",
    difficulty: 1,
    hintCount: 1,
    hints: ["Gabungkan koefisien yang sama"],
    explanation: "3x + 5x = (3+5)x = 8x",
  },
  {
    topicId: "algebra",
    question: "Jika 3x = 15, maka x = ?",
    type: "mcq",
    options: ["3", "5", "12", "18"],
    correctAnswer: "5",
    difficulty: 1,
    hintCount: 1,
    hints: ["Bagi kedua sisi dengan 3"],
    explanation: "x = 15 ÷ 3 = 5",
  },
  // Geometry questions
  {
    topicId: "geometry",
    question: "Luas persegi dengan sisi 5 cm adalah?",
    type: "mcq",
    options: ["10 cm²", "20 cm²", "25 cm²", "50 cm²"],
    correctAnswer: "25 cm²",
    difficulty: 1,
    hintCount: 1,
    hints: ["Luas persegi = sisi × sisi"],
    explanation: "Luas = 5 × 5 = 25 cm²",
  },
  {
    topicId: "geometry",
    question: "Keliling lingkaran dengan jari-jari 7 cm (π = 22/7) adalah?",
    type: "mcq",
    options: ["22 cm", "44 cm", "154 cm", "308 cm"],
    correctAnswer: "44 cm",
    difficulty: 2,
    hintCount: 1,
    hints: ["Keliling = 2 × π × r"],
    explanation: "K = 2 × (22/7) × 7 = 44 cm",
  },
  // Statistics questions
  {
    topicId: "statistics",
    question: "Mean dari data: 4, 6, 8, 10, 12 adalah?",
    type: "mcq",
    options: ["6", "8", "10", "12"],
    correctAnswer: "8",
    difficulty: 1,
    hintCount: 1,
    hints: ["Mean = jumlah semua data ÷ banyak data"],
    explanation: "Mean = (4+6+8+10+12)/5 = 40/5 = 8",
  },
  {
    topicId: "statistics",
    question: "Median dari data: 3, 7, 2, 9, 5 adalah?",
    type: "mcq",
    options: ["3", "5", "7", "9"],
    correctAnswer: "5",
    difficulty: 2,
    hintCount: 1,
    hints: ["Urutkan data terlebih dahulu, ambil nilai tengah"],
    explanation: "Data terurut: 2, 3, 5, 7, 9. Median = 5",
  },
  // Trigonometry questions
  {
    topicId: "trigonometry",
    question: "Nilai sin 30° adalah?",
    type: "mcq",
    options: ["1/2", "√2/2", "√3/2", "1"],
    correctAnswer: "1/2",
    difficulty: 2,
    hintCount: 1,
    hints: ["Ingat nilai trigonometri sudut istimewa"],
    explanation: "sin 30° = 1/2 (nilai sudut istimewa)",
  },
  // Calculus questions
  {
    topicId: "calculus",
    question: "Turunan dari f(x) = 3x² adalah?",
    type: "mcq",
    options: ["3x", "6x", "3x³", "6x²"],
    correctAnswer: "6x",
    difficulty: 3,
    hintCount: 1,
    hints: ["Gunakan aturan turunan: d/dx(xⁿ) = n·xⁿ⁻¹"],
    explanation: "f'(x) = 3 × 2x¹ = 6x",
  },
  // Logic questions
  {
    topicId: "logic",
    question: "Negasi dari pernyataan 'Semua siswa rajin' adalah?",
    type: "mcq",
    options: [
      "Semua siswa tidak rajin",
      "Tidak ada siswa yang rajin",
      "Ada siswa yang tidak rajin",
      "Sebagian siswa rajin",
    ],
    correctAnswer: "Ada siswa yang tidak rajin",
    difficulty: 2,
    hintCount: 1,
    hints: ["Negasi dari 'semua' adalah 'ada yang tidak'"],
    explanation: "Negasi universal affirmative adalah particular negative",
  },
];

export async function seedQuizzes() {
  try {
    console.log("📝 Seeding quiz questions...");
    
    // Clear existing quizzes
    await QuizQuestionModel.deleteMany({});
    
    // Insert sample quizzes
    const result = await QuizQuestionModel.insertMany(sampleQuizzes);
    
    console.log(`✅ Successfully seeded ${result.length} quiz questions`);
    console.log("ℹ️  Note: This is a sample set. Import full quizBank.ts data for production.");
    return result;
  } catch (error) {
    console.error("❌ Error seeding quizzes:", error);
    throw error;
  }
}
