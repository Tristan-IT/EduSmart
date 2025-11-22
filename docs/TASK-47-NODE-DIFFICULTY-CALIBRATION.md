# Task 47: Node Difficulty Calibration

**Status**: ✅ Completed  
**Date**: November 22, 2025  
**Developer**: AI Assistant

---

## Overview

Implemented an intelligent difficulty calibration system that analyzes student performance data to automatically adjust node difficulty levels and rewards. This ensures nodes remain appropriately challenging and rewards are balanced based on actual student outcomes.

---

## Features Implemented

### 1. Performance Metrics Analysis

**Service**: `difficultyCalibrationService.ts`

Comprehensive metrics calculation for each node:
- **Completion Rate**: % of students who passed after attempting
- **Average Score**: Mean score across all attempts
- **Perfect Score Rate**: % achieving 100% score
- **Average Attempts**: Mean number of tries to complete
- **Dropoff Rate**: % who attempted but never completed
- **Average Time Spent**: Time investment per node

### 2. Smart Difficulty Detection

**Algorithm**: Multi-factor analysis
```typescript
// Too Easy Detection
if (averageScore >= 90 && completionRate >= 85 && perfectScoreRate >= 40) {
  recommendDifficultyIncrease();
}

// Too Hard Detection
if (averageScore < 65 || completionRate < 40 || dropoffRate > 50 || averageAttempts > 3) {
  recommendDifficultyDecrease();
}
```

**Difficulty Levels**:
- `beginner` → 1.0x XP multiplier
- `intermediate` → 1.5x XP multiplier
- `advanced` → 2.0x XP multiplier
- `expert` → 2.5x XP multiplier
- `hard` → 3.0x XP multiplier

### 3. Automatic Reward Adjustment

When difficulty changes, rewards auto-scale:
```typescript
Base XP: 50 points
Base Gems: 5 gems

Example:
- Beginner: 50 XP, 5 gems
- Intermediate: 75 XP, 8 gems
- Advanced: 100 XP, 10 gems
- Expert: 125 XP, 13 gems
- Hard: 150 XP, 15 gems
```

### 4. Calibration Confidence Score

**Calculation**: `(uniqueStudents / 20) * 100`
- Minimum 10 students for suggestions
- Minimum 20 students for auto-calibration
- Maximum 100% confidence at 20+ students

### 5. Difficulty Distribution Analytics

Track node distribution across difficulty levels:
- Count per difficulty
- Percentage of total nodes
- Average student performance per difficulty
- Visual progress bars

---

## Backend Implementation

### API Endpoints

#### 1. Get Node Metrics
```
GET /api/skill-tree/nodes/:nodeId/metrics
Auth: Teacher/School Owner
```

Response:
```json
{
  "success": true,
  "metrics": {
    "nodeId": "...",
    "totalAttempts": 45,
    "uniqueStudents": 15,
    "completionRate": 73.3,
    "averageScore": 68.2,
    "averageAttempts": 2.1,
    "averageTimeSpent": 450,
    "perfectScoreRate": 13.3,
    "dropoffRate": 26.7,
    "recommendedDifficulty": "intermediate",
    "currentDifficulty": "advanced",
    "shouldAdjust": true,
    "adjustmentReason": "Node is too hard - low scores or high dropoff rate"
  }
}
```

#### 2. Apply Calibration
```
PATCH /api/skill-tree/nodes/:nodeId/calibrate
Auth: Teacher/School Owner
Body: { "newDifficulty": "intermediate", "autoAdjustRewards": true }
```

Response:
```json
{
  "success": true,
  "adjustment": {
    "nodeId": "...",
    "oldDifficulty": "advanced",
    "newDifficulty": "intermediate",
    "oldXpReward": 100,
    "newXpReward": 75,
    "oldGemsReward": 10,
    "newGemsReward": 8,
    "reason": "Manual adjustment",
    "confidence": 75
  }
}
```

#### 3. Get Calibration Suggestions
```
GET /api/skill-tree/calibration/suggestions?subject=Math&minStudents=10
Auth: Teacher/School Owner
```

Returns array of nodes needing adjustment, sorted by confidence (student count).

#### 4. Auto-Calibrate
```
POST /api/skill-tree/calibration/auto
Auth: Teacher/School Owner
Body: { "subject": "Math", "minStudents": 20, "dryRun": false }
```

**Dry Run Mode**: Preview changes without applying them.

Response:
```json
{
  "success": true,
  "adjustments": [...],
  "count": 8,
  "dryRun": false
}
```

#### 5. Get Difficulty Distribution
```
GET /api/skill-tree/calibration/distribution?subject=Math
Auth: Teacher/School Owner
```

Response:
```json
{
  "success": true,
  "distribution": {
    "beginner": 12,
    "intermediate": 18,
    "advanced": 10,
    "expert": 5,
    "hard": 2
  },
  "totalNodes": 47,
  "averageScoreByDifficulty": {
    "beginner": 85.3,
    "intermediate": 72.1,
    "advanced": 65.8,
    "expert": 58.2,
    "hard": 51.4
  }
}
```

### Service Functions

**difficultyCalibrationService.ts**:
- `calculateNodeMetrics(nodeId)` - Aggregate performance data
- `applyDifficultyAdjustment(nodeId, newDifficulty, autoAdjustRewards)` - Update node
- `getCalibrationSuggestions(subject?, minStudents)` - Find nodes needing adjustment
- `autoCalibrate(subject?, minStudents, dryRun)` - Batch update eligible nodes
- `getDifficultyDistribution(subject?)` - Get overview statistics

### Controller Functions

**skillTreeController.ts** - Added 5 new controllers:
- `getNodeMetricsController`
- `calibrateNodeController`
- `getCalibrationSuggestionsController`
- `autoCalibrationController`
- `getDifficultyDistributionController`

### Middleware

**authenticate.ts** - Added `requireTeacher` middleware:
```typescript
export const requireTeacher: RequestHandler = (req, res, next) => {
  if (user.role !== 'teacher' && user.role !== 'school_owner') {
    return res.status(403).json({ 
      message: "Access denied. Teachers/owners only." 
    });
  }
  next();
};
```

---

## Frontend Implementation

### React Hooks

**useCalibration.ts** - 5 custom hooks:

```typescript
// Get metrics for specific node
const { metrics, loading, error } = useNodeMetrics(nodeId);

// Get calibration suggestions
const { suggestions, loading, error, refresh } = 
  useCalibrationSuggestions(subject, minStudents);

// Apply calibration to node
const { calibrate, loading, error } = useCalibrateNode();
const result = await calibrate(nodeId, 'intermediate', true);

// Run auto-calibration
const { autoCalibrate, loading, error } = useAutoCalibrate();
const adjustments = await autoCalibrate('Math', 20, false);

// Get difficulty distribution
const { distribution, loading, error, refresh } = 
  useDifficultyDistribution(subject);
```

### UI Components

#### CalibrationDashboard.tsx

**Main Features**:
- Two-tab interface: Suggestions & Distribution
- Auto-calibrate with dry-run simulation
- Subject filtering
- Real-time data refresh

**Suggestions Tab**:
- Card-based layout for each suggestion
- Performance metrics display
- One-click apply calibration
- Difficulty change indicators (↑ harder / ↓ easier)
- Adjustment reason alerts

**Metrics Displayed**:
- 👥 Unique Students
- 🎯 Completion Rate (color-coded: green ≥60%, red <60%)
- 🏆 Average Score (color-coded: green ≥70%, orange <70%)
- 📊 Perfect Score Rate
- Progress bars for completion & attempts

**Distribution Tab**:
- Total nodes summary card
- Most common difficulty badge
- Difficulty variation count
- Visual distribution bars
- Average score per difficulty level

#### CalibrationPage.tsx

Wrapper page component providing full-page layout.

### Navigation Integration

**AppSidebar.tsx** - Teacher menu item:
```tsx
{ title: "Kalibrasi", url: "/calibration", icon: Gauge }
```

**App.tsx** - Protected route:
```tsx
<Route 
  path="/calibration" 
  element={
    <ProtectedRoute allowRoles={["teacher", "school_owner"]}>
      <CalibrationPage />
    </ProtectedRoute>
  } 
/>
```

---

## Usage Examples

### For Teachers

#### 1. View Suggestions Dashboard
1. Navigate to "Kalibrasi" in sidebar
2. View list of nodes needing adjustment
3. Review metrics and reasons
4. Click "Terapkan" to apply individual changes

#### 2. Run Simulation
1. Click "Simulasi Auto-Kalibrasi"
2. Review proposed changes
3. Decide whether to proceed

#### 3. Auto-Calibrate
1. Click "Auto-Kalibrasi"
2. System adjusts all eligible nodes (20+ students)
3. Toast notification confirms changes
4. Dashboard refreshes automatically

#### 4. Check Distribution
1. Switch to "Distribusi Kesulitan" tab
2. View node counts per difficulty
3. Compare average scores across levels
4. Identify imbalances

### API Usage Examples

#### Get Node Metrics
```typescript
const response = await apiClient.get('/skill-tree/nodes/673fb8a1/metrics');
console.log(response.data.metrics);
```

#### Manual Calibration
```typescript
await apiClient.patch('/skill-tree/nodes/673fb8a1/calibrate', {
  newDifficulty: 'intermediate',
  autoAdjustRewards: true
});
```

#### Auto-Calibrate Math Nodes
```typescript
const response = await apiClient.post('/skill-tree/calibration/auto', {
  subject: 'Matematika',
  minStudents: 20,
  dryRun: false
});
console.log(`${response.data.count} nodes adjusted`);
```

---

## Technical Details

### Data Flow

```
1. Student completes nodes → UserProgress updated
2. Teacher opens Calibration Dashboard
3. Frontend calls /calibration/suggestions
4. Backend aggregates UserProgress data
5. Service calculates metrics per node
6. Algorithm determines if adjustment needed
7. Returns sorted suggestions (by student count)
8. Teacher reviews & clicks "Terapkan"
9. Frontend calls /calibrate endpoint
10. Backend updates SkillTreeNode difficulty & rewards
11. Toast confirms success
12. Dashboard refreshes data
```

### Performance Considerations

**Optimizations**:
- Suggestions filtered by minimum student count (avoid low-confidence data)
- Sorted by confidence (high sample sizes first)
- Cached metrics for distribution view
- Batch updates with auto-calibrate
- Progress tracking with loading states

**Scalability**:
- Handles hundreds of nodes efficiently
- Aggregation queries use MongoDB indexes
- Frontend pagination-ready (future enhancement)

### Security

**Access Control**:
- All calibration endpoints require `requireTeacher` middleware
- Students cannot access calibration features
- Role checked: `teacher` OR `school_owner`
- Protected route on frontend

**Validation**:
- Minimum student thresholds prevent premature adjustments
- Difficulty levels validated against enum
- Node existence verified before updates
- Error handling for invalid IDs

---

## File Structure

### Backend Files
```
server/src/
├── services/
│   └── difficultyCalibrationService.ts (NEW - 450 lines)
├── controllers/
│   └── skillTreeController.ts (MODIFIED - added 5 functions)
├── routes/
│   └── skillTree.ts (MODIFIED - added 5 routes)
└── middleware/
    └── authenticate.ts (MODIFIED - added requireTeacher)
```

### Frontend Files
```
src/
├── hooks/
│   └── useCalibration.ts (NEW - 200 lines)
├── components/
│   └── CalibrationDashboard.tsx (NEW - 400 lines)
├── pages/
│   └── CalibrationPage.tsx (NEW - 20 lines)
├── App.tsx (MODIFIED - added route & import)
└── components/
    └── AppSidebar.tsx (MODIFIED - added nav item)
```

---

## Testing Recommendations

### Manual Tests

1. **Insufficient Data Test**
   - Create node with <10 students
   - Verify it doesn't appear in suggestions

2. **Too Easy Node Test**
   - Create node with 90%+ average score
   - Verify recommendation to increase difficulty
   - Apply calibration
   - Verify XP/gems increased

3. **Too Hard Node Test**
   - Create node with <65% average score
   - Verify recommendation to decrease difficulty
   - Apply calibration
   - Verify XP/gems decreased

4. **Auto-Calibrate Dry Run**
   - Run with dryRun=true
   - Verify no actual changes made
   - Compare preview with actual run

5. **Distribution View**
   - Add nodes across all difficulties
   - Verify counts match database
   - Check average scores accurate

### Automated Tests (Future)

```typescript
describe('Difficulty Calibration', () => {
  test('calculates metrics correctly', async () => {
    const metrics = await calculateNodeMetrics(nodeId);
    expect(metrics.completionRate).toBeLessThan(100);
  });

  test('recommends easier difficulty for hard nodes', async () => {
    // Mock low performance data
    const metrics = await calculateNodeMetrics(hardNodeId);
    expect(metrics.shouldAdjust).toBe(true);
    expect(getDifficultyIndex(metrics.recommendedDifficulty))
      .toBeLessThan(getDifficultyIndex(metrics.currentDifficulty));
  });

  test('applies calibration correctly', async () => {
    const adjustment = await applyDifficultyAdjustment(
      nodeId, 'intermediate', true
    );
    expect(adjustment.newDifficulty).toBe('intermediate');
    expect(adjustment.newXpReward).toBe(75);
  });
});
```

---

## Future Enhancements

### Potential Improvements

1. **Machine Learning Integration**
   - Train model on historical data
   - Predict optimal difficulty before launch
   - Personalized difficulty per student

2. **A/B Testing**
   - Split students between difficulty levels
   - Compare performance outcomes
   - Statistical significance testing

3. **Time-Based Analysis**
   - Track difficulty changes over time
   - Seasonal adjustment patterns
   - Curriculum evolution visualization

4. **Student Feedback Integration**
   - Survey perceived difficulty
   - Combine with performance metrics
   - Sentiment analysis on comments

5. **Advanced Visualizations**
   - Line charts showing score trends
   - Heat maps of difficulty across curriculum
   - Comparison charts (before/after calibration)

6. **Batch Import/Export**
   - Export calibration settings
   - Import calibrations across schools
   - Template sharing between teachers

7. **Notifications**
   - Alert teachers when nodes need calibration
   - Weekly calibration reports
   - Performance anomaly detection

---

## Integration Points

### Works With
- **Task 40**: Uses UserProgress data for metrics
- **Task 42**: Achievement difficulty can align with node difficulty
- **Task 43**: Recommendations consider calibrated difficulty
- **Task 45**: Prerequisites validation uses current difficulty
- **Task 46**: Bulk operations can apply calibrations

### Extends
- **SkillTreeNode Model**: Reads difficulty, XP, gems fields
- **UserProgress Model**: Aggregates completedNodes data
- **Authentication**: Uses requireTeacher middleware

---

## Accessibility

**UI Features**:
- Color-coded indicators with text labels
- Icon + text for visual clarity
- Progress bars with percentage labels
- Keyboard navigation support
- Screen reader compatible badges

**UX Considerations**:
- Loading skeletons during data fetch
- Toast notifications for confirmations
- Error alerts for failures
- Disabled buttons during processing
- Tooltip explanations (future)

---

## Internationalization

**Indonesian Labels**:
- "Kalibrasi" → Calibration
- "Pemula" → Beginner
- "Menengah" → Intermediate
- "Lanjutan" → Advanced
- "Ahli" → Expert
- "Sulit" → Hard
- "Terapkan" → Apply
- "Simulasi Auto-Kalibrasi" → Auto-Calibrate Simulation

**Ready for i18n**:
- All UI strings extracted to constants (future)
- API returns English keys, frontend translates
- Difficulty enum uses English internally

---

## Conclusion

Task 47 delivers a comprehensive difficulty calibration system that empowers teachers to maintain optimal challenge levels across the skill tree. By analyzing real student performance data, the system provides actionable recommendations and automates bulk adjustments, ensuring students remain engaged without being overwhelmed or under-challenged.

**Key Benefits**:
✅ Data-driven difficulty adjustments  
✅ Automatic reward balancing  
✅ Teacher efficiency with auto-calibration  
✅ Confidence scoring prevents premature changes  
✅ Visual analytics for curriculum insights  
✅ Secure teacher-only access  

**Impact**: Improves student retention, engagement, and learning outcomes by ensuring appropriately challenging content.
