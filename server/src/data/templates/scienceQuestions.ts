/**
 * Template Bank Soal Kimia & Biologi SMA
 */

import { QuizTemplate, QuestionTemplate } from "./physicsQuestions";

// ============================================
// KIMIA - STRUKTUR ATOM & TABEL PERIODIK
// ============================================

export const atomStructureQuestions: QuizTemplate = {
  topicCode: "KIM-ATOM-01",
  topicName: "Struktur Atom & Tabel Periodik",
  description: "Partikel penyusun atom, konfigurasi elektron, dan tabel periodik",
  difficulty: "beginner",
  estimatedMinutes: 90,
  learningObjectives: [
    "Memahami struktur atom (proton, neutron, elektron)",
    "Menentukan konfigurasi elektron",
    "Memahami sistem tabel periodik",
    "Menentukan golongan dan periode unsur"
  ],
  questions: [
    // PARTIKEL ATOM - MUDAH
    {
      question: "Partikel atom yang bermuatan negatif adalah...",
      type: "mcq",
      options: ["Proton", "Neutron", "Elektron", "Positron"],
      correctAnswer: "Elektron",
      difficulty: "mudah",
      hints: [
        "Ada 3 partikel utama: proton (+), neutron (0), elektron (-)",
        "Partikel yang mengelilingi inti atom",
        "Bermuatan negatif (-)"
      ],
      explanation: "Elektron adalah partikel bermuatan negatif yang mengelilingi inti atom",
      tags: ["kimia", "atom", "partikel"]
    },
    {
      question: "Nomor atom unsur X adalah 11. Jumlah elektron unsur X adalah...",
      type: "mcq",
      options: ["10", "11", "12", "22"],
      correctAnswer: "11",
      difficulty: "mudah",
      hints: [
        "Nomor atom = jumlah proton",
        "Atom netral: jumlah proton = jumlah elektron",
        "Nomor atom 11 berarti elektron = 11"
      ],
      explanation: "Nomor atom = jumlah proton = jumlah elektron (atom netral) = 11",
      tags: ["kimia", "nomor atom", "elektron"]
    },
    
    // KONFIGURASI ELEKTRON - SEDANG
    {
      question: "Konfigurasi elektron unsur dengan nomor atom 13 adalah...",
      type: "mcq",
      options: [
        "2, 8, 2",
        "2, 8, 3",
        "2, 8, 4",
        "2, 10, 1"
      ],
      correctAnswer: "2, 8, 3",
      difficulty: "sedang",
      hints: [
        "Kulit pertama maksimal 2 elektron",
        "Kulit kedua maksimal 8 elektron",
        "Sisa elektron: 13 - 2 - 8 = 3"
      ],
      explanation: "Konfigurasi: 2 (kulit K), 8 (kulit L), 3 (kulit M)",
      tags: ["kimia", "konfigurasi elektron", "kulit atom"]
    },
    
    // TABEL PERIODIK - SEDANG
    {
      question: "Unsur dengan konfigurasi elektron 2, 8, 7 terletak pada golongan...",
      type: "mcq",
      options: ["VIA", "VIIA", "VIIIA", "IA"],
      correctAnswer: "VIIA",
      difficulty: "sedang",
      hints: [
        "Golongan = elektron valensi (kulit terluar)",
        "Elektron valensi = 7",
        "Golongan VIIA (halogen)"
      ],
      explanation: "Elektron valensi = 7 → Golongan VIIA (Halogen)",
      tags: ["kimia", "tabel periodik", "golongan"]
    },
  ]
};

// ============================================
// KIMIA - IKATAN KIMIA
// ============================================

export const chemicalBondQuestions: QuizTemplate = {
  topicCode: "KIM-IKATAN-01",
  topicName: "Ikatan Kimia",
  description: "Ikatan ion, kovalen, dan logam",
  difficulty: "intermediate",
  estimatedMinutes: 80,
  learningObjectives: [
    "Membedakan ikatan ion, kovalen, dan logam",
    "Memahami pembentukan ikatan kimia",
    "Menentukan jenis ikatan dari unsur",
    "Memahami sifat senyawa berdasarkan ikatannya"
  ],
  questions: [
    // IKATAN ION - MUDAH
    {
      question: "Ikatan yang terbentuk antara logam dan non-logam adalah...",
      type: "mcq",
      options: ["Ikatan ion", "Ikatan kovalen", "Ikatan logam", "Ikatan hidrogen"],
      correctAnswer: "Ikatan ion",
      difficulty: "mudah",
      hints: [
        "Logam melepas elektron (kation)",
        "Non-logam menerima elektron (anion)",
        "Terjadi transfer elektron"
      ],
      explanation: "Ikatan ion terbentuk melalui transfer elektron dari logam ke non-logam",
      tags: ["kimia", "ikatan ion", "elektron"]
    },
    
    // IKATAN KOVALEN - SEDANG
    {
      question: "Molekul H₂O memiliki ikatan...",
      type: "mcq",
      options: ["Ikatan ion", "Ikatan kovalen", "Ikatan logam", "Ikatan Van der Waals"],
      correctAnswer: "Ikatan kovalen",
      difficulty: "sedang",
      hints: [
        "H dan O sama-sama non-logam",
        "Terjadi pemakaian bersama elektron",
        "Non-logam + non-logam = kovalen"
      ],
      explanation: "H₂O memiliki ikatan kovalen (pemakaian bersama elektron antara H dan O)",
      tags: ["kimia", "ikatan kovalen", "molekul"]
    },
  ]
};

// ============================================
// BIOLOGI - SEL
// ============================================

export const cellBiologyQuestions: QuizTemplate = {
  topicCode: "BIO-SEL-01",
  topicName: "Biologi Sel",
  description: "Struktur dan fungsi sel, organel, membran sel",
  difficulty: "beginner",
  estimatedMinutes: 100,
  learningObjectives: [
    "Memahami struktur sel prokariotik dan eukariotik",
    "Mengenal organel sel dan fungsinya",
    "Memahami struktur dan fungsi membran sel",
    "Memahami transport melalui membran"
  ],
  questions: [
    // STRUKTUR SEL - MUDAH
    {
      question: "Organel yang berfungsi sebagai 'pembangkit energi' sel adalah...",
      type: "mcq",
      options: ["Nukleus", "Mitokondria", "Ribosom", "Lisosom"],
      correctAnswer: "Mitokondria",
      difficulty: "mudah",
      hints: [
        "Tempat respirasi seluler",
        "Menghasilkan ATP (energi)",
        "Sering disebut 'powerhouse of the cell'"
      ],
      explanation: "Mitokondria adalah organel penghasil energi (ATP) melalui respirasi seluler",
      tags: ["biologi", "sel", "mitokondria", "organel"]
    },
    {
      question: "Organel yang berperan dalam sintesis protein adalah...",
      type: "mcq",
      options: ["Ribosom", "Lisosom", "Vakuola", "Badan Golgi"],
      correctAnswer: "Ribosom",
      difficulty: "mudah",
      hints: [
        "Tempat terjemahan mRNA menjadi protein",
        "Dapat bebas atau menempel di RE",
        "Mengandung rRNA"
      ],
      explanation: "Ribosom adalah tempat sintesis protein (translasi)",
      tags: ["biologi", "sel", "ribosom", "protein"]
    },
    
    // MEMBRAN SEL - SEDANG
    {
      question: "Transport zat melalui membran yang memerlukan energi disebut...",
      type: "mcq",
      options: ["Difusi", "Osmosis", "Transport aktif", "Transport pasif"],
      correctAnswer: "Transport aktif",
      difficulty: "sedang",
      hints: [
        "Melawan gradien konsentrasi",
        "Memerlukan ATP",
        "Contoh: pompa natrium-kalium"
      ],
      explanation: "Transport aktif memerlukan energi (ATP) untuk melawan gradien konsentrasi",
      tags: ["biologi", "membran", "transport aktif"]
    },
    
    // PERBEDAAN SEL - SEDANG
    {
      question: "Perbedaan utama sel prokariotik dan eukariotik adalah...",
      type: "mcq",
      options: [
        "Ada tidaknya membran sel",
        "Ada tidaknya membran inti",
        "Ada tidaknya ribosom",
        "Ada tidaknya sitoplasma"
      ],
      correctAnswer: "Ada tidaknya membran inti",
      difficulty: "sedang",
      hints: [
        "Pro = sebelum, karyon = inti",
        "Eu = sejati, karyon = inti",
        "Prokariotik tidak punya inti sejati"
      ],
      explanation: "Prokariotik tidak memiliki membran inti, eukariotik memiliki membran inti",
      tags: ["biologi", "sel", "prokariotik", "eukariotik"]
    },
  ]
};

// ============================================
// BIOLOGI - GENETIKA
// ============================================

export const geneticsQuestions: QuizTemplate = {
  topicCode: "BIO-GEN-01",
  topicName: "Genetika",
  description: "DNA, RNA, sintesis protein, dan pewarisan sifat",
  difficulty: "intermediate",
  estimatedMinutes: 110,
  learningObjectives: [
    "Memahami struktur DNA dan RNA",
    "Memahami proses replikasi DNA",
    "Memahami sintesis protein (transkripsi dan translasi)",
    "Memahami hukum Mendel"
  ],
  questions: [
    // DNA & RNA - MUDAH
    {
      question: "Basa nitrogen yang hanya terdapat pada DNA adalah...",
      type: "mcq",
      options: ["Adenin", "Guanin", "Timin", "Sitosin"],
      correctAnswer: "Timin",
      difficulty: "mudah",
      hints: [
        "DNA: Adenin, Guanin, Sitosin, Timin",
        "RNA: Adenin, Guanin, Sitosin, Urasil",
        "Timin hanya di DNA, Urasil hanya di RNA"
      ],
      explanation: "Timin (T) hanya ada di DNA. RNA menggunakan Urasil (U) sebagai gantinya",
      tags: ["biologi", "genetika", "DNA", "basa nitrogen"]
    },
    {
      question: "Gula yang menyusun RNA adalah...",
      type: "mcq",
      options: ["Glukosa", "Ribosa", "Deoksiribosa", "Fruktosa"],
      correctAnswer: "Ribosa",
      difficulty: "mudah",
      hints: [
        "RNA = Ribonucleic Acid",
        "DNA = Deoxyribonucleic Acid",
        "RNA menggunakan ribosa, DNA deoksiribosa"
      ],
      explanation: "RNA tersusun dari gula ribosa, sedangkan DNA dari deoksiribosa",
      tags: ["biologi", "genetika", "RNA", "gula"]
    },
    
    // SINTESIS PROTEIN - SEDANG
    {
      question: "Proses pembentukan mRNA dari DNA disebut...",
      type: "mcq",
      options: ["Replikasi", "Transkripsi", "Translasi", "Mutasi"],
      correctAnswer: "Transkripsi",
      difficulty: "sedang",
      hints: [
        "DNA → mRNA",
        "Terjadi di nukleus",
        "Trans-scripsi = menyalin"
      ],
      explanation: "Transkripsi adalah proses penyalinan DNA menjadi mRNA",
      tags: ["biologi", "genetika", "transkripsi", "sintesis protein"]
    },
    
    // HUKUM MENDEL - SEDANG
    {
      question: "Persilangan antara MM (merah) dengan mm (putih) menghasilkan keturunan F1 yang semuanya...",
      type: "mcq",
      options: ["MM", "Mm", "mm", "Campuran"],
      correctAnswer: "Mm",
      difficulty: "sedang",
      hints: [
        "Setiap induk menyumbang 1 alel",
        "MM → M, mm → m",
        "Keturunan = Mm"
      ],
      explanation: "MM × mm → semua keturunan Mm (heterozigot)",
      tags: ["biologi", "genetika", "mendel", "persilangan"]
    },
  ]
};

// ============================================
// BIOLOGI - EKOLOGI
// ============================================

export const ecologyQuestions: QuizTemplate = {
  topicCode: "BIO-EKO-01",
  topicName: "Ekologi",
  description: "Ekosistem, rantai makanan, aliran energi, siklus biogeokimia",
  difficulty: "beginner",
  estimatedMinutes: 90,
  learningObjectives: [
    "Memahami komponen ekosistem",
    "Menganalisis rantai dan jaring makanan",
    "Memahami aliran energi dalam ekosistem",
    "Memahami siklus materi"
  ],
  questions: [
    // KOMPONEN EKOSISTEM - MUDAH
    {
      question: "Komponen biotik dalam ekosistem adalah...",
      type: "mcq",
      options: ["Air", "Tanah", "Tumbuhan", "Udara"],
      correctAnswer: "Tumbuhan",
      difficulty: "mudah",
      hints: [
        "Biotik = makhluk hidup",
        "Abiotik = benda mati",
        "Yang mana makhluk hidup?"
      ],
      explanation: "Tumbuhan adalah komponen biotik (makhluk hidup). Air, tanah, udara adalah abiotik",
      tags: ["biologi", "ekologi", "biotik", "abiotik"]
    },
    
    // RANTAI MAKANAN - MUDAH
    {
      question: "Organisme yang dapat membuat makanan sendiri disebut...",
      type: "mcq",
      options: ["Konsumen", "Produsen", "Dekomposer", "Predator"],
      correctAnswer: "Produsen",
      difficulty: "mudah",
      hints: [
        "Melakukan fotosintesis",
        "Tumbuhan hijau",
        "Autotrof = membuat sendiri"
      ],
      explanation: "Produsen (tumbuhan) dapat membuat makanan sendiri melalui fotosintesis",
      tags: ["biologi", "ekologi", "produsen", "rantai makanan"]
    },
    
    // ALIRAN ENERGI - SEDANG
    {
      question: "Dalam rantai makanan: Rumput → Belalang → Katak → Ular. Ular berperan sebagai...",
      type: "mcq",
      options: [
        "Produsen",
        "Konsumen I",
        "Konsumen II",
        "Konsumen III"
      ],
      correctAnswer: "Konsumen III",
      difficulty: "sedang",
      hints: [
        "Rumput = produsen",
        "Belalang = konsumen I, Katak = konsumen II",
        "Ular = konsumen III"
      ],
      explanation: "Ular adalah konsumen tingkat III (memakan konsumen II yaitu katak)",
      tags: ["biologi", "ekologi", "konsumen", "rantai makanan"]
    },
  ]
};

export const chemistryTemplates = [
  atomStructureQuestions,
  chemicalBondQuestions,
];

export const biologyTemplates = [
  cellBiologyQuestions,
  geneticsQuestions,
  ecologyQuestions,
];
