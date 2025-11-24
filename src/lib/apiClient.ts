const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
const STORAGE_KEY = "token"; // Unified storage key

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions extends RequestInit {
  method?: HttpMethod;
}

const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  // Try direct token key first
  let token = window.localStorage.getItem(STORAGE_KEY);
  if (token) return token;
  
  // Fallback to old format for backward compatibility
  const raw = window.localStorage.getItem("adapti.portal.auth");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { token?: string };
    return parsed.token ?? null;
  } catch (error) {
    console.warn("Token tidak dapat dibaca", error);
    return null;
  }
};

const buildHeaders = (init?: HeadersInit) => {
  const headers = new Headers(init);
  const token = getStoredToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return headers;
};

export const request = async <T>(path: string, options: RequestOptions = {}) => {
  const headers = buildHeaders(options.headers);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const payload = await response.json();
      message = payload.message ?? message;
    } catch (error) {
      // ignore json parse issues
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
};

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

// ========================================
// GAMIFICATION API
// ========================================

export interface GamificationProfile {
  xp: number;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  streak: number;
  bestStreak: number;
  dailyGoalXP: number;
  dailyGoalProgress: number;
  dailyGoalMet: boolean;
  dailyGoalClaimed: boolean;
  league: string;
  gems: number;
}

export interface XPAddResult {
  success: boolean;
  xpAdded: number;
  newXP: number;
  leveledUp: boolean;
  levelsGained: number;
  newLevel: number;
  reason: string;
}

export const gamificationApi = {
  getProfile: () => request<{ success: boolean; profile: GamificationProfile }>("/gamification/profile"),
  addXP: (amount: number, reason?: string) =>
    request<XPAddResult>("/gamification/xp", {
      method: "POST",
      body: JSON.stringify({ amount, reason }),
    }),
  claimDailyGoal: () =>
    request<{ success: boolean; bonusXP: number; bonusGems: number; streak: number }>("/gamification/streak/claim", {
      method: "POST",
    }),
  getGemBalance: () => request<{ success: boolean; balance: number }>("/gamification/gems"),
  spendGems: (amount: number, reason: string) =>
    request<{ success: boolean; amount: number; balance: number }>("/gamification/gems/spend", {
      method: "POST",
      body: JSON.stringify({ amount, reason }),
    }),
  getGemHistory: (limit = 50) =>
    request<{ success: boolean; history: any[] }>(`/gamification/gems/history?limit=${limit}`),
  checkAchievements: () =>
    request<{ success: boolean; newlyUnlocked: any[]; totalUnlocked: number }>("/gamification/achievements/check", {
      method: "POST",
    }),
};

// ========================================
// SKILL TREE API
// ========================================

export interface SkillTreeNode {
  nodeId: string;
  moduleId: string;
  title: string;
  description: string;
  status: string;
  stars: number;
  xpReward: number;
  unlocked: boolean;
}

export const skillTreeApi = {
  getSkillTree: () => request<{ success: boolean; nodes: SkillTreeNode[] }>("/skill-tree"),
  getUserSkillTree: () => request<{ success: boolean; skillTree: SkillTreeNode[] }>("/skill-tree/user"),
  completeNode: (nodeId: string, score: number) =>
    request<{
      success: boolean;
      stars: number;
      xpEarned: number;
      leveledUp: boolean;
      newLevel: number;
    }>(`/skill-tree/node/${nodeId}/complete`, {
      method: "POST",
      body: JSON.stringify({ score }),
    }),
  getNextNodes: () => request<{ success: boolean; nodes: SkillTreeNode[] }>("/skill-tree/next"),
  getProgress: () =>
    request<{
      success: boolean;
      totalNodes: number;
      completedNodes: number;
      progressPercentage: number;
    }>("/skill-tree/progress"),
};

// ========================================
// ACHIEVEMENTS API
// ========================================

export interface Achievement {
  _id: string;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  gemsReward: number;
}

export interface UserAchievement {
  _id: string;
  achievement: Achievement;
  progress: number;
  total: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export const achievementApi = {
  getAll: () => request<{ success: boolean; achievements: Achievement[] }>("/achievements"),
  getUserAchievements: () =>
    request<{ success: boolean; achievements: UserAchievement[]; unlockedCount: number }>("/achievements/user"),
  getRecent: (limit = 5) =>
    request<{ success: boolean; achievements: UserAchievement[] }>(`/achievements/recent?limit=${limit}`),
};

// ========================================
// QUIZ API (Enhanced)
// ========================================

export interface QuizQuestion {
  _id: string;
  topicId: string;
  question: string;
  type: string;
  options?: string[];
  difficulty: number;
  hintCount: number;
  hints: string[];
}

export interface QuizSubmission {
  topicId: string;
  answers: Array<{
    questionId: string;
    userAnswer: string | string[];
  }>;
  timeSpent: number;
}

export interface QuizResult {
  success: boolean;
  score: number;
  correct: number;
  total: number;
  xpEarned: number;
  leveledUp: boolean;
  newLevel: number;
  results: Array<{
    questionId: string;
    question: string;
    userAnswer: string | string[];
    correctAnswer: string | string[];
    isCorrect: boolean;
    explanation: string;
  }>;
}

export const quizApi = {
  getQuestions: (topicId: string, difficulty?: number, limit = 10) => {
    let url = `/quizzes/${topicId}/questions?limit=${limit}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    return request<QuizQuestion[]>(url);
  },
  submitQuiz: (submission: QuizSubmission) =>
    request<QuizResult>("/quizzes/submit", {
      method: "POST",
      body: JSON.stringify(submission),
    }),
};

// ========================================
// MULTI-TENANT REGISTRATION API
// ========================================

export interface SchoolOwnerRegistration {
  owner: {
    name: string;
    email: string;
    password: string;
  };
  school: {
    schoolName: string;
    address: string;
    city: string;
    province: string;
    phone?: string;
    totalClasses?: number;
  };
}

export interface TeacherRegistration {
  name: string;
  email: string;
  password: string;
  schoolId: string;
  phone?: string;
  teacherProfile: {
    employeeId?: string;
    subjects: string[];
    qualification?: string;
  };
}

export interface StudentRegistration {
  name: string;
  email: string;
  password: string;
  classId: string;
  studentProfile: {
    rollNumber?: string;
    parentName?: string;
    parentPhone?: string;
    parentEmail?: string;
  };
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
    token?: string;
    schoolId?: string;
    classId?: string;
  };
}

export const registrationApi = {
  registerSchoolOwner: (data: SchoolOwnerRegistration) =>
    request<RegistrationResponse>("/school-owner/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  registerTeacher: (data: TeacherRegistration) =>
    request<RegistrationResponse>("/teacher-registration/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  registerStudent: (data: StudentRegistration) =>
    request<RegistrationResponse>("/student-registration/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  validateSchoolId: (schoolId: string) =>
    request<{ success: boolean; valid: boolean; schoolName?: string }>(
      `/school-owner/validate/${schoolId}`
    ),
  validateClassId: (classId: string) =>
    request<{
      success: boolean;
      valid: boolean;
      className?: string;
      capacity?: number;
      currentStudents?: number;
    }>(`/student-registration/validate/${classId}`),
};

// ========================================
// CLASS MANAGEMENT API
// ========================================

export interface Class {
  _id: string;
  classId: string;
  className: string;
  grade: string;
  section: string;
  capacity: number;
  schoolId: string;
  homeroomTeacherId?: string;
  subjectTeachers: Array<{
    teacherId: string;
    subjects: string[];
  }>;
  students: string[];
  academicYear: string;
  isActive: boolean;
}

export interface CreateClassData {
  className: string;
  grade: string;
  section: string;
  capacity: number;
  homeroomTeacherId?: string;
  academicYear?: string;
}

export interface AssignTeacherData {
  teacherId: string;
  subjects: string[];
}

export const classApi = {
  createClass: (data: CreateClassData) =>
    request<{ success: boolean; message: string; data: Class }>("/class/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getMyClasses: () =>
    request<{ success: boolean; data: Class[] }>("/class/my-classes"),
  getClassById: (classId: string) =>
    request<{ success: boolean; data: Class }>(`/class/${classId}`),
  updateClass: (classId: string, data: Partial<CreateClassData>) =>
    request<{ success: boolean; message: string; data: Class }>(`/class/${classId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteClass: (classId: string) =>
    request<{ success: boolean; message: string }>(`/class/${classId}`, {
      method: "DELETE",
    }),
  assignTeacher: (classId: string, data: AssignTeacherData) =>
    request<{ success: boolean; message: string; data: Class }>(`/class/${classId}/assign-teacher`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  removeTeacher: (classId: string, teacherId: string) =>
    request<{ success: boolean; message: string; data: Class }>(`/class/${classId}/remove-teacher`, {
      method: "DELETE",
      body: JSON.stringify({ teacherId }),
    }),
  enrollStudent: (classId: string, studentId: string) =>
    request<{ success: boolean; message: string; data: Class }>(`/class/${classId}/enroll-student`, {
      method: "POST",
      body: JSON.stringify({ studentId }),
    }),
  removeStudent: (classId: string, studentId: string) =>
    request<{ success: boolean; message: string; data: Class }>(`/class/${classId}/remove-student`, {
      method: "DELETE",
      body: JSON.stringify({ studentId }),
    }),
};

// ========================================
// SCHOOL DASHBOARD API
// ========================================

export interface SchoolOverview {
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
  activeClasses: number;
}

export interface TeacherStat {
  teacherId: string;
  name: string;
  email: string;
  totalClasses: number;
  totalStudents: number;
  subjects: string[];
}

export interface ClassOverview {
  classId: string;
  className: string;
  grade: string;
  studentCount: number;
  capacity: number;
  homeroomTeacher: string;
  subjectTeachers: number;
}

export interface TopPerformer {
  studentId: string;
  name: string;
  className: string;
  xp: number;
  completedLessons: number;
  averageScore: number;
}

export interface ActivityLog {
  date: string;
  count: number;
  type: string;
}

export const schoolDashboardApi = {
  getOverview: () =>
    request<{ success: boolean; data: SchoolOverview }>("/school-dashboard/overview"),
  getTeacherStats: () =>
    request<{ success: boolean; data: TeacherStat[] }>("/school-dashboard/teachers"),
  getClassOverview: () =>
    request<{ success: boolean; data: ClassOverview[] }>("/school-dashboard/classes"),
  getTopPerformers: (limit = 10) =>
    request<{ success: boolean; data: TopPerformer[] }>(`/school-dashboard/top-performers?limit=${limit}`),
  getActivityLogs: (days = 30) =>
    request<{ success: boolean; data: ActivityLog[] }>(`/school-dashboard/activity-logs?days=${days}`),
  getSchoolAnalytics: () =>
    request<{
      success: boolean;
      data: {
        overview: SchoolOverview;
        teachers: TeacherStat[];
        classes: ClassOverview[];
      };
    }>("/school-dashboard/analytics"),
};

// ========================================
// TEACHER DASHBOARD API
// ========================================

export interface MyClass {
  classId: string;
  className: string;
  grade: string;
  studentCount: number;
  capacity: number;
  subjects: string[];
}

export interface MyStudent {
  studentId: string;
  name: string;
  email: string;
  className: string;
  xp: number;
  completedLessons: number;
  averageScore: number;
}

export interface TeacherAnalytics {
  totalLessons: number;
  totalQuizzes: number;
  totalStudents: number;
  averageClassScore: number;
}

export interface TeacherActivityLog {
  date: string;
  type: string;
  description: string;
  classId?: string;
}

export const teacherDashboardApi = {
  getMyClasses: () =>
    request<{ success: boolean; data: MyClass[] }>("/teacher-dashboard/my-classes"),
  getMyStudents: () =>
    request<{ success: boolean; data: MyStudent[] }>("/teacher-dashboard/my-students"),
  getClassStudents: (classId: string) =>
    request<{ success: boolean; data: MyStudent[] }>(`/teacher-dashboard/class-students/${classId}`),
  getAnalytics: () =>
    request<{ success: boolean; data: TeacherAnalytics }>("/teacher-dashboard/analytics"),
  getClassAnalytics: (classId: string) =>
    request<{ success: boolean; data: any }>(`/teacher-dashboard/class-analytics/${classId}`),
  getActivityLogs: (days = 30) =>
    request<{ success: boolean; data: TeacherActivityLog[] }>(`/teacher-dashboard/activity-logs?days=${days}`),
  getStudentProgress: (studentId: string) =>
    request<{ success: boolean; data: any }>(`/teacher-dashboard/student-progress/${studentId}`),
};

// ========================================
// STUDENT CLASS API
// ========================================

export interface ClassInfo {
  classId: string;
  className: string;
  grade: string;
  homeroomTeacher: string;
  subjectTeachers: Array<{
    name: string;
    subjects: string[];
  }>;
  studentCount: number;
  capacity: number;
}

export interface Classmate {
  studentId: string;
  name: string;
  xp: number;
  completedLessons: number;
  rank: number;
}

export interface ClassLeaderboard {
  studentId: string;
  name: string;
  isMe: boolean;
  xp: number;
  completedLessons: number;
  averageScore: number;
  rank: number;
}

export interface SchoolRank {
  myRank: number;
  totalStudents: number;
  myXP: number;
  topStudentXP: number;
}

export interface StudentActivity {
  date: string;
  type: string;
  description: string;
  xpGained?: number;
}

export const studentClassApi = {
  getMyClass: () =>
    request<{ success: boolean; data: ClassInfo }>("/student-class/my-class"),
  getClassmates: () =>
    request<{ success: boolean; data: Classmate[] }>("/student-class/classmates"),
  getClassLeaderboard: () =>
    request<{ success: boolean; data: ClassLeaderboard[] }>("/student-class/class-leaderboard"),
  getSchoolRank: () =>
    request<{ success: boolean; data: SchoolRank }>("/student-class/school-rank"),
  getRecentActivity: (limit = 20) =>
    request<{ success: boolean; data: StudentActivity[] }>(`/student-class/recent-activity?limit=${limit}`),
  getClassProgress: () =>
    request<{
      success: boolean;
      data: {
        myProgress: number;
        classAverage: number;
        topStudent: number;
      };
    }>("/student-class/class-progress"),
};

// Subject API
export const subjectApi = {
  getAll: (filters?: { category?: string; schoolType?: string; grade?: number; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.schoolType) params.append("schoolType", filters.schoolType);
    if (filters?.grade) params.append("grade", filters.grade.toString());
    if (filters?.search) params.append("search", filters.search);
    const query = params.toString();
    return request<{ success: boolean; subjects: any[]; total: number }>(
      `/subjects${query ? `?${query}` : ""}`
    );
  },
  getById: (id: string) =>
    request<{ success: boolean; subject: any }>(`/subjects/${id}`),
  create: (data: any) =>
    request<{ success: boolean; message: string; subject: any }>("/subjects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    request<{ success: boolean; message: string; subject: any }>(`/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ success: boolean; message: string }>(`/subjects/${id}`, {
      method: "DELETE",
    }),
};

// Content API
export const contentApi = {
  // Learning Modules
  getModules: (filters?: { subjectId?: string; categoryId?: string; difficulty?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.subjectId) params.append("subjectId", filters.subjectId);
    if (filters?.categoryId) params.append("categoryId", filters.categoryId);
    if (filters?.difficulty) params.append("difficulty", filters.difficulty);
    if (filters?.search) params.append("search", filters.search);
    const query = params.toString();
    return request<{ success: boolean; modules: any[]; total: number }>(
      `/content/modules${query ? `?${query}` : ""}`
    );
  },
  getModule: (moduleId: string) =>
    request<{ success: boolean; module: any }>(`/content/modules/${moduleId}`),
  createModule: (data: any) =>
    request<{ success: boolean; message: string; module: any }>("/content/modules", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateModule: (moduleId: string, data: any) =>
    request<{ success: boolean; message: string; module: any }>(`/content/modules/${moduleId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteModule: (moduleId: string) =>
    request<{ success: boolean; message: string }>(`/content/modules/${moduleId}`, {
      method: "DELETE",
    }),
  
  // Content Items
  getItems: (filters?: { subjectId?: string; type?: string; difficulty?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.subjectId) params.append("subjectId", filters.subjectId);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.difficulty) params.append("difficulty", filters.difficulty);
    if (filters?.search) params.append("search", filters.search);
    const query = params.toString();
    return request<{ success: boolean; items: any[]; total: number }>(
      `/content/items/list${query ? `?${query}` : ""}`
    );
  },
  createItem: (data: any) =>
    request<{ success: boolean; message: string; item: any }>("/content/items/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  // Quiz Questions
  getQuestions: (filters?: { subjectId?: string; topicId?: string; difficulty?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.subjectId) params.append("subjectId", filters.subjectId);
    if (filters?.topicId) params.append("topicId", filters.topicId);
    if (filters?.difficulty) params.append("difficulty", filters.difficulty.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    const query = params.toString();
    return request<{ success: boolean; questions: any[]; total: number }>(
      `/content/quiz-questions${query ? `?${query}` : ""}`
    );
  },
  createQuestion: (data: any) =>
    request<{ success: boolean; message: string; question: any }>("/content/quiz-questions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Progress API
export const progressApi = {
  getStudentProgress: (studentId: string, params?: { subjectId?: string; classId?: string }) => {
    const query = new URLSearchParams();
    if (params?.subjectId) query.append('subjectId', params.subjectId);
    if (params?.classId) query.append('classId', params.classId);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; data: any[] }>(`/progress/student/${studentId}${queryString}`);
  },

  getClassProgress: (classId: string, subjectId: string) =>
    request<{ success: boolean; data: any[] }>(`/progress/class/${classId}/subject/${subjectId}`),

  getSchoolProgress: (schoolId: string, subjectId?: string) => {
    const query = subjectId ? `?subjectId=${subjectId}` : '';
    return request<{ success: boolean; data: any[] }>(`/progress/school/${schoolId}${query}`);
  },

  getSubjectStatistics: (schoolId: string, subjectId: string) =>
    request<{ success: boolean; data: any }>(`/progress/statistics/${schoolId}/${subjectId}`),

  updateLessonProgress: (data: { studentId: string; subjectId: string; timeSpent?: number; xpEarned?: number }) =>
    request<{ success: boolean; data: any; message: string }>("/progress/lesson", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateQuizProgress: (data: { studentId: string; subjectId: string; score: number; topicId?: string; timeSpent?: number; xpEarned?: number }) =>
    request<{ success: boolean; data: any; message: string }>("/progress/quiz", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateExerciseProgress: (data: { studentId: string; subjectId: string; score?: number; timeSpent?: number; xpEarned?: number }) =>
    request<{ success: boolean; data: any; message: string }>("/progress/exercise", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateAssignmentProgress: (data: { studentId: string; subjectId: string; score: number; timeSpent?: number; xpEarned?: number }) =>
    request<{ success: boolean; data: any; message: string }>("/progress/assignment", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export default apiClient;


