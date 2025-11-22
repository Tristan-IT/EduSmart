# 📝 Skill Tree Node Reference Guide

## Complete Node Structure

Every skill tree node must follow this exact structure:

```typescript
interface SkillTreeNode {
  // === Identifiers ===
  id: string;                    // MongoDB _id (auto-generated or same as nodeId)
  nodeId: string;                // Unique identifier (e.g., "sma-math-10-1")
  
  // === Content ===
  name: string;                  // Display name (e.g., "Teorema Pythagoras")
  description: string;           // What student will learn
  topicCode: string;             // Topic identifier (e.g., "MAT-10-1")
  
  // === Classification ===
  subject: string;               // Subject name (e.g., "Matematika", "Fisika", "PPLG")
  gradeLevel: "SD" | "SMP" | "SMA" | "SMK";
  classNumber: number;           // 1-12
  semester: number;              // 1 or 2
  curriculum: "Kurikulum Merdeka" | "K13";
  kompetensiDasar?: string;      // KD code (e.g., "3.1" or "MAT.10.1.1")
  
  // === Visual ===
  icon: string;                  // Emoji (e.g., "📐", "🧪", "💻")
  color: string;                 // Hex color (e.g., "#3B82F6")
  position: { 
    x: number;                   // Canvas X position (0-100)
    y: number;                   // Canvas Y position (0-2000+)
  };
  
  // === Progression ===
  level: number;                 // Sequence in tree (1, 2, 3...)
  xpRequired: number;            // XP needed to unlock (cumulative)
  prerequisites: string[];       // Array of nodeId strings
  
  // === Rewards ===
  rewards: {
    xp: number;                  // XP awarded on completion
    gems: number;                // Gems awarded
    hearts?: number;             // Hearts awarded (optional, for checkpoints)
    badge?: string;              // Badge name (optional)
    certificate?: string;        // Certificate name (optional, for checkpoints)
  };
  
  // === Learning Metadata ===
  quizCount: number;             // Number of quiz questions
  estimatedMinutes: number;      // Estimated completion time
  difficulty: "Mudah" | "Sedang" | "Sulit";
  isCheckpoint: boolean;         // Major milestone flag
  
  // === Customization ===
  isTemplate?: boolean;          // true = platform node, false/undefined = custom
  school?: ObjectId;             // School ID for custom nodes
  createdBy?: ObjectId;          // Teacher who created (for custom)
  createdAt?: Date;              // Creation timestamp
  updatedAt?: Date;              // Last update timestamp
}
```

---

## Naming Conventions

### NodeId Format
- **SD**: `sd-{subject}-{class}-{number}` → `sd-math-1-1`
- **SMP**: `smp-{subject}-{class}-{number}` → `smp-math-7-1`
- **SMA**: `sma-{subject}-{class}-{number}` → `sma-math-10-1`
- **SMK**: `smk-{major}-{class}-{number}` → `smk-pplg-10-1`

### Subject Codes
- **SD/SMP/SMA**: Full name (Matematika, Fisika, Kimia, Biologi, B.Indonesia, B.Inggris, IPA, IPS, PKn)
- **SMK**: Major acronym (PPLG, TJKT, DKV, BD)

### Topic Codes
- Format: `{SUBJECT}-{CLASS}-{SEQUENCE}`
- Examples:
  - `MAT-10-1` (Matematika Kelas 10, Topic 1)
  - `FIS-11-3` (Fisika Kelas 11, Topic 3)
  - `PPLG-12-5` (PPLG Kelas 12, Topic 5)

---

## XP Progression Formula

### Unlock XP (xpRequired)
```typescript
// For sequential nodes in same path
xpRequired = previousNode.xpRequired + previousNode.rewards.xp

// First node always 0
xpRequired = 0
```

### Reward XP (rewards.xp)
Base formula by difficulty and level:
```typescript
baseXP = {
  "Mudah": 50,
  "Sedang": 70,
  "Sulit": 100
}

// Increase by class level
classMultiplier = {
  SD (1-6): 1.0,
  SMP (7-9): 1.5,
  SMA (10-12): 2.0,
  SMK (10-12): 2.0
}

rewardXP = baseXP[difficulty] * classMultiplier + (level * 5)

// Checkpoints get bonus
if (isCheckpoint) rewardXP += 50
```

### Gem Rewards
```typescript
gems = Math.floor(rewardXP / 5)

// Checkpoints get bonus
if (isCheckpoint) gems += 10
```

---

## Icon Selection Guide

### By Subject
- **Matematika**: 📐 🔢 ➗ ✖️ ➕ 📊 📈 🧮
- **Fisika**: ⚡ 🔬 🌡️ 🔭 🧲 💡 🌟 ⚛️
- **Kimia**: 🧪 ⚗️ 🔬 💊 🧬 🦠 🌈
- **Biologi**: 🌱 🦠 🧬 🔬 🌿 🍃 🐛 🦋
- **B.Indonesia**: 📝 📚 ✍️ 📖 📜 🗣️ 💬
- **B.Inggris**: 🇬🇧 📚 🗣️ ✍️ 📖 🌍
- **IPA**: 🔬 🧪 🌍 🌟 🔭 ⚡
- **IPS**: 🌍 🏛️ 📜 🗺️ 👥 💰 🏦
- **PKn**: 🦅 🏛️ ⚖️ 🇮🇩 📜 🗳️
- **PPLG**: 💻 🖥️ ⌨️ 🖱️ 📱 🎮 🌐 🔧
- **TJKT**: 🌐 🔌 📡 🖥️ 🛡️ 🔒 ☁️ 🔧
- **DKV**: 🎨 🖼️ ✏️ 🎯 🌈 📐 🖌️ 🎬
- **BD**: 💼 💰 📊 📱 🛒 📈 💳 🚀

### By Node Type
- **Checkpoint**: 🎓 🏆 🥇 ⭐ 💎 👑
- **Exam/Ujian**: 📝 🎓 📋 ✅
- **Project**: 🚀 💼 🎨 🔨 🏗️
- **Practice**: 🎯 🔄 🔁 📊

---

## Color Schemes

### By Grade Level
```typescript
const gradeColors = {
  SD: {
    primary: "#FCD34D",    // Yellow (fun, playful)
    secondary: "#FBBF24"
  },
  SMP: {
    primary: "#60A5FA",    // Blue (growth)
    secondary: "#3B82F6"
  },
  SMA: {
    primary: "#A78BFA",    // Purple (academic)
    secondary: "#8B5CF6"
  },
  SMK: {
    primary: "#34D399",    // Green (professional)
    secondary: "#10B981"
  }
}
```

### By Subject (SMP/SMA)
```typescript
const subjectColors = {
  Matematika: "#3B82F6",      // Blue
  Fisika: "#EF4444",          // Red
  Kimia: "#10B981",           // Green
  Biologi: "#059669",         // Dark Green
  "B.Indonesia": "#F59E0B",   // Orange
  "B.Inggris": "#8B5CF6",     // Purple
  IPA: "#06B6D4",             // Cyan
  IPS: "#D97706",             // Amber
  PKn: "#DC2626",             // Dark Red
}
```

### By SMK Major
```typescript
const majorColors = {
  PPLG: "#3B82F6",   // Blue (Tech)
  TJKT: "#10B981",   // Green (Network)
  DKV: "#EC4899",    // Pink (Creative)
  BD: "#F59E0B",     // Orange (Business)
}
```

---

## Difficulty Guidelines

### Mudah (Easy)
- **For**: Introduction, basic concepts, foundational skills
- **Quiz**: 15-20 questions, multiple choice heavy
- **Time**: 45-60 minutes
- **Examples**: Basic addition, simple grammar, color theory

### Sedang (Medium)
- **For**: Application, practice, integration of concepts
- **Quiz**: 20-30 questions, mix of types
- **Time**: 60-90 minutes
- **Examples**: Problem-solving, analysis, design projects

### Sulit (Hard)
- **For**: Advanced topics, complex problems, synthesis
- **Quiz**: 30-50 questions, essay/open-ended
- **Time**: 90-120 minutes
- **Examples**: Proofs, research, complex projects

---

## Checkpoint Guidelines

### When to Use Checkpoints
- ✅ End of major topic/unit
- ✅ Before moving to next difficulty level
- ✅ After completing a project
- ✅ End of semester/year exams
- ✅ Every 3-5 regular nodes

### Checkpoint Characteristics
- `isCheckpoint: true`
- Higher XP rewards (bonus +50)
- Extra gems (bonus +10)
- May award hearts (3-5)
- May award badge
- May award certificate
- Often has higher quizCount (40-60)
- Longer estimatedMinutes (90-180)
- Usually "Sedang" or "Sulit" difficulty

### Checkpoint Naming
- `"Checkpoint: {Topic Name}"`
- `"Project: {Project Name}"`
- `"Ujian {Subject} Kelas {Number}"`
- `"Evaluasi Semester {1/2}"`

---

## Prerequisites Best Practices

### Linear Path
```typescript
// Sequential learning
prerequisites: ["previous-node-id"]

// Example:
{ nodeId: "sma-math-10-2", prerequisites: ["sma-math-10-1"] }
```

### Multiple Prerequisites
```typescript
// Requires completing multiple nodes
prerequisites: ["node-a", "node-b", "node-c"]

// Example: Integration requires both Limit and Derivative
{ 
  nodeId: "sma-math-11-8",
  name: "Integral",
  prerequisites: ["sma-math-11-5", "sma-math-11-6"] // Limit, Turunan
}
```

### Branching Paths
```typescript
// Different paths with same prerequisite
// Node A splits into B and C (both require A)

// Path B
{ nodeId: "b", prerequisites: ["a"] }

// Path C  
{ nodeId: "c", prerequisites: ["a"] }

// Later merge: D requires both B and C
{ nodeId: "d", prerequisites: ["b", "c"] }
```

### No Prerequisites
```typescript
// Starting node of a path
prerequisites: []
```

---

## Position Calculation

### Vertical Spacing
```typescript
const Y_SPACING = 100; // pixels between nodes
position.y = level * Y_SPACING
```

### Horizontal Positioning
```typescript
// Single path
position.x = 50 // centered

// Branching paths
const BRANCH_SPACING = 30;
position.x = {
  left: 20,
  center: 50,
  right: 80,
  // For 3+ branches
  branch1: 15,
  branch2: 40,
  branch3: 65,
  branch4: 90
}
```

### Example Layout
```typescript
// Linear path (all nodes x: 50)
Level 1: { x: 50, y: 0 }
Level 2: { x: 50, y: 100 }
Level 3: { x: 50, y: 200 }

// Branch after level 2
Level 3a: { x: 30, y: 200 }  // left branch
Level 3b: { x: 70, y: 200 }  // right branch

// Merge at level 4
Level 4: { x: 50, y: 300 }   // center, requires 3a & 3b
```

---

## Example Nodes

### SD - Elementary
```typescript
{
  id: "sd-math-1-1",
  nodeId: "sd-math-1-1",
  name: "Penjumlahan 1-10",
  description: "Belajar menjumlahkan angka 1 sampai 10",
  topicCode: "MAT-1-1",
  subject: "Matematika",
  gradeLevel: "SD",
  classNumber: 1,
  semester: 1,
  curriculum: "Kurikulum Merdeka",
  kompetensiDasar: "MAT.1.1.1",
  icon: "➕",
  color: "#FCD34D",
  level: 1,
  xpRequired: 0,
  prerequisites: [],
  rewards: { xp: 50, gems: 10 },
  position: { x: 50, y: 0 },
  quizCount: 15,
  estimatedMinutes: 45,
  difficulty: "Mudah",
  isCheckpoint: false
}
```

### SMP - Junior High
```typescript
{
  id: "smp-math-7-3",
  nodeId: "smp-math-7-3",
  name: "Teorema Pythagoras",
  description: "Memahami dan mengaplikasikan teorema Pythagoras",
  topicCode: "MAT-7-3",
  subject: "Matematika",
  gradeLevel: "SMP",
  classNumber: 7,
  semester: 2,
  curriculum: "Kurikulum Merdeka",
  kompetensiDasar: "3.6",
  icon: "📐",
  color: "#3B82F6",
  level: 6,
  xpRequired: 325,
  prerequisites: ["smp-math-7-5"],
  rewards: { xp: 85, gems: 17, badge: "Geometry Master" },
  position: { x: 50, y: 500 },
  quizCount: 25,
  estimatedMinutes: 75,
  difficulty: "Sedang",
  isCheckpoint: true
}
```

### SMA - Senior High
```typescript
{
  id: "sma-math-11-8",
  nodeId: "sma-math-11-8",
  name: "Integral Tentu",
  description: "Menghitung integral tentu dan aplikasinya",
  topicCode: "MAT-11-8",
  subject: "Matematika",
  gradeLevel: "SMA",
  classNumber: 11,
  semester: 2,
  curriculum: "Kurikulum Merdeka",
  kompetensiDasar: "3.8",
  icon: "∫",
  color: "#8B5CF6",
  level: 8,
  xpRequired: 890,
  prerequisites: ["sma-math-11-7", "sma-math-11-6"],
  rewards: { xp: 120, gems: 24, certificate: "Calculus I" },
  position: { x: 50, y: 700 },
  quizCount: 35,
  estimatedMinutes: 100,
  difficulty: "Sulit",
  isCheckpoint: true
}
```

### SMK - Vocational
```typescript
{
  id: "smk-pplg-12-8",
  nodeId: "smk-pplg-12-8",
  name: "Microservices Architecture",
  description: "Design and implement microservices with Node.js",
  topicCode: "PPLG-12-8",
  subject: "PPLG",
  gradeLevel: "SMK",
  classNumber: 12,
  semester: 1,
  curriculum: "Kurikulum Merdeka",
  kompetensiDasar: "PPLG.12.1.8",
  icon: "🔧",
  color: "#3B82F6",
  level: 28,
  xpRequired: 2850,
  prerequisites: ["smk-pplg-12-7"],
  rewards: { xp: 130, gems: 26, badge: "Backend Architect" },
  position: { x: 50, y: 2700 },
  quizCount: 30,
  estimatedMinutes: 90,
  difficulty: "Sulit",
  isCheckpoint: false
}
```

---

## Validation Checklist

Before adding a node, verify:

### Required Fields
- ✅ `nodeId` is unique across all nodes
- ✅ `name` is clear and descriptive
- ✅ `description` explains what student will learn
- ✅ `topicCode` follows naming convention
- ✅ `subject` matches curriculum
- ✅ `gradeLevel`, `classNumber`, `semester` are correct
- ✅ `curriculum` is either "Kurikulum Merdeka" or "K13"

### Visual Elements
- ✅ `icon` is a single emoji relevant to content
- ✅ `color` is in hex format and matches subject/grade
- ✅ `position.x` is 0-100, `position.y` is level * 100

### Progression Logic
- ✅ `level` is sequential within path
- ✅ `xpRequired` is cumulative and correct
- ✅ `prerequisites` array contains valid nodeIds (or empty for first node)
- ✅ No circular dependencies in prerequisites

### Rewards
- ✅ `rewards.xp` follows difficulty formula
- ✅ `rewards.gems` is appropriate (~1/5 of XP)
- ✅ `badge` and `certificate` only for checkpoints/major milestones

### Learning Metadata
- ✅ `quizCount` matches difficulty (15-60)
- ✅ `estimatedMinutes` is realistic (45-180)
- ✅ `difficulty` matches content complexity
- ✅ `isCheckpoint` is true for major milestones only

---

## Common Patterns

### Semester Structure
```typescript
// Semester 1: Nodes 1-6
// Semester 2: Nodes 7-12

const class10Semester1 = nodes.filter(n => n.semester === 1);
const class10Semester2 = nodes.filter(n => n.semester === 2);
```

### Subject Paths
```typescript
// Group by subject for navigation
const mathNodes = allNodes.filter(n => n.subject === "Matematika");
const physicNodes = allNodes.filter(n => n.subject === "Fisika");
```

### Class Progression
```typescript
// Sequential class progression
const kelas10 = nodes.filter(n => n.classNumber === 10);
const kelas11 = nodes.filter(n => n.classNumber === 11);
const kelas12 = nodes.filter(n => n.classNumber === 12);
```

---

## Tips for Content Creation

1. **Start with Learning Outcomes**: Define what student should know/do after completion
2. **Chunk Content**: Break complex topics into smaller, manageable nodes
3. **Progressive Difficulty**: Gradually increase difficulty within a class/subject
4. **Real-world Examples**: Include practical applications, especially for SMK
5. **Checkpoints Every 3-5 Nodes**: Regular assessment and milestone celebration
6. **Clear Prerequisites**: Make dependencies explicit and logical
7. **Consistent Naming**: Follow patterns for similar nodes across subjects
8. **Align with Curriculum**: Map to official Kompetensi Dasar codes
9. **Estimate Time Realistically**: Consider reading, practice, and quiz time
10. **Test Prerequisites**: Ensure prerequisite chain makes sense educationally

---

**This reference should be used when creating new skill tree nodes to maintain consistency and quality across the system.**
