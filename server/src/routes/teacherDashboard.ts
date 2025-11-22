import { Router } from "express";
import {
  getMyAnalytics,
  getMyClasses,
  getMyStudents,
  getClassStudents,
  trackActivity,
  getActivityTimeline,
  updateClassProgress,
} from "../controllers/teacherDashboardController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// All teacher dashboard routes require authentication
router.use(authenticate);

// Teacher dashboard endpoints (teacher only)
router.get("/my-analytics", getMyAnalytics as any);
router.get("/my-classes", getMyClasses as any);
router.get("/my-students", getMyStudents as any);
router.get("/class/:classId/students", getClassStudents as any);
router.get("/activity-timeline", getActivityTimeline as any);
router.post("/track-activity", trackActivity as any);
router.put("/class/:classId/progress", updateClassProgress as any);

export default router;
