import mongoose from "mongoose";
import env from "../config/env.js";
import { connectDatabase } from "../config/database.js";
import UserModel from "../models/User.js";
import { StudentProfileModel } from "../models/StudentProfile.js";
import { TeacherProfileModel } from "../models/TeacherProfile.js";
import { TopicModel } from "../models/Topic.js";
import { MentorSessionModel } from "../models/MentorSession.js";
import { ContentItemModel } from "../models/ContentItem.js";
import { QuizQuestionModel } from "../models/QuizQuestion.js";
import { ReportModel } from "../models/Report.js";
import { TelemetryEventModel } from "../models/TelemetryEvent.js";
import { hashPassword } from "../utils/password.js";

const seed = async () => {
  await connectDatabase();

  await Promise.all([
    UserModel.deleteMany({}),
    StudentProfileModel.deleteMany({}),
    TeacherProfileModel.deleteMany({}),
    TopicModel.deleteMany({}),
    MentorSessionModel.deleteMany({}),
    ContentItemModel.deleteMany({}),
    QuizQuestionModel.deleteMany({}),
    ReportModel.deleteMany({}),
    TelemetryEventModel.deleteMany({}),
  ]);

  const teacherPassword = await hashPassword("guru12345");
  const teacher = await UserModel.create({
    name: "Rina Wulandari",
    email: "rina.wulandari@sekolah.id",
    role: "teacher",
    passwordHash: teacherPassword,
    avatar: "👩‍🏫",
    schoolId: "SMA-N-10",
  });

  await TeacherProfileModel.create({
    user: teacher.id,
    schoolName: "SMA Negeri 10 Jakarta",
    subjects: ["Matematika", "Statistika"],
    classSummaries: [
      { className: "10A", studentCount: 32, masteryAverage: 72, riskCount: 3 },
      { className: "10B", studentCount: 30, masteryAverage: 75, riskCount: 2 },
    ],
  });

  const studentSeeds = [
    {
      profile: {
        name: "Tristan Firdaus",
        email: "Tristan.Firdaus@sekolah.id",
        avatar: "👨‍🎓",
        className: "10A",
        masteryPerTopic: {
          algebra: 85,
          geometry: 72,
          statistics: 90,
          trigonometry: 65,
        },
        xp: 2850,
        level: 7,
        league: "gold",
        dailyGoalXP: 40,
        dailyGoalProgress: 28,
        streak: 7,
        riskLevel: "low" as const,
      },
      dailyPlan: [
        {
          time: "10:00",
          activity: "Latihan Aljabar",
          duration: "15 menit",
          topicId: "algebra",
          status: "completed" as const,
        },
        {
          time: "10:30",
          activity: "Review Geometri",
          duration: "20 menit",
          topicId: "geometry",
          status: "in-progress" as const,
        },
        {
          time: "11:00",
          activity: "Quiz Statistika",
          duration: "10 menit",
          topicId: "statistics",
          status: "pending" as const,
        },
      ],
      recommendations: [
        {
          id: "rec-lesson-eq-2",
          title: "Latihan Persamaan Dua Langkah",
          type: "lesson" as const,
          topicId: "algebra",
          estimatedMinutes: 7,
          priority: "high" as const,
          reason:
            "Mastery aljabar turun 12% dalam 3 hari. AI mendeteksi pola kesalahan pada operasi campuran.",
          masteryDelta: 8,
          xpReward: 35,
          ctaLabel: "Mulai lesson",
          ctaHref: "/learning?lesson=lesson-eq-2",
        },
        {
          id: "rec-quiz-statistics",
          title: "Quiz Diagnostik Statistika",
          type: "quiz" as const,
          topicId: "statistics",
          estimatedMinutes: 10,
          priority: "medium" as const,
          reason: "Sudah 5 hari tidak mengerjakan statistika. AI merekomendasikan pemanasan ringan.",
          xpReward: 50,
          ctaLabel: "Kerjakan quiz",
          ctaHref: "/quiz?topic=statistics",
        },
        {
          id: "rec-video-growthmindset",
          title: "Video Motivasi: Growth Mindset",
          type: "video" as const,
          topicId: "mindset",
          estimatedMinutes: 4,
          priority: "low" as const,
          reason: "AI mendeteksi Tristan sering belajar larut malam. Video ini mendorong manajemen energi dan fokus.",
          ctaLabel: "Tonton sekarang",
          ctaHref: "/content/mindset/growth-video",
        },
      ],
      quests: [
        {
          id: "quest-algebra-mini",
          title: "Mini Sprint Aljabar",
          description: "Selesaikan 2 lesson aljabar dalam 24 jam",
          type: "daily" as const,
          xpReward: 60,
          powerUpReward: "Double XP 30 menit",
          aiRationale: "AI menyarankan fokus aljabar karena mastery turun dalam 3 hari terakhir.",
          expiresAt: new Date("2025-01-20T07:55:00Z"),
        },
        {
          id: "quest-streak-shield",
          title: "Pertahankan Streak",
          description: "Belajar minimal 15 menit selama 3 hari berturut-turut",
          type: "weekly" as const,
          xpReward: 150,
          powerUpReward: "Streak Shield",
          aiRationale: "Streak Tristan sudah 7 hari. AI merekomendasikan tantangan untuk menjaga momentum.",
          expiresAt: new Date("2025-01-24T07:55:00Z"),
        },
      ],
    },
    {
      profile: {
        name: "Siti Nurhaliza",
        email: "siti.nurhaliza@sekolah.id",
        avatar: "👩‍🎓",
        className: "10A",
        masteryPerTopic: {
          algebra: 45,
          geometry: 50,
          statistics: 40,
          trigonometry: 35,
        },
        xp: 1120,
        level: 4,
        league: "bronze",
        dailyGoalXP: 30,
        dailyGoalProgress: 12,
        streak: 2,
        riskLevel: "high" as const,
      },
      dailyPlan: [],
      recommendations: [],
      quests: [],
    },
    {
      profile: {
        name: "Budi Santoso",
        email: "budi.santoso@sekolah.id",
        avatar: "👨‍🎓",
        className: "10B",
        masteryPerTopic: {
          algebra: 78,
          geometry: 80,
          statistics: 75,
          trigonometry: 70,
        },
        xp: 2620,
        level: 6,
        league: "silver",
        dailyGoalXP: 45,
        dailyGoalProgress: 42,
        streak: 5,
        riskLevel: "low" as const,
      },
      dailyPlan: [],
      recommendations: [],
      quests: [],
    },
    {
      profile: {
        name: "Dewi Lestari",
        email: "dewi.lestari@sekolah.id",
        avatar: "👩‍🎓",
        className: "10B",
        masteryPerTopic: {
          algebra: 60,
          geometry: 58,
          statistics: 62,
          trigonometry: 55,
        },
        xp: 1980,
        level: 5,
        league: "silver",
        dailyGoalXP: 35,
        dailyGoalProgress: 24,
        streak: 3,
        riskLevel: "medium" as const,
      },
      dailyPlan: [],
      recommendations: [],
      quests: [],
    },
  ];

  const baseSkillTree = [
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

  const boosts = [
    { id: "boost-xp", label: "Double XP", remaining: 1, type: "xp" as const },
    { id: "boost-shield", label: "Streak Shield", remaining: 2, type: "shield" as const },
  ];

  const mentorMessages = [
    {
      id: "msg-001",
      role: "assistant" as const,
      content:
        "Hai Tristan! Aku lihat skor aljabar kamu sedikit menurun. Mau coba latihan cepat 5 soal persamaan dua langkah?",
      timestamp: new Date("2025-01-19T07:45:00Z"),
      topicId: "algebra",
    },
    {
      id: "msg-002",
      role: "student" as const,
      content: "Boleh, tapi aku agak lupa langkah-langkahnya.",
      timestamp: new Date("2025-01-19T07:45:30Z"),
    },
    {
      id: "msg-003",
      role: "assistant" as const,
      content:
        "Ingat untuk mengurangi konstanta terlebih dahulu, lalu bagi dengan koefisien di depan variabel. Mau lihat contoh sebelum latihan?",
      timestamp: new Date("2025-01-19T07:46:00Z"),
      topicId: "algebra",
    },
  ];

  for (const [index, seedInfo] of studentSeeds.entries()) {
    const passwordHash = await hashPassword("siswa12345");
    const studentUser = await UserModel.create({
      name: seedInfo.profile.name,
      email: seedInfo.profile.email,
      role: "student",
      passwordHash,
      avatar: seedInfo.profile.avatar,
      className: seedInfo.profile.className,
    });

    await StudentProfileModel.create({
      user: studentUser.id,
      masteryPerTopic: seedInfo.profile.masteryPerTopic,
      xp: seedInfo.profile.xp,
      level: seedInfo.profile.level,
      xpInLevel: index === 0 ? 650 : 240,
      xpForNextLevel: index === 0 ? 800 : 400,
      streak: seedInfo.profile.streak,
      bestStreak: index === 0 ? 9 : seedInfo.profile.streak,
      dailyGoalXP: seedInfo.profile.dailyGoalXP,
      dailyGoalProgress: seedInfo.profile.dailyGoalProgress,
      dailyGoalMet: false,
      dailyGoalClaimed: false,
      league: seedInfo.profile.league,
      riskLevel: seedInfo.profile.riskLevel,
      boosts: boosts,
      lastLessonId: "lesson-eq-1",
      lastCompletedAt: new Date("2025-01-18T06:30:00Z"),
      dailyPlan: seedInfo.dailyPlan,
      aiRecommendations: seedInfo.recommendations,
      aiRewardQuests: seedInfo.quests,
      skillTree: baseSkillTree,
    });

    if (index === 0) {
      await MentorSessionModel.create({
        student: studentUser.id,
        summary:
          "AI merekomendasikan latihan persamaan dua langkah karena tingkat kesalahan Tristan meningkat 15% dalam 3 hari terakhir.",
        messages: mentorMessages,
      });
    }
  }

  await TopicModel.insertMany([
    {
      title: "Aljabar Dasar",
      description: "Pelajari konsep dasar aljabar, persamaan linear, dan sistem persamaan",
      estimatedMinutes: 45,
      progressPercent: 75,
      dependencies: [],
      difficulty: "beginner",
      slug: "algebra",
    },
    {
      title: "Geometri",
      description: "Memahami bentuk, sudut, dan teorema geometri dasar",
      estimatedMinutes: 50,
      progressPercent: 60,
      dependencies: ["algebra"],
      difficulty: "intermediate",
      slug: "geometry",
    },
    {
      title: "Statistika",
      description: "Analisis data, rata-rata, median, modus, dan visualisasi data",
      estimatedMinutes: 40,
      progressPercent: 85,
      dependencies: ["algebra"],
      difficulty: "intermediate",
      slug: "statistics",
    },
    {
      title: "Trigonometri",
      description: "Fungsi trigonometri, identitas, dan aplikasinya",
      estimatedMinutes: 55,
      progressPercent: 30,
      dependencies: ["algebra", "geometry"],
      difficulty: "advanced",
      slug: "trigonometry",
    },
  ]);

  await ContentItemModel.insertMany([
    {
      topic: "algebra",
      type: "video",
      difficulty: "beginner",
      title: "Persamaan Linear dalam Kehidupan Sehari-hari",
      durationMinutes: 12,
      author: "Tim Akademik Adaptif",
      tags: ["pengenalan", "aplikasi"],
    },
    {
      topic: "statistics",
      type: "pdf",
      difficulty: "intermediate",
      title: "Ringkasan Materi: Visualisasi Data",
      durationMinutes: 18,
      author: "Guru Rina",
      tags: ["diagram", "latihan"],
    },
    {
      topic: "trigonometry",
      type: "quiz",
      difficulty: "advanced",
      title: "Quiz Evaluasi Fungsi Trigonometri",
      durationMinutes: 20,
      author: "Tim Akademik Adaptif",
      tags: ["diagnostik", "tantangan"],
    },
  ]);

  await QuizQuestionModel.insertMany([
    {
      topicId: "algebra",
      question: "Berapakah nilai x dalam persamaan: 2x + 5 = 13?",
      type: "mcq",
      options: ["2", "4", "6", "8"],
      correctAnswer: "4",
      difficulty: 1,
      hintCount: 2,
      hints: [
        "Kurangi kedua sisi dengan 5",
        "Setelah itu, bagi kedua sisi dengan 2",
      ],
      explanation: "Langkah penyelesaian: 2x + 5 = 13 → 2x = 13 - 5 → 2x = 8 → x = 4",
    },
    {
      topicId: "algebra",
      question: "Sederhanakan ekspresi: 3(x + 2) - 2(x - 1)",
      type: "mcq",
      options: ["x + 8", "x + 4", "x + 6", "5x + 4"],
      correctAnswer: "x + 8",
      difficulty: 2,
      hintCount: 2,
      hints: [
        "Gunakan distributive property: a(b + c) = ab + ac",
        "Gabungkan term yang sejenis setelah ekspansi",
      ],
      explanation: "3(x + 2) - 2(x - 1) = 3x + 6 - 2x + 2 = x + 8",
    },
    {
      topicId: "geometry",
      question: "Jumlah sudut dalam segitiga adalah berapa derajat?",
      type: "short-answer",
      correctAnswer: "180",
      difficulty: 1,
      hintCount: 1,
      hints: ["Ini adalah teorema dasar geometri yang perlu dihafalkan"],
      explanation: "Jumlah ketiga sudut dalam segitiga selalu sama dengan 180 derajat",
    },
  ]);

  await ReportModel.insertMany([
    {
      title: "Ringkasan Kelas 10A - Minggu 3",
      type: "kelas",
      generatedAt: new Date("2025-01-15T12:00:00Z"),
      url: "/reports/report-001.pdf",
      filters: {
        classId: "10A",
        range: "2025-01-08/2025-01-14",
      },
    },
    {
      title: "Performa Individu • Tristan Firdaus",
      type: "individu",
      generatedAt: new Date("2025-01-16T08:10:00Z"),
      url: "/reports/report-002.pdf",
      filters: {
        studentId: "1",
        range: "2025-01-01/2025-01-15",
      },
    },
    {
      title: "Ringkasan Risiko Belajar Kelas 10B",
      type: "ringkas",
      generatedAt: new Date("2025-01-16T09:45:00Z"),
      url: "/reports/report-003.pdf",
      filters: {
        classId: "10B",
        focus: "risk",
      },
    },
  ]);

  await TelemetryEventModel.insertMany([
    {
      type: "lesson_completed",
      studentId: "1",
      studentName: "Tristan Firdaus",
      timestamp: new Date("2025-01-14T08:35:00Z"),
      metadata: {
        lessonId: "lesson-linear-2",
        skillId: "skill-linear",
        unitId: "unit-1",
        xpEarned: 20,
        streakIncrement: 1,
      },
    },
    {
      type: "reward_claimed",
      studentId: "1",
      studentName: "Tristan Firdaus",
      timestamp: new Date("2025-01-14T08:40:00Z"),
      metadata: {
        rewardType: "chest",
        rewardLabel: "Peti Emas Dasar",
        xpBonus: 80,
      },
    },
    {
      type: "daily_goal_claimed",
      studentId: "3",
      studentName: "Budi Santoso",
      timestamp: new Date("2025-01-13T12:05:00Z"),
      metadata: {
        streak: 5,
        xpBonus: 30,
      },
    },
  ]);

  console.log("Seed selesai. Data awal berhasil dimuat.");
  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error("Seed gagal", error);
  mongoose.disconnect();
  process.exit(1);
});
