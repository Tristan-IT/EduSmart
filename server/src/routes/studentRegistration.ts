import { Router } from "express";
import {
  registerStudent,
  getStudentProfile,
  updateStudentProfile,
  loginStudent,
  validateClassId,
} from "../controllers/studentRegistrationController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// Public routes
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/validate/:classId", validateClassId);

// Protected routes (require authentication)
router.get("/profile", authenticate, getStudentProfile);
router.put("/profile", authenticate, updateStudentProfile);

export default router;
