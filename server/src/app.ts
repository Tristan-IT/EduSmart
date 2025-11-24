import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import env from "./config/env.js";
import { authRouter } from "./routes/auth.js";
import { studentRouter } from "./routes/student.js";
import { teacherRouter } from "./routes/teacher.js";
import { contentRouter } from "./routes/content.js";
import { reportRouter } from "./routes/report.js";
import gamificationRouter from "./routes/gamification.js";
import skillTreeRouter from "./routes/skillTree.js";
import achievementRouter from "./routes/achievement.js";
import enhancedQuizRouter from "./routes/enhancedQuiz.js";
import bulkOperationsRouter from "./routes/bulkOperations.js";
import { authenticate } from "./middleware/authenticate.js";
import schoolOwnerRouter from "./routes/schoolOwner.js";
import teacherRegistrationRouter from "./routes/teacherRegistration.js";
import studentRegistrationRouter from "./routes/studentRegistration.js";
import classRouter from "./routes/class.js";
import schoolDashboardRouter from "./routes/schoolDashboard.js";
import teacherDashboardRouter from "./routes/teacherDashboard.js";
import studentClassRouter from "./routes/studentClass.js";
import subjectRouter from "./routes/subjects.js";
import progressRouter from "./routes/progress.js";
import pathRouter from "./routes/paths.js";
import lessonRouter from "./routes/lessons.js";
import aiRouter from "./routes/ai.js";
import notificationRouter from "./routes/notification.js";
import teacherSkillTreeRouter from "./routes/teacherSkillTree.js";

export const createApp = () => {
  const app = express();

  // CORS configuration - allow multiple origins
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8081',
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8081',
    'http://127.0.0.1:3000',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan("dev"));

  app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/students", studentRouter);
  app.use("/api/teachers", teacherRouter);
  app.use("/api/content", contentRouter);
  app.use("/api/reports", reportRouter);
  
  // Multi-tenant registration routes (public registration + protected profile)
  app.use("/api/school-owner", schoolOwnerRouter);
  app.use("/api/teacher-registration", teacherRegistrationRouter);
  app.use("/api/student-registration", studentRegistrationRouter);
  
  // Alias routes for login and profile (frontend expects /api/teacher/... and /api/student/...)
  // Teacher routes: /api/teacher/login (registration), /api/teacher/profile/me (profile)
  app.use("/api/teacher", teacherRouter);
  app.use("/api/teacher", teacherRegistrationRouter);
  app.use("/api/student", studentRouter);
  app.use("/api/student", studentRegistrationRouter);
  
  // Class management routes (requires authentication)
  app.use("/api/classes", classRouter);
  
  // Subject management routes (requires authentication)
  app.use("/api/subjects", subjectRouter);
  
  // Progress tracking routes (requires authentication)
  app.use("/api/progress", progressRouter);
  
  // Learning path routes (requires authentication)
  app.use("/api/paths", pathRouter);
  
  // Lesson content routes
  app.use("/api/lessons", lessonRouter);
  
  // AI integration routes (requires authentication)
  app.use("/api/ai", aiRouter);
  
  // Notification routes
  app.use("/api/notifications", notificationRouter);
  app.use("/api/teacher/skill-tree", teacherSkillTreeRouter);
  
  // School dashboard routes (school_owner only)
  app.use("/api/school-dashboard", schoolDashboardRouter);
  
  // Teacher dashboard routes (teacher only)
  app.use("/api/teacher-dashboard", teacherDashboardRouter);
  
  // Student class routes (student only)
  app.use("/api/student-class", studentClassRouter);
  
  // New gamification routes (with authentication)
  app.use("/api/gamification", authenticate, gamificationRouter);
  app.use("/api/skill-tree", authenticate, skillTreeRouter);
  app.use("/api/bulk-operations", bulkOperationsRouter);
  app.use("/api/achievements", authenticate, achievementRouter);
  app.use("/api/quizzes", authenticate, enhancedQuizRouter);

  app.use((req, res) => {
    res.status(404).json({ message: `Endpoint ${req.path} tidak ditemukan.` });
  });

  return app;
};

export default createApp;
