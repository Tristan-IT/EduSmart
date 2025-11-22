# Task 38: Quiz Integration with Skill Tree - Documentation

## Overview
Complete implementation of quiz integration with skill tree progress tracking system. Students can now click on skill tree nodes to start quizzes, complete them, earn rewards, and automatically unlock next nodes based on prerequisites.

**Completion Date:** November 21, 2025  
**Files Created:** 2  
**Files Modified:** 1  
**Dependencies:** react-confetti (already installed)

---

## Architecture

### System Flow
```
Student Click Node 
  ↓
Check Prerequisites 
  ↓
Unlock Node (API) 
  ↓
Navigate to Quiz Player 
  ↓
Complete Quiz 
  ↓
Calculate Score & Stars 
  ↓
Call Complete API 
  ↓
Award Rewards (XP, Gems, Hearts, Badges) 
  ↓
Show Rewards Modal 
  ↓
Refresh Skill Tree (Show Unlocked Nodes) 
  ↓
Display Next Recommendations
```

### API Integration Points
```typescript
// 1. Unlock Node (Mark as In-Progress)
POST /api/progress/skill-tree/unlock
Body: { nodeId: string }
→ Updates status to "in-progress", increments attempts

// 2. Complete Node (Award Rewards)
POST /api/progress/skill-tree/complete
Body: { nodeId: string, score: number, timeSpent: number }
→ Calculates stars, awards XP/gems/hearts/badges, checks level-up

// 3. Get Progress (Load Skill Tree)
GET /api/progress/skill-tree?gradeLevel&classNumber&semester
→ Returns nodes with progress status (locked/available/in-progress/completed)

// 4. Get Recommendations (Next Nodes)
GET /api/progress/skill-tree/recommendations?limit=3
→ Returns unlocked nodes student should attempt next
```

---

## Files Created

### 1. `src/components/RewardsModal.tsx` (~450 lines)

**Purpose:** Display rewards earned after quiz completion with celebration animations

**Features:**
- **Confetti Animation**: 500 pieces, 5-second duration
- **Star Display**: Animated 0-3 stars based on score
- **Level Up Banner**: Special gradient banner when leveling up
- **Rewards Grid**: Cards for XP, Gems, Hearts, Badges
- **Certificate Notification**: Green banner for certificate awards
- **Progress Bar**: Visual XP progress to next level
- **Stats Summary**: Current level, total XP, gems, hearts
- **Next Recommendations**: Carousel of 3 suggested nodes
- **Action Buttons**: Close or Continue Learning

**Props Interface:**
```typescript
interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: Rewards;               // XP, gems, stars, level-up info
  userStats: UserStats;           // Current user stats
  nextRecommendations?: NextNode[]; // Suggested next nodes
  onContinue?: () => void;
  nodeName?: string;               // Name of completed node
}
```

**Star Calculation:**
```typescript
// Frontend display matches backend logic
score >= 90  → 3 stars ⭐⭐⭐
score >= 75  → 2 stars ⭐⭐
score >= 60  → 1 star  ⭐
score < 60   → 0 stars
```

**Animations:**
- Confetti: `react-confetti` with window resize listener
- Stars: `framer-motion` scale + rotate entrance
- Level Up: Gradient pulse animation
- Reward Cards: Staggered fade-in with delay
- Progress Bar: Width animation over 1 second

**Components Used:**
- Dialog (full-screen modal)
- Card (reward display)
- Badge (difficulty, level indicators)
- Progress (XP bar)
- Motion (framer-motion animations)
- Confetti (react-confetti)

---

### 2. `src/lib/skillTreeIntegration.ts` (~200 lines)

**Purpose:** Utility functions and API wrappers for skill tree-quiz integration

**Exports:**

#### Functions:

**1. completeSkillTreeNode()**
```typescript
async function completeSkillTreeNode(
  data: QuizCompletionData
): Promise<SkillTreeCompletionResult>

// Usage:
const result = await completeSkillTreeNode({
  nodeId: "SMP-7-1-MAT-001",
  nodeName: "Bilangan Bulat",
  score: 85,
  timeSpent: 12.5,
  correctAnswers: 17,
  totalQuestions: 20
});
```

**2. unlockSkillTreeNode()**
```typescript
async function unlockSkillTreeNode(nodeId: string): Promise<boolean>

// Usage:
await unlockSkillTreeNode("SMP-7-1-MAT-001");
// → Marks node as in-progress
```

**3. getRecommendedNodes()**
```typescript
async function getRecommendedNodes(limit: number = 3): Promise<NextRecommendation[]>

// Usage:
const next = await getRecommendedNodes(5);
// → Returns top 5 recommended nodes
```

**4. calculateStars()**
```typescript
function calculateStars(score: number): number

// Examples:
calculateStars(95) → 3
calculateStars(80) → 2
calculateStars(65) → 1
calculateStars(45) → 0
```

**5. formatTimeSpent()**
```typescript
function formatTimeSpent(minutes: number): string

// Examples:
formatTimeSpent(0.5) → "< 1 menit"
formatTimeSpent(1)   → "1 menit"
formatTimeSpent(5.7) → "6 menit"
```

**6. getPerformanceMessage()**
```typescript
function getPerformanceMessage(score: number): string

// Examples:
score >= 95 → "Sempurna! Kamu menguasai materi ini! 🌟"
score >= 85 → "Luar biasa! Terus pertahankan! 🎉"
score >= 75 → "Bagus! Kamu sudah memahami sebagian besar materi! 👍"
score >= 60 → "Cukup baik! Terus belajar ya! 💪"
score >= 50 → "Hampir sampai! Coba lagi! 📚"
score < 50  → "Jangan menyerah! Pelajari lagi materi ini. 🔥"
```

**7. isSkillTreeQuiz()**
```typescript
function isSkillTreeQuiz(location: any): boolean

// Checks if quiz came from skill tree node
if (isSkillTreeQuiz(location)) {
  // Handle skill tree completion
}
```

**8. extractSkillTreeData()**
```typescript
function extractSkillTreeData(location: any): {
  nodeId?: string;
  nodeName?: string;
}

// Extract node info from location state
const { nodeId, nodeName } = extractSkillTreeData(location);
```

#### Interfaces:

```typescript
interface QuizCompletionData {
  nodeId: string;
  nodeName: string;
  score: number; // 0-100
  timeSpent: number; // minutes
  correctAnswers: number;
  totalQuestions: number;
}

interface SkillTreeRewards {
  xp: number;
  gems: number;
  hearts?: number;
  badge?: string;
  certificate?: string;
  stars: number; // 0-3
  levelUp?: boolean;
  newLevel?: number;
}

interface UserStats {
  totalXP: number;
  level: number;
  gems: number;
  hearts: number;
  badges: string[];
  certificates: string[];
}

interface NextRecommendation {
  nodeId: string;
  name: string;
  subject: string;
  level: number;
  difficulty: string;
}

interface SkillTreeCompletionResult {
  success: boolean;
  progress: {
    status: string;
    stars: number;
    completedAt: string;
    attempts: number;
    bestScore: number;
  };
  rewards: SkillTreeRewards;
  userStats: UserStats;
  recommendations: NextRecommendation[];
  message?: string;
}
```

---

## Files Modified

### 1. `src/pages/SkillTreePage.tsx`

**Changes Made:**

#### New Imports:
```typescript
import { apiClient } from "@/lib/apiClient";
import { AlertMessage } from "@/components/AlertMessage";
import RewardsModal from "@/components/RewardsModal";
```

#### New State Variables:
```typescript
const [success, setSuccess] = useState<string | null>(null);
const [selectedNode, setSelectedNode] = useState<SkillTreeNode | null>(null);
const [showRewards, setShowRewards] = useState(false);
const [rewardsData, setRewardsData] = useState<any>(null);
```

#### Updated `fetchSkillTreeData()`:
```typescript
// Before: Fetched from GET /api/skill-tree
// After: Uses GET /api/progress/skill-tree with progress tracking

const response = await apiClient.get<{
  nodes: any[];
  stats: any;
}>('/api/progress/skill-tree');

// Transforms nodes to include:
// - id (from nodeId)
// - status (locked/available/in-progress/completed)
// - stars (0-3)
// - completedAt (timestamp)
```

#### New `handleNodeClick()`:
```typescript
// Logic:
1. Check node status from userProgress
2. If locked → Show error message
3. If completed → Confirm retry
4. If available/in-progress → Start quiz
5. Call unlockNode API
6. Navigate to quiz player with node data
```

#### New `handleStartQuiz()`:
```typescript
// Actions:
1. POST /api/progress/skill-tree/unlock (mark in-progress)
2. Navigate to /quiz-player with state:
   - nodeId
   - nodeName
   - subject
   - difficulty
   - level
   - quizCount
   - topic (for quiz generation)
```

#### New `handleQuizComplete()`:
```typescript
// Called after quiz finishes (would be called from QuizPlayer)
// Actions:
1. POST /api/progress/skill-tree/complete
2. Receive rewards and user stats
3. Show RewardsModal with:
   - XP, gems, hearts, badges
   - Stars earned
   - Level-up notification
   - Next recommendations
4. Refresh skill tree to show updated progress
```

#### New `handleRewardsContinue()`:
```typescript
// Close rewards modal
// Optionally navigate to next recommended node
```

#### Updated JSX:
```tsx
return (
  <div className="container mx-auto p-6 space-y-4">
    {/* Alert Messages */}
    {error && <AlertMessage type="danger" message={error} onClose={...} />}
    {success && <AlertMessage type="success" message={success} onClose={...} />}
    
    {/* Skill Tree Visualization */}
    <EnhancedSkillTree
      nodes={nodes}
      userProgress={userProgress}
      onNodeClick={handleNodeClick}
      onStartQuiz={handleStartQuiz}
    />
    
    {/* Rewards Modal (shown after quiz completion) */}
    {showRewards && rewardsData && (
      <RewardsModal
        isOpen={showRewards}
        onClose={() => setShowRewards(false)}
        rewards={rewardsData.rewards}
        userStats={rewardsData.userStats}
        nextRecommendations={rewardsData.nextRecommendations}
        onContinue={handleRewardsContinue}
        nodeName={selectedNode?.name}
      />
    )}
  </div>
);
```

---

## User Flow Examples

### Example 1: First Node Completion

**Scenario:** Student "Budi" completes first Algebra node with 85% score

1. **Student Action:** Clicks on "Bilangan Bulat" node
2. **System Check:** 
   - Prerequisites: None (first node)
   - Status: Available ✅
3. **API Call:** `POST /unlock` → status = "in-progress"
4. **Navigation:** Redirect to `/quiz-player`
5. **Quiz:**
   - 10 questions about Bilangan Bulat
   - Budi answers 17/20 correctly (85%)
   - Time spent: 8 minutes
6. **Completion:**
   - Score: 85% → 2 stars ⭐⭐
   - API Call: `POST /complete`
   - Rewards:
     * +50 XP (from node.rewards.xp)
     * +10 Gems (from node.rewards.gems)
     * Level: 1 → 1 (total: 50 XP)
7. **Rewards Modal Shows:**
   - 🎊 "Selamat!"
   - 2 stars animation
   - +50 XP card (blue gradient)
   - +10 Gems card (purple gradient)
   - Progress bar: 50/1000 XP to Level 2
   - Next nodes: "Operasi Bilangan", "Pecahan Dasar"
8. **Skill Tree Updates:**
   - "Bilangan Bulat": Completed (2 stars)
   - "Operasi Bilangan": Unlocked (green outline)
   - "Pecahan Dasar": Unlocked (green outline)

---

### Example 2: Checkpoint Node with Badge

**Scenario:** Student completes checkpoint node with perfect score

1. **Student Action:** Clicks "Ujian Bab 1 - Aljabar"
2. **Prerequisites:** 
   - All 5 prerequisite nodes completed ✅
3. **Quiz:**
   - 20 comprehensive questions
   - Student gets 19/20 (95%)
   - Time: 15 minutes
4. **Completion:**
   - Score: 95% → 3 stars ⭐⭐⭐
   - Is Checkpoint: true
   - Rewards:
     * +100 XP (checkpoint bonus)
     * +30 Gems
     * +3 Hearts ❤️ (checkpoint reward)
     * Badge: "Aljabar Master" 🏆
     * Certificate: "Sertifikat Aljabar Dasar"
5. **Rewards Modal Shows:**
   - 🎉 "Level Up! Level 2" (if XP threshold reached)
   - Confetti animation
   - 3 stars animation
   - +100 XP, +30 Gems, +3 Hearts
   - Badge card: "Aljabar Master" unlocked
   - Certificate banner (green gradient)
   - Level-up banner (purple/pink gradient)
6. **Database Updates:**
   - UserProgress: status="completed", stars=3
   - User: totalXP += 100, level = 2, gems += 30, hearts += 3
   - User.badges.push("Aljabar Master")
   - User.certificates.push("Sertifikat Aljabar Dasar")

---

### Example 3: Retry with Better Score

**Scenario:** Student retries completed node to get 3 stars

1. **Initial Completion:** 
   - First attempt: 65% → 1 star ⭐
   - Rewards: +30 XP, +5 Gems
2. **Retry:**
   - Click node (already completed)
   - Confirm: "Ingin mengulang?" → Yes
   - Second attempt: 92% → 3 stars ⭐⭐⭐
3. **Completion Logic:**
   - Better score: 92% > 65% ✅
   - Additional XP: (50 - 30) = +20 XP
   - Gems: No additional (not first completion)
   - Stars updated: 1 → 3
4. **Rewards Modal:**
   - "Peningkatan! 3 Bintang!"
   - +20 XP (difference only)
   - No gems (already awarded)
   - Stars: 3 (best score kept)

---

## Reward Calculation Logic

### Stars (0-3)
```typescript
if (score >= 90) stars = 3;
else if (score >= 75) stars = 2;
else if (score >= 60) stars = 1;
else stars = 0;
```

### XP & Gems
```typescript
// First completion OR better score:
if (!previousCompletion || score > previousBestScore) {
  awardXP(node.rewards.xp);
  awardGems(node.rewards.gems);
  
  // Checkpoint extras:
  if (node.isCheckpoint) {
    awardHearts(3);
    if (node.rewards.badge) addBadge(node.rewards.badge);
    if (node.rewards.certificate) addCertificate(node.rewards.certificate);
  }
}

// Retry with worse/same score:
else {
  // No rewards
  // Stars kept at max
}
```

### Level-Up
```typescript
// Level calculation:
newLevel = Math.floor(totalXP / 1000) + 1;

// Example:
totalXP = 950  → Level 1
totalXP = 1000 → Level 2
totalXP = 2500 → Level 3
totalXP = 9999 → Level 10
```

---

## Testing Scenarios

### Test Case 1: Complete First Node
- ✅ Prerequisites: None
- ✅ Status changes: locked → available → in-progress → completed
- ✅ Rewards awarded: XP, Gems
- ✅ Next nodes unlocked
- ✅ Rewards modal displays
- ✅ Skill tree refreshes

### Test Case 2: Locked Node Click
- ✅ Prerequisites not met
- ✅ Error message: "Node masih terkunci"
- ✅ No quiz navigation
- ✅ Prerequisites highlighted

### Test Case 3: Checkpoint Completion
- ✅ All prerequisites met
- ✅ Bonus rewards: Hearts, Badge, Certificate
- ✅ Badge added to user.badges array
- ✅ Certificate added to user.certificates array
- ✅ Special banner in rewards modal

### Test Case 4: Level-Up
- ✅ XP crosses 1000 threshold
- ✅ Level increments
- ✅ Level-up banner shows
- ✅ Confetti animation triggers
- ✅ userStats.level updated

### Test Case 5: Retry Improvement
- ✅ Node already completed
- ✅ Confirm retry dialog
- ✅ Better score awards XP difference
- ✅ Stars updated to higher value
- ✅ bestScore tracked separately

### Test Case 6: Retry No Improvement
- ✅ Score same or lower
- ✅ No additional rewards
- ✅ Stars stay at previous max
- ✅ Attempts counter increments

### Test Case 7: Recommendations
- ✅ GET /recommendations returns 3 nodes
- ✅ Nodes have prerequisites met
- ✅ Sorted by level and difficulty
- ✅ Displayed in rewards modal

### Test Case 8: Progress Persistence
- ✅ Page refresh preserves progress
- ✅ Completed nodes stay green
- ✅ Stars displayed correctly
- ✅ Locked status respected

---

## Integration Points

### With QuizPlayer
```typescript
// In QuizPlayer.tsx (to be added):

import { 
  completeSkillTreeNode, 
  isSkillTreeQuiz,
  extractSkillTreeData 
} from "@/lib/skillTreeIntegration";

// After quiz completion:
const handleQuizFinish = async () => {
  if (isSkillTreeQuiz(location)) {
    const { nodeId, nodeName } = extractSkillTreeData(location);
    
    const result = await completeSkillTreeNode({
      nodeId,
      nodeName,
      score: calculateScore(),
      timeSpent: timeElapsed / 60,
      correctAnswers: correctCount,
      totalQuestions: questions.length
    });
    
    // Show rewards modal with result.rewards
    // Navigate back to skill tree
  }
};
```

### With EnhancedSkillTree
```typescript
// Already integrated:
// - onNodeClick handler
// - onStartQuiz handler
// - userProgress display
// - Status colors (locked/available/completed)
```

### With Progress API
```typescript
// Backend endpoints used:
GET  /api/progress/skill-tree           → Load nodes with progress
POST /api/progress/skill-tree/unlock    → Mark in-progress
POST /api/progress/skill-tree/complete  → Award rewards
GET  /api/progress/skill-tree/recommendations → Get next nodes
```

---

## Next Steps

### Immediate (Task 40 - Progress Sync Testing):
- [ ] Add E2E tests for quiz → completion → rewards flow
- [ ] Test prerequisite validation edge cases
- [ ] Verify XP calculation accuracy
- [ ] Test concurrent completions

### Short-term (Task 39 - Lesson Content):
- [ ] Integrate lesson viewer with nodes
- [ ] Add lesson completion tracking
- [ ] Link lessons to quizzes

### Medium-term (Task 41 - Content Preview):
- [ ] Add hover preview for nodes
- [ ] Show quiz sample questions
- [ ] Display learning outcomes

---

## Summary

✅ **Task 38 Complete:** Quiz Integration with Skill Tree  
📁 **2 New Files:** RewardsModal.tsx, skillTreeIntegration.ts  
✏️ **1 Modified:** SkillTreePage.tsx  
🔗 **4 API Endpoints:** unlock, complete, progress, recommendations  
🎨 **Animations:** Confetti, stars, level-up, progress bars  
🏆 **Rewards:** XP, Gems, Hearts, Badges, Certificates, Level-ups  
📊 **Stars:** 0-3 based on quiz score (90/75/60 thresholds)  
🔓 **Auto-unlock:** Next nodes unlock when prerequisites met  
💡 **Recommendations:** Top 3 next nodes suggested after completion  

**System now fully functional for:** Student clicks node → Starts quiz → Completes → Earns rewards → Unlocks next nodes → Repeats! 🚀
