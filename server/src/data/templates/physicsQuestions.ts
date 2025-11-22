/**
 * Template Bank Soal Fisika SMA
 * Topics: Mekanika, Termodinamika, Listrik & Magnet, Gelombang & Optik, Fisika Modern
 */

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

export interface QuizTemplate {
  topicCode: string;
  topicName: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  learningObjectives: string[];
  questions: QuestionTemplate[];
}

// ============================================
// FISIKA - MEKANIKA
// ============================================

export const mechanicsQuestions: QuizTemplate = {
  topicCode: "FIS-MEK-01",
  topicName: "Mekanika",
  description: "Gerak, gaya, usaha, energi, dan momentum",
  difficulty: "intermediate",
  estimatedMinutes: 120,
  learningObjectives: [
    "Menganalisis gerak lurus beraturan dan berubah beraturan",
    "Memahami hukum Newton tentang gerak",
    "Menghitung usaha, energi, dan daya",
    "Memahami konsep momentum dan impuls"
  ],
  questions: [
    // GERAK LURUS - MUDAH
    {
      question: "Sebuah mobil bergerak dengan kecepatan 72 km/jam. Kecepatan tersebut sama dengan ... m/s",
      type: "mcq",
      options: ["10", "15", "20", "25"],
      correctAnswer: "20",
      difficulty: "mudah",
      hints: [
        "Konversi km/jam ke m/s",
        "1 km = 1000 m, 1 jam = 3600 s",
        "Bagi dengan 3,6"
      ],
      explanation: "72 km/jam = 72 × (1000/3600) = 72/3,6 = 20 m/s",
      tags: ["mekanika", "gerak", "konversi satuan"]
    },
    {
      question: "Jarak yang ditempuh benda yang bergerak dengan kecepatan 15 m/s selama 4 sekon adalah...",
      type: "mcq",
      options: ["30 m", "45 m", "60 m", "75 m"],
      correctAnswer: "60 m",
      difficulty: "mudah",
      hints: [
        "s = v × t",
        "v = 15 m/s, t = 4 s",
        "Kalikan keduanya"
      ],
      explanation: "s = v × t = 15 × 4 = 60 m",
      tags: ["mekanika", "gerak lurus", "jarak"]
    },
    
    // HUKUM NEWTON - SEDANG
    {
      question: "Gaya sebesar 20 N bekerja pada benda bermassa 5 kg. Percepatan benda tersebut adalah...",
      type: "mcq",
      options: ["2 m/s²", "4 m/s²", "5 m/s²", "10 m/s²"],
      correctAnswer: "4 m/s²",
      difficulty: "sedang",
      hints: [
        "Gunakan Hukum II Newton: F = m × a",
        "a = F / m",
        "20 / 5 = ?"
      ],
      explanation: "a = F/m = 20/5 = 4 m/s²",
      tags: ["mekanika", "hukum newton", "percepatan"]
    },
    {
      question: "Benda bermassa 2 kg mula-mula diam, kemudian diberi gaya 10 N. Kecepatan benda setelah 4 sekon adalah...",
      type: "mcq",
      options: ["10 m/s", "20 m/s", "30 m/s", "40 m/s"],
      correctAnswer: "20 m/s",
      difficulty: "sedang",
      hints: [
        "Cari percepatan: a = F/m = 10/2 = 5 m/s²",
        "Gunakan: v = v₀ + at",
        "v = 0 + 5 × 4"
      ],
      explanation: "a = F/m = 5 m/s². v = v₀ + at = 0 + 5×4 = 20 m/s",
      tags: ["mekanika", "GLBB", "kecepatan"]
    },
    
    // USAHA DAN ENERGI - SEDANG
    {
      question: "Usaha yang dilakukan untuk menggerakkan benda sejauh 5 m dengan gaya 20 N searah perpindahan adalah...",
      type: "mcq",
      options: ["50 J", "75 J", "100 J", "125 J"],
      correctAnswer: "100 J",
      difficulty: "sedang",
      hints: [
        "W = F × s",
        "F = 20 N, s = 5 m",
        "20 × 5 = ?"
      ],
      explanation: "W = F × s = 20 × 5 = 100 J",
      tags: ["mekanika", "usaha", "energi"]
    },
    {
      question: "Energi kinetik benda bermassa 4 kg yang bergerak dengan kecepatan 10 m/s adalah...",
      type: "mcq",
      options: ["100 J", "200 J", "300 J", "400 J"],
      correctAnswer: "200 J",
      difficulty: "sedang",
      hints: [
        "Ek = ½ m v²",
        "Ek = ½ × 4 × 10²",
        "= 2 × 100"
      ],
      explanation: "Ek = ½ × 4 × 10² = 2 × 100 = 200 J",
      tags: ["mekanika", "energi kinetik", "gerak"]
    },
    
    // MOMENTUM - SULIT
    {
      question: "Benda bermassa 3 kg bergerak dengan kecepatan 8 m/s. Momentum benda tersebut adalah...",
      type: "mcq",
      options: ["12 kg·m/s", "18 kg·m/s", "24 kg·m/s", "32 kg·m/s"],
      correctAnswer: "24 kg·m/s",
      difficulty: "mudah",
      hints: [
        "p = m × v",
        "p = 3 × 8",
        "Momentum adalah massa × kecepatan"
      ],
      explanation: "p = m × v = 3 × 8 = 24 kg·m/s",
      tags: ["mekanika", "momentum", "impuls"]
    },
  ]
};

// ============================================
// FISIKA - TERMODINAMIKA
// ============================================

export const thermodynamicsQuestions: QuizTemplate = {
  topicCode: "FIS-TERMO-01",
  topicName: "Termodinamika",
  description: "Suhu, kalor, dan hukum termodinamika",
  difficulty: "intermediate",
  estimatedMinutes: 90,
  learningObjectives: [
    "Memahami konsep suhu dan pengukurannya",
    "Menghitung kalor dan perubahan wujud",
    "Memahami hukum termodinamika",
    "Menganalisis proses perpindahan kalor"
  ],
  questions: [
    // SUHU - MUDAH
    {
      question: "Suhu 100°C sama dengan ... K (Kelvin)",
      type: "mcq",
      options: ["273 K", "323 K", "373 K", "473 K"],
      correctAnswer: "373 K",
      difficulty: "mudah",
      hints: [
        "T(K) = T(°C) + 273",
        "T = 100 + 273",
        "= 373 K"
      ],
      explanation: "T(K) = 100 + 273 = 373 K",
      tags: ["termodinamika", "suhu", "konversi"]
    },
    
    // KALOR - SEDANG
    {
      question: "Kalor yang diperlukan untuk menaikkan suhu 2 kg air dari 20°C menjadi 70°C adalah... (c air = 4200 J/kg°C)",
      type: "mcq",
      options: ["210 kJ", "315 kJ", "420 kJ", "630 kJ"],
      correctAnswer: "420 kJ",
      difficulty: "sedang",
      hints: [
        "Q = m × c × ΔT",
        "Q = 2 × 4200 × (70-20)",
        "= 2 × 4200 × 50"
      ],
      explanation: "Q = m × c × ΔT = 2 × 4200 × 50 = 420.000 J = 420 kJ",
      tags: ["termodinamika", "kalor", "perubahan suhu"]
    },
    
    // PEMUAIAN - SEDANG
    {
      question: "Jika panjang batang besi 100 cm pada suhu 20°C, dan koefisien muai panjang 0,000012/°C, panjang batang pada suhu 120°C adalah...",
      type: "mcq",
      options: ["100,06 cm", "100,12 cm", "100,24 cm", "101,2 cm"],
      correctAnswer: "100,12 cm",
      difficulty: "sedang",
      hints: [
        "ΔL = L₀ × α × ΔT",
        "ΔL = 100 × 0,000012 × (120-20)",
        "L = L₀ + ΔL"
      ],
      explanation: "ΔL = 100 × 0,000012 × 100 = 0,12 cm. L = 100 + 0,12 = 100,12 cm",
      tags: ["termodinamika", "pemuaian", "linear"]
    },
  ]
};

// ============================================
// FISIKA - LISTRIK & MAGNET
// ============================================

export const electricityQuestions: QuizTemplate = {
  topicCode: "FIS-LIST-01",
  topicName: "Listrik & Magnet",
  description: "Arus listrik, hukum Ohm, rangkaian, dan medan magnet",
  difficulty: "intermediate",
  estimatedMinutes: 100,
  learningObjectives: [
    "Memahami konsep arus, tegangan, dan hambatan",
    "Menerapkan hukum Ohm",
    "Menganalisis rangkaian listrik sederhana",
    "Memahami medan magnet dan induksi"
  ],
  questions: [
    // HUKUM OHM - MUDAH
    {
      question: "Jika tegangan 12 V diberikan pada hambatan 4 Ω, arus yang mengalir adalah...",
      type: "mcq",
      options: ["2 A", "3 A", "4 A", "8 A"],
      correctAnswer: "3 A",
      difficulty: "mudah",
      hints: [
        "Gunakan hukum Ohm: V = I × R",
        "I = V / R",
        "12 / 4 = ?"
      ],
      explanation: "I = V/R = 12/4 = 3 A",
      tags: ["listrik", "hukum ohm", "arus"]
    },
    
    // RANGKAIAN SERI - SEDANG
    {
      question: "Dua hambatan 3 Ω dan 6 Ω dirangkai seri. Hambatan totalnya adalah...",
      type: "mcq",
      options: ["2 Ω", "3 Ω", "9 Ω", "18 Ω"],
      correctAnswer: "9 Ω",
      difficulty: "mudah",
      hints: [
        "Rangkaian seri: R_total = R₁ + R₂",
        "R_total = 3 + 6",
        "= 9 Ω"
      ],
      explanation: "R_total = 3 + 6 = 9 Ω",
      tags: ["listrik", "rangkaian seri", "hambatan"]
    },
    
    // DAYA LISTRIK - SEDANG
    {
      question: "Daya lampu yang dialiri arus 2 A pada tegangan 12 V adalah...",
      type: "mcq",
      options: ["6 W", "12 W", "24 W", "48 W"],
      correctAnswer: "24 W",
      difficulty: "sedang",
      hints: [
        "P = V × I",
        "P = 12 × 2",
        "Daya adalah tegangan × arus"
      ],
      explanation: "P = V × I = 12 × 2 = 24 W",
      tags: ["listrik", "daya", "energi"]
    },
  ]
};

export const physicsTemplates = [
  mechanicsQuestions,
  thermodynamicsQuestions,
  electricityQuestions,
];
