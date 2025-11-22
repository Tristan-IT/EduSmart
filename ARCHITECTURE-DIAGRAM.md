# 🏗️ MULTI-TENANT SCHOOL SYSTEM ARCHITECTURE

## 📐 SYSTEM HIERARCHY

```
┌─────────────────────────────────────────────────────────────────┐
│                     SCHOOL OWNER / ADMIN                        │
│  (Kepala Sekolah / Administrator)                               │
│  - Create & manage school                                       │
│  - View all analytics                                           │
│  - Manage classes & teachers                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          SCHOOL                                  │
│  School ID: SCH-12345                                           │
│  Name: SMA Negeri 1 Jakarta                                     │
│  Total Classes: 15                                              │
│  Total Teachers: 45                                             │
│  Total Students: 600                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│         CLASSES           │   │        TEACHERS           │
│  CLS-00001: XII IPA 1     │   │  Guru Matematika          │
│  CLS-00002: XII IPA 2     │   │  Guru Fisika              │
│  CLS-00003: XII IPS 1     │   │  Guru Kimia               │
│  ...                      │   │  ...                      │
└───────────────────────────┘   └───────────────────────────┘
                │                           │
                │           ┌───────────────┘
                │           │
                ▼           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        STUDENTS                                  │
│  Student 1 (Roll #1) → Class: XII IPA 1                         │
│  Student 2 (Roll #2) → Class: XII IPA 1                         │
│  Student 3 (Roll #3) → Class: XII IPA 2                         │
│  ...                                                             │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 REGISTRATION FLOW

### 1. School Owner Registration
```
Owner Register
    ↓
Fill School Info:
- School Name
- Address
- Total Classes
    ↓
System Generates:
- School ID (SCH-XXXXX)
- Owner Account
    ↓
Owner Dashboard Access
```

### 2. Teacher Registration
```
Teacher Register
    ↓
Enter School ID (from owner)
    ↓
Fill Teacher Info:
- Name, Email, Password
- Employee ID (NIP)
- Subjects taught
    ↓
System Validates School ID
    ↓
Teacher Account Created
    ↓
Linked to School
    ↓
Waiting for Class Assignment
```

### 3. Student Registration
```
Student Register
    ↓
Enter Class ID (from teacher)
    ↓
Fill Student Info:
- Name, Email, Password
- Student ID (NIS/NISN)
- Roll Number (1-40)
- Parent Contact
    ↓
System Validates:
- Class ID exists
- Roll number not taken
    ↓
Student Account Created
    ↓
Linked to School & Class
    ↓
Access Student Dashboard
```

## 📊 DATA FLOW

```
School Owner Creates School
    │
    ├──→ School Owner Creates Classes
    │         │
    │         └──→ System Generates Class IDs
    │
    ├──→ Teachers Register with School ID
    │         │
    │         └──→ School Owner Assigns Teachers to Classes
    │
    └──→ Students Register with Class ID
              │
              └──→ Automatically Linked to School & Class
```

## 🎯 DASHBOARD VIEWS

### School Owner Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  📊 SCHOOL OVERVIEW                                     │
├─────────────────────────────────────────────────────────┤
│  👥 45 Teachers    👨‍🎓 600 Students    🏫 15 Classes     │
│  📈 85% Active     ⭐ 450 Avg XP      🏆 120 Achievements│
├─────────────────────────────────────────────────────────┤
│  📋 TEACHERS LIST                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Name          │ Subject     │ Classes │ Active  │   │
│  │ Pak Budi      │ Matematika  │ 3       │ ✅      │   │
│  │ Bu Siti       │ Fisika      │ 2       │ ✅      │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  🏫 CLASSES LIST                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Class     │ Students │ Avg XP │ Homeroom        │   │
│  │ XII IPA 1 │ 40       │ 520    │ Pak Budi        │   │
│  │ XII IPA 2 │ 38       │ 485    │ Bu Siti         │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  📈 ANALYTICS CHARTS                                    │
│  - Student Performance Trend                            │
│  - Teacher Activity Heatmap                             │
│  - Class Comparison                                     │
└─────────────────────────────────────────────────────────┘
```

### Teacher Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  👨‍🏫 MY CLASSES                                          │
├─────────────────────────────────────────────────────────┤
│  📚 XII IPA 1 (40 students) - Homeroom                  │
│  📚 XII IPA 2 (38 students) - Matematika                │
│  📚 XI IPA 1  (35 students) - Matematika                │
├─────────────────────────────────────────────────────────┤
│  👨‍🎓 MY STUDENTS (XII IPA 1)                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ #  │ Name         │ XP  │ Level │ Attendance   │   │
│  │ 1  │ Ahmad        │ 520 │ 5     │ 95%          │   │
│  │ 2  │ Budi         │ 485 │ 5     │ 90%          │   │
│  │ 3  │ Citra        │ 610 │ 6     │ 98%          │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  📊 MY ANALYTICS                                        │
│  - Lessons Created: 15                                  │
│  - Quizzes Graded: 45                                   │
│  - Avg Student Performance: 82%                         │
└─────────────────────────────────────────────────────────┘
```

### Student Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  🎓 MY CLASS: XII IPA 1                                 │
│  🏫 SMA Negeri 1 Jakarta                                │
│  📝 Roll Number: 15                                     │
├─────────────────────────────────────────────────────────┤
│  👨‍🏫 MY TEACHERS                                         │
│  - Homeroom: Pak Budi (Matematika)                      │
│  - Fisika: Bu Siti                                      │
│  - Kimia: Pak Andi                                      │
├─────────────────────────────────────────────────────────┤
│  🏆 CLASS LEADERBOARD                                   │
│  1. Citra     - 610 XP                                  │
│  2. Ahmad     - 520 XP                                  │
│  3. Budi      - 485 XP                                  │
│  ...                                                     │
│  15. You      - 450 XP ← Your rank                      │
├─────────────────────────────────────────────────────────┤
│  👥 MY CLASSMATES (40 students)                         │
│  [Grid of avatars with names]                           │
└─────────────────────────────────────────────────────────┘
```

## 🔐 ACCESS CONTROL

```
School Owner:
  ✅ View all teachers in school
  ✅ View all students in school
  ✅ View all classes in school
  ✅ Create/Edit/Delete classes
  ✅ Assign teachers to classes
  ✅ View all analytics
  ❌ Cannot access other schools

Teacher:
  ✅ View assigned classes only
  ✅ View students in assigned classes
  ✅ Create lessons for assigned classes
  ✅ Grade quizzes for assigned classes
  ✅ View own analytics
  ❌ Cannot access other classes
  ❌ Cannot access school-wide data

Student:
  ✅ View own class only
  ✅ View classmates in same class
  ✅ View own teachers
  ✅ Access learning materials
  ✅ Take quizzes
  ❌ Cannot access other classes
  ❌ Cannot view other students' details
```

## 💾 DATABASE RELATIONSHIPS

```
User
├─ role: "school_owner" | "teacher" | "student"
├─ school: ObjectId → School
├─ schoolId: string
└─ teacherProfile / studentProfile

School
├─ schoolId: "SCH-XXXXX"
├─ owner: ObjectId → User
└─ Classes: [ObjectId] → Class

Class
├─ classId: "CLS-XXXXX"
├─ school: ObjectId → School
├─ homeRoomTeacher: ObjectId → User
├─ subjectTeachers: [{teacher, subject}]
└─ students: [ObjectId] → User

TeacherAnalytics
├─ teacher: ObjectId → User
├─ school: ObjectId → School
├─ class: ObjectId → Class
└─ daily metrics

SchoolAnalytics
├─ school: ObjectId → School
└─ aggregated metrics
```

## 🚀 IMPLEMENTATION PRIORITY

### Week 1: Backend Foundation
- ✅ Create all 5 models
- ✅ Implement registration flows
- ✅ Create class management APIs

### Week 2: Analytics & Dashboards
- ✅ School analytics service
- ✅ Teacher analytics service
- ✅ Dashboard controllers

### Week 3: Frontend
- ✅ Registration pages
- ✅ School owner dashboard
- ✅ Enhanced teacher/student dashboards

### Week 4: Testing & Polish
- ✅ Seed data
- ✅ End-to-end testing
- ✅ Bug fixes & optimization

---

**System Name:** SMART SCHOOL - Multi-Tenant Learning Management System  
**Architecture:** Multi-Tenant with Data Isolation  
**Scalability:** Supports unlimited schools, classes, and users  
**Security:** Role-based access control at every level  

