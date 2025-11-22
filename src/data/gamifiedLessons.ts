import { Student } from "@/data/mockData";

export type LessonStatus = "locked" | "available" | "in-progress" | "completed" | "mastered";

export interface LessonChallenge {
  id: string;
  title: string;
  description: string;
  type: "practice" | "challenge" | "story" | "review";
  xpReward: number;
  streakReward?: number;
  durationMinutes: number;
  status: LessonStatus;
  skillId: string;
  topicId: string;
  prerequisites?: string[];
  completedAt?: string;
  attempts?: number;
}

export interface SkillNode {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "locked" | "current" | "completed";
  mastery: number;
  unitId: string;
  unlocked: boolean;
  lessons: LessonChallenge[];
  pathIndex: number;
}

export interface SkillTreeUnit {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "upcoming" | "current" | "completed";
  skills: SkillNode[];
  reward?: {
    type: "chest" | "badge";
    xp: number;
    label: string;
  };
  rewardClaimed?: boolean;
}

export interface GamifiedProfile {
  studentId: string;
  displayName: string;
  xp: number;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  streak: number;
  bestStreak: number;
  dailyGoalXP: number;
  dailyGoalProgress: number;
  dailyGoalMet: boolean;
  dailyGoalClaimed?: boolean;
  league: Student["league"];
  boosts: Array<{
    id: string;
    label: string;
    remaining: number;
    type: "xp" | "streak" | "shield";
  }>;
  lastLessonId?: string;
  lastCompletedAt?: string;
}

export const baseSkillTree: SkillTreeUnit[] = [
  {
    id: "unit-1",
    title: "Fondasi Adaptif",
    description: "Penguasaan konsep dasar aljabar dan aritmetika",
    icon: "🎯",
    status: "current",
    reward: {
      type: "chest",
      xp: 80,
      label: "Peti Emas Dasar",
    },
    skills: [
      {
        id: "skill-linear",
        title: "Ekspresi Linear",
        description: "Pemahaman variabel, konstanta, dan operasi dasar",
        icon: "➗",
        status: "completed",
        mastery: 100,
        unitId: "unit-1",
        unlocked: true,
        pathIndex: 0,
        lessons: [
          {
            id: "lesson-linear-1",
            title: "Kenalan dengan Variabel",
            description: "Sebutkan variabel dan konstanta dalam ekspresi sederhana",
            type: "practice",
            xpReward: 15,
            streakReward: 1,
            durationMinutes: 5,
            status: "mastered",
            skillId: "skill-linear",
            topicId: "algebra",
          },
          {
            id: "lesson-linear-2",
            title: "Operasi Campuran",
            description: "Terapkan operasi dasar pada aljabar linear",
            type: "practice",
            xpReward: 20,
            streakReward: 1,
            durationMinutes: 7,
            status: "mastered",
            skillId: "skill-linear",
            topicId: "algebra",
          },
          {
            id: "lesson-linear-3",
            title: "Tes Tantangan",
            description: "Selesaikan 6 soal pilihan ganda dalam 3 menit",
            type: "challenge",
            xpReward: 35,
            streakReward: 2,
            durationMinutes: 8,
            status: "mastered",
            skillId: "skill-linear",
            topicId: "algebra",
          },
        ],
      },
      {
        id: "skill-equation",
        title: "Persamaan Linear",
        description: "Selesaikan persamaan satu dan dua langkah",
        icon: "🧮",
        status: "current",
        mastery: 45,
        unitId: "unit-1",
        unlocked: true,
        pathIndex: 1,
        lessons: [
          {
            id: "lesson-eq-1",
            title: "Persamaan Satu Langkah",
            description: "Gunakan operasi invers untuk menemukan nilai x",
            type: "practice",
            xpReward: 15,
            streakReward: 1,
            durationMinutes: 5,
            status: "mastered",
            skillId: "skill-equation",
            topicId: "algebra",
          },
          {
            id: "lesson-eq-2",
            title: "Persamaan Dua Langkah",
            description: "Selesaikan persamaan dengan lebih dari satu operasi",
            type: "practice",
            xpReward: 20,
            streakReward: 1,
            durationMinutes: 6,
            status: "available",
            skillId: "skill-equation",
            topicId: "algebra",
          },
          {
            id: "lesson-eq-3",
            title: "Cerita Aljabar",
            description: "Interpretasikan soal cerita dan bentuk persamaan",
            type: "story",
            xpReward: 25,
            streakReward: 1,
            durationMinutes: 8,
            status: "locked",
            skillId: "skill-equation",
            topicId: "algebra",
            prerequisites: ["lesson-eq-2"],
          },
        ],
      },
      {
        id: "skill-geometry",
        title: "Bangun Datar",
        description: "Hitung luas dan keliling bangun dasar",
        icon: "📐",
        status: "locked",
        mastery: 0,
        unitId: "unit-1",
        unlocked: false,
        pathIndex: 0,
        lessons: [
          {
            id: "lesson-geo-1",
            title: "Mengenal Segitiga",
            description: "Identifikasi jenis segitiga dari sisi dan sudut",
            type: "practice",
            xpReward: 15,
            streakReward: 1,
            durationMinutes: 6,
            status: "locked",
            skillId: "skill-geometry",
            topicId: "geometry",
            prerequisites: ["lesson-eq-3"],
          },
          {
            id: "lesson-geo-2",
            title: "Luas Persegi",
            description: "Hitung luas persegi dan persegi panjang",
            type: "practice",
            xpReward: 18,
            durationMinutes: 6,
            status: "locked",
            skillId: "skill-geometry",
            topicId: "geometry",
          },
          {
            id: "lesson-geo-3",
            title: "Tantangan Geometri",
            description: "Selesaikan kuis 8 soal dengan batas waktu",
            type: "challenge",
            xpReward: 35,
            streakReward: 2,
            durationMinutes: 9,
            status: "locked",
            skillId: "skill-geometry",
            topicId: "geometry",
          },
        ],
      },
    ],
  },
  {
    id: "unit-2",
    title: "Statistika dan Analisis",
    description: "Analisis data dan visualisasi interaktif",
    icon: "📊",
    status: "upcoming",
    reward: {
      type: "badge",
      xp: 120,
      label: "Analyst Apprentice",
    },
    skills: [
      {
        id: "skill-stats",
        title: "Statistika Dasar",
        description: "Pahami rata-rata, median, dan modus",
        icon: "📈",
        status: "locked",
        mastery: 0,
        unitId: "unit-2",
        unlocked: false,
        pathIndex: 0,
        lessons: [
          {
            id: "lesson-stats-1",
            title: "Ukuran Pemusatan",
            description: "Hitung mean, median, dan modus dataset",
            type: "practice",
            xpReward: 20,
            durationMinutes: 7,
            status: "locked",
            skillId: "skill-stats",
            topicId: "statistics",
          },
          {
            id: "lesson-stats-2",
            title: "Visualisasi Data",
            description: "Pilih diagram yang tepat untuk dataset",
            type: "story",
            xpReward: 25,
            durationMinutes: 8,
            status: "locked",
            skillId: "skill-stats",
            topicId: "statistics",
          },
          {
            id: "lesson-stats-3",
            title: "Evaluasi Statistika",
            description: "Kerjakan evaluasi adaptif dengan 10 soal",
            type: "challenge",
            xpReward: 40,
            durationMinutes: 10,
            status: "locked",
            skillId: "skill-stats",
            topicId: "statistics",
          },
        ],
      },
      {
        id: "skill-trig",
        title: "Trigonometri",
        description: "Sin, cos, tan dalam kehidupan nyata",
        icon: "📎",
        status: "locked",
        mastery: 0,
        unitId: "unit-2",
        unlocked: false,
        pathIndex: 1,
        lessons: [
          {
            id: "lesson-trig-1",
            title: "Segitiga Siku-siku",
            description: "Gunakan perbandingan trigonometri dasar",
            type: "practice",
            xpReward: 22,
            durationMinutes: 7,
            status: "locked",
            skillId: "skill-trig",
            topicId: "trigonometry",
          },
          {
            id: "lesson-trig-2",
            title: "Identitas Trigonometri",
            description: "Buktikan identitas fundamental",
            type: "practice",
            xpReward: 28,
            durationMinutes: 9,
            status: "locked",
            skillId: "skill-trig",
            topicId: "trigonometry",
          },
          {
            id: "lesson-trig-3",
            title: "Tantangan Trigonometri",
            description: "Hadapi soal waktu nyata dengan adaptive hints",
            type: "challenge",
            xpReward: 45,
            durationMinutes: 12,
            status: "locked",
            skillId: "skill-trig",
            topicId: "trigonometry",
          },
        ],
      },
    ],
  },
];

export const baseProfile: GamifiedProfile = {
  studentId: "1",
  displayName: "Tristan Firdaus",
  xp: 2850,
  level: 7,
  xpInLevel: 650,
  xpForNextLevel: 800,
  streak: 7,
  bestStreak: 9,
  dailyGoalXP: 40,
  dailyGoalProgress: 28,
  dailyGoalMet: false,
  dailyGoalClaimed: false,
  league: "gold",
  boosts: [
    { id: "boost-xp", label: "Double XP", remaining: 1, type: "xp" },
    { id: "boost-shield", label: "Streak Shield", remaining: 2, type: "shield" },
  ],
  lastLessonId: "lesson-eq-1",
  lastCompletedAt: new Date().toISOString(),
};

export const cloneSkillTree = (units: SkillTreeUnit[]): SkillTreeUnit[] =>
  units.map((unit) => ({
    ...unit,
    skills: unit.skills.map((skill) => ({
      ...skill,
      lessons: skill.lessons.map((lesson) => ({ ...lesson })),
    })),
  }));

export const calculateUnitProgress = (unit: SkillTreeUnit) => {
  const lessons = unit.skills.flatMap((skill) => skill.lessons);
  const mastered = lessons.filter((lesson) => lesson.status === "mastered").length;
  return Math.round((mastered / lessons.length) * 100);
};

export const calculateTreeProgress = (units: SkillTreeUnit[]) => {
  const lessons = units.flatMap((unit) => unit.skills.flatMap((skill) => skill.lessons));
  const mastered = lessons.filter((lesson) => lesson.status === "mastered").length;
  const total = lessons.length || 1;
  return {
    mastered,
    total: lessons.length,
    percent: Math.round((mastered / total) * 100),
  };
};
