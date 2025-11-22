/**
 * Achievement Manager for Adapti Belajar
 * Handles achievement tracking, unlocking, and notifications
 */

import { Achievement } from "@/components/AchievementUnlock";

export interface AchievementProgress {
  achievementId: string;
  progress: number;
  total: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  gemsReward?: number;
  category: string;
  checkCondition: (context: AchievementContext) => boolean | { progress: number; total: number };
}

export interface AchievementContext {
  quizCount?: number;
  quizPerfectCount?: number;
  streak?: number;
  currentHour?: number;
  categoryMastery?: Record<string, number>;
  weeklyXP?: number;
  moduleCount?: number;
  speedRecords?: number[];
  helpedStudents?: number;
  improvements?: { from: number; to: number }[];
  subjectLessons?: Record<string, number>; // Subject ID -> completed lessons count
  subjectMastery?: Record<string, number>; // Subject ID -> mastery percentage
  
  // NEW: Skill Tree specific
  nodesCompleted?: number; // Total nodes completed
  nodesCompletedToday?: number; // Nodes completed today
  perfectNodes?: number; // Nodes completed with 3 stars
  checkpointsCompleted?: number; // Checkpoint nodes completed
  nodeStreak?: number; // Consecutive nodes completed
  subjectNodesCompleted?: Record<string, number>; // Subject -> nodes completed
  difficultyNodesCompleted?: Record<string, number>; // Difficulty -> nodes completed
  
  [key: string]: any;
}

class AchievementManager {
  private readonly STORAGE_KEY = "adapti-achievements";
  private achievements: Map<string, AchievementProgress> = new Map();
  private definitions: AchievementDefinition[] = [];

  constructor() {
    this.loadProgress();
    this.initializeDefinitions();
  }

  private loadProgress(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.achievements = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error("Failed to load achievement progress:", error);
    }
  }

  private saveProgress(): void {
    try {
      const data = Object.fromEntries(this.achievements);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save achievement progress:", error);
    }
  }

  private initializeDefinitions(): void {
    this.definitions = [
      // Beginner Achievements
      {
        id: "first-quiz",
        title: "Langkah Pertama",
        description: "Selesaikan quiz pertamamu",
        icon: "🎯",
        xpReward: 50,
        gemsReward: 10,
        category: "beginner",
        checkCondition: (ctx) => (ctx.quizCount || 0) >= 1,
      },
      {
        id: "first-module",
        title: "Modul Pertama",
        description: "Selesaikan modul pertamamu",
        icon: "📚",
        xpReward: 75,
        gemsReward: 15,
        category: "beginner",
        checkCondition: (ctx) => (ctx.moduleCount || 0) >= 1,
      },

      // Streak Achievements
      {
        id: "streak-3",
        title: "Konsisten 3 Hari",
        description: "Belajar 3 hari berturut-turut",
        icon: "🔥",
        xpReward: 75,
        gemsReward: 10,
        category: "streak",
        checkCondition: (ctx) => (ctx.streak || 0) >= 3,
      },
      {
        id: "streak-7",
        title: "Semangat 7 Hari",
        description: "Belajar 7 hari berturut-turut",
        icon: "🔥",
        xpReward: 100,
        gemsReward: 25,
        category: "streak",
        checkCondition: (ctx) => (ctx.streak || 0) >= 7,
      },
      {
        id: "streak-14",
        title: "Dua Minggu!",
        description: "Belajar 14 hari berturut-turut",
        icon: "🔥",
        xpReward: 200,
        gemsReward: 50,
        category: "streak",
        checkCondition: (ctx) => (ctx.streak || 0) >= 14,
      },
      {
        id: "streak-30",
        title: "Sebulan Penuh!",
        description: "Belajar 30 hari berturut-turut",
        icon: "🔥",
        xpReward: 500,
        gemsReward: 100,
        category: "streak",
        checkCondition: (ctx) => (ctx.streak || 0) >= 30,
      },
      {
        id: "streak-100",
        title: "Centurion",
        description: "Belajar 100 hari berturut-turut",
        icon: "💯",
        xpReward: 1000,
        gemsReward: 250,
        category: "streak",
        checkCondition: (ctx) => (ctx.streak || 0) >= 100,
      },

      // Performance Achievements
      {
        id: "perfect-score",
        title: "Sempurna!",
        description: "Dapatkan skor 100% dalam quiz",
        icon: "⭐",
        xpReward: 150,
        gemsReward: 20,
        category: "performance",
        checkCondition: (ctx) => (ctx.quizPerfectCount || 0) >= 1,
      },
      {
        id: "perfect-5",
        title: "Perfeksionis",
        description: "Dapatkan skor 100% dalam 5 quiz",
        icon: "✨",
        xpReward: 300,
        gemsReward: 50,
        category: "performance",
        checkCondition: (ctx) => (ctx.quizPerfectCount || 0) >= 5,
      },
      {
        id: "speed-demon",
        title: "Kilat Cepat",
        description: "Selesaikan 5 soal dalam 2 menit",
        icon: "⚡",
        xpReward: 120,
        gemsReward: 15,
        category: "performance",
        checkCondition: (ctx) => (ctx.speedRecords || []).length >= 1,
      },

      // Time-based Achievements
      {
        id: "early-bird",
        title: "Si Pagi",
        description: "Belajar sebelum jam 8 pagi",
        icon: "🌅",
        xpReward: 75,
        gemsReward: 10,
        category: "time",
        checkCondition: (ctx) => (ctx.currentHour || 12) < 8,
      },
      {
        id: "night-owl",
        title: "Burung Hantu",
        description: "Belajar setelah jam 10 malam",
        icon: "🦉",
        xpReward: 75,
        gemsReward: 10,
        category: "time",
        checkCondition: (ctx) => (ctx.currentHour || 12) >= 22,
      },

      // Mastery Achievements
      {
        id: "master-algebra",
        title: "Master Aljabar",
        description: "Capai 90% penguasaan Aljabar",
        icon: "🎓",
        xpReward: 200,
        gemsReward: 40,
        category: "mastery",
        checkCondition: (ctx) => {
          const mastery = ctx.categoryMastery?.["algebra"] || 0;
          return { progress: mastery, total: 90 };
        },
      },
      {
        id: "master-geometry",
        title: "Master Geometri",
        description: "Capai 90% penguasaan Geometri",
        icon: "📐",
        xpReward: 200,
        gemsReward: 40,
        category: "mastery",
        checkCondition: (ctx) => {
          const mastery = ctx.categoryMastery?.["geometry"] || 0;
          return { progress: mastery, total: 90 };
        },
      },

      // Subject-Specific Achievements
      {
        id: "math-explorer",
        title: "Penjelajah Matematika",
        description: "Selesaikan 10 pelajaran Matematika",
        icon: "➕",
        xpReward: 150,
        gemsReward: 25,
        category: "subject",
        checkCondition: (ctx) => {
          const completed = ctx.subjectLessons?.["math"] || 0;
          return { progress: completed, total: 10 };
        },
      },
      {
        id: "math-master",
        title: "Master Matematika",
        description: "Capai mastery level 80% di Matematika",
        icon: "🧮",
        xpReward: 300,
        gemsReward: 50,
        category: "subject",
        checkCondition: (ctx) => {
          const mastery = ctx.subjectMastery?.["math"] || 0;
          return { progress: mastery, total: 80 };
        },
      },
      {
        id: "science-seeker",
        title: "Pencari Ilmu Sains",
        description: "Selesaikan 10 pelajaran IPA/Sains",
        icon: "🔬",
        xpReward: 150,
        gemsReward: 25,
        category: "subject",
        checkCondition: (ctx) => {
          const completed = ctx.subjectLessons?.["science"] || 0;
          return { progress: completed, total: 10 };
        },
      },
      {
        id: "science-master",
        title: "Master Sains",
        description: "Capai mastery level 80% di IPA/Sains",
        icon: "⚗️",
        xpReward: 300,
        gemsReward: 50,
        category: "subject",
        checkCondition: (ctx) => {
          const mastery = ctx.subjectMastery?.["science"] || 0;
          return { progress: mastery, total: 80 };
        },
      },
      {
        id: "language-lover",
        title: "Pecinta Bahasa",
        description: "Selesaikan 10 pelajaran Bahasa Indonesia",
        icon: "📖",
        xpReward: 150,
        gemsReward: 25,
        category: "subject",
        checkCondition: (ctx) => {
          const completed = ctx.subjectLessons?.["language"] || 0;
          return { progress: completed, total: 10 };
        },
      },
      {
        id: "language-master",
        title: "Master Bahasa",
        description: "Capai mastery level 80% di Bahasa Indonesia",
        icon: "✍️",
        xpReward: 300,
        gemsReward: 50,
        category: "subject",
        checkCondition: (ctx) => {
          const mastery = ctx.subjectMastery?.["language"] || 0;
          return { progress: mastery, total: 80 };
        },
      },
      {
        id: "english-explorer",
        title: "English Explorer",
        description: "Complete 10 English lessons",
        icon: "🇬🇧",
        xpReward: 150,
        gemsReward: 25,
        category: "subject",
        checkCondition: (ctx) => {
          const completed = ctx.subjectLessons?.["english"] || 0;
          return { progress: completed, total: 10 };
        },
      },
      {
        id: "english-master",
        title: "English Master",
        description: "Achieve 80% mastery in English",
        icon: "📚",
        xpReward: 300,
        gemsReward: 50,
        category: "subject",
        checkCondition: (ctx) => {
          const mastery = ctx.subjectMastery?.["english"] || 0;
          return { progress: mastery, total: 80 };
        },
      },
      {
        id: "social-studies-scholar",
        title: "Sarjana IPS",
        description: "Selesaikan 10 pelajaran IPS",
        icon: "🌍",
        xpReward: 150,
        gemsReward: 25,
        category: "subject",
        checkCondition: (ctx) => {
          const completed = ctx.subjectLessons?.["social"] || 0;
          return { progress: completed, total: 10 };
        },
      },
      {
        id: "social-studies-master",
        title: "Master IPS",
        description: "Capai mastery level 80% di IPS",
        icon: "🏛️",
        xpReward: 300,
        gemsReward: 50,
        category: "subject",
        checkCondition: (ctx) => {
          const mastery = ctx.subjectMastery?.["social"] || 0;
          return { progress: mastery, total: 80 };
        },
      },
      {
        id: "subject-champion",
        title: "Champion Multi-Subjek",
        description: "Capai 70% mastery di 5 mata pelajaran berbeda",
        icon: "🎖️",
        xpReward: 500,
        gemsReward: 100,
        category: "subject",
        checkCondition: (ctx) => {
          const mastery = ctx.subjectMastery || {};
          const above70 = Object.values(mastery).filter((m: any) => m >= 70).length;
          return { progress: above70, total: 5 };
        },
      },

      // Social Achievements
      {
        id: "social-butterfly",
        title: "Kupu-Kupu Sosial",
        description: "Bantu 3 teman dengan peer tutoring",
        icon: "🦋",
        xpReward: 150,
        gemsReward: 30,
        category: "social",
        checkCondition: (ctx) => {
          const helped = ctx.helpedStudents || 0;
          return { progress: helped, total: 3 };
        },
      },

      // Improvement Achievements
      {
        id: "comeback-kid",
        title: "Bangkit Kembali",
        description: "Tingkatkan skor dari 50% ke 80%",
        icon: "📈",
        xpReward: 180,
        gemsReward: 35,
        category: "improvement",
        checkCondition: (ctx) => {
          const improvements = ctx.improvements || [];
          return improvements.some((imp) => imp.from <= 50 && imp.to >= 80);
        },
      },

      // Weekly XP Achievements
      {
        id: "weekly-warrior",
        title: "Warrior Mingguan",
        description: "Raih 1000 XP dalam seminggu",
        icon: "⚔️",
        xpReward: 250,
        gemsReward: 50,
        category: "xp",
        checkCondition: (ctx) => (ctx.weeklyXP || 0) >= 1000,
      },
      {
        id: "weekly-champion",
        title: "Champion Mingguan",
        description: "Raih 2500 XP dalam seminggu",
        icon: "🏆",
        xpReward: 500,
        gemsReward: 100,
        category: "xp",
        checkCondition: (ctx) => (ctx.weeklyXP || 0) >= 2500,
      },

      // Skill Tree Achievements
      {
        id: "node-first",
        title: "Node Pertama",
        description: "Selesaikan node pertamamu di skill tree",
        icon: "🎯",
        xpReward: 50,
        gemsReward: 10,
        category: "skill-tree",
        checkCondition: (ctx) => (ctx.nodesCompleted || 0) >= 1,
      },
      {
        id: "node-5",
        title: "Lima Node",
        description: "Selesaikan 5 node di skill tree",
        icon: "🎯",
        xpReward: 100,
        gemsReward: 20,
        category: "skill-tree",
        checkCondition: (ctx) => {
          const completed = ctx.nodesCompleted || 0;
          return { progress: completed, total: 5 };
        },
      },
      {
        id: "node-10",
        title: "Sepuluh Node",
        description: "Selesaikan 10 node di skill tree",
        icon: "🎯",
        xpReward: 200,
        gemsReward: 40,
        category: "skill-tree",
        checkCondition: (ctx) => {
          const completed = ctx.nodesCompleted || 0;
          return { progress: completed, total: 10 };
        },
      },
      {
        id: "node-25",
        title: "Quarter Century",
        description: "Selesaikan 25 node di skill tree",
        icon: "🌟",
        xpReward: 500,
        gemsReward: 100,
        category: "skill-tree",
        checkCondition: (ctx) => {
          const completed = ctx.nodesCompleted || 0;
          return { progress: completed, total: 25 };
        },
      },
      {
        id: "node-50",
        title: "Half Century",
        description: "Selesaikan 50 node di skill tree",
        icon: "💫",
        xpReward: 1000,
        gemsReward: 200,
        category: "skill-tree",
        checkCondition: (ctx) => {
          const completed = ctx.nodesCompleted || 0;
          return { progress: completed, total: 50 };
        },
      },
      {
        id: "node-100",
        title: "Centurion Node",
        description: "Selesaikan 100 node di skill tree",
        icon: "💯",
        xpReward: 2000,
        gemsReward: 500,
        category: "skill-tree",
        checkCondition: (ctx) => {
          const completed = ctx.nodesCompleted || 0;
          return { progress: completed, total: 100 };
        },
      },
      {
        id: "perfect-node",
        title: "Node Sempurna",
        description: "Selesaikan node dengan 3 bintang",
        icon: "⭐",
        xpReward: 75,
        gemsReward: 15,
        category: "skill-tree",
        checkCondition: (ctx) => (ctx.perfectNodes || 0) >= 1,
      },
      {
        id: "perfect-10",
        title: "Sepuluh Sempurna",
        description: "Selesaikan 10 node dengan 3 bintang",
        icon: "✨",
        xpReward: 300,
        gemsReward: 60,
        category: "skill-tree",
        checkCondition: (ctx) => {
          const perfect = ctx.perfectNodes || 0;
          return { progress: perfect, total: 10 };
        },
      },
      {
        id: "checkpoint-master",
        title: "Master Checkpoint",
        description: "Selesaikan checkpoint pertamamu",
        icon: "🏁",
        xpReward: 150,
        gemsReward: 30,
        category: "skill-tree",
        checkCondition: (ctx) => (ctx.checkpointsCompleted || 0) >= 1,
      },
      {
        id: "checkpoint-champion",
        title: "Champion Checkpoint",
        description: "Selesaikan 5 checkpoint",
        icon: "🏆",
        xpReward: 500,
        gemsReward: 100,
        category: "skill-tree",
        checkCondition: (ctx) => {
          const checkpoints = ctx.checkpointsCompleted || 0;
          return { progress: checkpoints, total: 5 };
        },
      },
      {
        id: "node-streak-3",
        title: "Streak 3 Node",
        description: "Selesaikan 3 node berturut-turut tanpa gagal",
        icon: "🔥",
        xpReward: 100,
        gemsReward: 20,
        category: "skill-tree",
        checkCondition: (ctx) => (ctx.nodeStreak || 0) >= 3,
      },
      {
        id: "node-streak-5",
        title: "Streak 5 Node",
        description: "Selesaikan 5 node berturut-turut tanpa gagal",
        icon: "🔥",
        xpReward: 200,
        gemsReward: 40,
        category: "skill-tree",
        checkCondition: (ctx) => (ctx.nodeStreak || 0) >= 5,
      },
      {
        id: "daily-dedicated",
        title: "Dedikasi Harian",
        description: "Selesaikan 3 node dalam satu hari",
        icon: "📅",
        xpReward: 120,
        gemsReward: 25,
        category: "skill-tree",
        checkCondition: (ctx) => (ctx.nodesCompletedToday || 0) >= 3,
      },
      {
        id: "math-tree-explorer",
        title: "Penjelajah Pohon Matematika",
        description: "Selesaikan 10 node Matematika",
        icon: "➕",
        xpReward: 200,
        gemsReward: 40,
        category: "skill-tree",
        checkCondition: (ctx) => {
          const mathNodes = ctx.subjectNodesCompleted?.["Matematika"] || 0;
          return { progress: mathNodes, total: 10 };
        },
      },
      {
        id: "difficulty-master-hard",
        title: "Master Kesulitan Tinggi",
        description: "Selesaikan 5 node tingkat 'Sulit'",
        icon: "💪",
        xpReward: 300,
        gemsReward: 60,
        category: "skill-tree",
        checkCondition: (ctx) => {
          const hardNodes = ctx.difficultyNodesCompleted?.["Sulit"] || 0;
          return { progress: hardNodes, total: 5 };
        },
      },
    ];
  }

  /**
   * Check for newly unlocked achievements based on context
   */
  public checkAchievements(context: AchievementContext): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    for (const def of this.definitions) {
      const progress = this.achievements.get(def.id);

      // Skip if already unlocked
      if (progress?.unlocked) continue;

      const result = def.checkCondition(context);

      if (typeof result === "boolean") {
        if (result) {
          // Achievement unlocked!
          this.unlockAchievement(def.id);
          newlyUnlocked.push({
            id: def.id,
            title: def.title,
            description: def.description,
            icon: def.icon,
            xpReward: def.xpReward,
            gemsReward: def.gemsReward,
            category: def.category,
          });
        }
      } else {
        // Progressive achievement - update progress
        this.updateProgress(def.id, result.progress, result.total);

        // Check if unlocked
        if (result.progress >= result.total && !progress?.unlocked) {
          this.unlockAchievement(def.id);
          newlyUnlocked.push({
            id: def.id,
            title: def.title,
            description: def.description,
            icon: def.icon,
            xpReward: def.xpReward,
            gemsReward: def.gemsReward,
            category: def.category,
          });
        }
      }
    }

    return newlyUnlocked;
  }

  /**
   * Unlock an achievement
   */
  private unlockAchievement(achievementId: string): void {
    this.achievements.set(achievementId, {
      achievementId,
      progress: 100,
      total: 100,
      unlocked: true,
      unlockedAt: new Date().toISOString(),
    });
    this.saveProgress();
  }

  /**
   * Update progress for an achievement
   */
  private updateProgress(achievementId: string, progress: number, total: number): void {
    const current = this.achievements.get(achievementId);
    this.achievements.set(achievementId, {
      achievementId,
      progress,
      total,
      unlocked: current?.unlocked || false,
      unlockedAt: current?.unlockedAt,
    });
    this.saveProgress();
  }

  /**
   * Get all achievements with their progress
   */
  public getAllAchievements(): (Achievement & { progress?: number; total?: number; unlocked: boolean })[] {
    return this.definitions.map((def) => {
      const progress = this.achievements.get(def.id);
      return {
        id: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        xpReward: def.xpReward,
        gemsReward: def.gemsReward,
        category: def.category,
        unlocked: progress?.unlocked || false,
        progress: progress?.progress,
        total: progress?.total,
      };
    });
  }

  /**
   * Get achievement progress
   */
  public getProgress(achievementId: string): AchievementProgress | undefined {
    return this.achievements.get(achievementId);
  }

  /**
   * Reset all achievements (for testing)
   */
  public resetAll(): void {
    this.achievements.clear();
    this.saveProgress();
  }
}

// Singleton instance
const achievementManager = new AchievementManager();

export default achievementManager;
