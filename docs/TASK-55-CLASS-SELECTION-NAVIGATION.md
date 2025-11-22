# Task 55: Class Selection & Navigation

**Status**: ✅ COMPLETE  
**Tanggal**: November 21, 2025  
**Dependencies**: Task 54 (Learning Path Dashboard)

---

## 📋 Overview

Onboarding flow untuk student baru memilih gradeLevel, classNumber, semester, dan major (untuk SMK). Sistem ini menyimpan preferensi di `User.studentProfile` dan digunakan untuk filtering learning paths yang sesuai.

---

## 🎯 Fitur Utama

### 1. **Onboarding Flow (Multi-Step)**

**Step 1: Pilih Jenjang Pendidikan**
```typescript
Options:
- SD (Sekolah Dasar) → Kelas 1-6
- SMP (Sekolah Menengah Pertama) → Kelas 7-9  
- SMA (Sekolah Menengah Atas) → Kelas 10-12
- SMK (Sekolah Menengah Kejuruan) → Kelas 10-12 + Major

Visual:
- 4 kartu besar dengan icon, nama lengkap, deskripsi
- Selected state dengan border primary + check icon
- Gradient color per jenjang
```

**Step 2: Pilih Kelas & Semester**
```typescript
Class Options (dynamic based on grade):
- SD: 1-6
- SMP: 7-9
- SMA/SMK: 10-12

Semester Options:
- Semester 1 (Ganjil)
- Semester 2 (Genap)

Layout:
- Grid kelas (2x3 atau 3x3)
- Semester toggle di bawah
```

**Step 3: Pilih Jurusan** (SMK only)
```typescript
Majors Available:
- PPLG: Pengembangan Perangkat Lunak dan Gim
- TJKT: Teknik Jaringan Komputer dan Telekomunikasi
- DKV: Desain Komunikasi Visual
- BD: Bisnis Digital
- HOTEL: Perhotelan
- CULINARY: Tata Boga
- OTHER: Jurusan Lainnya

Visual:
- Kartu dengan badge kode jurusan
- Icon representatif
- Deskripsi singkat
```

**Step 4: Konfirmasi**
```typescript
Review Summary:
- Jenjang: SMP - Sekolah Menengah Pertama
- Kelas: Kelas 7
- Semester: Semester 1 (Ganjil)
- Jurusan: [if SMK]

Info Box:
"Profil ini akan digunakan untuk:"
- Menyesuaikan materi pembelajaran
- Memberikan rekomendasi jalur belajar
- Menampilkan konten sesuai tingkat
```

### 2. **Progress Tracking**
```typescript
// Visual progress bar
totalSteps = gradeLevel === "SMK" ? 4 : 3
progress = (currentStep / totalSteps) * 100

// Display: "Langkah X dari Y" + percentage bar
```

### 3. **Semester Toggle Component**
```typescript
// Reusable component for switching semester
<SemesterToggle 
  currentSemester={1 | 2}
  onSemesterChange={(newSemester) => void}
  disabled={boolean}
/>

Features:
- Toggle UI (Semester 1 / Semester 2)
- Confirmation dialog before switching
- API call to update backend
- Refetch learning paths after change
```

### 4. **Data Model: StudentProfile**
```typescript
interface StudentProfile {
  currentGrade: "SD" | "SMP" | "SMA" | "SMK";
  currentClass: number; // 1-12
  currentSemester: 1 | 2;
  major?: string; // For SMK only
  onboardingComplete: boolean;
}

// Stored in User document
interface UserDocument {
  ...existing fields
  studentProfile?: StudentProfile;
}
```

---

## 🗂️ File Structure

### **Backend Files**

1. **server/src/models/User.ts** (MODIFIED)
   - Added `StudentProfile` interface
   - Added `studentProfile` field to UserDocument
   - Added `studentProfileSchema` validation
   - Validation rules:
     ```typescript
     currentGrade: enum ["SD", "SMP", "SMA", "SMK"]
     currentClass: min 1, max 12
     currentSemester: enum [1, 2]
     major: optional string
     onboardingComplete: boolean (default false)
     ```

2. **server/src/controllers/studentProfileController.ts** (NEW - ~280 lines)
   
   **Functions:**
   
   a. `getStudentProfile(req, res)`
      - GET /api/student/profile
      - Returns current student profile + basic user info
      - Only for students (role check)
   
   b. `updateStudentProfile(req, res)`
      - PUT /api/student/profile
      - Update/create student profile (onboarding)
      - Validation:
        * Required: currentGrade, currentClass, currentSemester
        * Grade-specific class ranges (SD: 1-6, SMP: 7-9, etc.)
        * SMK requires major field
      - Sets `onboardingComplete: true` after save
   
   c. `getOnboardingStatus(req, res)`
      - GET /api/student/onboarding-status
      - Check if student completed onboarding
      - Returns: `{ onboardingComplete, requiresOnboarding, profile }`
   
   d. `switchSemester(req, res)`
      - POST /api/student/switch-semester
      - Switch between semester 1 and 2
      - Updates `studentProfile.currentSemester`
      - Used by SemesterToggle component

3. **server/src/routes/student.ts** (MODIFIED)
   - Added 4 new routes:
     ```typescript
     GET  /api/student/profile
     PUT  /api/student/profile
     GET  /api/student/onboarding-status
     POST /api/student/switch-semester
     ```
   - All routes require `authenticate` middleware

### **Frontend Files**

4. **src/pages/ClassSelectionOnboarding.tsx** (NEW - ~680 lines)
   
   **Features:**
   - Multi-step wizard (1-4 steps depending on grade)
   - Framer Motion animations (slide transitions, success screen)
   - Responsive grid layouts
   - Form validation at each step
   - Success screen with redirect
   - Auto-redirect if onboarding already completed
   
   **State Management:**
   ```typescript
   const [step, setStep] = useState(1);
   const [gradeLevel, setGradeLevel] = useState<GradeLevel | null>(null);
   const [classNumber, setClassNumber] = useState<number | null>(null);
   const [semester, setSemester] = useState<1 | 2>(1);
   const [major, setMajor] = useState<string>("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState(false);
   ```
   
   **Navigation Logic:**
   ```typescript
   handleNext() {
     if (step === 1 && !gradeLevel) → Show error
     if (step === 2 && !classNumber) → Show error
     if (step === 3 && isSMK && !major) → Show error
     if (step === totalSteps) → handleSubmit()
     else → setStep(step + 1)
   }
   
   handleBack() {
     setStep(step - 1)
   }
   ```

5. **src/components/SemesterToggle.tsx** (NEW - ~130 lines)
   
   **Props:**
   ```typescript
   interface SemesterToggleProps {
     currentSemester: 1 | 2;
     onSemesterChange: (newSemester: 1 | 2) => void;
     disabled?: boolean;
   }
   ```
   
   **UI:**
   - Toggle switch style (Semester 1 | Semester 2)
   - Active semester highlighted with white background
   - Confirmation dialog before switching
   - Shows what will change after switch
   - Loading state during API call
   
   **Flow:**
   ```
   Click semester → Show confirmation dialog
   User confirms → API call POST /api/student/switch-semester
   Success → Call onSemesterChange callback
   Parent component refetches data with new semester
   ```

6. **src/pages/LearningPathDashboard.tsx** (MODIFIED)
   
   **Changes:**
   - Added `StudentProfile` interface
   - Added `userProfile` state
   - Added `checkOnboardingAndFetchPaths()` function
   - Added redirect to `/class-selection` if onboarding incomplete
   - Fetch profile from API instead of mock data
   - Use profile data for path filtering
   - Added SemesterToggle component
   - Added `handleSemesterChange()` function
   
   **Flow:**
   ```typescript
   useEffect(() => {
     1. Check onboarding status
     2. If not complete → redirect to /class-selection
     3. Fetch student profile from API
     4. Use profile to fetch paths
     5. Fetch progress for each path
   }, []);
   
   handleSemesterChange(newSemester) {
     1. Update local userProfile state
     2. Refetch paths with new semester
   }
   ```

7. **src/App.tsx** (MODIFIED)
   - Added import: `ClassSelectionOnboarding`
   - Added route: `/class-selection` (protected, student only)

---

## 🔗 API Endpoints

### **1. GET /api/student/onboarding-status**
Check if student completed onboarding.

**Request:**
```http
GET /api/student/onboarding-status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "onboardingComplete": false,
  "requiresOnboarding": true,
  "profile": null
}
```

---

### **2. GET /api/student/profile**
Get current student profile.

**Request:**
```http
GET /api/student/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "currentGrade": "SMP",
    "currentClass": 7,
    "currentSemester": 1,
    "major": null,
    "onboardingComplete": true
  },
  "user": {
    "name": "Ahmad Rizki",
    "email": "ahmad@example.com"
  }
}
```

---

### **3. PUT /api/student/profile**
Update student profile (onboarding).

**Request:**
```http
PUT /api/student/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentGrade": "SMK",
  "currentClass": 11,
  "currentSemester": 1,
  "major": "PPLG"
}
```

**Validation Rules:**
- `currentGrade`: Required, must be "SD", "SMP", "SMA", or "SMK"
- `currentClass`: Required, 1-12
  * SD: 1-6
  * SMP: 7-9
  * SMA: 10-12
  * SMK: 10-12
- `currentSemester`: Required, 1 or 2
- `major`: Required if currentGrade === "SMK"

**Response (Success):**
```json
{
  "success": true,
  "message": "Student profile updated successfully",
  "profile": {
    "currentGrade": "SMK",
    "currentClass": 11,
    "currentSemester": 1,
    "major": "PPLG",
    "onboardingComplete": true
  }
}
```

**Response (Error - Invalid Class):**
```json
{
  "success": false,
  "message": "Invalid class number for SMK. Must be between 10 and 12"
}
```

**Response (Error - SMK Missing Major):**
```json
{
  "success": false,
  "message": "Major (jurusan) is required for SMK students"
}
```

---

### **4. POST /api/student/switch-semester**
Switch between semester 1 and 2.

**Request:**
```http
POST /api/student/switch-semester
Authorization: Bearer <token>
Content-Type: application/json

{
  "semester": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Switched to semester 2",
  "profile": {
    "currentGrade": "SMP",
    "currentClass": 7,
    "currentSemester": 2,
    "onboardingComplete": true
  }
}
```

---

## 🧪 Testing Scenarios

### **Scenario 1: New Student - First Login**
```
Given: New student, no studentProfile set
When: User logs in and tries to access /learning-paths
Then:
  ✓ Auto-redirect to /class-selection
  ✓ Show onboarding wizard
  ✓ Progress bar starts at 0%
```

### **Scenario 2: Onboarding - SMP Student**
```
Given: User on /class-selection
When: User selects SMP → Kelas 7 → Semester 1
Then:
  ✓ Step 1: Show SD, SMP, SMA, SMK options
  ✓ Select SMP → Progress 33%
  ✓ Step 2: Show classes 7, 8, 9
  ✓ Select 7 → Semester toggle → Progress 66%
  ✓ Step 3: Show confirmation (no major for SMP)
  ✓ Submit → Progress 100%
  ✓ API call PUT /api/student/profile
  ✓ Success screen → Redirect to /learning-paths
```

### **Scenario 3: Onboarding - SMK Student with Major**
```
Given: User on /class-selection
When: User selects SMK → Kelas 11 → Semester 1 → PPLG
Then:
  ✓ Step 1: Select SMK → Progress 25%
  ✓ Step 2: Select Kelas 11, Semester 1 → Progress 50%
  ✓ Step 3: Show 7 major options (PPLG, TJKT, DKV, etc.)
  ✓ Select PPLG → Progress 75%
  ✓ Step 4: Confirmation shows major
  ✓ Submit → Progress 100%
  ✓ Profile saved with major: "PPLG"
```

### **Scenario 4: Validation Errors**
```
Given: User on Step 2
When: User clicks "Selanjutnya" without selecting class
Then:
  ✓ Show error: "Pilih kelas terlebih dahulu"
  ✓ Cannot proceed to next step
  ✓ Error dismissible

Given: SMK student on Step 3
When: User clicks "Selanjutnya" without selecting major
Then:
  ✓ Show error: "Pilih jurusan terlebih dahulu"
```

### **Scenario 5: Semester Switching**
```
Given: Student with completed onboarding (Semester 1)
When: User clicks Semester 2 toggle on dashboard
Then:
  ✓ Show confirmation dialog
  ✓ Dialog explains what will change
  ✓ User confirms
  ✓ API call POST /api/student/switch-semester
  ✓ Profile updated to semester: 2
  ✓ Learning paths refetched for semester 2
  ✓ Dashboard updated with new paths
```

### **Scenario 6: Returning User**
```
Given: Student with onboardingComplete: true
When: User tries to access /class-selection
Then:
  ✓ Auto-redirect to /learning-paths (already onboarded)
  
When: User accesses /learning-paths
Then:
  ✓ No redirect to /class-selection
  ✓ Profile fetched from API
  ✓ Paths filtered by profile
  ✓ Semester toggle shows current semester
```

### **Scenario 7: Class Range Validation**
```
Given: User selects SD
When: User tries to select Kelas 7
Then:
  ✓ Class 7 not shown (only 1-6 for SD)

Given: User selects SMA
When: User sees class options
Then:
  ✓ Only shows 10, 11, 12
```

---

## 🎨 UI/UX Features

### **Animations**

1. **Page Transitions**
   ```typescript
   // Step transitions (slide in/out)
   initial={{ opacity: 0, x: 100 }}
   animate={{ opacity: 1, x: 0 }}
   exit={{ opacity: 0, x: -100 }}
   ```

2. **Success Screen**
   ```typescript
   // Check icon animation
   initial={{ scale: 0, rotate: -180 }}
   animate={{ scale: 1, rotate: 0 }}
   transition={{ type: "spring", duration: 0.8 }}
   ```

3. **Card Interactions**
   ```typescript
   whileHover={{ scale: 1.02 }}
   whileTap={{ scale: 0.98 }}
   ```

### **Color Scheme**

```typescript
// Grade level gradients
SD:  from-green-500 to-emerald-600
SMP: from-blue-500 to-cyan-600
SMA: from-purple-500 to-pink-600
SMK: from-orange-500 to-red-600

// Icons per grade
SD:  🎒 (backpack)
SMP: 📚 (books)
SMA: 🎓 (graduation cap)
SMK: 🛠️ (tools)
```

### **Responsive Design**

```css
/* Class selection grid */
grid-cols-1 md:grid-cols-2    /* Grade level cards */
grid-cols-2 md:grid-cols-3    /* Class number buttons */

/* Major selection */
grid-cols-1 md:grid-cols-2    /* Major cards */
```

---

## 🔄 Integration Points

### **1. Learning Path Dashboard**
```typescript
// Check onboarding before showing dashboard
useEffect(() => {
  const status = await apiClient.get("/api/student/onboarding-status");
  if (!status.onboardingComplete) {
    navigate("/class-selection");
  }
}, []);
```

### **2. Student Registration Flow**
```
Registration → Login → Check Onboarding
                          ↓ (not complete)
                   /class-selection
                          ↓ (complete)
                   /learning-paths
```

### **3. Profile-Based Filtering**
```typescript
// All paths queries use student profile
GET /api/paths?gradeLevel=SMP&classNumber=7&semester=1

// If SMK
GET /api/paths?gradeLevel=SMK&classNumber=11&semester=1&major=PPLG
```

---

## 🚀 Usage Examples

### **Example 1: SMP Kelas 7 Student**
```typescript
// After onboarding
{
  currentGrade: "SMP",
  currentClass: 7,
  currentSemester: 1,
  onboardingComplete: true
}

// Available paths
GET /api/paths?gradeLevel=SMP&classNumber=7&semester=1

// Returns: Matematika Kelas 7 Sem 1, IPA Kelas 7 Sem 1, etc.
```

### **Example 2: SMK PPLG Student**
```typescript
// After onboarding
{
  currentGrade: "SMK",
  currentClass: 11,
  currentSemester: 1,
  major: "PPLG",
  onboardingComplete: true
}

// Available paths
GET /api/paths?gradeLevel=SMK&classNumber=11&semester=1&major=PPLG

// Returns: Pemrograman Web, Basis Data, Mobile Development, etc.
```

### **Example 3: Semester Switch**
```typescript
// User on Semester 1
currentSemester: 1

// User clicks Semester 2 toggle
SemesterToggle triggers:
POST /api/student/switch-semester { semester: 2 }

// Profile updated
currentSemester: 2

// Dashboard refetches
GET /api/paths?gradeLevel=SMP&classNumber=7&semester=2

// New paths shown for Semester 2
```

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  Student Login  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Check Onboarding Status │
│ GET /onboarding-status  │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │ Complete?│
    └────┬────┘
         │
    NO   │   YES
    │    │    │
    ▼    │    ▼
┌───────────┐  │  ┌──────────────────┐
│ /class-   │  │  │ /learning-paths  │
│ selection │  │  └──────────────────┘
└─────┬─────┘  │
      │        │
      ▼        │
┌──────────────────┐
│ Multi-Step Form  │
│ (4 steps max)    │
└─────┬────────────┘
      │
      ▼
┌──────────────────────┐
│ PUT /student/profile │
│ Save to MongoDB      │
└─────┬────────────────┘
      │
      ▼
┌──────────────────┐
│ Success Screen   │
│ Redirect to      │
│ /learning-paths  │
└──────────────────┘
```

---

## 🎯 Future Enhancements

### **Phase 1: Profile Editing**
```typescript
// Allow students to edit profile after onboarding
// Route: /profile/edit-class
// Features:
- Change class (e.g., promoted to next grade)
- Change major (e.g., transfer to different major)
- Confirmation dialog with warning about progress reset
```

### **Phase 2: Multi-School Support**
```typescript
// If student transfers school
interface StudentProfile {
  ...existing fields
  schoolHistory: [{
    schoolId: ObjectId;
    gradeLevel: string;
    from: Date;
    to?: Date;
  }]
}
```

### **Phase 3: Academic Year Tracking**
```typescript
interface StudentProfile {
  ...existing fields
  academicYear: "2024/2025" | "2025/2026";
  autoPromote: boolean; // Auto-promote to next class
}

// Auto-promote logic
if (currentDate > endOfAcademicYear && autoPromote) {
  currentClass += 1;
  currentSemester = 1;
}
```

### **Phase 4: Parent/Guardian Approval**
```typescript
// For young students (SD)
// Require parent approval before profile changes
POST /api/student/profile/request-change
  → Send email to parent
  → Parent approves via link
  → Profile updated
```

---

## 🐛 Known Issues & Limitations

### **Current Limitations**

1. **No Profile Edit After Onboarding**
   - Once profile saved, student cannot change it
   - Need to contact admin/teacher
   - TODO: Add /profile/edit page

2. **No Grade Promotion Flow**
   - Student promoted to next grade must manually update
   - No automatic promotion at end of academic year
   - TODO: Add cron job for auto-promotion

3. **Limited Major Options**
   - Only 7 predefined majors
   - "OTHER" is catch-all
   - TODO: Make majors configurable per school

4. **No Profile History**
   - Cannot track when profile was changed
   - No audit log
   - TODO: Add `profileHistory` array

5. **Semester Switch Without Confirmation for Progress Loss**
   - Switching semester doesn't warn about in-progress paths
   - TODO: Show progress impact before switching

---

## ✅ Completion Checklist

**Backend:**
- [x] Add StudentProfile interface to User model
- [x] Add studentProfile field with validation
- [x] Create studentProfileController
- [x] Implement getStudentProfile endpoint
- [x] Implement updateStudentProfile endpoint (onboarding)
- [x] Implement getOnboardingStatus endpoint
- [x] Implement switchSemester endpoint
- [x] Add routes to student router
- [x] Validate grade-specific class ranges
- [x] Validate SMK major requirement

**Frontend:**
- [x] Create ClassSelectionOnboarding component
- [x] Implement multi-step wizard (1-4 steps)
- [x] Add grade level selection (SD/SMP/SMA/SMK)
- [x] Add class number selection (dynamic range)
- [x] Add semester selection
- [x] Add major selection (SMK only)
- [x] Add confirmation step
- [x] Add progress bar
- [x] Add form validation
- [x] Add error handling
- [x] Add success screen with redirect
- [x] Create SemesterToggle component
- [x] Add confirmation dialog for semester switch
- [x] Add route to App.tsx
- [x] Update LearningPathDashboard to check onboarding
- [x] Update LearningPathDashboard to use profile from API
- [x] Add SemesterToggle to dashboard
- [x] Add animations (Framer Motion)
- [x] Add responsive design

**Documentation:**
- [x] API endpoint documentation
- [x] Testing scenarios
- [x] Usage examples
- [x] Data flow diagram
- [x] Future enhancements

---

## 📝 Related Tasks

- **Task 54**: Learning Path Dashboard (Dependency - COMPLETED)
- **Task 44**: SkillTreePath Model & API (Dependency - COMPLETED)
- **Task 39**: Lesson Content Integration (Next priority)
- **Task 41**: Content Preview in Skill Tree (Enhancement)

---

## 🎉 Summary

**Task 55: Class Selection & Navigation** is now **COMPLETE**!

### **What's New**
✅ Multi-step onboarding wizard (4 steps max)  
✅ Grade level selection (SD/SMP/SMA/SMK)  
✅ Class number selection (dynamic range per grade)  
✅ Semester selection with toggle component  
✅ Major selection (SMK only, 7 options)  
✅ StudentProfile model with validation  
✅ 4 API endpoints (profile CRUD + semester switch)  
✅ Auto-redirect based on onboarding status  
✅ Beautiful UI dengan animations  
✅ Profile-based path filtering  
✅ Semester switching functionality  

### **Files Created**: 3
- `server/src/controllers/studentProfileController.ts`
- `src/pages/ClassSelectionOnboarding.tsx`
- `src/components/SemesterToggle.tsx`

### **Files Modified**: 4
- `server/src/models/User.ts` (added StudentProfile)
- `server/src/routes/student.ts` (added 4 routes)
- `src/pages/LearningPathDashboard.tsx` (use profile from API)
- `src/App.tsx` (added route)

### **API Endpoints Added**: 4
- GET `/api/student/onboarding-status`
- GET `/api/student/profile`
- PUT `/api/student/profile`
- POST `/api/student/switch-semester`

### **User Flow**
```
New Student Login
  ↓
Check Onboarding Status
  ↓ (incomplete)
/class-selection (4-step wizard)
  ↓
Save Profile to MongoDB
  ↓
Redirect to /learning-paths
  ↓
Paths filtered by profile
  ↓
Can switch semester anytime
```

---

**Progress**: 32/60 tasks complete (53%) 🎉

**Next Steps**: Proceed to **Task 39: Lesson Content Integration** untuk menambahkan konten pembelajaran di skill tree nodes.
