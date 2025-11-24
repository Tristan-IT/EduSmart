import { Router } from "express";
import {
  registerTeacher,
  getTeacherProfile,
  updateTeacherProfile,
  loginTeacher,
} from "../controllers/teacherRegistrationController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// Public routes
router.post("/register", registerTeacher);
router.post("/login", loginTeacher);

// Protected routes (require authentication)
router.get("/profile", authenticate, getTeacherProfile);
router.put("/profile", authenticate, updateTeacherProfile);

export default router;
