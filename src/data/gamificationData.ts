export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  total?: number;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  league?: "bronze" | "silver" | "gold" | "diamond" | "platinum" | "quantum";
  weeklyXP?: number;
}

export const mockAchievements: Achievement[] = [
  {
    id: 'first-quiz',
    title: 'Langkah Pertama',
    description: 'Selesaikan quiz pertamamu',
    icon: '🎯',
    xpReward: 50,
    unlocked: true,
    unlockedAt: new Date('2025-01-10'),
  },
  {
    id: 'streak-7',
    title: 'Semangat 7 Hari',
    description: 'Belajar 7 hari berturut-turut',
    icon: '🔥',
    xpReward: 100,
    unlocked: true,
    unlockedAt: new Date('2025-01-15'),
  },
  {
    id: 'perfect-score',
    title: 'Sempurna!',
    description: 'Dapatkan skor 100% dalam quiz',
    icon: '⭐',
    xpReward: 150,
    unlocked: true,
    unlockedAt: new Date('2025-01-12'),
  },
  {
    id: 'early-bird',
    title: 'Si Pagi',
    description: 'Belajar sebelum jam 8 pagi',
    icon: '🌅',
    xpReward: 75,
    unlocked: false,
  },
  {
    id: 'night-owl',
    title: 'Burung Hantu',
    description: 'Belajar setelah jam 10 malam',
    icon: '🦉',
    xpReward: 75,
    unlocked: false,
  },
  {
    id: 'speed-demon',
    title: 'Kilat Cepat',
    description: 'Selesaikan 5 soal dalam 2 menit',
    icon: '⚡',
    xpReward: 120,
    unlocked: false,
  },
  {
    id: 'master-algebra',
    title: 'Master Aljabar',
    description: 'Capai 90% penguasaan Aljabar',
    icon: '🎓',
    xpReward: 200,
    unlocked: true,
    progress: 85,
    total: 90,
  },
  {
    id: 'social-butterfly',
    title: 'Kupu-Kupu Sosial',
    description: 'Bantu 3 teman dengan peer tutoring',
    icon: '🦋',
    xpReward: 150,
    unlocked: false,
    progress: 1,
    total: 3,
  },
  {
    id: 'comeback-kid',
    title: 'Bangkit Kembali',
    description: 'Tingkatkan skor dari 50% ke 80%',
    icon: '📈',
    xpReward: 180,
    unlocked: false,
  },
  {
    id: 'marathon',
    title: 'Marathon',
    description: 'Belajar selama 30 hari berturut-turut',
    icon: '🏃',
    xpReward: 500,
    unlocked: false,
    progress: 7,
    total: 30,
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    studentId: '1',
    name: 'Tristan Firdaus',
    avatar: '👨‍🎓',
    xp: 2850,
    streak: 7,
    league: 'gold',
    weeklyXP: 485,
  },
  {
    rank: 2,
    studentId: '3',
    name: 'Budi Santoso',
    avatar: '👨‍🎓',
    xp: 2620,
    streak: 5,
    league: 'silver',
    weeklyXP: 420,
  },
  {
    rank: 3,
    studentId: '4',
    name: 'Dewi Lestari',
    avatar: '👩‍🎓',
    xp: 2340,
    streak: 3,
    league: 'silver',
    weeklyXP: 380,
  },
  {
    rank: 4,
    studentId: '2',
    name: 'Siti Nurhaliza',
    avatar: '👩‍🎓',
    xp: 1850,
    streak: 2,
    league: 'silver',
    weeklyXP: 320,
  },
  {
    rank: 5,
    studentId: '5',
    name: 'Rizki Ahmad',
    avatar: '👨‍🎓',
    xp: 1720,
    streak: 4,
    league: 'bronze',
    weeklyXP: 290,
  },
];

export const mockNotifications = [
  {
    id: '1',
    type: 'achievement' as const,
    title: 'Achievement Baru!',
    message: 'Kamu membuka "Semangat 7 Hari" 🔥',
    time: '5 menit lalu',
    read: false,
  },
  {
    id: '2',
    type: 'streak' as const,
    title: 'Jaga Streakmu!',
    message: 'Jangan lupa belajar hari ini untuk mempertahankan streak 7 hari',
    time: '2 jam lalu',
    read: false,
  },
  {
    id: '3',
    type: 'leaderboard' as const,
    title: 'Naik Peringkat!',
    message: 'Selamat! Kamu sekarang peringkat #1 di kelasmu 🏆',
    time: '1 hari lalu',
    read: true,
  },
  {
    id: '4',
    type: 'quiz' as const,
    title: 'Quiz Baru Tersedia',
    message: 'Topik Trigonometri menunggumu!',
    time: '2 hari lalu',
    read: true,
  },
  {
    id: '5',
    type: 'social' as const,
    title: 'Teman Baru',
    message: 'Rizki Ahmad mulai mengikutimu',
    time: '3 hari lalu',
    read: true,
  },
];

export const xpLevels = [
  { level: 1, xpRequired: 0, title: 'Pemula' },
  { level: 2, xpRequired: 100, title: 'Pelajar' },
  { level: 3, xpRequired: 300, title: 'Bersemangat' },
  { level: 4, xpRequired: 600, title: 'Tekun' },
  { level: 5, xpRequired: 1000, title: 'Rajin' },
  { level: 6, xpRequired: 1500, title: 'Ahli' },
  { level: 7, xpRequired: 2200, title: 'Master' },
  { level: 8, xpRequired: 3000, title: 'Profesor' },
  { level: 9, xpRequired: 4000, title: 'Jenius' },
  { level: 10, xpRequired: 5500, title: 'Legendaris' },
];

export const calculateLevel = (xp: number) => {
  for (let i = xpLevels.length - 1; i >= 0; i--) {
    if (xp >= xpLevels[i].xpRequired) {
      const currentLevel = xpLevels[i];
      const nextLevel = xpLevels[i + 1];
      const progressInLevel = nextLevel 
        ? ((xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100
        : 100;
      return {
        level: currentLevel.level,
        title: currentLevel.title,
        xpInLevel: xp - currentLevel.xpRequired,
        xpForNextLevel: nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : 0,
        progressPercent: Math.min(progressInLevel, 100),
      };
    }
  }
  return {
    level: 1,
    title: 'Pemula',
    xpInLevel: xp,
    xpForNextLevel: 100,
    progressPercent: (xp / 100) * 100,
  };
};
