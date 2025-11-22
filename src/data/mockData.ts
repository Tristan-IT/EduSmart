export interface Student {
  id: string;
  name: string;
  avatar: string;
  class: string;
  masteryPerTopic: Record<string, number>;
  xp: number;
  level: number;
  league: "bronze" | "silver" | "gold" | "diamond" | "platinum" | "quantum";
  weeklyXP?: number;
  rank?: number;
  previousRank?: number;
  trend?: 'up' | 'down' | 'same';
  dailyGoalXP: number;
  dailyGoalProgress: number;
  streak: number;
  gems: number;
  riskLevel?: 'high' | 'medium' | 'low';
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  progressPercent: number;
  dependencies: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ContentItem {
  id: string;
  topic: string;
  type: 'video' | 'pdf' | 'quiz' | 'slide';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  durationMinutes: number;
  author: string;
  tags: string[];
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  question: string;
  type: 'mcq' | 'multi-select' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  difficulty: number;
  hintCount: number;
  hints: string[];
  explanation: string;
}

export interface StudentEvent {
  studentId: string;
  itemId: string;
  topicId: string;
  correct: boolean;
  timeTaken: number;
  timestamp: string;
  difficulty: number;
}

export interface ReportSummary {
  id: string;
  title: string;
  type: 'kelas' | 'individu' | 'ringkas';
  generatedAt: string;
  url: string;
  filters: Record<string, string>;
}

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Tristan Firdaus',
    avatar: '👨‍🎓',
    class: '10A',
    masteryPerTopic: {
      'algebra': 85,
      'geometry': 72,
      'statistics': 90,
      'trigonometry': 65,
    },
    xp: 2850,
    level: 7,
    league: 'gold',
    weeklyXP: 485,
    rank: 8,
    previousRank: 12,
    trend: 'up',
    dailyGoalXP: 40,
    dailyGoalProgress: 28,
    streak: 7,
    gems: 150,
    riskLevel: 'low',
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    avatar: '👩‍🎓',
    class: '10A',
    masteryPerTopic: {
      'algebra': 45,
      'geometry': 50,
      'statistics': 40,
      'trigonometry': 35,
    },
    xp: 1120,
    level: 4,
    league: 'silver',
    weeklyXP: 320,
    rank: 15,
    previousRank: 14,
    trend: 'down',
    dailyGoalXP: 30,
    dailyGoalProgress: 12,
    streak: 2,
    gems: 45,
    riskLevel: 'high',
  },
  {
    id: '3',
    name: 'Budi Santoso',
    avatar: '👨‍🎓',
    class: '10B',
    masteryPerTopic: {
      'algebra': 78,
      'geometry': 80,
      'statistics': 75,
      'trigonometry': 70,
    },
    xp: 2620,
    level: 6,
    league: 'silver',
    dailyGoalXP: 45,
    dailyGoalProgress: 42,
    streak: 5,
    gems: 220,
    riskLevel: 'low',
  },
  {
    id: '4',
    name: 'Dewi Lestari',
    avatar: '👩‍🎓',
    class: '10B',
    masteryPerTopic: {
      'algebra': 60,
      'geometry': 58,
      'statistics': 62,
      'trigonometry': 55,
    },
    xp: 1980,
    level: 5,
    league: 'silver',
    dailyGoalXP: 35,
    dailyGoalProgress: 24,
    streak: 3,
    gems: 85,
    riskLevel: 'medium',
  },
];

export const mockTopics: Topic[] = [
  {
    id: 'algebra',
    title: 'Aljabar Dasar',
    description: 'Pelajari konsep dasar aljabar, persamaan linear, dan sistem persamaan',
    estimatedMinutes: 45,
    progressPercent: 75,
    dependencies: [],
    difficulty: 'beginner',
  },
  {
    id: 'geometry',
    title: 'Geometri',
    description: 'Memahami bentuk, sudut, dan teorema geometri dasar',
    estimatedMinutes: 50,
    progressPercent: 60,
    dependencies: ['algebra'],
    difficulty: 'intermediate',
  },
  {
    id: 'statistics',
    title: 'Statistika',
    description: 'Analisis data, rata-rata, median, modus, dan visualisasi data',
    estimatedMinutes: 40,
    progressPercent: 85,
    dependencies: ['algebra'],
    difficulty: 'intermediate',
  },
  {
    id: 'trigonometry',
    title: 'Trigonometri',
    description: 'Fungsi trigonometri, identitas, dan aplikasinya',
    estimatedMinutes: 55,
    progressPercent: 30,
    dependencies: ['algebra', 'geometry'],
    difficulty: 'advanced',
  },
];

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    topicId: 'algebra',
    question: 'Berapakah nilai x dalam persamaan: 2x + 5 = 13?',
    type: 'mcq',
    options: ['2', '4', '6', '8'],
    correctAnswer: '4',
    difficulty: 1,
    hintCount: 2,
    hints: [
      'Kurangi kedua sisi dengan 5',
      'Setelah itu, bagi kedua sisi dengan 2',
    ],
    explanation: 'Langkah penyelesaian: 2x + 5 = 13 → 2x = 13 - 5 → 2x = 8 → x = 4',
  },
  {
    id: 'q2',
    topicId: 'algebra',
    question: 'Sederhanakan ekspresi: 3(x + 2) - 2(x - 1)',
    type: 'mcq',
    options: ['x + 8', 'x + 4', 'x + 6', '5x + 4'],
    correctAnswer: 'x + 8',
    difficulty: 2,
    hintCount: 2,
    hints: [
      'Gunakan distributive property: a(b + c) = ab + ac',
      'Gabungkan term yang sejenis setelah ekspansi',
    ],
    explanation: '3(x + 2) - 2(x - 1) = 3x + 6 - 2x + 2 = x + 8',
  },
  {
    id: 'q3',
    topicId: 'geometry',
    question: 'Jumlah sudut dalam segitiga adalah berapa derajat?',
    type: 'short-answer',
    correctAnswer: '180',
    difficulty: 1,
    hintCount: 1,
    hints: ['Ini adalah teorema dasar geometri yang perlu dihafalkan'],
    explanation: 'Jumlah ketiga sudut dalam segitiga selalu sama dengan 180 derajat',
  },
];

export const mockStudentEvents: StudentEvent[] = [
  {
    studentId: '1',
    itemId: 'q1',
    topicId: 'algebra',
    correct: true,
    timeTaken: 45,
    timestamp: '2025-01-15T10:30:00Z',
    difficulty: 1,
  },
  {
    studentId: '1',
    itemId: 'q2',
    topicId: 'algebra',
    correct: true,
    timeTaken: 120,
    timestamp: '2025-01-15T10:35:00Z',
    difficulty: 2,
  },
  {
    studentId: '2',
    itemId: 'q1',
    topicId: 'algebra',
    correct: false,
    timeTaken: 180,
    timestamp: '2025-01-15T11:00:00Z',
    difficulty: 1,
  },
];

export const mockContentItems: ContentItem[] = [
  // ALJABAR
  {
    id: 'item-001',
    topic: 'algebra',
    type: 'video',
    difficulty: 'beginner',
    title: 'Persamaan Linear Dasar',
    durationMinutes: 12,
    author: 'Bu Sarah Wijaya',
    tags: ['pengenalan', 'dasar'],
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'item-002',
    topic: 'algebra',
    type: 'pdf',
    difficulty: 'beginner',
    title: 'Ringkasan: Variabel dan Konstanta',
    durationMinutes: 8,
    author: 'Bu Sarah Wijaya',
    tags: ['teori', 'dasar'],
    updatedAt: '2025-01-09T14:30:00Z',
  },
  {
    id: 'item-003',
    topic: 'algebra',
    type: 'video',
    difficulty: 'intermediate',
    title: 'Faktorisasi Aljabar',
    durationMinutes: 18,
    author: 'Bu Sarah Wijaya',
    tags: ['faktorisasi', 'menengah'],
    updatedAt: '2025-01-11T10:15:00Z',
  },
  {
    id: 'item-004',
    topic: 'algebra',
    type: 'quiz',
    difficulty: 'intermediate',
    title: 'Latihan Soal Persamaan Kuadrat',
    durationMinutes: 25,
    author: 'Tim EduSmart',
    tags: ['latihan', 'kuadrat'],
    updatedAt: '2025-01-12T09:00:00Z',
  },
  {
    id: 'item-005',
    topic: 'algebra',
    type: 'slide',
    difficulty: 'advanced',
    title: 'Sistem Persamaan Linear Tiga Variabel',
    durationMinutes: 20,
    author: 'Bu Sarah Wijaya',
    tags: ['advanced', 'sistem'],
    updatedAt: '2025-01-13T11:20:00Z',
  },
  
  // GEOMETRI
  {
    id: 'item-006',
    topic: 'geometry',
    type: 'video',
    difficulty: 'beginner',
    title: 'Pengenalan Bangun Datar',
    durationMinutes: 15,
    author: 'Bu Sarah Wijaya',
    tags: ['bangun datar', 'dasar'],
    updatedAt: '2025-01-08T13:00:00Z',
  },
  {
    id: 'item-007',
    topic: 'geometry',
    type: 'pdf',
    difficulty: 'beginner',
    title: 'Rumus Luas dan Keliling',
    durationMinutes: 10,
    author: 'Bu Sarah Wijaya',
    tags: ['rumus', 'referensi'],
    updatedAt: '2025-01-07T16:45:00Z',
  },
  {
    id: 'item-008',
    topic: 'geometry',
    type: 'video',
    difficulty: 'intermediate',
    title: 'Teorema Pythagoras dalam Kehidupan',
    durationMinutes: 14,
    author: 'Bu Sarah Wijaya',
    tags: ['pythagoras', 'aplikasi'],
    updatedAt: '2025-01-10T15:30:00Z',
  },
  {
    id: 'item-009',
    topic: 'geometry',
    type: 'quiz',
    difficulty: 'intermediate',
    title: 'Soal Bangun Ruang',
    durationMinutes: 20,
    author: 'Tim EduSmart',
    tags: ['bangun ruang', 'latihan'],
    updatedAt: '2025-01-11T14:00:00Z',
  },
  {
    id: 'item-010',
    topic: 'geometry',
    type: 'slide',
    difficulty: 'advanced',
    title: 'Geometri Analitik Lanjutan',
    durationMinutes: 22,
    author: 'Bu Sarah Wijaya',
    tags: ['analitik', 'koordinat'],
    updatedAt: '2025-01-12T10:30:00Z',
  },
  
  // STATISTIKA
  {
    id: 'item-011',
    topic: 'statistics',
    type: 'video',
    difficulty: 'beginner',
    title: 'Dasar-dasar Statistika',
    durationMinutes: 16,
    author: 'Bu Sarah Wijaya',
    tags: ['pengenalan', 'data'],
    updatedAt: '2025-01-09T09:15:00Z',
  },
  {
    id: 'item-012',
    topic: 'statistics',
    type: 'pdf',
    difficulty: 'beginner',
    title: 'Cara Membaca Diagram',
    durationMinutes: 12,
    author: 'Bu Sarah Wijaya',
    tags: ['diagram', 'visualisasi'],
    updatedAt: '2025-01-08T11:00:00Z',
  },
  {
    id: 'item-013',
    topic: 'statistics',
    type: 'video',
    difficulty: 'intermediate',
    title: 'Mean, Median, dan Modus',
    durationMinutes: 18,
    author: 'Bu Sarah Wijaya',
    tags: ['ukuran pemusatan', 'analisis'],
    updatedAt: '2025-01-11T09:30:00Z',
  },
  {
    id: 'item-014',
    topic: 'statistics',
    type: 'quiz',
    difficulty: 'intermediate',
    title: 'Latihan Distribusi Frekuensi',
    durationMinutes: 22,
    author: 'Tim EduSmart',
    tags: ['distribusi', 'frekuensi'],
    updatedAt: '2025-01-12T13:45:00Z',
  },
  {
    id: 'item-015',
    topic: 'statistics',
    type: 'slide',
    difficulty: 'advanced',
    title: 'Probabilitas dan Kombinatorik',
    durationMinutes: 25,
    author: 'Bu Sarah Wijaya',
    tags: ['probabilitas', 'kombinasi'],
    updatedAt: '2025-01-13T08:20:00Z',
  },
  
  // TRIGONOMETRI
  {
    id: 'item-016',
    topic: 'trigonometry',
    type: 'video',
    difficulty: 'beginner',
    title: 'Pengenalan Sudut dan Derajat',
    durationMinutes: 13,
    author: 'Bu Sarah Wijaya',
    tags: ['sudut', 'dasar'],
    updatedAt: '2025-01-07T10:00:00Z',
  },
  {
    id: 'item-017',
    topic: 'trigonometry',
    type: 'pdf',
    difficulty: 'beginner',
    title: 'Tabel Trigonometri Dasar',
    durationMinutes: 8,
    author: 'Bu Sarah Wijaya',
    tags: ['tabel', 'referensi'],
    updatedAt: '2025-01-06T15:30:00Z',
  },
  {
    id: 'item-018',
    topic: 'trigonometry',
    type: 'video',
    difficulty: 'intermediate',
    title: 'Sin, Cos, Tan dalam Segitiga',
    durationMinutes: 20,
    author: 'Bu Sarah Wijaya',
    tags: ['fungsi trigonometri', 'segitiga'],
    updatedAt: '2025-01-10T11:45:00Z',
  },
  {
    id: 'item-019',
    topic: 'trigonometry',
    type: 'quiz',
    difficulty: 'intermediate',
    title: 'Soal Identitas Trigonometri',
    durationMinutes: 24,
    author: 'Tim EduSmart',
    tags: ['identitas', 'latihan'],
    updatedAt: '2025-01-11T16:00:00Z',
  },
  {
    id: 'item-020',
    topic: 'trigonometry',
    type: 'slide',
    difficulty: 'advanced',
    title: 'Grafik Fungsi Trigonometri',
    durationMinutes: 28,
    author: 'Bu Sarah Wijaya',
    tags: ['grafik', 'fungsi'],
    updatedAt: '2025-01-12T14:15:00Z',
  },
  
  // KALKULUS
  {
    id: 'item-021',
    topic: 'calculus',
    type: 'video',
    difficulty: 'beginner',
    title: 'Konsep Limit Dasar',
    durationMinutes: 17,
    author: 'Bu Sarah Wijaya',
    tags: ['limit', 'pengenalan'],
    updatedAt: '2025-01-09T12:00:00Z',
  },
  {
    id: 'item-022',
    topic: 'calculus',
    type: 'pdf',
    difficulty: 'intermediate',
    title: 'Turunan Fungsi Aljabar',
    durationMinutes: 15,
    author: 'Bu Sarah Wijaya',
    tags: ['turunan', 'diferensial'],
    updatedAt: '2025-01-10T09:30:00Z',
  },
  {
    id: 'item-023',
    topic: 'calculus',
    type: 'video',
    difficulty: 'intermediate',
    title: 'Aplikasi Turunan',
    durationMinutes: 21,
    author: 'Bu Sarah Wijaya',
    tags: ['aplikasi', 'optimasi'],
    updatedAt: '2025-01-11T13:20:00Z',
  },
  {
    id: 'item-024',
    topic: 'calculus',
    type: 'quiz',
    difficulty: 'advanced',
    title: 'Latihan Integral Tentu',
    durationMinutes: 30,
    author: 'Tim EduSmart',
    tags: ['integral', 'latihan'],
    updatedAt: '2025-01-12T11:00:00Z',
  },
  {
    id: 'item-025',
    topic: 'calculus',
    type: 'slide',
    difficulty: 'advanced',
    title: 'Integral Substitusi dan Parsial',
    durationMinutes: 26,
    author: 'Bu Sarah Wijaya',
    tags: ['integral', 'teknik'],
    updatedAt: '2025-01-13T10:45:00Z',
  },
];

export const mockReports: ReportSummary[] = [
  {
    id: 'report-001',
    title: 'Ringkasan Kelas 10A - Minggu 3',
    type: 'kelas',
    generatedAt: '2025-01-15T12:00:00Z',
    url: '/reports/report-001.pdf',
    filters: {
      classId: '10A',
      range: '2025-01-08/2025-01-14',
    },
  },
  {
    id: 'report-002',
    title: 'Performa Individu • {USER_NAME}',
    type: 'individu',
    generatedAt: '2025-01-16T08:10:00Z',
    url: '/reports/report-002.pdf',
    filters: {
      studentId: '2',
      range: '2025-01-01/2025-01-15',
    },
  },
  {
    id: 'report-003',
    title: 'Ringkasan Risiko Belajar Kelas 10B',
    type: 'ringkas',
    generatedAt: '2025-01-16T09:45:00Z',
    url: '/reports/report-003.pdf',
    filters: {
      classId: '10B',
      focus: 'risk',
    },
  },
];

export const mockDailyPlan = [
  {
    time: '10:00',
    activity: 'Latihan Aljabar',
    duration: '15 menit',
    topicId: 'algebra',
    status: 'completed',
  },
  {
    time: '10:30',
    activity: 'Review Geometri',
    duration: '20 menit',
    topicId: 'geometry',
    status: 'in-progress',
  },
  {
    time: '11:00',
    activity: 'Quiz Statistika',
    duration: '10 menit',
    topicId: 'statistics',
    status: 'pending',
  },
];
