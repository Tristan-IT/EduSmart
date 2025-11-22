export interface AiInterventionSuggestion {
  id: string;
  studentId: string;
  studentName: string;
  priority: "critical" | "high" | "medium";
  riskReasons: string[];
  recommendedAction: "schedule_meeting" | "send_message" | "assign_practice" | "call_parent";
  messageDraft: string;
  confidence: number;
  supportingData: Array<{
    label: string;
    value: string;
  }>;
}

export interface AiInterventionDeck {
  generatedAt: string;
  cohort: string;
  suggestions: AiInterventionSuggestion[];
}

export const mockAiInterventions: AiInterventionDeck = {
  generatedAt: new Date("2025-01-19T07:30:00Z").toISOString(),
  cohort: "Kelas 10A",
  suggestions: [
    {
      id: "ai-intervention-001",
      studentId: "2",
      studentName: "Siti Nurhaliza",
      priority: "critical",
      riskReasons: [
        "Skor aljabar turun 20% dalam 7 hari",
        "Tidak menyelesaikan lesson yang direkomendasikan AI selama 3 hari",
      ],
      recommendedAction: "schedule_meeting",
      messageDraft:
        "Halo Siti, Bu/Guru ingin menjadwalkan sesi mentoring singkat Kamis pukul 10.00 untuk membahas aljabar. Kabarin ya kalau waktunya bentrok.",
      confidence: 0.87,
      supportingData: [
        { label: "Mastery Aljabar", value: "45% (-15%)" },
        { label: "Aktivitas 7 Hari", value: "2 sesi" },
        { label: "Streak", value: "2 hari" },
      ],
    },
    {
      id: "ai-intervention-002",
      studentId: "4",
      studentName: "Dewi Lestari",
      priority: "high",
      riskReasons: [
        "Butuh motivasi tambahan, engagement turun 30%",
        "Melewatkan quest harian dua kali berturut-turut",
      ],
      recommendedAction: "send_message",
      messageDraft:
        "Hai Dewi, gimana kalau kita coba quest harian baru tentang statistika? Ada badge khusus yang bisa kamu buka minggu ini.",
      confidence: 0.74,
      supportingData: [
        { label: "XP 7 Hari", value: "-25%" },
        { label: "Quest Selesai", value: "3/7" },
        { label: "Streak", value: "3 hari" },
      ],
    },
  ],
};
