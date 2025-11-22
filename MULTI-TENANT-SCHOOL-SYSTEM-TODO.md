# 🏫 MULTI-TENANT SCHOOL MANAGEMENT SYSTEM - TODO LIST

## 📊 OVERVIEW

Membangun sistem manajemen sekolah multi-tenant dengan hierarki:
**School Owner → School → Classes → Teachers & Students**

---

## PHASE 1: DATABASE MODELS & SCHEMA DESIGN (Backend)

### 1.1 Create School Model
**File:** `server/src/models/School.ts`

**Schema:**
```typescript
{
  schoolId: string (unique, auto-generated: SCH-XXXXX)
  schoolName: string (required)
  address: string
  city: string
  province: string
  phone: string
  email: string
  website?: string
  logoUrl?: string
  
  // Admin/Owner info
  owner: ObjectId (ref: User)
  ownerName: string
  ownerEmail: string
  
  // School settings
  totalClasses: number
  totalTeachers: number
  totalStudents: number
  academicYear: string (e.g., "2024/2025")
  
  // Subscription info (future: untuk plan berbayar)
  subscriptionPlan: enum ['free', 'basic', 'premium']
  subscriptionStatus: enum ['active', 'inactive', 'suspended']
  subscriptionExpiry: Date
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}
```

**Indexes:**
- `schoolId` (unique)
- `owner` 
- `email` (unique)

---

### 1.2 Create Class Model
**File:** `server/src/models/Class.ts`

**Schema:**
```typescript
{
  classId: string (unique, auto-generated: CLS-XXXXX)
  className: string (e.g., "XII IPA 1")
  grade: number (10, 11, 12)
  section: string ("IPA 1", "IPS 2", etc.)
  
  // School relationship
  school: ObjectId (ref: School)
  schoolId: string
  schoolName: string
  
  // Class info
  academicYear: string
  maxStudents: number (default: 40)
  currentStudents: number
  
  // Teacher assignment
  homeRoomTeacher: ObjectId (ref: User)
  homeRoomTeacherName: string
  subjectTeachers: [
    {
      teacher: ObjectId (ref: User)
      teacherName: string
      subject: string (e.g., "Matematika", "Fisika")
    }
  ]
  
  // Class schedule (optional for now)
  schedule?: [
    {
      day: enum ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
      startTime: string
      endTime: string
      subject: string
      teacher: ObjectId
    }
  ]
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}
```

**Indexes:**
- `classId` (unique)
- `school`
- `schoolId`

---

### 1.3 Update User Model
**File:** `server/src/models/User.ts`

**Add fields:**
```typescript
{
  // Existing fields...
  
  // School relationship
  school?: ObjectId (ref: School)
  schoolId?: string
  schoolName?: string
  
  // For Teachers
  teacherProfile?: {
    employeeId: string (NIP/NIK)
    subjects: string[] (mata pelajaran yang diajar)
    classes: [ObjectId] (ref: Class)
    classIds: string[]
    yearsOfExperience: number
    qualification: string (S1, S2, etc.)
    specialization: string
  }
  
  // For Students (enhance existing StudentProfile)
  studentProfile?: {
    studentId: string (NIS/NISN)
    class: ObjectId (ref: Class)
    classId: string
    className: string
    rollNumber: number (nomor absen: 1-40)
    parentName: string
    parentPhone: string
    parentEmail: string
    admissionDate: Date
    
    // Keep existing gamification fields
    xp: number
    level: number
    // ... (all existing fields)
  }
  
  // For School Owners
  isSchoolOwner: boolean
  ownedSchool?: ObjectId (ref: School)
}
```

---

### 1.4 Create TeacherAnalytics Model
**File:** `server/src/models/TeacherAnalytics.ts`

**Schema:**
```typescript
{
  teacher: ObjectId (ref: User)
  teacherId: string
  teacherName: string
  
  school: ObjectId (ref: School)
  schoolId: string
  
  class: ObjectId (ref: Class)
  classId: string
  
  // Daily activity
  date: Date
  
  // Teaching metrics
  lessonsPlanned: number
  lessonsCompleted: number
  quizzesCreated: number
  quizzesGraded: number
  assignmentsGiven: number
  assignmentsGraded: number
  
  // Student engagement
  studentsActive: number
  studentsAbsent: number
  averageAttendance: number
  
  // Content metrics
  videosUploaded: number
  exercisesCreated: number
  
  // Interaction metrics
  chatMessagesWithStudents: number
  feedbackGiven: number
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**
- `teacher, date` (compound, unique)
- `school, date`
- `class, date`

---

### 1.5 Create SchoolAnalytics Model
**File:** `server/src/models/SchoolAnalytics.ts`

**Schema:**
```typescript
{
  school: ObjectId (ref: School)
  schoolId: string
  
  date: Date
  
  // Overall metrics
  totalTeachers: number
  totalStudents: number
  totalClasses: number
  
  // Activity metrics
  activeTeachers: number (logged in today)
  activeStudents: number
  totalLessons: number
  totalQuizzes: number
  totalAssignments: number
  
  // Engagement metrics
  averageStudentXP: number
  averageStudentLevel: number
  averageClassAttendance: number
  
  // Content metrics
  totalVideos: number
  totalExercises: number
  totalAchievementsUnlocked: number
  
  // Performance metrics
  topPerformingClass: ObjectId (ref: Class)
  topPerformingTeacher: ObjectId (ref: User)
  topPerformingStudent: ObjectId (ref: User)
  
  createdAt: Date
  updatedAt: Date
}
```

---

## PHASE 2: AUTHENTICATION & REGISTRATION FLOWS

### 2.1 School Owner Registration
**File:** `server/src/controllers/schoolOwnerController.ts`

**Endpoints:**
```typescript
POST /api/school-owner/register
Body: {
  // Owner info
  name: string
  email: string
  password: string
  phone: string
  
  // School info
  schoolName: string
  schoolAddress: string
  city: string
  province: string
  schoolPhone: string
  schoolEmail: string
  totalClasses: number
  academicYear: string
}

Response: {
  success: true
  message: "School created successfully"
  school: {
    schoolId: "SCH-12345"
    schoolName: "SMA Negeri 1 Jakarta"
    ownerEmail: "owner@example.com"
  }
  user: {
    id: "..."
    name: "..."
    email: "..."
    role: "school_owner"
  }
  token: "JWT_TOKEN"
}
```

**Logic:**
1. Validate school email unique
2. Hash password
3. Generate unique schoolId (SCH-XXXXX)
4. Create School document
5. Create User with role='school_owner' and link to School
6. Generate JWT token
7. Return school details + token

---

### 2.2 Teacher Registration
**File:** `server/src/controllers/teacherController.ts` (enhance existing)

**Endpoints:**
```typescript
POST /api/teacher/register
Body: {
  // Personal info
  name: string
  email: string
  password: string
  phone: string
  
  // School info
  schoolId: string (required - dari school owner)
  employeeId: string (NIP/NIK)
  
  // Professional info
  subjects: string[] (["Matematika", "Fisika"])
  qualification: string ("S1 Pendidikan Matematika")
  yearsOfExperience: number
  specialization: string
}

Response: {
  success: true
  message: "Teacher registered successfully"
  user: {
    id: "..."
    name: "..."
    email: "..."
    role: "teacher"
    schoolId: "SCH-12345"
    schoolName: "SMA Negeri 1 Jakarta"
  }
  token: "JWT_TOKEN"
}
```

**Logic:**
1. Validate schoolId exists
2. Validate email unique within school
3. Hash password
4. Create User with role='teacher'
5. Link to School
6. Create teacherProfile
7. Update School.totalTeachers count
8. Generate JWT token

---

### 2.3 Student Registration
**File:** `server/src/controllers/studentController.ts` (enhance existing)

**Endpoints:**
```typescript
POST /api/student/register
Body: {
  // Personal info
  name: string
  email: string
  password: string
  phone: string
  
  // Class info
  classId: string (required - dari teacher)
  rollNumber: number (nomor absen)
  
  // Student info
  studentId: string (NIS/NISN)
  parentName: string
  parentPhone: string
  parentEmail: string
}

Response: {
  success: true
  message: "Student registered successfully"
  user: {
    id: "..."
    name: "..."
    email: "..."
    role: "student"
    schoolId: "SCH-12345"
    schoolName: "SMA Negeri 1 Jakarta"
    classId: "CLS-67890"
    className: "XII IPA 1"
    rollNumber: 15
  }
  token: "JWT_TOKEN"
}
```

**Logic:**
1. Validate classId exists
2. Validate rollNumber not taken in class
3. Validate email unique within school
4. Hash password
5. Create User with role='student'
6. Link to School & Class
7. Create/enhance StudentProfile with gamification fields
8. Update Class.currentStudents count
9. Update School.totalStudents count
10. Generate JWT token

---

## PHASE 3: CLASS MANAGEMENT

### 3.1 Create Class Management Service
**File:** `server/src/services/classService.ts`

**Functions:**
```typescript
// School Owner functions
createClass(schoolId, classData)
updateClass(classId, updates)
deleteClass(classId)
getAllClasses(schoolId)
getClassById(classId)

// Teacher assignment
assignHomeRoomTeacher(classId, teacherId)
addSubjectTeacher(classId, teacherId, subject)
removeSubjectTeacher(classId, teacherId, subject)

// Student management
getClassStudents(classId)
getStudentsByRollNumber(classId)
updateStudentRollNumber(studentId, newRollNumber)

// Analytics
getClassAnalytics(classId, dateRange)
getClassPerformance(classId)
```

---

### 3.2 Class Management Controller
**File:** `server/src/controllers/classController.ts`

**Endpoints:**
```typescript
// School Owner endpoints
POST   /api/classes                    - Create class
GET    /api/classes/school/:schoolId   - Get all classes in school
GET    /api/classes/:classId           - Get class details
PUT    /api/classes/:classId           - Update class
DELETE /api/classes/:classId           - Delete class

// Teacher assignment
POST   /api/classes/:classId/homeroom-teacher   - Assign homeroom teacher
POST   /api/classes/:classId/subject-teachers   - Add subject teacher
DELETE /api/classes/:classId/subject-teachers/:teacherId - Remove teacher

// Student management
GET    /api/classes/:classId/students           - Get all students
GET    /api/classes/:classId/students/roll-order - Get students by roll number
PUT    /api/classes/:classId/students/:studentId/roll-number - Update roll number

// Analytics
GET    /api/classes/:classId/analytics          - Class analytics
GET    /api/classes/:classId/performance        - Class performance
```

---

## PHASE 4: SCHOOL OWNER DASHBOARD

### 4.1 School Analytics Service
**File:** `server/src/services/schoolAnalyticsService.ts`

**Functions:**
```typescript
getSchoolOverview(schoolId)
  - Total teachers, students, classes
  - Active users today
  - Recent activities

getTeacherAnalytics(schoolId, dateRange?)
  - All teachers with activity metrics
  - Top performing teachers
  - Teacher engagement scores

getClassAnalytics(schoolId, dateRange?)
  - All classes with performance metrics
  - Top performing classes
  - Class comparison

getStudentAnalytics(schoolId, dateRange?)
  - Student performance overview
  - Top students
  - At-risk students (low engagement)

getActivityTimeline(schoolId, limit?)
  - Recent activities across school
  - Lessons created, quizzes taken, etc.

generateSchoolReport(schoolId, reportType, dateRange)
  - PDF/Excel report generation
  - Weekly/Monthly/Semester reports
```

---

### 4.2 School Dashboard Controller
**File:** `server/src/controllers/schoolDashboardController.ts`

**Endpoints:**
```typescript
GET /api/school-dashboard/overview/:schoolId
  - Overall school metrics
  - Charts: students over time, activity trends

GET /api/school-dashboard/teachers/:schoolId
  - List of all teachers with metrics
  - Filters: active/inactive, subject, class

GET /api/school-dashboard/classes/:schoolId
  - List of all classes with metrics
  - Filters: grade, section

GET /api/school-dashboard/students/:schoolId
  - Student overview with performance
  - Filters: class, performance level

GET /api/school-dashboard/activity/:schoolId
  - Recent activity feed
  - Filters: date range, activity type

GET /api/school-dashboard/reports/:schoolId
  - Generate reports
  - Query params: type, startDate, endDate
```

---

## PHASE 5: TEACHER DASHBOARD ENHANCEMENTS

### 5.1 Teacher Analytics Service
**File:** `server/src/services/teacherAnalyticsService.ts`

**Functions:**
```typescript
getTeacherOverview(teacherId)
  - Classes taught
  - Total students
  - Recent activity

getMyClasses(teacherId)
  - List of assigned classes
  - Student count per class
  - Performance metrics

getMyStudents(teacherId, classId?)
  - All students (across classes or specific class)
  - Performance, engagement, attendance

trackTeacherActivity(teacherId, activityType, metadata)
  - Log teacher actions (lesson created, quiz graded, etc.)
  - Auto-update TeacherAnalytics

getTeacherPerformanceReport(teacherId, dateRange)
  - Personal performance metrics
  - Comparison with school average
```

---

### 5.2 Teacher Dashboard Controller
**File:** `server/src/controllers/teacherDashboardController.ts`

**Endpoints:**
```typescript
GET /api/teacher-dashboard/overview
  - Teacher's overview (authenticated)

GET /api/teacher-dashboard/classes
  - My classes with metrics

GET /api/teacher-dashboard/students
  - My students across all classes
  - Query params: classId (filter)

GET /api/teacher-dashboard/analytics
  - My teaching analytics
  - Query params: dateRange

POST /api/teacher-dashboard/activity
  - Log activity manually (if needed)
```

---

## PHASE 6: STUDENT DASHBOARD ENHANCEMENTS

### 6.1 Student Class Integration
**File:** `server/src/services/studentClassService.ts`

**Functions:**
```typescript
getMyClass(studentId)
  - Class info, homeroom teacher, subject teachers
  - Classmates list

getClassLeaderboard(classId)
  - Top students by XP in class
  - Weekly/Monthly/All-time

getClassAchievements(classId)
  - Recent achievements in class
  - Class achievement stats

getMyTeachers(studentId)
  - All teachers for my class
  - Subject mapping
```

---

### 6.2 Student Dashboard Controller
**File:** `server/src/controllers/studentDashboardController.ts` (enhance existing)

**Add endpoints:**
```typescript
GET /api/student-dashboard/class
  - My class info

GET /api/student-dashboard/classmates
  - List of classmates

GET /api/student-dashboard/leaderboard
  - Class leaderboard

GET /api/student-dashboard/teachers
  - My teachers
```

---

## PHASE 7: FRONTEND UPDATES

### 7.1 Registration Pages

**Create new pages:**
- `src/pages/SchoolOwnerRegister.tsx`
- `src/pages/TeacherRegister.tsx` (enhance existing)
- `src/pages/StudentRegister.tsx` (enhance existing)

**Forms:**
- Multi-step registration forms
- School ID / Class ID input validation
- Real-time validation
- Success redirection

---

### 7.2 School Owner Dashboard

**Create:**
- `src/pages/SchoolOwnerDashboard.tsx`
- `src/components/SchoolOverviewCards.tsx`
- `src/components/TeacherListTable.tsx`
- `src/components/ClassListTable.tsx`
- `src/components/StudentAnalyticsChart.tsx`
- `src/components/ActivityTimeline.tsx`

**Features:**
- Overview cards (total teachers, students, classes)
- Teacher management (view, edit, deactivate)
- Class management (create, edit, assign teachers)
- Analytics charts (performance over time)
- Activity feed (real-time updates)
- Report generation (download PDF/Excel)

---

### 7.3 Teacher Dashboard Enhancements

**Update:**
- `src/pages/TeacherDashboard.tsx`

**Add components:**
- `src/components/MyClassesGrid.tsx`
- `src/components/MyStudentsList.tsx`
- `src/components/TeacherAnalyticsChart.tsx`
- `src/components/ClassPerformanceCard.tsx`

**Features:**
- My classes overview
- Student list per class
- Performance tracking
- Activity logging

---

### 7.4 Student Dashboard Enhancements

**Update:**
- `src/pages/StudentDashboard.tsx`

**Add components:**
- `src/components/MyClassCard.tsx`
- `src/components/ClassmatesList.tsx`
- `src/components/ClassLeaderboard.tsx`
- `src/components/MyTeachersCard.tsx`

**Features:**
- Class info display
- Classmates list
- Class leaderboard
- Teachers list with subjects

---

## PHASE 8: API CLIENT & INTEGRATION

### 8.1 Update API Client
**File:** `src/lib/apiClient.ts`

**Add namespaces:**
```typescript
export const schoolApi = {
  register(data) - POST /api/school-owner/register
  getSchool(schoolId) - GET /api/schools/:schoolId
  updateSchool(schoolId, data) - PUT /api/schools/:schoolId
  getClasses(schoolId) - GET /api/classes/school/:schoolId
}

export const classApi = {
  create(data) - POST /api/classes
  getClass(classId) - GET /api/classes/:classId
  updateClass(classId, data) - PUT /api/classes/:classId
  getStudents(classId) - GET /api/classes/:classId/students
  assignTeacher(classId, data) - POST /api/classes/:classId/homeroom-teacher
}

export const schoolDashboardApi = {
  getOverview(schoolId) - GET /api/school-dashboard/overview/:schoolId
  getTeachers(schoolId) - GET /api/school-dashboard/teachers/:schoolId
  getClasses(schoolId) - GET /api/school-dashboard/classes/:schoolId
  getActivity(schoolId) - GET /api/school-dashboard/activity/:schoolId
}

export const teacherDashboardApi = {
  getOverview() - GET /api/teacher-dashboard/overview
  getMyClasses() - GET /api/teacher-dashboard/classes
  getMyStudents(classId?) - GET /api/teacher-dashboard/students
  getAnalytics(dateRange) - GET /api/teacher-dashboard/analytics
}
```

---

## PHASE 9: SEED DATA & TESTING

### 9.1 Create Seed Scripts

**Files:**
```
server/src/scripts/seedSchools.ts - Create 3 sample schools
server/src/scripts/seedClasses.ts - Create 5 classes per school
server/src/scripts/seedTeachers.ts - Create 10 teachers per school
server/src/scripts/seedStudents.ts - Create 30 students per class
server/src/scripts/seedSchoolEcosystem.ts - Run all seeds in order
```

---

### 9.2 Create Test Accounts

**Sample accounts:**
```
School Owner:
- Email: owner@smanegeri1.sch.id
- Password: owner123
- School: SMA Negeri 1 Jakarta (SCH-00001)

Teacher:
- Email: guru.matematika@smanegeri1.sch.id
- Password: teacher123
- School: SCH-00001
- Classes: XII IPA 1, XII IPA 2

Student:
- Email: siswa.001@smanegeri1.sch.id
- Password: student123
- School: SCH-00001
- Class: XII IPA 1 (CLS-00001)
- Roll Number: 1
```

---

### 9.3 Testing Checklist

**Manual tests:**
- [ ] School owner can register and create school
- [ ] School owner can create classes
- [ ] Teacher can register with school ID
- [ ] School owner can assign teacher to class
- [ ] Student can register with class ID
- [ ] Student sees correct class info
- [ ] School owner dashboard shows all metrics
- [ ] Teacher dashboard shows assigned classes
- [ ] Class leaderboard works
- [ ] Analytics update in real-time

---

## PHASE 10: MIGRATION & DATA INTEGRITY

### 10.1 Migrate Existing Users

**Script:** `server/src/scripts/migrateExistingUsers.ts`

**Logic:**
- Find all existing users without schoolId
- Create a default "Independent" school
- Assign all existing users to that school
- Create default class "General Class"
- Maintain all existing gamification data

---

### 10.2 Data Validation

**Add validation middleware:**
- School ID must exist before teacher registration
- Class ID must exist before student registration
- Roll number unique per class
- Email unique per school (not globally)
- School owner can only manage their school

---

## IMPLEMENTATION CHECKLIST

### Backend (Priority 1)
- [ ] 1.1 Create School Model
- [ ] 1.2 Create Class Model
- [ ] 1.3 Update User Model
- [ ] 1.4 Create TeacherAnalytics Model
- [ ] 1.5 Create SchoolAnalytics Model
- [ ] 2.1 School Owner Registration
- [ ] 2.2 Teacher Registration (enhanced)
- [ ] 2.3 Student Registration (enhanced)
- [ ] 3.1 Class Management Service
- [ ] 3.2 Class Management Controller
- [ ] 4.1 School Analytics Service
- [ ] 4.2 School Dashboard Controller
- [ ] 5.1 Teacher Analytics Service
- [ ] 5.2 Teacher Dashboard Controller
- [ ] 6.1 Student Class Integration Service
- [ ] 6.2 Student Dashboard Controller (enhanced)

### Frontend (Priority 2)
- [ ] 7.1 Registration Pages (3 new pages)
- [ ] 7.2 School Owner Dashboard (new)
- [ ] 7.3 Teacher Dashboard (enhanced)
- [ ] 7.4 Student Dashboard (enhanced)
- [ ] 8.1 API Client Updates

### Testing & Deployment (Priority 3)
- [ ] 9.1 Seed Scripts (5 scripts)
- [ ] 9.2 Test Accounts (3 roles)
- [ ] 9.3 Testing Checklist (manual tests)
- [ ] 10.1 Migration Script
- [ ] 10.2 Data Validation

---

## ESTIMATED TIMELINE

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | Models (5 files) | 3-4 hours |
| Phase 2 | Registration (3 controllers) | 3-4 hours |
| Phase 3 | Class Management | 2-3 hours |
| Phase 4 | School Dashboard Backend | 3-4 hours |
| Phase 5 | Teacher Dashboard Backend | 2-3 hours |
| Phase 6 | Student Dashboard Backend | 2 hours |
| Phase 7 | Frontend Pages | 6-8 hours |
| Phase 8 | API Integration | 2-3 hours |
| Phase 9 | Testing & Seeds | 2-3 hours |
| Phase 10 | Migration | 1-2 hours |
| **TOTAL** | **40 tasks** | **26-36 hours** |

---

## BENEFITS OF THIS SYSTEM

### For School Owners:
✅ Complete visibility of all teachers & students
✅ Real-time analytics and performance tracking
✅ Easy class and teacher management
✅ Automated reporting
✅ Data-driven decision making

### For Teachers:
✅ Organized class management
✅ Student performance tracking
✅ Analytics on teaching effectiveness
✅ Easy content sharing within school

### For Students:
✅ Clear class structure
✅ See classmates and teachers
✅ Compete with classmates (leaderboard)
✅ Track progress within school context

### For System:
✅ Multi-tenant architecture (scalable)
✅ Data isolation per school
✅ Role-based access control
✅ Analytics at every level
✅ Future-ready (can add paid plans)

---

## NEXT STEPS

1. **Review this TODO** - Pastikan semua requirement tercakup
2. **Prioritize phases** - Mulai dari Phase 1 (Models)
3. **Start implementation** - Kerjakan step-by-step
4. **Test incrementally** - Test setiap phase sebelum lanjut
5. **Document as you go** - Update docs dengan perubahan

---

**Status:** Ready to implement! 🚀  
**Complexity:** High (Multi-tenant system)  
**Impact:** Major feature update  
**Start with:** Phase 1 - Database Models

