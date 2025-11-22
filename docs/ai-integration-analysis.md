# AI Integration Analysis

Dokumen ini merangkum kebutuhan dunia nyata yang dapat dibantu oleh integrasi AI pada portal pembelajaran adaptif, sekaligus menyoroti solusi yang diusulkan, data yang perlu dimock, serta implikasi desain UI/UX.

## 1. Tantangan Dunia Nyata & Peluang AI

| Tantangan | Deskripsi Singkat | Peluang AI |
| --- | --- | --- |
| Intervensi Guru Terlambat | Guru sulit memantau semua siswa secara real-time, sehingga intervensi sering terlambat. | Model rekomendasi menghasilkan prioritas siswa & saran aksi berbasis risk level dan historikal performa. |
| Rekomendasi Materi Kurang Personal | Siswa sering bingung memilih materi lanjutan yang sesuai. | Sistem rekomendasi konten adaptif yang menilai mastery, preferensi belajar, dan ketersediaan waktu. |
| Feedback Quiz Lambat | Evaluasi manual memakan waktu sehingga umpan balik tidak instan. | AI menilai jawaban open-ended, memberi feedback dan hints personal secara otomatis. |
| Motivasi & Gamifikasi Stagnan | Penghargaan generik membuat keterlibatan turun. | AI mengubah reward/quest harian berdasarkan pola engagement dan target yang ingin dicapai siswa. |
| Komunikasi Orang Tua Terbatas | Orang tua sulit memahami progres anak secara kontekstual. | AI merangkum progres, highlight risiko, dan menyiapkan pesan siap kirim untuk orang tua. |
| Kebutuhan Aksesibilitas | Siswa berkebutuhan khusus memerlukan pendekatan personal. | AI merekomendasikan mode belajar alternatif (audio, teks ringkas) berdasarkan kebutuhan khusus. |

## 2. Solusi AI & Kebutuhan Data (Mock)

| Solusi AI | Input Data yang Diperlukan (Mock) | Output yang Ditampilkan |
| --- | --- | --- |
| "Mentor AI" untuk Siswa | Riwayat quiz, tipe kesalahan, preferensi belajar | Chat assistive dengan penjelasan, hint, rencana belajar singkat |
| Rekomendasi Konten Adaptif | Mastery per topik, waktu belajar, engagement streak | Daftar materi prioritas (video/quiz) per sesi belajar |
| Prediksi Risiko & Intervensi | Aktivitas harian, histori absensi, log intervensi | Ranking prioritas siswa + rekomendasi tindakan guru |
| Auto Feedback Jawaban | Jawaban teks siswa, rubrik penilaian | Nilai otomatis, alasan penilaian, saran remedial |
| Ringkasan Progres untuk Orang Tua | Mastery topik, streak, intervensi terkini | Laporan naratif singkat siap kirim + CTA tindak lanjut |
| Penyesuaian Reward | XP gain, preferensi reward, target pribadi | Quest harian personal, power-up rekomendasi |

> **Catatan:** Seluruh input sementara disuplai melalui mock API baru (mis. `mockAiRecommendations`, `mockAiInsights`) sampai integrasi model aktual siap.

## 3. Touchpoint Desain UI/UX

1. **AI Mentor Chat Panel** – dialog bubble dengan persona guru virtual, tersedia di halaman quiz & learning.
2. **Adaptive Recommendation Drawer** – daftar materi & aktivitas yang dirangkum AI di dashboard siswa.
3. **Teacher Insight Hub** – modul yang menampilkan prioritas intervensi + rekomendasi pesan otomatis.
4. **Parent Summary Modal** – ringkasan progres yang bisa diunduh/kirim otomatis.
5. **Reward Personalization Widget** – kartu quest harian yang dinamis berdasarkan output AI.
6. **Aksesibilitas Cerdas** – toggle rekomendasi mode belajar (text-to-speech, ringkas) di player konten.

## 4. Risiko & Pertimbangan

- **Kualitas Data**: Mock dataset harus mencerminkan variasi performa (tinggi, sedang, rendah) agar alur UI realistis.
- **Explainability**: Setiap rekomendasi AI perlu alasan singkat (mis. "Direkomendasikan karena mastery aljabar turun 10% minggu ini").
- **Kontrol Manual Guru**: Guru harus bisa menerima/menolak rekomendasi AI sebelum dikirim ke siswa atau orang tua.
- **Keamanan & Privasi**: Saat implementasi model nyata, data pribadi siswa harus dienkripsi dan mematuhi regulasi (mis. GDPR, PdP). Mock API perlu mensimulasikan anonymization token.

## 5. Langkah Lanjut

- Desain UI/UX untuk setiap touchpoint dengan asumsi data berasal dari mock API.
- Definisikan skema mock API (request/response) agar mudah diganti dengan integrasi AI aktual.
- Libatkan QA & tim desain untuk validasi pengalaman pengguna sebelum model AI sebenarnya ditanam.

Dokumen ini menjadi acuan awal sebelum implementasi backend/ML dimulai.
