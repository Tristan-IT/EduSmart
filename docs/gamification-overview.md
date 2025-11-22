# Gamified Learning Flow

Dokumen ini merangkum bagaimana fitur gamifikasi bertipe Duolingo diterapkan pada portal adaptif, mulai dari struktur data, endpoint mock, hingga event telemetry yang bisa dipakai tim produk & backend untuk integrasi lanjutan.

## 1. Arsitektur Tingkat Tinggi

```
Student UI ──┐
             │   ┌────────────┐        ┌─────────────────┐
Learning.tsx ├──▶│ mockApi.ts │──GET──▶│ Skill Tree State │
             │   │            │        └─────────────────┘
             │   │            │
StudentDashboard ─┘            │
                              │
TeacherDashboard ──────────────┘
                              │
                              └──POST──▶ Lesson Completion + Telemetry
```

- `src/data/gamifiedLessons.ts` menyimpan blueprint unit → skill → lesson beserta status, reward, dan helper perhitungan progres.
- `src/lib/mockApi.ts` menjadi gateway state in-memory: skill tree, profil gamifikasi siswa, serta event telemetry.
- `Learning.tsx` menampilkan Skill Tree interaktif, daily goal, dan power-up. `StudentDashboard.tsx` & `TeacherDashboard.tsx` mengonsumsi state yang sama untuk menampilkan ringkasan progres.

## 2. Struktur Data Utama

### Skill Tree
- `SkillTreeUnit`: unit pembelajaran dengan status (`upcoming`, `current`, `completed`) serta hadiah (`badge`/`chest`).
- `SkillNode`: node skill dalam unit, menyimpan `mastery` (%) dan daftar lesson.
- `LessonChallenge`: lesson individual dengan `status` (`locked`, `available`, `in-progress`, `mastered`), durasi, XP reward, dan prasyarat.
- Helper:
  - `cloneSkillTree` memastikan state tidak termutasi saat dikirim ke UI.
  - `calculateUnitProgress` & `calculateTreeProgress` menghitung agregasi progres.

### Profil Gamifikasi
`GamifiedProfile` menampung:
- `xp`, `level`, `xpInLevel`, `xpForNextLevel`.
- `streak`, `bestStreak`, `dailyGoalXP`, `dailyGoalProgress`, flag `dailyGoalMet` & `dailyGoalClaimed`.
- `league`, daftar `boosts`, serta reference lesson terakhir.

## 3. Endpoint Mock

| Endpoint | Method | Deskripsi | Respons Singkat |
| --- | --- | --- | --- |
| `/skill-tree` | GET | Mengambil snapshot skill tree (deep copy) | `SkillTreeUnit[]` |
| `/gamified-profile` | GET | Mengambil profil gamifikasi aktif | `GamifiedProfile` |
| `/lessons/complete` | POST | Memperbarui status lesson → mastered, mendistribusi XP/streak, unlock konten lanjutan | `{ status, xpEarned, streakIncrement, profile, skillTree }` |
| `/streak/claim` | POST | Klaim bonus XP untuk daily goal | `{ status, xpBonus, profile }` |
| `/telemetry` | GET | Mendapatkan event teranyar | `TelemetryEvent[]` |

Catatan implementasi:
- `completeLesson` menangani unlock lesson berikutnya, membuka skill/unit baru, serta klaim reward unit jika syarat terpenuhi.
- `claimStreakReward` melakukan validasi `dailyGoalMet` & `dailyGoalClaimed` sebelum memberi bonus XP dan menambah streak.

## 4. Telemetry & Analytics

`src/data/telemetry.ts` mendefinisikan tipe event berikut:

| Kode | Makna | Metadata Utama |
| --- | --- | --- |
| `lesson_completed` | Lesson selesai dan memberi XP | `lessonId`, `skillId`, `unitId`, `xpEarned`, `streakIncrement` |
| `lesson_unlocked` | Lesson baru tersedia | `lessonId`, `skillId`, `unitId` |
| `skill_unlocked` | Skill baru terbuka | `skillId`, `unitId` |
| `unit_progressed` | Unit selesai atau berganti status | `unitId`, opsional `status` |
| `reward_claimed` | Hadiah unit diclaim | `rewardType`, `rewardLabel`, `xpBonus`, `unitId` |
| `daily_goal_claimed` | Bonus harian diambil | `streak`, `xpBonus` |

Event terbaru dihydrate oleh `TeacherDashboard` untuk kartu “Insight Aktivitas”. Logger (`logTelemetryEvent`) membatasi buffer ke 100 entri terbaru untuk menjaga performa.

## 5. Alur Pengguna Utama

### Siswa
1. Buka `Learning.tsx` → fetch skill tree & profile.
2. Pilih lesson → klik “Mulai Lesson”.
3. `completeLesson` → UI update XP, streak, daily goal, dan tree.
4. Setelah daily goal terpenuhi → tombol “Klaim Bonus Daily” aktif.
5. Bonus diklaim → profil & telemetry tercatat, teacher view ikut ter-update.

### Guru
1. `TeacherDashboard.tsx` memuat skill tree + event telemetry.
2. Kartu “Gamifikasi Siswa” menunjukkan ringkasan XP/streak per siswa (dari `mockStudents`).
3. Kartu “Insight Aktivitas” membantu identifikasi siswa yang aktif atau baru membuka skill/claim reward → memudahkan instruksi lanjutan.

## 6. Integrasi Backend Mendatang

- Endpoint mock bisa diganti menjadi call sebenarnya dengan memetakan payload/response yang sama.
- Telemetry dapat diteruskan ke pipeline analytics (misal, Segment, Mixpanel) menggunakan tipe event yang sudah distandarisasi.
- `GamifiedProfile` siap diperluas dengan progress multi-device atau social features (leaderboard sudah tersedia di `src/data/gamificationData.ts`).

## 7. Checklist QA & Aksesibilitas

- Pastikan navigasi keyboard pada `SkillTree` dapat fokus ke setiap tombol lesson.
- Periksa kontras badge (status lesson, reward) terhadap background sesuai WCAG.
- Verifikasi responsive layout di breakpoint mobile < 640px dan desktop > 1280px.
- Uji scenario idempotent: menjalankan `completeLesson` pada lesson yang sudah mastered tidak menambah XP lagi.

---
Dokumen ini dapat dilampirkan pada README utama atau digunakan sebagai lampiran untuk tim backend/design yang membutuhkan reference teknis gamifikasi.
