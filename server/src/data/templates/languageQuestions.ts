/**
 * Template Bank Soal Bahasa Indonesia & Bahasa Inggris SMA
 */

import { QuizTemplate, QuestionTemplate } from "./physicsQuestions";

// ============================================
// BAHASA INDONESIA - TEKS & STRUKTUR
// ============================================

export const indonesianLanguageQuestions: QuizTemplate = {
  topicCode: "BIND-TEKS-01",
  topicName: "Teks dan Struktur Bahasa",
  description: "Jenis teks, struktur teks, tata bahasa Indonesia",
  difficulty: "beginner",
  estimatedMinutes: 100,
  learningObjectives: [
    "Mengidentifikasi jenis-jenis teks",
    "Memahami struktur teks",
    "Menguasai tata bahasa Indonesia (EYD, kalimat efektif)",
    "Menganalisis unsur kebahasaan"
  ],
  questions: [
    // JENIS TEKS - MUDAH
    {
      question: "Teks yang bertujuan memberikan informasi atau penjelasan kepada pembaca disebut teks...",
      type: "mcq",
      options: ["Narasi", "Deskripsi", "Eksposisi", "Persuasi"],
      correctAnswer: "Eksposisi",
      difficulty: "mudah",
      hints: [
        "Teks yang menjelaskan atau memaparkan",
        "Bertujuan informatif",
        "Ekspo- berarti membuka/memaparkan"
      ],
      explanation: "Teks eksposisi bertujuan menjelaskan atau memberikan informasi kepada pembaca",
      tags: ["bahasa indonesia", "jenis teks", "eksposisi"]
    },
    
    // KALIMAT EFEKTIF - SEDANG
    {
      question: "Kalimat yang TIDAK efektif adalah...",
      type: "mcq",
      options: [
        "Dia membaca buku di perpustakaan.",
        "Saya suka membaca buku.",
        "Tentang masalah ini akan dibahas nanti.",
        "Mereka pergi ke sekolah pagi-pagi."
      ],
      correctAnswer: "Tentang masalah ini akan dibahas nanti.",
      difficulty: "sedang",
      hints: [
        "Kalimat efektif harus memiliki subjek dan predikat",
        "'Tentang' adalah kata depan yang membuat tidak ada subjek",
        "Kalimat ini tidak lengkap strukturnya"
      ],
      explanation: "Kalimat 'Tentang masalah ini...' tidak memiliki subjek yang jelas. Seharusnya 'Masalah ini akan dibahas nanti'",
      tags: ["bahasa indonesia", "kalimat efektif", "tata bahasa"]
    },
    
    // EYD - SEDANG
    {
      question: "Penulisan kata yang benar menurut EYD adalah...",
      type: "mcq",
      options: [
        "sistim",
        "nasehat",
        "praktek",
        "analisis"
      ],
      correctAnswer: "analisis",
      difficulty: "sedang",
      hints: [
        "Sistem (bukan sistim)",
        "Nasihat (bukan nasehat)",
        "Praktik (bukan praktek)"
      ],
      explanation: "Analisis adalah penulisan yang benar. Yang lain: sistem, nasihat, praktik",
      tags: ["bahasa indonesia", "EYD", "ejaan"]
    },
    
    // KATA BAKU - MUDAH
    {
      question: "Kata baku dari 'apotek' adalah...",
      type: "mcq",
      options: ["Apotik", "Apotiq", "Apotek", "Apotex"],
      correctAnswer: "Apotek",
      difficulty: "mudah",
      hints: [
        "Sesuai KBBI (Kamus Besar Bahasa Indonesia)",
        "Bentuk yang sudah benar",
        "Apotek dengan 'e'"
      ],
      explanation: "Kata baku yang benar adalah 'apotek' (bukan apotik)",
      tags: ["bahasa indonesia", "kata baku", "kosakata"]
    },
  ]
};

// ============================================
// BAHASA INDONESIA - SASTRA
// ============================================

export const indonesianLiteratureQuestions: QuizTemplate = {
  topicCode: "BIND-SASTRA-01",
  topicName: "Kesusastraan Indonesia",
  description: "Puisi, prosa, drama, dan unsur-unsur intrinsik",
  difficulty: "intermediate",
  estimatedMinutes: 90,
  learningObjectives: [
    "Memahami unsur intrinsik dan ekstrinsik karya sastra",
    "Menganalisis puisi, cerpen, dan novel",
    "Memahami struktur drama",
    "Mengidentifikasi majas dan gaya bahasa"
  ],
  questions: [
    // UNSUR INTRINSIK - MUDAH
    {
      question: "Pelaku atau tokoh dalam cerita disebut...",
      type: "mcq",
      options: ["Tema", "Alur", "Penokohan", "Latar"],
      correctAnswer: "Penokohan",
      difficulty: "mudah",
      hints: [
        "Unsur intrinsik cerita",
        "Karakter dalam cerita",
        "Tokoh protagonis dan antagonis"
      ],
      explanation: "Penokohan adalah unsur intrinsik yang berkaitan dengan tokoh/pelaku cerita",
      tags: ["bahasa indonesia", "sastra", "unsur intrinsik"]
    },
    
    // MAJAS - SEDANG
    {
      question: "Majas yang menyamakan satu hal dengan hal lain menggunakan kata 'seperti' atau 'bagai' disebut...",
      type: "mcq",
      options: ["Metafora", "Simile", "Personifikasi", "Hiperbola"],
      correctAnswer: "Simile",
      difficulty: "sedang",
      hints: [
        "Menggunakan kata pembanding eksplisit",
        "'Seperti', 'bagai', 'laksana'",
        "Perbandingan langsung"
      ],
      explanation: "Simile (majas perbandingan) menggunakan kata pembanding seperti 'seperti' atau 'bagai'",
      tags: ["bahasa indonesia", "majas", "gaya bahasa"]
    },
  ]
};

// ============================================
// BAHASA INGGRIS - GRAMMAR
// ============================================

export const englishGrammarQuestions: QuizTemplate = {
  topicCode: "BING-GRAM-01",
  topicName: "English Grammar",
  description: "Tenses, parts of speech, sentence structure",
  difficulty: "intermediate",
  estimatedMinutes: 100,
  learningObjectives: [
    "Memahami tenses dalam bahasa Inggris",
    "Menguasai parts of speech",
    "Memahami struktur kalimat",
    "Menerapkan grammar dalam kalimat"
  ],
  questions: [
    // TENSES - MUDAH
    {
      question: "She ... to school every day. (go)",
      type: "mcq",
      options: ["go", "goes", "going", "gone"],
      correctAnswer: "goes",
      difficulty: "mudah",
      hints: [
        "Simple Present Tense",
        "Subject 'she' (third person singular)",
        "Verb + s/es"
      ],
      explanation: "Simple Present Tense dengan subjek 'she' menggunakan verb + s → goes",
      tags: ["english", "grammar", "simple present"]
    },
    
    // PAST TENSE - MUDAH
    {
      question: "I ... a movie yesterday. (watch)",
      type: "mcq",
      options: ["watch", "watches", "watched", "watching"],
      correctAnswer: "watched",
      difficulty: "mudah",
      hints: [
        "Kata 'yesterday' menunjukkan masa lalu",
        "Simple Past Tense",
        "Verb + ed (regular verb)"
      ],
      explanation: "Simple Past Tense menggunakan Verb 2 → watched",
      tags: ["english", "grammar", "simple past"]
    },
    
    // PRESENT CONTINUOUS - SEDANG
    {
      question: "They ... football right now. (play)",
      type: "mcq",
      options: [
        "play",
        "plays",
        "are playing",
        "is playing"
      ],
      correctAnswer: "are playing",
      difficulty: "sedang",
      hints: [
        "'Right now' menunjukkan sedang berlangsung",
        "Present Continuous Tense",
        "Subject 'they' → are + Verb-ing"
      ],
      explanation: "Present Continuous: subject 'they' + are + playing",
      tags: ["english", "grammar", "present continuous"]
    },
    
    // MODAL - SEDANG
    {
      question: "You ... study hard to pass the exam.",
      type: "mcq",
      options: ["must", "musts", "to must", "musting"],
      correctAnswer: "must",
      difficulty: "sedang",
      hints: [
        "Modal verb (harus)",
        "Modal + Verb 1",
        "Tidak ada perubahan bentuk"
      ],
      explanation: "Modal 'must' diikuti Verb 1 tanpa perubahan bentuk",
      tags: ["english", "grammar", "modal"]
    },
  ]
};

// ============================================
// BAHASA INGGRIS - READING
// ============================================

export const englishReadingQuestions: QuizTemplate = {
  topicCode: "BING-READ-01",
  topicName: "Reading Comprehension",
  description: "Understanding texts, main ideas, vocabulary",
  difficulty: "intermediate",
  estimatedMinutes: 80,
  learningObjectives: [
    "Memahami isi teks bahasa Inggris",
    "Menentukan main idea dan supporting details",
    "Memahami vocabulary in context",
    "Membuat inference dari teks"
  ],
  questions: [
    // VOCABULARY - MUDAH
    {
      question: "What is the synonym of 'happy'?",
      type: "mcq",
      options: ["Sad", "Joyful", "Angry", "Tired"],
      correctAnswer: "Joyful",
      difficulty: "mudah",
      hints: [
        "Synonym = persamaan kata",
        "Happy = senang, gembira",
        "Joyful = penuh kegembiraan"
      ],
      explanation: "Joyful adalah sinonim (persamaan) dari happy",
      tags: ["english", "vocabulary", "synonym"]
    },
    
    // ANTONYM - MUDAH
    {
      question: "What is the antonym of 'big'?",
      type: "mcq",
      options: ["Large", "Huge", "Small", "Giant"],
      correctAnswer: "Small",
      difficulty: "mudah",
      hints: [
        "Antonym = antonim/lawan kata",
        "Big = besar",
        "Lawan dari besar adalah..."
      ],
      explanation: "Small (kecil) adalah antonim dari big (besar)",
      tags: ["english", "vocabulary", "antonym"]
    },
  ]
};

export const indonesianTemplates = [
  indonesianLanguageQuestions,
  indonesianLiteratureQuestions,
];

export const englishTemplates = [
  englishGrammarQuestions,
  englishReadingQuestions,
];
