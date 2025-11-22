/**
 * Seed Script - Content Templates
 * Populates database with topics and quiz templates from template files
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Import models
import Topic from '../models/Topic';
import QuizQuestion from '../models/QuizQuestion';
import Subject from '../models/Subject';
import School from '../models/School';

// Import template data
import { allTemplates } from '../data/templates/index';

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamified-learning');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed Topics
async function seedTopics() {
  console.log('\n📚 Seeding Topics...');
  
  // Get subject IDs (assuming subjects already exist)
  const mathSubject = await Subject.findOne({ code: 'MAT' });
  const physicsSubject = await Subject.findOne({ code: 'FIS' });
  const chemistrySubject = await Subject.findOne({ code: 'KIM' });
  const biologySubject = await Subject.findOne({ code: 'BIO' });
  const indonesianSubject = await Subject.findOne({ code: 'BIND' });
  const englishSubject = await Subject.findOne({ code: 'BING' });
  const historySubject = await Subject.findOne({ code: 'SEJ' });
  const geographySubject = await Subject.findOne({ code: 'GEO' });
  const economicsSubject = await Subject.findOne({ code: 'EKO' });
  const sociologySubject = await Subject.findOne({ code: 'SOS' });

  if (!mathSubject) {
    console.warn('⚠️  Math subject not found. Please seed subjects first.');
    return;
  }

  const topics = [
    // Math Topics
    {
      subject: mathSubject._id,
      topicCode: 'ALG-01',
      name: 'Aljabar',
      slug: 'aljabar',
      description: 'Persamaan linear, kuadrat, eksponen, dan logaritma',
      icon: '🔢',
      color: '#3B82F6',
      order: 1,
      estimatedMinutes: 180,
      difficulty: 'intermediate' as const,
      learningObjectives: [
        'Menyelesaikan persamaan linear satu dan dua variabel',
        'Menyelesaikan persamaan kuadrat dengan berbagai metode',
        'Memahami sifat-sifat eksponen dan logaritma',
        'Menerapkan aljabar dalam pemecahan masalah'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['aljabar', 'persamaan', 'eksponen', 'logaritma']
      }
    },
    {
      subject: mathSubject._id,
      topicCode: 'GEOM-01',
      name: 'Geometri',
      slug: 'geometri',
      description: 'Bangun datar, bangun ruang, dan teorema Pythagoras',
      icon: '📐',
      color: '#10B981',
      order: 2,
      estimatedMinutes: 120,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Menghitung luas dan keliling bangun datar',
        'Menghitung volume dan luas permukaan bangun ruang',
        'Menerapkan teorema Pythagoras',
        'Memahami konsep dasar trigonometri'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['geometri', 'bangun datar', 'bangun ruang', 'pythagoras']
      }
    },
    {
      subject: mathSubject._id,
      topicCode: 'TRIG-01',
      name: 'Trigonometri',
      slug: 'trigonometri',
      description: 'Sudut, identitas trigonometri, dan grafik fungsi',
      icon: '📊',
      color: '#8B5CF6',
      order: 3,
      estimatedMinutes: 120,
      difficulty: 'intermediate' as const,
      learningObjectives: [
        'Memahami konsep sudut dan konversi derajat-radian',
        'Menguasai perbandingan trigonometri',
        'Menerapkan identitas trigonometri',
        'Memahami grafik fungsi trigonometri'
      ],
      prerequisites: ['GEOM-01'],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['trigonometri', 'sudut', 'identitas', 'grafik']
      }
    },
    {
      subject: mathSubject._id,
      topicCode: 'CALC-01',
      name: 'Kalkulus Dasar',
      slug: 'kalkulus-dasar',
      description: 'Limit, turunan, dan integral fungsi',
      icon: '∫',
      color: '#EF4444',
      order: 4,
      estimatedMinutes: 150,
      difficulty: 'advanced' as const,
      learningObjectives: [
        'Memahami konsep limit fungsi',
        'Menghitung turunan fungsi aljabar',
        'Menerapkan aturan turunan',
        'Memahami konsep integral dasar'
      ],
      prerequisites: ['ALG-01'],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['kalkulus', 'limit', 'turunan', 'integral']
      }
    },
    {
      subject: mathSubject._id,
      topicCode: 'STAT-01',
      name: 'Statistika',
      slug: 'statistika',
      description: 'Pengolahan data, ukuran pemusatan, dan ukuran penyebaran',
      icon: '📈',
      color: '#F59E0B',
      order: 5,
      estimatedMinutes: 100,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Mengolah dan menyajikan data',
        'Menghitung mean, median, dan modus',
        'Memahami ukuran penyebaran data',
        'Menginterpretasi data statistik'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['statistika', 'mean', 'median', 'data']
      }
    },
    {
      subject: mathSubject._id,
      topicCode: 'PROB-01',
      name: 'Peluang',
      slug: 'peluang',
      description: 'Kombinatorik, permutasi, dan probabilitas',
      icon: '🎲',
      color: '#EC4899',
      order: 6,
      estimatedMinutes: 120,
      difficulty: 'intermediate' as const,
      learningObjectives: [
        'Memahami konsep peluang',
        'Menghitung permutasi dan kombinasi',
        'Menerapkan aturan perkalian dan penjumlahan',
        'Menyelesaikan masalah peluang sederhana'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['peluang', 'permutasi', 'kombinasi', 'probabilitas']
      }
    },

    // Physics Topics
    {
      subject: physicsSubject?._id,
      topicCode: 'FIS-MEK-01',
      name: 'Mekanika',
      slug: 'mekanika',
      description: 'Gerak, gaya, usaha, energi, dan momentum',
      icon: '⚙️',
      color: '#3B82F6',
      order: 1,
      estimatedMinutes: 120,
      difficulty: 'intermediate' as const,
      learningObjectives: [
        'Menganalisis gerak lurus beraturan dan berubah beraturan',
        'Memahami hukum Newton tentang gerak',
        'Menghitung usaha, energi, dan daya',
        'Memahami konsep momentum dan impuls'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['fisika', 'mekanika', 'gerak', 'gaya']
      }
    },
    {
      subject: physicsSubject?._id,
      topicCode: 'FIS-TERMO-01',
      name: 'Termodinamika',
      slug: 'termodinamika',
      description: 'Suhu, kalor, dan hukum termodinamika',
      icon: '🌡️',
      color: '#EF4444',
      order: 2,
      estimatedMinutes: 90,
      difficulty: 'intermediate' as const,
      learningObjectives: [
        'Memahami konsep suhu dan pengukurannya',
        'Menghitung kalor dan perubahan wujud',
        'Memahami hukum termodinamika',
        'Menganalisis proses perpindahan kalor'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['fisika', 'termodinamika', 'suhu', 'kalor']
      }
    },
    {
      subject: physicsSubject?._id,
      topicCode: 'FIS-LIST-01',
      name: 'Listrik & Magnet',
      slug: 'listrik-magnet',
      description: 'Arus listrik, hukum Ohm, rangkaian, dan medan magnet',
      icon: '⚡',
      color: '#F59E0B',
      order: 3,
      estimatedMinutes: 100,
      difficulty: 'intermediate' as const,
      learningObjectives: [
        'Memahami konsep arus, tegangan, dan hambatan',
        'Menerapkan hukum Ohm',
        'Menganalisis rangkaian listrik sederhana',
        'Memahami medan magnet dan induksi'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['fisika', 'listrik', 'magnet', 'hukum ohm']
      }
    },

    // Chemistry Topics
    {
      subject: chemistrySubject?._id,
      topicCode: 'KIM-ATOM-01',
      name: 'Struktur Atom & Tabel Periodik',
      slug: 'struktur-atom',
      description: 'Partikel penyusun atom, konfigurasi elektron, dan tabel periodik',
      icon: '⚛️',
      color: '#10B981',
      order: 1,
      estimatedMinutes: 90,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami struktur atom (proton, neutron, elektron)',
        'Menentukan konfigurasi elektron',
        'Memahami sistem tabel periodik',
        'Menentukan golongan dan periode unsur'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['kimia', 'atom', 'elektron', 'tabel periodik']
      }
    },
    {
      subject: chemistrySubject?._id,
      topicCode: 'KIM-IKATAN-01',
      name: 'Ikatan Kimia',
      slug: 'ikatan-kimia',
      description: 'Ikatan ion, kovalen, dan logam',
      icon: '🔗',
      color: '#8B5CF6',
      order: 2,
      estimatedMinutes: 80,
      difficulty: 'intermediate' as const,
      learningObjectives: [
        'Membedakan ikatan ion, kovalen, dan logam',
        'Memahami pembentukan ikatan kimia',
        'Menentukan jenis ikatan dari unsur',
        'Memahami sifat senyawa berdasarkan ikatannya'
      ],
      prerequisites: ['KIM-ATOM-01'],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['kimia', 'ikatan', 'ion', 'kovalen']
      }
    },

    // Biology Topics
    {
      subject: biologySubject?._id,
      topicCode: 'BIO-SEL-01',
      name: 'Biologi Sel',
      slug: 'biologi-sel',
      description: 'Struktur dan fungsi sel, organel, membran sel',
      icon: '🔬',
      color: '#10B981',
      order: 1,
      estimatedMinutes: 100,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami struktur sel prokariotik dan eukariotik',
        'Mengenal organel sel dan fungsinya',
        'Memahami struktur dan fungsi membran sel',
        'Memahami transport melalui membran'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['biologi', 'sel', 'organel', 'membran']
      }
    },
    {
      subject: biologySubject?._id,
      topicCode: 'BIO-GEN-01',
      name: 'Genetika',
      slug: 'genetika',
      description: 'DNA, RNA, sintesis protein, dan pewarisan sifat',
      icon: '🧬',
      color: '#3B82F6',
      order: 2,
      estimatedMinutes: 110,
      difficulty: 'intermediate' as const,
      learningObjectives: [
        'Memahami struktur DNA dan RNA',
        'Memahami proses replikasi DNA',
        'Memahami sintesis protein (transkripsi dan translasi)',
        'Memahami hukum Mendel'
      ],
      prerequisites: ['BIO-SEL-01'],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['biologi', 'genetika', 'DNA', 'RNA']
      }
    },
    {
      subject: biologySubject?._id,
      topicCode: 'BIO-EKO-01',
      name: 'Ekologi',
      slug: 'ekologi',
      description: 'Ekosistem, rantai makanan, aliran energi, siklus biogeokimia',
      icon: '🌿',
      color: '#10B981',
      order: 3,
      estimatedMinutes: 90,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami komponen ekosistem',
        'Menganalisis rantai dan jaring makanan',
        'Memahami aliran energi dalam ekosistem',
        'Memahami siklus materi'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['biologi', 'ekologi', 'ekosistem', 'rantai makanan']
      }
    },

    // Language Topics
    {
      subject: indonesianSubject?._id,
      topicCode: 'BIND-TEKS-01',
      name: 'Teks dan Struktur Bahasa',
      slug: 'teks-struktur-bahasa',
      description: 'Jenis teks, struktur teks, tata bahasa Indonesia',
      icon: '📖',
      color: '#EF4444',
      order: 1,
      estimatedMinutes: 100,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Mengidentifikasi jenis-jenis teks',
        'Memahami struktur teks',
        'Menguasai tata bahasa Indonesia (EYD, kalimat efektif)',
        'Menganalisis unsur kebahasaan'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['bahasa indonesia', 'teks', 'tata bahasa', 'EYD']
      }
    },
    {
      subject: indonesianSubject?._id,
      topicCode: 'BIND-SASTRA-01',
      name: 'Kesusastraan Indonesia',
      slug: 'kesusastraan',
      description: 'Puisi, prosa, drama, dan unsur-unsur intrinsik',
      icon: '✍️',
      color: '#8B5CF6',
      order: 2,
      estimatedMinutes: 90,
      difficulty: 'intermediate' as const,
      learningObjectives: [
        'Memahami unsur intrinsik dan ekstrinsik karya sastra',
        'Menganalisis puisi, cerpen, dan novel',
        'Memahami struktur drama',
        'Mengidentifikasi majas dan gaya bahasa'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['bahasa indonesia', 'sastra', 'puisi', 'prosa']
      }
    },
    {
      subject: englishSubject?._id,
      topicCode: 'BING-GRAM-01',
      name: 'English Grammar',
      slug: 'english-grammar',
      description: 'Tenses, parts of speech, sentence structure',
      icon: '🔤',
      color: '#3B82F6',
      order: 1,
      estimatedMinutes: 100,
      difficulty: 'intermediate' as const,
      learningObjectives: [
        'Memahami tenses dalam bahasa Inggris',
        'Menguasai parts of speech',
        'Memahami struktur kalimat',
        'Menerapkan grammar dalam kalimat'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['english', 'grammar', 'tenses', 'sentence']
      }
    },
    {
      subject: englishSubject?._id,
      topicCode: 'BING-READ-01',
      name: 'Reading Comprehension',
      slug: 'reading-comprehension',
      description: 'Understanding texts, main ideas, vocabulary',
      icon: '📚',
      color: '#10B981',
      order: 2,
      estimatedMinutes: 80,
      difficulty: 'intermediate' as const,
      learningObjectives: [
        'Memahami isi teks bahasa Inggris',
        'Menentukan main idea dan supporting details',
        'Memahami vocabulary in context',
        'Membuat inference dari teks'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['english', 'reading', 'comprehension', 'vocabulary']
      }
    },

    // Social Studies Topics
    {
      subject: historySubject?._id,
      topicCode: 'SEJ-IND-01',
      name: 'Sejarah Indonesia',
      slug: 'sejarah-indonesia',
      description: 'Kerajaan Nusantara, penjajahan, kemerdekaan, dan pasca kemerdekaan',
      icon: '🏛️',
      color: '#F59E0B',
      order: 1,
      estimatedMinutes: 100,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami kerajaan-kerajaan di Nusantara',
        'Memahami masa kolonialisme dan imperialisme',
        'Memahami perjuangan kemerdekaan Indonesia',
        'Memahami perkembangan Indonesia pasca kemerdekaan'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['sejarah', 'indonesia', 'kemerdekaan', 'kerajaan']
      }
    },
    {
      subject: geographySubject?._id,
      topicCode: 'GEO-FIS-01',
      name: 'Geografi Fisik',
      slug: 'geografi-fisik',
      description: 'Litosfer, hidrosfer, atmosfer, dan fenomena alam',
      icon: '🌍',
      color: '#10B981',
      order: 1,
      estimatedMinutes: 90,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami struktur bumi (litosfer)',
        'Memahami siklus air (hidrosfer)',
        'Memahami lapisan atmosfer dan iklim',
        'Menganalisis fenomena alam'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['geografi', 'litosfer', 'hidrosfer', 'atmosfer']
      }
    },
    {
      subject: economicsSubject?._id,
      topicCode: 'EKO-DASAR-01',
      name: 'Ekonomi Dasar',
      slug: 'ekonomi-dasar',
      description: 'Konsep ekonomi, permintaan-penawaran, pasar',
      icon: '💰',
      color: '#F59E0B',
      order: 1,
      estimatedMinutes: 80,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami konsep dasar ekonomi',
        'Memahami hukum permintaan dan penawaran',
        'Menganalisis keseimbangan pasar',
        'Memahami sistem ekonomi'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['ekonomi', 'permintaan', 'penawaran', 'pasar']
      }
    },
    {
      subject: sociologySubject?._id,
      topicCode: 'SOS-DASAR-01',
      name: 'Sosiologi Dasar',
      slug: 'sosiologi-dasar',
      description: 'Masyarakat, interaksi sosial, kelompok sosial',
      icon: '👥',
      color: '#8B5CF6',
      order: 1,
      estimatedMinutes: 70,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami konsep dasar sosiologi',
        'Memahami interaksi sosial',
        'Mengidentifikasi kelompok sosial',
        'Memahami lembaga sosial'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMA',
        tags: ['sosiologi', 'masyarakat', 'interaksi sosial']
      }
    },

    // ========== SMP TOPICS ==========
    // SMP Math Topics
    {
      subject: mathSubject._id,
      topicCode: 'SMP-MTK-BILBULAT-01',
      name: 'Bilangan Bulat',
      slug: 'bilangan-bulat-smp',
      description: 'Operasi hitung bilangan bulat positif dan negatif',
      icon: '➕',
      color: '#3B82F6',
      order: 20,
      estimatedMinutes: 60,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami konsep bilangan bulat positif dan negatif',
        'Melakukan operasi tambah, kurang, kali, bagi bilangan bulat',
        'Mengurutkan bilangan bulat',
        'Menerapkan bilangan bulat dalam kehidupan sehari-hari'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMP',
        tags: ['bilangan-bulat', 'operasi-hitung', 'matematika-smp']
      }
    },
    {
      subject: mathSubject._id,
      topicCode: 'SMP-MTK-PECAHAN-01',
      name: 'Pecahan',
      slug: 'pecahan-smp',
      description: 'Operasi pecahan, pecahan campuran, dan penyederhanaan',
      icon: '🔢',
      color: '#10B981',
      order: 21,
      estimatedMinutes: 70,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami konsep pecahan biasa dan campuran',
        'Melakukan operasi penjumlahan dan pengurangan pecahan',
        'Melakukan operasi perkalian dan pembagian pecahan',
        'Menyederhanakan pecahan'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMP',
        tags: ['pecahan', 'operasi-hitung', 'matematika-smp']
      }
    },
    {
      subject: mathSubject._id,
      topicCode: 'SMP-MTK-ALJABAR-01',
      name: 'Aljabar Dasar',
      slug: 'aljabar-dasar-smp',
      description: 'Variabel, suku, persamaan linear sederhana',
      icon: '🔤',
      color: '#8B5CF6',
      order: 22,
      estimatedMinutes: 80,
      difficulty: 'intermediate' as const,
      learningObjectives: [
        'Memahami konsep variabel dan konstanta',
        'Menyederhanakan bentuk aljabar',
        'Menyelesaikan persamaan linear satu variabel',
        'Menerapkan aljabar dalam pemecahan masalah'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMP',
        tags: ['aljabar', 'persamaan-linear', 'matematika-smp']
      }
    },
    {
      subject: mathSubject._id,
      topicCode: 'SMP-MTK-GEOMETRI-01',
      name: 'Geometri Dasar',
      slug: 'geometri-dasar-smp',
      description: 'Bangun datar, keliling, luas, sudut',
      icon: '📐',
      color: '#F59E0B',
      order: 23,
      estimatedMinutes: 75,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Menghitung keliling dan luas bangun datar',
        'Memahami konsep sudut',
        'Mengidentifikasi sifat-sifat bangun datar',
        'Menerapkan konsep geometri dalam kehidupan'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMP',
        tags: ['geometri', 'bangun-datar', 'matematika-smp']
      }
    },

    // SMP Science Topics
    {
      subject: physicsSubject?._id,
      topicCode: 'SMP-IPA-GERAK-01',
      name: 'Gerak',
      slug: 'gerak-smp',
      description: 'Gerak lurus, kecepatan, percepatan',
      icon: '🏃',
      color: '#3B82F6',
      order: 20,
      estimatedMinutes: 65,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami konsep gerak dan perpindahan',
        'Menghitung kecepatan dan percepatan',
        'Membedakan GLB dan GLBB',
        'Menerapkan konsep gerak dalam kehidupan'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMP',
        tags: ['gerak', 'kecepatan', 'ipa-smp']
      }
    },
    {
      subject: biologySubject?._id,
      topicCode: 'SMP-IPA-KLASIFIKASI-01',
      name: 'Klasifikasi Makhluk Hidup',
      slug: 'klasifikasi-smp',
      description: 'Sistem klasifikasi, kingdom, taksonomi',
      icon: '🦋',
      color: '#10B981',
      order: 21,
      estimatedMinutes: 70,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami sistem klasifikasi makhluk hidup',
        'Mengenal tingkatan taksonomi',
        'Mengidentifikasi ciri-ciri kingdom',
        'Mengklasifikasikan makhluk hidup'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMP',
        tags: ['klasifikasi', 'taksonomi', 'ipa-smp']
      }
    },
    {
      subject: physicsSubject?._id,
      topicCode: 'SMP-IPA-ENERGI-01',
      name: 'Energi',
      slug: 'energi-smp',
      description: 'Bentuk energi, perubahan energi, hukum kekekalan energi',
      icon: '⚡',
      color: '#F59E0B',
      order: 22,
      estimatedMinutes: 60,
      difficulty: 'intermediate' as const,
      learningObjectives: [
        'Memahami berbagai bentuk energi',
        'Memahami perubahan bentuk energi',
        'Memahami hukum kekekalan energi',
        'Menerapkan konsep energi dalam kehidupan'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMP',
        tags: ['energi', 'fisika', 'ipa-smp']
      }
    },
    {
      subject: biologySubject?._id,
      topicCode: 'SMP-IPA-EKOSISTEM-01',
      name: 'Ekosistem',
      slug: 'ekosistem-smp',
      description: 'Komponen ekosistem, rantai makanan, jaring makanan',
      icon: '🌿',
      color: '#10B981',
      order: 23,
      estimatedMinutes: 65,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami komponen biotik dan abiotik',
        'Memahami rantai dan jaring makanan',
        'Memahami aliran energi dalam ekosistem',
        'Memahami interaksi dalam ekosistem'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMP',
        tags: ['ekosistem', 'rantai-makanan', 'ipa-smp']
      }
    },

    // SMP Language Topics
    {
      subject: indonesianSubject?._id,
      topicCode: 'SMP-BIND-TATABAHASA-01',
      name: 'Tata Bahasa',
      slug: 'tata-bahasa-smp',
      description: 'Kalimat aktif-pasif, kelas kata, struktur kalimat',
      icon: '📝',
      color: '#EF4444',
      order: 20,
      estimatedMinutes: 60,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Membedakan kalimat aktif dan pasif',
        'Memahami kelas kata',
        'Memahami struktur kalimat',
        'Menerapkan tata bahasa dalam menulis'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMP',
        tags: ['tata-bahasa', 'kalimat', 'bahasa-indonesia-smp']
      }
    },
    {
      subject: englishSubject?._id,
      topicCode: 'SMP-BING-GRAMMAR-01',
      name: 'Basic Grammar',
      slug: 'basic-grammar-smp',
      description: 'Tenses, irregular verbs, simple sentences',
      icon: '🔤',
      color: '#3B82F6',
      order: 20,
      estimatedMinutes: 70,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami present simple tense',
        'Memahami past tense dan irregular verbs',
        'Memahami present continuous tense',
        'Membuat kalimat sederhana'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SMP',
        tags: ['grammar', 'tenses', 'english-smp']
      }
    },

    // ========== SD TOPICS ==========
    // SD Math Topics
    {
      subject: mathSubject._id,
      topicCode: 'SD-MTK-TAMBAHKURANG-01',
      name: 'Penjumlahan & Pengurangan',
      slug: 'penjumlahan-pengurangan-sd',
      description: 'Operasi tambah dan kurang bilangan cacah',
      icon: '➕',
      color: '#3B82F6',
      order: 30,
      estimatedMinutes: 45,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami konsep penjumlahan',
        'Memahami konsep pengurangan',
        'Melakukan penjumlahan dengan menyimpan',
        'Melakukan pengurangan dengan meminjam'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SD',
        tags: ['penjumlahan', 'pengurangan', 'matematika-sd']
      }
    },
    {
      subject: mathSubject._id,
      topicCode: 'SD-MTK-KALIBAGI-01',
      name: 'Perkalian & Pembagian',
      slug: 'perkalian-pembagian-sd',
      description: 'Operasi kali dan bagi, perkalian dasar',
      icon: '✖️',
      color: '#10B981',
      order: 31,
      estimatedMinutes: 50,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami konsep perkalian',
        'Menghafal tabel perkalian',
        'Memahami konsep pembagian',
        'Menyelesaikan soal cerita perkalian dan pembagian'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SD',
        tags: ['perkalian', 'pembagian', 'matematika-sd']
      }
    },
    {
      subject: mathSubject._id,
      topicCode: 'SD-MTK-PECAHAN-01',
      name: 'Pecahan Sederhana',
      slug: 'pecahan-sederhana-sd',
      description: 'Pecahan 1/2, 1/4, penjumlahan pecahan sederhana',
      icon: '🍕',
      color: '#F59E0B',
      order: 32,
      estimatedMinutes: 40,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami konsep pecahan sederhana',
        'Mengenal pecahan 1/2, 1/4, 1/3',
        'Menjumlahkan pecahan berpenyebut sama',
        'Menerapkan pecahan dalam kehidupan'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SD',
        tags: ['pecahan', 'matematika-sd']
      }
    },
    {
      subject: mathSubject._id,
      topicCode: 'SD-MTK-BANGUNDATAR-01',
      name: 'Bangun Datar',
      slug: 'bangun-datar-sd',
      description: 'Mengenal persegi, persegi panjang, segitiga, lingkaran',
      icon: '🔷',
      color: '#8B5CF6',
      order: 33,
      estimatedMinutes: 45,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Mengenal berbagai bangun datar',
        'Menghitung keliling bangun datar sederhana',
        'Menghitung luas bangun datar sederhana',
        'Mengidentifikasi sifat bangun datar'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SD',
        tags: ['bangun-datar', 'geometri', 'matematika-sd']
      }
    },

    // SD Science Topics
    {
      subject: biologySubject?._id,
      topicCode: 'SD-IPA-TUBUH-01',
      name: 'Bagian Tubuh',
      slug: 'bagian-tubuh-sd',
      description: 'Mengenal panca indera dan fungsinya',
      icon: '👁️',
      color: '#EF4444',
      order: 30,
      estimatedMinutes: 40,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Mengenal panca indera',
        'Memahami fungsi organ tubuh',
        'Menjaga kesehatan tubuh',
        'Memahami bagian-bagian tubuh'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SD',
        tags: ['tubuh', 'panca-indera', 'ipa-sd']
      }
    },
    {
      subject: biologySubject?._id,
      topicCode: 'SD-IPA-TUMBUHAN-01',
      name: 'Tumbuhan',
      slug: 'tumbuhan-sd',
      description: 'Bagian tumbuhan, fotosintesis, manfaat tumbuhan',
      icon: '🌱',
      color: '#10B981',
      order: 31,
      estimatedMinutes: 45,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Mengenal bagian-bagian tumbuhan',
        'Memahami proses fotosintesis sederhana',
        'Memahami manfaat tumbuhan',
        'Merawat tumbuhan'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SD',
        tags: ['tumbuhan', 'fotosintesis', 'ipa-sd']
      }
    },
    {
      subject: biologySubject?._id,
      topicCode: 'SD-IPA-HEWAN-01',
      name: 'Hewan',
      slug: 'hewan-sd',
      description: 'Jenis hewan, metamorfosis, habitat hewan',
      icon: '🐸',
      color: '#3B82F6',
      order: 32,
      estimatedMinutes: 40,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Mengelompokkan hewan berdasarkan ciri',
        'Memahami metamorfosis',
        'Mengenal habitat hewan',
        'Memahami cara berkembang biak hewan'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SD',
        tags: ['hewan', 'metamorfosis', 'ipa-sd']
      }
    },
    {
      subject: physicsSubject?._id,
      topicCode: 'SD-IPA-ENERGI-01',
      name: 'Energi',
      slug: 'energi-sd',
      description: 'Sumber energi, cahaya, panas',
      icon: '☀️',
      color: '#F59E0B',
      order: 33,
      estimatedMinutes: 35,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Mengenal sumber energi',
        'Memahami energi cahaya',
        'Memahami energi panas',
        'Menghemat energi'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SD',
        tags: ['energi', 'cahaya', 'ipa-sd']
      }
    },

    // SD Language Topics
    {
      subject: indonesianSubject?._id,
      topicCode: 'SD-BIND-MEMBACA-01',
      name: 'Membaca',
      slug: 'membaca-sd',
      description: 'Membaca kata, kalimat, dan pemahaman sederhana',
      icon: '📖',
      color: '#EF4444',
      order: 30,
      estimatedMinutes: 40,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Membaca kata dan kalimat sederhana',
        'Memahami isi bacaan',
        'Mengenal huruf kapital',
        'Menghitung suku kata'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SD',
        tags: ['membaca', 'bahasa-indonesia-sd']
      }
    },
    {
      subject: indonesianSubject?._id,
      topicCode: 'SD-BIND-MENULIS-01',
      name: 'Menulis',
      slug: 'menulis-sd',
      description: 'Menulis kalimat, tanda baca, ejaan',
      icon: '✍️',
      order: 31,
      estimatedMinutes: 35,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Menulis kalimat sederhana',
        'Menggunakan tanda baca',
        'Menulis dengan ejaan yang benar',
        'Menyusun kalimat'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SD',
        tags: ['menulis', 'tanda-baca', 'bahasa-indonesia-sd']
      }
    },

    // SD Civic Education Topics
    {
      subject: historySubject?._id,
      topicCode: 'SD-PKN-PANCASILA-01',
      name: 'Pancasila',
      slug: 'pancasila-sd',
      description: 'Lima sila Pancasila, simbol, dan penerapan',
      icon: '🏛️',
      color: '#EF4444',
      order: 30,
      estimatedMinutes: 40,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Menghafal lima sila Pancasila',
        'Memahami simbol setiap sila',
        'Menerapkan nilai Pancasila',
        'Menghargai Pancasila'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SD',
        tags: ['pancasila', 'pkn-sd']
      }
    },
    {
      subject: historySubject?._id,
      topicCode: 'SD-PKN-NORMA-01',
      name: 'Norma dan Aturan',
      slug: 'norma-aturan-sd',
      description: 'Tata tertib, aturan di rumah, sekolah, masyarakat',
      icon: '📏',
      color: '#8B5CF6',
      order: 31,
      estimatedMinutes: 35,
      difficulty: 'beginner' as const,
      learningObjectives: [
        'Memahami tata tertib sekolah',
        'Memahami aturan di rumah',
        'Memahami aturan di masyarakat',
        'Mematuhi aturan'
      ],
      isTemplate: true,
      isActive: true,
      metadata: {
        gradeLevel: 'SD',
        tags: ['norma', 'aturan', 'pkn-sd']
      }
    },
  ].filter(topic => topic.subject); // Filter out topics with undefined subjects

  // Clear existing template topics
  await Topic.deleteMany({ isTemplate: true });
  
  // Insert topics
  const createdTopics = await Topic.insertMany(topics);
  console.log(`✅ Created ${createdTopics.length} topics`);
  
  return createdTopics;
}

// Seed Quiz Questions
async function seedQuizQuestions(topics: any[]) {
  console.log('\n❓ Seeding Quiz Questions...');

  // Clear existing template questions
  await QuizQuestion.deleteMany({ isTemplate: true });

  let totalQuestions = 0;

  // Get subject and topic mappings
  const topicMap = new Map();
  for (const topic of topics) {
    topicMap.set(topic.topicCode, topic._id);
  }

  // Math Questions
  if (allTemplates.math) {
    for (const quizTemplate of allTemplates.math) {
      const topicId = topicMap.get(quizTemplate.topicCode);
      if (!topicId) {
        console.warn(`⚠️  Topic not found for code: ${quizTemplate.topicCode}`);
        continue;
      }

      const questions = quizTemplate.questions.map((q, index) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        imageUrl: q.imageUrl,
        topic: topicId,
        topicId: quizTemplate.topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questions);
      totalQuestions += questions.length;
      console.log(`  ✓ ${quizTemplate.topicName}: ${questions.length} questions`);
    }
  }

  // Physics Questions
  if (allTemplates.physics) {
    for (const quizTemplate of allTemplates.physics) {
      const topicId = topicMap.get(quizTemplate.topicCode);
      if (!topicId) continue;

      const questions = quizTemplate.questions.map((q, index) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        imageUrl: q.imageUrl,
        topic: topicId,
        topicId: quizTemplate.topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questions);
      totalQuestions += questions.length;
      console.log(`  ✓ ${quizTemplate.topicName}: ${questions.length} questions`);
    }
  }

  // Chemistry Questions
  if (allTemplates.chemistry) {
    for (const quizTemplate of allTemplates.chemistry) {
      const topicId = topicMap.get(quizTemplate.topicCode);
      if (!topicId) continue;

      const questions = quizTemplate.questions.map((q, index) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: quizTemplate.topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questions);
      totalQuestions += questions.length;
      console.log(`  ✓ ${quizTemplate.topicName}: ${questions.length} questions`);
    }
  }

  // Biology Questions
  if (allTemplates.biology) {
    for (const quizTemplate of allTemplates.biology) {
      const topicId = topicMap.get(quizTemplate.topicCode);
      if (!topicId) continue;

      const questions = quizTemplate.questions.map((q, index) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: quizTemplate.topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questions);
      totalQuestions += questions.length;
      console.log(`  ✓ ${quizTemplate.topicName}: ${questions.length} questions`);
    }
  }

  // Indonesian Questions
  if (allTemplates.indonesian) {
    for (const quizTemplate of allTemplates.indonesian) {
      const topicId = topicMap.get(quizTemplate.topicCode);
      if (!topicId) continue;

      const questions = quizTemplate.questions.map((q, index) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: quizTemplate.topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questions);
      totalQuestions += questions.length;
      console.log(`  ✓ ${quizTemplate.topicName}: ${questions.length} questions`);
    }
  }

  // English Questions
  if (allTemplates.english) {
    for (const quizTemplate of allTemplates.english) {
      const topicId = topicMap.get(quizTemplate.topicCode);
      if (!topicId) continue;

      const questions = quizTemplate.questions.map((q, index) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: quizTemplate.topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questions);
      totalQuestions += questions.length;
      console.log(`  ✓ ${quizTemplate.topicName}: ${questions.length} questions`);
    }
  }

  // History Questions
  if (allTemplates.history) {
    for (const quizTemplate of allTemplates.history) {
      const topicId = topicMap.get(quizTemplate.topicCode);
      if (!topicId) continue;

      const questions = quizTemplate.questions.map((q, index) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: quizTemplate.topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questions);
      totalQuestions += questions.length;
      console.log(`  ✓ ${quizTemplate.topicName}: ${questions.length} questions`);
    }
  }

  // Geography Questions
  if (allTemplates.geography) {
    for (const quizTemplate of allTemplates.geography) {
      const topicId = topicMap.get(quizTemplate.topicCode);
      if (!topicId) continue;

      const questions = quizTemplate.questions.map((q, index) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: quizTemplate.topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questions);
      totalQuestions += questions.length;
      console.log(`  ✓ ${quizTemplate.topicName}: ${questions.length} questions`);
    }
  }

  // Economics Questions
  if (allTemplates.economics) {
    for (const quizTemplate of allTemplates.economics) {
      const topicId = topicMap.get(quizTemplate.topicCode);
      if (!topicId) continue;

      const questions = quizTemplate.questions.map((q, index) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: quizTemplate.topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questions);
      totalQuestions += questions.length;
      console.log(`  ✓ ${quizTemplate.topicName}: ${questions.length} questions`);
    }
  }

  // Sociology Questions
  if (allTemplates.sociology) {
    for (const quizTemplate of allTemplates.sociology) {
      const topicId = topicMap.get(quizTemplate.topicCode);
      if (!topicId) continue;

      const questions = quizTemplate.questions.map((q, index) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: quizTemplate.topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questions);
      totalQuestions += questions.length;
      console.log(`  ✓ ${quizTemplate.topicName}: ${questions.length} questions`);
    }
  }

  // ========== SMP QUESTIONS ==========
  console.log('\n📚 Seeding SMP Questions...');

  // SMP Math Questions - direct array of questions
  if (allTemplates.smpMath) {
    // Group questions by topicCode
    const questionsByTopic = new Map();
    for (const q of allTemplates.smpMath) {
      if (!questionsByTopic.has(q.topicCode)) {
        questionsByTopic.set(q.topicCode, []);
      }
      questionsByTopic.get(q.topicCode).push(q);
    }

    // Process each topic's questions
    for (const [topicCode, questions] of questionsByTopic) {
      const topicId = topicMap.get(topicCode);
      if (!topicId) {
        console.warn(`⚠️  Topic not found for code: ${topicCode}`);
        continue;
      }

      const questionDocs = questions.map((q: any, index: number) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questionDocs);
      totalQuestions += questionDocs.length;
      console.log(`  ✓ SMP Math ${topicCode}: ${questionDocs.length} questions`);
    }
  }

  // SMP Science Questions
  if (allTemplates.smpScience) {
    const questionsByTopic = new Map();
    for (const q of allTemplates.smpScience) {
      if (!questionsByTopic.has(q.topicCode)) {
        questionsByTopic.set(q.topicCode, []);
      }
      questionsByTopic.get(q.topicCode).push(q);
    }

    for (const [topicCode, questions] of questionsByTopic) {
      const topicId = topicMap.get(topicCode);
      if (!topicId) continue;

      const questionDocs = questions.map((q: any, index: number) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questionDocs);
      totalQuestions += questionDocs.length;
      console.log(`  ✓ SMP Science ${topicCode}: ${questionDocs.length} questions`);
    }
  }

  // SMP Indonesian Questions
  if (allTemplates.smpIndonesian) {
    const questionsByTopic = new Map();
    for (const q of allTemplates.smpIndonesian) {
      if (!questionsByTopic.has(q.topicCode)) {
        questionsByTopic.set(q.topicCode, []);
      }
      questionsByTopic.get(q.topicCode).push(q);
    }

    for (const [topicCode, questions] of questionsByTopic) {
      const topicId = topicMap.get(topicCode);
      if (!topicId) continue;

      const questionDocs = questions.map((q: any, index: number) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questionDocs);
      totalQuestions += questionDocs.length;
      console.log(`  ✓ SMP Indonesian ${topicCode}: ${questionDocs.length} questions`);
    }
  }

  // SMP English Questions
  if (allTemplates.smpEnglish) {
    const questionsByTopic = new Map();
    for (const q of allTemplates.smpEnglish) {
      if (!questionsByTopic.has(q.topicCode)) {
        questionsByTopic.set(q.topicCode, []);
      }
      questionsByTopic.get(q.topicCode).push(q);
    }

    for (const [topicCode, questions] of questionsByTopic) {
      const topicId = topicMap.get(topicCode);
      if (!topicId) continue;

      const questionDocs = questions.map((q: any, index: number) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questionDocs);
      totalQuestions += questionDocs.length;
      console.log(`  ✓ SMP English ${topicCode}: ${questionDocs.length} questions`);
    }
  }

  // ========== SD QUESTIONS ==========
  console.log('\n📚 Seeding SD Questions...');

  // SD Math Questions
  if (allTemplates.sdMath) {
    const questionsByTopic = new Map();
    for (const q of allTemplates.sdMath) {
      if (!questionsByTopic.has(q.topicCode)) {
        questionsByTopic.set(q.topicCode, []);
      }
      questionsByTopic.get(q.topicCode).push(q);
    }

    for (const [topicCode, questions] of questionsByTopic) {
      const topicId = topicMap.get(topicCode);
      if (!topicId) {
        console.warn(`⚠️  Topic not found for code: ${topicCode}`);
        continue;
      }

      const questionDocs = questions.map((q: any, index: number) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questionDocs);
      totalQuestions += questionDocs.length;
      console.log(`  ✓ SD Math ${topicCode}: ${questionDocs.length} questions`);
    }
  }

  // SD Science Questions
  if (allTemplates.sdScience) {
    const questionsByTopic = new Map();
    for (const q of allTemplates.sdScience) {
      if (!questionsByTopic.has(q.topicCode)) {
        questionsByTopic.set(q.topicCode, []);
      }
      questionsByTopic.get(q.topicCode).push(q);
    }

    for (const [topicCode, questions] of questionsByTopic) {
      const topicId = topicMap.get(topicCode);
      if (!topicId) continue;

      const questionDocs = questions.map((q: any, index: number) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questionDocs);
      totalQuestions += questionDocs.length;
      console.log(`  ✓ SD Science ${topicCode}: ${questionDocs.length} questions`);
    }
  }

  // SD Indonesian Questions
  if (allTemplates.sdIndonesian) {
    const questionsByTopic = new Map();
    for (const q of allTemplates.sdIndonesian) {
      if (!questionsByTopic.has(q.topicCode)) {
        questionsByTopic.set(q.topicCode, []);
      }
      questionsByTopic.get(q.topicCode).push(q);
    }

    for (const [topicCode, questions] of questionsByTopic) {
      const topicId = topicMap.get(topicCode);
      if (!topicId) continue;

      const questionDocs = questions.map((q: any, index: number) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questionDocs);
      totalQuestions += questionDocs.length;
      console.log(`  ✓ SD Indonesian ${topicCode}: ${questionDocs.length} questions`);
    }
  }

  // SD Civic Questions
  if (allTemplates.sdCivic) {
    const questionsByTopic = new Map();
    for (const q of allTemplates.sdCivic) {
      if (!questionsByTopic.has(q.topicCode)) {
        questionsByTopic.set(q.topicCode, []);
      }
      questionsByTopic.get(q.topicCode).push(q);
    }

    for (const [topicCode, questions] of questionsByTopic) {
      const topicId = topicMap.get(topicCode);
      if (!topicId) continue;

      const questionDocs = questions.map((q: any, index: number) => ({
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        hints: q.hints,
        explanation: q.explanation,
        tags: q.tags,
        topic: topicId,
        topicId: topicCode,
        subject: topics.find(t => t._id.equals(topicId))?.subject,
        points: q.difficulty === 'mudah' ? 10 : q.difficulty === 'sedang' ? 15 : 20,
        timeLimit: 60,
        isTemplate: true,
        status: 'published',
        order: index + 1
      }));

      await QuizQuestion.insertMany(questionDocs);
      totalQuestions += questionDocs.length;
      console.log(`  ✓ SD Civic ${topicCode}: ${questionDocs.length} questions`);
    }
  }

  console.log(`✅ Created ${totalQuestions} quiz questions (SMA + SMP + SD)`);
}

// Main execution
async function main() {
  console.log('🚀 Starting Content Template Seeding...\n');
  
  await connectDB();
  
  try {
    const topics = await seedTopics();
    if (topics && topics.length > 0) {
      await seedQuizQuestions(topics);
    }
    
    console.log('\n🎉 Content template seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`  📚 Topics: ${topics?.length || 0}`);
    console.log(`  ❓ Quiz Questions: ${await QuizQuestion.countDocuments({ isTemplate: true })}`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { seedTopics, seedQuizQuestions };
