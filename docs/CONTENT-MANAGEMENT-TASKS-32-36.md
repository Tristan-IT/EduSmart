# Content Management System - Tasks 32-36 Documentation

## Overview
Completed implementation of the Content Management System (CMS) for teachers, providing comprehensive tools for browsing templates, editing content, and uploading custom materials.

**Completion Date:** November 21, 2025  
**Tasks Completed:** 32, 33, 34, 35, 36  
**Total Files Created:** 4  
**Total Files Modified:** 2

---

## Task 32: Template Browser UI Component ✅

### File Created
- **Path:** `src/pages/TemplateLibrary.tsx`
- **Lines:** ~450
- **Purpose:** Browse and search through pre-made lesson templates, quizzes, videos, and documents

### Features Implemented

#### 1. **Advanced Filtering System**
```typescript
// 5 Filter Dimensions
- Search: Real-time text search across title, description, tags
- Type: lesson | quiz | video | document
- Category: Matematika | IPA | IPS | Bahasa
- Grade Level: SD | SMP | SMA | SMK
- Difficulty: Mudah | Sedang | Sulit
```

#### 2. **Tabbed View**
- **All Templates Tab**: Shows all filtered templates
- **Lessons Tab**: Filters to lesson type only
- **Quizzes Tab**: Filters to quiz type only
- **Videos Tab**: Filters to video type only
- Each tab shows count dynamically

#### 3. **Template Cards**
Each card displays:
- **Icon & Title**: Type-specific icon (BookOpen, FileQuestion, Video, FileText)
- **Difficulty Badge**: Color-coded (Green=Mudah, Yellow=Sedang, Red=Sulit)
- **Description**: Truncated to 2 lines
- **Tags**: First 3 tags displayed as badges
- **Metadata**: Duration, Rating (⭐), Download count (📥)
- **Classification**: Grade level and category badges
- **Actions**:
  - **Preview Button**: Opens TemplatePreviewModal
  - **Use Button**: Downloads/uses template (navigates to editor)

#### 4. **Mock Data**
Includes 5 sample templates:
1. Pengenalan Aljabar Dasar (Lesson - SMP Math)
2. Quiz Persamaan Linear (Quiz - SMP Math)
3. Video Tutorial Pythagoras (Video - SMP Math)
4. Sistem Pencernaan Manusia (Lesson - SMP Biology)
5. Teks Deskripsi (Lesson - SMP Bahasa Indonesia)

#### 5. **State Management**
```typescript
const [templates, setTemplates] = useState<Template[]>([]); // All templates
const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]); // After filters
const [searchTerm, setSearchTerm] = useState("");
const [selectedType, setSelectedType] = useState("all");
const [selectedCategory, setSelectedCategory] = useState("all");
const [selectedGrade, setSelectedGrade] = useState("all");
const [selectedDifficulty, setSelectedDifficulty] = useState("all");
const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
```

#### 6. **API Integration** (Ready for Backend)
```typescript
// Endpoint: GET /api/templates
fetchTemplates() → Load all available templates
handleDownload(templateId) → POST /api/templates/:id/download
// Currently using mock data, easily switchable to real API
```

### User Flow
1. Teacher navigates to `/teacher/templates`
2. Browse templates in grid layout
3. Use filters to narrow down results
4. Search by keyword
5. Switch between tabs (All/Lessons/Quizzes/Videos)
6. Click "Preview" to see full details
7. Click "Use" to customize in editor

---

## Task 33: Content Editor Component ✅

### File Created
- **Path:** `src/pages/ContentEditor.tsx`
- **Lines:** ~700
- **Purpose:** Rich editor for creating/customizing lessons, quizzes, videos, and documents

### Features Implemented

#### 1. **Three-Tab Interface**

**Tab 1: Basic Info**
- Title* (required)
- Description* (required)
- Content Type (lesson/quiz/video/document)
- Subject
- Grade Level (SD/SMP/SMA/SMK)
- Class Number (1-12)
- Semester (1-2)
- Difficulty (Mudah/Sedang/Sulit)
- Duration (minutes)
- Tags (with add/remove functionality)
- Learning Objectives (lessons only)

**Tab 2: Content**

**For Lessons:**
- **Markdown Editor** with toolbar:
  - Bold (`**text**`)
  - Italic (`*text*`)
  - Lists (`- item`)
  - Links (`[text](url)`)
  - Images (`![alt](url)`)
  - Code blocks (` ```code``` `)
- 20-row textarea with monospace font
- Real-time markdown syntax insertion

**For Quizzes:**
- **Question Builder**:
  - Question Type selector:
    - Multiple Choice (4 options)
    - Essay
    - Short Answer
    - True/False
  - Question text (textarea)
  - Options editor (for multiple choice)
  - Correct answer selector
  - Explanation (optional)
  - Points configuration
- **Add/Remove Questions**
- Dynamic question numbering
- Form validation per question type

**Tab 3: Settings**
- Passing Score (%) for quizzes
- Video URL for videos
- Thumbnail URL for videos
- Additional metadata

#### 2. **Template Loading**
```typescript
// URL: /teacher/content-editor?templateId=123
useEffect(() => {
  if (templateId) {
    loadTemplate(templateId);
    // Loads template data and sets isTemplate=false
    // Clears _id to create new document
  }
}, [templateId]);
```

#### 3. **Form Validation**
```typescript
// Pre-save validation:
- Title & description required
- Lesson: content field required
- Quiz: At least 1 question required
- All fields type-checked
```

#### 4. **State Management**
```typescript
interface LessonContent {
  title: string;
  description: string;
  type: "lesson" | "quiz" | "video" | "document";
  subject: string;
  gradeLevel: string;
  classNumber: number;
  semester: number;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  tags: string[];
  duration: number;
  
  // Lesson specific
  objectives?: string[];
  content?: string; // Markdown
  
  // Quiz specific
  questions?: Question[];
  passingScore?: number;
  
  // Video specific
  videoUrl?: string;
  thumbnail?: string;
}
```

#### 5. **Save Functionality**
```typescript
// POST /api/teacher/content
handleSave() → {
  1. Validate required fields
  2. Check type-specific requirements
  3. POST to API
  4. Show success message
  5. Navigate to /teacher/content-management after 2s
}
```

### User Flow
1. Teacher clicks "Use This Template" from preview
2. Redirected to `/teacher/content-editor?templateId=123`
3. Template data auto-loaded into form
4. Edit Basic Info tab
5. Customize Content (write lesson or add quiz questions)
6. Configure Settings
7. Click "Save Content"
8. Redirected to content management page

---

## Task 34: Template Selection Flow ✅

### Implementation
The complete workflow is now functional across components:

```
Template Library → Preview Modal → Content Editor → Save
```

### Workflow Steps

#### Step 1: Browse Templates
- **Component:** `TemplateLibrary.tsx`
- **Actions:**
  - Apply filters and search
  - View template cards
  - See ratings, downloads, metadata

#### Step 2: Preview Template
- **Component:** `TemplatePreviewModal.tsx`
- **Trigger:** Click "Preview" button on card
- **Actions:**
  - View full description
  - See metadata (duration, rating, author, downloads)
  - Browse tabs:
    - **Overview**: Objectives, materials, structure
    - **Content**: Lesson outline, quiz question types
    - **Sample**: Sample questions, content preview
  - Decision point: Close or Use

#### Step 3: Use Template
- **Trigger:** Click "Use This Template" in modal
- **Action:** `window.location.href = '/teacher/content-editor?templateId=${templateId}'`
- **Result:** Navigate to editor with template pre-loaded

#### Step 4: Customize Content
- **Component:** `ContentEditor.tsx`
- **Actions:**
  - Template data auto-loaded
  - Edit all fields (title, description, objectives)
  - Customize lesson content or quiz questions
  - Add/remove tags
  - Adjust difficulty, duration, grade level

#### Step 5: Save to Curriculum
- **Action:** Click "Save Content"
- **Validation:** Check required fields
- **API Call:** `POST /api/teacher/content`
- **Result:** 
  - Success message shown
  - Auto-redirect to content management
  - Content available for assignment to students

### Integration Points
```typescript
// TemplateLibrary → TemplatePreviewModal
const handlePreview = (template: Template) => {
  setPreviewTemplate(template);
  setIsPreviewOpen(true);
};

// TemplatePreviewModal → ContentEditor
<Button onClick={() => window.location.href = `/teacher/content-editor?templateId=${template._id}`}>
  Use This Template
</Button>

// ContentEditor → Save
const handleSave = async () => {
  await apiClient.post("/api/teacher/content", content);
  setTimeout(() => navigate("/teacher/content-management"), 2000);
};
```

---

## Task 35: Content Upload Interface ✅

### File Created
- **Path:** `src/pages/UploadContent.tsx`
- **Lines:** ~550
- **Purpose:** Upload videos, images, documents with drag-drop, progress tracking, and media library

### Features Implemented

#### 1. **Drag & Drop Upload Zone**
```typescript
// Interactive upload area
- Drag enter/leave/over handlers
- Visual feedback (border highlight on drag)
- Click to browse fallback
- Multi-file upload support
```

#### 2. **File Type Detection & Validation**
```typescript
getFileType(file: File): "video" | "image" | "document" | "other"
validateFile(file: File): string | null

// Validation Rules:
- Videos: Max 100MB (MP4, WebM)
- Images: Max 10MB (JPEG, PNG, GIF)
- Documents: Max 20MB (PDF, DOCX, PPTX)
- Other: Max 10MB
- Type whitelist enforcement
```

#### 3. **Upload Progress Tracking**
```typescript
interface UploadedFile {
  id: string;
  file: File;
  type: "video" | "image" | "document" | "other";
  status: "pending" | "uploading" | "success" | "error";
  progress: number; // 0-100
  url?: string;
  error?: string;
}

// Progress tracking via axios onUploadProgress
onUploadProgress: (progressEvent) => {
  const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  // Update state
}
```

#### 4. **File List Management**
Each uploaded file shows:
- **Type Icon**: Video (Purple), Image (Blue), Document (Red), Other (Gray)
- **File Name**: Truncated if too long
- **File Size**: Formatted (B, KB, MB)
- **Progress Bar**: Animated during upload
- **Status Indicators**:
  - ✅ Success (green text)
  - ⚠️ Error (red text with message)
  - ⏳ Uploading (progress %)
  - 📝 Pending (ready to upload)
- **Actions**:
  - **Upload** (pending files)
  - **Retry** (failed uploads)
  - **Remove** (delete from list)

#### 5. **Batch Upload**
```typescript
handleUploadAll() → {
  const pendingFiles = files.filter(f => f.status === "pending");
  for (const file of pendingFiles) {
    await uploadFile(file); // Sequential upload
  }
  if (allSuccess) showSuccess();
}
```

#### 6. **Media Library**
- **Recent Uploads Grid**: 2x4 on mobile, 4 columns on desktop
- Shows successfully uploaded files
- Each item:
  - Thumbnail/icon
  - File name (truncated)
  - File size
  - Hover effect
  - Click to view/use

#### 7. **API Integration**
```typescript
// POST /api/teacher/upload
FormData:
- file: File object
- type: "video" | "image" | "document"

Response:
{
  url: "https://cdn.example.com/uploads/file.mp4",
  id: "upload_123",
  ...
}
```

### User Flow
1. Navigate to `/teacher/upload-content`
2. Drag files into upload zone OR click to browse
3. Files validated and added to list
4. Click "Upload" on individual file or "Upload All"
5. Progress bar shows real-time upload status
6. Success: File appears in media library
7. Error: Retry button available
8. Browse recent uploads at bottom

---

## Task 36: Template Preview Modal ✅

### File Created
- **Path:** `src/components/TemplatePreviewModal.tsx`
- **Lines:** ~400
- **Purpose:** Full-screen modal showing template details before selection

### Features Implemented

#### 1. **Modal Header**
- Template title (large, 2xl font)
- Description below title
- Difficulty badge (color-coded) in top-right
- 4-Column metadata grid:
  - ⏱️ Duration (minutes)
  - ⭐ Rating (0-5.0)
  - 📥 Downloads count
  - 👤 Author name
- Tags display:
  - Type badge (lesson/quiz/video)
  - Grade level badge
  - Category badge
  - All content tags as outline badges

#### 2. **Three-Tab Layout**

**Overview Tab:**
- **Description**: Full text (not truncated)
- **Learning Objectives** (lessons):
  - Bulleted list
  - 3-5 objectives
- **Materials Included** (lessons):
  - List of downloadable resources
  - Slide presentations, worksheets, answer keys
- **Question Count & Time Limit** (quizzes):
  - Large numbers displayed
  - Visual card layout
- **Video Chapters** (videos):
  - Chapter title and timestamp
  - Muted background styling

**Content Tab:**
- **Lesson Outline** (lessons):
  - Section cards with title and duration
  - Brief description per section
  - Expandable structure
- **Question Types** (quizzes):
  - 3-column grid
  - Icons for each type
  - Multiple Choice, Essay, Short Answer, True/False
- **Topics Covered**:
  - All tags displayed
  - Secondary badge styling

**Sample Tab:**
- **Sample Questions** (quizzes):
  - Numbered questions
  - Options displayed
  - Correct answer highlighted (green background)
  - Essay questions show placeholder
  - "...and X more questions" indicator
- **Sample Content** (lessons):
  - Prose format with headings
  - Introduction, Main Concepts, Examples
  - Lorem ipsum placeholder
- **Video Preview** (videos):
  - Placeholder with BookOpen icon
  - "Preview not available" message

#### 3. **Mock Content Generator**
```typescript
getMockContent() → {
  if (lesson) return {
    objectives: [...],
    outline: [{ title, duration }, ...],
    materials: [...]
  }
  
  if (quiz) return {
    questionCount: 20,
    questionTypes: [...],
    sampleQuestions: [{ question, options, correctAnswer }, ...]
  }
  
  if (video) return {
    chapters: [{ title, time }, ...]
  }
}
```

#### 4. **Footer Actions**
- **Close Button**: Dismiss modal (variant="outline")
- **Use This Template Button**: Navigate to editor (primary)
  - Icon: Download
  - Color: Primary (blue)
  - Action: `onUse()` callback

#### 5. **Responsive Design**
- Max width: 4xl (1024px)
- Max height: 90vh with scroll
- Flex column layout
- ScrollArea for tab content
- Padding: 4 (pr-4 for scrollbar)

### User Flow
1. Click "Preview" on any template card
2. Modal opens with template data
3. Read overview (objectives, materials)
4. Switch to Content tab (outline, question types)
5. Switch to Sample tab (see example questions/content)
6. Decision:
   - **Close**: Return to template library
   - **Use This Template**: Navigate to content editor

---

## System Integration

### Navigation Structure
```
AppSidebar (Teacher Menu)
├── Dashboard
├── Materi
├── Skill Tree
├── Template Library ← NEW
├── Content Editor ← NEW
├── Upload Content ← NEW
├── Laporan
└── Profil
```

### Routing Configuration
```typescript
// src/App.tsx
<Route path="/teacher/templates" element={
  <ProtectedRoute allowRoles={["teacher", "admin", "school_owner"]}>
    <TemplateLibrary />
  </ProtectedRoute>
} />

<Route path="/teacher/content-editor" element={
  <ProtectedRoute allowRoles={["teacher", "admin", "school_owner"]}>
    <ContentEditor />
  </ProtectedRoute>
} />

<Route path="/teacher/upload-content" element={
  <ProtectedRoute allowRoles={["teacher", "admin", "school_owner"]}>
    <UploadContent />
  </ProtectedRoute>
} />
```

### Component Dependencies
```typescript
// UI Components Used
- Dialog, DialogContent, DialogHeader, DialogFooter
- Card, CardHeader, CardContent, CardFooter
- Button, Input, Label, Textarea
- Select, SelectTrigger, SelectContent, SelectItem
- Tabs, TabsList, TabsTrigger, TabsContent
- Badge, Progress, ScrollArea
- AlertMessage (custom)

// Icons
- BookOpen, FileQuestion, Video, FileText
- Upload, Download, Eye, Plus, Trash2, X, Check
- Bold, Italic, List, Link, Image, Code
- Search, Filter, AlertCircle
```

### API Endpoints (Ready for Backend)
```typescript
// Templates
GET  /api/templates              // List all templates
GET  /api/templates/:id          // Get single template
POST /api/templates/:id/download // Track download

// Content Creation
POST /api/teacher/content        // Save custom content
GET  /api/teacher/content        // List teacher's content
PUT  /api/teacher/content/:id    // Update content
DELETE /api/teacher/content/:id  // Delete content

// File Upload
POST /api/teacher/upload         // Upload file (multipart/form-data)
GET  /api/teacher/uploads        // List uploaded files
DELETE /api/teacher/uploads/:id  // Delete upload
```

---

## Data Models

### Template Interface
```typescript
interface Template {
  _id: string;
  title: string;
  description: string;
  type: "lesson" | "quiz" | "video" | "document";
  category: string;
  subject: string;
  gradeLevel: string;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  duration: number;
  tags: string[];
  thumbnail?: string;
  author: string;
  rating: number;
  downloads: number;
  isPublic: boolean;
  content?: any;
  createdAt: string;
}
```

### Question Interface
```typescript
interface Question {
  id: string;
  question: string;
  type: "multiple-choice" | "essay" | "short-answer" | "true-false";
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  points: number;
}
```

### LessonContent Interface
```typescript
interface LessonContent {
  _id?: string;
  title: string;
  description: string;
  type: "lesson" | "quiz" | "video" | "document";
  subject: string;
  gradeLevel: string;
  classNumber: number;
  semester: number;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  tags: string[];
  duration: number;
  
  objectives?: string[];     // Lessons
  content?: string;          // Lessons (Markdown)
  materials?: string[];      // Lessons
  
  questions?: Question[];    // Quizzes
  passingScore?: number;     // Quizzes
  
  videoUrl?: string;         // Videos
  thumbnail?: string;        // Videos
  
  isTemplate: boolean;
  school?: string;
}
```

---

## Testing Checklist

### Task 32: Template Library
- [ ] Filter by type (lesson/quiz/video)
- [ ] Filter by category
- [ ] Filter by grade level
- [ ] Filter by difficulty
- [ ] Search by keyword
- [ ] Tab switching (All/Lessons/Quizzes/Videos)
- [ ] Card click "Preview" opens modal
- [ ] Card click "Use" navigates to editor
- [ ] Empty state shows when no results
- [ ] Loading skeleton displays while fetching

### Task 33: Content Editor
- [ ] Load template via URL param
- [ ] Basic Info tab: all fields editable
- [ ] Tags: add/remove functionality
- [ ] Objectives: add/remove for lessons
- [ ] Markdown toolbar inserts syntax
- [ ] Quiz: add/remove questions
- [ ] Quiz: change question type updates form
- [ ] Form validation prevents save with missing fields
- [ ] Save button shows loading state
- [ ] Success message + redirect after save

### Task 34: Template Selection Flow
- [ ] Preview → Use navigates to editor
- [ ] Template data loads in editor
- [ ] Edit template creates new (not update)
- [ ] Save creates new content document
- [ ] Navigate back to content management

### Task 35: Upload Content
- [ ] Drag & drop files works
- [ ] Click to browse works
- [ ] File validation shows errors
- [ ] Progress bar updates during upload
- [ ] Success state shows checkmark
- [ ] Error state shows retry button
- [ ] Remove button deletes from list
- [ ] Upload All uploads all pending
- [ ] Media library shows recent uploads

### Task 36: Template Preview Modal
- [ ] Modal opens with template data
- [ ] All three tabs display correctly
- [ ] Lesson type shows objectives/outline
- [ ] Quiz type shows question count/types
- [ ] Video type shows chapters
- [ ] Sample tab shows questions/content
- [ ] Close button dismisses modal
- [ ] Use button navigates to editor

---

## Next Steps (Recommended)

### Backend Implementation
1. **Create Template Model** (`server/src/models/Template.ts`)
2. **Create Template Controller** (`server/src/controllers/templateController.ts`)
3. **Create Template Routes** (`server/src/routes/templates.ts`)
4. **Seed Template Data** (add to seed script)

### Content Management API
1. **Create Content Model** (`server/src/models/Content.ts`)
2. **Create Content Controller** (`server/src/controllers/contentController.ts`)
3. **Create Content Routes** (`server/src/routes/content.ts`)

### File Upload Service
1. **Setup Multer Middleware** (file upload)
2. **Configure S3/Cloud Storage** (production)
3. **Add Upload Controller** (`server/src/controllers/uploadController.ts`)
4. **Add Upload Routes** (`server/src/routes/uploads.ts`)

### Integration Tasks
- [ ] **Task 38**: Quiz Integration with Skill Tree
  - Connect quiz completion to node progress
  - Award XP after quiz complete
  - Unlock next nodes automatically
  
- [ ] **Task 39**: Lesson Content Integration
  - Fetch lesson from skill tree node
  - Display content in viewer
  - Track lesson completion

---

## Summary

✅ **5 Tasks Completed**: 32, 33, 34, 35, 36  
📁 **4 New Pages**: TemplateLibrary, ContentEditor, UploadContent, TemplatePreviewModal  
🔗 **3 New Routes**: /teacher/templates, /teacher/content-editor, /teacher/upload-content  
🎨 **3 New Menu Items**: Template Library, Content Editor, Upload Content  
🧩 **Complete CMS**: Browse → Preview → Edit → Upload → Save workflow  

**All frontend components for Content Management System are now complete and ready for backend integration!**
