# Content Management System - Documentation

## 📚 Overview

Sistem manajemen konten yang komprehensif untuk platform pembelajaran gamified, memungkinkan guru untuk:
- Browse dan clone template quiz/lesson
- Edit dan customize konten untuk sekolah mereka
- Track versi dan rollback perubahan
- Kelola permission berdasarkan subject assignment

## 🗄️ Database Architecture

### Models

#### **Topic Model**
Mengorganisir konten dalam subject menjadi topic-topic pembelajaran.

```typescript
{
  subject: ObjectId,           // Ref to Subject
  school: ObjectId,            // null = template, ObjectId = school-specific
  topicCode: string,           // Unique code (e.g., "ALG-01")
  name: string,                // Display name
  slug: string,                // URL-friendly
  description: string,
  icon: string,                // Emoji or icon name
  color: string,               // Hex color
  order: number,               // Display order
  estimatedMinutes: number,
  difficulty: enum,            // beginner | intermediate | advanced
  learningObjectives: string[],
  prerequisites: ObjectId[],   // Ref to other Topics
  isTemplate: boolean,         // true = platform default
  isActive: boolean,
  metadata: {
    gradeLevel: string,        // SD | SMP | SMA
    tags: string[],
    createdBy: ObjectId
  }
}
```

**Indexes:**
- `subject + school + order` (list topics)
- `subject + isTemplate` (filter templates)
- `slug + subject` (unique lookup)

#### **ContentTemplate Model**
Stores quiz and lesson templates dengan clone functionality.

```typescript
{
  subject: ObjectId,
  topic: ObjectId,
  school: ObjectId,            // null = platform template
  contentType: enum,           // quiz | lesson | assignment | exercise
  title: string,
  description: string,
  content: Mixed,              // Flexible JSON structure
  difficulty: enum,
  estimatedMinutes: number,
  
  // Template System
  isDefault: boolean,          // true = platform default
  clonedFrom: ObjectId,        // Original template ref
  createdBy: ObjectId,
  lastEditedBy: ObjectId,
  
  // Status & Publishing
  status: enum,                // draft | published | archived
  publishedAt: Date,
  
  // Analytics
  usageCount: number,
  averageScore: number,
  averageCompletionTime: number,
  
  // Metadata
  version: number,
  metadata: {
    gradeLevel: string,
    language: string,
    imageUrl: string,
    videoUrl: string,
    attachments: [{
      name: string,
      url: string,
      type: string
    }]
  }
}
```

**Methods:**
- `clone(schoolId, userId)`: Create customizable copy

#### **ContentVersion Model**
Track all versions dengan field-level changes.

```typescript
{
  contentTemplate: ObjectId,
  version: number,
  content: Mixed,              // Snapshot of content
  changes: [{
    field: string,
    oldValue: any,
    newValue: any
  }],
  editedBy: ObjectId,
  reason: string,
  createdAt: Date
}
```

#### **ContentAuditLog Model**
Comprehensive audit trail untuk compliance.

```typescript
{
  action: enum,                // create | update | delete | publish | unpublish | clone | rollback
  contentType: string,         // "ContentTemplate" | "SkillTreeNode" | "QuizQuestion"
  contentId: ObjectId,
  userId: ObjectId,
  userRole: string,
  school: ObjectId,
  changes: [{
    field: string,
    oldValue: any,
    newValue: any
  }],
  metadata: {
    ipAddress: string,
    userAgent: string,
    previousVersion: number,
    newVersion: number
  },
  timestamp: Date
}
```

## 📊 Quiz Templates

### Current Content

**Total: 164 Questions across 10 Subjects**

#### Mathematics (107 questions)
- **Aljabar** (20q): Persamaan linear, kuadrat, eksponen, logaritma
- **Geometri** (12q): Bangun datar, bangun ruang, pythagoras
- **Trigonometri** (20q): Sudut, identitas, grafik, persamaan
- **Kalkulus** (20q): Limit, turunan, integral
- **Statistika** (15q): Mean, median, modus, kuartil, variansi
- **Peluang** (20q): Permutasi, kombinasi, probabilitas

#### Science (35 questions)
- **Fisika** (17q): Mekanika, Termodinamika, Listrik & Magnet
- **Kimia** (6q): Struktur Atom, Ikatan Kimia
- **Biologi** (12q): Biologi Sel, Genetika, Ekologi

#### Languages (12 questions)
- **Bahasa Indonesia** (6q): Teks & Struktur, Kesusastraan
- **Bahasa Inggris** (6q): Grammar, Reading Comprehension

#### Social Studies (10 questions)
- **Sejarah** (4q): Kerajaan, Penjajahan, Kemerdekaan
- **Geografi** (3q): Litosfer, Hidrosfer, Atmosfer
- **Ekonomi** (2q): Konsep Dasar, Permintaan-Penawaran
- **Sosiologi** (2q): Konsep Dasar, Interaksi Sosial

### Question Structure

```typescript
{
  question: string,                    // The question text
  type: "mcq" | "multi-select" | "short-answer",
  options: string[],                   // For MCQ
  correctAnswer: string | string[],
  difficulty: "mudah" | "sedang" | "sulit",
  hints: string[3],                    // 3 progressive hints
  explanation: string,                 // Detailed solution
  tags: string[],                      // Categorization
  imageUrl?: string                    // Optional diagram
}
```

## 🔧 Setup & Usage

### 1. Database Seeding

Populate database dengan template content:

```bash
cd server
npm run seed:content
```

Output:
```
🚀 Starting Content Template Seeding...

✅ MongoDB connected

📚 Seeding Topics...
✅ Created 23 topics

❓ Seeding Quiz Questions...
  ✓ Aljabar: 20 questions
  ✓ Geometri: 12 questions
  ✓ Trigonometri: 20 questions
  ✓ Kalkulus Dasar: 20 questions
  ✓ Statistika: 15 questions
  ✓ Peluang: 20 questions
  ✓ Mekanika: 7 questions
  ✓ Termodinamika: 3 questions
  ✓ Listrik & Magnet: 3 questions
  ... (and more)
✅ Created 164 quiz questions

🎉 Content template seeding completed successfully!

Summary:
  📚 Topics: 23
  ❓ Quiz Questions: 164
```

### 2. Prerequisites

Pastikan subjects sudah di-seed terlebih dahulu:

```bash
npm run migrate:subjects
```

Subject codes required:
- `MAT` - Matematika
- `FIS` - Fisika
- `KIM` - Kimia
- `BIO` - Biologi
- `BIND` - Bahasa Indonesia
- `BING` - Bahasa Inggris
- `SEJ` - Sejarah
- `GEO` - Geografi
- `EKO` - Ekonomi
- `SOS` - Sosiologi

## 🔐 Permission System

### Teacher Subject Access

```typescript
// User Model Enhancement
interface TeacherProfile {
  subjects: string[];          // Legacy: array of strings
  subjectRefs: ObjectId[];     // New: references to Subject model
  classes: ObjectId[];
}
```

### Middleware

```typescript
// Check if teacher can access subject
async function checkTeacherSubjectAccess(req, res, next) {
  const { subjectId } = req.params;
  const teacher = req.user;
  
  // Admin can access all
  if (teacher.role === 'admin') return next();
  
  // Check if subject in teacher's assignment
  const hasAccess = teacher.teacherProfile.subjectRefs
    .some(ref => ref.toString() === subjectId);
  
  if (!hasAccess) {
    return res.status(403).json({
      error: 'Access denied. Subject not assigned to you.'
    });
  }
  
  next();
}
```

## 📝 Template Workflow

### For Platform (Admin)

1. **Create Templates**
   - Write questions in template files
   - Run `npm run seed:content`
   - Templates marked as `isDefault: true`, `school: null`

2. **Update Templates**
   - Edit template files
   - Re-run seed script
   - Version tracking automatic

### For Teachers

1. **Browse Templates**
   ```
   GET /api/content/templates?subject=<id>&topic=<id>
   ```

2. **Clone Template**
   ```
   POST /api/content/templates/:id/clone
   Body: { schoolId, customizations }
   ```
   - Creates new ContentTemplate
   - Sets `isDefault: false`, `school: <schoolId>`
   - Sets `clonedFrom: <originalId>`
   - Status starts as `draft`

3. **Edit Content**
   ```
   PUT /api/content/templates/:id
   Body: { content, status }
   ```
   - Creates new ContentVersion
   - Records changes in ContentAuditLog
   - Teachers can only edit their school's content

4. **Publish**
   ```
   PATCH /api/content/templates/:id/publish
   ```
   - Changes status to `published`
   - Sets `publishedAt` timestamp
   - Logs audit trail

5. **Rollback**
   ```
   POST /api/content/templates/:id/rollback
   Body: { version }
   ```
   - Restores content from ContentVersion
   - Creates new version with rollback note
   - Logs action

## 🎯 API Endpoints (Planned - Task 31)

### Templates

```
GET    /api/content/templates              # List all templates
GET    /api/content/templates/:id          # Get template by ID
POST   /api/content/templates              # Create new template (admin)
PUT    /api/content/templates/:id          # Update template
DELETE /api/content/templates/:id          # Delete template (admin)
POST   /api/content/templates/:id/clone    # Clone template for school
PATCH  /api/content/templates/:id/publish  # Publish template
PATCH  /api/content/templates/:id/archive  # Archive template
```

### Topics

```
GET    /api/topics                         # List topics
GET    /api/topics/:id                     # Get topic by ID
GET    /api/topics/:id/quizzes             # Get quizzes for topic
GET    /api/topics/:id/lessons             # Get lessons for topic
```

### Versions

```
GET    /api/content/templates/:id/versions # Get version history
GET    /api/content/templates/:id/versions/:version # Get specific version
POST   /api/content/templates/:id/rollback # Rollback to version
GET    /api/content/templates/:id/diff/:v1/:v2 # Compare versions
```

### Audit Log

```
GET    /api/content/audit                  # Get audit logs
GET    /api/content/audit/:contentId       # Get logs for specific content
```

## 🧪 Testing (Task 41)

### Unit Tests

```typescript
describe('ContentTemplate Model', () => {
  test('should clone template successfully', async () => {
    const template = await ContentTemplate.findOne({ isDefault: true });
    const cloned = await template.clone(schoolId, userId);
    
    expect(cloned.isDefault).toBe(false);
    expect(cloned.school.toString()).toBe(schoolId.toString());
    expect(cloned.clonedFrom.toString()).toBe(template._id.toString());
    expect(cloned.status).toBe('draft');
  });
  
  test('should track version changes', async () => {
    const template = await ContentTemplate.create({ /* data */ });
    await template.updateContent({ title: 'New Title' }, userId);
    
    const versions = await ContentVersion.find({ contentTemplate: template._id });
    expect(versions).toHaveLength(2); // Initial + update
  });
});
```

### API Tests

```typescript
describe('POST /api/content/templates/:id/clone', () => {
  test('should clone template for teacher', async () => {
    const response = await request(app)
      .post(`/api/content/templates/${templateId}/clone`)
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ schoolId });
    
    expect(response.status).toBe(201);
    expect(response.body.isDefault).toBe(false);
  });
  
  test('should deny access if subject not assigned', async () => {
    const response = await request(app)
      .post(`/api/content/templates/${templateId}/clone`)
      .set('Authorization', `Bearer ${unauthorizedToken}`)
      .send({ schoolId });
    
    expect(response.status).toBe(403);
  });
});
```

## 📈 Future Enhancements

### Task 28-29: SMP & SD Content
- Create simplified question banks
- Age-appropriate difficulty
- Visual aids and illustrations

### Task 30: Skill Trees
- Define node dependencies
- Rich markdown lessons
- Video embed support
- Progress tracking integration

### Task 32-33: Editor UI
- Rich text editor (TipTap/Slate)
- Image upload with preview
- Drag-and-drop question ordering
- Real-time preview mode

### Task 35: Teacher Dashboard
- My Content (drafts, published)
- Template Library (browse, search, filter)
- Usage Analytics (views, scores, completion)
- Recent Edits timeline

### Task 36: Version History UI
- Visual diff (side-by-side comparison)
- Rollback confirmation dialog
- Audit log table with filters
- Blame view (who changed what)

### Task 40: Bulk Operations
- CSV import for questions
- JSON export for backup
- Template sharing between schools (admin)
- Batch status updates

## 🏗️ File Structure

```
server/src/
├── models/
│   ├── Topic.ts                    # Topic organization
│   ├── ContentTemplate.ts          # Template storage
│   ├── ContentVersion.ts           # Version tracking
│   └── QuizQuestion.ts             # Enhanced with topic ref
├── data/
│   └── templates/
│       ├── index.ts                # Central export
│       ├── mathQuestions.ts        # Math Part 1
│       ├── mathQuestionsPart2.ts   # Math Part 2
│       ├── physicsQuestions.ts     # Physics
│       ├── scienceQuestions.ts     # Chemistry & Biology
│       ├── languageQuestions.ts    # Indonesian & English
│       └── socialQuestions.ts      # History, Geo, Econ, Soc
├── scripts/
│   └── seedContentTemplates.ts     # Seed script
└── routes/
    └── content.ts                  # API routes (TODO)
```

## 💡 Best Practices

### For Platform Admins
1. ✅ Always test questions before publishing
2. ✅ Provide 3 progressive hints per question
3. ✅ Include detailed explanations with steps
4. ✅ Tag questions appropriately for filtering
5. ✅ Set realistic time limits and point values

### For Teachers
1. ✅ Clone templates instead of creating from scratch
2. ✅ Add school-specific context to questions
3. ✅ Test customizations before publishing
4. ✅ Save drafts frequently during editing
5. ✅ Review version history before major changes

### For Developers
1. ✅ Always create ContentVersion on updates
2. ✅ Log all actions in ContentAuditLog
3. ✅ Check permissions before content operations
4. ✅ Handle rollback edge cases (deleted dependencies)
5. ✅ Validate content schema before saving

## 📞 Support

For issues or questions:
- Check API documentation (Task 42)
- Review audit logs for debugging
- Contact platform admin for template access
- Submit bug reports with version info

---

**Last Updated**: November 21, 2025  
**Version**: 1.0.0  
**Status**: ✅ Foundation Complete (Tasks 24-27, 37)
