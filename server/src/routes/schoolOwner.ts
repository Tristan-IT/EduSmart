import { Router } from "express";
import {
  registerSchoolOwner,
  loginSchoolOwner,
  getSchoolDetails,
  updateSchool,
  getProfile,
  updateProfile,
  changePassword,
  getSchoolById,
  getSchoolAnalytics,
  setupSchoolType,
  getSchoolSetup,
} from "../controllers/schoolOwnerController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// Public routes
router.post("/register", registerSchoolOwner);
router.post("/login", loginSchoolOwner);

// Protected routes (require authentication)
router.get("/profile", authenticate, getProfile as any);
router.put("/profile", authenticate, updateProfile as any);
router.put("/change-password", authenticate, changePassword as any);
router.get("/school/:schoolId", authenticate, getSchoolById as any);
router.put("/school/:schoolId", authenticate, updateSchool as any);
router.get("/analytics/:schoolId", authenticate, getSchoolAnalytics as any);

// School Setup routes
router.post("/setup", authenticate, setupSchoolType as any);
router.get("/setup", authenticate, getSchoolSetup as any);

// Legacy routes
router.get("/:schoolId", authenticate, getSchoolDetails);
router.put("/:schoolId", authenticate, updateSchool);

export default router;
