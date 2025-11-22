# TODO LIST: Integrasi MongoDB untuk Adapti Portal

> **Platform**: Website pembelajaran adaptif dengan gamifikasi (Duolingo-style)  
> **Tech Stack**: React + TypeScript (Frontend), Express + MongoDB + Mongoose (Backend)  
> **Status**: Mock data ready, perlu integrasi database MongoDB

---

## 📊 ANALISIS KESELURUHAN WEBSITE

### Fitur Utama yang Sudah Ada
1. **Sistem Autentikasi** - Login/register dengan Google OAuth & JWT
2. **Gamifikasi Lengkap** - XP, levels, streaks, leagues (Bronze → Quantum)
3. **Skill Tree** - 15+ modul pembelajaran dengan dependencies
4. **Quiz System** - 2982+ soal dengan multiple choice & short answer
5. **Achievement System** - 20+ achievements dengan progress tracking
6. **AI Mentor Chat** - Chat assistant untuk bimbingan belajar
7. **League System** - 6 tier kompetisi mingguan dengan promotion/demotion
8. **Gem/Currency System** - Virtual currency untuk power-ups
9. **Daily Goals** - Target harian dengan rewards
10. **Teacher Dashboard** - Monitoring siswa, laporan kelas
11. **Content Library** - Video, PDF, slides pembelajaran
12. **Telemetry System** - Event tracking untuk analytics

### Struktur Database yang Sudah Ada
```
Models (server/src/models/):
├── User.ts - Data user (student/teacher/admin)
├── StudentProfile.ts - Profile gamifikasi siswa
├── TeacherProfile.ts - Profile & class management guru
├── QuizQuestion.ts - Bank soal quiz
├── ContentItem.ts - Library konten pembelajaran
├── MentorSession.ts - Riwayat chat dengan AI mentor
├── Report.ts - Generated reports
├── TelemetryEvent.ts - Event tracking
└── Topic.ts - Topik pembelajaran
```

### Mock Data yang Perlu Dimigrasikan
```
src/data/:
├── gamificationData.ts - Achievements, leaderboards
├── gamifiedLessons.ts - Skill tree structure
├── learningModules.ts - 15+ modul dengan teori, video, latihan (1444 lines)
├── quizBank.ts - 2982 soal quiz (algebra, geometry, dll)
├── skillTree.ts - 15 nodes skill tree dengan prerequisites
├── leagueSystem.ts - 6 tier league dengan rules
├── gemSystem.ts - Gem earning/spending system
└── aiChatData.ts - Chat history & AI prompts
```

---

## ✅ TODO LIST LENGKAP

### **FASE 1: PERSIAPAN & SETUP** 🔧

#### 1.1 Environment & Dependencies
- [ ] Verifikasi MongoDB Atlas sudah tersedia atau setup local MongoDB
- [ ] Update file `.env` di folder `server/` dengan:
  ```env
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
  JWT_SECRET=<generate-strong-secret>
  SESSION_SECRET=<generate-strong-secret>
  PORT=5000
  CLIENT_ORIGIN=http://localhost:5173
  GOOGLE_CLIENT_ID=<optional>
  GOOGLE_CLIENT_SECRET=<optional>
  ```
- [ ] Test koneksi database dengan menjalankan server: `cd server && npm run dev`
- [ ] Verifikasi dependencies sudah terinstall (mongoose, bcryptjs, jsonwebtoken, dll)

#### 1.2 Database Schema Review
- [ ] Review semua models di `server/src/models/` untuk memastikan schema sesuai kebutuhan
- [ ] Tambah indexes untuk performa:
  - [ ] `User.email` (unique index) - sudah ada
  - [ ] `StudentProfile.user` (unique index) - sudah ada
  - [ ] `QuizQuestion.topicId` (index)
  - [ ] `MentorSession.student` (index)
  - [ ] `TelemetryEvent.userId` + `eventType` (compound index)
- [ ] Tambah model baru jika diperlukan (lihat bagian Fase 2)

---

### **FASE 2: MODEL & SCHEMA TAMBAHAN** 📝

#### 2.1 Achievement Model (Baru)
- [ ] Buat file `server/src/models/Achievement.ts`
  ```typescript
  - achievementId: string (unique)
  - title: string
  - description: string
  - icon: string
  - category: string
  - xpReward: number
  - gemsReward: number
  - condition: object (JSON schema untuk check condition)
  ```
- [ ] Buat file `server/src/models/UserAchievement.ts`
  ```typescript
  - user: ObjectId (ref User)
  - achievement: ObjectId (ref Achievement)
  - progress: number
  - total: number
  - unlocked: boolean
  - unlockedAt: Date
  - createdAt/updatedAt
  ```

#### 2.2 Lesson/Module Model (Baru)
- [ ] Buat file `server/src/models/LearningModule.ts`
  ```typescript
  - moduleId: string (unique)
  - categoryId: string
  - categoryName: string
  - title: string
  - description: string
  - difficulty: enum
  - estimatedDuration: string
  - prerequisites: string[]
  - learningObjectives: string[]
  - theory: object (sections dengan content)
  - video: object (youtubeUrl, duration, dll)
  - exercises: array (soal-soal)
  ```

#### 2.3 Skill Tree Model (Baru)
- [ ] Buat file `server/src/models/SkillTreeNode.ts`
  ```typescript
  - nodeId: string (unique)
  - moduleId: string (ref LearningModule)
  - title: string
  - categoryId/categoryName: string
  - position: object {x, y}
  - status: enum (locked/current/completed)
  - stars: number
  - xpReward: number
  - prerequisites: string[]
  - isCheckpoint: boolean
  - difficulty: enum
  ```
- [ ] Buat file `server/src/models/UserProgress.ts`
  ```typescript
  - user: ObjectId (ref User)
  - nodeId: string (ref SkillTreeNode)
  - status: enum
  - stars: number
  - completedAt: Date
  - attempts: number
  - bestScore: number
  ```

#### 2.4 League/Competition Model (Baru)
- [ ] Buat file `server/src/models/LeagueStanding.ts`
  ```typescript
  - weekStart: Date
  - weekEnd: Date
  - league: enum (bronze/silver/gold/diamond/platinum/quantum)
  - standings: array [{userId, rank, weeklyXP, trend}]
  - lastUpdated: Date
  ```
- [ ] Update `StudentProfile` model untuk menambah field:
  ```typescript
  - gems: number (virtual currency)
  - achievements: ObjectId[] (ref UserAchievement)
  - completedModules: ObjectId[] (ref LearningModule)
  - skillTreeProgress: ObjectId[] (ref UserProgress)
  ```

#### 2.5 Gem Transaction Model (Baru)
- [ ] Buat file `server/src/models/GemTransaction.ts`
  ```typescript
  - user: ObjectId (ref User)
  - type: enum (earn/spend)
  - amount: number
  - reason: string
  - balance: number (balance after transaction)
  - createdAt: Date
  ```

---

### **FASE 3: SEEDING DATA** 🌱

#### 3.1 Create Seed Script
- [ ] Buat file `server/src/scripts/seedAchievements.ts`
  - [ ] Migrate data dari `src/data/gamificationData.ts` → Achievement collection
  - [ ] Total: ~20+ achievements

- [ ] Buat file `server/src/scripts/seedModules.ts`
  - [ ] Migrate data dari `src/data/learningModules.ts` → LearningModule collection
  - [ ] Total: 15+ modules (algebra, geometry, statistics, dll)
  - [ ] Include theory sections, videos, exercises

- [ ] Buat file `server/src/scripts/seedQuizzes.ts`
  - [ ] Migrate data dari `src/data/quizBank.ts` → QuizQuestion collection
  - [ ] Total: 2982 soal quiz
  - [ ] Kategorisasi: algebra (50), geometry (50), statistics (50), dll

- [ ] Buat file `server/src/scripts/seedSkillTree.ts`
  - [ ] Migrate data dari `src/data/skillTree.ts` → SkillTreeNode collection
  - [ ] Total: 15 nodes dengan prerequisites

- [ ] Buat file `server/src/scripts/seedLeagues.ts`
  - [ ] Setup initial league metadata dari `src/data/leagueSystem.ts`
  - [ ] 6 tier: Bronze, Silver, Gold, Diamond, Platinum, Quantum

- [ ] Buat master seed script `server/src/scripts/seedAll.ts`
  ```typescript
  // Run all seed scripts in order
  await seedAchievements();
  await seedModules();
  await seedQuizzes();
  await seedSkillTree();
  await seedLeagues();
  ```

#### 3.2 Test Data Seeds
- [ ] Tambahkan npm script di `server/package.json`: `"seed": "tsx src/scripts/seedAll.ts"`
- [ ] Run seeding: `npm run seed`
- [ ] Verifikasi data masuk ke MongoDB (gunakan MongoDB Compass atau Atlas UI)
- [ ] Test query dasar untuk memastikan indexes bekerja

---

### **FASE 4: SERVICE LAYER** 🔨

#### 4.1 Achievement Service
- [ ] Buat file `server/src/services/achievementService.ts`
  - [ ] `getAllAchievements()` - Get all achievement definitions
  - [ ] `getUserAchievements(userId)` - Get user's achievement progress
  - [ ] `checkAndUnlockAchievements(userId, context)` - Auto-check achievements
  - [ ] `unlockAchievement(userId, achievementId)` - Manually unlock
  - [ ] `getAchievementProgress(userId, achievementId)` - Get specific progress

#### 4.2 Module/Lesson Service
- [ ] Buat file `server/src/services/moduleService.ts`
  - [ ] `getAllModules()` - Get all learning modules
  - [ ] `getModuleById(moduleId)` - Get specific module
  - [ ] `getModulesByCategory(categoryId)` - Filter by category
  - [ ] `getModuleExercises(moduleId)` - Get exercises for module
  - [ ] `completeModule(userId, moduleId, score)` - Mark module complete
  - [ ] `getUserModuleProgress(userId)` - Get user's progress across modules

#### 4.3 Skill Tree Service
- [ ] Buat file `server/src/services/skillTreeService.ts`
  - [ ] `getSkillTree()` - Get complete skill tree structure
  - [ ] `getUserSkillTree(userId)` - Get user's personalized skill tree
  - [ ] `unlockNode(userId, nodeId)` - Unlock a skill node
  - [ ] `completeNode(userId, nodeId, stars)` - Complete with star rating
  - [ ] `getNextAvailableNodes(userId)` - Get unlocked/available nodes
  - [ ] `calculateTreeProgress(userId)` - Overall completion %

#### 4.4 Gamification Service
- [ ] Buat file `server/src/services/gamificationService.ts`
  - [ ] `addXP(userId, amount, reason)` - Add XP & handle level ups
  - [ ] `updateStreak(userId)` - Update daily streak
  - [ ] `claimDailyGoal(userId)` - Claim daily goal reward
  - [ ] `addGems(userId, amount, reason)` - Add gems
  - [ ] `spendGems(userId, amount, reason)` - Spend gems
  - [ ] `getGemBalance(userId)` - Get current gem balance
  - [ ] `getGemHistory(userId)` - Get transaction history
  - [ ] `applyBoost(userId, boostType)` - Apply power-up boost

#### 4.5 League Service
- [ ] Buat file `server/src/services/leagueService.ts`
  - [ ] `getCurrentWeekStandings(league)` - Get current week leaderboard
  - [ ] `getUserLeaguePosition(userId)` - Get user's rank & stats
  - [ ] `addWeeklyXP(userId, amount)` - Add XP for weekly competition
  - [ ] `processWeeklyPromotion()` - CRON job: promote/demote users
  - [ ] `getLeagueRewards(userId)` - Get available rewards
  - [ ] `claimLeagueReward(userId)` - Claim weekly/promotion reward

#### 4.6 Quiz Service (Enhance Existing)
- [ ] Update `server/src/services/quizService.ts` (jika belum ada, buat baru)
  - [ ] `getQuizQuestions(topicId, difficulty, limit)` - Get questions
  - [ ] `submitQuizAnswer(userId, questionId, answer)` - Submit & grade
  - [ ] `submitQuiz(userId, quizData)` - Submit full quiz
  - [ ] `getQuizHistory(userId)` - Get user's quiz attempts
  - [ ] `getQuizStats(userId, topicId)` - Get topic mastery stats

#### 4.7 AI Mentor Service
- [ ] Buat file `server/src/services/mentorService.ts`
  - [ ] `getChatHistory(userId)` - Get user's chat sessions
  - [ ] `saveChatMessage(userId, message)` - Save chat message
  - [ ] `generateAIResponse(userId, message)` - Call AI API (future)
  - [ ] `getSuggestedQuestions(userId)` - Get contextual suggestions
  - [ ] `getChatSummary(userId)` - Get session summary

#### 4.8 Telemetry Service
- [ ] Buat file `server/src/services/telemetryService.ts`
  - [ ] `logEvent(userId, eventType, metadata)` - Log telemetry event
  - [ ] `getEvents(userId, filters)` - Get user events
  - [ ] `getClassEvents(teacherId, filters)` - Get class-wide events
  - [ ] `getAnalytics(userId, timeRange)` - Get aggregated analytics

---

### **FASE 5: CONTROLLERS & ROUTES** 🛣️

#### 5.1 Achievement Controller & Routes
- [ ] Buat `server/src/controllers/achievementController.ts`
  - [ ] `GET /api/achievements` - List all achievements
  - [ ] `GET /api/achievements/user/:userId` - User's achievements
  - [ ] `POST /api/achievements/check` - Check & unlock achievements
  - [ ] `GET /api/achievements/:achievementId/progress` - Progress detail

- [ ] Buat `server/src/routes/achievement.ts`
- [ ] Register route di `server/src/app.ts`

#### 5.2 Module/Lesson Controller & Routes
- [ ] Buat `server/src/controllers/moduleController.ts`
  - [ ] `GET /api/modules` - List all modules
  - [ ] `GET /api/modules/:moduleId` - Get module detail
  - [ ] `GET /api/modules/category/:categoryId` - Modules by category
  - [ ] `POST /api/modules/:moduleId/complete` - Complete module
  - [ ] `GET /api/modules/user/progress` - User's module progress

- [ ] Buat `server/src/routes/module.ts`
- [ ] Register route di `server/src/app.ts`

#### 5.3 Skill Tree Controller & Routes
- [ ] Buat `server/src/controllers/skillTreeController.ts`
  - [ ] `GET /api/skill-tree` - Get full skill tree
  - [ ] `GET /api/skill-tree/user` - User's personalized tree
  - [ ] `POST /api/skill-tree/node/:nodeId/complete` - Complete node
  - [ ] `GET /api/skill-tree/progress` - Overall progress

- [ ] Buat `server/src/routes/skillTree.ts`
- [ ] Register route di `server/src/app.ts`

#### 5.4 Gamification Controller & Routes
- [ ] Buat `server/src/controllers/gamificationController.ts`
  - [ ] `GET /api/gamification/profile` - Get gamification profile
  - [ ] `POST /api/gamification/xp` - Add XP
  - [ ] `POST /api/gamification/streak/claim` - Claim daily goal
  - [ ] `GET /api/gamification/gems` - Get gem balance
  - [ ] `POST /api/gamification/gems/spend` - Spend gems
  - [ ] `GET /api/gamification/gems/history` - Gem transaction history
  - [ ] `POST /api/gamification/boost` - Apply power-up

- [ ] Buat `server/src/routes/gamification.ts`
- [ ] Register route di `server/src/app.ts`

#### 5.5 League Controller & Routes
- [ ] Buat `server/src/controllers/leagueController.ts`
  - [ ] `GET /api/leagues/:league/standings` - Weekly standings
  - [ ] `GET /api/leagues/user/position` - User's league position
  - [ ] `POST /api/leagues/xp` - Add weekly XP
  - [ ] `GET /api/leagues/rewards` - Available rewards
  - [ ] `POST /api/leagues/rewards/claim` - Claim reward

- [ ] Buat `server/src/routes/league.ts`
- [ ] Register route di `server/src/app.ts`

#### 5.6 Quiz Controller & Routes (Enhance)
- [ ] Update `server/src/controllers/quizController.ts`
  - [ ] `GET /api/quiz/:topicId/questions` - Get quiz questions
  - [ ] `POST /api/quiz/submit` - Submit quiz
  - [ ] `GET /api/quiz/history` - Quiz history
  - [ ] `GET /api/quiz/stats/:topicId` - Topic stats

- [ ] Verify routes exist di `server/src/routes/quiz.ts`

#### 5.7 AI Mentor Controller & Routes
- [ ] Buat `server/src/controllers/mentorController.ts`
  - [ ] `GET /api/mentor/chat` - Get chat history
  - [ ] `POST /api/mentor/chat/message` - Send message
  - [ ] `GET /api/mentor/suggestions` - Get suggested questions
  - [ ] `GET /api/mentor/summary` - Get chat summary

- [ ] Buat `server/src/routes/mentor.ts`
- [ ] Register route di `server/src/app.ts`

#### 5.8 Telemetry Controller & Routes
- [ ] Buat `server/src/controllers/telemetryController.ts`
  - [ ] `POST /api/telemetry/event` - Log event
  - [ ] `GET /api/telemetry/events` - Get user events
  - [ ] `GET /api/telemetry/analytics` - Get analytics

- [ ] Buat `server/src/routes/telemetry.ts`
- [ ] Register route di `server/src/app.ts`

---

### **FASE 6: FRONTEND INTEGRATION** 🎨

#### 6.1 Update API Client
- [ ] Update `src/lib/apiClient.ts` untuk menambah endpoints baru:
  ```typescript
  // Achievement endpoints
  export const getAchievements = () => request<Achievement[]>('/achievements')
  export const getUserAchievements = () => request<UserAchievement[]>('/achievements/user')
  
  // Module endpoints
  export const getModules = () => request<LearningModule[]>('/modules')
  export const getModule = (id: string) => request<LearningModule>(`/modules/${id}`)
  export const completeModule = (id: string, data: any) => 
    request(`/modules/${id}/complete`, { method: 'POST', body: JSON.stringify(data) })
  
  // Skill tree endpoints
  export const getSkillTree = () => request<SkillTreeNode[]>('/skill-tree')
  export const getUserSkillTree = () => request<SkillTreeNode[]>('/skill-tree/user')
  export const completeNode = (nodeId: string, data: any) => 
    request(`/skill-tree/node/${nodeId}/complete`, { method: 'POST', body: JSON.stringify(data) })
  
  // Gamification endpoints
  export const getGamificationProfile = () => request<GamificationProfile>('/gamification/profile')
  export const claimDailyGoal = () => request('/gamification/streak/claim', { method: 'POST' })
  export const spendGems = (data: any) => 
    request('/gamification/gems/spend', { method: 'POST', body: JSON.stringify(data) })
  
  // League endpoints
  export const getLeagueStandings = (league: string) => 
    request<LeagueStanding>(`/leagues/${league}/standings`)
  export const getUserLeaguePosition = () => request<LeaguePosition>('/leagues/user/position')
  
  // Quiz endpoints
  export const getQuizQuestions = (topicId: string) => 
    request<QuizQuestion[]>(`/quiz/${topicId}/questions`)
  export const submitQuiz = (data: any) => 
    request('/quiz/submit', { method: 'POST', body: JSON.stringify(data) })
  
  // Mentor endpoints
  export const getChatHistory = () => request<ChatSession[]>('/mentor/chat')
  export const sendChatMessage = (message: string) => 
    request('/mentor/chat/message', { method: 'POST', body: JSON.stringify({ message }) })
  
  // Telemetry endpoints
  export const logTelemetryEvent = (eventType: string, metadata: any) => 
    request('/telemetry/event', { method: 'POST', body: JSON.stringify({ eventType, metadata }) })
  ```

#### 6.2 Replace Mock API Calls
- [ ] **StudentDashboard.tsx**
  - [ ] Replace `mockApi.getGamifiedProfile()` dengan `getGamificationProfile()`
  - [ ] Replace mock achievements dengan `getUserAchievements()`
  - [ ] Replace mock league data dengan `getUserLeaguePosition()`

- [ ] **Learning.tsx**
  - [ ] Replace `mockApi.getSkillTree()` dengan `getUserSkillTree()`
  - [ ] Replace `mockApi.completeLesson()` dengan `completeNode()`
  - [ ] Replace `mockApi.claimStreakReward()` dengan `claimDailyGoal()`

- [ ] **QuizPlayer.tsx**
  - [ ] Replace mock quiz questions dengan `getQuizQuestions(topicId)`
  - [ ] Replace mock submit dengan `submitQuiz()`
  - [ ] Add telemetry tracking dengan `logTelemetryEvent()`

- [ ] **AiChat.tsx / AiStudentChatPage.tsx**
  - [ ] Replace mock chat history dengan `getChatHistory()`
  - [ ] Replace mock send message dengan `sendChatMessage()`

- [ ] **Leaderboard.tsx**
  - [ ] Replace mock league standings dengan `getLeagueStandings(league)`

- [ ] **LessonDetail.tsx**
  - [ ] Replace mock module data dengan `getModule(moduleId)`
  - [ ] Replace completion dengan `completeModule()`

- [ ] **TeacherDashboard.tsx**
  - [ ] Replace mock student data dengan real API calls
  - [ ] Replace mock telemetry dengan `getTelemetryEvents()`

#### 6.3 Update React Query Integration
- [ ] Setup React Query untuk caching di semua API calls
- [ ] Contoh hooks:
  ```typescript
  // src/hooks/useGamification.ts
  export const useGamificationProfile = () => {
    return useQuery({
      queryKey: ['gamification-profile'],
      queryFn: getGamificationProfile,
    })
  }
  
  // src/hooks/useSkillTree.ts
  export const useSkillTree = () => {
    return useQuery({
      queryKey: ['skill-tree'],
      queryFn: getUserSkillTree,
    })
  }
  
  // src/hooks/useLeague.ts
  export const useLeagueStandings = (league: string) => {
    return useQuery({
      queryKey: ['league-standings', league],
      queryFn: () => getLeagueStandings(league),
    })
  }
  ```

#### 6.4 Update State Management
- [ ] Remove mock data imports dari components
- [ ] Ensure all data fetching uses React Query
- [ ] Add loading & error states untuk semua API calls
- [ ] Add optimistic updates untuk user interactions (XP gain, gem spending, dll)

---

### **FASE 7: MIDDLEWARE & VALIDATION** 🛡️

#### 7.1 Authentication Middleware
- [ ] Verify `server/src/middleware/auth.ts` exists dan berfungsi
- [ ] Apply auth middleware ke semua protected routes
- [ ] Test JWT token validation

#### 7.2 Input Validation
- [ ] Add validation untuk semua POST/PUT endpoints menggunakan express-validator
- [ ] Examples:
  ```typescript
  // Achievement unlock validation
  body('achievementId').isString().notEmpty()
  
  // Module completion validation
  body('score').isNumeric().isInt({ min: 0, max: 100 })
  body('stars').isInt({ min: 0, max: 3 })
  
  // Gem spending validation
  body('amount').isNumeric().isInt({ min: 1 })
  body('reason').isString().notEmpty()
  ```

#### 7.3 Error Handling
- [ ] Create global error handler middleware
- [ ] Buat file `server/src/middleware/errorHandler.ts`
- [ ] Handle common errors: validation, authentication, not found, server errors
- [ ] Return consistent error format untuk frontend

#### 7.4 Rate Limiting
- [ ] Install `express-rate-limit`
- [ ] Add rate limiting untuk:
  - [ ] Quiz submissions (max 10/hour per user)
  - [ ] Chat messages (max 50/hour per user)
  - [ ] Achievement checks (max 100/hour per user)

---

### **FASE 8: ADVANCED FEATURES** 🚀

#### 8.1 Real-time Updates (Optional)
- [ ] Install Socket.io untuk real-time features
- [ ] Real-time league standings updates
- [ ] Real-time achievement notifications
- [ ] Live XP/streak updates across devices

#### 8.2 CRON Jobs
- [ ] Setup CRON jobs untuk automated tasks:
  - [ ] **Daily streak reset** (midnight) - reset dailyGoalMet, dailyGoalClaimed
  - [ ] **Weekly league processing** (Sunday midnight) - promote/demote users
  - [ ] **Cleanup old telemetry** (monthly) - keep only last 3 months
  - [ ] **Daily login rewards** - check & award gems for daily login

- [ ] Install `node-cron` atau `agenda`
- [ ] Buat file `server/src/jobs/index.ts`

#### 8.3 Analytics & Reporting
- [ ] Create aggregation pipelines untuk teacher reports:
  - [ ] Class average mastery per topic
  - [ ] Student risk levels (low/medium/high)
  - [ ] Most difficult questions (low success rate)
  - [ ] Engagement trends (daily active users)

- [ ] Add export functionality:
  - [ ] Export student progress as PDF
  - [ ] Export class report as Excel
  - [ ] Export quiz results

#### 8.4 AI Integration (Future)
- [ ] Design API contract untuk AI mentor service
- [ ] Create webhook endpoint untuk AI responses
- [ ] Store AI conversation context
- [ ] Implement content recommendation algorithm

---

### **FASE 9: TESTING** 🧪

#### 9.1 Unit Tests
- [ ] Test all service layer functions
- [ ] Test authentication & authorization
- [ ] Test XP calculation logic
- [ ] Test achievement unlock conditions
- [ ] Test gem transaction logic

#### 9.2 Integration Tests
- [ ] Test API endpoints dengan supertest
- [ ] Test database operations
- [ ] Test JWT token flow
- [ ] Test skill tree unlocking logic
- [ ] Test league promotion/demotion

#### 9.3 End-to-End Tests
- [ ] Test user registration → quiz → XP gain flow
- [ ] Test achievement unlock flow
- [ ] Test daily goal claim flow
- [ ] Test gem earning & spending flow
- [ ] Test league competition flow

#### 9.4 Load Testing
- [ ] Test concurrent quiz submissions
- [ ] Test simultaneous achievement unlocks
- [ ] Test league standings with 1000+ users

---

### **FASE 10: DEPLOYMENT & MONITORING** 🌍

#### 10.1 Production Setup
- [ ] Setup production MongoDB (MongoDB Atlas recommended)
- [ ] Configure environment variables untuk production
- [ ] Setup proper logging (Winston atau Pino)
- [ ] Configure CORS untuk production domain
- [ ] Setup HTTPS/SSL certificates

#### 10.2 Database Optimization
- [ ] Add compound indexes untuk frequent queries:
  ```typescript
  // StudentProfile compound index
  { user: 1, league: 1 }
  { league: 1, xp: -1 } // For league standings
  
  // QuizQuestion compound index
  { topicId: 1, difficulty: 1 }
  
  // TelemetryEvent compound index
  { userId: 1, eventType: 1, timestamp: -1 }
  ```
- [ ] Setup database backup schedule (daily recommended)
- [ ] Configure read replicas jika perlu

#### 10.3 Monitoring & Alerts
- [ ] Setup application monitoring (Sentry, LogRocket, atau New Relic)
- [ ] Monitor database performance (MongoDB Atlas monitoring)
- [ ] Setup alerts untuk:
  - [ ] High error rates
  - [ ] Slow database queries
  - [ ] High memory/CPU usage
  - [ ] Failed CRON jobs

#### 10.4 Documentation
- [ ] Document all API endpoints (Swagger/OpenAPI)
- [ ] Create API usage guide untuk frontend team
- [ ] Document database schema
- [ ] Create deployment guide
- [ ] Create troubleshooting guide

---

## 📋 CHECKLIST SUMMARY

### Critical Path (Must Have)
- [ ] ✅ Database connection & models setup
- [ ] ✅ Seed all static data (modules, quizzes, achievements)
- [ ] ✅ Core services (gamification, quiz, skill tree)
- [ ] ✅ API endpoints & controllers
- [ ] ✅ Frontend integration (replace mock APIs)
- [ ] ✅ Authentication & authorization
- [ ] ✅ Testing (basic unit & integration tests)
- [ ] ✅ Production deployment

### High Priority (Should Have)
- [ ] 🔶 Achievement system fully working
- [ ] 🔶 League system dengan weekly competition
- [ ] 🔶 Gem system untuk in-app economy
- [ ] 🔶 Telemetry & analytics
- [ ] 🔶 Teacher dashboard dengan real data
- [ ] 🔶 CRON jobs (streak reset, league processing)
- [ ] 🔶 Error handling & validation

### Medium Priority (Nice to Have)
- [ ] 🔷 Real-time updates (Socket.io)
- [ ] 🔷 Advanced analytics & reporting
- [ ] 🔷 Export functionality (PDF/Excel)
- [ ] 🔷 AI mentor service integration
- [ ] 🔷 Load testing & optimization

### Low Priority (Future Enhancement)
- [ ] ⚪ Multi-language support
- [ ] ⚪ Mobile app (React Native)
- [ ] ⚪ Social features (friend system)
- [ ] ⚪ Content creator tools untuk teacher
- [ ] ⚪ Marketplace untuk custom content

---

## 🎯 ESTIMATED TIMELINE

| Fase | Durasi Estimasi | Priority |
|------|----------------|----------|
| Fase 1: Persiapan & Setup | 1-2 hari | Critical |
| Fase 2: Model & Schema | 2-3 hari | Critical |
| Fase 3: Seeding Data | 2-3 hari | Critical |
| Fase 4: Service Layer | 4-5 hari | Critical |
| Fase 5: Controllers & Routes | 3-4 hari | Critical |
| Fase 6: Frontend Integration | 4-5 hari | Critical |
| Fase 7: Middleware & Validation | 2-3 hari | High |
| Fase 8: Advanced Features | 5-7 hari | Medium |
| Fase 9: Testing | 3-4 hari | High |
| Fase 10: Deployment | 2-3 hari | Critical |

**Total Estimated Time**: 28-39 hari kerja (5.6-7.8 minggu)

---

## 📚 REFERENSI & RESOURCES

### Documentation
- MongoDB Mongoose: https://mongoosejs.com/docs/
- Express.js: https://expressjs.com/
- React Query: https://tanstack.com/query/latest
- JWT: https://jwt.io/

### Tools
- MongoDB Compass - GUI untuk MongoDB
- Postman/Insomnia - API testing
- MongoDB Atlas - Cloud database
- Sentry - Error monitoring

### Best Practices
- Follow MVC pattern yang sudah ada
- Use TypeScript strict mode
- Write tests untuk critical paths
- Document complex business logic
- Use environment variables untuk secrets
- Follow REST API conventions

---

## 💡 TIPS IMPLEMENTASI

1. **Mulai dari data seeding** - Pastikan semua static data (modules, quizzes, achievements) masuk dulu ke database
2. **Test incrementally** - Test setiap service/endpoint setelah dibuat
3. **Use TypeScript interfaces** - Pastikan type safety antara frontend & backend
4. **Handle errors gracefully** - Always return proper error messages
5. **Log everything important** - Useful untuk debugging production issues
6. **Keep mock data as fallback** - Useful untuk development/testing
7. **Version your API** - Pertimbangkan `/api/v1/...` untuk future-proofing
8. **Optimize database queries** - Use indexes, projection, limit results
9. **Cache frequently accessed data** - Use Redis untuk hot data (optional)
10. **Monitor performance** - Setup monitoring dari awal, jangan tunggu production issues

---

## 🚨 POTENTIAL ISSUES & SOLUTIONS

### Issue: Quiz questions terlalu banyak (2982 soal)
**Solution**: 
- Seed in batches (500 soal per batch)
- Index `topicId` untuk fast filtering
- Implement pagination di API

### Issue: Skill tree prerequisites kompleks
**Solution**:
- Create helper function untuk check prerequisites
- Cache unlocked nodes di client
- Use graph algorithms untuk dependency resolution

### Issue: League standings calculation heavy
**Solution**:
- Pre-calculate standings (CRON job setiap 1 jam)
- Cache hasil di Redis
- Use materialized view di MongoDB

### Issue: Real-time achievement unlocks
**Solution**:
- Use background jobs untuk achievement checks
- Trigger checks after specific events (quiz complete, XP gain)
- Batch checks untuk efficiency

### Issue: Gem transaction conflicts
**Solution**:
- Use MongoDB transactions untuk atomic updates
- Implement optimistic locking
- Add balance validation before spending

---

## ✅ COMPLETION CRITERIA

Project dianggap selesai ketika:
- [ ] ✅ Semua user bisa register, login, dan manage profile
- [ ] ✅ Student bisa ambil quiz dan melihat hasil
- [ ] ✅ XP, streak, dan level system berfungsi
- [ ] ✅ Achievement system unlock otomatis
- [ ] ✅ Skill tree dengan progression tracking
- [ ] ✅ League system dengan weekly competition
- [ ] ✅ Gem economy (earn & spend) working
- [ ] ✅ Teacher bisa monitor progress siswa
- [ ] ✅ AI chat history tersimpan
- [ ] ✅ Telemetry events terekam untuk analytics
- [ ] ✅ All critical tests passing
- [ ] ✅ Deployed to production dan accessible

---

**Good luck dengan integrasi MongoDB! 🚀**

> Jika ada pertanyaan atau butuh bantuan spesifik untuk fase tertentu, jangan ragu untuk bertanya!
