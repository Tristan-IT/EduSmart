import { Router } from "express";
import {
  getOverview,
  getTeachers,
  getClasses,
  getStudents,
  getDailyAnalytics,
  getTopPerformers,
  getSchoolAlerts,
  getSchoolPerformanceMetrics,
  getRecentActivity,
} from "../controllers/schoolDashboardController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// All school dashboard routes require authentication
router.use(authenticate);

// Dashboard endpoints (school_owner only)
router.get("/overview", getOverview as any);
router.get("/teachers", getTeachers as any);
router.get("/classes", getClasses as any);
router.get("/students", getStudents as any);
router.get("/analytics/daily", getDailyAnalytics as any);
router.get("/top-performers", getTopPerformers as any);
router.get("/alerts", getSchoolAlerts as any);
router.get("/performance", getSchoolPerformanceMetrics as any);
router.get("/recent-activity", getRecentActivity as any);

export default router;
