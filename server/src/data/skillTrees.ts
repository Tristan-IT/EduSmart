/**
 * Skill Tree Structures for All Subjects
 * Defines nodes, prerequisites, unlock paths for gamified learning
 */

import { Types } from 'mongoose';

export interface SkillTreeNode {
  id: string;
  name: string;
  description: string;
  topicCode: string;
  subject: string;
  gradeLevel: string;
  icon: string;
  color: string;
  level: number; // 1-10, progression difficulty
  xpRequired: number;
  prerequisites: string[]; // IDs of nodes that must be completed first
  rewards: {
    xp: number;
    gems: number;
    badge?: string;
  };
  position: {
    x: number; // For visual layout
    y: number;
  };
  quizCount: number; // Number of quizzes in this node
  estimatedMinutes: number;
}

// ============================================
// MATEMATIKA SKILL TREE (SMA)
// ============================================

export const mathSkillTreeSMA: SkillTreeNode[] = [
  // Level 1 - Foundation
  {
    id: 'math-sma-aljabar-basic',
    name: 'Aljabar Dasar',
    description: 'Pelajari variabel, konstanta, dan persamaan linear',
    topicCode: 'ALG-01',
    subject: 'Matematika',
    gradeLevel: 'SMA',
    icon: '🔢',
    color: '#3B82F6',
    level: 1,
    xpRequired: 0,
    prerequisites: [],
    rewards: { xp: 100, gems: 10, badge: 'Algebra Novice' },
    position: { x: 0, y: 0 },
    quizCount: 20,
    estimatedMinutes: 120
  },
  {
    id: 'math-sma-geometri-basic',
    name: 'Geometri Dasar',
    description: 'Bangun datar, luas, keliling, dan sudut',
    topicCode: 'GEOM-01',
    subject: 'Matematika',
    gradeLevel: 'SMA',
    icon: '📐',
    color: '#10B981',
    level: 1,
    xpRequired: 0,
    prerequisites: [],
    rewards: { xp: 100, gems: 10 },
    position: { x: 200, y: 0 },
    quizCount: 12,
    estimatedMinutes: 90
  },

  // Level 2 - Intermediate
  {
    id: 'math-sma-trigonometri',
    name: 'Trigonometri',
    description: 'Fungsi trigonometri, identitas, dan aplikasi',
    topicCode: 'TRIG-01',
    subject: 'Matematika',
    gradeLevel: 'SMA',
    icon: '📊',
    color: '#8B5CF6',
    level: 2,
    xpRequired: 100,
    prerequisites: ['math-sma-geometri-basic'],
    rewards: { xp: 150, gems: 15, badge: 'Trigonometry Master' },
    position: { x: 200, y: 150 },
    quizCount: 20,
    estimatedMinutes: 150
  },
  {
    id: 'math-sma-aljabar-advanced',
    name: 'Aljabar Lanjut',
    description: 'Persamaan kuadrat, fungsi, dan sistem persamaan',
    topicCode: 'ALG-02',
    subject: 'Matematika',
    gradeLevel: 'SMA',
    icon: '🎯',
    color: '#3B82F6',
    level: 2,
    xpRequired: 100,
    prerequisites: ['math-sma-aljabar-basic'],
    rewards: { xp: 150, gems: 15 },
    position: { x: 0, y: 150 },
    quizCount: 18,
    estimatedMinutes: 140
  },

  // Level 3 - Advanced
  {
    id: 'math-sma-kalkulus',
    name: 'Kalkulus',
    description: 'Limit, turunan, dan integral',
    topicCode: 'CALC-01',
    subject: 'Matematika',
    gradeLevel: 'SMA',
    icon: '∫',
    color: '#EF4444',
    level: 3,
    xpRequired: 250,
    prerequisites: ['math-sma-aljabar-advanced', 'math-sma-trigonometri'],
    rewards: { xp: 200, gems: 20, badge: 'Calculus Expert' },
    position: { x: 100, y: 300 },
    quizCount: 20,
    estimatedMinutes: 180
  },
  {
    id: 'math-sma-statistika',
    name: 'Statistika',
    description: 'Pengolahan data, mean, median, modus',
    topicCode: 'STAT-01',
    subject: 'Matematika',
    gradeLevel: 'SMA',
    icon: '📈',
    color: '#F59E0B',
    level: 3,
    xpRequired: 250,
    prerequisites: ['math-sma-aljabar-basic'],
    rewards: { xp: 180, gems: 18 },
    position: { x: -100, y: 300 },
    quizCount: 15,
    estimatedMinutes: 120
  },
  {
    id: 'math-sma-peluang',
    name: 'Peluang',
    description: 'Probabilitas, kombinatorik, permutasi',
    topicCode: 'PROB-01',
    subject: 'Matematika',
    gradeLevel: 'SMA',
    icon: '🎲',
    color: '#EC4899',
    level: 3,
    xpRequired: 250,
    prerequisites: ['math-sma-statistika'],
    rewards: { xp: 180, gems: 18, badge: 'Probability Pro' },
    position: { x: -100, y: 450 },
    quizCount: 20,
    estimatedMinutes: 150
  }
];

// ============================================
// FISIKA SKILL TREE (SMA)
// ============================================

export const physicsSkillTreeSMA: SkillTreeNode[] = [
  {
    id: 'physics-sma-mekanika',
    name: 'Mekanika',
    description: 'Gerak, gaya, energi, dan momentum',
    topicCode: 'FIS-MEK-01',
    subject: 'Fisika',
    gradeLevel: 'SMA',
    icon: '⚙️',
    color: '#3B82F6',
    level: 1,
    xpRequired: 0,
    prerequisites: [],
    rewards: { xp: 120, gems: 12, badge: 'Mechanics Beginner' },
    position: { x: 0, y: 0 },
    quizCount: 7,
    estimatedMinutes: 100
  },
  {
    id: 'physics-sma-termodinamika',
    name: 'Termodinamika',
    description: 'Suhu, kalor, dan hukum termodinamika',
    topicCode: 'FIS-TERMO-01',
    subject: 'Fisika',
    gradeLevel: 'SMA',
    icon: '🌡️',
    color: '#EF4444',
    level: 2,
    xpRequired: 120,
    prerequisites: ['physics-sma-mekanika'],
    rewards: { xp: 140, gems: 14 },
    position: { x: 0, y: 150 },
    quizCount: 3,
    estimatedMinutes: 80
  },
  {
    id: 'physics-sma-listrik',
    name: 'Listrik & Magnet',
    description: 'Arus listrik, tegangan, dan medan magnet',
    topicCode: 'FIS-LIST-01',
    subject: 'Fisika',
    gradeLevel: 'SMA',
    icon: '⚡',
    color: '#F59E0B',
    level: 2,
    xpRequired: 120,
    prerequisites: ['physics-sma-mekanika'],
    rewards: { xp: 150, gems: 15, badge: 'Electricity Master' },
    position: { x: 150, y: 150 },
    quizCount: 3,
    estimatedMinutes: 90
  }
];

// ============================================
// KIMIA SKILL TREE (SMA)
// ============================================

export const chemistrySkillTreeSMA: SkillTreeNode[] = [
  {
    id: 'chemistry-sma-struktur-atom',
    name: 'Struktur Atom',
    description: 'Partikel atom, konfigurasi elektron, tabel periodik',
    topicCode: 'KIM-ATOM-01',
    subject: 'Kimia',
    gradeLevel: 'SMA',
    icon: '⚛️',
    color: '#8B5CF6',
    level: 1,
    xpRequired: 0,
    prerequisites: [],
    rewards: { xp: 110, gems: 11 },
    position: { x: 0, y: 0 },
    quizCount: 3,
    estimatedMinutes: 70
  },
  {
    id: 'chemistry-sma-ikatan-kimia',
    name: 'Ikatan Kimia',
    description: 'Ikatan ionik, kovalen, dan logam',
    topicCode: 'KIM-IKATAN-01',
    subject: 'Kimia',
    gradeLevel: 'SMA',
    icon: '🔗',
    color: '#10B981',
    level: 2,
    xpRequired: 110,
    prerequisites: ['chemistry-sma-struktur-atom'],
    rewards: { xp: 130, gems: 13, badge: 'Bonding Expert' },
    position: { x: 0, y: 150 },
    quizCount: 3,
    estimatedMinutes: 80
  }
];

// ============================================
// BIOLOGI SKILL TREE (SMA)
// ============================================

export const biologySkillTreeSMA: SkillTreeNode[] = [
  {
    id: 'biology-sma-sel',
    name: 'Biologi Sel',
    description: 'Struktur sel, organel, dan fungsinya',
    topicCode: 'BIO-SEL-01',
    subject: 'Biologi',
    gradeLevel: 'SMA',
    icon: '🔬',
    color: '#10B981',
    level: 1,
    xpRequired: 0,
    prerequisites: [],
    rewards: { xp: 100, gems: 10 },
    position: { x: 0, y: 0 },
    quizCount: 5,
    estimatedMinutes: 90
  },
  {
    id: 'biology-sma-genetika',
    name: 'Genetika',
    description: 'DNA, RNA, pewarisan sifat, hukum Mendel',
    topicCode: 'BIO-GEN-01',
    subject: 'Biologi',
    gradeLevel: 'SMA',
    icon: '🧬',
    color: '#3B82F6',
    level: 2,
    xpRequired: 100,
    prerequisites: ['biology-sma-sel'],
    rewards: { xp: 140, gems: 14, badge: 'Genetics Master' },
    position: { x: 0, y: 150 },
    quizCount: 4,
    estimatedMinutes: 100
  },
  {
    id: 'biology-sma-ekologi',
    name: 'Ekologi',
    description: 'Ekosistem, rantai makanan, siklus biogeokimia',
    topicCode: 'BIO-EKO-01',
    subject: 'Biologi',
    gradeLevel: 'SMA',
    icon: '🌿',
    color: '#10B981',
    level: 2,
    xpRequired: 100,
    prerequisites: ['biology-sma-sel'],
    rewards: { xp: 130, gems: 13 },
    position: { x: 150, y: 150 },
    quizCount: 3,
    estimatedMinutes: 85
  }
];

// ============================================
// MATEMATIKA SKILL TREE (SMP)
// ============================================

export const mathSkillTreeSMP: SkillTreeNode[] = [
  {
    id: 'math-smp-bilangan-bulat',
    name: 'Bilangan Bulat',
    description: 'Operasi hitung bilangan bulat positif dan negatif',
    topicCode: 'SMP-MTK-BILBULAT-01',
    subject: 'Matematika',
    gradeLevel: 'SMP',
    icon: '➕',
    color: '#3B82F6',
    level: 1,
    xpRequired: 0,
    prerequisites: [],
    rewards: { xp: 80, gems: 8 },
    position: { x: 0, y: 0 },
    quizCount: 15,
    estimatedMinutes: 60
  },
  {
    id: 'math-smp-pecahan',
    name: 'Pecahan',
    description: 'Operasi pecahan, pecahan campuran, penyederhanaan',
    topicCode: 'SMP-MTK-PECAHAN-01',
    subject: 'Matematika',
    gradeLevel: 'SMP',
    icon: '½',
    color: '#10B981',
    level: 1,
    xpRequired: 0,
    prerequisites: [],
    rewards: { xp: 80, gems: 8 },
    position: { x: 150, y: 0 },
    quizCount: 15,
    estimatedMinutes: 70
  },
  {
    id: 'math-smp-aljabar',
    name: 'Aljabar Dasar',
    description: 'Variabel, persamaan linear, penyederhanaan',
    topicCode: 'SMP-MTK-ALJABAR-01',
    subject: 'Matematika',
    gradeLevel: 'SMP',
    icon: '🔢',
    color: '#8B5CF6',
    level: 2,
    xpRequired: 80,
    prerequisites: ['math-smp-bilangan-bulat'],
    rewards: { xp: 100, gems: 10, badge: 'Algebra Starter' },
    position: { x: 0, y: 150 },
    quizCount: 20,
    estimatedMinutes: 90
  },
  {
    id: 'math-smp-geometri',
    name: 'Geometri Dasar',
    description: 'Bangun datar, keliling, luas, sudut',
    topicCode: 'SMP-MTK-GEOMETRI-01',
    subject: 'Matematika',
    gradeLevel: 'SMP',
    icon: '📐',
    color: '#F59E0B',
    level: 2,
    xpRequired: 80,
    prerequisites: ['math-smp-pecahan'],
    rewards: { xp: 100, gems: 10 },
    position: { x: 150, y: 150 },
    quizCount: 20,
    estimatedMinutes: 100
  }
];

// ============================================
// IPA SKILL TREE (SMP)
// ============================================

export const scienceSkillTreeSMP: SkillTreeNode[] = [
  {
    id: 'science-smp-gerak',
    name: 'Gerak',
    description: 'Kecepatan, percepatan, GLB, GLBB',
    topicCode: 'SMP-IPA-GERAK-01',
    subject: 'IPA',
    gradeLevel: 'SMP',
    icon: '🏃',
    color: '#3B82F6',
    level: 1,
    xpRequired: 0,
    prerequisites: [],
    rewards: { xp: 90, gems: 9 },
    position: { x: 0, y: 0 },
    quizCount: 15,
    estimatedMinutes: 80
  },
  {
    id: 'science-smp-klasifikasi',
    name: 'Klasifikasi Makhluk Hidup',
    description: 'Taksonomi, kingdom, karakteristik makhluk hidup',
    topicCode: 'SMP-IPA-KLASIFIKASI-01',
    subject: 'IPA',
    gradeLevel: 'SMP',
    icon: '🦋',
    color: '#10B981',
    level: 1,
    xpRequired: 0,
    prerequisites: [],
    rewards: { xp: 85, gems: 8 },
    position: { x: 150, y: 0 },
    quizCount: 15,
    estimatedMinutes: 75
  },
  {
    id: 'science-smp-energi',
    name: 'Energi dan Perubahannya',
    description: 'Bentuk energi, konversi energi, hukum kekekalan',
    topicCode: 'SMP-IPA-ENERGI-01',
    subject: 'IPA',
    gradeLevel: 'SMP',
    icon: '⚡',
    color: '#F59E0B',
    level: 2,
    xpRequired: 90,
    prerequisites: ['science-smp-gerak'],
    rewards: { xp: 110, gems: 11, badge: 'Energy Expert' },
    position: { x: 0, y: 150 },
    quizCount: 15,
    estimatedMinutes: 90
  },
  {
    id: 'science-smp-ekosistem',
    name: 'Ekosistem',
    description: 'Komponen ekosistem, rantai makanan, interaksi',
    topicCode: 'SMP-IPA-EKOSISTEM-01',
    subject: 'IPA',
    gradeLevel: 'SMP',
    icon: '🌳',
    color: '#10B981',
    level: 2,
    xpRequired: 85,
    prerequisites: ['science-smp-klasifikasi'],
    rewards: { xp: 105, gems: 10 },
    position: { x: 150, y: 150 },
    quizCount: 15,
    estimatedMinutes: 85
  }
];

// ============================================
// MATEMATIKA SKILL TREE (SD)
// ============================================

export const mathSkillTreeSD: SkillTreeNode[] = [
  {
    id: 'math-sd-tambah-kurang',
    name: 'Penjumlahan & Pengurangan',
    description: 'Operasi dasar tambah dan kurang',
    topicCode: 'SD-MTK-TAMBAHKURANG-01',
    subject: 'Matematika',
    gradeLevel: 'SD',
    icon: '➕',
    color: '#3B82F6',
    level: 1,
    xpRequired: 0,
    prerequisites: [],
    rewards: { xp: 50, gems: 5 },
    position: { x: 0, y: 0 },
    quizCount: 15,
    estimatedMinutes: 40
  },
  {
    id: 'math-sd-kali-bagi',
    name: 'Perkalian & Pembagian',
    description: 'Operasi kali dan bagi, hafalan tabel perkalian',
    topicCode: 'SD-MTK-KALIDIBAGI-01',
    subject: 'Matematika',
    gradeLevel: 'SD',
    icon: '✖️',
    color: '#10B981',
    level: 2,
    xpRequired: 50,
    prerequisites: ['math-sd-tambah-kurang'],
    rewards: { xp: 60, gems: 6, badge: 'Multiplication Master' },
    position: { x: 0, y: 100 },
    quizCount: 15,
    estimatedMinutes: 50
  },
  {
    id: 'math-sd-pecahan',
    name: 'Pecahan Sederhana',
    description: 'Mengenal pecahan, operasi dasar pecahan',
    topicCode: 'SD-MTK-PECAHAN-01',
    subject: 'Matematika',
    gradeLevel: 'SD',
    icon: '½',
    color: '#8B5CF6',
    level: 3,
    xpRequired: 110,
    prerequisites: ['math-sd-kali-bagi'],
    rewards: { xp: 70, gems: 7 },
    position: { x: 0, y: 200 },
    quizCount: 10,
    estimatedMinutes: 45
  },
  {
    id: 'math-sd-bangun-datar',
    name: 'Bangun Datar',
    description: 'Mengenal bentuk, keliling, luas bangun datar',
    topicCode: 'SD-MTK-BANGUNDATAR-01',
    subject: 'Matematika',
    gradeLevel: 'SD',
    icon: '⬜',
    color: '#F59E0B',
    level: 3,
    xpRequired: 110,
    prerequisites: ['math-sd-kali-bagi'],
    rewards: { xp: 65, gems: 6 },
    position: { x: 150, y: 200 },
    quizCount: 10,
    estimatedMinutes: 50
  }
];

// ============================================
// IPA SKILL TREE (SD)
// ============================================

export const scienceSkillTreeSD: SkillTreeNode[] = [
  {
    id: 'science-sd-tubuh',
    name: 'Bagian Tubuh',
    description: 'Alat indra, organ tubuh, fungsinya',
    topicCode: 'SD-IPA-TUBUH-01',
    subject: 'IPA',
    gradeLevel: 'SD',
    icon: '👤',
    color: '#EF4444',
    level: 1,
    xpRequired: 0,
    prerequisites: [],
    rewards: { xp: 50, gems: 5 },
    position: { x: 0, y: 0 },
    quizCount: 10,
    estimatedMinutes: 35
  },
  {
    id: 'science-sd-tumbuhan',
    name: 'Tumbuhan',
    description: 'Bagian tumbuhan, fotosintesis, jenis tumbuhan',
    topicCode: 'SD-IPA-TUMBUHAN-01',
    subject: 'IPA',
    gradeLevel: 'SD',
    icon: '🌱',
    color: '#10B981',
    level: 1,
    xpRequired: 0,
    prerequisites: [],
    rewards: { xp: 50, gems: 5 },
    position: { x: 150, y: 0 },
    quizCount: 10,
    estimatedMinutes: 40
  },
  {
    id: 'science-sd-hewan',
    name: 'Hewan',
    description: 'Klasifikasi hewan, habitat, reproduksi',
    topicCode: 'SD-IPA-HEWAN-01',
    subject: 'IPA',
    gradeLevel: 'SD',
    icon: '🐶',
    color: '#F59E0B',
    level: 2,
    xpRequired: 50,
    prerequisites: ['science-sd-tubuh'],
    rewards: { xp: 60, gems: 6, badge: 'Animal Expert' },
    position: { x: 0, y: 100 },
    quizCount: 10,
    estimatedMinutes: 45
  },
  {
    id: 'science-sd-energi',
    name: 'Energi',
    description: 'Sumber energi, cahaya, panas, bunyi',
    topicCode: 'SD-IPA-ENERGI-01',
    subject: 'IPA',
    gradeLevel: 'SD',
    icon: '☀️',
    color: '#F59E0B',
    level: 2,
    xpRequired: 50,
    prerequisites: ['science-sd-tumbuhan'],
    rewards: { xp: 60, gems: 6 },
    position: { x: 150, y: 100 },
    quizCount: 10,
    estimatedMinutes: 40
  }
];

// ============================================
// EXPORT ALL SKILL TREES
// ============================================

export const allSkillTrees = {
  // SMA
  'Matematika-SMA': mathSkillTreeSMA,
  'Fisika-SMA': physicsSkillTreeSMA,
  'Kimia-SMA': chemistrySkillTreeSMA,
  'Biologi-SMA': biologySkillTreeSMA,
  
  // SMP
  'Matematika-SMP': mathSkillTreeSMP,
  'IPA-SMP': scienceSkillTreeSMP,
  
  // SD
  'Matematika-SD': mathSkillTreeSD,
  'IPA-SD': scienceSkillTreeSD
};

export default allSkillTrees;

/**
 * Helper function to get skill tree by subject and grade
 */
export const getSkillTree = (subject: string, gradeLevel: string): SkillTreeNode[] => {
  const key = `${subject}-${gradeLevel}`;
  return allSkillTrees[key as keyof typeof allSkillTrees] || [];
};

/**
 * Helper to calculate total XP required for a path
 */
export const calculatePathXP = (nodeIds: string[], skillTree: SkillTreeNode[]): number => {
  return nodeIds.reduce((total, id) => {
    const node = skillTree.find(n => n.id === id);
    return total + (node?.rewards.xp || 0);
  }, 0);
};

/**
 * Helper to check if node is unlocked
 */
export const isNodeUnlocked = (
  nodeId: string,
  completedNodes: string[],
  skillTree: SkillTreeNode[]
): boolean => {
  const node = skillTree.find(n => n.id === nodeId);
  if (!node) return false;
  
  // Check if all prerequisites are completed
  return node.prerequisites.every(prereqId => completedNodes.includes(prereqId));
};
