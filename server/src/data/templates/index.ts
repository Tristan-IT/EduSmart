/**
 * Template Question Bank - Index
 * Centralized export for all quiz templates across subjects and grade levels
 */

// SMA Math templates
import { algebraQuestions, geometryQuestions } from "./mathQuestions";
import {
  trigonometryQuestions,
  calculusQuestions,
  statisticsQuestions,
  probabilityQuestions,
} from "./mathQuestionsPart2";

// SMA Science templates
import { physicsTemplates } from "./physicsQuestions";
import { chemistryTemplates, biologyTemplates } from "./scienceQuestions";

// SMA Language templates
import { indonesianTemplates, englishTemplates } from "./languageQuestions";

// SMA Social studies templates
import {
  historyTemplates,
  geographyTemplates,
  economicsTemplates,
  sociologyTemplates,
} from "./socialQuestions";

// SMP templates
import {
  smpMathQuestions,
  smpScienceQuestions,
  smpIndonesianQuestions,
  smpEnglishQuestions,
} from "./smpQuestions";

// SD templates
import {
  sdMathQuestions,
  sdScienceQuestions,
  sdIndonesianQuestions,
  sdCivicQuestions,
} from "./sdQuestions";

// ============================================
// SMA TEMPLATES (164 questions)
// ============================================
export const mathTemplates = [
  algebraQuestions, // 20 questions
  geometryQuestions, // 12 questions
  trigonometryQuestions, // 20 questions
  calculusQuestions, // 20 questions
  statisticsQuestions, // 15 questions
  probabilityQuestions, // 20 questions
];

// ============================================
// SMP TEMPLATES (~110 questions)
// ============================================
export const smpTemplates = {
  math: smpMathQuestions, // ~50 questions (Bilangan Bulat, Pecahan, Aljabar, Geometri)
  science: smpScienceQuestions, // ~60 questions (Gerak, Klasifikasi, Energi, Ekosistem)
  indonesian: smpIndonesianQuestions, // ~20 questions (Tata Bahasa, Membaca, Menulis)
  english: smpEnglishQuestions, // ~40 questions (Grammar, Vocabulary, Reading)
};

// ============================================
// SD TEMPLATES (~70 questions)
// ============================================
export const sdTemplates = {
  math: sdMathQuestions, // ~50 questions (Tambah Kurang, Kali Bagi, Pecahan, Bangun Datar)
  science: sdScienceQuestions, // ~40 questions (Tubuh, Tumbuhan, Hewan, Energi)
  indonesian: sdIndonesianQuestions, // ~20 questions (Membaca, Menulis)
  civic: sdCivicQuestions, // ~20 questions (Pancasila, Norma)
};

// ============================================
// ALL TEMPLATES SUMMARY
// ============================================
// SMA: 164 questions
//   Math: 107 questions
//     - Aljabar (persamaan linear, kuadrat, eksponen, logaritma)
//     - Geometri (bangun datar, bangun ruang, pythagoras)
//     - Trigonometri (sudut, identitas, grafik, persamaan)
//     - Kalkulus (limit, turunan, integral)
//     - Statistika (mean, median, modus, kuartil, variansi)
//     - Peluang (permutasi, kombinasi, probabilitas)
//   
//   Science: 35 questions
//     - Fisika: 17q (Mekanika 7q, Termodinamika 3q, Listrik 3q)
//     - Kimia: 6q (Struktur Atom 4q, Ikatan Kimia 2q)
//     - Biologi: 12q (Sel 4q, Genetika 4q, Ekologi 3q)
//   
//   Languages: 12 questions
//     - Bahasa Indonesia: 6q (Teks 4q, Sastra 2q)
//     - Bahasa Inggris: 6q (Grammar 4q, Reading 2q)
//   
//   Social Studies: 10 questions
//     - Sejarah: 4q (Kerajaan, Penjajahan, Kemerdekaan, Tokoh)
//     - Geografi: 3q (Litosfer, Hidrosfer, Atmosfer)
//     - Ekonomi: 2q (Konsep Dasar, Permintaan)
//     - Sosiologi: 2q (Konsep Dasar, Interaksi Sosial)
//
// SMP: ~110 questions
//   Math: ~50 questions
//     - Bilangan Bulat (operasi, urutan, aplikasi)
//     - Pecahan (penjumlahan, penyederhanaan, pecahan campuran)
//     - Aljabar Dasar (variabel, persamaan linear, distributif)
//     - Geometri Dasar (keliling, luas, sudut, lingkaran)
//   
//   IPA: ~60 questions
//     - Gerak (kecepatan, GLB, GLBB)
//     - Klasifikasi (taksonomi, kingdom, ciri makhluk hidup)
//     - Energi (bentuk energi, konversi, kekekalan)
//     - Ekosistem (komponen, rantai makanan, interaksi)
//   
//   Bahasa Indonesia: ~20 questions
//     - Tata Bahasa (kalimat aktif-pasif, kelas kata)
//     - Membaca Pemahaman (ide pokok, kesimpulan)
//     - Menulis (tanda baca, ejaan)
//   
//   English: ~40 questions
//     - Grammar (tenses, verbs, comparative)
//     - Vocabulary (antonyms, synonyms, professions)
//     - Reading (comprehension, main idea)
//
// SD: ~70 questions
//   Math: ~50 questions
//     - Penjumlahan & Pengurangan (operasi dasar, soal cerita)
//     - Perkalian & Pembagian (tabel perkalian, soal cerita)
//     - Pecahan Sederhana (operasi dasar, aplikasi)
//     - Bangun Datar (mengenal bentuk, keliling, luas)
//   
//   IPA: ~40 questions
//     - Bagian Tubuh (alat indra, organ, fungsi)
//     - Tumbuhan (bagian tumbuhan, fotosintesis)
//     - Hewan (klasifikasi, reproduksi, habitat)
//     - Energi (sumber energi, cahaya, panas)
//   
//   Bahasa Indonesia: ~20 questions
//     - Membaca (suku kata, huruf kapital, pemahaman)
//     - Menulis (tanda baca, ejaan, kalimat)
//   
//   PKn: ~20 questions
//     - Pancasila (sila, lambang, nilai)
//     - Norma dan Aturan (tata tertib, ketertiban)
//
// TOTAL: ~344 questions across all grade levels and subjects

export const allTemplates = {
  // SMA Templates (164 questions)
  math: mathTemplates,
  physics: physicsTemplates,
  chemistry: chemistryTemplates,
  biology: biologyTemplates,
  indonesian: indonesianTemplates,
  english: englishTemplates,
  history: historyTemplates,
  geography: geographyTemplates,
  economics: economicsTemplates,
  sociology: sociologyTemplates,
  
  // SMP Templates (~110 questions)
  smpMath: smpMathQuestions,
  smpScience: smpScienceQuestions,
  smpIndonesian: smpIndonesianQuestions,
  smpEnglish: smpEnglishQuestions,
  
  // SD Templates (~70 questions)
  sdMath: sdMathQuestions,
  sdScience: sdScienceQuestions,
  sdIndonesian: sdIndonesianQuestions,
  sdCivic: sdCivicQuestions,
};

export default allTemplates;
