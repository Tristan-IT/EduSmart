export const CTA_COPY_VARIANTS = {
  startPractice: [
    "Mulai latihan 10 menit",
    "Ayo berlatih sebentar",
    "Latihan cepat sekarang",
    "Mulai sesi singkat",
    "Aktifkan mode latihan",
  ],
  viewRecommendations: [
    "Lihat rekomendasi saya",
    "Tampilkan saran pembelajaran",
    "Lihat jalanku hari ini",
    "Tunjukkan rencana personal",
    "Buka rekomendasi terbaru",
  ],
  sendIntervention: [
    "Kirim intervensi",
    "Mulai tindak lanjut",
    "Kirim aksi dukungan",
    "Catat intervensi",
    "Beri dukungan sekarang",
  ],
  exportReport: [
    "Ekspor laporan",
    "Download laporan",
    "Ambil laporan PDF",
    "Unduh ringkasan",
    "Ekspor data pembelajaran",
  ],
  startInitialAssessment: [
    "Mulai tes awal",
    "Mulai asesmen perdana",
    "Jalankan diagnosis awal",
    "Mulai pemetaan kemampuan",
    "Tes diagnostik pertama",
  ],
} as const;

export type CtaKey = keyof typeof CTA_COPY_VARIANTS;
