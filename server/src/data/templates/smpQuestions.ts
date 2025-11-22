/**
 * SMP-Level Quiz Questions (Grade 7-9)
 * Matematika, IPA, Bahasa Indonesia, Bahasa Inggris
 * Difficulty: mudah to sedang
 */

export const smpMathQuestions = [
  // Bilangan Bulat (15 questions)
  {
    topicCode: "SMP-MTK-BILBULAT-01",
    question: "Hasil dari -15 + 23 adalah...",
    type: "multiple-choice",
    options: ["8", "-8", "38", "-38"],
    correctAnswer: "8",
    difficulty: "mudah",
    hints: [
      "Ingat: bilangan negatif + bilangan positif",
      "23 - 15 = ?"
    ],
    explanation: "Saat menjumlahkan bilangan negatif dengan positif, kita mengurangi nilai absolutnya. 23 - 15 = 8.",
    tags: ["bilangan-bulat", "operasi-hitung"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-BILBULAT-01",
    question: "Berapakah hasil dari (-8) × (-5)?",
    type: "multiple-choice",
    options: ["40", "-40", "13", "-13"],
    correctAnswer: "40",
    difficulty: "mudah",
    hints: [
      "Negatif × negatif = ?",
      "Ingat aturan perkalian bilangan bulat"
    ],
    explanation: "Perkalian dua bilangan negatif menghasilkan bilangan positif. (-8) × (-5) = 40.",
    tags: ["bilangan-bulat", "perkalian"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-BILBULAT-01",
    question: "Urutan bilangan dari terkecil ke terbesar: -12, 5, -3, 0, 8",
    type: "multiple-choice",
    options: [
      "-12, -3, 0, 5, 8",
      "8, 5, 0, -3, -12",
      "-3, -12, 0, 5, 8",
      "-12, 0, -3, 5, 8"
    ],
    correctAnswer: "-12, -3, 0, 5, 8",
    difficulty: "mudah",
    hints: [
      "Bilangan negatif lebih kecil dari nol",
      "Semakin besar nilai negatif, semakin kecil bilangannya"
    ],
    explanation: "Pada garis bilangan, -12 paling kiri (terkecil), lalu -3, 0, 5, dan 8 paling kanan (terbesar).",
    tags: ["bilangan-bulat", "urutan"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-BILBULAT-01",
    question: "Hasil dari 36 : (-9) = ...",
    type: "multiple-choice",
    options: ["-4", "4", "-27", "27"],
    correctAnswer: "-4",
    difficulty: "mudah",
    hints: [
      "Positif : negatif = ?",
      "36 dibagi 9 = 4, tapi ada tanda negatif"
    ],
    explanation: "Pembagian bilangan positif dengan negatif menghasilkan negatif. 36 : (-9) = -4.",
    tags: ["bilangan-bulat", "pembagian"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-BILBULAT-01",
    question: "Suhu di Bandung pagi hari 18°C. Siang hari naik 7°C, malam turun 12°C. Suhu malam adalah...",
    type: "multiple-choice",
    options: ["13°C", "25°C", "37°C", "3°C"],
    correctAnswer: "13°C",
    difficulty: "sedang",
    hints: [
      "Mulai dari 18°C",
      "Tambah 7, lalu kurangi 12"
    ],
    explanation: "18 + 7 = 25°C (siang). 25 - 12 = 13°C (malam).",
    tags: ["bilangan-bulat", "aplikasi", "suhu"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },

  // Pecahan (15 questions)
  {
    topicCode: "SMP-MTK-PECAHAN-01",
    question: "Hasil dari 2/5 + 1/5 adalah...",
    type: "multiple-choice",
    options: ["3/5", "3/10", "2/10", "1/5"],
    correctAnswer: "3/5",
    difficulty: "mudah",
    hints: [
      "Penyebutnya sama",
      "Tinggal jumlahkan pembilangnya"
    ],
    explanation: "Pecahan dengan penyebut sama: 2/5 + 1/5 = (2+1)/5 = 3/5.",
    tags: ["pecahan", "penjumlahan"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-PECAHAN-01",
    question: "Bentuk sederhana dari 12/18 adalah...",
    type: "multiple-choice",
    options: ["2/3", "3/4", "4/6", "6/9"],
    correctAnswer: "2/3",
    difficulty: "mudah",
    hints: [
      "Cari FPB dari 12 dan 18",
      "Bagi pembilang dan penyebut dengan FPB"
    ],
    explanation: "FPB(12, 18) = 6. Maka 12/18 = (12÷6)/(18÷6) = 2/3.",
    tags: ["pecahan", "penyederhanaan"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-PECAHAN-01",
    question: "3/4 × 2/5 = ...",
    type: "multiple-choice",
    options: ["6/20", "5/9", "3/10", "6/9"],
    correctAnswer: "6/20",
    difficulty: "mudah",
    hints: [
      "Kalikan pembilang dengan pembilang",
      "Kalikan penyebut dengan penyebut"
    ],
    explanation: "3/4 × 2/5 = (3×2)/(4×5) = 6/20 (bisa disederhanakan menjadi 3/10).",
    tags: ["pecahan", "perkalian"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-PECAHAN-01",
    question: "2 1/4 + 1 3/4 = ...",
    type: "multiple-choice",
    options: ["4", "3 1/2", "3 4/8", "4 1/2"],
    correctAnswer: "4",
    difficulty: "sedang",
    hints: [
      "Ubah ke pecahan biasa dulu",
      "Atau jumlahkan bilangan bulat dan pecahannya terpisah"
    ],
    explanation: "2 + 1 = 3, lalu 1/4 + 3/4 = 4/4 = 1. Total: 3 + 1 = 4.",
    tags: ["pecahan", "pecahan-campuran"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-PECAHAN-01",
    question: "Seorang petani memiliki 3/4 hektar sawah. Ia menjual 1/3 bagian. Berapa hektar yang tersisa?",
    type: "multiple-choice",
    options: ["1/2 hektar", "5/12 hektar", "2/3 hektar", "1/4 hektar"],
    correctAnswer: "1/2 hektar",
    difficulty: "sedang",
    hints: [
      "Hitung 1/3 dari 3/4 = 1/3 × 3/4",
      "Kurangi dari 3/4"
    ],
    explanation: "Dijual: 1/3 × 3/4 = 3/12 = 1/4. Tersisa: 3/4 - 1/4 = 2/4 = 1/2 hektar.",
    tags: ["pecahan", "aplikasi", "soal-cerita"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },

  // Aljabar Dasar (20 questions)
  {
    topicCode: "SMP-MTK-ALJABAR-01",
    question: "Jika x = 5, maka nilai dari 3x + 7 adalah...",
    type: "multiple-choice",
    options: ["22", "15", "37", "18"],
    correctAnswer: "22",
    difficulty: "mudah",
    hints: [
      "Ganti x dengan 5",
      "3 × 5 + 7 = ?"
    ],
    explanation: "3x + 7 = 3(5) + 7 = 15 + 7 = 22.",
    tags: ["aljabar", "substitusi"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-ALJABAR-01",
    question: "Sederhanakan: 5a + 3a - 2a",
    type: "multiple-choice",
    options: ["6a", "10a", "8a", "4a"],
    correctAnswer: "6a",
    difficulty: "mudah",
    hints: [
      "Jumlahkan koefisien yang sama",
      "5 + 3 - 2 = ?"
    ],
    explanation: "Variabel sama, tinggal operasikan koefisiennya: (5 + 3 - 2)a = 6a.",
    tags: ["aljabar", "penyederhanaan"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-ALJABAR-01",
    question: "Selesaikan: x + 8 = 15",
    type: "multiple-choice",
    options: ["x = 7", "x = 23", "x = -7", "x = 8"],
    correctAnswer: "x = 7",
    difficulty: "mudah",
    hints: [
      "Pindahkan 8 ke ruas kanan",
      "x = 15 - 8"
    ],
    explanation: "x + 8 = 15, maka x = 15 - 8 = 7.",
    tags: ["aljabar", "persamaan-linear"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-ALJABAR-01",
    question: "Hasil dari 4(2x - 3) adalah...",
    type: "multiple-choice",
    options: ["8x - 12", "6x - 7", "8x - 3", "2x - 12"],
    correctAnswer: "8x - 12",
    difficulty: "sedang",
    hints: [
      "Gunakan sifat distributif",
      "4 × 2x dan 4 × (-3)"
    ],
    explanation: "4(2x - 3) = 4(2x) + 4(-3) = 8x - 12.",
    tags: ["aljabar", "distributif"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-ALJABAR-01",
    question: "Jika 3x = 21, maka x = ...",
    type: "multiple-choice",
    options: ["7", "18", "24", "3"],
    correctAnswer: "7",
    difficulty: "mudah",
    hints: [
      "Bagi kedua ruas dengan 3",
      "x = 21 ÷ 3"
    ],
    explanation: "3x = 21, maka x = 21/3 = 7.",
    tags: ["aljabar", "persamaan"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },

  // Geometri Dasar (20 questions)
  {
    topicCode: "SMP-MTK-GEOMETRI-01",
    question: "Keliling persegi dengan sisi 7 cm adalah...",
    type: "multiple-choice",
    options: ["28 cm", "49 cm", "14 cm", "21 cm"],
    correctAnswer: "28 cm",
    difficulty: "mudah",
    hints: [
      "Keliling persegi = 4 × sisi",
      "4 × 7 = ?"
    ],
    explanation: "K = 4s = 4 × 7 = 28 cm.",
    tags: ["geometri", "keliling", "persegi"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-GEOMETRI-01",
    question: "Luas persegi panjang dengan panjang 12 cm dan lebar 5 cm adalah...",
    type: "multiple-choice",
    options: ["60 cm²", "34 cm²", "17 cm²", "120 cm²"],
    correctAnswer: "60 cm²",
    difficulty: "mudah",
    hints: [
      "Luas = panjang × lebar",
      "12 × 5 = ?"
    ],
    explanation: "L = p × l = 12 × 5 = 60 cm².",
    tags: ["geometri", "luas", "persegi-panjang"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-GEOMETRI-01",
    question: "Jumlah sudut dalam segitiga adalah...",
    type: "multiple-choice",
    options: ["180°", "360°", "90°", "270°"],
    correctAnswer: "180°",
    difficulty: "mudah",
    hints: [
      "Ini adalah teorema dasar segitiga",
      "Coba gambar segitiga dan ukur sudutnya"
    ],
    explanation: "Jumlah ketiga sudut dalam segitiga selalu 180°.",
    tags: ["geometri", "segitiga", "sudut"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-GEOMETRI-01",
    question: "Luas lingkaran dengan jari-jari 7 cm adalah... (π = 22/7)",
    type: "multiple-choice",
    options: ["154 cm²", "44 cm²", "308 cm²", "22 cm²"],
    correctAnswer: "154 cm²",
    difficulty: "sedang",
    hints: [
      "Luas = πr²",
      "22/7 × 7 × 7 = ?"
    ],
    explanation: "L = πr² = 22/7 × 7² = 22/7 × 49 = 154 cm².",
    tags: ["geometri", "lingkaran", "luas"],
    subject: "Matematika",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-MTK-GEOMETRI-01",
    question: "Sebuah lapangan berbentuk persegi panjang dengan panjang 50 m dan lebar 30 m. Berapa kelilingnya?",
    type: "multiple-choice",
    options: ["160 m", "1500 m", "80 m", "100 m"],
    correctAnswer: "160 m",
    difficulty: "sedang",
    hints: [
      "Keliling = 2(p + l)",
      "2(50 + 30) = ?"
    ],
    explanation: "K = 2(p + l) = 2(50 + 30) = 2(80) = 160 m.",
    tags: ["geometri", "keliling", "aplikasi"],
    subject: "Matematika",
    gradeLevel: "SMP"
  }
];

export const smpScienceQuestions = [
  // Fisika - Gerak (15 questions)
  {
    topicCode: "SMP-IPA-GERAK-01",
    question: "Satuan SI untuk kecepatan adalah...",
    type: "multiple-choice",
    options: ["m/s", "km/jam", "cm/s", "m/jam"],
    correctAnswer: "m/s",
    difficulty: "mudah",
    hints: [
      "SI = Sistem Internasional",
      "Meter per detik"
    ],
    explanation: "Satuan SI untuk kecepatan adalah meter per sekon (m/s).",
    tags: ["fisika", "gerak", "satuan"],
    subject: "IPA",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-IPA-GERAK-01",
    question: "Sebuah mobil menempuh jarak 120 km dalam waktu 2 jam. Kecepatan rata-ratanya adalah...",
    type: "multiple-choice",
    options: ["60 km/jam", "240 km/jam", "120 km/jam", "30 km/jam"],
    correctAnswer: "60 km/jam",
    difficulty: "mudah",
    hints: [
      "Kecepatan = jarak / waktu",
      "120 km ÷ 2 jam = ?"
    ],
    explanation: "v = s/t = 120 km / 2 jam = 60 km/jam.",
    tags: ["fisika", "gerak", "kecepatan"],
    subject: "IPA",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-IPA-GERAK-01",
    question: "Contoh gerak lurus berubah beraturan adalah...",
    type: "multiple-choice",
    options: [
      "Bola yang jatuh bebas",
      "Mobil dengan kecepatan tetap",
      "Kipas angin yang berputar",
      "Lampu berkedip"
    ],
    correctAnswer: "Bola yang jatuh bebas",
    difficulty: "sedang",
    hints: [
      "GLBB = percepatan konstan",
      "Gravitasi menyebabkan percepatan"
    ],
    explanation: "Bola jatuh bebas mengalami percepatan gravitasi yang konstan (GLBB).",
    tags: ["fisika", "gerak", "GLBB"],
    subject: "IPA",
    gradeLevel: "SMP"
  },

  // Biologi - Klasifikasi Makhluk Hidup (15 questions)
  {
    topicCode: "SMP-IPA-KLASIFIKASI-01",
    question: "Urutan tingkatan takson dari yang tertinggi adalah...",
    type: "multiple-choice",
    options: [
      "Kingdom - Filum - Kelas - Ordo - Famili - Genus - Spesies",
      "Spesies - Genus - Famili - Ordo - Kelas - Filum - Kingdom",
      "Kingdom - Kelas - Filum - Ordo - Famili - Genus - Spesies",
      "Filum - Kingdom - Kelas - Ordo - Famili - Genus - Spesies"
    ],
    correctAnswer: "Kingdom - Filum - Kelas - Ordo - Famili - Genus - Spesies",
    difficulty: "sedang",
    hints: [
      "Ingat: Kerajaan Fir Kelasnya Orang Famili Guru Spesial",
      "Kingdom paling luas"
    ],
    explanation: "Urutan takson: Kingdom (kerajaan), Filum, Kelas, Ordo, Famili, Genus, Spesies.",
    tags: ["biologi", "klasifikasi", "taksonomi"],
    subject: "IPA",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-IPA-KLASIFIKASI-01",
    question: "Tumbuhan yang berkembang biak dengan spora termasuk kelompok...",
    type: "multiple-choice",
    options: ["Pteridophyta", "Angiospermae", "Gymnospermae", "Bryophyta"],
    correctAnswer: "Pteridophyta",
    difficulty: "sedang",
    hints: [
      "Paku-pakuan berkembang biak dengan spora",
      "Pteridophyta = tumbuhan paku"
    ],
    explanation: "Pteridophyta (tumbuhan paku) berkembang biak dengan spora.",
    tags: ["biologi", "klasifikasi", "tumbuhan"],
    subject: "IPA",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-IPA-KLASIFIKASI-01",
    question: "Ciri khas kingdom Fungi adalah...",
    type: "multiple-choice",
    options: [
      "Tidak berklorofil dan bersifat heterotrof",
      "Berklorofil dan autotrof",
      "Bergerak aktif",
      "Memiliki tulang belakang"
    ],
    correctAnswer: "Tidak berklorofil dan bersifat heterotrof",
    difficulty: "mudah",
    hints: [
      "Fungi = jamur",
      "Tidak bisa fotosintesis"
    ],
    explanation: "Fungi (jamur) tidak memiliki klorofil sehingga tidak dapat berfotosintesis (heterotrof).",
    tags: ["biologi", "klasifikasi", "fungi"],
    subject: "IPA",
    gradeLevel: "SMP"
  },

  // Energi dan Perubahannya (15 questions)
  {
    topicCode: "SMP-IPA-ENERGI-01",
    question: "Energi yang tersimpan dalam makanan adalah...",
    type: "multiple-choice",
    options: ["Energi kimia", "Energi panas", "Energi listrik", "Energi kinetik"],
    correctAnswer: "Energi kimia",
    difficulty: "mudah",
    hints: [
      "Energi tersimpan dalam ikatan kimia",
      "Dilepaskan saat makanan dicerna"
    ],
    explanation: "Makanan menyimpan energi kimia dalam ikatan molekulnya.",
    tags: ["fisika", "energi", "kimia"],
    subject: "IPA",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-IPA-ENERGI-01",
    question: "Hukum kekekalan energi menyatakan bahwa...",
    type: "multiple-choice",
    options: [
      "Energi tidak dapat diciptakan atau dimusnahkan, hanya berubah bentuk",
      "Energi selalu bertambah",
      "Energi selalu berkurang",
      "Energi dapat diciptakan dari kehampaan"
    ],
    correctAnswer: "Energi tidak dapat diciptakan atau dimusnahkan, hanya berubah bentuk",
    difficulty: "sedang",
    hints: [
      "Energi kekal (konstan)",
      "Hanya bentuknya yang berubah"
    ],
    explanation: "Hukum kekekalan energi: energi total dalam sistem tertutup tetap konstan, hanya berubah bentuk.",
    tags: ["fisika", "energi", "hukum"],
    subject: "IPA",
    gradeLevel: "SMP"
  },

  // Ekosistem (15 questions)
  {
    topicCode: "SMP-IPA-EKOSISTEM-01",
    question: "Komponen biotik dalam ekosistem adalah...",
    type: "multiple-choice",
    options: [
      "Tumbuhan, hewan, dan mikroorganisme",
      "Air, udara, dan tanah",
      "Cahaya matahari dan suhu",
      "Batu dan mineral"
    ],
    correctAnswer: "Tumbuhan, hewan, dan mikroorganisme",
    difficulty: "mudah",
    hints: [
      "Biotik = makhluk hidup",
      "Abiotik = benda mati"
    ],
    explanation: "Komponen biotik adalah semua makhluk hidup dalam ekosistem.",
    tags: ["biologi", "ekosistem", "komponen"],
    subject: "IPA",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-IPA-EKOSISTEM-01",
    question: "Rantai makanan dimulai dari...",
    type: "multiple-choice",
    options: ["Produsen", "Konsumen I", "Konsumen II", "Dekomposer"],
    correctAnswer: "Produsen",
    difficulty: "mudah",
    hints: [
      "Produsen = tumbuhan hijau",
      "Yang bisa berfotosintesis"
    ],
    explanation: "Rantai makanan selalu dimulai dari produsen (tumbuhan) yang dapat membuat makanan sendiri melalui fotosintesis.",
    tags: ["biologi", "ekosistem", "rantai-makanan"],
    subject: "IPA",
    gradeLevel: "SMP"
  }
];

export const smpIndonesianQuestions = [
  // Tata Bahasa (10 questions)
  {
    topicCode: "SMP-BIND-TATABAHASA-01",
    question: "Kalimat yang menggunakan kata kerja aktif adalah...",
    type: "multiple-choice",
    options: [
      "Adik membaca buku cerita",
      "Buku cerita dibaca adik",
      "Cerita itu dibaca oleh adik",
      "Dibaca oleh adik buku itu"
    ],
    correctAnswer: "Adik membaca buku cerita",
    difficulty: "mudah",
    hints: [
      "Aktif: subjek melakukan aksi",
      "Pasif: subjek dikenai aksi"
    ],
    explanation: "Kalimat aktif: subjek (adik) melakukan pekerjaan (membaca).",
    tags: ["bahasa-indonesia", "kalimat", "aktif-pasif"],
    subject: "Bahasa Indonesia",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-BIND-TATABAHASA-01",
    question: "Kata benda (nomina) dalam kalimat 'Ibu memasak sayur di dapur' adalah...",
    type: "multiple-choice",
    options: ["Ibu, sayur, dapur", "Memasak, di", "Ibu, memasak", "Sayur, di, dapur"],
    correctAnswer: "Ibu, sayur, dapur",
    difficulty: "mudah",
    hints: [
      "Kata benda = nomina",
      "Memasak adalah kata kerja"
    ],
    explanation: "Nomina (kata benda): Ibu, sayur, dapur. Memasak adalah verba (kata kerja).",
    tags: ["bahasa-indonesia", "kata-benda", "kelas-kata"],
    subject: "Bahasa Indonesia",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-BIND-TATABAHASA-01",
    question: "Ubah kalimat aktif 'Ani menulis surat' menjadi kalimat pasif...",
    type: "multiple-choice",
    options: [
      "Surat ditulis oleh Ani",
      "Ani ditulis surat",
      "Menulis surat Ani",
      "Surat menulis Ani"
    ],
    correctAnswer: "Surat ditulis oleh Ani",
    difficulty: "sedang",
    hints: [
      "Objek menjadi subjek",
      "Kata kerja ditambah 'di-'"
    ],
    explanation: "Kalimat pasif: objek (surat) menjadi subjek, kata kerja berubah (menulis → ditulis).",
    tags: ["bahasa-indonesia", "transformasi-kalimat"],
    subject: "Bahasa Indonesia",
    gradeLevel: "SMP"
  },

  // Membaca Pemahaman (10 questions)
  {
    topicCode: "SMP-BIND-MEMBACA-01",
    question: "Bacalah: 'Pendidikan adalah investasi masa depan. Dengan pendidikan, seseorang dapat meningkatkan kualitas hidupnya.' Ide pokok paragraf tersebut adalah...",
    type: "multiple-choice",
    options: [
      "Pentingnya pendidikan untuk masa depan",
      "Investasi yang menguntungkan",
      "Kualitas hidup yang baik",
      "Seseorang harus belajar"
    ],
    correctAnswer: "Pentingnya pendidikan untuk masa depan",
    difficulty: "mudah",
    hints: [
      "Ide pokok = gagasan utama",
      "Biasanya di awal paragraf"
    ],
    explanation: "Ide pokok: pentingnya pendidikan sebagai investasi masa depan.",
    tags: ["bahasa-indonesia", "membaca", "ide-pokok"],
    subject: "Bahasa Indonesia",
    gradeLevel: "SMP"
  },

  // Menulis (10 questions)
  {
    topicCode: "SMP-BIND-MENULIS-01",
    question: "Kalimat yang menggunakan tanda baca dengan benar adalah...",
    type: "multiple-choice",
    options: [
      "Ibu berkata, \"Jangan lupa belajar!\"",
      "Ibu berkata \"Jangan lupa belajar!\"",
      "Ibu berkata, Jangan lupa belajar!",
      "\"Ibu berkata, Jangan lupa belajar!\""
    ],
    correctAnswer: "Ibu berkata, \"Jangan lupa belajar!\"",
    difficulty: "mudah",
    hints: [
      "Gunakan koma sebelum kutipan langsung",
      "Tanda seru di dalam tanda kutip"
    ],
    explanation: "Kutipan langsung diawali koma, lalu tanda kutip.",
    tags: ["bahasa-indonesia", "tanda-baca", "ejaan"],
    subject: "Bahasa Indonesia",
    gradeLevel: "SMP"
  }
];

export const smpEnglishQuestions = [
  // Grammar (15 questions)
  {
    topicCode: "SMP-ENG-GRAMMAR-01",
    question: "Choose the correct verb: She _____ to school every day.",
    type: "multiple-choice",
    options: ["goes", "go", "going", "gone"],
    correctAnswer: "goes",
    difficulty: "mudah",
    hints: [
      "Subject 'she' is third person singular",
      "Present simple tense"
    ],
    explanation: "For third person singular (she/he/it) in present simple, add -s or -es to the verb.",
    tags: ["english", "grammar", "present-tense"],
    subject: "Bahasa Inggris",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-ENG-GRAMMAR-01",
    question: "What is the past tense of 'eat'?",
    type: "multiple-choice",
    options: ["ate", "eated", "eaten", "eats"],
    correctAnswer: "ate",
    difficulty: "mudah",
    hints: [
      "Irregular verb",
      "Not 'eated'"
    ],
    explanation: "'Eat' is an irregular verb. Past tense: ate, Past participle: eaten.",
    tags: ["english", "grammar", "irregular-verbs"],
    subject: "Bahasa Inggris",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-ENG-GRAMMAR-01",
    question: "Complete: I _____ studying when you called me.",
    type: "multiple-choice",
    options: ["was", "am", "is", "were"],
    correctAnswer: "was",
    difficulty: "sedang",
    hints: [
      "Past continuous tense",
      "Subject 'I' requires 'was'"
    ],
    explanation: "Past continuous: I/he/she/it + was + verb-ing, You/we/they + were + verb-ing.",
    tags: ["english", "grammar", "past-continuous"],
    subject: "Bahasa Inggris",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-ENG-GRAMMAR-01",
    question: "Which sentence is correct?",
    type: "multiple-choice",
    options: [
      "She is taller than her sister.",
      "She is more tall than her sister.",
      "She is tall than her sister.",
      "She is taller as her sister."
    ],
    correctAnswer: "She is taller than her sister.",
    difficulty: "sedang",
    hints: [
      "Comparative form of 'tall'",
      "One syllable adjective: add -er"
    ],
    explanation: "Short adjectives (1 syllable): add -er for comparative. Tall → taller.",
    tags: ["english", "grammar", "comparative"],
    subject: "Bahasa Inggris",
    gradeLevel: "SMP"
  },

  // Vocabulary (15 questions)
  {
    topicCode: "SMP-ENG-VOCAB-01",
    question: "What is the opposite of 'hot'?",
    type: "multiple-choice",
    options: ["cold", "warm", "cool", "freezing"],
    correctAnswer: "cold",
    difficulty: "mudah",
    hints: [
      "Antonym of hot",
      "Very low temperature"
    ],
    explanation: "Hot (panas) ↔ Cold (dingin) are antonyms.",
    tags: ["english", "vocabulary", "antonyms"],
    subject: "Bahasa Inggris",
    gradeLevel: "SMP"
  },
  {
    topicCode: "SMP-ENG-VOCAB-01",
    question: "A person who teaches students is called a _____.",
    type: "multiple-choice",
    options: ["teacher", "doctor", "farmer", "driver"],
    correctAnswer: "teacher",
    difficulty: "mudah",
    hints: [
      "Works in a school",
      "Helps students learn"
    ],
    explanation: "Teacher = guru, someone who educates students.",
    tags: ["english", "vocabulary", "professions"],
    subject: "Bahasa Inggris",
    gradeLevel: "SMP"
  },

  // Reading (10 questions)
  {
    topicCode: "SMP-ENG-READING-01",
    question: "Read: 'Tom likes playing football. He plays every Saturday with his friends.' What does Tom like?",
    type: "multiple-choice",
    options: ["Playing football", "Playing basketball", "Swimming", "Reading"],
    correctAnswer: "Playing football",
    difficulty: "mudah",
    hints: [
      "Look at the first sentence",
      "What sport is mentioned?"
    ],
    explanation: "The text clearly states 'Tom likes playing football.'",
    tags: ["english", "reading", "comprehension"],
    subject: "Bahasa Inggris",
    gradeLevel: "SMP"
  }
];

// Export all SMP questions
export const allSMPQuestions = {
  math: smpMathQuestions,
  science: smpScienceQuestions,
  indonesian: smpIndonesianQuestions,
  english: smpEnglishQuestions
};

export default allSMPQuestions;
