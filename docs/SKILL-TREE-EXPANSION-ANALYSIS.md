# Analisis Ekspansi Skill Tree System - Semua Subject & Tingkatan Kelas

## Executive Summary

Saat ini sistem skill tree yang mirip Duolingo **hanya tersedia untuk Matematika**. Diperlukan ekspansi ke **SEMUA subject** dan **SEMUA tingkatan kelas** yang lebih detail.

### Gap Analysis

**Status Saat Ini:**
- ✅ Frontend: `src/data/skillTree.ts` - 15 nodes untuk Matematika saja
- ✅ Backend: `server/src/data/skillTrees.ts` - 31 nodes untuk beberapa subject
- ⚠️ **MASALAH:** Tidak ada detail per tingkat kelas (kelas 1, 2, 3, dst)
- ⚠️ **MASALAH:** Tidak semua subject punya skill tree lengkap

**Target:**
- 🎯 Semua subject: Matematika, Fisika, Kimia, Biologi, Bahasa Indonesia, Bahasa Inggris, Sejarah, Geografi, Ekonomi, Sosiologi, PKn
- 🎯 Semua tingkatan: SD (kelas 1-6), SMP (kelas 7-9), SMA (kelas 10-12), SMK (kelas 10-12)
- 🎯 Total estimasi: **~500-800 skill tree nodes**

---

## 📊 Struktur Tingkatan Kelas Indonesia

### SD (Sekolah Dasar) - 6 Tingkat
- **Kelas 1 SD** (Usia 6-7 tahun)
- **Kelas 2 SD** (Usia 7-8 tahun)
- **Kelas 3 SD** (Usia 8-9 tahun)
- **Kelas 4 SD** (Usia 9-10 tahun)
- **Kelas 5 SD** (Usia 10-11 tahun)
- **Kelas 6 SD** (Usia 11-12 tahun)

**Subject di SD:**
1. Matematika (Kelas 1-6)
2. IPA/Sains (Kelas 4-6)
3. IPS (Kelas 4-6)
4. Bahasa Indonesia (Kelas 1-6)
5. PKn/Pendidikan Pancasila (Kelas 1-6)
6. Bahasa Inggris (Kelas 4-6, optional)

### SMP (Sekolah Menengah Pertama) - 3 Tingkat
- **Kelas 7** (Usia 12-13 tahun)
- **Kelas 8** (Usia 13-14 tahun)
- **Kelas 9** (Usia 14-15 tahun)

**Subject di SMP:**
1. Matematika (Kelas 7-9)
2. IPA Terpadu (Kelas 7-9) - meliputi Fisika, Kimia, Biologi
3. IPS Terpadu (Kelas 7-9) - meliputi Sejarah, Geografi, Ekonomi
4. Bahasa Indonesia (Kelas 7-9)
5. Bahasa Inggris (Kelas 7-9)
6. PKn (Kelas 7-9)

### SMA (Sekolah Menengah Atas) - 3 Tingkat
- **Kelas 10 SMA** (Usia 15-16 tahun) - Umum
- **Kelas 11 SMA** (Usia 16-17 tahun) - Penjurusan: IPA, IPS, Bahasa
- **Kelas 12 SMA** (Usia 17-18 tahun) - Fokus UTBK/Ujian Masuk PTN

**Subject di SMA:**
1. Matematika (Umum: Kelas 10, Peminatan IPA/IPS: Kelas 11-12)
2. Fisika (Kelas 10-12, Peminatan IPA)
3. Kimia (Kelas 10-12, Peminatan IPA)
4. Biologi (Kelas 10-12, Peminatan IPA)
5. Bahasa Indonesia (Kelas 10-12)
6. Bahasa Inggris (Kelas 10-12)
7. Sejarah (Kelas 10-12, Peminatan IPS)
8. Geografi (Kelas 10-12, Peminatan IPS)
9. Ekonomi (Kelas 10-12, Peminatan IPS)
10. Sosiologi (Kelas 10-12, Peminatan IPS)

### SMK (Sekolah Menengah Kejuruan) - 3 Tingkat
- **Kelas 10 SMK** (Usia 15-16 tahun) - Dasar kejuruan
- **Kelas 11 SMK** (Usia 16-17 tahun) - Kompetensi keahlian
- **Kelas 12 SMK** (Usia 17-18 tahun) - Magang/PKL + persiapan kerja

**Subject di SMK:**
1. Matematika (Kelas 10-12, disesuaikan jurusan)
2. Bahasa Indonesia (Kelas 10-12)
3. Bahasa Inggris (Kelas 10-12)
4. **Subject Kejuruan** (tergantung jurusan: TKJ, RPL, Akuntansi, Multimedia, dll)

---

## 🎮 Existing Skill Tree System

### File yang Sudah Ada

#### 1. Frontend: `src/data/skillTree.ts`
**Karakteristik:**
- ✅ 15 nodes untuk Matematika
- ✅ Duolingo-style vertical path
- ✅ Status: locked, current, in-progress, completed
- ✅ Stars system (0-3)
- ✅ Prerequisites chain
- ✅ XP rewards (50-100 XP)
- ✅ Checkpoint nodes
- ⚠️ **HANYA MATEMATIKA**
- ⚠️ **TIDAK ADA DETAIL TINGKAT KELAS**

**Struktur Node:**
```typescript
{
  id: 'node-1',
  moduleId: 'alg-linear-eq',
  title: 'Persamaan Linear',
  categoryId: 'algebra',
  categoryName: 'Aljabar',
  description: 'Dasar persamaan linear',
  position: { x: 50, y: 0 },
  status: 'current',
  stars: 0,
  xpReward: 50,
  prerequisites: [],
  isCheckpoint: false,
  difficulty: 'Mudah',
  estimatedDuration: '45 menit'
}
```

**Coverage:**
- Node 1-3: Aljabar (Linear, Kuadrat, Sistem)
- Node 4-6: Geometri (Segitiga, Lingkaran, Volume)
- Node 7-9: Kalkulus (Limit, Turunan, Integral)
- Node 10-12: Trigonometri
- Node 13-15: Statistika & Peluang

#### 2. Backend: `server/src/data/skillTrees.ts`
**Karakteristik:**
- ✅ 31 nodes total
- ✅ Multiple subjects: Math, Physics, Chemistry, Biology
- ✅ Multiple grade levels: SMA, SMP, SD
- ✅ XP scaling: SD (50-70), SMP (80-110), SMA (100-200)
- ✅ Graph layout positions
- ✅ Badges and rewards
- ⚠️ **TIDAK SEMUA SUBJECT LENGKAP**
- ⚠️ **TIDAK ADA DETAIL PER KELAS**

**Coverage Saat Ini:**
- ✅ Matematika SMA: 7 nodes
- ✅ Fisika SMA: 3 nodes
- ✅ Kimia SMA: 2 nodes
- ✅ Biologi SMA: 3 nodes
- ✅ Matematika SMP: 4 nodes
- ✅ IPA SMP: 4 nodes
- ✅ Matematika SD: 4 nodes
- ✅ IPA SD: 4 nodes

**Missing Coverage:**
- ❌ Bahasa Indonesia (semua tingkat)
- ❌ Bahasa Inggris (semua tingkat)
- ❌ IPS/Sejarah/Geografi/Ekonomi/Sosiologi (SMA/SMP)
- ❌ PKn (SD/SMP/SMA)
- ❌ Detail per kelas (1-12)

---

## 📋 Estimasi Jumlah Skill Tree Nodes yang Dibutuhkan

### Metode Perhitungan
- **SD:** 5-8 nodes per subject per kelas = ~6-10 nodes total per subject
- **SMP:** 8-12 nodes per subject per kelas = ~10-15 nodes total per subject
- **SMA:** 10-15 nodes per subject per kelas = ~12-20 nodes total per subject

### SD (Kelas 1-6)

| Subject | Kelas 1 | Kelas 2 | Kelas 3 | Kelas 4 | Kelas 5 | Kelas 6 | Total |
|---------|---------|---------|---------|---------|---------|---------|-------|
| **Matematika** | 5 | 6 | 6 | 7 | 7 | 8 | **39** |
| **IPA** | - | - | - | 6 | 7 | 8 | **21** |
| **IPS** | - | - | - | 5 | 6 | 6 | **17** |
| **Bahasa Indonesia** | 4 | 5 | 5 | 6 | 6 | 7 | **33** |
| **PKn** | 3 | 3 | 4 | 4 | 5 | 5 | **24** |
| **Bahasa Inggris** | - | - | - | 4 | 5 | 5 | **14** |
| **TOTAL SD** | | | | | | | **148** |

### SMP (Kelas 7-9)

| Subject | Kelas 7 | Kelas 8 | Kelas 9 | Total |
|---------|---------|---------|---------|-------|
| **Matematika** | 10 | 12 | 12 | **34** |
| **IPA Terpadu** | 12 | 14 | 14 | **40** |
| **IPS Terpadu** | 8 | 10 | 10 | **28** |
| **Bahasa Indonesia** | 8 | 9 | 10 | **27** |
| **Bahasa Inggris** | 8 | 9 | 10 | **27** |
| **PKn** | 5 | 6 | 6 | **17** |
| **TOTAL SMP** | | | | **173** |

### SMA (Kelas 10-12)

| Subject | Kelas 10 | Kelas 11 | Kelas 12 | Total |
|---------|----------|----------|----------|-------|
| **Matematika Wajib** | 12 | - | - | **12** |
| **Matematika Peminatan** | - | 15 | 18 | **33** |
| **Fisika** | 10 | 14 | 16 | **40** |
| **Kimia** | 10 | 14 | 16 | **40** |
| **Biologi** | 10 | 14 | 16 | **40** |
| **Bahasa Indonesia** | 10 | 12 | 14 | **36** |
| **Bahasa Inggris** | 10 | 12 | 14 | **36** |
| **Sejarah** | 8 | 12 | 14 | **34** |
| **Geografi** | 8 | 12 | 14 | **34** |
| **Ekonomi** | 8 | 12 | 14 | **34** |
| **Sosiologi** | 8 | 12 | 14 | **34** |
| **TOTAL SMA** | | | | **373** |

### SMK (Simplified - Core Subjects Only)

| Subject | Kelas 10 | Kelas 11 | Kelas 12 | Total |
|---------|----------|----------|----------|-------|
| **Matematika** | 8 | 10 | 8 | **26** |
| **Bahasa Indonesia** | 6 | 8 | 6 | **20** |
| **Bahasa Inggris** | 6 | 8 | 6 | **20** |
| **TOTAL SMK** | | | | **66** |

### 🎯 GRAND TOTAL: **760 Skill Tree Nodes**

---

## 🏗️ Arsitektur Skill Tree per Tingkat Kelas

### Contoh: Matematika SD Kelas 1

**Progression Path (5 nodes):**

```
Node 1: Mengenal Angka 1-10
  ├─ Membaca angka
  ├─ Menulis angka
  └─ Mengurutkan angka
  XP: 30, Difficulty: Mudah, 20 menit

Node 2: Penjumlahan Dasar (1-10)
  ├─ Penjumlahan dengan benda
  ├─ Penjumlahan dengan gambar
  └─ Penjumlahan angka
  Prerequisites: [Node 1]
  XP: 40, Difficulty: Mudah, 25 menit

Node 3: Pengurangan Dasar (1-10)
  ├─ Pengurangan dengan benda
  ├─ Pengurangan dengan gambar
  └─ Pengurangan angka
  Prerequisites: [Node 2]
  XP: 40, Difficulty: Mudah, 25 menit

Node 4: Mengenal Bangun Datar
  ├─ Segitiga, persegi, lingkaran
  ├─ Menghitung sisi
  └─ Mengelompokkan bentuk
  Prerequisites: [Node 1]
  XP: 35, Difficulty: Mudah, 20 menit

Node 5: Pengukuran Sederhana
  ├─ Panjang (pendek, sedang, panjang)
  ├─ Berat (ringan, berat)
  └─ Isi (sedikit, banyak)
  Prerequisites: [Node 2, Node 4]
  XP: 45, Difficulty: Sedang, 30 menit
  Checkpoint: true
```

### Contoh: Matematika SMP Kelas 7

**Progression Path (10 nodes):**

```
1. Bilangan Bulat → 2. Pecahan → 3. Desimal
                                    ↓
4. Aljabar Dasar → 5. Persamaan Linear
                                    ↓
6. Geometri Dasar → 7. Sudut → 8. Segitiga
                                    ↓
9. Statistika Dasar → 10. Penyajian Data (Checkpoint)
```

### Contoh: Fisika SMA Kelas 10

**Progression Path (10 nodes):**

```
1. Besaran & Satuan → 2. Vektor
                         ↓
3. Gerak Lurus → 4. Gerak Parabola → 5. Gerak Melingkar
                                           ↓
6. Hukum Newton I-III → 7. Gaya Gesek → 8. Usaha & Energi
                                           ↓
9. Momentum & Impuls → 10. Hukum Kekekalan (Checkpoint)
```

---

## 🗂️ Struktur Data yang Dibutuhkan

### Enhanced SkillTreeNode Interface

```typescript
export interface EnhancedSkillTreeNode {
  // Basic Info
  id: string;                          // "mtk-sd-1-node-1"
  title: string;                       // "Mengenal Angka 1-10"
  description: string;
  
  // Classification
  subject: string;                     // "Matematika"
  subjectCode: string;                 // "MTK"
  gradeLevel: 'SD' | 'SMP' | 'SMA' | 'SMK';
  classNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  semester: 1 | 2;                     // Semester 1 atau 2
  
  // Curriculum Mapping
  topicCode: string;                   // "SD-MTK-1-ANGKA-01"
  curriculum: string;                  // "Kurikulum Merdeka" | "K13"
  kompetensiDasar?: string;           // KD reference
  
  // Learning Content
  category: string;                    // "Bilangan", "Geometri", etc.
  subcategory?: string;               // More specific
  learningObjectives: string[];
  
  // Progression
  position: { x: number; y: number };
  level: number;                       // 1-10 within the class
  prerequisites: string[];             // Node IDs
  unlocks: string[];                   // What this node unlocks
  isCheckpoint: boolean;
  isMandatory: boolean;                // Required vs optional
  
  // Difficulty & Rewards
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  xpRequired: number;                  // XP needed to unlock
  rewards: {
    xp: number;
    gems: number;
    hearts?: number;
    badge?: string;
    certificate?: string;              // For checkpoints
  };
  
  // Content
  quizCount: number;
  exerciseCount: number;
  videoCount?: number;
  estimatedMinutes: number;
  
  // Progress Tracking
  status?: 'locked' | 'available' | 'in-progress' | 'completed';
  stars?: number;                      // 0-3
  completionRate?: number;             // 0-100%
  lastAttempt?: Date;
  bestScore?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  version: string;                     // For curriculum updates
}
```

### Skill Tree Path Definition

```typescript
export interface SkillTreePath {
  pathId: string;
  subject: string;
  gradeLevel: string;
  classNumber: number;
  semester: number;
  
  nodes: EnhancedSkillTreeNode[];
  totalXP: number;
  totalEstimatedHours: number;
  checkpointCount: number;
  
  // Path metadata
  name: string;                        // "Matematika Kelas 1 SD Semester 1"
  description: string;
  thumbnail?: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  
  // Learning outcomes
  learningOutcomes: string[];
  assessmentCriteria: string[];
}
```

---

## 🎯 Implementation Strategy

### Phase 1: Database Schema & Models (2-3 hari)
✅ **Task 43:** Upgrade SkillTreeNode Model
- Add classNumber, semester, curriculum fields
- Add kompetensiDasar mapping
- Add enhanced rewards structure
- Migration script for existing data

✅ **Task 44:** Create SkillTreePath Model
- Group nodes by class/semester
- Track path completion
- Calculate progress metrics

### Phase 2: Data Creation - SD (1-2 minggu)
✅ **Task 45:** SD Kelas 1-3 Skill Trees
- Matematika: 17 nodes (5+6+6)
- Bahasa Indonesia: 14 nodes (4+5+5)
- PKn: 10 nodes (3+3+4)
- **Total: 41 nodes**

✅ **Task 46:** SD Kelas 4-6 Skill Trees
- Matematika: 22 nodes (7+7+8)
- IPA: 21 nodes (6+7+8)
- IPS: 17 nodes (5+6+6)
- Bahasa Indonesia: 19 nodes (6+6+7)
- PKn: 14 nodes (4+5+5)
- Bahasa Inggris: 14 nodes (4+5+5)
- **Total: 107 nodes**

### Phase 3: Data Creation - SMP (1-2 minggu)
✅ **Task 47:** SMP Kelas 7-9 - Core Subjects
- Matematika: 34 nodes (10+12+12)
- IPA Terpadu: 40 nodes (12+14+14)
- IPS Terpadu: 28 nodes (8+10+10)
- **Total: 102 nodes**

✅ **Task 48:** SMP Kelas 7-9 - Languages & Civics
- Bahasa Indonesia: 27 nodes (8+9+10)
- Bahasa Inggris: 27 nodes (8+9+10)
- PKn: 17 nodes (5+6+6)
- **Total: 71 nodes**

### Phase 4: Data Creation - SMA (2-3 minggu)
✅ **Task 49:** SMA Kelas 10 - All Subjects (Umum)
- Matematika Wajib: 12 nodes
- Fisika: 10 nodes
- Kimia: 10 nodes
- Biologi: 10 nodes
- Bahasa Indonesia: 10 nodes
- Bahasa Inggris: 10 nodes
- Sejarah: 8 nodes
- Geografi: 8 nodes
- Ekonomi: 8 nodes
- Sosiologi: 8 nodes
- **Total: 94 nodes**

✅ **Task 50:** SMA Kelas 11-12 - IPA Stream
- Matematika Peminatan: 33 nodes (15+18)
- Fisika: 30 nodes (14+16)
- Kimia: 30 nodes (14+16)
- Biologi: 30 nodes (14+16)
- Bahasa Indonesia: 26 nodes (12+14)
- Bahasa Inggris: 26 nodes (12+14)
- **Total: 175 nodes**

✅ **Task 51:** SMA Kelas 11-12 - IPS Stream
- Matematika Peminatan: 33 nodes (15+18)
- Sejarah: 26 nodes (12+14)
- Geografi: 26 nodes (12+14)
- Ekonomi: 26 nodes (12+14)
- Sosiologi: 26 nodes (12+14)
- Bahasa Indonesia: 26 nodes (12+14)
- Bahasa Inggris: 26 nodes (12+14)
- **Total: 189 nodes**

### Phase 5: SMK Support (Optional, 1 minggu)
✅ **Task 52:** SMK Core Subjects (All Classes)
- Matematika: 26 nodes
- Bahasa Indonesia: 20 nodes
- Bahasa Inggris: 20 nodes
- **Total: 66 nodes**

### Phase 6: UI/UX Enhancement (1-2 minggu)
✅ **Task 53:** Skill Tree Visualization Component
- Multi-path layout for complex trees
- Class/semester filtering
- Subject switching
- Progress tracking animation
- Mobile-responsive design

✅ **Task 54:** Learning Path Dashboard
- Overview of all paths
- Current position in each subject
- Next recommended nodes
- Completion statistics
- Achievement showcase

✅ **Task 55:** Class Selection & Navigation
- Grade level selector
- Class number selector (1-12)
- Subject filter
- Search functionality
- Bookmark favorite paths

### Phase 7: Integration & Testing (1 minggu)
✅ **Task 56:** Backend API Endpoints
- GET /skill-trees/:subject/:grade/:class
- GET /skill-trees/user/progress
- POST /skill-trees/complete-node
- GET /skill-trees/recommended
- GET /skill-trees/class/:classNumber/all

✅ **Task 57:** Progress Tracking Service
- Auto-unlock next nodes
- XP calculation
- Stars/achievement logic
- Checkpoint validation
- Certificate generation

✅ **Task 58:** Testing & QA
- Unit tests for all skill tree logic
- Integration tests for progress tracking
- E2E tests for learning paths
- Performance testing (800 nodes)
- Data validation

### Phase 8: Content Refinement (Ongoing)
✅ **Task 59:** Curriculum Alignment
- Map to Kurikulum Merdeka
- Map to K13 (legacy)
- KD (Kompetensi Dasar) references
- Validation by education experts

✅ **Task 60:** Adaptive Learning Integration
- Difficulty adjustment based on performance
- Personalized node recommendations
- Skip functionality for advanced students
- Remedial paths for struggling students

---

## 📈 Success Metrics

### Content Coverage
- ✅ 100% coverage untuk kelas 1-12
- ✅ Semua subject utama terwakili
- ✅ Rata-rata 10-15 nodes per kelas per subject
- ✅ Minimum 760 nodes total

### User Engagement
- 🎯 80%+ students complete at least 1 path per semester
- 🎯 Average 3+ nodes completed per week
- 🎯 60%+ students reach checkpoints
- 🎯 90%+ satisfaction rate with skill tree UX

### Learning Outcomes
- 🎯 Correlation between skill tree completion and exam scores
- 🎯 Improved retention rates
- 🎯 Better understanding of learning progression
- 🎯 Increased self-directed learning

---

## 🚨 Critical Considerations

### 1. Data Maintenance
- **Challenge:** 760 nodes perlu di-update sesuai perubahan kurikulum
- **Solution:** Version control system, automated curriculum mapping tools

### 2. Performance
- **Challenge:** Loading 800 nodes dapat lambat
- **Solution:** Lazy loading, pagination, caching, indexed database queries

### 3. User Experience
- **Challenge:** Terlalu banyak pilihan bisa overwhelming
- **Solution:** Smart filtering, recommended paths, guided onboarding

### 4. Content Quality
- **Challenge:** Memastikan semua nodes punya konten yang berkualitas
- **Solution:** Content review process, teacher feedback loop, AI content generation

### 5. Mobile Optimization
- **Challenge:** Complex skill tree susah di-navigate di mobile
- **Solution:** Simplified mobile view, swipe navigation, progressive disclosure

---

## 📅 Timeline Estimate

| Phase | Duration | Dependencies | Output |
|-------|----------|--------------|--------|
| **Phase 1: Database** | 2-3 hari | None | New models, migrations |
| **Phase 2: SD Trees** | 1-2 minggu | Phase 1 | 148 nodes |
| **Phase 3: SMP Trees** | 1-2 minggu | Phase 1 | 173 nodes |
| **Phase 4: SMA Trees** | 2-3 minggu | Phase 1 | 373 nodes |
| **Phase 5: SMK Trees** | 1 minggu | Phase 1 | 66 nodes |
| **Phase 6: UI/UX** | 1-2 minggu | Phase 2-5 | Components |
| **Phase 7: Integration** | 1 minggu | Phase 6 | APIs, tests |
| **Phase 8: Refinement** | Ongoing | Phase 7 | Quality content |

**Total Estimated Time:** 7-11 minggu (2-3 bulan)

---

## 🎯 Prioritas Implementasi

### HIGH Priority (Must Have)
1. ✅ Task 43: Upgrade SkillTreeNode Model
2. ✅ Task 45: SD Kelas 1-3 Skill Trees
3. ✅ Task 47: SMP Kelas 7-9 Core Subjects
4. ✅ Task 49: SMA Kelas 10 All Subjects
5. ✅ Task 53: Skill Tree Visualization Component
6. ✅ Task 56: Backend API Endpoints

### MEDIUM Priority (Should Have)
7. ✅ Task 46: SD Kelas 4-6 Skill Trees
8. ✅ Task 48: SMP Languages & Civics
9. ✅ Task 50: SMA Kelas 11-12 IPA Stream
10. ✅ Task 54: Learning Path Dashboard
11. ✅ Task 57: Progress Tracking Service

### LOW Priority (Nice to Have)
12. ✅ Task 51: SMA Kelas 11-12 IPS Stream
13. ✅ Task 52: SMK Core Subjects
14. ✅ Task 55: Advanced Navigation
15. ✅ Task 58: Comprehensive Testing
16. ✅ Task 59: Curriculum Alignment
17. ✅ Task 60: Adaptive Learning

---

## 💡 Rekomendasi

### Quick Wins (1-2 minggu)
1. **Upgrade Model** - Add class number support to existing skill trees
2. **SD Kelas 1** - Create first complete class path (5 subjects, ~20 nodes)
3. **Basic UI** - Simple class/subject filter on existing skill tree page

### MVP Scope (1 bulan)
1. All SD nodes (148 total)
2. SMP Matematika & IPA (74 nodes)
3. SMA Kelas 10 core subjects (94 nodes)
4. Enhanced visualization component
5. Basic progress tracking

### Full Implementation (2-3 bulan)
- All 760 nodes across all grades
- Complete UI/UX overhaul
- Advanced features (adaptive learning, certificates)
- Full curriculum mapping
- Comprehensive testing

---

**Created:** 2025-11-21  
**Status:** 📋 Analysis Complete - Ready for Implementation  
**Next Action:** Add tasks to todo list and begin Phase 1
