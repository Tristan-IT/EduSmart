/**
 * Template Bank Soal Ilmu Sosial SMA
 * Subjects: Sejarah, Geografi, Ekonomi, Sosiologi
 */

import { QuizTemplate, QuestionTemplate } from "./physicsQuestions";

// ============================================
// SEJARAH - INDONESIA
// ============================================

export const historyIndonesiaQuestions: QuizTemplate = {
  topicCode: "SEJ-IND-01",
  topicName: "Sejarah Indonesia",
  description: "Kerajaan Nusantara, penjajahan, kemerdekaan, dan pasca kemerdekaan",
  difficulty: "beginner",
  estimatedMinutes: 100,
  learningObjectives: [
    "Memahami kerajaan-kerajaan di Nusantara",
    "Memahami masa kolonialisme dan imperialisme",
    "Memahami perjuangan kemerdekaan Indonesia",
    "Memahami perkembangan Indonesia pasca kemerdekaan"
  ],
  questions: [
    // KERAJAAN - MUDAH
    {
      question: "Kerajaan Hindu-Buddha pertama di Indonesia adalah...",
      type: "mcq",
      options: ["Majapahit", "Sriwijaya", "Kutai", "Mataram"],
      correctAnswer: "Kutai",
      difficulty: "mudah",
      hints: [
        "Berlokasi di Kalimantan Timur",
        "Abad ke-4 Masehi",
        "Peninggalan prasasti Yupa"
      ],
      explanation: "Kerajaan Kutai (abad ke-4) adalah kerajaan Hindu tertua di Indonesia",
      tags: ["sejarah", "kerajaan", "hindu-buddha"]
    },
    
    // PENJAJAHAN - MUDAH
    {
      question: "Bangsa Eropa yang pertama kali datang ke Indonesia untuk berdagang rempah-rempah adalah...",
      type: "mcq",
      options: ["Inggris", "Belanda", "Portugis", "Spanyol"],
      correctAnswer: "Portugis",
      difficulty: "mudah",
      hints: [
        "Tahun 1512",
        "Menguasai Malaka",
        "Negara di semenanjung Iberia"
      ],
      explanation: "Portugis adalah bangsa Eropa pertama yang datang ke Indonesia (1512)",
      tags: ["sejarah", "penjajahan", "portugis"]
    },
    
    // KEMERDEKAAN - SEDANG
    {
      question: "Proklamasi kemerdekaan Indonesia dibacakan pada tanggal...",
      type: "mcq",
      options: [
        "17 Agustus 1945",
        "17 Agustus 1950",
        "1 Juni 1945",
        "18 Agustus 1945"
      ],
      correctAnswer: "17 Agustus 1945",
      difficulty: "mudah",
      hints: [
        "Hari kemerdekaan Indonesia",
        "Bulan Agustus tahun 1945",
        "Tanggal 17"
      ],
      explanation: "Proklamasi kemerdekaan RI dibacakan 17 Agustus 1945 oleh Soekarno-Hatta",
      tags: ["sejarah", "kemerdekaan", "proklamasi"]
    },
    
    // TOKOH - SEDANG
    {
      question: "Presiden pertama Republik Indonesia adalah...",
      type: "mcq",
      options: [
        "Mohammad Hatta",
        "Soekarno",
        "Soeharto",
        "B.J. Habibie"
      ],
      correctAnswer: "Soekarno",
      difficulty: "mudah",
      hints: [
        "Proklamator kemerdekaan",
        "Bersama Mohammad Hatta",
        "Presiden RI pertama (1945-1967)"
      ],
      explanation: "Ir. Soekarno adalah presiden pertama RI (1945-1967)",
      tags: ["sejarah", "tokoh", "presiden"]
    },
  ]
};

// ============================================
// GEOGRAFI - FISIK & LINGKUNGAN
// ============================================

export const geographyQuestions: QuizTemplate = {
  topicCode: "GEO-FIS-01",
  topicName: "Geografi Fisik",
  description: "Litosfer, hidrosfer, atmosfer, dan fenomena alam",
  difficulty: "beginner",
  estimatedMinutes: 90,
  learningObjectives: [
    "Memahami struktur bumi (litosfer)",
    "Memahami siklus air (hidrosfer)",
    "Memahami lapisan atmosfer dan iklim",
    "Menganalisis fenomena alam"
  ],
  questions: [
    // LITOSFER - MUDAH
    {
      question: "Lapisan bumi yang paling luar dan padat disebut...",
      type: "mcq",
      options: ["Inti dalam", "Mantel", "Kerak bumi", "Inti luar"],
      correctAnswer: "Kerak bumi",
      difficulty: "mudah",
      hints: [
        "Lapisan terluar tempat kita hidup",
        "Berbentuk padat dan dingin",
        "Crustae (Latin) = kulit"
      ],
      explanation: "Kerak bumi (crust) adalah lapisan terluar bumi yang padat",
      tags: ["geografi", "litosfer", "struktur bumi"]
    },
    
    // HIDROSFER - MUDAH
    {
      question: "Proses perubahan air dari bentuk cair menjadi gas disebut...",
      type: "mcq",
      options: ["Kondensasi", "Presipitasi", "Evaporasi", "Infiltrasi"],
      correctAnswer: "Evaporasi",
      difficulty: "mudah",
      hints: [
        "Penguapan air",
        "Cair → gas",
        "Terjadi karena panas matahari"
      ],
      explanation: "Evaporasi adalah proses penguapan air dari cair menjadi gas (uap air)",
      tags: ["geografi", "hidrosfer", "siklus air"]
    },
    
    // ATMOSFER - SEDANG
    {
      question: "Lapisan atmosfer yang paling dekat dengan permukaan bumi adalah...",
      type: "mcq",
      options: ["Stratosfer", "Mesosfer", "Troposfer", "Termosfer"],
      correctAnswer: "Troposfer",
      difficulty: "sedang",
      hints: [
        "Tempat terjadinya cuaca",
        "Ketinggian 0-12 km",
        "Lapisan paling bawah"
      ],
      explanation: "Troposfer adalah lapisan atmosfer paling bawah (0-12 km) tempat terjadinya cuaca",
      tags: ["geografi", "atmosfer", "lapisan"]
    },
  ]
};

// ============================================
// EKONOMI - DASAR
// ============================================

export const economicsQuestions: QuizTemplate = {
  topicCode: "EKO-DASAR-01",
  topicName: "Ekonomi Dasar",
  description: "Konsep ekonomi, permintaan-penawaran, pasar",
  difficulty: "beginner",
  estimatedMinutes: 80,
  learningObjectives: [
    "Memahami konsep dasar ekonomi",
    "Memahami hukum permintaan dan penawaran",
    "Menganalisis keseimbangan pasar",
    "Memahami sistem ekonomi"
  ],
  questions: [
    // KONSEP DASAR - MUDAH
    {
      question: "Ilmu yang mempelajari perilaku manusia dalam memenuhi kebutuhan yang tidak terbatas dengan sumber daya yang terbatas disebut...",
      type: "mcq",
      options: ["Sosiologi", "Ekonomi", "Geografi", "Psikologi"],
      correctAnswer: "Ekonomi",
      difficulty: "mudah",
      hints: [
        "Ilmu tentang kelangkaan",
        "Kebutuhan vs sumber daya",
        "Oikos (rumah) + nomos (aturan)"
      ],
      explanation: "Ekonomi adalah ilmu tentang pengelolaan sumber daya yang terbatas untuk memenuhi kebutuhan",
      tags: ["ekonomi", "konsep dasar", "definisi"]
    },
    
    // PERMINTAAN - SEDANG
    {
      question: "Jika harga suatu barang naik, maka permintaan akan...",
      type: "mcq",
      options: [
        "Naik",
        "Turun",
        "Tetap",
        "Tidak menentu"
      ],
      correctAnswer: "Turun",
      difficulty: "sedang",
      hints: [
        "Hukum permintaan",
        "Hubungan terbalik",
        "Harga naik → permintaan..."
      ],
      explanation: "Hukum permintaan: jika harga naik, permintaan turun (ceteris paribus)",
      tags: ["ekonomi", "permintaan", "hukum ekonomi"]
    },
  ]
};

// ============================================
// SOSIOLOGI - DASAR
// ============================================

export const sociologyQuestions: QuizTemplate = {
  topicCode: "SOS-DASAR-01",
  topicName: "Sosiologi Dasar",
  description: "Masyarakat, interaksi sosial, kelompok sosial",
  difficulty: "beginner",
  estimatedMinutes: 70,
  learningObjectives: [
    "Memahami konsep dasar sosiologi",
    "Memahami interaksi sosial",
    "Mengidentifikasi kelompok sosial",
    "Memahami lembaga sosial"
  ],
  questions: [
    // KONSEP DASAR - MUDAH
    {
      question: "Ilmu yang mempelajari hubungan antara manusia dalam masyarakat disebut...",
      type: "mcq",
      options: ["Psikologi", "Antropologi", "Sosiologi", "Ekonomi"],
      correctAnswer: "Sosiologi",
      difficulty: "mudah",
      hints: [
        "Socius (Latin) = teman/masyarakat",
        "Logos = ilmu",
        "Ilmu tentang masyarakat"
      ],
      explanation: "Sosiologi adalah ilmu yang mempelajari masyarakat dan hubungan antarmanusia",
      tags: ["sosiologi", "konsep dasar", "definisi"]
    },
    
    // INTERAKSI SOSIAL - SEDANG
    {
      question: "Syarat terjadinya interaksi sosial adalah...",
      type: "mcq",
      options: [
        "Kontak sosial dan komunikasi",
        "Hanya kontak fisik",
        "Hanya komunikasi verbal",
        "Berada di tempat yang sama"
      ],
      correctAnswer: "Kontak sosial dan komunikasi",
      difficulty: "sedang",
      hints: [
        "Dua syarat utama",
        "Kontak (hubungan) + komunikasi (pesan)",
        "Keduanya harus ada"
      ],
      explanation: "Interaksi sosial memerlukan kontak sosial dan komunikasi",
      tags: ["sosiologi", "interaksi sosial", "syarat"]
    },
  ]
};

export const historyTemplates = [historyIndonesiaQuestions];
export const geographyTemplates = [geographyQuestions];
export const economicsTemplates = [economicsQuestions];
export const sociologyTemplates = [sociologyQuestions];
