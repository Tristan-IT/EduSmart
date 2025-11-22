/**
 * Template Bank Soal Matematika SMA - Part 2
 * Topics: Trigonometri, Kalkulus, Statistika, Peluang
 */

import { QuizTemplate } from "./mathQuestions";

// ============================================
// TOPIC 3: TRIGONOMETRI
// ============================================

export const trigonometryQuestions: QuizTemplate = {
  topicCode: "TRIG-01",
  topicName: "Trigonometri",
  description: "Sudut, identitas trigonometri, dan grafik fungsi trigonometri",
  difficulty: "intermediate",
  estimatedMinutes: 120,
  learningObjectives: [
    "Memahami konsep sudut dan konversi derajat-radian",
    "Menguasai perbandingan trigonometri",
    "Menerapkan identitas trigonometri",
    "Memahami grafik fungsi trigonometri"
  ],
  questions: [
    // PERBANDINGAN TRIGONOMETRI - MUDAH
    {
      question: "Nilai dari sin 30° adalah...",
      type: "mcq",
      options: ["0", "1/2", "1/2√3", "1"],
      correctAnswer: "1/2",
      difficulty: "mudah",
      hints: [
        "Gunakan nilai sudut istimewa",
        "sin 30° adalah salah satu nilai yang harus dihafalkan",
        "Ingat: sin 30° = 1/2"
      ],
      explanation: "sin 30° = 1/2 (nilai sudut istimewa yang harus dihafalkan)",
      tags: ["trigonometri", "sudut istimewa", "sinus"]
    },
    {
      question: "Nilai dari cos 60° adalah...",
      type: "mcq",
      options: ["0", "1/2", "1/2√3", "1"],
      correctAnswer: "1/2",
      difficulty: "mudah",
      hints: [
        "Nilai sudut istimewa",
        "cos 60° = sin 30°",
        "cos 60° = 1/2"
      ],
      explanation: "cos 60° = 1/2",
      tags: ["trigonometri", "sudut istimewa", "cosinus"]
    },
    {
      question: "Nilai dari tan 45° adalah...",
      type: "mcq",
      options: ["0", "1/2", "1", "√3"],
      correctAnswer: "1",
      difficulty: "mudah",
      hints: [
        "tan = sin/cos",
        "Untuk sudut 45°, sin = cos",
        "tan 45° = 1"
      ],
      explanation: "tan 45° = sin 45°/cos 45° = 1",
      tags: ["trigonometri", "sudut istimewa", "tangen"]
    },
    
    // IDENTITAS TRIGONOMETRI - SEDANG
    {
      question: "Jika sin α = 3/5 dan α di kuadran I, maka cos α adalah...",
      type: "mcq",
      options: ["3/5", "4/5", "5/3", "5/4"],
      correctAnswer: "4/5",
      difficulty: "sedang",
      hints: [
        "Gunakan identitas sin²α + cos²α = 1",
        "(3/5)² + cos²α = 1",
        "cos²α = 1 - 9/25 = 16/25"
      ],
      explanation: "sin²α + cos²α = 1 → (3/5)² + cos²α = 1 → cos²α = 16/25 → cos α = 4/5 (positif di kuadran I)",
      tags: ["trigonometri", "identitas pythagoras", "kuadran"]
    },
    {
      question: "Nilai dari sin²30° + cos²30° adalah...",
      type: "mcq",
      options: ["0", "1/2", "1", "2"],
      correctAnswer: "1",
      difficulty: "sedang",
      hints: [
        "Gunakan identitas trigonometri dasar",
        "sin²θ + cos²θ = 1",
        "Berlaku untuk semua nilai θ"
      ],
      explanation: "sin²30° + cos²30° = 1 (identitas dasar trigonometri)",
      tags: ["trigonometri", "identitas", "teorema pythagoras"]
    },
    
    // SUDUT GANDA - SEDANG
    {
      question: "Nilai dari sin 2α jika sin α = 3/5 dan cos α = 4/5 adalah...",
      type: "mcq",
      options: ["12/25", "24/25", "7/25", "16/25"],
      correctAnswer: "24/25",
      difficulty: "sedang",
      hints: [
        "Gunakan rumus sudut ganda: sin 2α = 2 sin α cos α",
        "sin 2α = 2 × (3/5) × (4/5)",
        "Kalikan hasilnya"
      ],
      explanation: "sin 2α = 2 sin α cos α = 2 × (3/5) × (4/5) = 24/25",
      tags: ["trigonometri", "sudut ganda", "rumus"]
    },
    
    // PERSAMAAN TRIGONOMETRI - SULIT
    {
      question: "Himpunan penyelesaian dari sin x = 1/2 untuk 0° ≤ x ≤ 360° adalah...",
      type: "mcq",
      options: [
        "{30°, 150°}",
        "{30°, 330°}",
        "{60°, 120°}",
        "{60°, 300°}"
      ],
      correctAnswer: "{30°, 150°}",
      difficulty: "sulit",
      hints: [
        "sin x = 1/2 berarti x = 30° (sudut istimewa)",
        "Di kuadran II, sin juga positif",
        "x = 180° - 30° = 150°"
      ],
      explanation: "sin x = 1/2 → x = 30° (kuadran I) atau x = 180° - 30° = 150° (kuadran II)",
      tags: ["trigonometri", "persamaan", "interval"]
    },
    
    // KONVERSI SUDUT - MUDAH
    {
      question: "Konversi 90° ke satuan radian adalah...",
      type: "mcq",
      options: ["π/4", "π/2", "π", "2π"],
      correctAnswer: "π/2",
      difficulty: "mudah",
      hints: [
        "180° = π radian",
        "90° = 180°/2",
        "π/2 radian"
      ],
      explanation: "90° = 90° × (π/180°) = π/2 radian",
      tags: ["trigonometri", "konversi", "radian"]
    },
    {
      question: "Konversi π/3 radian ke derajat adalah...",
      type: "mcq",
      options: ["30°", "45°", "60°", "90°"],
      correctAnswer: "60°",
      difficulty: "mudah",
      hints: [
        "π radian = 180°",
        "π/3 radian = 180°/3",
        "= 60°"
      ],
      explanation: "π/3 radian = (π/3) × (180°/π) = 60°",
      tags: ["trigonometri", "konversi", "derajat"]
    },
    
    // SUDUT ISTIMEWA - MUDAH
    {
      question: "Nilai dari cos 0° adalah...",
      type: "mcq",
      options: ["0", "1/2", "1/2√3", "1"],
      correctAnswer: "1",
      difficulty: "mudah",
      hints: [
        "Sudut 0° di sumbu x positif",
        "cos = x/r",
        "cos 0° = 1"
      ],
      explanation: "cos 0° = 1",
      tags: ["trigonometri", "sudut istimewa", "cosinus"]
    },
    {
      question: "Nilai dari sin 90° adalah...",
      type: "mcq",
      options: ["0", "1/2", "1/2√3", "1"],
      correctAnswer: "1",
      difficulty: "mudah",
      hints: [
        "Sudut 90° di sumbu y positif",
        "sin = y/r",
        "sin 90° = 1"
      ],
      explanation: "sin 90° = 1",
      tags: ["trigonometri", "sudut istimewa", "sinus"]
    },
    {
      question: "Nilai dari tan 60° adalah...",
      type: "mcq",
      options: ["1/2", "1", "√3", "2"],
      correctAnswer: "√3",
      difficulty: "mudah",
      hints: [
        "tan = sin/cos",
        "tan 60° = sin 60°/cos 60°",
        "= (1/2√3)/(1/2) = √3"
      ],
      explanation: "tan 60° = √3",
      tags: ["trigonometri", "sudut istimewa", "tangen"]
    },
    
    // IDENTITAS - SEDANG
    {
      question: "Sederhanakan: tan α × cos α",
      type: "mcq",
      options: ["sin α", "cos α", "tan α", "1"],
      correctAnswer: "sin α",
      difficulty: "sedang",
      hints: [
        "tan α = sin α / cos α",
        "(sin α / cos α) × cos α",
        "cos α akan ter-eliminasi"
      ],
      explanation: "tan α × cos α = (sin α / cos α) × cos α = sin α",
      tags: ["trigonometri", "identitas", "penyederhanaan"]
    },
    {
      question: "Nilai dari 1 - cos²α adalah...",
      type: "mcq",
      options: ["0", "1", "sin α", "sin²α"],
      correctAnswer: "sin²α",
      difficulty: "sedang",
      hints: [
        "Gunakan identitas sin²α + cos²α = 1",
        "sin²α = 1 - cos²α",
        "Transposisi persamaan"
      ],
      explanation: "Dari sin²α + cos²α = 1, maka 1 - cos²α = sin²α",
      tags: ["trigonometri", "identitas pythagoras", "manipulasi"]
    },
    
    // JUMLAH DAN SELISIH SUDUT - SEDANG
    {
      question: "Nilai dari sin 75° (petunjuk: 75° = 45° + 30°) adalah...",
      type: "mcq",
      options: [
        "(√6 + √2)/4",
        "(√6 - √2)/4",
        "(√3 + 1)/2",
        "(√3 - 1)/2"
      ],
      correctAnswer: "(√6 + √2)/4",
      difficulty: "sedang",
      hints: [
        "Gunakan rumus: sin(A + B) = sin A cos B + cos A sin B",
        "sin 75° = sin(45° + 30°)",
        "= sin 45° cos 30° + cos 45° sin 30°"
      ],
      explanation: "sin 75° = sin(45° + 30°) = (1/2√2)(1/2√3) + (1/2√2)(1/2) = (√6 + √2)/4",
      tags: ["trigonometri", "jumlah sudut", "rumus"]
    },
    
    // GRAFIK - SEDANG
    {
      question: "Amplitudo dari fungsi y = 3 sin x adalah...",
      type: "mcq",
      options: ["1", "2", "3", "6"],
      correctAnswer: "3",
      difficulty: "sedang",
      hints: [
        "Bentuk umum: y = A sin x",
        "A adalah amplitudo",
        "Nilai maksimum - nilai minimum dibagi 2"
      ],
      explanation: "Amplitudo = |A| = |3| = 3",
      tags: ["trigonometri", "grafik", "amplitudo"]
    },
    {
      question: "Periode dari fungsi y = sin 2x adalah...",
      type: "mcq",
      options: ["π/2", "π", "2π", "4π"],
      correctAnswer: "π",
      difficulty: "sedang",
      hints: [
        "Bentuk umum: y = sin Bx",
        "Periode = 2π/B",
        "B = 2"
      ],
      explanation: "Periode = 2π/2 = π",
      tags: ["trigonometri", "grafik", "periode"]
    },
    
    // PERSAMAAN TRIGONOMETRI - SULIT
    {
      question: "Himpunan penyelesaian cos x = -1/2 untuk 0° ≤ x ≤ 360° adalah...",
      type: "mcq",
      options: [
        "{120°, 240°}",
        "{60°, 300°}",
        "{150°, 210°}",
        "{30°, 330°}"
      ],
      correctAnswer: "{120°, 240°}",
      difficulty: "sulit",
      hints: [
        "cos x = -1/2 (negatif di kuadran II dan III)",
        "Sudut acuan: 60° (karena cos 60° = 1/2)",
        "Kuadran II: 180° - 60° = 120°, Kuadran III: 180° + 60° = 240°"
      ],
      explanation: "cos x = -1/2 → x = 120° (kuadran II) atau x = 240° (kuadran III)",
      tags: ["trigonometri", "persamaan", "kuadran"]
    },
    {
      question: "Jika tan x = 1 dan 0° ≤ x ≤ 360°, maka nilai x adalah...",
      type: "mcq",
      options: [
        "{45°}",
        "{45°, 225°}",
        "{45°, 135°}",
        "{45°, 315°}"
      ],
      correctAnswer: "{45°, 225°}",
      difficulty: "sulit",
      hints: [
        "tan x = 1 → x = 45° (kuadran I)",
        "tan positif juga di kuadran III",
        "Kuadran III: 180° + 45° = 225°"
      ],
      explanation: "tan x = 1 → x = 45° (kuadran I) atau x = 225° (kuadran III)",
      tags: ["trigonometri", "persamaan", "tangen"]
    },
  ]
};

// ============================================
// TOPIC 4: KALKULUS DASAR
// ============================================

export const calculusQuestions: QuizTemplate = {
  topicCode: "CALC-01",
  topicName: "Kalkulus Dasar",
  description: "Limit, turunan, dan integral fungsi",
  difficulty: "advanced",
  estimatedMinutes: 150,
  learningObjectives: [
    "Memahami konsep limit fungsi",
    "Menghitung turunan fungsi aljabar",
    "Menerapkan aturan turunan",
    "Memahami konsep integral dasar"
  ],
  questions: [
    // LIMIT - MUDAH
    {
      question: "Nilai dari lim(x→2) (x + 3) adalah...",
      type: "mcq",
      options: ["2", "3", "5", "6"],
      correctAnswer: "5",
      difficulty: "mudah",
      hints: [
        "Untuk fungsi kontinu, substitusi langsung",
        "Ganti x dengan 2",
        "2 + 3 = ?"
      ],
      explanation: "lim(x→2) (x + 3) = 2 + 3 = 5",
      tags: ["limit", "substitusi", "fungsi linear"]
    },
    {
      question: "Nilai dari lim(x→0) (3x² + 2x) adalah...",
      type: "mcq",
      options: ["0", "2", "3", "5"],
      correctAnswer: "0",
      difficulty: "mudah",
      hints: [
        "Substitusi x = 0",
        "3(0)² + 2(0) = ?",
        "Semua suku bernilai 0"
      ],
      explanation: "lim(x→0) (3x² + 2x) = 3(0)² + 2(0) = 0",
      tags: ["limit", "substitusi", "fungsi kuadrat"]
    },
    
    // LIMIT - SEDANG
    {
      question: "Nilai dari lim(x→2) (x² - 4)/(x - 2) adalah...",
      type: "mcq",
      options: ["0", "2", "4", "∞"],
      correctAnswer: "4",
      difficulty: "sedang",
      hints: [
        "Bentuk 0/0, perlu difaktorkan",
        "x² - 4 = (x - 2)(x + 2)",
        "Sederhanakan dulu"
      ],
      explanation: "lim(x→2) (x² - 4)/(x - 2) = lim(x→2) (x - 2)(x + 2)/(x - 2) = lim(x→2) (x + 2) = 4",
      tags: ["limit", "faktorisasi", "bentuk tak tentu"]
    },
    
    // TURUNAN - MUDAH
    {
      question: "Turunan pertama dari f(x) = x³ adalah...",
      type: "mcq",
      options: ["x²", "2x²", "3x²", "3x"],
      correctAnswer: "3x²",
      difficulty: "mudah",
      hints: [
        "Gunakan aturan pangkat: d/dx(xⁿ) = nxⁿ⁻¹",
        "n = 3",
        "3x³⁻¹ = 3x²"
      ],
      explanation: "f'(x) = 3x³⁻¹ = 3x²",
      tags: ["turunan", "aturan pangkat", "fungsi aljabar"]
    },
    {
      question: "Turunan dari f(x) = 5x² + 3x - 2 adalah...",
      type: "mcq",
      options: [
        "5x + 3",
        "10x + 3",
        "10x² + 3x",
        "5x² + 3"
      ],
      correctAnswer: "10x + 3",
      difficulty: "mudah",
      hints: [
        "Turunan suku demi suku",
        "d/dx(5x²) = 10x",
        "d/dx(3x) = 3, d/dx(-2) = 0"
      ],
      explanation: "f'(x) = 10x + 3 - 0 = 10x + 3",
      tags: ["turunan", "polinomial", "aturan dasar"]
    },
    
    // TURUNAN - SEDANG
    {
      question: "Jika f(x) = (x + 2)(x - 3), maka f'(x) adalah...",
      type: "mcq",
      options: [
        "x - 3",
        "x + 2",
        "2x - 1",
        "2x + 1"
      ],
      correctAnswer: "2x - 1",
      difficulty: "sedang",
      hints: [
        "Kalikan dulu: (x + 2)(x - 3) = x² - x - 6",
        "Turunan: d/dx(x² - x - 6)",
        "2x - 1"
      ],
      explanation: "f(x) = x² - x - 6 → f'(x) = 2x - 1",
      tags: ["turunan", "perkalian fungsi", "ekspansi"]
    },
    
    // APLIKASI TURUNAN - SULIT
    {
      question: "Nilai maksimum dari fungsi f(x) = -x² + 4x + 5 adalah...",
      type: "mcq",
      options: ["5", "7", "9", "11"],
      correctAnswer: "9",
      difficulty: "sulit",
      hints: [
        "Cari titik stasioner: f'(x) = 0",
        "f'(x) = -2x + 4 = 0 → x = 2",
        "Substitusi x = 2 ke f(x)"
      ],
      explanation: "f'(x) = -2x + 4 = 0 → x = 2. f(2) = -(2)² + 4(2) + 5 = -4 + 8 + 5 = 9",
      tags: ["turunan", "nilai maksimum", "titik stasioner"]
    },
    
    // TURUNAN - MUDAH (tambahan)
    {
      question: "Turunan dari f(x) = 7x adalah...",
      type: "mcq",
      options: ["0", "1", "7", "7x"],
      correctAnswer: "7",
      difficulty: "mudah",
      hints: [
        "d/dx(ax) = a",
        "a = 7",
        "Turunan konstanta × x adalah konstanta itu sendiri"
      ],
      explanation: "f'(x) = 7",
      tags: ["turunan", "linear", "aturan dasar"]
    },
    {
      question: "Turunan dari f(x) = x⁴ adalah...",
      type: "mcq",
      options: ["x³", "3x³", "4x³", "4x⁴"],
      correctAnswer: "4x³",
      difficulty: "mudah",
      hints: [
        "Aturan pangkat: d/dx(xⁿ) = nxⁿ⁻¹",
        "n = 4",
        "4x⁴⁻¹ = 4x³"
      ],
      explanation: "f'(x) = 4x³",
      tags: ["turunan", "aturan pangkat", "fungsi aljabar"]
    },
    {
      question: "Turunan dari konstanta 10 adalah...",
      type: "mcq",
      options: ["-10", "0", "1", "10"],
      correctAnswer: "0",
      difficulty: "mudah",
      hints: [
        "Turunan konstanta = 0",
        "d/dx(c) = 0",
        "Grafik konstanta horizontal (kemiringan 0)"
      ],
      explanation: "f'(x) = 0 (turunan konstanta selalu 0)",
      tags: ["turunan", "konstanta", "aturan dasar"]
    },
    
    // TURUNAN - SEDANG (tambahan)
    {
      question: "Turunan dari f(x) = x³ - 4x² + 3x - 7 adalah...",
      type: "mcq",
      options: [
        "3x² - 8x + 3",
        "3x² - 4x + 3",
        "x² - 8x + 3",
        "3x² - 8x"
      ],
      correctAnswer: "3x² - 8x + 3",
      difficulty: "sedang",
      hints: [
        "Turunan suku demi suku",
        "d/dx(x³) = 3x², d/dx(4x²) = 8x",
        "d/dx(3x) = 3, d/dx(7) = 0"
      ],
      explanation: "f'(x) = 3x² - 8x + 3",
      tags: ["turunan", "polinomial", "suku banyak"]
    },
    {
      question: "Turunan dari f(x) = 2x³ + 3x² adalah...",
      type: "mcq",
      options: [
        "6x² + 6x",
        "6x² + 3x",
        "2x² + 6x",
        "6x + 6"
      ],
      correctAnswer: "6x² + 6x",
      difficulty: "sedang",
      hints: [
        "d/dx(2x³) = 6x²",
        "d/dx(3x²) = 6x",
        "Jumlahkan"
      ],
      explanation: "f'(x) = 6x² + 6x",
      tags: ["turunan", "polinomial", "aturan jumlah"]
    },
    
    // LIMIT - SEDANG (tambahan)
    {
      question: "Nilai dari lim(x→3) (x² - 9)/(x - 3) adalah...",
      type: "mcq",
      options: ["0", "3", "6", "9"],
      correctAnswer: "6",
      difficulty: "sedang",
      hints: [
        "Bentuk 0/0, faktorkan pembilang",
        "x² - 9 = (x - 3)(x + 3)",
        "Sederhanakan"
      ],
      explanation: "lim(x→3) (x² - 9)/(x - 3) = lim(x→3) (x - 3)(x + 3)/(x - 3) = lim(x→3) (x + 3) = 6",
      tags: ["limit", "faktorisasi", "bentuk tak tentu"]
    },
    {
      question: "Nilai dari lim(x→∞) (3x + 2)/x adalah...",
      type: "mcq",
      options: ["0", "2", "3", "∞"],
      correctAnswer: "3",
      difficulty: "sedang",
      hints: [
        "Bagi pembilang dan penyebut dengan x",
        "(3x/x + 2/x) / (x/x)",
        "= (3 + 2/x) / 1"
      ],
      explanation: "lim(x→∞) (3x + 2)/x = lim(x→∞) (3 + 2/x) = 3 + 0 = 3",
      tags: ["limit", "tak hingga", "pembagian"]
    },
    
    // INTEGRAL - MUDAH
    {
      question: "Integral dari ∫ 3 dx adalah...",
      type: "mcq",
      options: ["0", "3", "3x", "3x + C"],
      correctAnswer: "3x + C",
      difficulty: "mudah",
      hints: [
        "∫ a dx = ax + C",
        "a = 3",
        "Jangan lupa konstanta C"
      ],
      explanation: "∫ 3 dx = 3x + C",
      tags: ["integral", "konstanta", "integral tak tentu"]
    },
    {
      question: "Integral dari ∫ x² dx adalah...",
      type: "mcq",
      options: [
        "2x + C",
        "x³ + C",
        "x³/3 + C",
        "3x³ + C"
      ],
      correctAnswer: "x³/3 + C",
      difficulty: "mudah",
      hints: [
        "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C",
        "n = 2",
        "x³/3 + C"
      ],
      explanation: "∫ x² dx = x³/3 + C",
      tags: ["integral", "aturan pangkat", "integral tak tentu"]
    },
    
    // INTEGRAL - SEDANG
    {
      question: "Integral dari ∫ (2x + 3) dx adalah...",
      type: "mcq",
      options: [
        "x² + 3x + C",
        "2x² + 3x + C",
        "x² + 3 + C",
        "2x + 3x + C"
      ],
      correctAnswer: "x² + 3x + C",
      difficulty: "sedang",
      hints: [
        "Integral suku demi suku",
        "∫ 2x dx = x²",
        "∫ 3 dx = 3x"
      ],
      explanation: "∫ (2x + 3) dx = x² + 3x + C",
      tags: ["integral", "polinomial", "aturan jumlah"]
    },
    
    // APLIKASI INTEGRAL - SEDANG
    {
      question: "Luas daerah di bawah kurva y = x dari x = 0 sampai x = 2 adalah...",
      type: "mcq",
      options: ["1", "2", "3", "4"],
      correctAnswer: "2",
      difficulty: "sedang",
      hints: [
        "Luas = ∫₀² x dx",
        "= [x²/2]₀²",
        "= (2²/2) - (0²/2) = 2"
      ],
      explanation: "Luas = ∫₀² x dx = [x²/2]₀² = 2 - 0 = 2",
      tags: ["integral", "luas daerah", "integral tentu"]
    },
  ]
};

// ============================================
// TOPIC 5: STATISTIKA
// ============================================

export const statisticsQuestions: QuizTemplate = {
  topicCode: "STAT-01",
  topicName: "Statistika",
  description: "Pengolahan data, ukuran pemusatan, dan ukuran penyebaran",
  difficulty: "beginner",
  estimatedMinutes: 100,
  learningObjectives: [
    "Mengolah dan menyajikan data",
    "Menghitung mean, median, dan modus",
    "Memahami ukuran penyebaran data",
    "Menginterpretasi data statistik"
  ],
  questions: [
    // MEAN - MUDAH
    {
      question: "Rata-rata dari data: 5, 7, 8, 6, 9 adalah...",
      type: "mcq",
      options: ["6", "7", "8", "9"],
      correctAnswer: "7",
      difficulty: "mudah",
      hints: [
        "Mean = jumlah data / banyak data",
        "Jumlahkan: 5 + 7 + 8 + 6 + 9 = 35",
        "Bagi dengan 5"
      ],
      explanation: "Mean = (5 + 7 + 8 + 6 + 9) / 5 = 35 / 5 = 7",
      tags: ["statistika", "mean", "rata-rata"]
    },
    
    // MEDIAN - MUDAH
    {
      question: "Median dari data: 3, 7, 5, 9, 6 adalah...",
      type: "mcq",
      options: ["5", "6", "7", "9"],
      correctAnswer: "6",
      difficulty: "mudah",
      hints: [
        "Urutkan data terlebih dahulu: 3, 5, 6, 7, 9",
        "Median = data tengah",
        "Data ke-3 dari 5 data"
      ],
      explanation: "Data terurut: 3, 5, 6, 7, 9. Median = 6 (data tengah)",
      tags: ["statistika", "median", "data tengah"]
    },
    
    // MODUS - MUDAH
    {
      question: "Modus dari data: 4, 5, 6, 5, 7, 5, 8 adalah...",
      type: "mcq",
      options: ["4", "5", "6", "7"],
      correctAnswer: "5",
      difficulty: "mudah",
      hints: [
        "Modus = data yang paling sering muncul",
        "Hitung frekuensi setiap data",
        "5 muncul 3 kali (paling banyak)"
      ],
      explanation: "Modus = 5 (muncul 3 kali, paling sering)",
      tags: ["statistika", "modus", "frekuensi"]
    },
    
    // JANGKAUAN - SEDANG
    {
      question: "Jangkauan (range) dari data: 12, 15, 10, 18, 14 adalah...",
      type: "mcq",
      options: ["6", "7", "8", "9"],
      correctAnswer: "8",
      difficulty: "sedang",
      hints: [
        "Jangkauan = data terbesar - data terkecil",
        "Data terbesar = 18",
        "Data terkecil = 10"
      ],
      explanation: "Jangkauan = 18 - 10 = 8",
      tags: ["statistika", "jangkauan", "range"]
    },
    
    // TABEL FREKUENSI - SEDANG
    {
      question: "Dari tabel frekuensi:\nNilai: 6, 7, 8, 9\nFrekuensi: 3, 5, 4, 2\nRata-ratanya adalah...",
      type: "mcq",
      options: ["7,0", "7,2", "7,4", "7,6"],
      correctAnswer: "7,2",
      difficulty: "sedang",
      hints: [
        "Mean = Σ(nilai × frekuensi) / Σfrekuensi",
        "(6×3 + 7×5 + 8×4 + 9×2) / (3+5+4+2)",
        "(18 + 35 + 32 + 18) / 14"
      ],
      explanation: "Mean = (6×3 + 7×5 + 8×4 + 9×2) / 14 = 101 / 14 = 7,2",
      tags: ["statistika", "tabel frekuensi", "rata-rata berbobot"]
    },
    
    // MEDIAN - SEDANG
    {
      question: "Median dari data: 2, 8, 4, 6, 10, 7, 9 adalah...",
      type: "mcq",
      options: ["6", "7", "8", "9"],
      correctAnswer: "7",
      difficulty: "sedang",
      hints: [
        "Urutkan: 2, 4, 6, 7, 8, 9, 10",
        "Ada 7 data (ganjil)",
        "Median = data ke-4"
      ],
      explanation: "Data terurut: 2, 4, 6, 7, 8, 9, 10. Median = 7",
      tags: ["statistika", "median", "data ganjil"]
    },
    {
      question: "Median dari data: 5, 8, 6, 9, 7, 10 adalah...",
      type: "mcq",
      options: ["6,5", "7", "7,5", "8"],
      correctAnswer: "7,5",
      difficulty: "sedang",
      hints: [
        "Urutkan: 5, 6, 7, 8, 9, 10",
        "Ada 6 data (genap)",
        "Median = rata-rata data ke-3 dan ke-4"
      ],
      explanation: "Data terurut: 5, 6, 7, 8, 9, 10. Median = (7 + 8)/2 = 7,5",
      tags: ["statistika", "median", "data genap"]
    },
    
    // KUARTIL - SEDANG
    {
      question: "Kuartil bawah (Q1) dari data: 3, 5, 7, 9, 11, 13, 15 adalah...",
      type: "mcq",
      options: ["3", "5", "7", "9"],
      correctAnswer: "5",
      difficulty: "sedang",
      hints: [
        "Q1 = median dari separuh bawah data",
        "Separuh bawah: 3, 5, 7",
        "Median dari 3 data = data tengah"
      ],
      explanation: "Separuh bawah: 3, 5, 7. Q1 = 5",
      tags: ["statistika", "kuartil", "Q1"]
    },
    
    // RATA-RATA - SEDANG
    {
      question: "Rata-rata dari 5 bilangan adalah 8. Jika ditambah satu bilangan lagi menjadi 9, bilangan yang ditambahkan adalah...",
      type: "mcq",
      options: ["9", "12", "14", "15"],
      correctAnswer: "14",
      difficulty: "sedang",
      hints: [
        "Jumlah 5 bilangan = 5 × 8 = 40",
        "Jumlah 6 bilangan = 6 × 9 = 54",
        "Bilangan ditambahkan = 54 - 40"
      ],
      explanation: "Bilangan = (6 × 9) - (5 × 8) = 54 - 40 = 14",
      tags: ["statistika", "rata-rata", "masalah"]
    },
    
    // SIMPANGAN BAKU - SULIT
    {
      question: "Ragam (variansi) dari data: 2, 4, 6, 8 adalah...",
      type: "mcq",
      options: ["2", "4", "5", "10"],
      correctAnswer: "5",
      difficulty: "sulit",
      hints: [
        "Mean = (2+4+6+8)/4 = 5",
        "Variansi = Σ(xi - mean)² / n",
        "= [(2-5)² + (4-5)² + (6-5)² + (8-5)²] / 4"
      ],
      explanation: "Mean = 5. Variansi = [9 + 1 + 1 + 9]/4 = 20/4 = 5",
      tags: ["statistika", "variansi", "simpangan"]
    },
    
    // INTERPRETASI DATA - MUDAH
    {
      question: "Data nilai ujian: 60, 70, 80, 90, 100. Nilai tengahnya adalah...",
      type: "mcq",
      options: ["70", "75", "80", "85"],
      correctAnswer: "80",
      difficulty: "mudah",
      hints: [
        "Data sudah terurut",
        "Ada 5 data (ganjil)",
        "Median = data ke-3"
      ],
      explanation: "Median = 80 (data tengah)",
      tags: ["statistika", "median", "interpretasi"]
    },
    
    // DIAGRAM - SEDANG
    {
      question: "Dari diagram batang dengan frekuensi: A(5), B(8), C(3), D(4). Modus data adalah...",
      type: "mcq",
      options: ["A", "B", "C", "D"],
      correctAnswer: "B",
      difficulty: "sedang",
      hints: [
        "Modus = data dengan frekuensi tertinggi",
        "Bandingkan: 5, 8, 3, 4",
        "Frekuensi terbesar = 8"
      ],
      explanation: "B memiliki frekuensi tertinggi (8), jadi modus = B",
      tags: ["statistika", "diagram", "modus"]
    },
  ]
};

// ============================================
// TOPIC 6: PELUANG
// ============================================

export const probabilityQuestions: QuizTemplate = {
  topicCode: "PROB-01",
  topicName: "Peluang",
  description: "Kombinatorik, permutasi, dan probabilitas",
  difficulty: "intermediate",
  estimatedMinutes: 120,
  learningObjectives: [
    "Memahami konsep peluang",
    "Menghitung permutasi dan kombinasi",
    "Menerapkan aturan perkalian dan penjumlahan",
    "Menyelesaikan masalah peluang sederhana"
  ],
  questions: [
    // PELUANG DASAR - MUDAH
    {
      question: "Peluang muncul angka genap saat melempar sebuah dadu adalah...",
      type: "mcq",
      options: ["1/6", "1/3", "1/2", "2/3"],
      correctAnswer: "1/2",
      difficulty: "mudah",
      hints: [
        "Angka genap pada dadu: 2, 4, 6 (3 angka)",
        "Total angka pada dadu: 1, 2, 3, 4, 5, 6 (6 angka)",
        "P = n(A) / n(S)"
      ],
      explanation: "P(genap) = 3/6 = 1/2",
      tags: ["peluang", "dadu", "konsep dasar"]
    },
    {
      question: "Peluang muncul gambar saat melempar sebuah koin adalah...",
      type: "mcq",
      options: ["0", "1/4", "1/2", "1"],
      correctAnswer: "1/2",
      difficulty: "mudah",
      hints: [
        "Koin memiliki 2 sisi: angka dan gambar",
        "Hanya 1 sisi gambar",
        "P = 1/2"
      ],
      explanation: "P(gambar) = 1/2",
      tags: ["peluang", "koin", "eksperimen sederhana"]
    },
    
    // PERMUTASI - SEDANG
    {
      question: "Banyaknya cara menyusun 3 orang dari 5 orang untuk duduk berjajar adalah...",
      type: "mcq",
      options: ["10", "20", "60", "120"],
      correctAnswer: "60",
      difficulty: "sedang",
      hints: [
        "Gunakan permutasi: P(n, r) = n! / (n-r)!",
        "P(5, 3) = 5! / (5-3)!",
        "= 5! / 2! = 5 × 4 × 3 = 60"
      ],
      explanation: "P(5,3) = 5!/(5-3)! = 5!/2! = 5 × 4 × 3 = 60",
      tags: ["permutasi", "kombinatorik", "aturan perkalian"]
    },
    
    // KOMBINASI - SEDANG
    {
      question: "Banyaknya cara memilih 2 bola dari 5 bola yang berbeda adalah...",
      type: "mcq",
      options: ["5", "10", "15", "20"],
      correctAnswer: "10",
      difficulty: "sedang",
      hints: [
        "Gunakan kombinasi: C(n, r) = n! / (r!(n-r)!)",
        "C(5, 2) = 5! / (2! × 3!)",
        "= (5 × 4) / (2 × 1) = 10"
      ],
      explanation: "C(5,2) = 5!/(2!×3!) = (5×4)/(2×1) = 10",
      tags: ["kombinasi", "pemilihan", "kombinatorik"]
    },
    
    // PELUANG KOMPLEKS - SULIT
    {
      question: "Dua dadu dilempar bersamaan. Peluang muncul jumlah mata dadu 7 adalah...",
      type: "mcq",
      options: ["1/12", "1/9", "1/6", "1/3"],
      correctAnswer: "1/6",
      difficulty: "sulit",
      hints: [
        "Kemungkinan jumlah 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)",
        "Ada 6 kemungkinan",
        "Total kemungkinan = 6 × 6 = 36"
      ],
      explanation: "n(jumlah 7) = 6, n(total) = 36. P = 6/36 = 1/6",
      tags: ["peluang", "dua dadu", "kejadian majemuk"]
    },
    
    // ATURAN PERKALIAN - MUDAH
    {
      question: "Banyaknya cara memilih 1 baju dari 3 baju dan 1 celana dari 2 celana adalah...",
      type: "mcq",
      options: ["2", "3", "5", "6"],
      correctAnswer: "6",
      difficulty: "mudah",
      hints: [
        "Gunakan aturan perkalian",
        "Pilihan baju × pilihan celana",
        "3 × 2 = ?"
      ],
      explanation: "Banyak cara = 3 × 2 = 6",
      tags: ["peluang", "aturan perkalian", "kombinasi"]
    },
    
    // FAKTORIAL - MUDAH
    {
      question: "Nilai dari 5! adalah...",
      type: "mcq",
      options: ["20", "60", "120", "720"],
      correctAnswer: "120",
      difficulty: "mudah",
      hints: [
        "n! = n × (n-1) × (n-2) × ... × 2 × 1",
        "5! = 5 × 4 × 3 × 2 × 1",
        "Kalikan semua"
      ],
      explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120",
      tags: ["faktorial", "kombinatorik", "dasar"]
    },
    
    // PERMUTASI - SEDANG (tambahan)
    {
      question: "Banyaknya susunan huruf dari kata 'BUKU' adalah...",
      type: "mcq",
      options: ["4", "12", "24", "12"],
      correctAnswer: "12",
      difficulty: "sedang",
      hints: [
        "Ada 4 huruf, tetapi U muncul 2 kali",
        "Permutasi dengan unsur sama = n! / (n₁! × n₂!)",
        "4! / 2! = 24 / 2 = 12"
      ],
      explanation: "Permutasi = 4! / 2! = 24 / 2 = 12 (karena U kembar)",
      tags: ["permutasi", "unsur sama", "kombinatorik"]
    },
    {
      question: "Banyaknya cara menyusun 4 orang dari 6 orang dalam satu baris adalah...",
      type: "mcq",
      options: ["24", "120", "360", "720"],
      correctAnswer: "360",
      difficulty: "sedang",
      hints: [
        "P(n, r) = n! / (n-r)!",
        "P(6, 4) = 6! / 2!",
        "= 6 × 5 × 4 × 3 = 360"
      ],
      explanation: "P(6,4) = 6!/2! = 720/2 = 360",
      tags: ["permutasi", "aturan", "kombinatorik"]
    },
    
    // KOMBINASI - SEDANG (tambahan)
    {
      question: "Dari 7 orang akan dipilih 3 orang untuk menjadi pengurus. Banyaknya cara adalah...",
      type: "mcq",
      options: ["21", "35", "42", "210"],
      correctAnswer: "35",
      difficulty: "sedang",
      hints: [
        "C(n, r) = n! / (r!(n-r)!)",
        "C(7, 3) = 7! / (3! × 4!)",
        "= (7 × 6 × 5) / (3 × 2 × 1) = 35"
      ],
      explanation: "C(7,3) = 7!/(3!×4!) = 210/6 = 35",
      tags: ["kombinasi", "pemilihan", "kombinatorik"]
    },
    
    // PELUANG DADU - SEDANG
    {
      question: "Peluang muncul mata dadu lebih dari 4 saat melempar sebuah dadu adalah...",
      type: "mcq",
      options: ["1/6", "1/3", "1/2", "2/3"],
      correctAnswer: "1/3",
      difficulty: "sedang",
      hints: [
        "Mata dadu > 4: yaitu 5 dan 6",
        "Ada 2 kemungkinan",
        "P = 2/6 = 1/3"
      ],
      explanation: "P(> 4) = P(5 atau 6) = 2/6 = 1/3",
      tags: ["peluang", "dadu", "kejadian"]
    },
    
    // PELUANG KOIN - SEDANG
    {
      question: "Peluang muncul 2 gambar saat melempar 2 koin sekaligus adalah...",
      type: "mcq",
      options: ["1/8", "1/4", "1/3", "1/2"],
      correctAnswer: "1/4",
      difficulty: "sedang",
      hints: [
        "Kemungkinan: GG, GA, AG, AA",
        "Total = 4 kemungkinan",
        "2 gambar hanya GG (1 kemungkinan)"
      ],
      explanation: "P(GG) = 1/4",
      tags: ["peluang", "koin", "kejadian majemuk"]
    },
    
    // PELUANG KOMPLEMEN - SEDANG
    {
      question: "Peluang TIDAK muncul angka 6 saat melempar dadu adalah...",
      type: "mcq",
      options: ["1/6", "1/3", "1/2", "5/6"],
      correctAnswer: "5/6",
      difficulty: "sedang",
      hints: [
        "P(tidak 6) = 1 - P(6)",
        "P(6) = 1/6",
        "1 - 1/6 = 5/6"
      ],
      explanation: "P(tidak 6) = 1 - 1/6 = 5/6",
      tags: ["peluang", "komplemen", "kejadian"]
    },
    
    // PELUANG BERSYARAT - SULIT
    {
      question: "Dalam kantong ada 3 bola merah dan 2 bola putih. Diambil 2 bola sekaligus. Peluang kedua bola merah adalah...",
      type: "mcq",
      options: ["1/10", "3/10", "1/5", "2/5"],
      correctAnswer: "3/10",
      difficulty: "sulit",
      hints: [
        "C(3,2) = cara ambil 2 merah dari 3",
        "C(5,2) = cara ambil 2 bola dari 5",
        "P = C(3,2) / C(5,2)"
      ],
      explanation: "P = C(3,2)/C(5,2) = 3/10",
      tags: ["peluang", "kombinasi", "pengambilan"]
    },
    {
      question: "Peluang muncul tepat 1 angka saat melempar 2 koin adalah...",
      type: "mcq",
      options: ["1/4", "1/3", "1/2", "3/4"],
      correctAnswer: "1/2",
      difficulty: "sulit",
      hints: [
        "Kemungkinan: AA, AG, GA, GG",
        "Tepat 1 angka: AG atau GA (2 kemungkinan)",
        "P = 2/4 = 1/2"
      ],
      explanation: "P(tepat 1 A) = P(AG atau GA) = 2/4 = 1/2",
      tags: ["peluang", "koin", "kejadian tertentu"]
    },
  ]
};

// Export all additional topics
export const additionalMathTopics = [
  trigonometryQuestions,
  calculusQuestions,
  statisticsQuestions,
  probabilityQuestions,
];
