/**
 * SD-Level Quiz Questions (Grade 4-6)
 * Matematika, IPA, Bahasa Indonesia, PKn
 * Difficulty: mudah
 */

export const sdMathQuestions = [
  // Penjumlahan dan Pengurangan (15 questions)
  {
    topicCode: "SD-MTK-TAMBAHKURANG-01",
    question: "Hasil dari 45 + 37 adalah...",
    type: "multiple-choice",
    options: ["82", "72", "92", "62"],
    correctAnswer: "82",
    difficulty: "mudah",
    hints: [
      "Jumlahkan satuan dulu: 5 + 7 = 12",
      "Lalu puluhan: 40 + 30 + 10 (dari 12)"
    ],
    explanation: "45 + 37 = 82. Satuan: 5 + 7 = 12 (tulis 2, simpan 1). Puluhan: 4 + 3 + 1 = 8.",
    tags: ["matematika", "penjumlahan", "dasar"],
    subject: "Matematika",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-MTK-TAMBAHKURANG-01",
    question: "56 - 28 = ...",
    type: "multiple-choice",
    options: ["28", "38", "18", "48"],
    correctAnswer: "28",
    difficulty: "mudah",
    hints: [
      "Pinjam dari puluhan",
      "Ubah 56 menjadi 40 + 16"
    ],
    explanation: "56 - 28 = 28. Karena 6 < 8, pinjam 1 dari 5 (jadi 4). Lalu 16 - 8 = 8, 4 - 2 = 2.",
    tags: ["matematika", "pengurangan", "dasar"],
    subject: "Matematika",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-MTK-TAMBAHKURANG-01",
    question: "Ani memiliki 24 kelereng. Ia mendapat 15 kelereng lagi dari Budi. Berapa kelereng Ani sekarang?",
    type: "multiple-choice",
    options: ["39", "29", "49", "35"],
    correctAnswer: "39",
    difficulty: "mudah",
    hints: [
      "Tambahkan kelereng yang didapat",
      "24 + 15 = ?"
    ],
    explanation: "24 + 15 = 39 kelereng.",
    tags: ["matematika", "penjumlahan", "soal-cerita"],
    subject: "Matematika",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-MTK-TAMBAHKURANG-01",
    question: "Di kelas ada 35 siswa. Hari ini 7 siswa tidak masuk. Berapa siswa yang hadir?",
    type: "multiple-choice",
    options: ["28", "42", "27", "38"],
    correctAnswer: "28",
    difficulty: "mudah",
    hints: [
      "Kurangi yang tidak masuk",
      "35 - 7 = ?"
    ],
    explanation: "35 - 7 = 28 siswa yang hadir.",
    tags: ["matematika", "pengurangan", "soal-cerita"],
    subject: "Matematika",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-MTK-TAMBAHKURANG-01",
    question: "125 + 243 = ...",
    type: "multiple-choice",
    options: ["368", "358", "468", "268"],
    correctAnswer: "368",
    difficulty: "mudah",
    hints: [
      "Jumlahkan dari satuan ke ratusan",
      "5 + 3 = 8, 2 + 4 = 6, 1 + 2 = 3"
    ],
    explanation: "125 + 243 = 368. Satuan: 5+3=8, Puluhan: 2+4=6, Ratusan: 1+2=3.",
    tags: ["matematika", "penjumlahan", "bilangan-3-angka"],
    subject: "Matematika",
    gradeLevel: "SD"
  },

  // Perkalian dan Pembagian (15 questions)
  {
    topicCode: "SD-MTK-KALIDIBAGI-01",
    question: "7 × 8 = ...",
    type: "multiple-choice",
    options: ["56", "64", "48", "72"],
    correctAnswer: "56",
    difficulty: "mudah",
    hints: [
      "Ingat tabel perkalian 7",
      "7 × 8 = 7 × (2 × 4)"
    ],
    explanation: "7 × 8 = 56.",
    tags: ["matematika", "perkalian", "hafalan"],
    subject: "Matematika",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-MTK-KALIDIBAGI-01",
    question: "48 : 6 = ...",
    type: "multiple-choice",
    options: ["8", "7", "9", "6"],
    correctAnswer: "8",
    difficulty: "mudah",
    hints: [
      "6 × ? = 48",
      "Ingat tabel perkalian 6"
    ],
    explanation: "48 : 6 = 8, karena 6 × 8 = 48.",
    tags: ["matematika", "pembagian", "dasar"],
    subject: "Matematika",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-MTK-KALIDIBAGI-01",
    question: "Ibu membeli 5 kantong permen. Setiap kantong berisi 12 permen. Berapa total permen?",
    type: "multiple-choice",
    options: ["60", "50", "70", "55"],
    correctAnswer: "60",
    difficulty: "mudah",
    hints: [
      "Gunakan perkalian",
      "5 × 12 = ?"
    ],
    explanation: "5 × 12 = 60 permen.",
    tags: ["matematika", "perkalian", "soal-cerita"],
    subject: "Matematika",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-MTK-KALIDIBAGI-01",
    question: "36 permen dibagikan kepada 4 anak sama rata. Setiap anak mendapat...",
    type: "multiple-choice",
    options: ["9 permen", "8 permen", "10 permen", "7 permen"],
    correctAnswer: "9 permen",
    difficulty: "mudah",
    hints: [
      "Gunakan pembagian",
      "36 : 4 = ?"
    ],
    explanation: "36 : 4 = 9 permen untuk setiap anak.",
    tags: ["matematika", "pembagian", "soal-cerita"],
    subject: "Matematika",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-MTK-KALIDIBAGI-01",
    question: "12 × 5 = ...",
    type: "multiple-choice",
    options: ["60", "50", "70", "55"],
    correctAnswer: "60",
    difficulty: "mudah",
    hints: [
      "12 × 5 = 10 × 5 + 2 × 5",
      "= 50 + 10"
    ],
    explanation: "12 × 5 = 60.",
    tags: ["matematika", "perkalian"],
    subject: "Matematika",
    gradeLevel: "SD"
  },

  // Pecahan Sederhana (10 questions)
  {
    topicCode: "SD-MTK-PECAHAN-01",
    question: "1/2 dari 10 adalah...",
    type: "multiple-choice",
    options: ["5", "10", "2", "20"],
    correctAnswer: "5",
    difficulty: "mudah",
    hints: [
      "1/2 artinya dibagi 2",
      "10 : 2 = ?"
    ],
    explanation: "1/2 × 10 = 10 : 2 = 5.",
    tags: ["matematika", "pecahan", "dasar"],
    subject: "Matematika",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-MTK-PECAHAN-01",
    question: "1/4 + 1/4 = ...",
    type: "multiple-choice",
    options: ["2/4", "1/8", "2/8", "1/2"],
    correctAnswer: "2/4",
    difficulty: "mudah",
    hints: [
      "Penyebutnya sama",
      "Jumlahkan pembilangnya: 1 + 1 = 2"
    ],
    explanation: "1/4 + 1/4 = 2/4 (atau 1/2 jika disederhanakan).",
    tags: ["matematika", "pecahan", "penjumlahan"],
    subject: "Matematika",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-MTK-PECAHAN-01",
    question: "Andi makan 1/3 pizza. Budi makan 1/3 pizza. Berapa pizza yang dimakan berdua?",
    type: "multiple-choice",
    options: ["2/3", "1/6", "1/3", "3/3"],
    correctAnswer: "2/3",
    difficulty: "mudah",
    hints: [
      "Jumlahkan pecahannya",
      "1/3 + 1/3 = ?"
    ],
    explanation: "1/3 + 1/3 = 2/3 pizza.",
    tags: ["matematika", "pecahan", "soal-cerita"],
    subject: "Matematika",
    gradeLevel: "SD"
  },

  // Bangun Datar (10 questions)
  {
    topicCode: "SD-MTK-BANGUNDATAR-01",
    question: "Berapa banyak sisi pada segitiga?",
    type: "multiple-choice",
    options: ["3", "4", "5", "6"],
    correctAnswer: "3",
    difficulty: "mudah",
    hints: [
      "Tri artinya tiga",
      "Hitung sisi segitiga"
    ],
    explanation: "Segitiga memiliki 3 sisi.",
    tags: ["matematika", "geometri", "bangun-datar"],
    subject: "Matematika",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-MTK-BANGUNDATAR-01",
    question: "Persegi memiliki... sisi yang sama panjang.",
    type: "multiple-choice",
    options: ["4", "2", "3", "6"],
    correctAnswer: "4",
    difficulty: "mudah",
    hints: [
      "Persegi = semua sisi sama",
      "Berapa sisi persegi?"
    ],
    explanation: "Persegi memiliki 4 sisi yang sama panjang.",
    tags: ["matematika", "geometri", "persegi"],
    subject: "Matematika",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-MTK-BANGUNDATAR-01",
    question: "Keliling persegi dengan sisi 5 cm adalah...",
    type: "multiple-choice",
    options: ["20 cm", "25 cm", "10 cm", "15 cm"],
    correctAnswer: "20 cm",
    difficulty: "mudah",
    hints: [
      "Keliling = 4 × sisi",
      "4 × 5 = ?"
    ],
    explanation: "Keliling persegi = 4 × 5 = 20 cm.",
    tags: ["matematika", "geometri", "keliling"],
    subject: "Matematika",
    gradeLevel: "SD"
  }
];

export const sdScienceQuestions = [
  // Bagian Tubuh (10 questions)
  {
    topicCode: "SD-IPA-TUBUH-01",
    question: "Alat indra untuk melihat adalah...",
    type: "multiple-choice",
    options: ["Mata", "Hidung", "Telinga", "Lidah"],
    correctAnswer: "Mata",
    difficulty: "mudah",
    hints: [
      "Digunakan untuk penglihatan",
      "Ada di wajah, berjumlah 2"
    ],
    explanation: "Mata adalah alat indra penglihatan.",
    tags: ["ipa", "tubuh", "alat-indra"],
    subject: "IPA",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-IPA-TUBUH-01",
    question: "Fungsi jantung adalah...",
    type: "multiple-choice",
    options: [
      "Memompa darah ke seluruh tubuh",
      "Mencerna makanan",
      "Bernapas",
      "Berpikir"
    ],
    correctAnswer: "Memompa darah ke seluruh tubuh",
    difficulty: "mudah",
    hints: [
      "Organ pemompa",
      "Berhubungan dengan peredaran darah"
    ],
    explanation: "Jantung berfungsi memompa darah ke seluruh tubuh.",
    tags: ["ipa", "tubuh", "organ"],
    subject: "IPA",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-IPA-TUBUH-01",
    question: "Berapa jumlah gigi tetap pada orang dewasa?",
    type: "multiple-choice",
    options: ["32", "20", "28", "24"],
    correctAnswer: "32",
    difficulty: "mudah",
    hints: [
      "Lebih banyak dari gigi susu",
      "Termasuk gigi geraham bungsu"
    ],
    explanation: "Orang dewasa memiliki 32 gigi tetap.",
    tags: ["ipa", "tubuh", "gigi"],
    subject: "IPA",
    gradeLevel: "SD"
  },

  // Tumbuhan (10 questions)
  {
    topicCode: "SD-IPA-TUMBUHAN-01",
    question: "Bagian tumbuhan yang menyerap air dari tanah adalah...",
    type: "multiple-choice",
    options: ["Akar", "Batang", "Daun", "Bunga"],
    correctAnswer: "Akar",
    difficulty: "mudah",
    hints: [
      "Ada di dalam tanah",
      "Berfungsi menyerap nutrisi"
    ],
    explanation: "Akar berfungsi menyerap air dan mineral dari tanah.",
    tags: ["ipa", "tumbuhan", "bagian-tumbuhan"],
    subject: "IPA",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-IPA-TUMBUHAN-01",
    question: "Proses pembuatan makanan pada tumbuhan hijau disebut...",
    type: "multiple-choice",
    options: ["Fotosintesis", "Respirasi", "Transpirasi", "Evaporasi"],
    correctAnswer: "Fotosintesis",
    difficulty: "mudah",
    hints: [
      "Menggunakan cahaya matahari",
      "Terjadi di daun"
    ],
    explanation: "Fotosintesis adalah proses pembuatan makanan menggunakan cahaya matahari, CO₂, dan air.",
    tags: ["ipa", "tumbuhan", "fotosintesis"],
    subject: "IPA",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-IPA-TUMBUHAN-01",
    question: "Warna hijau pada daun berasal dari...",
    type: "multiple-choice",
    options: ["Klorofil", "Air", "Cahaya", "Tanah"],
    correctAnswer: "Klorofil",
    difficulty: "mudah",
    hints: [
      "Zat warna hijau",
      "Penting untuk fotosintesis"
    ],
    explanation: "Klorofil adalah zat hijau daun yang berperan dalam fotosintesis.",
    tags: ["ipa", "tumbuhan", "klorofil"],
    subject: "IPA",
    gradeLevel: "SD"
  },

  // Hewan (10 questions)
  {
    topicCode: "SD-IPA-HEWAN-01",
    question: "Hewan yang berkembang biak dengan bertelur adalah...",
    type: "multiple-choice",
    options: ["Ayam", "Kucing", "Sapi", "Kambing"],
    correctAnswer: "Ayam",
    difficulty: "mudah",
    hints: [
      "Ovipar = bertelur",
      "Unggas"
    ],
    explanation: "Ayam adalah hewan ovipar (bertelur).",
    tags: ["ipa", "hewan", "reproduksi"],
    subject: "IPA",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-IPA-HEWAN-01",
    question: "Metamorfosis pada kupu-kupu berurutan: telur - ... - kepompong - kupu-kupu",
    type: "multiple-choice",
    options: ["Ulat", "Larva", "Nimfa", "Pupa"],
    correctAnswer: "Ulat",
    difficulty: "mudah",
    hints: [
      "Tahap setelah telur",
      "Bentuknya seperti cacing"
    ],
    explanation: "Urutan metamorfosis kupu-kupu: telur → ulat → kepompong → kupu-kupu.",
    tags: ["ipa", "hewan", "metamorfosis"],
    subject: "IPA",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-IPA-HEWAN-01",
    question: "Hewan yang hidup di dua alam (air dan darat) disebut...",
    type: "multiple-choice",
    options: ["Amfibi", "Reptil", "Mamalia", "Aves"],
    correctAnswer: "Amfibi",
    difficulty: "mudah",
    hints: [
      "Contohnya katak",
      "Amfi = dua"
    ],
    explanation: "Amfibi adalah hewan yang dapat hidup di air dan darat, contoh: katak.",
    tags: ["ipa", "hewan", "klasifikasi"],
    subject: "IPA",
    gradeLevel: "SD"
  },

  // Energi (10 questions)
  {
    topicCode: "SD-IPA-ENERGI-01",
    question: "Sumber energi terbesar di bumi adalah...",
    type: "multiple-choice",
    options: ["Matahari", "Air", "Angin", "Batubara"],
    correctAnswer: "Matahari",
    difficulty: "mudah",
    hints: [
      "Memberikan cahaya dan panas",
      "Ada di langit"
    ],
    explanation: "Matahari adalah sumber energi terbesar yang memberikan cahaya dan panas.",
    tags: ["ipa", "energi", "sumber-energi"],
    subject: "IPA",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-IPA-ENERGI-01",
    question: "Benda yang dapat menghasilkan cahaya sendiri disebut...",
    type: "multiple-choice",
    options: ["Sumber cahaya", "Cermin", "Bayangan", "Lensa"],
    correctAnswer: "Sumber cahaya",
    difficulty: "mudah",
    hints: [
      "Contoh: matahari, lampu",
      "Tidak memantulkan, tapi memancarkan"
    ],
    explanation: "Sumber cahaya adalah benda yang memancarkan cahaya sendiri, seperti matahari dan lampu.",
    tags: ["ipa", "energi", "cahaya"],
    subject: "IPA",
    gradeLevel: "SD"
  }
];

export const sdIndonesianQuestions = [
  // Membaca (10 questions)
  {
    topicCode: "SD-BIND-MEMBACA-01",
    question: "Kata 'berlari' terdiri dari... suku kata",
    type: "multiple-choice",
    options: ["3", "2", "4", "5"],
    correctAnswer: "3",
    difficulty: "mudah",
    hints: [
      "Pisahkan per suku kata",
      "ber-la-ri"
    ],
    explanation: "Kata 'berlari' memiliki 3 suku kata: ber-la-ri.",
    tags: ["bahasa-indonesia", "suku-kata"],
    subject: "Bahasa Indonesia",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-BIND-MEMBACA-01",
    question: "Huruf kapital digunakan pada...",
    type: "multiple-choice",
    options: [
      "Awal kalimat dan nama orang",
      "Setiap kata",
      "Akhir kalimat",
      "Kata kerja saja"
    ],
    correctAnswer: "Awal kalimat dan nama orang",
    difficulty: "mudah",
    hints: [
      "Juga untuk nama tempat",
      "Aturan penulisan"
    ],
    explanation: "Huruf kapital digunakan di awal kalimat, nama orang, nama tempat, dll.",
    tags: ["bahasa-indonesia", "ejaan"],
    subject: "Bahasa Indonesia",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-BIND-MEMBACA-01",
    question: "Bacalah: 'Andi suka bermain bola. Setiap sore ia berlatih.' Andi suka bermain...",
    type: "multiple-choice",
    options: ["Bola", "Layang-layang", "Kelereng", "Petak umpet"],
    correctAnswer: "Bola",
    difficulty: "mudah",
    hints: [
      "Lihat kalimat pertama",
      "Apa yang disebutkan?"
    ],
    explanation: "Teks menyebutkan 'Andi suka bermain bola.'",
    tags: ["bahasa-indonesia", "membaca", "pemahaman"],
    subject: "Bahasa Indonesia",
    gradeLevel: "SD"
  },

  // Menulis (10 questions)
  {
    topicCode: "SD-BIND-MENULIS-01",
    question: "Tanda baca yang benar untuk akhir kalimat berita adalah...",
    type: "multiple-choice",
    options: ["Titik (.)", "Tanda tanya (?)", "Tanda seru (!)", "Koma (,)"],
    correctAnswer: "Titik (.)",
    difficulty: "mudah",
    hints: [
      "Kalimat biasa",
      "Bukan pertanyaan atau perintah"
    ],
    explanation: "Kalimat berita diakhiri dengan titik (.).",
    tags: ["bahasa-indonesia", "tanda-baca"],
    subject: "Bahasa Indonesia",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-BIND-MENULIS-01",
    question: "Kalimat yang benar adalah...",
    type: "multiple-choice",
    options: [
      "Ibu pergi ke pasar.",
      "ibu pergi ke pasar",
      "Ibu pergi ke pasar",
      "ibu pergi ke pasar."
    ],
    correctAnswer: "Ibu pergi ke pasar.",
    difficulty: "mudah",
    hints: [
      "Huruf kapital di awal",
      "Titik di akhir"
    ],
    explanation: "Kalimat yang benar dimulai dengan huruf kapital dan diakhiri titik.",
    tags: ["bahasa-indonesia", "ejaan", "kalimat"],
    subject: "Bahasa Indonesia",
    gradeLevel: "SD"
  }
];

export const sdCivicQuestions = [
  // Pancasila (10 questions)
  {
    topicCode: "SD-PKN-PANCASILA-01",
    question: "Sila pertama Pancasila adalah...",
    type: "multiple-choice",
    options: [
      "Ketuhanan Yang Maha Esa",
      "Kemanusiaan yang adil dan beradab",
      "Persatuan Indonesia",
      "Kerakyatan"
    ],
    correctAnswer: "Ketuhanan Yang Maha Esa",
    difficulty: "mudah",
    hints: [
      "Sila pertama tentang agama",
      "Lambangnya bintang"
    ],
    explanation: "Sila pertama Pancasila: Ketuhanan Yang Maha Esa, lambang bintang.",
    tags: ["pkn", "pancasila", "sila"],
    subject: "PKn",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-PKN-PANCASILA-01",
    question: "Lambang sila kedua Pancasila adalah...",
    type: "multiple-choice",
    options: ["Rantai", "Pohon beringin", "Kepala banteng", "Padi dan kapas"],
    correctAnswer: "Rantai",
    difficulty: "mudah",
    hints: [
      "Sila kedua: Kemanusiaan",
      "Melambangkan persaudaraan"
    ],
    explanation: "Lambang sila kedua (Kemanusiaan yang adil dan beradab) adalah rantai.",
    tags: ["pkn", "pancasila", "lambang"],
    subject: "PKn",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-PKN-PANCASILA-01",
    question: "Berapa jumlah sila dalam Pancasila?",
    type: "multiple-choice",
    options: ["5", "4", "6", "7"],
    correctAnswer: "5",
    difficulty: "mudah",
    hints: [
      "Panca artinya lima",
      "Lima dasar negara"
    ],
    explanation: "Pancasila memiliki 5 sila (panca = lima).",
    tags: ["pkn", "pancasila", "dasar"],
    subject: "PKn",
    gradeLevel: "SD"
  },

  // Norma dan Aturan (10 questions)
  {
    topicCode: "SD-PKN-NORMA-01",
    question: "Aturan yang berlaku di sekolah disebut...",
    type: "multiple-choice",
    options: ["Tata tertib sekolah", "UUD", "Peraturan negara", "Hukum"],
    correctAnswer: "Tata tertib sekolah",
    difficulty: "mudah",
    hints: [
      "Khusus untuk siswa",
      "Mengatur perilaku di sekolah"
    ],
    explanation: "Tata tertib sekolah adalah aturan yang berlaku di sekolah.",
    tags: ["pkn", "norma", "aturan"],
    subject: "PKn",
    gradeLevel: "SD"
  },
  {
    topicCode: "SD-PKN-NORMA-01",
    question: "Contoh sikap tertib di jalan raya adalah...",
    type: "multiple-choice",
    options: [
      "Menyeberang di zebra cross",
      "Berlari di jalan",
      "Main di tengah jalan",
      "Tidak melihat rambu"
    ],
    correctAnswer: "Menyeberang di zebra cross",
    difficulty: "mudah",
    hints: [
      "Tempat penyeberangan",
      "Garis putih di jalan"
    ],
    explanation: "Tertib di jalan: menyeberang di tempat yang aman seperti zebra cross.",
    tags: ["pkn", "norma", "ketertiban"],
    subject: "PKn",
    gradeLevel: "SD"
  }
];

// Export all SD questions
export const allSDQuestions = {
  math: sdMathQuestions,
  science: sdScienceQuestions,
  indonesian: sdIndonesianQuestions,
  civic: sdCivicQuestions
};

export default allSDQuestions;
