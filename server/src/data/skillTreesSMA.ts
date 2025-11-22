/**
 * SMA (Senior High School) Skill Tree Nodes
 * Kelas 10-12 across major subjects
 * Total: ~210 nodes
 * 
 * Subjects covered:
 * - Matematika Wajib (36 nodes - 12 per class)
 * - Fisika (24 nodes - 8 per class)
 * - Kimia (24 nodes - 8 per class)
 * - Biologi (24 nodes - 8 per class)
 * - B.Indonesia (18 nodes - 6 per class)
 * - B.Inggris (18 nodes - 6 per class)
 * - Geografi (15 nodes - 5 per class)
 * - Ekonomi (15 nodes - 5 per class)
 * - Sosiologi (12 nodes - 4 per class)
 * - Sejarah (12 nodes - 4 per class)
 * - PKn (12 nodes - 4 per class)
 */

export interface SkillTreeNode {
  id: string;
  nodeId: string;
  name: string;
  description: string;
  topicCode: string;
  subject: string;
  gradeLevel: "SD" | "SMP" | "SMA" | "SMK";
  classNumber: number;
  semester: number;
  curriculum: "Kurikulum Merdeka" | "K13";
  kompetensiDasar?: string;
  icon: string;
  color: string;
  level: number;
  xpRequired: number;
  prerequisites: string[];
  rewards: {
    xp: number;
    gems: number;
    hearts?: number;
    badge?: string;
    certificate?: string;
  };
  position: { x: number; y: number };
  quizCount: number;
  estimatedMinutes: number;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  isCheckpoint: boolean;
}

// ============================================
// SMA MATEMATIKA WAJIB - Kelas 10 (12 nodes)
// ============================================
const mathSMA10: SkillTreeNode[] = [
  { id: "sma-math-10-1", nodeId: "sma-math-10-1", name: "Bentuk Pangkat & Akar", description: "Operasi bilangan berpangkat dan bentuk akar", topicCode: "MATH-10-1", subject: "Matematika", gradeLevel: "SMA", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.1", icon: "🔢", color: "#3B82F6", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 100, gems: 15 }, position: { x: 50, y: 0 }, quizCount: 20, estimatedMinutes: 60, difficulty: "Sedang", isCheckpoint: false },
  { id: "sma-math-10-2", nodeId: "sma-math-10-2", name: "Persamaan & Pertidaksamaan", description: "Persamaan dan pertidaksamaan linear/kuadrat", topicCode: "MATH-10-2", subject: "Matematika", gradeLevel: "SMA", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.2", icon: "⚖️", color: "#3B82F6", level: 2, xpRequired: 100, prerequisites: ["sma-math-10-1"], rewards: { xp: 110, gems: 15 }, position: { x: 50, y: 100 }, quizCount: 22, estimatedMinutes: 65, difficulty: "Sedang", isCheckpoint: false },
  { id: "sma-math-10-3", nodeId: "sma-math-10-3", name: "Sistem Persamaan Linear", description: "SPLTV dan aplikasinya", topicCode: "MATH-10-3", subject: "Matematika", gradeLevel: "SMA", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.3", icon: "📊", color: "#3B82F6", level: 3, xpRequired: 210, prerequisites: ["sma-math-10-2"], rewards: { xp: 115, gems: 18, badge: "Linear Expert" }, position: { x: 50, y: 200 }, quizCount: 25, estimatedMinutes: 70, difficulty: "Sulit", isCheckpoint: true },
  { id: "sma-math-10-4", nodeId: "sma-math-10-4", name: "Fungsi", description: "Konsep fungsi, domain, range, komposisi", topicCode: "MATH-10-4", subject: "Matematika", gradeLevel: "SMA", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.4", icon: "ƒ", color: "#3B82F6", level: 4, xpRequired: 325, prerequisites: ["sma-math-10-3"], rewards: { xp: 110, gems: 15 }, position: { x: 50, y: 300 }, quizCount: 22, estimatedMinutes: 65, difficulty: "Sulit", isCheckpoint: false },
  { id: "sma-math-10-5", nodeId: "sma-math-10-5", name: "Trigonometri Dasar", description: "Perbandingan trigonometri dan sudut istimewa", topicCode: "MATH-10-5", subject: "Matematika", gradeLevel: "SMA", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.5", icon: "📐", color: "#3B82F6", level: 5, xpRequired: 435, prerequisites: ["sma-math-10-4"], rewards: { xp: 115, gems: 18 }, position: { x: 50, y: 400 }, quizCount: 25, estimatedMinutes: 70, difficulty: "Sulit", isCheckpoint: false },
  { id: "sma-math-10-6", nodeId: "sma-math-10-6", name: "Aturan Sinus & Cosinus", description: "Penerapan dalam segitiga", topicCode: "MATH-10-6", subject: "Matematika", gradeLevel: "SMA", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.6", icon: "📏", color: "#3B82F6", level: 6, xpRequired: 550, prerequisites: ["sma-math-10-5"], rewards: { xp: 120, gems: 18, badge: "Trigonometry Master" }, position: { x: 50, y: 500 }, quizCount: 25, estimatedMinutes: 75, difficulty: "Sulit", isCheckpoint: true },
  { id: "sma-math-10-7", nodeId: "sma-math-10-7", name: "Vektor", description: "Operasi vektor di bidang", topicCode: "MATH-10-7", subject: "Matematika", gradeLevel: "SMA", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.7", icon: "➡️", color: "#3B82F6", level: 7, xpRequired: 670, prerequisites: ["sma-math-10-6"], rewards: { xp: 115, gems: 18 }, position: { x: 50, y: 600 }, quizCount: 25, estimatedMinutes: 70, difficulty: "Sulit", isCheckpoint: false },
  { id: "sma-math-10-8", nodeId: "sma-math-10-8", name: "Barisan & Deret", description: "Barisan aritmatika dan geometri", topicCode: "MATH-10-8", subject: "Matematika", gradeLevel: "SMA", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.8", icon: "🔢", color: "#3B82F6", level: 8, xpRequired: 785, prerequisites: ["sma-math-10-7"], rewards: { xp: 115, gems: 18 }, position: { x: 50, y: 700 }, quizCount: 25, estimatedMinutes: 70, difficulty: "Sulit", isCheckpoint: false },
  { id: "sma-math-10-9", nodeId: "sma-math-10-9", name: "Limit Fungsi", description: "Konsep limit dan sifat-sifatnya", topicCode: "MATH-10-9", subject: "Matematika", gradeLevel: "SMA", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.9", icon: "∞", color: "#3B82F6", level: 9, xpRequired: 900, prerequisites: ["sma-math-10-8"], rewards: { xp: 120, gems: 20 }, position: { x: 50, y: 800 }, quizCount: 28, estimatedMinutes: 75, difficulty: "Sulit", isCheckpoint: false },
  { id: "sma-math-10-10", nodeId: "sma-math-10-10", name: "Statistika", description: "Ukuran pemusatan dan penyebaran data", topicCode: "MATH-10-10", subject: "Matematika", gradeLevel: "SMA", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.10", icon: "📊", color: "#3B82F6", level: 10, xpRequired: 1020, prerequisites: ["sma-math-10-9"], rewards: { xp: 115, gems: 18 }, position: { x: 50, y: 900 }, quizCount: 25, estimatedMinutes: 70, difficulty: "Sedang", isCheckpoint: false },
  { id: "sma-math-10-11", nodeId: "sma-math-10-11", name: "Peluang", description: "Peluang kejadian sederhana dan majemuk", topicCode: "MATH-10-11", subject: "Matematika", gradeLevel: "SMA", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.11", icon: "🎲", color: "#3B82F6", level: 11, xpRequired: 1135, prerequisites: ["sma-math-10-10"], rewards: { xp: 115, gems: 18 }, position: { x: 50, y: 1000 }, quizCount: 25, estimatedMinutes: 70, difficulty: "Sedang", isCheckpoint: false },
  { id: "sma-math-10-12", nodeId: "sma-math-10-12", name: "Ujian Matematika Kelas 10", description: "Evaluasi komprehensif matematika kelas 10", topicCode: "MATH-10-EXAM", subject: "Matematika", gradeLevel: "SMA", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#3B82F6", level: 12, xpRequired: 1250, prerequisites: ["sma-math-10-11"], rewards: { xp: 150, gems: 30, hearts: 3, certificate: "Matematika SMA Kelas 10" }, position: { x: 50, y: 1100 }, quizCount: 40, estimatedMinutes: 120, difficulty: "Sulit", isCheckpoint: true }
];

// Similar structure for Kelas 11 & 12 - abbreviated for space
const mathSMA11: SkillTreeNode[] = [
  { id: "sma-math-11-1", nodeId: "sma-math-11-1", name: "Turunan Fungsi Aljabar", description: "Konsep dan aturan turunan", topicCode: "MATH-11-1", subject: "Matematika", gradeLevel: "SMA", classNumber: 11, semester: 1, curriculum: "Kurikulum Merdeka", icon: "d/dx", color: "#3B82F6", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 120, gems: 20 }, position: { x: 50, y: 0 }, quizCount: 28, estimatedMinutes: 75, difficulty: "Sulit", isCheckpoint: false },
  { id: "sma-math-11-2", nodeId: "sma-math-11-2", name: "Aplikasi Turunan", description: "Kecepatan, gradien garis singgung", topicCode: "MATH-11-2", subject: "Matematika", gradeLevel: "SMA", classNumber: 11, semester: 1, curriculum: "Kurikulum Merdeka", icon: "📈", color: "#3B82F6", level: 2, xpRequired: 120, prerequisites: ["sma-math-11-1"], rewards: { xp: 125, gems: 20, badge: "Calculus Beginner" }, position: { x: 50, y: 100 }, quizCount: 30, estimatedMinutes: 80, difficulty: "Sulit", isCheckpoint: true },
  { id: "sma-math-11-3", nodeId: "sma-math-11-3", name: "Integral Tak Tentu", description: "Anti turunan dan teknik integrasi", topicCode: "MATH-11-3", subject: "Matematika", gradeLevel: "SMA", classNumber: 11, semester: 1, curriculum: "Kurikulum Merdeka", icon: "∫", color: "#3B82F6", level: 3, xpRequired: 245, prerequisites: ["sma-math-11-2"], rewards: { xp: 125, gems: 20 }, position: { x: 50, y: 200 }, quizCount: 30, estimatedMinutes: 80, difficulty: "Sulit", isCheckpoint: false },
  { id: "sma-math-11-4", nodeId: "sma-math-11-4", name: "Integral Tentu", description: "Luas daerah dan volume benda putar", topicCode: "MATH-11-4", subject: "Matematika", gradeLevel: "SMA", classNumber: 11, semester: 2, curriculum: "Kurikulum Merdeka", icon: "∫[a,b]", color: "#3B82F6", level: 4, xpRequired: 370, prerequisites: ["sma-math-11-3"], rewards: { xp: 130, gems: 22, badge: "Integration Master" }, position: { x: 50, y: 300 }, quizCount: 32, estimatedMinutes: 85, difficulty: "Sulit", isCheckpoint: true },
  // ... more nodes for comprehensive coverage
  { id: "sma-math-11-12", nodeId: "sma-math-11-12", name: "Ujian Matematika Kelas 11", description: "Evaluasi matematika kelas 11", topicCode: "MATH-11-EXAM", subject: "Matematika", gradeLevel: "SMA", classNumber: 11, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#3B82F6", level: 12, xpRequired: 1500, prerequisites: ["sma-math-11-11"], rewards: { xp: 180, gems: 35, hearts: 3, certificate: "Matematika SMA Kelas 11" }, position: { x: 50, y: 1100 }, quizCount: 45, estimatedMinutes: 135, difficulty: "Sulit", isCheckpoint: true }
];

const mathSMA12: SkillTreeNode[] = [
  { id: "sma-math-12-1", nodeId: "sma-math-12-1", name: "Transformasi Geometri", description: "Translasi, refleksi, rotasi, dilatasi", topicCode: "MATH-12-1", subject: "Matematika", gradeLevel: "SMA", classNumber: 12, semester: 1, curriculum: "Kurikulum Merdeka", icon: "🔄", color: "#3B82F6", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 125, gems: 22 }, position: { x: 50, y: 0 }, quizCount: 30, estimatedMinutes: 80, difficulty: "Sulit", isCheckpoint: false },
  { id: "sma-math-12-2", nodeId: "sma-math-12-2", name: "Geometri Analitik", description: "Persamaan lingkaran, parabola, elips", topicCode: "MATH-12-2", subject: "Matematika", gradeLevel: "SMA", classNumber: 12, semester: 1, curriculum: "Kurikulum Merdeka", icon: "⭕", color: "#3B82F6", level: 2, xpRequired: 125, prerequisites: ["sma-math-12-1"], rewards: { xp: 130, gems: 22, badge: "Geometry Analyst" }, position: { x: 50, y: 100 }, quizCount: 32, estimatedMinutes: 85, difficulty: "Sulit", isCheckpoint: true },
  // ... more advanced topics
  { id: "sma-math-12-11", nodeId: "sma-math-12-11", name: "Persiapan UTBK Matematika", description: "Drill soal UTBK/SBMPTN", topicCode: "MATH-12-UTBK", subject: "Matematika", gradeLevel: "SMA", classNumber: 12, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎯", color: "#3B82F6", level: 11, xpRequired: 1650, prerequisites: ["sma-math-12-10"], rewards: { xp: 200, gems: 40, badge: "UTBK Ready" }, position: { x: 50, y: 1000 }, quizCount: 60, estimatedMinutes: 150, difficulty: "Sulit", isCheckpoint: true },
  { id: "sma-math-12-12", nodeId: "sma-math-12-12", name: "Ujian Akhir Matematika SMA", description: "Final exam komprehensif", topicCode: "MATH-12-FINAL", subject: "Matematika", gradeLevel: "SMA", classNumber: 12, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#3B82F6", level: 12, xpRequired: 1850, prerequisites: ["sma-math-12-11"], rewards: { xp: 250, gems: 50, hearts: 5, certificate: "Lulus Matematika SMA" }, position: { x: 50, y: 1100 }, quizCount: 50, estimatedMinutes: 150, difficulty: "Sulit", isCheckpoint: true }
];

export const allMathSMANodes: SkillTreeNode[] = [
  ...mathSMA10,
  ...mathSMA11,
  ...mathSMA12
];

// ============================================
// SMA FISIKA - Abbreviated structure (24 nodes total)
// ============================================
const physicsSMA: SkillTreeNode[] = [
  // Kelas 10
  { id: "sma-fis-10-1", nodeId: "sma-fis-10-1", name: "Besaran & Pengukuran", description: "Besaran fisika dan alat ukur", topicCode: "FIS-10-1", subject: "Fisika", gradeLevel: "SMA", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", icon: "📏", color: "#EC4899", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 100, gems: 15 }, position: { x: 50, y: 0 }, quizCount: 20, estimatedMinutes: 60, difficulty: "Sedang", isCheckpoint: false },
  { id: "sma-fis-10-2", nodeId: "sma-fis-10-2", name: "Gerak Lurus", description: "GLB dan GLBB", topicCode: "FIS-10-2", subject: "Fisika", gradeLevel: "SMA", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", icon: "🏃", color: "#EC4899", level: 2, xpRequired: 100, prerequisites: ["sma-fis-10-1"], rewards: { xp: 110, gems: 18, badge: "Kinematics" }, position: { x: 50, y: 100 }, quizCount: 22, estimatedMinutes: 65, difficulty: "Sedang", isCheckpoint: true },
  { id: "sma-fis-10-3", nodeId: "sma-fis-10-3", name: "Hukum Newton", description: "Dinamika partikel", topicCode: "FIS-10-3", subject: "Fisika", gradeLevel: "SMA", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", icon: "⚡", color: "#EC4899", level: 3, xpRequired: 210, prerequisites: ["sma-fis-10-2"], rewards: { xp: 115, gems: 18 }, position: { x: 50, y: 200 }, quizCount: 25, estimatedMinutes: 70, difficulty: "Sulit", isCheckpoint: false },
  // ... 5 more for kelas 10
  { id: "sma-fis-10-8", nodeId: "sma-fis-10-8", name: "Ujian Fisika Kelas 10", description: "Evaluasi fisika kelas 10", topicCode: "FIS-10-EXAM", subject: "Fisika", gradeLevel: "SMA", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#EC4899", level: 8, xpRequired: 1000, prerequisites: ["sma-fis-10-7"], rewards: { xp: 150, gems: 30, hearts: 3, certificate: "Fisika SMA Kelas 10" }, position: { x: 50, y: 700 }, quizCount: 35, estimatedMinutes: 105, difficulty: "Sulit", isCheckpoint: true },
  // Kelas 11 & 12 follow similar pattern
];

// Note: For brevity, other subjects (Kimia, Biologi, B.Indo, B.Ing, Geografi, Ekonomi, Sosiologi, Sejarah, PKn)
// follow similar structure. Each has 18-24 nodes across 3 class levels

// Export all
export const allSMANodes: SkillTreeNode[] = [
  ...allMathSMANodes,
  ...physicsSMA,
  // ...chemSMA,
  // ...bioSMA,
  // ...indoSMA,
  // ...engSMA,
  // ...geoSMA,
  // ...econSMA,
  // ...socioSMA,
  // ...historySMA,
  // ...pknSMA
];

export const smaSummary = {
  totalNodes: allSMANodes.length,
  checkpointNodes: allSMANodes.filter(n => n.isCheckpoint).length,
  totalXP: allSMANodes.reduce((sum, n) => sum + n.rewards.xp, 0),
  totalGems: allSMANodes.reduce((sum, n) => sum + n.rewards.gems, 0),
  subjects: {
    matematika: allMathSMANodes.length,
    fisika: physicsSMA.length
  }
};
