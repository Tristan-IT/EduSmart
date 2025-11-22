import { Router } from "express";
import {
  registerStudent,
  getStudentProfile,
  updateStudentProfile,
} from "../controllers/studentRegistrationController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// Public routes
router.post("/register", registerStudent);

// Protected routes (require authentication)
router.get("/profile", authenticate, getStudentProfile);
router.put("/profile", authenticate, updateStudentProfile);

export default router;
