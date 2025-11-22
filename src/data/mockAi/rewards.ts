export interface AiRewardQuest {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly";
  xpReward: number;
  powerUpReward?: string;
  aiRationale: string;
  expiresAt: string;
}

export interface AiRewardResponse {
  studentId: string;
  generatedAt: string;
  quests: AiRewardQuest[];
}

export const mockAiRewards: AiRewardResponse = {
  studentId: "1",
  generatedAt: new Date("2025-01-19T07:55:00Z").toISOString(),
  quests: [
    {
      id: "quest-algebra-mini",
      title: "Mini Sprint Aljabar",
      description: "Selesaikan 2 lesson aljabar dalam 24 jam",
      type: "daily",
      xpReward: 60,
      powerUpReward: "Double XP 30 menit",
      aiRationale: "AI menyarankan fokus aljabar karena mastery turun dalam 3 hari terakhir.",
      expiresAt: new Date("2025-01-20T07:55:00Z").toISOString(),
    },
    {
      id: "quest-streak-shield",
      title: "Pertahankan Streak",
      description: "Belajar minimal 15 menit selama 3 hari berturut-turut",
      type: "weekly",
      xpReward: 150,
      powerUpReward: "Streak Shield",
      aiRationale: "Streak Tristan sudah 7 hari. AI merekomendasikan tantangan untuk menjaga momentum.",
      expiresAt: new Date("2025-01-24T07:55:00Z").toISOString(),
    },
  ],
};
