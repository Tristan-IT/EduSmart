export interface AiRecommendationItem {
  id: string;
  title: string;
  type: "lesson" | "quiz" | "video" | "challenge";
  topicId: string;
  estimatedMinutes: number;
  priority: "high" | "medium" | "low";
  reason: string;
  masteryDelta?: number;
  xpReward?: number;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface AiRecommendationResponse {
  studentId: string;
  goalFocus: string;
  generatedAt: string;
  recommendations: AiRecommendationItem[];
}

export const mockAiRecommendations: AiRecommendationResponse = {
  studentId: "1",
  goalFocus: "Memperbaiki penguasaan persamaan dua langkah dan menjaga streak harian",
  generatedAt: new Date("2025-01-19T07:40:00Z").toISOString(),
  recommendations: [
    {
      id: "rec-lesson-eq-2",
      title: "Latihan Persamaan Dua Langkah",
      type: "lesson",
      topicId: "algebra",
      estimatedMinutes: 7,
      priority: "high",
      reason: "Mastery aljabar turun 12% dalam 3 hari. AI mendeteksi pola kesalahan pada operasi campuran.",
      masteryDelta: 8,
      xpReward: 35,
      ctaLabel: "Mulai lesson",
      ctaHref: "/learning?lesson=lesson-eq-2",
    },
    {
      id: "rec-quiz-statistics",
      title: "Quiz Diagnostik Statistika",
      type: "quiz",
      topicId: "statistics",
      estimatedMinutes: 10,
      priority: "medium",
      reason: "Sudah 5 hari tidak mengerjakan statistika. AI merekomendasikan pemanasan ringan.",
      xpReward: 50,
      ctaLabel: "Kerjakan quiz",
      ctaHref: "/quiz?topic=statistics",
    },
    {
      id: "rec-video-growthmindset",
      title: "Video Motivasi: Growth Mindset",
      type: "video",
      topicId: "mindset",
      estimatedMinutes: 4,
      priority: "low",
      reason: "AI mendeteksi Tristan sering belajar larut malam. Video ini mendorong manajemen energi dan fokus.",
      ctaLabel: "Tonton sekarang",
      ctaHref: "/content/mindset/growth-video",
    },
  ],
};
