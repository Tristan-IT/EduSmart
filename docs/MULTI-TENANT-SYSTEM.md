# Multi-Tenant School Management System

## 🎯 Overview

This is a comprehensive multi-tenant school management system built on top of the existing Adapti learning platform. The system supports hierarchical organization: **Schools → Classes → Teachers → Students**.

## 📊 System Architecture

### Multi-Tenant Hierarchy

```
School Owner (SCH-XXXXX)
    └── School
        ├── Classes (CLS-XXXXX)
        │   ├── Homeroom Teacher
        │   ├── Subject Teachers
        │   └── Students
        ├── Teachers
        └── Students
```

### Key Features

- ✅ **Auto-Generated IDs**: Schools get `SCH-XXXXX`, Classes get `CLS-XXXXX`
- ✅ **Multi-Role Support**: School Owner, Teacher, Student
- ✅ **Data Isolation**: Users can only access data from their own school/class
- ✅ **Complete CRUD**: Create, Read, Update, Delete for all entities
- ✅ **Analytics Dashboards**: Separate dashboards for each role
- ✅ **Validation Middleware**: Prevents cross-school/class data access

## 🗄️ Database Models

### 1. School Model
```typescript
{
  schoolId: string;        // Auto: SCH-00001
  schoolName: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  owner: ObjectId;         // School owner user
  ownerName: string;
  ownerEmail: string;
  totalClasses: number;
  totalTeachers: number;
  totalStudents: number;
  academicYear: string;
  isActive: boolean;
}
```

### 2. Class Model
```typescript
{
  classId: string;                // Auto: CLS-00001
  className: string;              // e.g., "10 IPA 1"
  grade: number;                  // e.g., 10
  section: string;                // e.g., "IPA 1"
  school: ObjectId;
  schoolId: string;
  schoolName: string;
  academicYear: string;
  maxStudents: number;
  currentStudents: number;
  homeRoomTeacher: ObjectId;
  homeRoomTeacherName: string;
  subjectTeachers: [
    {
      teacher: ObjectId;
      teacherName: string;
      subject: string;
    }
  ];
  isActive: boolean;
}
```

### 3. Enhanced User Model
```typescript
{
  // Existing fields...
  role: "school_owner" | "teacher" | "student" | "admin";
  schoolId: ObjectId;              // School reference
  classId: ObjectId;               // For students only
  
  // Teacher-specific
  teacherProfile: {
    employeeId: string;
    subjects: string[];
    qualification: string;
  };
  
  // Student-specific
  studentProfile: {
    rollNumber: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
  };
}
```

## 🔌 API Endpoints

### School Owner Registration
```
POST /api/school-owner/register
Body: {
  owner: { name, email, password },
  school: { schoolName, address, city, province, phone, totalClasses }
}
Response: { success, data: { user, token, schoolId } }
```

### Teacher Registration
```
POST /api/teacher-registration/register
Body: {
  name, email, password, schoolId,
  teacherProfile: { employeeId, subjects[], qualification }
}
```

### Student Registration
```
POST /api/student-registration/register
Body: {
  name, email, password, classId,
  studentProfile: { rollNumber, parentName, parentPhone, parentEmail }
}
```

### Class Management (9 endpoints)
```
POST   /api/class/create                    # Create new class
GET    /api/class/my-classes                # Get user's classes
GET    /api/class/:classId                  # Get class details
PUT    /api/class/:classId                  # Update class
DELETE /api/class/:classId                  # Delete class
POST   /api/class/:classId/assign-teacher   # Assign teacher
DELETE /api/class/:classId/remove-teacher   # Remove teacher
POST   /api/class/:classId/enroll-student   # Enroll student
DELETE /api/class/:classId/remove-student   # Remove student
```

### School Dashboard (6 endpoints)
```
GET /api/school-dashboard/overview         # Total teachers/students/classes
GET /api/school-dashboard/teachers         # Teacher statistics
GET /api/school-dashboard/classes          # Class overview
GET /api/school-dashboard/top-performers   # Top 10 students
GET /api/school-dashboard/activity-logs    # Activity timeline
GET /api/school-dashboard/analytics        # Complete analytics
```

### Teacher Dashboard (7 endpoints)
```
GET /api/teacher-dashboard/my-classes           # Classes teacher teaches
GET /api/teacher-dashboard/my-students          # All students across classes
GET /api/teacher-dashboard/class-students/:id   # Students in specific class
GET /api/teacher-dashboard/analytics            # Personal analytics
GET /api/teacher-dashboard/class-analytics/:id  # Class analytics
GET /api/teacher-dashboard/activity-logs        # Teaching activity
GET /api/teacher-dashboard/student-progress/:id # Individual student progress
```

### Student Class Features (6 endpoints)
```
GET /api/student-class/my-class            # Current class info
GET /api/student-class/classmates          # Other students in class
GET /api/student-class/class-leaderboard   # Class ranking
GET /api/student-class/school-rank         # School-wide ranking
GET /api/student-class/recent-activity     # Learning activity
GET /api/student-class/class-progress      # Progress comparison
```

## 🎨 Frontend Pages

### Registration Pages
1. **SchoolOwnerRegistration.tsx** - School owner + school info
2. **TeacherRegistration.tsx** - Teacher registration with School ID
3. **StudentRegistration.tsx** - Student registration with Class ID

### Dashboard Pages
1. **SchoolOwnerDashboard.tsx** - School analytics & management
2. **EnhancedTeacherDashboard.tsx** - Class & student management
3. **EnhancedStudentDashboard.tsx** - Class info & rankings

## 🔒 Security & Validation

### Middleware Protection
```typescript
// Prevent cross-school access
validateSchoolAccess()

// Prevent cross-class access
validateClassAccess()

// Role-based access
requireSchoolOwner()
requireTeacher()

// Student data protection
validateStudentDataAccess()

// Auto-filter by school
filterBySchool()
```

### Usage Example
```typescript
// Protect school dashboard routes
router.get(
  "/overview",
  authenticate,
  requireSchoolOwner,
  validateSchoolAccess,
  schoolDashboardController.getOverview
);

// Protect class routes
router.get(
  "/class/:classId",
  authenticate,
  validateClassAccess,
  classController.getClassById
);
```

## 🚀 Getting Started

### 1. Seed Test Data
```bash
cd server
npx tsx src/scripts/seedMultiTenant.ts
```

This creates:
- 1 School (SCH-XXXXX)
- 1 Class (CLS-XXXXX)
- 1 School Owner
- 1 Teacher
- 5 Students

### 2. Test Credentials
After seeding, you'll see:

```
🔑 TEST ACCOUNTS

1. SCHOOL OWNER
   Email    : owner@smanjkt.sch.id
   Password : owner123
   School ID: SCH-24454

2. TEACHER
   Email    : budi.math@smanjkt.sch.id
   Password : teacher123
   School ID: SCH-24454

3. STUDENT
   Email    : student1.10a@smanjkt.sch.id
   Password : student123
   School ID: SCH-24454
   Class ID : CLS-04173
```

### 3. Quick Test Accounts
For quick testing:
```bash
npx tsx src/scripts/createMultiTenantTestAccounts.ts
```

This creates simple test accounts:
- owner@test.com
- teacher@test.com
- student@test.com

## 📱 Frontend Integration

### API Client Usage
```typescript
import { 
  registrationApi, 
  schoolDashboardApi, 
  teacherDashboardApi,
  studentClassApi,
  classApi 
} from "@/lib/apiClient";

// Register school owner
const result = await registrationApi.registerSchoolOwner({
  owner: { name, email, password },
  school: { schoolName, address, city, province, phone }
});

// Get school dashboard
const overview = await schoolDashboardApi.getOverview();
const teachers = await schoolDashboardApi.getTeacherStats();

// Teacher gets their classes
const myClasses = await teacherDashboardApi.getMyClasses();
const myStudents = await teacherDashboardApi.getMyStudents();

// Student gets class info
const myClass = await studentClassApi.getMyClass();
const leaderboard = await studentClassApi.getClassLeaderboard();
```

## 🏗️ Development Phases

### ✅ Phase 1-2: Backend Foundation
- [x] Database models (School, Class, User enhancements)
- [x] Registration endpoints (Owner, Teacher, Student)
- [x] Auto-ID generation (SCH-XXXXX, CLS-XXXXX)

### ✅ Phase 3: Class Management
- [x] CRUD operations for classes
- [x] Teacher assignment/removal
- [x] Student enrollment/removal

### ✅ Phase 4: School Dashboard Backend
- [x] School analytics service
- [x] Teacher statistics
- [x] Class overview
- [x] Top performers

### ✅ Phase 5: Teacher Dashboard Backend
- [x] Teacher analytics service
- [x] My classes & students
- [x] Activity tracking

### ✅ Phase 6: Student Class Features
- [x] Class information
- [x] Classmates list
- [x] Class leaderboard
- [x] School ranking

### ✅ Phase 7: Frontend Pages
- [x] Registration pages (Owner, Teacher, Student)
- [x] Dashboard pages (Owner, Teacher, Student)
- [x] shadcn/ui components

### ✅ Phase 8: API Client Integration
- [x] TypeScript interfaces
- [x] API namespaces (6 total)
- [x] 33+ API methods

### ✅ Phase 9: Seed Data & Test Accounts
- [x] seedMultiTenant.ts
- [x] createMultiTenantTestAccounts.ts
- [x] Printed credentials

### ✅ Phase 10: Validation & Security
- [x] Multi-tenant validation middleware
- [x] Cross-school access prevention
- [x] Cross-class access prevention
- [x] Role-based access control

## 📈 Statistics

### Backend
- **Models**: 3 (School, Class, User enhanced)
- **Services**: 4 (class, schoolAnalytics, teacherAnalytics, studentClass)
- **Controllers**: 9
- **Routes**: 7 route files
- **Endpoints**: 34+ REST API endpoints
- **Middleware**: 6 validation functions
- **Total Files**: 40+ backend files

### Frontend
- **Pages**: 6 (3 registration + 3 dashboards)
- **API Client**: 6 namespaces, 33+ methods
- **Lines of Code**: ~3,000 lines
- **Components Used**: Card, Table, Badge, Dialog, Alert, Select, Progress, Input, Button

## 🔧 Configuration

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/adapti-portal
JWT_SECRET=your-secret-key
PORT=5000
```

### TypeScript Config
Already configured for ES modules with proper path aliases.

## 🧪 Testing

### Manual Testing Flow
1. **Register School Owner** → Get School ID
2. **Register Teacher** → Use School ID
3. **Create Classes** → Get Class IDs
4. **Assign Teachers** → To classes
5. **Register Students** → Use Class IDs
6. **Test Dashboards** → Verify data isolation

### API Testing
```bash
# Login as school owner
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@smanjkt.sch.id","password":"owner123"}'

# Get school dashboard (with token)
curl http://localhost:5000/api/school-dashboard/overview \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 Notes

- **Email Uniqueness**: Email is unique per school, not globally
- **Roll Numbers**: Unique per class, not school-wide
- **Auto-IDs**: Generated using padded random numbers (SCH-00001 format)
- **Soft Delete**: Classes can be deactivated with `isActive: false`
- **Academic Year**: Tracked per class and school

## 🤝 Integration with Existing Features

This multi-tenant system integrates seamlessly with:
- ✅ Gamification (XP, Levels, Achievements)
- ✅ Skill Tree
- ✅ Leagues & Leaderboards
- ✅ AI Chat (Mentor & Student)
- ✅ Quiz System
- ✅ Learning Modules

Students maintain their gamification progress while being part of a school/class structure.

## 🚀 Next Steps (Optional Enhancements)

1. **Migration Tool**: Migrate existing users to multi-tenant
2. **Bulk Import**: CSV import for teachers/students
3. **Timetable Management**: Class schedules
4. **Attendance Tracking**: Student attendance
5. **Grade Management**: Exam scores and report cards
6. **Parent Portal**: Parent accounts and access
7. **Communication**: In-app messaging
8. **Reports**: PDF export for analytics

## 💡 Tips

- Always use the generated IDs (SCH-XXXXX, CLS-XXXXX) for sharing
- School owners should create classes before inviting teachers
- Teachers must be assigned to classes before students can see them
- Use validation middleware on all protected routes
- Test with multiple schools to verify data isolation

---

**Built with ❤️ using Express, TypeScript, MongoDB, React, and shadcn/ui**
