import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import SchoolOwnerRegistration from "./pages/SchoolOwnerRegistration";
import TeacherRegistration from "./pages/TeacherRegistration";
import StudentRegistration from "./pages/StudentRegistration";
import SchoolOwnerDashboard from "./pages/SchoolOwnerDashboard";
import SchoolOwnerTeachers from "./pages/SchoolOwnerTeachers";
import SchoolOwnerClasses from "./pages/SchoolOwnerClasses";
import SchoolOwnerStudents from "./pages/SchoolOwnerStudents";
import SchoolOwnerAnalytics from "./pages/SchoolOwnerAnalytics";
import SchoolOwnerSettings from "./pages/SchoolOwnerSettings";
import SchoolOwnerProfile from "./pages/SchoolOwnerProfile";
import SchoolOwnerNotifications from "./pages/SchoolOwnerNotifications";
import SchoolSetup from "./pages/SchoolSetup";
import SubjectManagement from "./pages/SubjectManagement";
import QuizPlayer from "./pages/QuizPlayer";
import QuizCategories from "./pages/QuizCategories";
import LessonDetail from "./pages/LessonDetail";
import Profile from "./pages/Profile";
import TeacherProfile from "./pages/TeacherProfile";
import TeacherSettings from "./pages/TeacherSettings";
import TeacherNotifications from "./pages/TeacherNotifications";
import StudentProfile from "./pages/StudentProfile";
import StudentSettings from "./pages/StudentSettings";
import Notifications from "./pages/Notifications";
import Search from "./pages/Search";
import Leaderboard from "./pages/Leaderboard";
import Learning from "./pages/Learning";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import AiChat from "./pages/AiChat";
import AiStudentChatPage from "./pages/AiStudentChatPage";
import ContentLibrary from "./pages/ContentLibrary";
import ContentDetail from "./pages/ContentDetail";
import AdminSettings from "./pages/AdminSettings";
import AdminAnalytics from "./pages/AdminAnalytics";
import Reports from "./pages/Reports";
import ErrorStates from "./pages/ErrorStates";
import { SkillTreePage } from "./pages/SkillTreePage";
import TeacherSkillTreeManagement from "./pages/TeacherSkillTreeManagement";
import TemplateLibrary from "./pages/TemplateLibrary";
import ContentEditor from "./pages/ContentEditor";
import UploadContent from "./pages/UploadContent";
import LearningPathDashboard from "./pages/LearningPathDashboard";
import ClassSelectionOnboarding from "./pages/ClassSelectionOnboarding";
import LessonViewer from "./pages/LessonViewer";
import RecommendationsPage from "./pages/RecommendationsPage";
import CalibrationPage from "./pages/CalibrationPage";
import TeacherAnalyticsPage from "./pages/TeacherAnalyticsPage";
import TeacherAnalyticsComplete from "./pages/TeacherAnalyticsComplete";
import ThemeCustomizationPage from "./pages/ThemeCustomizationPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/school-owner-registration" element={<SchoolOwnerRegistration />} />
            <Route path="/teacher-registration" element={<TeacherRegistration />} />
            <Route path="/student-registration" element={<StudentRegistration />} />
            <Route
              path="/school-setup"
              element={
                <ProtectedRoute allowRoles={["school_owner"]}>
                  <SchoolSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school-owner-dashboard"
              element={
                <ProtectedRoute allowRoles={["school_owner"]}>
                  <SchoolOwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teachers"
              element={
                <ProtectedRoute allowRoles={["school_owner"]}>
                  <SchoolOwnerTeachers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes"
              element={
                <ProtectedRoute allowRoles={["school_owner"]}>
                  <SchoolOwnerClasses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute allowRoles={["school_owner"]}>
                  <SchoolOwnerStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school-analytics"
              element={
                <ProtectedRoute allowRoles={["school_owner"]}>
                  <SchoolOwnerAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowRoles={["school_owner"]}>
                  <SchoolOwnerSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowRoles={["school_owner"]}>
                  <SchoolOwnerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school-owner/notifications"
              element={
                <ProtectedRoute allowRoles={["school_owner"]}>
                  <SchoolOwnerNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subjects"
              element={
                <ProtectedRoute allowRoles={["school_owner"]}>
                  <SubjectManagement />
                </ProtectedRoute>
              }
            />
            {/* Legacy route for backward compatibility */}
            <Route
              path="/school-dashboard"
              element={
                <ProtectedRoute allowRoles={["school_owner"]}>
                  <SchoolOwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher-dashboard"
              element={
                <ProtectedRoute allowRoles={["teacher"]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/settings"
              element={
                <ProtectedRoute allowRoles={["teacher"]}>
                  <TeacherSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/notifications"
              element={
                <ProtectedRoute allowRoles={["teacher"]}>
                  <TeacherNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute allowRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowRoles={["student"]}>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/settings"
              element={
                <ProtectedRoute allowRoles={["student"]}>
                  <StudentSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard-siswa"
              element={
                <ProtectedRoute allowRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard-guru"
              element={
                <ProtectedRoute allowRoles={["teacher", "admin", "school_owner"]}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route 
            path="/konten" 
            element={
              <ProtectedRoute allowRoles={["teacher", "school_owner", "admin"]}>
                <ContentLibrary />
              </ProtectedRoute>
            } 
          />
          <Route path="/konten/:id" element={<ContentDetail />} />
          <Route path="/admin" element={<AdminSettings />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/laporan" element={<Reports />} />
          <Route path="/errors" element={<ErrorStates />} />
          <Route path="/bank-soal" element={<QuizCategories />} />
          <Route path="/quiz-player" element={<QuizPlayer />} />
          <Route path="/quiz" element={<QuizPlayer />} />
          <Route path="/lesson/:lessonId" element={<LessonDetail />} />
          <Route 
            path="/lesson" 
            element={
              <ProtectedRoute allowRoles={["student"]}>
                <LessonViewer />
              </ProtectedRoute>
            } 
          />
          <Route path="/profil" element={<Profile />} />
          <Route path="/profil-guru" element={<TeacherProfile />} />
          <Route path="/notifikasi" element={<Notifications />} />
          <Route path="/search" element={<Search />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route 
            path="/skill-tree" 
            element={
              <ProtectedRoute allowRoles={["student"]}>
                <SkillTreePage />
              </ProtectedRoute>
            } 
          />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route 
            path="/calibration" 
            element={
              <ProtectedRoute allowRoles={["teacher", "school_owner"]}>
                <CalibrationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher-analytics" 
            element={
              <ProtectedRoute allowRoles={["teacher"]}>
                <TeacherAnalyticsComplete />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/theme-customization" 
            element={
              <ProtectedRoute allowRoles={["teacher", "school_owner"]}>
                <ThemeCustomizationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/learning-paths" 
            element={
              <ProtectedRoute allowRoles={["student"]}>
                <LearningPathDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/class-selection" 
            element={
              <ProtectedRoute allowRoles={["student"]}>
                <ClassSelectionOnboarding />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/skill-tree-management" 
            element={
              <ProtectedRoute allowRoles={["teacher", "admin", "school_owner"]}>
                <TeacherSkillTreeManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/templates" 
            element={
              <ProtectedRoute allowRoles={["teacher", "admin", "school_owner"]}>
                <TemplateLibrary />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/content-editor" 
            element={
              <ProtectedRoute allowRoles={["teacher", "admin", "school_owner"]}>
                <ContentEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/upload-content" 
            element={
              <ProtectedRoute allowRoles={["teacher", "admin", "school_owner"]}>
                <UploadContent />
              </ProtectedRoute>
            } 
          />
          <Route path="/ai-chat" element={<AiStudentChatPage />} />
          <Route path="/ai-mentor" element={<AiChat />} />
          <Route path="/belajar" element={<Learning />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
