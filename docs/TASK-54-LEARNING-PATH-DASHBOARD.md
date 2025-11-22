# Task 54: Learning Path Dashboard

**Status**: ✅ COMPLETE  
**Tanggal**: November 21, 2025  
**Dependencies**: Task 44 (SkillTreePath Model & API)

---

## 📋 Overview

Student dashboard untuk menampilkan jalur pembelajaran (learning paths) yang tersedia berdasarkan kelas dan profil mereka. Dashboard ini mengintegrasikan dengan SkillTreePath API untuk menampilkan progress, statistik, dan rekomendasi jalur pembelajaran.

---

## 🎯 Fitur Utama

### 1. **Dashboard Layout**
- **Stats Overview**: 4 kartu statistik
  - Total Jalur tersedia
  - Jalur Selesai (completed)
  - Jalur Sedang Belajar (in-progress)
  - Total XP earned dari semua jalur
  
- **Filter & Search**
  - Search bar (cari berdasarkan nama/deskripsi)
  - Filter Mata Pelajaran
  - Filter Kesulitan (Mudah/Sedang/Sulit/Campuran)
  - Filter Status (Belum Dimulai/Sedang Belajar/Selesai)

- **Tabs Navigation**
  - Semua: Semua jalur yang tersedia
  - Rekomendasi: Jalur yang belum dimulai
  - Aktif: Jalur yang sedang dikerjakan
  - Selesai: Jalur yang sudah diselesaikan

### 2. **Path Card Components**
Setiap kartu jalur pembelajaran menampilkan:

```typescript
// Visual Elements
- Subject icon & color scheme
- Difficulty badge (Mudah/Sedang/Sulit/Campuran)
- Status badge (Belum Dimulai/Sedang Belajar/Selesai)

// Content
- Path name (e.g., "Matematika - Kelas 7 Semester 1")
- Description (ringkasan materi)
- Tags (gradeLevel, class, semester, subject)

// Progress Indicators (if started)
- Progress bar (X/Y nodes completed - Z%)
- XP earned / total XP available
- Stars collected / max possible (3 per node)
- Star percentage

// Statistics
- Total XP available
- Total quizzes count
- Estimated hours
- Checkpoint count

// Action Button
- "Mulai Belajar" (not-started) → Navigate to skill tree
- "Lanjutkan" (in-progress) → Navigate to skill tree
- "Lihat Detail" (completed) → Navigate to skill tree
```

### 3. **User Profile Integration**
Dashboard auto-filter berdasarkan user profile:
```typescript
interface UserProfile {
  gradeLevel: "SD" | "SMP" | "SMA" | "SMK";
  classNumber: 1-12;
  semester: 1-2;
  major?: string; // untuk SMK
}

// API request automatically filters
GET /api/paths?gradeLevel=SMP&classNumber=7&semester=1
```

### 4. **Progress Tracking**
Untuk setiap path, fetch progress:
```typescript
GET /api/paths/{pathId}/progress/{userId}

Response:
{
  pathId: string;
  completedNodes: number;      // Nodes dengan progress 100%
  inProgressNodes: number;     // Nodes dengan progress > 0 < 100%
  lockedNodes: number;         // Nodes yang belum dibuka
  progressPercentage: number;  // (completed / total) * 100
  totalXPEarned: number;       // Sum of progress.xpEarned
  totalXPAvailable: number;    // Sum of node.xpReward
  totalStars: number;          // Sum of progress.stars
  maxPossibleStars: number;    // totalNodes * 3
  starPercentage: number;      // (totalStars / max) * 100
}
```

---

## 🗂️ File Structure

### **New Files Created**

1. **src/pages/LearningPathDashboard.tsx** (~500 lines)
   - Main dashboard component
   - State management for paths, progress, filters
   - API integration
   - Tab navigation
   - Responsive grid layout

Components dalam file:
```typescript
// Main Component
export default function LearningPathDashboard()

// Sub-components
function PathGrid({
  paths,
  pathProgress,
  onStartPath,
  getDifficultyColor,
  getStatusBadge,
  getPathStatus
})
```

### **Modified Files**

2. **src/App.tsx**
   - Added import: `import LearningPathDashboard from "./pages/LearningPathDashboard"`
   - Added route:
     ```tsx
     <Route 
       path="/learning-paths" 
       element={
         <ProtectedRoute allowRoles={["student"]}>
           <LearningPathDashboard />
         </ProtectedRoute>
       } 
     />
     ```

3. **src/components/AppSidebar.tsx**
   - Added icon import: `Route`
   - Added menu item untuk student:
     ```tsx
     { 
       title: "Jalur Pembelajaran", 
       url: "/learning-paths", 
       icon: Route 
     }
     ```

---

## 🎨 UI/UX Features

### **Color Coding**

1. **Difficulty Badges**
   ```typescript
   Mudah    → Green  (bg-green-100 text-green-800)
   Sedang   → Yellow (bg-yellow-100 text-yellow-800)
   Sulit    → Red    (bg-red-100 text-red-800)
   Campuran → Purple (bg-purple-100 text-purple-800)
   ```

2. **Status Badges**
   ```typescript
   Selesai         → Green (CheckCircle2 icon)
   Sedang Belajar  → Blue (Play icon)
   Belum Dimulai   → Gray (Lock icon)
   ```

3. **Stat Cards Gradient**
   ```typescript
   Total Jalur     → White (default)
   Selesai         → Green gradient
   Sedang Belajar  → Blue gradient
   Total XP        → Purple gradient
   ```

### **Animations**
- **Framer Motion** stagger animations untuk path cards
- Hover effects (shadow, scale, border color)
- Progress bar smooth transitions
- Badge pulse animations untuk notifikasi

### **Responsive Design**
```css
grid-cols-1          // Mobile
md:grid-cols-2       // Tablet
lg:grid-cols-3       // Desktop
```

---

## 🔗 API Integration

### **Endpoints Used**

1. **GET /api/paths** - Fetch paths dengan filters
   ```typescript
   const response = await apiClient.get("/api/paths", {
     params: {
       gradeLevel: userProfile.gradeLevel,
       classNumber: userProfile.classNumber,
       semester: userProfile.semester,
       major: userProfile.major,
       isActive: true,
     },
   });
   ```

2. **GET /api/paths/:pathId/progress/:userId** - Fetch progress per path
   ```typescript
   const progressRes = await apiClient.get(
     `/api/paths/${path.pathId}/progress/${userId}`
   );
   ```

### **Data Flow**
```
1. Component Mount
   ↓
2. fetchPaths() → GET /api/paths (with user profile filters)
   ↓
3. For each path → GET /api/paths/:pathId/progress/:userId
   ↓
4. Store in pathProgress state: { [pathId]: ProgressData }
   ↓
5. Render cards with progress data
```

---

## 🧪 Testing Scenarios

### **Scenario 1: First-Time User (No Progress)**
```
Given: User baru, belum pernah belajar
When: Buka /learning-paths
Then:
  ✓ Tampil semua paths sesuai gradeLevel/class/semester
  ✓ Semua path status "Belum Dimulai"
  ✓ Progress bar tidak muncul (karena belum ada progress)
  ✓ Stat card "Selesai" = 0, "Sedang Belajar" = 0
  ✓ Button "Mulai Belajar" aktif
```

### **Scenario 2: Active Learner**
```
Given: User sudah belajar 3 paths (1 selesai, 2 in-progress)
When: Buka /learning-paths
Then:
  ✓ Tab "Aktif" menampilkan 2 paths in-progress
  ✓ Tab "Selesai" menampilkan 1 path completed
  ✓ Progress bar menampilkan persentase akurat
  ✓ XP earned ditampilkan di setiap card
  ✓ Total XP di stat card = sum dari semua paths
  ✓ Stars ditampilkan (X/max ⭐)
```

### **Scenario 3: Filter & Search**
```
Given: Ada 10 paths (5 Matematika, 3 IPA, 2 Bahasa Indonesia)
When: User pilih filter "Matematika"
Then:
  ✓ Hanya 5 paths Matematika yang ditampilkan
  ✓ filteredPaths.length = 5
  ✓ Stat card "X ditampilkan" = 5

When: User search "Aljabar"
Then:
  ✓ Hanya paths dengan "Aljabar" di name/description
  ✓ Case-insensitive search
```

### **Scenario 4: Navigation to Skill Tree**
```
Given: User klik path card
When: Klik button "Mulai Belajar" / "Lanjutkan"
Then:
  ✓ Navigate to `/skill-tree?pathId={pathId}`
  ✓ Skill tree page filters nodes berdasarkan pathId
  ✓ User dapat mulai quiz dari nodes
```

### **Scenario 5: Empty State**
```
Given: Filter menghasilkan 0 paths
When: User filter "Sulit" + "Bahasa Jawa" (tidak ada)
Then:
  ✓ Tampil empty state component
  ✓ Icon BookOpen + pesan "Tidak ada jalur..."
  ✓ Saran untuk ubah filter
```

---

## 🚀 Usage Examples

### **Example 1: Student SMP Kelas 7**
```typescript
// User profile
{
  gradeLevel: "SMP",
  classNumber: 7,
  semester: 1,
  major: undefined
}

// Available paths
[
  {
    pathId: "PATH-SMP-7-1-MATEMATIKA-1234567890",
    name: "Matematika - Kelas 7 Semester 1",
    subject: "Matematika",
    totalNodes: 25,
    totalXP: 2500,
    totalQuizzes: 50,
    estimatedHours: 15,
    difficulty: "Sedang"
  },
  {
    pathId: "PATH-SMP-7-1-IPA-1234567891",
    name: "IPA - Kelas 7 Semester 1",
    subject: "IPA",
    totalNodes: 20,
    totalXP: 2000,
    difficulty: "Mudah"
  }
]

// User progress (Matematika path)
{
  pathId: "PATH-SMP-7-1-MATEMATIKA-1234567890",
  completedNodes: 10,
  inProgressNodes: 2,
  lockedNodes: 13,
  progressPercentage: 40,
  totalXPEarned: 1000,
  totalXPAvailable: 2500,
  totalStars: 25,
  maxPossibleStars: 75,
  starPercentage: 33.33
}
```

### **Example 2: Student SMK Kelas 11 PPLG**
```typescript
// User profile
{
  gradeLevel: "SMK",
  classNumber: 11,
  semester: 1,
  major: "PPLG"
}

// Available paths (filtered by major)
[
  {
    pathId: "PATH-SMK-11-1-PEMROGRAMAN-WEB-PPLG-123",
    name: "Pemrograman Web - Kelas 11 Semester 1 (PPLG)",
    subject: "Pemrograman Web",
    major: "PPLG",
    totalNodes: 30,
    totalXP: 3000,
    tags: ["SMK", "Kelas-11", "Semester-1", "PPLG", "Web"]
  },
  {
    pathId: "PATH-SMK-11-1-BASIS-DATA-PPLG-124",
    name: "Basis Data - Kelas 11 Semester 1 (PPLG)",
    subject: "Basis Data",
    major: "PPLG",
    totalNodes: 25,
    totalXP: 2500
  }
]
```

---

## 🔄 Integration with Skill Tree

### **Navigation Flow**
```
Learning Path Dashboard
       ↓ (Click "Mulai Belajar" / "Lanjutkan")
       ↓
Skill Tree Page (/skill-tree?pathId=xxx)
       ↓ (Display only nodes from this path)
       ↓
       ↓ (Click node → "Mulai Quiz")
       ↓
Quiz Player (/quiz-player?nodeId=xxx)
       ↓ (Complete quiz)
       ↓
Progress Updated
       ↓
Back to Learning Path Dashboard
       ↓ (Progress reflected in card)
```

### **SkillTreePage Integration**
```typescript
// SkillTreePage should check for pathId query param
const searchParams = new URLSearchParams(location.search);
const pathId = searchParams.get('pathId');

if (pathId) {
  // Fetch nodes in this path
  const response = await apiClient.get(`/api/paths/${pathId}/nodes`);
  setNodes(response.nodes); // Only nodes in this path
  setFilteredByPath(true);
}
```

---

## 📊 Statistics Calculation

### **Progress Percentage**
```typescript
progressPercentage = (completedNodes / totalNodes) * 100
```

### **Star Percentage**
```typescript
// Max stars = 3 per node
maxPossibleStars = totalNodes * 3

// Actual stars from user progress
totalStars = sum of progress[].stars for all nodes

starPercentage = (totalStars / maxPossibleStars) * 100
```

### **XP Tracking**
```typescript
// Total XP available in path
totalXPAvailable = sum of node.xpReward for all nodes in path

// XP earned by user
totalXPEarned = sum of progress[].xpEarned for all nodes
```

### **Path Status Logic**
```typescript
function getPathStatus(pathId: string) {
  const progress = pathProgress[pathId];
  if (!progress) return "not-started";
  if (progress.progressPercentage === 100) return "completed";
  if (progress.progressPercentage > 0) return "in-progress";
  return "not-started";
}
```

---

## 🎯 Future Enhancements

### **Phase 1: Recommendations Engine**
- AI-powered path recommendations based on:
  * Previous performance (strong subjects)
  * Struggling areas (recommend easier paths first)
  * Learning velocity (fast learners → advanced paths)
  * Interest patterns (subjects frequently started)

### **Phase 2: Path Prerequisites**
```typescript
interface LearningPath {
  prerequisites: string[]; // Other pathIds that must be completed
}

// Lock advanced paths until prerequisites completed
function isPathUnlocked(path: LearningPath) {
  return path.prerequisites.every(prereqId => 
    getPathStatus(prereqId) === "completed"
  );
}
```

### **Phase 3: Social Features**
- See classmates' progress on same path
- Path completion leaderboard
- Collaborative learning goals
- Share achievements when path completed

### **Phase 4: Adaptive Difficulty**
```typescript
// Auto-adjust path difficulty based on user performance
if (averageQuizScore < 60) {
  recommendPath(difficulty: "Mudah");
} else if (averageQuizScore > 85) {
  recommendPath(difficulty: "Sulit");
}
```

### **Phase 5: Gamification**
- Path-specific badges (e.g., "Matematika Master")
- Streak tracking per path
- Milestone rewards (25%, 50%, 75%, 100%)
- Certificate generation on path completion

---

## 🐛 Known Issues & Limitations

### **Current Limitations**

1. **User Profile Mock Data**
   ```typescript
   // Currently hardcoded
   const userProfile = {
     gradeLevel: "SMP",
     classNumber: 7,
     semester: 1,
   };
   
   // TODO: Get from AuthContext after Task 55
   const { user } = useAuth();
   const userProfile = user.studentProfile;
   ```

2. **User ID Hardcoded**
   ```typescript
   // Currently using placeholder
   const userId = "current-user-id";
   
   // TODO: Get from AuthContext
   const { user } = useAuth();
   const userId = user._id;
   ```

3. **No Onboarding Flow**
   - New students don't have studentProfile set
   - Need Task 55 (Class Selection) first
   - Should redirect to onboarding if profile incomplete

4. **Progress Fetching Performance**
   - Currently fetches progress for ALL paths sequentially
   - Could be optimized with batch endpoint
   ```typescript
   // Current: N API calls
   paths.forEach(path => GET /api/paths/:id/progress/:userId)
   
   // Better: 1 API call
   POST /api/paths/batch-progress { pathIds: [...], userId }
   ```

5. **No Caching**
   - Progress data refetched on every mount
   - Should use React Query or SWR for caching
   - Consider localStorage for offline access

---

## ✅ Completion Checklist

- [x] Create LearningPathDashboard component
- [x] Implement PathGrid sub-component
- [x] Add filters (search, subject, difficulty, status)
- [x] Add tabs (all, recommended, in-progress, completed)
- [x] Integrate with /api/paths endpoint
- [x] Fetch progress for each path
- [x] Display stats overview cards
- [x] Implement path status logic
- [x] Add difficulty color coding
- [x] Add status badges
- [x] Add progress bars
- [x] Add star tracking
- [x] Add XP tracking
- [x] Add navigation to skill tree
- [x] Add empty state handling
- [x] Add loading state
- [x] Add error handling
- [x] Add responsive design
- [x] Add animations (framer-motion)
- [x] Add route to App.tsx
- [x] Add menu item to AppSidebar
- [x] Create documentation

---

## 📝 Related Tasks

- **Task 44**: SkillTreePath Model & API (Dependency - COMPLETED)
- **Task 55**: Class Selection & Navigation (Needed for user profile)
- **Task 39**: Lesson Content Integration (Enhance path with lessons)
- **Task 41**: Content Preview in Skill Tree (Preview before starting)
- **Task 40**: Progress Sync Testing (Verify progress updates)

---

## 🎉 Summary

**Task 54: Learning Path Dashboard** is now **COMPLETE**!

### **What's New**
✅ Student-facing dashboard untuk browse learning paths  
✅ Filter & search functionality  
✅ Progress tracking per path  
✅ Stats overview (total paths, completed, in-progress, XP)  
✅ Tab navigation (all, recommended, active, completed)  
✅ Beautiful UI dengan animations & responsive design  
✅ Integration dengan SkillTreePath API  
✅ Navigation ke Skill Tree page  

### **Files Created**: 1
- `src/pages/LearningPathDashboard.tsx`

### **Files Modified**: 2
- `src/App.tsx` (added route)
- `src/components/AppSidebar.tsx` (added menu item)

### **Next Steps**
Proceed to **Task 55: Class Selection & Navigation** untuk:
- Create onboarding flow untuk student baru
- Allow selection of gradeLevel, class, semester, major
- Save to user.studentProfile
- Enable proper filtering di Learning Path Dashboard

---

**Progress**: 31/60 tasks complete (52%) 🎉
