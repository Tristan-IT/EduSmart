/**
 * Template Bank Soal Matematika SMA
 * Comprehensive question bank covering all major topics
 * Format: Subject → Topic → Questions (mudah/sedang/sulit)
 */

export interface QuizTemplate {
  topicCode: string;
  topicName: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  learningObjectives: string[];
  questions: QuestionTemplate[];
}

export interface QuestionTemplate {
  question: string;
  type: "mcq" | "multi-select" | "short-answer";
  options?: string[];
  correctAnswer: string | string[];
  difficulty: "mudah" | "sedang" | "sulit";
  hints: string[];
  explanation: string;
  tags: string[];
  imageUrl?: string;
}

// ============================================
// TOPIC 1: ALJABAR
// ============================================

export const algebraQuestions: QuizTemplate = {
  topicCode: "ALG-01",
  topicName: "Aljabar",
  description: "Persamaan linear, kuadrat, eksponen, dan logaritma",
  difficulty: "intermediate",
  estimatedMinutes: 180,
  learningObjectives: [
    "Menyelesaikan persamaan linear satu dan dua variabel",
    "Menyelesaikan persamaan kuadrat dengan berbagai metode",
    "Memahami sifat-sifat eksponen dan logaritma",
    "Menerapkan aljabar dalam pemecahan masalah"
  ],
  questions: [
    // PERSAMAAN LINEAR - MUDAH
    {
      question: "Tentukan nilai x dari persamaan: 2x + 5 = 15",
      type: "mcq",
      options: ["x = 3", "x = 5", "x = 7", "x = 10"],
      correctAnswer: "x = 5",
      difficulty: "mudah",
      hints: [
        "Pindahkan konstanta ke ruas kanan",
        "2x = 15 - 5",
        "Bagi kedua ruas dengan 2"
      ],
      explanation: "Langkah penyelesaian: 2x + 5 = 15 → 2x = 15 - 5 → 2x = 10 → x = 5",
      tags: ["persamaan linear", "satu variabel", "dasar"]
    },
    {
      question: "Jika 3x - 7 = 2x + 3, maka nilai x adalah...",
      type: "mcq",
      options: ["5", "7", "10", "12"],
      correctAnswer: "10",
      difficulty: "mudah",
      hints: [
        "Kumpulkan variabel x di satu ruas",
        "Pindahkan konstanta ke ruas lain",
        "3x - 2x = 3 + 7"
      ],
      explanation: "3x - 7 = 2x + 3 → 3x - 2x = 3 + 7 → x = 10",
      tags: ["persamaan linear", "variabel di kedua ruas"]
    },
    {
      question: "Himpunan penyelesaian dari 4(x - 2) = 2(x + 4) adalah...",
      type: "mcq",
      options: ["{6}", "{8}", "{10}", "{12}"],
      correctAnswer: "{8}",
      difficulty: "mudah",
      hints: [
        "Kalikan masing-masing kurung",
        "4x - 8 = 2x + 8",
        "Kumpulkan variabel dan konstanta"
      ],
      explanation: "4(x - 2) = 2(x + 4) → 4x - 8 = 2x + 8 → 4x - 2x = 8 + 8 → 2x = 16 → x = 8",
      tags: ["persamaan linear", "distributif", "kurung"]
    },
    
    // PERSAMAAN LINEAR - SEDANG
    {
      question: "Tentukan nilai x dan y dari sistem persamaan: 2x + y = 10 dan x - y = 2",
      type: "mcq",
      options: [
        "x = 3, y = 4",
        "x = 4, y = 2",
        "x = 5, y = 0",
        "x = 6, y = -2"
      ],
      correctAnswer: "x = 4, y = 2",
      difficulty: "sedang",
      hints: [
        "Gunakan metode eliminasi atau substitusi",
        "Jumlahkan kedua persamaan untuk eliminasi y",
        "2x + y + x - y = 10 + 2"
      ],
      explanation: "Eliminasi: (2x + y) + (x - y) = 12 → 3x = 12 → x = 4. Substitusi ke persamaan kedua: 4 - y = 2 → y = 2",
      tags: ["sistem persamaan", "dua variabel", "eliminasi"]
    },
    {
      question: "Jika (x + 2)/(x - 3) = 2, maka nilai x adalah...",
      type: "mcq",
      options: ["5", "6", "7", "8"],
      correctAnswer: "8",
      difficulty: "sedang",
      hints: [
        "Kalikan silang: (x + 2) = 2(x - 3)",
        "x + 2 = 2x - 6",
        "Kumpulkan variabel x"
      ],
      explanation: "(x + 2)/(x - 3) = 2 → x + 2 = 2(x - 3) → x + 2 = 2x - 6 → 2 + 6 = 2x - x → x = 8",
      tags: ["persamaan pecahan", "proporsi"]
    },
    
    // PERSAMAAN KUADRAT - MUDAH
    {
      question: "Akar-akar persamaan x² - 5x + 6 = 0 adalah...",
      type: "mcq",
      options: [
        "x = 1 atau x = 6",
        "x = 2 atau x = 3",
        "x = -2 atau x = -3",
        "x = 1 atau x = -6"
      ],
      correctAnswer: "x = 2 atau x = 3",
      difficulty: "mudah",
      hints: [
        "Faktorkan: (x - a)(x - b) = 0",
        "Cari dua bilangan yang jika dikali = 6 dan dijumlah = 5",
        "Bilangan tersebut adalah 2 dan 3"
      ],
      explanation: "x² - 5x + 6 = 0 → (x - 2)(x - 3) = 0 → x = 2 atau x = 3",
      tags: ["persamaan kuadrat", "faktorisasi", "mudah"]
    },
    {
      question: "Nilai x yang memenuhi x² = 25 adalah...",
      type: "mcq",
      options: ["x = 5", "x = -5", "x = ±5", "x = ±25"],
      correctAnswer: "x = ±5",
      difficulty: "mudah",
      hints: [
        "Akar kuadrat dari 25",
        "Ingat: akar kuadrat memiliki dua nilai (positif dan negatif)",
        "√25 = ±5"
      ],
      explanation: "x² = 25 → x = ±√25 → x = ±5",
      tags: ["persamaan kuadrat", "akar kuadrat", "dasar"]
    },
    
    // PERSAMAAN KUADRAT - SEDANG
    {
      question: "Dengan menggunakan rumus abc, tentukan akar-akar dari 2x² + 3x - 2 = 0",
      type: "mcq",
      options: [
        "x = 1/2 atau x = -2",
        "x = -1/2 atau x = 2",
        "x = 1 atau x = -2",
        "x = 2 atau x = -1"
      ],
      correctAnswer: "x = 1/2 atau x = -2",
      difficulty: "sedang",
      hints: [
        "a = 2, b = 3, c = -2",
        "x = (-b ± √(b² - 4ac)) / 2a",
        "Diskriminan D = 9 - 4(2)(-2) = 9 + 16 = 25"
      ],
      explanation: "x = (-3 ± √25) / 4 = (-3 ± 5) / 4. Jadi x₁ = 2/4 = 1/2 atau x₂ = -8/4 = -2",
      tags: ["persamaan kuadrat", "rumus abc", "diskriminan"]
    },
    {
      question: "Jika akar-akar persamaan x² - 6x + k = 0 adalah 2 dan 4, maka nilai k adalah...",
      type: "mcq",
      options: ["6", "8", "10", "12"],
      correctAnswer: "8",
      difficulty: "sedang",
      hints: [
        "Gunakan hubungan akar-akar: x₁ · x₂ = c/a",
        "x₁ = 2 dan x₂ = 4",
        "Hasil kali akar = k/1"
      ],
      explanation: "Hasil kali akar-akar = k → 2 × 4 = k → k = 8",
      tags: ["persamaan kuadrat", "hubungan akar", "parameter"]
    },
    
    // PERSAMAAN KUADRAT - SULIT
    {
      question: "Jika α dan β adalah akar-akar dari x² - 3x + 1 = 0, maka nilai α² + β² adalah...",
      type: "mcq",
      options: ["5", "7", "9", "11"],
      correctAnswer: "7",
      difficulty: "sulit",
      hints: [
        "Gunakan identitas: α² + β² = (α + β)² - 2αβ",
        "α + β = 3 (koefisien x dengan tanda berlawanan)",
        "αβ = 1 (konstanta)"
      ],
      explanation: "α + β = 3, αβ = 1. Maka α² + β² = (α + β)² - 2αβ = 9 - 2(1) = 7",
      tags: ["persamaan kuadrat", "identitas akar", "manipulasi aljabar"]
    },
    
    // EKSPONEN - MUDAH
    {
      question: "Hasil dari 2³ × 2² adalah...",
      type: "mcq",
      options: ["2⁵", "2⁶", "4⁵", "4⁶"],
      correctAnswer: "2⁵",
      difficulty: "mudah",
      hints: [
        "Jika basis sama, tambahkan eksponen",
        "aᵐ × aⁿ = aᵐ⁺ⁿ",
        "2³ × 2² = 2³⁺²"
      ],
      explanation: "2³ × 2² = 2³⁺² = 2⁵ = 32",
      tags: ["eksponen", "perkalian", "sifat eksponen"]
    },
    {
      question: "Bentuk sederhana dari (3²)³ adalah...",
      type: "mcq",
      options: ["3⁵", "3⁶", "9⁶", "27"],
      correctAnswer: "3⁶",
      difficulty: "mudah",
      hints: [
        "Gunakan sifat (aᵐ)ⁿ = aᵐⁿ",
        "Kalikan eksponen",
        "2 × 3 = 6"
      ],
      explanation: "(3²)³ = 3²ˣ³ = 3⁶ = 729",
      tags: ["eksponen", "pangkat dari pangkat"]
    },
    
    // EKSPONEN - SEDANG
    {
      question: "Jika 2ˣ = 16, maka nilai x adalah...",
      type: "mcq",
      options: ["2", "3", "4", "5"],
      correctAnswer: "4",
      difficulty: "sedang",
      hints: [
        "Ubah 16 menjadi bentuk pangkat 2",
        "16 = 2⁴",
        "Samakan basis, maka eksponen sama"
      ],
      explanation: "2ˣ = 16 → 2ˣ = 2⁴ → x = 4",
      tags: ["persamaan eksponen", "basis sama"]
    },
    {
      question: "Nilai x yang memenuhi 3ˣ⁺¹ = 27 adalah...",
      type: "mcq",
      options: ["1", "2", "3", "4"],
      correctAnswer: "2",
      difficulty: "sedang",
      hints: [
        "Ubah 27 menjadi bentuk pangkat 3",
        "27 = 3³",
        "x + 1 = 3"
      ],
      explanation: "3ˣ⁺¹ = 27 → 3ˣ⁺¹ = 3³ → x + 1 = 3 → x = 2",
      tags: ["persamaan eksponen", "variabel pada eksponen"]
    },
    
    // EKSPONEN - SULIT
    {
      question: "Jika 4ˣ - 2ˣ⁺¹ - 8 = 0, maka nilai x adalah...",
      type: "mcq",
      options: ["1", "2", "3", "4"],
      correctAnswer: "2",
      difficulty: "sulit",
      hints: [
        "Ubah 4ˣ menjadi (2²)ˣ = 2²ˣ",
        "Misalkan y = 2ˣ, maka 2²ˣ = y²",
        "y² - 2y - 8 = 0"
      ],
      explanation: "Misalkan y = 2ˣ, maka y² - 2y - 8 = 0 → (y - 4)(y + 2) = 0 → y = 4 (positif) → 2ˣ = 4 = 2² → x = 2",
      tags: ["persamaan eksponen", "substitusi", "kuadrat"]
    },
    
    // LOGARITMA - MUDAH
    {
      question: "Nilai dari ²log 8 adalah...",
      type: "mcq",
      options: ["2", "3", "4", "8"],
      correctAnswer: "3",
      difficulty: "mudah",
      hints: [
        "²log 8 berarti 2 pangkat berapa = 8",
        "2³ = 8",
        "Jadi ²log 8 = 3"
      ],
      explanation: "²log 8 = ²log 2³ = 3",
      tags: ["logaritma", "definisi", "basis 2"]
    },
    {
      question: "Hasil dari ³log 27 + ³log 1 adalah...",
      type: "mcq",
      options: ["1", "2", "3", "4"],
      correctAnswer: "3",
      difficulty: "mudah",
      hints: [
        "³log 27 = 3 (karena 3³ = 27)",
        "³log 1 = 0 (karena 3⁰ = 1)",
        "Jumlahkan hasilnya"
      ],
      explanation: "³log 27 + ³log 1 = 3 + 0 = 3",
      tags: ["logaritma", "penjumlahan", "basis 3"]
    },
    
    // LOGARITMA - SEDANG
    {
      question: "Nilai dari ⁵log 25 + ⁵log 5 adalah...",
      type: "mcq",
      options: ["2", "3", "4", "5"],
      correctAnswer: "3",
      difficulty: "sedang",
      hints: [
        "Gunakan sifat ᵃlog b + ᵃlog c = ᵃlog (b × c)",
        "⁵log 25 + ⁵log 5 = ⁵log (25 × 5)",
        "25 × 5 = 125 = 5³"
      ],
      explanation: "⁵log 25 + ⁵log 5 = ⁵log (25 × 5) = ⁵log 125 = ⁵log 5³ = 3",
      tags: ["logaritma", "sifat penjumlahan", "perkalian"]
    },
    {
      question: "Jika ²log x = 5, maka nilai x adalah...",
      type: "mcq",
      options: ["10", "16", "25", "32"],
      correctAnswer: "32",
      difficulty: "sedang",
      hints: [
        "Ubah ke bentuk eksponen",
        "²log x = 5 berarti 2⁵ = x",
        "Hitung 2⁵"
      ],
      explanation: "²log x = 5 → x = 2⁵ = 32",
      tags: ["logaritma", "bentuk eksponen", "konversi"]
    },
    
    // LOGARITMA - SULIT
    {
      question: "Jika ²log 3 = a, maka nilai dari ⁶log 12 dalam a adalah...",
      type: "mcq",
      options: [
        "(2 + a)/(1 + a)",
        "(1 + 2a)/(1 + a)",
        "(2 + a)/a",
        "(1 + a)/(2 + a)"
      ],
      correctAnswer: "(2 + a)/(1 + a)",
      difficulty: "sulit",
      hints: [
        "⁶log 12 = (²log 12)/(²log 6)",
        "12 = 4 × 3 = 2² × 3",
        "6 = 2 × 3"
      ],
      explanation: "⁶log 12 = (²log 12)/(²log 6) = (²log 2² + ²log 3)/(²log 2 + ²log 3) = (2 + a)/(1 + a)",
      tags: ["logaritma", "perubahan basis", "substitusi"]
    },
  ]
};

// ============================================
// TOPIC 2: GEOMETRI
// ============================================

export const geometryQuestions: QuizTemplate = {
  topicCode: "GEOM-01",
  topicName: "Geometri",
  description: "Bangun datar, bangun ruang, dan transformasi geometri",
  difficulty: "intermediate",
  estimatedMinutes: 150,
  learningObjectives: [
    "Menghitung luas dan keliling bangun datar",
    "Menghitung volume dan luas permukaan bangun ruang",
    "Memahami konsep transformasi geometri",
    "Menerapkan teorema Pythagoras dan trigonometri dasar"
  ],
  questions: [
    // BANGUN DATAR - MUDAH
    {
      question: "Luas persegi dengan sisi 8 cm adalah...",
      type: "mcq",
      options: ["32 cm²", "48 cm²", "64 cm²", "80 cm²"],
      correctAnswer: "64 cm²",
      difficulty: "mudah",
      hints: [
        "Luas persegi = sisi × sisi",
        "L = s²",
        "8 × 8 = ?"
      ],
      explanation: "Luas = s² = 8² = 64 cm²",
      tags: ["bangun datar", "persegi", "luas"]
    },
    {
      question: "Keliling persegi panjang dengan panjang 10 cm dan lebar 6 cm adalah...",
      type: "mcq",
      options: ["32 cm", "40 cm", "48 cm", "60 cm"],
      correctAnswer: "32 cm",
      difficulty: "mudah",
      hints: [
        "Keliling = 2 × (panjang + lebar)",
        "K = 2 × (p + l)",
        "2 × (10 + 6) = ?"
      ],
      explanation: "Keliling = 2 × (10 + 6) = 2 × 16 = 32 cm",
      tags: ["bangun datar", "persegi panjang", "keliling"]
    },
    {
      question: "Luas segitiga dengan alas 12 cm dan tinggi 8 cm adalah...",
      type: "mcq",
      options: ["48 cm²", "60 cm²", "72 cm²", "96 cm²"],
      correctAnswer: "48 cm²",
      difficulty: "mudah",
      hints: [
        "Luas segitiga = 1/2 × alas × tinggi",
        "L = 1/2 × a × t",
        "1/2 × 12 × 8 = ?"
      ],
      explanation: "Luas = 1/2 × 12 × 8 = 48 cm²",
      tags: ["bangun datar", "segitiga", "luas"]
    },
    
    // BANGUN DATAR - SEDANG
    {
      question: "Luas lingkaran dengan diameter 14 cm adalah... (π = 22/7)",
      type: "mcq",
      options: ["154 cm²", "308 cm²", "616 cm²", "1232 cm²"],
      correctAnswer: "154 cm²",
      difficulty: "sedang",
      hints: [
        "Jari-jari = diameter / 2 = 7 cm",
        "Luas = π × r²",
        "22/7 × 7² = ?"
      ],
      explanation: "r = 14/2 = 7 cm. Luas = 22/7 × 7² = 22/7 × 49 = 154 cm²",
      tags: ["bangun datar", "lingkaran", "luas", "diameter"]
    },
    {
      question: "Luas trapesium dengan sisi sejajar 8 cm dan 12 cm serta tinggi 5 cm adalah...",
      type: "mcq",
      options: ["40 cm²", "50 cm²", "60 cm²", "100 cm²"],
      correctAnswer: "50 cm²",
      difficulty: "sedang",
      hints: [
        "Luas trapesium = 1/2 × (jumlah sisi sejajar) × tinggi",
        "L = 1/2 × (a + b) × t",
        "1/2 × (8 + 12) × 5 = ?"
      ],
      explanation: "Luas = 1/2 × (8 + 12) × 5 = 1/2 × 20 × 5 = 50 cm²",
      tags: ["bangun datar", "trapesium", "luas"]
    },
    
    // PYTHAGORAS - SEDANG
    {
      question: "Panjang sisi miring segitiga siku-siku dengan sisi 6 cm dan 8 cm adalah...",
      type: "mcq",
      options: ["8 cm", "10 cm", "12 cm", "14 cm"],
      correctAnswer: "10 cm",
      difficulty: "sedang",
      hints: [
        "Gunakan teorema Pythagoras: c² = a² + b²",
        "c² = 6² + 8²",
        "c² = 36 + 64 = 100"
      ],
      explanation: "c² = 6² + 8² = 36 + 64 = 100 → c = √100 = 10 cm",
      tags: ["pythagoras", "segitiga siku-siku", "teorema"]
    },
    
    // BANGUN RUANG - MUDAH
    {
      question: "Volume kubus dengan rusuk 5 cm adalah...",
      type: "mcq",
      options: ["25 cm³", "75 cm³", "125 cm³", "150 cm³"],
      correctAnswer: "125 cm³",
      difficulty: "mudah",
      hints: [
        "Volume kubus = rusuk³",
        "V = r³",
        "5³ = ?"
      ],
      explanation: "Volume = 5³ = 125 cm³",
      tags: ["bangun ruang", "kubus", "volume"]
    },
    {
      question: "Volume balok dengan panjang 10 cm, lebar 6 cm, dan tinggi 4 cm adalah...",
      type: "mcq",
      options: ["120 cm³", "180 cm³", "240 cm³", "300 cm³"],
      correctAnswer: "240 cm³",
      difficulty: "mudah",
      hints: [
        "Volume balok = panjang × lebar × tinggi",
        "V = p × l × t",
        "10 × 6 × 4 = ?"
      ],
      explanation: "Volume = 10 × 6 × 4 = 240 cm³",
      tags: ["bangun ruang", "balok", "volume"]
    },
    
    // BANGUN RUANG - SEDANG
    {
      question: "Volume tabung dengan jari-jari 7 cm dan tinggi 10 cm adalah... (π = 22/7)",
      type: "mcq",
      options: ["1.540 cm³", "1.650 cm³", "1.760 cm³", "1.870 cm³"],
      correctAnswer: "1.540 cm³",
      difficulty: "sedang",
      hints: [
        "Volume tabung = π × r² × t",
        "V = 22/7 × 7² × 10",
        "Hitung step by step"
      ],
      explanation: "V = 22/7 × 7² × 10 = 22/7 × 49 × 10 = 22 × 7 × 10 = 1.540 cm³",
      tags: ["bangun ruang", "tabung", "volume"]
    },
    {
      question: "Luas permukaan kubus dengan rusuk 6 cm adalah...",
      type: "mcq",
      options: ["144 cm²", "180 cm²", "216 cm²", "252 cm²"],
      correctAnswer: "216 cm²",
      difficulty: "sedang",
      hints: [
        "Kubus memiliki 6 sisi persegi",
        "Luas permukaan = 6 × (rusuk)²",
        "6 × 6² = ?"
      ],
      explanation: "Luas permukaan = 6 × 6² = 6 × 36 = 216 cm²",
      tags: ["bangun ruang", "kubus", "luas permukaan"]
    },
  ]
};

// Export all templates
export const mathTopics = [
  algebraQuestions,
  geometryQuestions,
  // Will add more topics: trigonometry, calculus, statistics, probability
];
