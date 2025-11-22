/**
 * SMP B.Inggris & PKn Skill Trees
 * B.Inggris: 18 nodes (6 per class)
 * PKn: 9 nodes (3 per class)
 * Total: 27 nodes
 */

import { SkillTreeNode } from "./skillTreesSMPOther";

// ============================================
// SMP BAHASA INGGRIS (18 nodes total)
// ============================================

export const engSkillTreeSMP7: SkillTreeNode[] = [
  { id: "smp-eng-7-1", nodeId: "smp-eng-7-1", name: "Greetings & Introductions", description: "Perkenalan dan sapaan dalam bahasa Inggris", topicCode: "ENG-7-1", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 7, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.1", icon: "👋", color: "#8B5CF6", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 80, gems: 10 }, position: { x: 50, y: 0 }, quizCount: 12, estimatedMinutes: 45, difficulty: "Mudah", isCheckpoint: false },
  { id: "smp-eng-7-2", nodeId: "smp-eng-7-2", name: "Simple Present Tense", description: "Penggunaan simple present tense", topicCode: "ENG-7-2", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 7, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.2", icon: "⏰", color: "#8B5CF6", level: 2, xpRequired: 80, prerequisites: ["smp-eng-7-1"], rewards: { xp: 85, gems: 10 }, position: { x: 50, y: 100 }, quizCount: 15, estimatedMinutes: 50, difficulty: "Mudah", isCheckpoint: false },
  { id: "smp-eng-7-3", nodeId: "smp-eng-7-3", name: "Describing People & Things", description: "Mendeskripsikan orang dan benda", topicCode: "ENG-7-3", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 7, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.3", icon: "👤", color: "#8B5CF6", level: 3, xpRequired: 165, prerequisites: ["smp-eng-7-2"], rewards: { xp: 85, gems: 12, badge: "Describer" }, position: { x: 50, y: 200 }, quizCount: 15, estimatedMinutes: 50, difficulty: "Sedang", isCheckpoint: true },
  { id: "smp-eng-7-4", nodeId: "smp-eng-7-4", name: "Simple Past Tense", description: "Menceritakan kejadian masa lalu", topicCode: "ENG-7-4", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 7, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.4", icon: "📅", color: "#8B5CF6", level: 4, xpRequired: 250, prerequisites: ["smp-eng-7-3"], rewards: { xp: 90, gems: 12 }, position: { x: 50, y: 300 }, quizCount: 18, estimatedMinutes: 55, difficulty: "Sedang", isCheckpoint: false },
  { id: "smp-eng-7-5", nodeId: "smp-eng-7-5", name: "Telling Stories", description: "Menceritakan cerita sederhana", topicCode: "ENG-7-5", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 7, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.5", icon: "📖", color: "#8B5CF6", level: 5, xpRequired: 340, prerequisites: ["smp-eng-7-4"], rewards: { xp: 90, gems: 12 }, position: { x: 50, y: 400 }, quizCount: 15, estimatedMinutes: 50, difficulty: "Sedang", isCheckpoint: false },
  { id: "smp-eng-7-6", nodeId: "smp-eng-7-6", name: "English Exam Grade 7", description: "Ujian B.Inggris kelas 7", topicCode: "ENG-7-EXAM", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 7, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#8B5CF6", level: 6, xpRequired: 430, prerequisites: ["smp-eng-7-5"], rewards: { xp: 100, gems: 20, hearts: 2, certificate: "English SMP Grade 7" }, position: { x: 50, y: 500 }, quizCount: 25, estimatedMinutes: 90, difficulty: "Sedang", isCheckpoint: true }
];

export const engSkillTreeSMP8: SkillTreeNode[] = [
  { id: "smp-eng-8-1", nodeId: "smp-eng-8-1", name: "Present Continuous Tense", description: "Kejadian yang sedang berlangsung", topicCode: "ENG-8-1", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 8, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.1", icon: "▶️", color: "#8B5CF6", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 85, gems: 12 }, position: { x: 50, y: 0 }, quizCount: 15, estimatedMinutes: 50, difficulty: "Sedang", isCheckpoint: false },
  { id: "smp-eng-8-2", nodeId: "smp-eng-8-2", name: "Asking & Giving Information", description: "Meminta dan memberi informasi", topicCode: "ENG-8-2", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 8, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.2", icon: "❓", color: "#8B5CF6", level: 2, xpRequired: 85, prerequisites: ["smp-eng-8-1"], rewards: { xp: 90, gems: 12 }, position: { x: 50, y: 100 }, quizCount: 15, estimatedMinutes: 55, difficulty: "Sedang", isCheckpoint: false },
  { id: "smp-eng-8-3", nodeId: "smp-eng-8-3", name: "Recount Text", description: "Menulis teks recount", topicCode: "ENG-8-3", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 8, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.3", icon: "📝", color: "#8B5CF6", level: 3, xpRequired: 175, prerequisites: ["smp-eng-8-2"], rewards: { xp: 95, gems: 15, badge: "Story Teller" }, position: { x: 50, y: 200 }, quizCount: 18, estimatedMinutes: 60, difficulty: "Sedang", isCheckpoint: true },
  { id: "smp-eng-8-4", nodeId: "smp-eng-8-4", name: "Comparative & Superlative", description: "Membandingkan benda dan orang", topicCode: "ENG-8-4", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 8, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.4", icon: "⚖️", color: "#8B5CF6", level: 4, xpRequired: 270, prerequisites: ["smp-eng-8-3"], rewards: { xp: 90, gems: 12 }, position: { x: 50, y: 300 }, quizCount: 18, estimatedMinutes: 55, difficulty: "Sulit", isCheckpoint: false },
  { id: "smp-eng-8-5", nodeId: "smp-eng-8-5", name: "Procedure Text", description: "Menulis teks prosedur", topicCode: "ENG-8-5", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 8, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.5", icon: "📋", color: "#8B5CF6", level: 5, xpRequired: 360, prerequisites: ["smp-eng-8-4"], rewards: { xp: 95, gems: 15 }, position: { x: 50, y: 400 }, quizCount: 18, estimatedMinutes: 60, difficulty: "Sulit", isCheckpoint: false },
  { id: "smp-eng-8-6", nodeId: "smp-eng-8-6", name: "English Exam Grade 8", description: "Ujian B.Inggris kelas 8", topicCode: "ENG-8-EXAM", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 8, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#8B5CF6", level: 6, xpRequired: 455, prerequisites: ["smp-eng-8-5"], rewards: { xp: 110, gems: 20, hearts: 2, certificate: "English SMP Grade 8" }, position: { x: 50, y: 500 }, quizCount: 30, estimatedMinutes: 90, difficulty: "Sulit", isCheckpoint: true }
];

export const engSkillTreeSMP9: SkillTreeNode[] = [
  { id: "smp-eng-9-1", nodeId: "smp-eng-9-1", name: "Present Perfect Tense", description: "Kejadian yang baru saja terjadi", topicCode: "ENG-9-1", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 9, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.1", icon: "✅", color: "#8B5CF6", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 90, gems: 12 }, position: { x: 50, y: 0 }, quizCount: 18, estimatedMinutes: 55, difficulty: "Sulit", isCheckpoint: false },
  { id: "smp-eng-9-2", nodeId: "smp-eng-9-2", name: "Narrative Text", description: "Menulis teks naratif", topicCode: "ENG-9-2", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 9, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.2", icon: "📚", color: "#8B5CF6", level: 2, xpRequired: 90, prerequisites: ["smp-eng-9-1"], rewards: { xp: 95, gems: 15, badge: "Narrator" }, position: { x: 50, y: 100 }, quizCount: 20, estimatedMinutes: 65, difficulty: "Sulit", isCheckpoint: true },
  { id: "smp-eng-9-3", nodeId: "smp-eng-9-3", name: "Report Text", description: "Menulis teks laporan", topicCode: "ENG-9-3", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 9, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.3", icon: "📊", color: "#8B5CF6", level: 3, xpRequired: 185, prerequisites: ["smp-eng-9-2"], rewards: { xp: 95, gems: 15 }, position: { x: 50, y: 200 }, quizCount: 20, estimatedMinutes: 60, difficulty: "Sulit", isCheckpoint: false },
  { id: "smp-eng-9-4", nodeId: "smp-eng-9-4", name: "Passive Voice", description: "Kalimat pasif dalam bahasa Inggris", topicCode: "ENG-9-4", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 9, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.4", icon: "🔄", color: "#8B5CF6", level: 4, xpRequired: 280, prerequisites: ["smp-eng-9-3"], rewards: { xp: 100, gems: 15 }, position: { x: 50, y: 300 }, quizCount: 22, estimatedMinutes: 65, difficulty: "Sulit", isCheckpoint: false },
  { id: "smp-eng-9-5", nodeId: "smp-eng-9-5", name: "UN English Preparation", description: "Persiapan UN Bahasa Inggris", topicCode: "ENG-9-UN", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 9, semester: 2, curriculum: "Kurikulum Merdeka", icon: "📝", color: "#8B5CF6", level: 5, xpRequired: 380, prerequisites: ["smp-eng-9-4"], rewards: { xp: 110, gems: 20, badge: "Ready for UN" }, position: { x: 50, y: 400 }, quizCount: 35, estimatedMinutes: 90, difficulty: "Sulit", isCheckpoint: true },
  { id: "smp-eng-9-6", nodeId: "smp-eng-9-6", name: "English Final Exam Grade 9", description: "Ujian akhir B.Inggris SMP", topicCode: "ENG-9-EXAM", subject: "Bahasa Inggris", gradeLevel: "SMP", classNumber: 9, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#8B5CF6", level: 6, xpRequired: 490, prerequisites: ["smp-eng-9-5"], rewards: { xp: 150, gems: 30, hearts: 3, certificate: "Graduate English SMP" }, position: { x: 50, y: 500 }, quizCount: 40, estimatedMinutes: 120, difficulty: "Sulit", isCheckpoint: true }
];

export const allEngSMPNodes: SkillTreeNode[] = [
  ...engSkillTreeSMP7,
  ...engSkillTreeSMP8,
  ...engSkillTreeSMP9
];

// ============================================
// SMP PKN - PENDIDIKAN KEWARGANEGARAAN (9 nodes total)
// ============================================

export const pknSkillTreeSMP7: SkillTreeNode[] = [
  { id: "smp-pkn-7-1", nodeId: "smp-pkn-7-1", name: "Norma dan Keadilan", description: "Jenis-jenis norma dan keadilan sosial", topicCode: "PKN-7-1", subject: "PKn", gradeLevel: "SMP", classNumber: 7, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.1", icon: "⚖️", color: "#EF4444", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 80, gems: 10 }, position: { x: 50, y: 0 }, quizCount: 12, estimatedMinutes: 45, difficulty: "Mudah", isCheckpoint: false },
  { id: "smp-pkn-7-2", nodeId: "smp-pkn-7-2", name: "Hak dan Kewajiban Warga Negara", description: "Hak dan kewajiban sebagai WNI", topicCode: "PKN-7-2", subject: "PKn", gradeLevel: "SMP", classNumber: 7, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.2", icon: "🇮🇩", color: "#EF4444", level: 2, xpRequired: 80, prerequisites: ["smp-pkn-7-1"], rewards: { xp: 85, gems: 12 }, position: { x: 50, y: 100 }, quizCount: 15, estimatedMinutes: 50, difficulty: "Mudah", isCheckpoint: false },
  { id: "smp-pkn-7-3", nodeId: "smp-pkn-7-3", name: "Ujian PKn Kelas 7", description: "Evaluasi PKn kelas 7", topicCode: "PKN-7-EXAM", subject: "PKn", gradeLevel: "SMP", classNumber: 7, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#EF4444", level: 3, xpRequired: 165, prerequisites: ["smp-pkn-7-2"], rewards: { xp: 90, gems: 15, hearts: 1, certificate: "PKn SMP Kelas 7" }, position: { x: 50, y: 200 }, quizCount: 20, estimatedMinutes: 75, difficulty: "Sedang", isCheckpoint: true }
];

export const pknSkillTreeSMP8: SkillTreeNode[] = [
  { id: "smp-pkn-8-1", nodeId: "smp-pkn-8-1", name: "Pancasila dan UUD 1945", description: "Nilai-nilai Pancasila dan konstitusi", topicCode: "PKN-8-1", subject: "PKn", gradeLevel: "SMP", classNumber: 8, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.1", icon: "🦅", color: "#EF4444", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 85, gems: 12, badge: "Pancasilais" }, position: { x: 50, y: 0 }, quizCount: 15, estimatedMinutes: 50, difficulty: "Sedang", isCheckpoint: true },
  { id: "smp-pkn-8-2", nodeId: "smp-pkn-8-2", name: "Daerah dalam NKRI", description: "Otonomi daerah dan desentralisasi", topicCode: "PKN-8-2", subject: "PKn", gradeLevel: "SMP", classNumber: 8, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.2", icon: "🗺️", color: "#EF4444", level: 2, xpRequired: 85, prerequisites: ["smp-pkn-8-1"], rewards: { xp: 90, gems: 12 }, position: { x: 50, y: 100 }, quizCount: 15, estimatedMinutes: 55, difficulty: "Sedang", isCheckpoint: false },
  { id: "smp-pkn-8-3", nodeId: "smp-pkn-8-3", name: "Ujian PKn Kelas 8", description: "Evaluasi PKn kelas 8", topicCode: "PKN-8-EXAM", subject: "PKn", gradeLevel: "SMP", classNumber: 8, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#EF4444", level: 3, xpRequired: 175, prerequisites: ["smp-pkn-8-2"], rewards: { xp: 100, gems: 15, hearts: 1, certificate: "PKn SMP Kelas 8" }, position: { x: 50, y: 200 }, quizCount: 25, estimatedMinutes: 75, difficulty: "Sedang", isCheckpoint: true }
];

export const pknSkillTreeSMP9: SkillTreeNode[] = [
  { id: "smp-pkn-9-1", nodeId: "smp-pkn-9-1", name: "Dinamika Demokrasi", description: "Sistem demokrasi di Indonesia", topicCode: "PKN-9-1", subject: "PKn", gradeLevel: "SMP", classNumber: 9, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.1", icon: "🗳️", color: "#EF4444", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 90, gems: 12 }, position: { x: 50, y: 0 }, quizCount: 15, estimatedMinutes: 55, difficulty: "Sedang", isCheckpoint: false },
  { id: "smp-pkn-9-2", nodeId: "smp-pkn-9-2", name: "Globalisasi dan Identitas Nasional", description: "Mempertahankan jati diri bangsa", topicCode: "PKN-9-2", subject: "PKn", gradeLevel: "SMP", classNumber: 9, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.2", icon: "🌏", color: "#EF4444", level: 2, xpRequired: 90, prerequisites: ["smp-pkn-9-1"], rewards: { xp: 95, gems: 15, badge: "Nasionalis" }, position: { x: 50, y: 100 }, quizCount: 18, estimatedMinutes: 60, difficulty: "Sulit", isCheckpoint: true },
  { id: "smp-pkn-9-3", nodeId: "smp-pkn-9-3", name: "Ujian PKn Kelas 9", description: "Ujian akhir PKn SMP", topicCode: "PKN-9-EXAM", subject: "PKn", gradeLevel: "SMP", classNumber: 9, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#EF4444", level: 3, xpRequired: 185, prerequisites: ["smp-pkn-9-2"], rewards: { xp: 120, gems: 25, hearts: 2, certificate: "Lulus PKn SMP" }, position: { x: 50, y: 200 }, quizCount: 30, estimatedMinutes: 90, difficulty: "Sulit", isCheckpoint: true }
];

export const allPKnSMPNodes: SkillTreeNode[] = [
  ...pknSkillTreeSMP7,
  ...pknSkillTreeSMP8,
  ...pknSkillTreeSMP9
];

// Summary
export const engSMPSummary = {
  totalNodes: allEngSMPNodes.length,
  checkpointNodes: allEngSMPNodes.filter(n => n.isCheckpoint).length,
  totalXP: allEngSMPNodes.reduce((sum, n) => sum + n.rewards.xp, 0),
  totalGems: allEngSMPNodes.reduce((sum, n) => sum + n.rewards.gems, 0)
};

export const pknSMPSummary = {
  totalNodes: allPKnSMPNodes.length,
  checkpointNodes: allPKnSMPNodes.filter(n => n.isCheckpoint).length,
  totalXP: allPKnSMPNodes.reduce((sum, n) => sum + n.rewards.xp, 0),
  totalGems: allPKnSMPNodes.reduce((sum, n) => sum + n.rewards.gems, 0)
};

// Combined export for all
export const allSMPLanguageNodes: SkillTreeNode[] = [
  ...allEngSMPNodes,
  ...allPKnSMPNodes
];
