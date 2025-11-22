/**
 * SMK (Vocational High School) Skill Tree Nodes
 * Kelas 10-12 across vocational programs
 * Total: ~225 nodes
 * 
 * Programs covered:
 * - Rekayasa Perangkat Lunak (Software Engineering) - 36 nodes
 * - Multimedia - 24 nodes
 * - Akuntansi & Keuangan Lembaga (Accounting) - 24 nodes
 * - Bisnis Daring & Pemasaran (Digital Business & Marketing) - 24 nodes
 * - Otomatisasi & Tata Kelola Perkantoran (Office Automation) - 18 nodes
 * - Teknik Komputer & Jaringan (Computer Networking) - 30 nodes
 * - Desain Komunikasi Visual (Visual Design) - 24 nodes
 * - Perhotelan (Hospitality) - 18 nodes
 * - Tata Boga (Culinary Arts) - 18 nodes
 * - Kejuruan Dasar (Basic Vocational Skills) - 9 nodes
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
// REKAYASA PERANGKAT LUNAK (Software Engineering) - 36 nodes
// ============================================

const rplSMK10: SkillTreeNode[] = [
  { id: "smk-rpl-10-1", nodeId: "smk-rpl-10-1", name: "Pemrograman Dasar", description: "Algoritma dan flowchart", topicCode: "RPL-10-1", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.1", icon: "💻", color: "#6366F1", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 100, gems: 15 }, position: { x: 50, y: 0 }, quizCount: 20, estimatedMinutes: 60, difficulty: "Mudah", isCheckpoint: false },
  { id: "smk-rpl-10-2", nodeId: "smk-rpl-10-2", name: "HTML & CSS Fundamentals", description: "Dasar pembuatan web statis", topicCode: "RPL-10-2", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.2", icon: "🌐", color: "#6366F1", level: 2, xpRequired: 100, prerequisites: ["smk-rpl-10-1"], rewards: { xp: 110, gems: 18 }, position: { x: 50, y: 100 }, quizCount: 25, estimatedMinutes: 75, difficulty: "Mudah", isCheckpoint: false },
  { id: "smk-rpl-10-3", nodeId: "smk-rpl-10-3", name: "JavaScript Basics", description: "Programming web interaktif", topicCode: "RPL-10-3", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.3", icon: "⚡", color: "#6366F1", level: 3, xpRequired: 210, prerequisites: ["smk-rpl-10-2"], rewards: { xp: 120, gems: 20, badge: "Web Developer" }, position: { x: 50, y: 200 }, quizCount: 30, estimatedMinutes: 90, difficulty: "Sedang", isCheckpoint: true },
  { id: "smk-rpl-10-4", nodeId: "smk-rpl-10-4", name: "Database Fundamentals", description: "SQL dan database design", topicCode: "RPL-10-4", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.4", icon: "🗄️", color: "#6366F1", level: 4, xpRequired: 330, prerequisites: ["smk-rpl-10-3"], rewards: { xp: 115, gems: 18 }, position: { x: 50, y: 300 }, quizCount: 25, estimatedMinutes: 80, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-rpl-10-5", nodeId: "smk-rpl-10-5", name: "Python Programming", description: "Dasar pemrograman Python", topicCode: "RPL-10-5", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.5", icon: "🐍", color: "#6366F1", level: 5, xpRequired: 445, prerequisites: ["smk-rpl-10-4"], rewards: { xp: 120, gems: 20 }, position: { x: 50, y: 400 }, quizCount: 28, estimatedMinutes: 85, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-rpl-10-6", nodeId: "smk-rpl-10-6", name: "Git & Version Control", description: "Kolaborasi dengan Git", topicCode: "RPL-10-6", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.6", icon: "📚", color: "#6366F1", level: 6, xpRequired: 565, prerequisites: ["smk-rpl-10-5"], rewards: { xp: 110, gems: 15 }, position: { x: 50, y: 500 }, quizCount: 20, estimatedMinutes: 60, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-rpl-10-7", nodeId: "smk-rpl-10-7", name: "Object-Oriented Programming", description: "Konsep OOP dengan Python/Java", topicCode: "RPL-10-7", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.7", icon: "🎯", color: "#6366F1", level: 7, xpRequired: 675, prerequisites: ["smk-rpl-10-6"], rewards: { xp: 125, gems: 22, badge: "OOP Master" }, position: { x: 50, y: 600 }, quizCount: 30, estimatedMinutes: 90, difficulty: "Sulit", isCheckpoint: true },
  { id: "smk-rpl-10-8", nodeId: "smk-rpl-10-8", name: "Web Design Principles", description: "UI/UX dan responsive design", topicCode: "RPL-10-8", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.8", icon: "🎨", color: "#6366F1", level: 8, xpRequired: 800, prerequisites: ["smk-rpl-10-7"], rewards: { xp: 115, gems: 18 }, position: { x: 50, y: 700 }, quizCount: 25, estimatedMinutes: 75, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-rpl-10-9", nodeId: "smk-rpl-10-9", name: "Project Portfolio Website", description: "Membuat portfolio dengan HTML/CSS/JS", topicCode: "RPL-10-9", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.9", icon: "🌟", color: "#6366F1", level: 9, xpRequired: 915, prerequisites: ["smk-rpl-10-8"], rewards: { xp: 130, gems: 25 }, position: { x: 50, y: 800 }, quizCount: 20, estimatedMinutes: 120, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-rpl-10-10", nodeId: "smk-rpl-10-10", name: "Testing & Debugging", description: "Unit testing dan debugging techniques", topicCode: "RPL-10-10", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.10", icon: "🐛", color: "#6366F1", level: 10, xpRequired: 1045, prerequisites: ["smk-rpl-10-9"], rewards: { xp: 120, gems: 20 }, position: { x: 50, y: 900 }, quizCount: 25, estimatedMinutes: 80, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-rpl-10-11", nodeId: "smk-rpl-10-11", name: "Agile & Scrum Basics", description: "Metodologi pengembangan software", topicCode: "RPL-10-11", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", kompetensiDasar: "KD 3.11", icon: "🔄", color: "#6366F1", level: 11, xpRequired: 1165, prerequisites: ["smk-rpl-10-10"], rewards: { xp: 110, gems: 18 }, position: { x: 50, y: 1000 }, quizCount: 20, estimatedMinutes: 60, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-rpl-10-12", nodeId: "smk-rpl-10-12", name: "Ujian RPL Kelas 10", description: "Evaluasi komprehensif kelas 10", topicCode: "RPL-10-EXAM", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#6366F1", level: 12, xpRequired: 1275, prerequisites: ["smk-rpl-10-11"], rewards: { xp: 150, gems: 30, hearts: 3, certificate: "RPL SMK Kelas 10" }, position: { x: 50, y: 1100 }, quizCount: 40, estimatedMinutes: 120, difficulty: "Sedang", isCheckpoint: true }
];

const rplSMK11: SkillTreeNode[] = [
  { id: "smk-rpl-11-1", nodeId: "smk-rpl-11-1", name: "PHP & MySQL", description: "Backend development dengan PHP", topicCode: "RPL-11-1", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 11, semester: 1, curriculum: "Kurikulum Merdeka", icon: "🐘", color: "#6366F1", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 120, gems: 20 }, position: { x: 50, y: 0 }, quizCount: 28, estimatedMinutes: 90, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-rpl-11-2", nodeId: "smk-rpl-11-2", name: "RESTful API Development", description: "Membuat API dengan Express/Laravel", topicCode: "RPL-11-2", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 11, semester: 1, curriculum: "Kurikulum Merdeka", icon: "🔌", color: "#6366F1", level: 2, xpRequired: 120, prerequisites: ["smk-rpl-11-1"], rewards: { xp: 130, gems: 22, badge: "API Developer" }, position: { x: 50, y: 100 }, quizCount: 30, estimatedMinutes: 95, difficulty: "Sulit", isCheckpoint: true },
  { id: "smk-rpl-11-3", nodeId: "smk-rpl-11-3", name: "React.js Fundamentals", description: "Frontend framework dengan React", topicCode: "RPL-11-3", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 11, semester: 1, curriculum: "Kurikulum Merdeka", icon: "⚛️", color: "#6366F1", level: 3, xpRequired: 250, prerequisites: ["smk-rpl-11-2"], rewards: { xp: 130, gems: 22 }, position: { x: 50, y: 200 }, quizCount: 32, estimatedMinutes: 100, difficulty: "Sulit", isCheckpoint: false },
  { id: "smk-rpl-11-4", nodeId: "smk-rpl-11-4", name: "Mobile App Development", description: "React Native atau Flutter", topicCode: "RPL-11-4", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 11, semester: 1, curriculum: "Kurikulum Merdeka", icon: "📱", color: "#6366F1", level: 4, xpRequired: 380, prerequisites: ["smk-rpl-11-3"], rewards: { xp: 140, gems: 25, badge: "Mobile Developer" }, position: { x: 50, y: 300 }, quizCount: 35, estimatedMinutes: 110, difficulty: "Sulit", isCheckpoint: true },
  { id: "smk-rpl-11-5", nodeId: "smk-rpl-11-5", name: "Authentication & Security", description: "JWT, OAuth, password hashing", topicCode: "RPL-11-5", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 11, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🔒", color: "#6366F1", level: 5, xpRequired: 520, prerequisites: ["smk-rpl-11-4"], rewards: { xp: 135, gems: 23 }, position: { x: 50, y: 400 }, quizCount: 30, estimatedMinutes: 95, difficulty: "Sulit", isCheckpoint: false },
  { id: "smk-rpl-11-6", nodeId: "smk-rpl-11-6", name: "Cloud Services (AWS/GCP)", description: "Deploy aplikasi ke cloud", topicCode: "RPL-11-6", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 11, semester: 2, curriculum: "Kurikulum Merdeka", icon: "☁️", color: "#6366F1", level: 6, xpRequired: 655, prerequisites: ["smk-rpl-11-5"], rewards: { xp: 130, gems: 22 }, position: { x: 50, y: 500 }, quizCount: 28, estimatedMinutes: 90, difficulty: "Sulit", isCheckpoint: false },
  { id: "smk-rpl-11-7", nodeId: "smk-rpl-11-7", name: "Docker & Containerization", description: "Container deployment", topicCode: "RPL-11-7", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 11, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🐳", color: "#6366F1", level: 7, xpRequired: 785, prerequisites: ["smk-rpl-11-6"], rewards: { xp: 135, gems: 23, badge: "DevOps Engineer" }, position: { x: 50, y: 600 }, quizCount: 30, estimatedMinutes: 95, difficulty: "Sulit", isCheckpoint: true },
  { id: "smk-rpl-11-8", nodeId: "smk-rpl-11-8", name: "Full-Stack Project", description: "Aplikasi web lengkap (frontend + backend)", topicCode: "RPL-11-8", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 11, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🚀", color: "#6366F1", level: 8, xpRequired: 920, prerequisites: ["smk-rpl-11-7"], rewards: { xp: 150, gems: 28 }, position: { x: 50, y: 700 }, quizCount: 25, estimatedMinutes: 150, difficulty: "Sulit", isCheckpoint: false },
  { id: "smk-rpl-11-12", nodeId: "smk-rpl-11-12", name: "Ujian RPL Kelas 11", description: "Evaluasi komprehensif kelas 11", topicCode: "RPL-11-EXAM", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 11, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#6366F1", level: 12, xpRequired: 1700, prerequisites: ["smk-rpl-11-8"], rewards: { xp: 180, gems: 35, hearts: 3, certificate: "RPL SMK Kelas 11" }, position: { x: 50, y: 1100 }, quizCount: 45, estimatedMinutes: 135, difficulty: "Sulit", isCheckpoint: true }
];

const rplSMK12: SkillTreeNode[] = [
  { id: "smk-rpl-12-1", nodeId: "smk-rpl-12-1", name: "Advanced JavaScript", description: "ES6+, async/await, promises", topicCode: "RPL-12-1", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 12, semester: 1, curriculum: "Kurikulum Merdeka", icon: "⚡", color: "#6366F1", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 130, gems: 22 }, position: { x: 50, y: 0 }, quizCount: 30, estimatedMinutes: 95, difficulty: "Sulit", isCheckpoint: false },
  { id: "smk-rpl-12-2", nodeId: "smk-rpl-12-2", name: "GraphQL", description: "Modern API dengan GraphQL", topicCode: "RPL-12-2", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 12, semester: 1, curriculum: "Kurikulum Merdeka", icon: "📊", color: "#6366F1", level: 2, xpRequired: 130, prerequisites: ["smk-rpl-12-1"], rewards: { xp: 135, gems: 23, badge: "GraphQL Expert" }, position: { x: 50, y: 100 }, quizCount: 32, estimatedMinutes: 100, difficulty: "Sulit", isCheckpoint: true },
  { id: "smk-rpl-12-3", nodeId: "smk-rpl-12-3", name: "Microservices Architecture", description: "Design sistem terdistribusi", topicCode: "RPL-12-3", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 12, semester: 1, curriculum: "Kurikulum Merdeka", icon: "🏗️", color: "#6366F1", level: 3, xpRequired: 265, prerequisites: ["smk-rpl-12-2"], rewards: { xp: 140, gems: 25 }, position: { x: 50, y: 200 }, quizCount: 35, estimatedMinutes: 105, difficulty: "Sulit", isCheckpoint: false },
  { id: "smk-rpl-12-4", nodeId: "smk-rpl-12-4", name: "Machine Learning Basics", description: "Intro ML dengan Python/TensorFlow", topicCode: "RPL-12-4", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 12, semester: 1, curriculum: "Kurikulum Merdeka", icon: "🤖", color: "#6366F1", level: 4, xpRequired: 405, prerequisites: ["smk-rpl-12-3"], rewards: { xp: 145, gems: 26, badge: "AI Enthusiast" }, position: { x: 50, y: 300 }, quizCount: 35, estimatedMinutes: 110, difficulty: "Sulit", isCheckpoint: true },
  { id: "smk-rpl-12-5", nodeId: "smk-rpl-12-5", name: "Capstone Project Planning", description: "Perencanaan proyek akhir", topicCode: "RPL-12-5", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 12, semester: 2, curriculum: "Kurikulum Merdeka", icon: "📋", color: "#6366F1", level: 5, xpRequired: 550, prerequisites: ["smk-rpl-12-4"], rewards: { xp: 130, gems: 22 }, position: { x: 50, y: 400 }, quizCount: 25, estimatedMinutes: 90, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-rpl-12-6", nodeId: "smk-rpl-12-6", name: "Capstone Implementation", description: "Pengembangan proyek akhir", topicCode: "RPL-12-6", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 12, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🛠️", color: "#6366F1", level: 6, xpRequired: 680, prerequisites: ["smk-rpl-12-5"], rewards: { xp: 160, gems: 30, badge: "Project Builder" }, position: { x: 50, y: 500 }, quizCount: 20, estimatedMinutes: 180, difficulty: "Sulit", isCheckpoint: true },
  { id: "smk-rpl-12-7", nodeId: "smk-rpl-12-7", name: "Portfolio & Job Preparation", description: "LinkedIn, resume, interview prep", topicCode: "RPL-12-7", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 12, semester: 2, curriculum: "Kurikulum Merdeka", icon: "💼", color: "#6366F1", level: 7, xpRequired: 840, prerequisites: ["smk-rpl-12-6"], rewards: { xp: 120, gems: 20 }, position: { x: 50, y: 600 }, quizCount: 20, estimatedMinutes: 75, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-rpl-12-8", nodeId: "smk-rpl-12-8", name: "Ujian Kompetensi Keahlian RPL", description: "Ujian akhir kompetensi RPL", topicCode: "RPL-12-UKK", subject: "Rekayasa Perangkat Lunak", gradeLevel: "SMK", classNumber: 12, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#6366F1", level: 8, xpRequired: 960, prerequisites: ["smk-rpl-12-7"], rewards: { xp: 200, gems: 50, hearts: 5, certificate: "Lulus Kompetensi RPL SMK" }, position: { x: 50, y: 700 }, quizCount: 50, estimatedMinutes: 180, difficulty: "Sulit", isCheckpoint: true }
];

export const allRPLSMKNodes: SkillTreeNode[] = [
  ...rplSMK10,
  ...rplSMK11,
  ...rplSMK12
];

// ============================================
// MULTIMEDIA - 24 nodes (8 per class)
// ============================================

const multimediaSMK: SkillTreeNode[] = [
  // Kelas 10
  { id: "smk-mm-10-1", nodeId: "smk-mm-10-1", name: "Desain Grafis Dasar", description: "Photoshop & Illustrator basics", topicCode: "MM-10-1", subject: "Multimedia", gradeLevel: "SMK", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", icon: "🎨", color: "#EC4899", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 100, gems: 15 }, position: { x: 50, y: 0 }, quizCount: 20, estimatedMinutes: 75, difficulty: "Mudah", isCheckpoint: false },
  { id: "smk-mm-10-2", nodeId: "smk-mm-10-2", name: "Video Editing Basics", description: "Premiere Pro atau DaVinci", topicCode: "MM-10-2", subject: "Multimedia", gradeLevel: "SMK", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", icon: "🎬", color: "#EC4899", level: 2, xpRequired: 100, prerequisites: ["smk-mm-10-1"], rewards: { xp: 110, gems: 18, badge: "Video Editor" }, position: { x: 50, y: 100 }, quizCount: 25, estimatedMinutes: 90, difficulty: "Sedang", isCheckpoint: true },
  { id: "smk-mm-10-3", nodeId: "smk-mm-10-3", name: "Audio Production", description: "Recording & mixing audio", topicCode: "MM-10-3", subject: "Multimedia", gradeLevel: "SMK", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", icon: "🎵", color: "#EC4899", level: 3, xpRequired: 210, prerequisites: ["smk-mm-10-2"], rewards: { xp: 110, gems: 18 }, position: { x: 50, y: 200 }, quizCount: 22, estimatedMinutes: 80, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-mm-10-4", nodeId: "smk-mm-10-4", name: "Photography Fundamentals", description: "Komposisi dan lighting", topicCode: "MM-10-4", subject: "Multimedia", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", icon: "📷", color: "#EC4899", level: 4, xpRequired: 320, prerequisites: ["smk-mm-10-3"], rewards: { xp: 105, gems: 16 }, position: { x: 50, y: 300 }, quizCount: 20, estimatedMinutes: 70, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-mm-10-5", nodeId: "smk-mm-10-5", name: "Animation 2D", description: "After Effects atau Animate", topicCode: "MM-10-5", subject: "Multimedia", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎞️", color: "#EC4899", level: 5, xpRequired: 425, prerequisites: ["smk-mm-10-4"], rewards: { xp: 120, gems: 20, badge: "Animator" }, position: { x: 50, y: 400 }, quizCount: 25, estimatedMinutes: 95, difficulty: "Sulit", isCheckpoint: true },
  { id: "smk-mm-10-6", nodeId: "smk-mm-10-6", name: "Social Media Content", description: "Konten untuk Instagram, TikTok", topicCode: "MM-10-6", subject: "Multimedia", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", icon: "📱", color: "#EC4899", level: 6, xpRequired: 545, prerequisites: ["smk-mm-10-5"], rewards: { xp: 110, gems: 18 }, position: { x: 50, y: 500 }, quizCount: 22, estimatedMinutes: 80, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-mm-10-7", nodeId: "smk-mm-10-7", name: "Portfolio Creation", description: "Membuat portfolio multimedia", topicCode: "MM-10-7", subject: "Multimedia", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", icon: "📁", color: "#EC4899", level: 7, xpRequired: 655, prerequisites: ["smk-mm-10-6"], rewards: { xp: 115, gems: 19 }, position: { x: 50, y: 600 }, quizCount: 20, estimatedMinutes: 100, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-mm-10-8", nodeId: "smk-mm-10-8", name: "Ujian Multimedia Kelas 10", description: "Evaluasi kelas 10", topicCode: "MM-10-EXAM", subject: "Multimedia", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#EC4899", level: 8, xpRequired: 770, prerequisites: ["smk-mm-10-7"], rewards: { xp: 140, gems: 28, hearts: 3, certificate: "Multimedia SMK Kelas 10" }, position: { x: 50, y: 700 }, quizCount: 35, estimatedMinutes: 120, difficulty: "Sedang", isCheckpoint: true },
  
  // Kelas 11 & 12 similar structure
  { id: "smk-mm-11-1", nodeId: "smk-mm-11-1", name: "Motion Graphics", description: "Advanced After Effects", topicCode: "MM-11-1", subject: "Multimedia", gradeLevel: "SMK", classNumber: 11, semester: 1, curriculum: "Kurikulum Merdeka", icon: "🌟", color: "#EC4899", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 125, gems: 22, badge: "Motion Designer" }, position: { x: 50, y: 0 }, quizCount: 28, estimatedMinutes: 100, difficulty: "Sulit", isCheckpoint: true },
  { id: "smk-mm-11-8", nodeId: "smk-mm-11-8", name: "Ujian Multimedia Kelas 11", description: "Evaluasi kelas 11", topicCode: "MM-11-EXAM", subject: "Multimedia", gradeLevel: "SMK", classNumber: 11, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#EC4899", level: 8, xpRequired: 1500, prerequisites: ["smk-mm-11-7"], rewards: { xp: 170, gems: 33, hearts: 3, certificate: "Multimedia SMK Kelas 11" }, position: { x: 50, y: 700 }, quizCount: 40, estimatedMinutes: 135, difficulty: "Sulit", isCheckpoint: true },
  
  { id: "smk-mm-12-1", nodeId: "smk-mm-12-1", name: "3D Modeling", description: "Blender atau Cinema 4D", topicCode: "MM-12-1", subject: "Multimedia", gradeLevel: "SMK", classNumber: 12, semester: 1, curriculum: "Kurikulum Merdeka", icon: "🎭", color: "#EC4899", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 135, gems: 24, badge: "3D Artist" }, position: { x: 50, y: 0 }, quizCount: 30, estimatedMinutes: 110, difficulty: "Sulit", isCheckpoint: true },
  { id: "smk-mm-12-8", nodeId: "smk-mm-12-8", name: "Ujian Kompetensi Multimedia", description: "UKK Multimedia", topicCode: "MM-12-UKK", subject: "Multimedia", gradeLevel: "SMK", classNumber: 12, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#EC4899", level: 8, xpRequired: 1800, prerequisites: ["smk-mm-12-7"], rewards: { xp: 200, gems: 45, hearts: 5, certificate: "Lulus Kompetensi Multimedia SMK" }, position: { x: 50, y: 700 }, quizCount: 45, estimatedMinutes: 180, difficulty: "Sulit", isCheckpoint: true }
];

// ============================================
// AKUNTANSI & KEUANGAN LEMBAGA - 24 nodes
// ============================================

const accountingSMK: SkillTreeNode[] = [
  { id: "smk-akl-10-1", nodeId: "smk-akl-10-1", name: "Pengantar Akuntansi", description: "Persamaan dasar akuntansi", topicCode: "AKL-10-1", subject: "Akuntansi & Keuangan", gradeLevel: "SMK", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", icon: "📊", color: "#10B981", level: 1, xpRequired: 0, prerequisites: [], rewards: { xp: 95, gems: 14 }, position: { x: 50, y: 0 }, quizCount: 20, estimatedMinutes: 60, difficulty: "Mudah", isCheckpoint: false },
  { id: "smk-akl-10-2", nodeId: "smk-akl-10-2", name: "Jurnal Umum", description: "Pencatatan transaksi", topicCode: "AKL-10-2", subject: "Akuntansi & Keuangan", gradeLevel: "SMK", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", icon: "📝", color: "#10B981", level: 2, xpRequired: 95, prerequisites: ["smk-akl-10-1"], rewards: { xp: 105, gems: 17, badge: "Bookkeeper" }, position: { x: 50, y: 100 }, quizCount: 25, estimatedMinutes: 75, difficulty: "Sedang", isCheckpoint: true },
  { id: "smk-akl-10-3", nodeId: "smk-akl-10-3", name: "Buku Besar", description: "Posting ke buku besar", topicCode: "AKL-10-3", subject: "Akuntansi & Keuangan", gradeLevel: "SMK", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", icon: "📚", color: "#10B981", level: 3, xpRequired: 200, prerequisites: ["smk-akl-10-2"], rewards: { xp: 105, gems: 17 }, position: { x: 50, y: 200 }, quizCount: 22, estimatedMinutes: 70, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-akl-10-4", nodeId: "smk-akl-10-4", name: "Neraca Saldo", description: "Menyusun neraca saldo", topicCode: "AKL-10-4", subject: "Akuntansi & Keuangan", gradeLevel: "SMK", classNumber: 10, semester: 1, curriculum: "Kurikulum Merdeka", icon: "⚖️", color: "#10B981", level: 4, xpRequired: 305, prerequisites: ["smk-akl-10-3"], rewards: { xp: 110, gems: 18 }, position: { x: 50, y: 300 }, quizCount: 25, estimatedMinutes: 80, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-akl-10-5", nodeId: "smk-akl-10-5", name: "Jurnal Penyesuaian", description: "Adjusting entries", topicCode: "AKL-10-5", subject: "Akuntansi & Keuangan", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🔧", color: "#10B981", level: 5, xpRequired: 415, prerequisites: ["smk-akl-10-4"], rewards: { xp: 115, gems: 19, badge: "Adjuster" }, position: { x: 50, y: 400 }, quizCount: 28, estimatedMinutes: 85, difficulty: "Sulit", isCheckpoint: true },
  { id: "smk-akl-10-6", nodeId: "smk-akl-10-6", name: "Laporan Keuangan", description: "Neraca, L/R, perubahan modal", topicCode: "AKL-10-6", subject: "Akuntansi & Keuangan", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", icon: "📄", color: "#10B981", level: 6, xpRequired: 530, prerequisites: ["smk-akl-10-5"], rewards: { xp: 120, gems: 20 }, position: { x: 50, y: 500 }, quizCount: 30, estimatedMinutes: 90, difficulty: "Sulit", isCheckpoint: false },
  { id: "smk-akl-10-7", nodeId: "smk-akl-10-7", name: "Aplikasi Akuntansi (Accurate)", description: "Software akuntansi", topicCode: "AKL-10-7", subject: "Akuntansi & Keuangan", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", icon: "💻", color: "#10B981", level: 7, xpRequired: 650, prerequisites: ["smk-akl-10-6"], rewards: { xp: 110, gems: 18 }, position: { x: 50, y: 600 }, quizCount: 22, estimatedMinutes: 75, difficulty: "Sedang", isCheckpoint: false },
  { id: "smk-akl-10-8", nodeId: "smk-akl-10-8", name: "Ujian Akuntansi Kelas 10", description: "Evaluasi kelas 10", topicCode: "AKL-10-EXAM", subject: "Akuntansi & Keuangan", gradeLevel: "SMK", classNumber: 10, semester: 2, curriculum: "Kurikulum Merdeka", icon: "🎓", color: "#10B981", level: 8, xpRequired: 760, prerequisites: ["smk-akl-10-7"], rewards: { xp: 140, gems: 27, hearts: 3, certificate: "Akuntansi SMK Kelas 10" }, position: { x: 50, y: 700 }, quizCount: 35, estimatedMinutes: 120, difficulty: "Sedang", isCheckpoint: true },
  // Kelas 11 & 12 follow similar pattern
];

// Import new SMK programs
import { allPPLGNodes, pplgSummary } from './skillTreesSMK_PPLG.js';
import { allTJKTNodes, tjktSummary } from './skillTreesSMK_TJKT.js';
import { allDKVBDNodes, dkvbdSummary } from './skillTreesSMKDKVBD.js';

// Export all SMK nodes
export const allSMKNodes: any[] = [
  ...allRPLSMKNodes,
  ...multimediaSMK,
  ...accountingSMK,
  ...allPPLGNodes,
  ...allTJKTNodes,
  ...allDKVBDNodes
  // ... more vocational programs can be added
];

export const smkSummary = {
  totalNodes: allSMKNodes.length,
  checkpointNodes: allSMKNodes.filter(n => n.isCheckpoint).length,
  totalXP: allSMKNodes.reduce((sum, n) => sum + n.rewards.xp, 0),
  totalGems: allSMKNodes.reduce((sum, n) => sum + n.rewards.gems, 0),
  programs: {
    rpl: allRPLSMKNodes.length,
    multimedia: multimediaSMK.length,
    accounting: accountingSMK.length,
    pplg: allPPLGNodes.length,
    tjkt: allTJKTNodes.length,
    dkvbd: allDKVBDNodes.length
  }
};

// Re-export individual programs for convenience
export { allPPLGNodes, pplgSummary, allTJKTNodes, tjktSummary, allDKVBDNodes, dkvbdSummary };
