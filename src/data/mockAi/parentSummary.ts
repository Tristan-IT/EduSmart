export interface AiParentSummary {
  studentId: string;
  studentName: string;
  period: string;
  generatedAt: string;
  highlights: string[];
  focusAreas: string[];
  recommendedActions: string[];
  signature: string;
}

export const mockAiParentSummary: AiParentSummary = {
  studentId: "1",
  studentName: "Tristan Firdaus",
  period: "13–19 Januari 2025",
  generatedAt: new Date("2025-01-19T08:00:00Z").toISOString(),
  highlights: [
    "Tristan mempertahankan streak belajar selama 7 hari berturut-turut.",
    "Penguasaan statistik meningkat 10% setelah sesi latihan Jumat lalu.",
  ],
  focusAreas: [
    "Butuh penguatan materi persamaan dua langkah (masih 65%).",
    "Disarankan tidur lebih awal agar sesi pagi lebih fokus.",
  ],
  recommendedActions: [
    "Dampingi Tristan mengerjakan latihan aljabar 15 menit sebelum tidur.",
    "Apresiasi konsistensi Tristan dengan reward kecil di akhir pekan.",
  ],
  signature: "Assistant AI Portal Adaptif",
};
