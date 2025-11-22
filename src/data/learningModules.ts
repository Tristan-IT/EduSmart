// Comprehensive Learning Modules with Theory, Videos, and Exercises
// YouTube sources: Khan Academy, Zenius Education, Ruangguru, Math Antics

export interface LearningModule {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  estimatedDuration: string;
  prerequisites?: string[];
  learningObjectives: string[];
  theory: {
    sections: {
      title: string;
      content: string;
      examples?: string[];
      keyPoints?: string[];
    }[];
  };
  video: {
    title: string;
    youtubeUrl: string;
    duration: string;
    description: string;
    channel: string;
  };
  exercises: {
    id: string;
    question: string;
    type: "mcq" | "short-answer" | "multiple-choice";
    options?: string[];
    correctAnswer: string | string[];
    explanation: string;
    difficulty: number;
  }[];
}

export const algebraModules: LearningModule[] = [
  {
    id: "alg-linear-eq",
    categoryId: "algebra",
    categoryName: "Aljabar",
    title: "Persamaan Linear Satu Variabel",
    description: "Pelajari cara menyelesaikan persamaan linear dengan satu variabel menggunakan operasi matematika dasar",
    difficulty: "Mudah",
    estimatedDuration: "45 menit",
    prerequisites: [],
    learningObjectives: [
      "Memahami konsep persamaan linear satu variabel",
      "Mampu menyelesaikan persamaan linear sederhana",
      "Menerapkan prinsip kesetaraan dalam penyelesaian",
      "Mengidentifikasi langkah-langkah penyelesaian yang benar"
    ],
    theory: {
      sections: [
        {
          title: "Pengertian Persamaan Linear",
          content: "Persamaan linear satu variabel adalah persamaan matematika yang memiliki satu variabel (biasanya x) dengan pangkat tertinggi 1. Bentuk umumnya adalah ax + b = c, dimana a, b, dan c adalah konstanta.\n\nPersamaan ini disebut 'linear' karena jika digambarkan dalam grafik koordinat, akan membentuk garis lurus.",
          examples: [
            "2x + 5 = 13",
            "3x - 7 = 8",
            "x/2 + 3 = 7",
            "-4x + 10 = 2"
          ],
          keyPoints: [
            "Variabel berpangkat 1",
            "Hanya satu variabel dalam persamaan",
            "Membentuk garis lurus pada grafik",
            "Memiliki satu solusi unik"
          ]
        },
        {
          title: "Prinsip Kesetaraan",
          content: "Untuk menyelesaikan persamaan, kita menggunakan prinsip kesetaraan: operasi yang sama dilakukan pada kedua ruas persamaan akan menghasilkan persamaan yang ekuivalen.\n\nOperasi yang diperbolehkan:\n• Menambah atau mengurangi bilangan yang sama pada kedua ruas\n• Mengalikan atau membagi kedua ruas dengan bilangan yang sama (≠ 0)",
          examples: [
            "Jika x + 3 = 7, maka x + 3 - 3 = 7 - 3 → x = 4",
            "Jika 2x = 8, maka 2x ÷ 2 = 8 ÷ 2 → x = 4"
          ],
          keyPoints: [
            "Operasi sama pada kedua ruas",
            "Tidak boleh membagi dengan 0",
            "Urutan operasi penting",
            "Tujuan: isolasi variabel"
          ]
        },
        {
          title: "Langkah-langkah Penyelesaian",
          content: "Langkah sistematis menyelesaikan persamaan linear:\n\n1. Sederhanakan kedua ruas (jika diperlukan)\n2. Pindahkan semua suku yang mengandung variabel ke satu ruas\n3. Pindahkan semua konstanta ke ruas lainnya\n4. Gabungkan suku-suku sejenis\n5. Bagi atau kalikan untuk mendapatkan nilai variabel\n6. Periksa jawaban dengan substitusi kembali",
          examples: [
            "2x + 5 = 13\n→ 2x = 13 - 5\n→ 2x = 8\n→ x = 4\n\nCek: 2(4) + 5 = 8 + 5 = 13 ✓",
            "3x - 7 = 8\n→ 3x = 8 + 7\n→ 3x = 15\n→ x = 5\n\nCek: 3(5) - 7 = 15 - 7 = 8 ✓"
          ]
        }
      ]
    },
    video: {
      title: "Persamaan Linear Satu Variabel - Penjelasan Lengkap",
      youtubeUrl: "https://www.youtube.com/watch?v=K2Ttzlk7pXk",
      duration: "12:45",
      description: "Penjelasan lengkap tentang persamaan linear satu variabel dengan contoh soal dan pembahasan step-by-step. Cocok untuk pemula yang baru belajar aljabar.",
      channel: "Zenius Education"
    },
    exercises: [
      {
        id: "ex-alg-lin-001",
        question: "Tentukan nilai x dari persamaan: 2x + 5 = 13",
        type: "mcq",
        options: ["x = 2", "x = 4", "x = 6", "x = 8"],
        correctAnswer: "x = 4",
        explanation: "2x + 5 = 13\n→ 2x = 13 - 5 (kurangi 5 dari kedua ruas)\n→ 2x = 8\n→ x = 8 ÷ 2 (bagi kedua ruas dengan 2)\n→ x = 4",
        difficulty: 1
      },
      {
        id: "ex-alg-lin-002",
        question: "Selesaikan: 3x - 7 = 8",
        type: "mcq",
        options: ["x = 3", "x = 5", "x = 7", "x = 9"],
        correctAnswer: "x = 5",
        explanation: "3x - 7 = 8\n→ 3x = 8 + 7 (tambah 7 ke kedua ruas)\n→ 3x = 15\n→ x = 15 ÷ 3 (bagi kedua ruas dengan 3)\n→ x = 5",
        difficulty: 1
      },
      {
        id: "ex-alg-lin-003",
        question: "Jika x/2 + 3 = 7, berapakah nilai x?",
        type: "mcq",
        options: ["x = 4", "x = 6", "x = 8", "x = 10"],
        correctAnswer: "x = 8",
        explanation: "x/2 + 3 = 7\n→ x/2 = 7 - 3 (kurangi 3 dari kedua ruas)\n→ x/2 = 4\n→ x = 4 × 2 (kalikan kedua ruas dengan 2)\n→ x = 8",
        difficulty: 2
      }
    ]
  },
  {
    id: "alg-factoring",
    categoryId: "algebra",
    categoryName: "Aljabar",
    title: "Pemfaktoran Aljabar",
    description: "Teknik memfaktorkan bentuk aljabar dan persamaan kuadrat",
    difficulty: "Sedang",
    estimatedDuration: "60 menit",
    prerequisites: ["alg-linear-eq"],
    learningObjectives: [
      "Memahami konsep faktorisasi",
      "Mampu memfaktorkan bentuk ax² + bx + c",
      "Menerapkan rumus selisih kuadrat",
      "Menyelesaikan persamaan kuadrat dengan pemfaktoran"
    ],
    theory: {
      sections: [
        {
          title: "Konsep Pemfaktoran",
          content: "Pemfaktoran adalah proses mengubah bentuk penjumlahan menjadi bentuk perkalian. Ini adalah kebalikan dari perkalian distributif.\n\nContoh: ab + ac = a(b + c)\nDi sini, a adalah faktor persekutuan dari ab dan ac.",
          examples: [
            "6x + 9 = 3(2x + 3)",
            "x² + 5x = x(x + 5)",
            "2x² - 4x = 2x(x - 2)"
          ],
          keyPoints: [
            "Cari faktor persekutuan terbesar (FPB)",
            "Faktorkan FPB keluar dari setiap suku",
            "Periksa dengan perkalian distributif"
          ]
        },
        {
          title: "Pemfaktoran Trinomial",
          content: "Bentuk umum: x² + bx + c\nCari dua bilangan yang:\n• Jika dikalikan = c\n• Jika dijumlahkan = b\n\nMaka: x² + bx + c = (x + p)(x + q)\nDimana p × q = c dan p + q = b",
          examples: [
            "x² + 5x + 6 = (x + 2)(x + 3)\nKarena 2 × 3 = 6 dan 2 + 3 = 5",
            "x² + 7x + 12 = (x + 3)(x + 4)\nKarena 3 × 4 = 12 dan 3 + 4 = 7"
          ],
          keyPoints: [
            "Perhatikan tanda b dan c",
            "Jika c positif, p dan q sejenis",
            "Jika c negatif, p dan q berlawanan tanda"
          ]
        },
        {
          title: "Selisih Kuadrat",
          content: "Rumus: a² - b² = (a + b)(a - b)\n\nBentuk selisih kuadrat memiliki ciri:\n• Dua suku (binomial)\n• Keduanya kuadrat sempurna\n• Dipisahkan tanda minus",
          examples: [
            "x² - 9 = x² - 3² = (x + 3)(x - 3)",
            "4x² - 25 = (2x)² - 5² = (2x + 5)(2x - 5)",
            "9a² - 16b² = (3a)² - (4b)² = (3a + 4b)(3a - 4b)"
          ]
        }
      ]
    },
    video: {
      title: "Pemfaktoran Aljabar - Teknik dan Trik",
      youtubeUrl: "https://www.youtube.com/watch?v=mZ8pMZmoxjY",
      duration: "15:20",
      description: "Tutorial lengkap pemfaktoran bentuk aljabar dengan berbagai metode dan trik cepat. Termasuk pemfaktoran trinomial dan selisih kuadrat.",
      channel: "Ruangguru"
    },
    exercises: [
      {
        id: "ex-alg-fac-001",
        question: "Faktorkan: x² + 5x + 6",
        type: "mcq",
        options: ["(x + 2)(x + 3)", "(x + 1)(x + 6)", "(x - 2)(x - 3)", "(x + 4)(x + 2)"],
        correctAnswer: "(x + 2)(x + 3)",
        explanation: "x² + 5x + 6\nCari dua bilangan yang jika dikalikan = 6 dan dijumlahkan = 5\n2 × 3 = 6 dan 2 + 3 = 5\nMaka: (x + 2)(x + 3)",
        difficulty: 2
      },
      {
        id: "ex-alg-fac-002",
        question: "Faktorkan: x² - 9",
        type: "mcq",
        options: ["(x + 3)(x - 3)", "(x + 9)(x - 1)", "(x - 3)(x - 3)", "(x + 3)(x + 3)"],
        correctAnswer: "(x + 3)(x - 3)",
        explanation: "x² - 9 = x² - 3²\nIni adalah bentuk selisih kuadrat: a² - b² = (a + b)(a - b)\nMaka: (x + 3)(x - 3)",
        difficulty: 2
      }
    ]
  },
  {
    id: "alg-quadratic",
    categoryId: "algebra",
    categoryName: "Aljabar",
    title: "Persamaan Kuadrat",
    description: "Menyelesaikan persamaan kuadrat menggunakan pemfaktoran, rumus ABC, dan melengkapkan kuadrat sempurna",
    difficulty: "Sulit",
    estimatedDuration: "70 menit",
    prerequisites: ["alg-linear-eq", "alg-factoring"],
    learningObjectives: [
      "Memahami bentuk umum persamaan kuadrat",
      "Menyelesaikan persamaan kuadrat dengan pemfaktoran",
      "Menggunakan rumus kuadrat (rumus ABC)",
      "Menentukan jenis akar menggunakan diskriminan"
    ],
    theory: {
      sections: [
        {
          title: "Bentuk Umum Persamaan Kuadrat",
          content: "Persamaan kuadrat adalah persamaan yang memiliki bentuk:\nax² + bx + c = 0\n\nDimana:\n• a, b, c adalah konstanta (a ≠ 0)\n• x adalah variabel\n• Pangkat tertinggi adalah 2",
          examples: [
            "x² + 5x + 6 = 0 (a=1, b=5, c=6)",
            "2x² - 3x - 5 = 0 (a=2, b=-3, c=-5)",
            "x² - 4 = 0 (a=1, b=0, c=-4)"
          ],
          keyPoints: [
            "Koefisien a tidak boleh 0",
            "Dapat memiliki 0, 1, atau 2 solusi real",
            "Grafik berbentuk parabola",
            "Titik puncak dapat dihitung"
          ]
        },
        {
          title: "Menyelesaikan dengan Pemfaktoran",
          content: "Jika persamaan kuadrat dapat difaktorkan:\nax² + bx + c = 0\n↓\n(px + q)(rx + s) = 0\n\nMaka solusinya:\npx + q = 0  atau  rx + s = 0",
          examples: [
            "x² + 5x + 6 = 0\n(x + 2)(x + 3) = 0\nx = -2 atau x = -3",
            "x² - 5x + 6 = 0\n(x - 2)(x - 3) = 0\nx = 2 atau x = 3"
          ],
          keyPoints: [
            "Hanya untuk persamaan yang bisa difaktorkan",
            "Gunakan prinsip: jika AB = 0, maka A = 0 atau B = 0",
            "Periksa jawaban dengan substitusi"
          ]
        },
        {
          title: "Rumus Kuadrat (Rumus ABC)",
          content: "Untuk ax² + bx + c = 0, solusinya:\n\nx = (-b ± √(b² - 4ac)) / (2a)\n\nDiskriminan D = b² - 4ac menentukan jenis akar:\n• D > 0: dua akar real berbeda\n• D = 0: satu akar real (kembar)\n• D < 0: tidak ada akar real",
          examples: [
            "x² - 5x + 6 = 0\na=1, b=-5, c=6\nD = 25 - 24 = 1 > 0\nx = (5 ± 1)/2\nx = 3 atau x = 2",
            "x² - 4x + 4 = 0\nD = 16 - 16 = 0\nx = 4/2 = 2 (kembar)"
          ],
          keyPoints: [
            "Berlaku untuk semua persamaan kuadrat",
            "Periksa diskriminan terlebih dahulu",
            "Hati-hati dengan tanda b",
            "± berarti ada 2 kemungkinan jawaban"
          ]
        }
      ]
    },
    video: {
      title: "Persamaan Kuadrat - Pemfaktoran dan Rumus ABC",
      youtubeUrl: "https://www.youtube.com/watch?v=i7idZfS8t8w",
      duration: "19:25",
      description: "Tutorial lengkap menyelesaikan persamaan kuadrat dengan berbagai metode, termasuk pemfaktoran, rumus ABC, dan analisis diskriminan.",
      channel: "Zenius Education"
    },
    exercises: [
      {
        id: "ex-alg-quad-001",
        question: "Selesaikan: x² - 5x + 6 = 0",
        type: "mcq",
        options: ["x = 1 atau x = 6", "x = 2 atau x = 3", "x = -2 atau x = -3", "x = 1 atau x = 5"],
        correctAnswer: "x = 2 atau x = 3",
        explanation: "x² - 5x + 6 = 0\n(x - 2)(x - 3) = 0\nx - 2 = 0 → x = 2\natau x - 3 = 0 → x = 3",
        difficulty: 2
      },
      {
        id: "ex-alg-quad-002",
        question: "Diskriminan dari x² + 4x + 4 = 0 adalah...",
        type: "mcq",
        options: ["0", "4", "16", "20"],
        correctAnswer: "0",
        explanation: "D = b² - 4ac\nD = 4² - 4(1)(4)\nD = 16 - 16 = 0\nBerarti memiliki akar kembar",
        difficulty: 2
      },
      {
        id: "ex-alg-quad-003",
        question: "Menggunakan rumus ABC, akar dari x² - 3x + 2 = 0 adalah...",
        type: "mcq",
        options: ["x = 1 atau x = 2", "x = -1 atau x = -2", "x = 1 atau x = 3", "x = 0 atau x = 3"],
        correctAnswer: "x = 1 atau x = 2",
        explanation: "a=1, b=-3, c=2\nD = 9 - 8 = 1\nx = (3 ± 1)/2\nx = 4/2 = 2 atau x = 2/2 = 1",
        difficulty: 3
      }
    ]
  },
  {
    id: "alg-systems",
    categoryId: "algebra",
    categoryName: "Aljabar",
    title: "Sistem Persamaan Linear Dua Variabel",
    description: "Menyelesaikan sistem persamaan linear dengan metode eliminasi, substitusi, dan grafik",
    difficulty: "Sedang",
    estimatedDuration: "75 menit",
    prerequisites: ["alg-quadratic"],
    learningObjectives: [
      "Memahami konsep sistem persamaan linear dua variabel",
      "Menyelesaikan dengan metode eliminasi",
      "Menyelesaikan dengan metode substitusi",
      "Menyelesaikan dengan metode grafik"
    ],
    theory: {
      sections: [
        {
          title: "Pengertian Sistem Persamaan Linear",
          content: "Sistem persamaan linear dua variabel (SPLDV) adalah dua persamaan linear yang memiliki dua variabel berbeda. Bentuk umum: ax + by = c dan dx + ey = f.",
          keyPoints: [
            "Terdiri dari 2 persamaan dengan 2 variabel",
            "Solusi adalah titik potong kedua garis",
            "Ada 3 metode penyelesaian: eliminasi, substitusi, grafik"
          ]
        },
        {
          title: "Metode Eliminasi",
          content: "Menghilangkan salah satu variabel dengan menyamakan koefisiennya, kemudian mengurangkan atau menjumlahkan kedua persamaan.",
          examples: [
            "2x + y = 7 dan x + y = 4 → Kurangkan untuk eliminasi y",
            "3x + 2y = 12 dan x - y = 1 → Kalikan terlebih dahulu untuk menyamakan koefisien"
          ]
        },
        {
          title: "Metode Substitusi",
          content: "Menyatakan salah satu variabel dalam bentuk variabel lainnya, kemudian substitusi ke persamaan kedua.",
          examples: [
            "Dari x + y = 5, dapatkan y = 5 - x",
            "Substitusi ke 2x + 3y = 14"
          ]
        }
      ]
    },
    video: {
      title: "Sistem Persamaan Linear Dua Variabel - Metode Eliminasi & Substitusi",
      youtubeUrl: "https://www.youtube.com/watch?v=example-spldv",
      duration: "18:30",
      description: "Penjelasan lengkap tentang cara menyelesaikan SPLDV dengan berbagai metode",
      channel: "Khan Academy Indonesia"
    },
    exercises: [
      {
        id: "ex-alg-sys-001",
        question: "Selesaikan sistem persamaan: x + y = 10 dan x - y = 2",
        type: "mcq",
        options: ["x = 6, y = 4", "x = 4, y = 6", "x = 5, y = 5", "x = 8, y = 2"],
        correctAnswer: "x = 6, y = 4",
        explanation: "Eliminasi: tambahkan kedua persamaan → 2x = 12, x = 6\nSubstitusi: 6 + y = 10, y = 4",
        difficulty: 2
      },
      {
        id: "ex-alg-sys-002",
        question: "Dari sistem 2x + y = 8 dan x + 2y = 7, nilai x + y adalah...",
        type: "mcq",
        options: ["3", "5", "7", "9"],
        correctAnswer: "5",
        explanation: "Eliminasi y: 4x + 2y = 16 dan x + 2y = 7 → 3x = 9, x = 3\nSubstitusi: 2(3) + y = 8, y = 2\nx + y = 5",
        difficulty: 3
      }
    ]
  },
  {
    id: "geo-area-volume",
    categoryId: "geometry",
    categoryName: "Geometri",
    title: "Luas dan Volume Bangun Ruang",
    description: "Menghitung luas permukaan dan volume berbagai bangun ruang",
    difficulty: "Sedang",
    estimatedDuration: "65 menit",
    prerequisites: ["geo-triangles", "geo-circles"],
    learningObjectives: [
      "Menghitung luas permukaan kubus dan balok",
      "Menghitung volume prisma dan tabung",
      "Memahami hubungan antara luas dan volume",
      "Menyelesaikan masalah kontekstual"
    ],
    theory: {
      sections: [
        {
          title: "Luas Permukaan Bangun Ruang",
          content: "Luas permukaan adalah total luas seluruh sisi bangun ruang. Untuk kubus: 6s², untuk balok: 2(pl + pt + lt).",
          keyPoints: [
            "Luas permukaan = jumlah luas semua sisi",
            "Kubus memiliki 6 sisi persegi yang sama",
            "Balok memiliki 6 sisi persegi panjang"
          ]
        },
        {
          title: "Volume Bangun Ruang",
          content: "Volume adalah besaran ruang yang ditempati. Volume = luas alas × tinggi untuk bangun ruang beraturan.",
          examples: [
            "Volume kubus = s³",
            "Volume balok = p × l × t",
            "Volume tabung = πr²t"
          ]
        }
      ]
    },
    video: {
      title: "Luas dan Volume Bangun Ruang",
      youtubeUrl: "https://www.youtube.com/watch?v=example-volume",
      duration: "16:45",
      description: "Cara menghitung luas permukaan dan volume bangun ruang dengan mudah",
      channel: "Ruangguru"
    },
    exercises: [
      {
        id: "ex-geo-vol-001",
        question: "Volume kubus dengan panjang rusuk 5 cm adalah...",
        type: "mcq",
        options: ["25 cm³", "75 cm³", "125 cm³", "150 cm³"],
        correctAnswer: "125 cm³",
        explanation: "Volume kubus = s³ = 5³ = 125 cm³",
        difficulty: 1
      },
      {
        id: "ex-geo-vol-002",
        question: "Luas permukaan balok dengan p=6, l=4, t=3 adalah...",
        type: "mcq",
        options: ["72 cm²", "108 cm²", "144 cm²", "180 cm²"],
        correctAnswer: "108 cm²",
        explanation: "LP = 2(pl + pt + lt) = 2(24 + 18 + 12) = 2(54) = 108 cm²",
        difficulty: 2
      }
    ]
  }
];

export const geometryModules: LearningModule[] = [
  {
    id: "geo-triangles",
    categoryId: "geometry",
    categoryName: "Geometri",
    title: "Segitiga dan Sifat-sifatnya",
    description: "Pelajari jenis-jenis segitiga, teorema Pythagoras, dan rumus luas segitiga",
    difficulty: "Mudah",
    estimatedDuration: "50 menit",
    prerequisites: [],
    learningObjectives: [
      "Memahami jenis-jenis segitiga",
      "Menerapkan teorema Pythagoras",
      "Menghitung luas dan keliling segitiga",
      "Memahami konsep sudut dalam segitiga"
    ],
    theory: {
      sections: [
        {
          title: "Jenis-jenis Segitiga",
          content: "Segitiga dapat diklasifikasikan berdasarkan:\n\n1. Panjang sisi:\n   • Sama sisi (equilateral): ketiga sisi sama panjang\n   • Sama kaki (isosceles): dua sisi sama panjang\n   • Sembarang (scalene): ketiga sisi berbeda\n\n2. Besar sudut:\n   • Lancip: semua sudut < 90°\n   • Siku-siku: satu sudut = 90°\n   • Tumpul: satu sudut > 90°",
          keyPoints: [
            "Jumlah sudut dalam segitiga = 180°",
            "Sisi terpanjang berhadapan dengan sudut terbesar",
            "Segitiga sama sisi memiliki 3 sudut @ 60°",
            "Segitiga siku-siku memiliki 1 sudut 90°"
          ],
          examples: [
            "Segitiga sama sisi: sisi 5 cm, 5 cm, 5 cm",
            "Segitiga sama kaki: sisi 4 cm, 4 cm, 6 cm",
            "Segitiga siku-siku: sudut 90°, 60°, 30°"
          ]
        },
        {
          title: "Teorema Pythagoras",
          content: "Pada segitiga siku-siku berlaku:\nc² = a² + b²\n\nDimana:\n• c = sisi miring (hipotenusa)\n• a, b = sisi siku-siku\n\nTeorema ini hanya berlaku untuk segitiga siku-siku!",
          examples: [
            "Jika a = 3, b = 4, maka c = √(3² + 4²) = √(9 + 16) = √25 = 5",
            "Jika a = 5, b = 12, maka c = √(5² + 12²) = √(25 + 144) = √169 = 13",
            "Tripel Pythagoras: (3,4,5), (5,12,13), (8,15,17)"
          ],
          keyPoints: [
            "Hanya untuk segitiga siku-siku",
            "Hipotenusa adalah sisi terpanjang",
            "Rumus: c² = a² + b²",
            "Kebalikan: jika a² + b² = c², maka sudut siku-siku"
          ]
        },
        {
          title: "Luas dan Keliling Segitiga",
          content: "Rumus Luas Segitiga:\nL = ½ × alas × tinggi\n\nRumus Keliling Segitiga:\nK = a + b + c\n\nTinggi adalah garis tegak lurus dari titik sudut ke sisi alas.",
          examples: [
            "Alas = 6 cm, tinggi = 4 cm\nL = ½ × 6 × 4 = 12 cm²",
            "Sisi = 3 cm, 4 cm, 5 cm\nK = 3 + 4 + 5 = 12 cm"
          ]
        }
      ]
    },
    video: {
      title: "Segitiga - Jenis, Sifat, dan Teorema Pythagoras",
      youtubeUrl: "https://www.youtube.com/watch?v=AA6RfgP-AHU",
      duration: "14:30",
      description: "Pembahasan lengkap tentang segitiga, teorema Pythagoras, dan cara menghitung luas serta keliling. Dengan animasi dan contoh soal.",
      channel: "Khan Academy Indonesia"
    },
    exercises: [
      {
        id: "ex-geo-tri-001",
        question: "Berapakah jumlah sudut dalam segitiga?",
        type: "mcq",
        options: ["90°", "180°", "270°", "360°"],
        correctAnswer: "180°",
        explanation: "Jumlah sudut dalam segitiga selalu 180°. Ini adalah sifat fundamental segitiga yang berlaku untuk semua jenis segitiga.",
        difficulty: 1
      },
      {
        id: "ex-geo-tri-002",
        question: "Sebuah segitiga siku-siku memiliki sisi 3 cm dan 4 cm. Berapa panjang sisi miringnya?",
        type: "mcq",
        options: ["5 cm", "6 cm", "7 cm", "8 cm"],
        correctAnswer: "5 cm",
        explanation: "Menggunakan teorema Pythagoras:\nc² = a² + b²\nc² = 3² + 4² = 9 + 16 = 25\nc = √25 = 5 cm",
        difficulty: 2
      },
      {
        id: "ex-geo-tri-003",
        question: "Luas segitiga dengan alas 8 cm dan tinggi 6 cm adalah...",
        type: "mcq",
        options: ["24 cm²", "32 cm²", "48 cm²", "56 cm²"],
        correctAnswer: "24 cm²",
        explanation: "Luas = ½ × alas × tinggi\nL = ½ × 8 × 6 = ½ × 48 = 24 cm²",
        difficulty: 1
      }
    ]
  },
  {
    id: "geo-circles",
    categoryId: "geometry",
    categoryName: "Geometri",
    title: "Lingkaran",
    description: "Memahami unsur-unsur lingkaran, keliling, dan luas lingkaran",
    difficulty: "Sedang",
    estimatedDuration: "55 menit",
    prerequisites: ["geo-triangles"],
    learningObjectives: [
      "Memahami unsur-unsur lingkaran",
      "Menghitung keliling lingkaran",
      "Menghitung luas lingkaran",
      "Memahami hubungan jari-jari dan diameter"
    ],
    theory: {
      sections: [
        {
          title: "Unsur-unsur Lingkaran",
          content: "Lingkaran memiliki beberapa unsur penting:\n\n• Titik Pusat (O): titik tengah lingkaran\n• Jari-jari (r): jarak dari pusat ke tepi lingkaran\n• Diameter (d): garis yang melalui pusat, menghubungkan dua titik di tepi\n• Tali Busur: garis yang menghubungkan dua titik di tepi\n• Busur: bagian dari keliling lingkaran\n• Juring: daerah yang dibatasi dua jari-jari dan busur",
          keyPoints: [
            "Diameter = 2 × jari-jari (d = 2r)",
            "Jari-jari = ½ × diameter (r = d/2)",
            "Diameter adalah tali busur terpanjang",
            "Semua jari-jari pada lingkaran sama panjang"
          ],
          examples: [
            "Jika r = 7 cm, maka d = 2 × 7 = 14 cm",
            "Jika d = 20 cm, maka r = 20/2 = 10 cm"
          ]
        },
        {
          title: "Keliling Lingkaran",
          content: "Rumus keliling lingkaran:\nK = 2πr atau K = πd\n\nDimana:\n• π (pi) ≈ 3,14 atau 22/7\n• r = jari-jari\n• d = diameter\n\nGunakan π = 22/7 jika jari-jari kelipatan 7\nGunakan π = 3,14 untuk yang lainnya",
          examples: [
            "r = 7 cm\nK = 2 × 22/7 × 7 = 44 cm",
            "d = 10 cm\nK = 3,14 × 10 = 31,4 cm"
          ],
          keyPoints: [
            "Keliling adalah panjang busur penuh",
            "Berbanding lurus dengan jari-jari",
            "Jika r digandakan, K juga digandakan"
          ]
        },
        {
          title: "Luas Lingkaran",
          content: "Rumus luas lingkaran:\nL = πr²\n\nLuas lingkaran adalah daerah yang tertutup oleh keliling lingkaran.",
          examples: [
            "r = 7 cm\nL = 22/7 × 7² = 22/7 × 49 = 154 cm²",
            "r = 10 cm\nL = 3,14 × 10² = 3,14 × 100 = 314 cm²"
          ],
          keyPoints: [
            "Luas sebanding dengan r²",
            "Jika r digandakan, L menjadi 4 kali",
            "Satuan luas: cm², m², dll"
          ]
        }
      ]
    },
    video: {
      title: "Lingkaran - Keliling dan Luas",
      youtubeUrl: "https://www.youtube.com/watch?v=wz-9cMyAFbE",
      duration: "11:25",
      description: "Penjelasan konsep lingkaran, cara menghitung keliling dan luas, serta contoh soal aplikatif. Termasuk penggunaan π = 22/7 dan π = 3,14.",
      channel: "Zenius Education"
    },
    exercises: [
      {
        id: "ex-geo-cir-001",
        question: "Jika jari-jari lingkaran 7 cm, berapakah diameternya?",
        type: "mcq",
        options: ["7 cm", "14 cm", "21 cm", "28 cm"],
        correctAnswer: "14 cm",
        explanation: "Diameter = 2 × jari-jari\nd = 2 × 7 = 14 cm",
        difficulty: 1
      },
      {
        id: "ex-geo-cir-002",
        question: "Keliling lingkaran dengan jari-jari 7 cm adalah... (π = 22/7)",
        type: "mcq",
        options: ["22 cm", "44 cm", "66 cm", "88 cm"],
        correctAnswer: "44 cm",
        explanation: "K = 2πr\nK = 2 × 22/7 × 7\nK = 2 × 22 = 44 cm",
        difficulty: 2
      },
      {
        id: "ex-geo-cir-003",
        question: "Luas lingkaran dengan jari-jari 10 cm adalah... (π = 3,14)",
        type: "mcq",
        options: ["31,4 cm²", "62,8 cm²", "314 cm²", "628 cm²"],
        correctAnswer: "314 cm²",
        explanation: "L = πr²\nL = 3,14 × 10²\nL = 3,14 × 100 = 314 cm²",
        difficulty: 2
      }
    ]
  },
  {
    id: "geo-solid-shapes",
    categoryId: "geometry",
    categoryName: "Geometri",
    title: "Bangun Ruang - Kubus dan Balok",
    description: "Memahami sifat, volume, dan luas permukaan kubus serta balok",
    difficulty: "Sedang",
    estimatedDuration: "60 menit",
    prerequisites: ["geo-triangles"],
    learningObjectives: [
      "Memahami unsur-unsur kubus dan balok",
      "Menghitung volume kubus dan balok",
      "Menghitung luas permukaan bangun ruang",
      "Menerapkan rumus dalam soal aplikatif"
    ],
    theory: {
      sections: [
        {
          title: "Kubus",
          content: "Kubus adalah bangun ruang yang memiliki:\n• 6 sisi berbentuk persegi (sama luas)\n• 12 rusuk sama panjang\n• 8 titik sudut\n• Semua sudut 90°\n\nRumus:\n• Volume = s³\n• Luas Permukaan = 6s²\n\nDimana s = panjang rusuk",
          examples: [
            "Kubus rusuk 5 cm:\nV = 5³ = 125 cm³\nLP = 6 × 5² = 6 × 25 = 150 cm²"
          ],
          keyPoints: [
            "Semua rusuk sama panjang",
            "Semua sisi berbentuk persegi",
            "Volume = rusuk × rusuk × rusuk",
            "6 sisi yang identik"
          ]
        },
        {
          title: "Balok",
          content: "Balok adalah bangun ruang yang memiliki:\n• 6 sisi berbentuk persegi panjang\n• 12 rusuk (4 panjang, 4 lebar, 4 tinggi)\n• 8 titik sudut\n• Semua sudut 90°\n\nRumus:\n• Volume = p × l × t\n• Luas Permukaan = 2(pl + pt + lt)\n\nDimana p = panjang, l = lebar, t = tinggi",
          examples: [
            "Balok 6 cm × 4 cm × 3 cm:\nV = 6 × 4 × 3 = 72 cm³\nLP = 2(24 + 18 + 12) = 2 × 54 = 108 cm²"
          ],
          keyPoints: [
            "Sisi berhadapan sama luas",
            "Ada 3 pasang sisi",
            "Volume = panjang × lebar × tinggi",
            "LP = jumlah luas semua sisi"
          ]
        },
        {
          title: "Perbedaan Kubus dan Balok",
          content: "Kubus:\n• Semua rusuk sama panjang\n• Semua sisi persegi\n• Kasus khusus dari balok (p = l = t)\n\nBalok:\n• Rusuk bisa berbeda panjang\n• Sisi persegi panjang\n• Bentuk umum",
          keyPoints: [
            "Kubus adalah balok khusus",
            "Rumus kubus lebih sederhana",
            "Balok lebih fleksibel dalam ukuran"
          ]
        }
      ]
    },
    video: {
      title: "Bangun Ruang - Kubus dan Balok",
      youtubeUrl: "https://www.youtube.com/watch?v=2-10nq7w6R0",
      duration: "13:50",
      description: "Penjelasan lengkap tentang kubus dan balok, cara menghitung volume dan luas permukaan dengan contoh soal aplikatif.",
      channel: "Ruangguru"
    },
    exercises: [
      {
        id: "ex-geo-solid-001",
        question: "Volume kubus dengan rusuk 4 cm adalah...",
        type: "mcq",
        options: ["16 cm³", "32 cm³", "64 cm³", "96 cm³"],
        correctAnswer: "64 cm³",
        explanation: "Volume kubus = s³\nV = 4³ = 4 × 4 × 4 = 64 cm³",
        difficulty: 1
      },
      {
        id: "ex-geo-solid-002",
        question: "Luas permukaan kubus dengan rusuk 5 cm adalah...",
        type: "mcq",
        options: ["125 cm²", "150 cm²", "175 cm²", "200 cm²"],
        correctAnswer: "150 cm²",
        explanation: "Luas permukaan = 6s²\nLP = 6 × 5² = 6 × 25 = 150 cm²",
        difficulty: 2
      },
      {
        id: "ex-geo-solid-003",
        question: "Volume balok dengan ukuran 6 cm × 4 cm × 3 cm adalah...",
        type: "mcq",
        options: ["48 cm³", "60 cm³", "72 cm³", "84 cm³"],
        correctAnswer: "72 cm³",
        explanation: "Volume balok = p × l × t\nV = 6 × 4 × 3 = 72 cm³",
        difficulty: 2
      }
    ]
  }
];

export const calculusModules: LearningModule[] = [
  {
    id: "calc-limits",
    categoryId: "calculus",
    categoryName: "Kalkulus",
    title: "Limit Fungsi",
    description: "Pengenalan konsep limit, cara menghitung limit, dan sifat-sifat limit",
    difficulty: "Sedang",
    estimatedDuration: "65 menit",
    prerequisites: ["alg-linear-eq"],
    learningObjectives: [
      "Memahami konsep limit fungsi",
      "Menghitung limit fungsi aljabar",
      "Menerapkan sifat-sifat limit",
      "Menyelesaikan bentuk tak tentu"
    ],
    theory: {
      sections: [
        {
          title: "Konsep Limit",
          content: "Limit adalah nilai yang didekati oleh fungsi ketika variabel mendekati suatu nilai tertentu.\n\nNotasi: lim(x→a) f(x) = L\n\nArtinya: ketika x mendekati a, maka f(x) mendekati L",
          keyPoints: [
            "Limit adalah 'pendekatan', bukan nilai eksak",
            "Bisa dari kiri (x→a⁻) atau kanan (x→a⁺)",
            "Limit ada jika limit kiri = limit kanan",
            "f(a) tidak harus sama dengan lim(x→a) f(x)"
          ],
          examples: [
            "lim(x→2) (x + 3) = 2 + 3 = 5",
            "lim(x→0) (x²) = 0² = 0"
          ]
        },
        {
          title: "Sifat-sifat Limit",
          content: "Jika lim(x→a) f(x) = L dan lim(x→a) g(x) = M, maka:\n\n1. lim [f(x) ± g(x)] = L ± M\n2. lim [k·f(x)] = k·L\n3. lim [f(x)·g(x)] = L·M\n4. lim [f(x)/g(x)] = L/M (jika M ≠ 0)\n5. lim [f(x)]ⁿ = Lⁿ",
          examples: [
            "lim(x→2) (3x + 5) = 3(2) + 5 = 11",
            "lim(x→1) (x² - 2x + 1) = 1² - 2(1) + 1 = 0"
          ]
        },
        {
          title: "Bentuk Tak Tentu 0/0",
          content: "Jika substitusi langsung menghasilkan 0/0, gunakan:\n\n1. Pemfaktoran\n2. Perkalian dengan sekawan\n3. Aturan L'Hôpital (untuk tingkat lanjut)",
          examples: [
            "lim(x→2) (x²-4)/(x-2)\n= lim(x→2) (x+2)(x-2)/(x-2)\n= lim(x→2) (x+2) = 4"
          ]
        }
      ]
    },
    video: {
      title: "Limit Fungsi - Konsep Dasar dan Teknik Penyelesaian",
      youtubeUrl: "https://www.youtube.com/watch?v=riXcZT2ICjA",
      duration: "18:40",
      description: "Penjelasan konsep limit dari dasar, sifat-sifat limit, dan cara menyelesaikan berbagai bentuk limit termasuk bentuk tak tentu.",
      channel: "Ruangguru"
    },
    exercises: [
      {
        id: "ex-calc-lim-001",
        question: "lim(x→3) (2x + 5) = ...",
        type: "mcq",
        options: ["8", "11", "13", "16"],
        correctAnswer: "11",
        explanation: "Substitusi langsung:\nlim(x→3) (2x + 5) = 2(3) + 5 = 6 + 5 = 11",
        difficulty: 1
      },
      {
        id: "ex-calc-lim-002",
        question: "lim(x→2) (x² - 4)/(x - 2) = ...",
        type: "mcq",
        options: ["0", "2", "4", "tak terdefinisi"],
        correctAnswer: "4",
        explanation: "Bentuk 0/0, gunakan pemfaktoran:\n(x² - 4)/(x - 2) = (x+2)(x-2)/(x-2) = x+2\nlim(x→2) (x+2) = 2+2 = 4",
        difficulty: 2
      }
    ]
  }
];

export const statisticsModules: LearningModule[] = [
  {
    id: "stat-central-tendency",
    categoryId: "statistics",
    categoryName: "Statistika",
    title: "Ukuran Pemusatan Data",
    description: "Pelajari mean, median, modus, dan cara menghitungnya",
    difficulty: "Mudah",
    estimatedDuration: "50 menit",
    prerequisites: [],
    learningObjectives: [
      "Memahami konsep mean, median, dan modus",
      "Menghitung rata-rata dari sekumpulan data",
      "Menentukan median data tunggal dan berkelompok",
      "Mengidentifikasi modus dari data"
    ],
    theory: {
      sections: [
        {
          title: "Mean (Rata-rata)",
          content: "Mean adalah jumlah semua data dibagi banyaknya data.\n\nRumus: Mean = (Σx) / n\n\nDimana:\n• Σx = jumlah semua data\n• n = banyaknya data",
          examples: [
            "Data: 4, 5, 6, 7, 8\nMean = (4+5+6+7+8)/5 = 30/5 = 6",
            "Data: 10, 15, 20\nMean = (10+15+20)/3 = 45/3 = 15"
          ],
          keyPoints: [
            "Mewakili nilai tengah secara matematis",
            "Dipengaruhi oleh nilai ekstrem",
            "Paling sering digunakan",
            "Bisa berupa bilangan desimal"
          ]
        },
        {
          title: "Median (Nilai Tengah)",
          content: "Median adalah nilai tengah setelah data diurutkan.\n\nCara menentukan:\n1. Urutkan data dari terkecil ke terbesar\n2. Jika n ganjil: median = data ke-(n+1)/2\n3. Jika n genap: median = rata-rata 2 data tengah",
          examples: [
            "Data: 3, 5, 7, 9, 11 (n=5, ganjil)\nMedian = data ke-3 = 7",
            "Data: 2, 4, 6, 8 (n=4, genap)\nMedian = (4+6)/2 = 5"
          ],
          keyPoints: [
            "Tidak dipengaruhi nilai ekstrem",
            "Data harus diurutkan dulu",
            "Membagi data menjadi 2 bagian sama"
          ]
        },
        {
          title: "Modus (Nilai yang Sering Muncul)",
          content: "Modus adalah data yang paling sering muncul (frekuensi terbesar).\n\nKemungkinan:\n• Tidak ada modus (semua frekuensi sama)\n• Satu modus (unimodal)\n• Dua modus (bimodal)\n• Lebih dari dua modus (multimodal)",
          examples: [
            "Data: 2, 3, 3, 4, 5\nModus = 3 (muncul 2 kali)",
            "Data: 1, 2, 2, 3, 3, 4\nModus = 2 dan 3 (bimodal)"
          ],
          keyPoints: [
            "Bisa lebih dari satu",
            "Bisa tidak ada",
            "Cocok untuk data kategori",
            "Tidak perlu diurutkan"
          ]
        }
      ]
    },
    video: {
      title: "Statistika - Mean, Median, Modus",
      youtubeUrl: "https://www.youtube.com/watch?v=h8EYEJ32oQ8",
      duration: "13:15",
      description: "Penjelasan lengkap tentang ukuran pemusatan data (mean, median, modus) dengan contoh soal dan cara cepat menghitungnya.",
      channel: "Khan Academy Indonesia"
    },
    exercises: [
      {
        id: "ex-stat-ct-001",
        question: "Mean dari data 5, 7, 9, 11, 13 adalah...",
        type: "mcq",
        options: ["7", "8", "9", "10"],
        correctAnswer: "9",
        explanation: "Mean = (5+7+9+11+13)/5 = 45/5 = 9",
        difficulty: 1
      },
      {
        id: "ex-stat-ct-002",
        question: "Median dari data 3, 7, 5, 9, 11 adalah...",
        type: "mcq",
        options: ["5", "7", "9", "11"],
        correctAnswer: "7",
        explanation: "Urutkan: 3, 5, 7, 9, 11\nn = 5 (ganjil)\nMedian = data ke-3 = 7",
        difficulty: 2
      },
      {
        id: "ex-stat-ct-003",
        question: "Modus dari data 2, 3, 3, 4, 4, 4, 5 adalah...",
        type: "mcq",
        options: ["2", "3", "4", "5"],
        correctAnswer: "4",
        explanation: "Data 4 muncul 3 kali (paling sering)\nMaka modus = 4",
        difficulty: 1
      }
    ]
  },
  {
    id: "stat-data-presentation",
    categoryId: "statistics",
    categoryName: "Statistika",
    title: "Penyajian Data - Tabel dan Diagram",
    description: "Menyajikan data dalam bentuk tabel, diagram batang, diagram lingkaran, dan histogram",
    difficulty: "Mudah",
    estimatedDuration: "55 menit",
    prerequisites: [],
    learningObjectives: [
      "Memahami cara menyajikan data dalam tabel",
      "Membuat diagram batang dan diagram lingkaran",
      "Membaca dan menginterpretasi diagram",
      "Memilih penyajian data yang tepat"
    ],
    theory: {
      sections: [
        {
          title: "Tabel Frekuensi",
          content: "Tabel frekuensi digunakan untuk mengelompokkan dan menghitung data.\n\nKomponen:\n• Data/Nilai: kategori atau nilai yang diamati\n• Frekuensi: banyaknya data untuk setiap kategori\n• Frekuensi Relatif: frekuensi dibagi total (dalam persen)\n\nTotal frekuensi = jumlah semua data",
          examples: [
            "Warna Favorit:\nMerah: 8 siswa (40%)\nBiru: 6 siswa (30%)\nHijau: 6 siswa (30%)\nTotal: 20 siswa"
          ],
          keyPoints: [
            "Mudah dibaca dan dipahami",
            "Menunjukkan distribusi data",
            "Dasar untuk membuat diagram",
            "Jumlah frekuensi = total data"
          ]
        },
        {
          title: "Diagram Batang",
          content: "Diagram batang menampilkan data menggunakan batang vertikal atau horizontal.\n\nCiri-ciri:\n• Sumbu X: kategori data\n• Sumbu Y: frekuensi\n• Tinggi batang = frekuensi\n• Batang terpisah (tidak menyatu)\n\nCocok untuk: data kategori atau diskrit",
          examples: [
            "Nilai Ujian:\n80-89: 5 siswa\n90-99: 8 siswa\n100: 3 siswa"
          ],
          keyPoints: [
            "Visual dan mudah dibandingkan",
            "Batang tidak boleh menyatu",
            "Tinggi batang proporsional dengan frekuensi",
            "Cocok untuk data kategori"
          ]
        },
        {
          title: "Diagram Lingkaran",
          content: "Diagram lingkaran menunjukkan proporsi data dalam bentuk juring lingkaran.\n\nRumus sudut:\nSudut = (Frekuensi / Total) × 360°\n\nRumus persentase:\nPersen = (Frekuensi / Total) × 100%\n\nTotal sudut = 360°",
          examples: [
            "Merah 8 dari 20:\nSudut = 8/20 × 360° = 144°\nPersen = 8/20 × 100% = 40%"
          ],
          keyPoints: [
            "Menunjukkan proporsi/bagian dari keseluruhan",
            "Total sudut = 360°",
            "Cocok untuk data komposisi",
            "Mudah melihat perbandingan"
          ]
        },
        {
          title: "Histogram",
          content: "Histogram mirip diagram batang, tapi untuk data berkelompok/kontinu.\n\nPerbedaan dengan diagram batang:\n• Batang menyatu (tidak ada jarak)\n• Untuk data kontinu\n• Sumbu X: interval kelas\n• Sumbu Y: frekuensi",
          examples: [
            "Tinggi Badan (cm):\n150-154: 3 siswa\n155-159: 7 siswa\n160-164: 5 siswa"
          ],
          keyPoints: [
            "Batang menyatu (no gap)",
            "Data berkelompok",
            "Menunjukkan distribusi",
            "Berbeda dengan diagram batang"
          ]
        }
      ]
    },
    video: {
      title: "Penyajian Data - Tabel, Diagram Batang, Diagram Lingkaran",
      youtubeUrl: "https://www.youtube.com/watch?v=vWp_pwulTkE",
      duration: "14:40",
      description: "Cara menyajikan data dalam berbagai bentuk diagram, menghitung sudut diagram lingkaran, dan membaca informasi dari diagram.",
      channel: "Zenius Education"
    },
    exercises: [
      {
        id: "ex-stat-dp-001",
        question: "Jika 8 dari 40 siswa suka matematika, berapa sudut untuk matematika pada diagram lingkaran?",
        type: "mcq",
        options: ["36°", "72°", "90°", "144°"],
        correctAnswer: "72°",
        explanation: "Sudut = (Frekuensi / Total) × 360°\n= (8/40) × 360°\n= 0.2 × 360° = 72°",
        difficulty: 2
      },
      {
        id: "ex-stat-dp-002",
        question: "Diagram batang cocok untuk data jenis...",
        type: "mcq",
        options: ["Kategori", "Kontinu", "Semua jenis", "Waktu"],
        correctAnswer: "Kategori",
        explanation: "Diagram batang paling cocok untuk data kategori atau diskrit, dimana batang terpisah satu sama lain.",
        difficulty: 1
      },
      {
        id: "ex-stat-dp-003",
        question: "Perbedaan histogram dan diagram batang adalah...",
        type: "mcq",
        options: [
          "Histogram batangnya menyatu",
          "Histogram lebih tinggi",
          "Diagram batang lebih lebar",
          "Tidak ada perbedaan"
        ],
        correctAnswer: "Histogram batangnya menyatu",
        explanation: "Histogram memiliki batang yang menyatu (no gap) karena untuk data kontinu/berkelompok, sedangkan diagram batang batangnya terpisah.",
        difficulty: 2
      }
    ]
  }
];

export const trigonometryModules: LearningModule[] = [
  {
    id: "trig-basic",
    categoryId: "trigonometry",
    categoryName: "Trigonometri",
    title: "Fungsi Trigonometri Dasar",
    description: "Pengenalan sin, cos, tan dan penggunaannya pada segitiga siku-siku",
    difficulty: "Sedang",
    estimatedDuration: "60 menit",
    prerequisites: ["geo-triangles"],
    learningObjectives: [
      "Memahami konsep sin, cos, tan",
      "Menghitung nilai trigonometri pada segitiga siku-siku",
      "Menggunakan perbandingan trigonometri",
      "Menerapkan pada soal aplikatif"
    ],
    theory: {
      sections: [
        {
          title: "Perbandingan Trigonometri",
          content: "Pada segitiga siku-siku:\n\nsin θ = depan/miring\ncos θ = samping/miring\ntan θ = depan/samping\n\nDimana:\n• depan = sisi di depan sudut θ\n• samping = sisi di samping sudut θ (bukan miring)\n• miring = hipotenusa",
          keyPoints: [
            "Hanya untuk segitiga siku-siku",
            "θ adalah sudut lancip (< 90°)",
            "sin dan cos selalu ≤ 1",
            "tan bisa > 1"
          ],
          examples: [
            "Segitiga 3-4-5:\nsin θ = 3/5 = 0,6\ncos θ = 4/5 = 0,8\ntan θ = 3/4 = 0,75"
          ]
        },
        {
          title: "Sudut Istimewa",
          content: "Nilai trigonometri untuk sudut 30°, 45°, 60°:\n\n        30°       45°       60°\nsin   1/2      √2/2      √3/2\ncos   √3/2     √2/2      1/2\ntan   √3/3     1         √3",
          keyPoints: [
            "Hafal nilai sudut istimewa",
            "Gunakan segitiga 45-45-90 dan 30-60-90",
            "sin 30° = cos 60° = 1/2",
            "sin 45° = cos 45° = √2/2"
          ]
        },
        {
          title: "Identitas Trigonometri Dasar",
          content: "Hubungan fundamental:\n\n1. sin²θ + cos²θ = 1\n2. tan θ = sin θ / cos θ\n3. sin(90° - θ) = cos θ\n4. cos(90° - θ) = sin θ",
          examples: [
            "Jika sin θ = 3/5, maka:\ncos²θ = 1 - sin²θ = 1 - 9/25 = 16/25\ncos θ = 4/5"
          ]
        }
      ]
    },
    video: {
      title: "Trigonometri Dasar - Sin, Cos, Tan",
      youtubeUrl: "https://www.youtube.com/watch?v=yBw67Fb31Cs",
      duration: "16:50",
      description: "Penjelasan lengkap fungsi trigonometri dasar, cara menghafalnya, dan penggunaan pada segitiga siku-siku dengan contoh soal.",
      channel: "Ruangguru"
    },
    exercises: [
      {
        id: "ex-trig-bas-001",
        question: "Pada segitiga siku-siku dengan sisi 3, 4, 5. Berapakah sin θ jika θ adalah sudut di depan sisi 3?",
        type: "mcq",
        options: ["3/5", "4/5", "3/4", "4/3"],
        correctAnswer: "3/5",
        explanation: "sin θ = depan/miring = 3/5",
        difficulty: 2
      },
      {
        id: "ex-trig-bas-002",
        question: "Nilai sin 30° adalah...",
        type: "mcq",
        options: ["1/2", "√2/2", "√3/2", "1"],
        correctAnswer: "1/2",
        explanation: "Nilai sudut istimewa: sin 30° = 1/2",
        difficulty: 1
      }
    ]
  },
  {
    id: "trig-identities",
    categoryId: "trigonometry",
    categoryName: "Trigonometri",
    title: "Identitas Trigonometri",
    description: "Memahami dan menggunakan identitas trigonometri untuk menyederhanakan ekspresi",
    difficulty: "Sulit",
    estimatedDuration: "70 menit",
    prerequisites: ["trig-basic"],
    learningObjectives: [
      "Memahami identitas trigonometri fundamental",
      "Menggunakan identitas untuk menyederhanakan ekspresi",
      "Membuktikan identitas trigonometri",
      "Menyelesaikan persamaan trigonometri"
    ],
    theory: {
      sections: [
        {
          title: "Identitas Pythagoras",
          content: "Identitas fundamental yang berasal dari teorema Pythagoras:\n\n1. sin²θ + cos²θ = 1\n2. 1 + tan²θ = sec²θ\n3. 1 + cot²θ = csc²θ\n\nIdentitas (1) adalah yang paling sering digunakan.",
          examples: [
            "Jika sin θ = 3/5, cari cos θ:\nsin²θ + cos²θ = 1\n9/25 + cos²θ = 1\ncos²θ = 16/25\ncos θ = 4/5"
          ],
          keyPoints: [
            "Selalu berlaku untuk semua sudut",
            "Gunakan untuk mencari nilai trig lainnya",
            "Dasar dari banyak pembuktian",
            "sin²θ artinya (sin θ)²"
          ]
        },
        {
          title: "Identitas Perbandingan",
          content: "Hubungan antara fungsi trigonometri:\n\n• tan θ = sin θ / cos θ\n• cot θ = cos θ / sin θ = 1 / tan θ\n• sec θ = 1 / cos θ\n• csc θ = 1 / sin θ",
          examples: [
            "Jika sin θ = 3/5 dan cos θ = 4/5:\ntan θ = sin θ / cos θ = (3/5)/(4/5) = 3/4"
          ],
          keyPoints: [
            "tan dan cot adalah kebalikan",
            "sec adalah kebalikan cos",
            "csc adalah kebalikan sin",
            "Berguna untuk konversi"
          ]
        },
        {
          title: "Identitas Sudut Komplemen",
          content: "Untuk sudut yang jumlahnya 90°:\n\n• sin(90° - θ) = cos θ\n• cos(90° - θ) = sin θ\n• tan(90° - θ) = cot θ\n• cot(90° - θ) = tan θ\n\nIni menjelaskan nama 'co-' (complement)",
          examples: [
            "sin 30° = cos(90° - 30°) = cos 60° = 1/2",
            "tan 45° = cot(90° - 45°) = cot 45° = 1"
          ],
          keyPoints: [
            "Jumlah sudut = 90°",
            "sin ↔ cos",
            "tan ↔ cot",
            "sec ↔ csc"
          ]
        },
        {
          title: "Strategi Pembuktian Identitas",
          content: "Langkah-langkah membuktikan identitas:\n\n1. Mulai dari sisi yang lebih rumit\n2. Ubah semua ke sin dan cos\n3. Gunakan identitas Pythagoras\n4. Faktorkan atau sederhanakan\n5. Tunjukkan sama dengan sisi lainnya",
          examples: [
            "Buktikan: tan²θ + 1 = sec²θ\n\ntan²θ + 1\n= (sin²θ/cos²θ) + 1\n= (sin²θ + cos²θ)/cos²θ\n= 1/cos²θ\n= sec²θ ✓"
          ],
          keyPoints: [
            "Jangan mengubah kedua sisi bersamaan",
            "Gunakan identitas dasar",
            "Sederhanakan bertahap",
            "Periksa setiap langkah"
          ]
        }
      ]
    },
    video: {
      title: "Identitas Trigonometri - Pembuktian dan Aplikasi",
      youtubeUrl: "https://www.youtube.com/watch?v=GXvAz8xWOHw",
      duration: "18:15",
      description: "Pembahasan lengkap identitas trigonometri, teknik pembuktian, dan penerapannya dalam menyelesaikan soal-soal trigonometri.",
      channel: "Ruangguru"
    },
    exercises: [
      {
        id: "ex-trig-id-001",
        question: "Jika sin θ = 3/5, berapakah cos²θ?",
        type: "mcq",
        options: ["9/25", "16/25", "4/5", "3/4"],
        correctAnswer: "16/25",
        explanation: "Gunakan sin²θ + cos²θ = 1\n(3/5)² + cos²θ = 1\n9/25 + cos²θ = 1\ncos²θ = 1 - 9/25 = 16/25",
        difficulty: 2
      },
      {
        id: "ex-trig-id-002",
        question: "tan θ dapat ditulis sebagai...",
        type: "mcq",
        options: ["sin θ / cos θ", "cos θ / sin θ", "1 / sin θ", "1 / cos θ"],
        correctAnswer: "sin θ / cos θ",
        explanation: "Identitas perbandingan: tan θ = sin θ / cos θ",
        difficulty: 1
      },
      {
        id: "ex-trig-id-003",
        question: "sin(90° - 30°) sama dengan...",
        type: "mcq",
        options: ["cos 30°", "sin 30°", "tan 30°", "cos 60°"],
        correctAnswer: "cos 30°",
        explanation: "Identitas sudut komplemen: sin(90° - θ) = cos θ\nJadi sin(90° - 30°) = cos 30°",
        difficulty: 2
      }
    ]
  }
];

export const logicModules: LearningModule[] = [
  {
    id: "logic-statements",
    categoryId: "logic",
    categoryName: "Logika",
    title: "Pernyataan dan Negasi",
    description: "Memahami pernyataan logika, negasi, dan nilai kebenaran",
    difficulty: "Mudah",
    estimatedDuration: "45 menit",
    prerequisites: [],
    learningObjectives: [
      "Memahami konsep pernyataan logika",
      "Membuat negasi dari pernyataan",
      "Menentukan nilai kebenaran",
      "Membedakan pernyataan dan kalimat terbuka"
    ],
    theory: {
      sections: [
        {
          title: "Pernyataan Logika",
          content: "Pernyataan adalah kalimat yang memiliki nilai kebenaran pasti: benar (B) atau salah (S).\n\nBukan pernyataan:\n• Kalimat tanya\n• Kalimat perintah\n• Kalimat terbuka (ada variabel)",
          examples: [
            "Pernyataan: '2 + 2 = 4' (Benar)",
            "Pernyataan: 'Jakarta ibu kota Indonesia' (Benar)",
            "Bukan pernyataan: 'x + 2 = 5' (kalimat terbuka)",
            "Bukan pernyataan: 'Tutup pintu!' (perintah)"
          ],
          keyPoints: [
            "Harus bisa ditentukan benar/salah",
            "Tidak boleh mengandung variabel",
            "Bukan pertanyaan atau perintah"
          ]
        },
        {
          title: "Negasi Pernyataan",
          content: "Negasi (~p) adalah kebalikan nilai kebenaran pernyataan p.\n\nJika p benar, maka ~p salah\nJika p salah, maka ~p benar\n\nCara membuat negasi:\n• Tambahkan 'tidak' atau 'bukan'\n• Ubah 'semua' menjadi 'ada yang tidak'\n• Ubah 'ada' menjadi 'tidak ada'",
          examples: [
            "p: 'Hari ini hujan'\n~p: 'Hari ini tidak hujan'",
            "p: 'Semua siswa lulus'\n~p: 'Ada siswa yang tidak lulus'",
            "p: '5 > 3' (Benar)\n~p: '5 ≤ 3' (Salah)"
          ],
          keyPoints: [
            "Nilai kebenaran terbalik",
            "Hati-hati dengan kata 'semua' dan 'ada'",
            "Notasi: ~p atau ¬p"
          ]
        },
        {
          title: "Tabel Kebenaran",
          content: "Tabel kebenaran menunjukkan semua kemungkinan nilai kebenaran:\n\np  | ~p\n---|---\nB  | S\nS  | B\n\nDigunakan untuk menganalisis pernyataan majemuk.",
          keyPoints: [
            "B = Benar, S = Salah",
            "Negasi membalik nilai",
            "Dasar untuk logika lebih lanjut"
          ]
        }
      ]
    },
    video: {
      title: "Logika Matematika - Pernyataan dan Negasi",
      youtubeUrl: "https://www.youtube.com/watch?v=tWZYS86HzLM",
      duration: "12:30",
      description: "Penjelasan konsep pernyataan logika, cara membuat negasi yang benar, dan tabel kebenaran dengan contoh-contoh praktis.",
      channel: "Zenius Education"
    },
    exercises: [
      {
        id: "ex-logic-st-001",
        question: "Manakah yang merupakan pernyataan?",
        type: "mcq",
        options: ["Berapa umurmu?", "x + 3 = 7", "2 + 2 = 4", "Buka bukumu!"],
        correctAnswer: "2 + 2 = 4",
        explanation: "'2 + 2 = 4' adalah pernyataan (benar). Yang lain adalah pertanyaan, kalimat terbuka, dan perintah.",
        difficulty: 1
      },
      {
        id: "ex-logic-st-002",
        question: "Negasi dari 'Semua siswa hadir' adalah...",
        type: "mcq",
        options: [
          "Tidak ada siswa hadir",
          "Ada siswa yang tidak hadir",
          "Semua siswa tidak hadir",
          "Beberapa siswa hadir"
        ],
        correctAnswer: "Ada siswa yang tidak hadir",
        explanation: "Negasi 'semua' adalah 'ada yang tidak'. Jadi negasinya: 'Ada siswa yang tidak hadir'",
        difficulty: 2
      }
    ]
  },
  {
    id: "logic-compound",
    categoryId: "logic",
    categoryName: "Logika",
    title: "Pernyataan Majemuk - Konjungsi dan Disjungsi",
    description: "Memahami pernyataan majemuk dengan operator AND (∧) dan OR (∨)",
    difficulty: "Sedang",
    estimatedDuration: "60 menit",
    prerequisites: ["logic-statements"],
    learningObjectives: [
      "Memahami konsep pernyataan majemuk",
      "Menggunakan operator konjungsi (∧) dan disjungsi (∨)",
      "Membuat tabel kebenaran pernyataan majemuk",
      "Menentukan nilai kebenaran pernyataan majemuk"
    ],
    theory: {
      sections: [
        {
          title: "Pernyataan Majemuk",
          content: "Pernyataan majemuk adalah gabungan dari dua atau lebih pernyataan tunggal yang dihubungkan dengan kata hubung logika.\n\nKata hubung:\n• DAN (∧) - Konjungsi\n• ATAU (∨) - Disjungsi\n• JIKA...MAKA (→) - Implikasi\n• JIKA DAN HANYA JIKA (↔) - Biimplikasi",
          examples: [
            "p: Hari ini hujan\nq: Saya bawa payung\np ∧ q: Hari ini hujan DAN saya bawa payung\np ∨ q: Hari ini hujan ATAU saya bawa payung"
          ],
          keyPoints: [
            "Gabungan 2+ pernyataan tunggal",
            "Menggunakan kata hubung logika",
            "Nilai kebenaran tergantung operator",
            "Notasi: ∧, ∨, →, ↔"
          ]
        },
        {
          title: "Konjungsi (∧) - DAN",
          content: "Konjungsi p ∧ q benar HANYA JIKA kedua pernyataan benar.\n\nTabel Kebenaran:\np | q | p ∧ q\n--|---|------\nB | B | B\nB | S | S\nS | B | S\nS | S | S\n\nIngat: AND butuh SEMUA benar",
          examples: [
            "p: 2 + 2 = 4 (Benar)\nq: 3 > 5 (Salah)\np ∧ q = Salah\n(karena q salah)"
          ],
          keyPoints: [
            "Benar hanya jika SEMUA benar",
            "Satu salah = hasil salah",
            "Seperti 'AND' di pemrograman",
            "Paling ketat"
          ]
        },
        {
          title: "Disjungsi (∨) - ATAU",
          content: "Disjungsi p ∨ q benar JIKA minimal satu pernyataan benar.\n\nTabel Kebenaran:\np | q | p ∨ q\n--|---|------\nB | B | B\nB | S | B\nS | B | B\nS | S | S\n\nIngat: OR butuh MINIMAL SATU benar",
          examples: [
            "p: 2 + 2 = 4 (Benar)\nq: 3 > 5 (Salah)\np ∨ q = Benar\n(karena p benar)"
          ],
          keyPoints: [
            "Benar jika MINIMAL SATU benar",
            "Salah hanya jika SEMUA salah",
            "Seperti 'OR' di pemrograman",
            "Lebih longgar dari AND"
          ]
        },
        {
          title: "Negasi Pernyataan Majemuk",
          content: "Hukum De Morgan:\n\n1. ~(p ∧ q) = (~p) ∨ (~q)\n2. ~(p ∨ q) = (~p) ∧ (~q)\n\nNegasi AND → OR dengan negasi\nNegasi OR → AND dengan negasi",
          examples: [
            "p ∧ q: Hujan DAN dingin\n~(p ∧ q): Tidak hujan ATAU tidak dingin",
            "p ∨ q: Lulus ATAU remedial\n~(p ∨ q): Tidak lulus DAN tidak remedial"
          ],
          keyPoints: [
            "Operator berubah (∧ ↔ ∨)",
            "Setiap pernyataan dinegasi",
            "Hukum De Morgan sangat penting",
            "Periksa dengan tabel kebenaran"
          ]
        }
      ]
    },
    video: {
      title: "Pernyataan Majemuk - Konjungsi dan Disjungsi",
      youtubeUrl: "https://www.youtube.com/watch?v=8ZULT6wqOXY",
      duration: "15:30",
      description: "Penjelasan pernyataan majemuk, operator logika AND/OR, tabel kebenaran, dan hukum De Morgan dengan contoh aplikatif.",
      channel: "Khan Academy Indonesia"
    },
    exercises: [
      {
        id: "ex-logic-comp-001",
        question: "Jika p benar dan q salah, nilai p ∧ q adalah...",
        type: "mcq",
        options: ["Benar", "Salah", "Tidak dapat ditentukan", "Tergantung konteks"],
        correctAnswer: "Salah",
        explanation: "Konjungsi (∧) benar HANYA jika kedua pernyataan benar.\nKarena q salah, maka p ∧ q = Salah",
        difficulty: 1
      },
      {
        id: "ex-logic-comp-002",
        question: "Jika p benar dan q salah, nilai p ∨ q adalah...",
        type: "mcq",
        options: ["Benar", "Salah", "Tidak dapat ditentukan", "Tergantung konteks"],
        correctAnswer: "Benar",
        explanation: "Disjungsi (∨) benar jika MINIMAL SATU pernyataan benar.\nKarena p benar, maka p ∨ q = Benar",
        difficulty: 1
      },
      {
        id: "ex-logic-comp-003",
        question: "Negasi dari (p ∧ q) menurut hukum De Morgan adalah...",
        type: "mcq",
        options: ["(~p) ∧ (~q)", "(~p) ∨ (~q)", "~p ∧ q", "p ∨ (~q)"],
        correctAnswer: "(~p) ∨ (~q)",
        explanation: "Hukum De Morgan: ~(p ∧ q) = (~p) ∨ (~q)\nOperator berubah dari AND (∧) ke OR (∨), dan setiap pernyataan dinegasi.",
        difficulty: 2
      }
    ]
  }
];

// Combine all modules
export const allLearningModules: LearningModule[] = [
  ...algebraModules,
  ...geometryModules,
  ...calculusModules,
  ...statisticsModules,
  ...trigonometryModules,
  ...logicModules
];

// Helper functions
export const getModulesByCategory = (categoryId: string): LearningModule[] => {
  return allLearningModules.filter(module => module.categoryId === categoryId);
};

export const getModuleById = (moduleId: string): LearningModule | undefined => {
  return allLearningModules.find(module => module.id === moduleId);
};

export const getCategoryModuleCount = (categoryId: string): number => {
  return allLearningModules.filter(module => module.categoryId === categoryId).length;
};
