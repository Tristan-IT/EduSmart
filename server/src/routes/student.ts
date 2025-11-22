import { Router } from "express";
import { addMentorMessage, getMentorSession, getStudentDashboard, listStudents } from "../controllers/studentController.js";
import {
  getStudentProfile,
  updateStudentProfile,
  getOnboardingStatus,
  switchSemester,
} from "../controllers/studentProfileController.js";
import { authenticate } from "../middleware/authenticate.js";

export const studentRouter = Router();

studentRouter.get("/", listStudents);
studentRouter.get("/:id/dashboard", getStudentDashboard);
studentRouter.get("/:id/mentor-session", getMentorSession);
studentRouter.post("/:id/mentor-session/messages", addMentorMessage);

// Student profile routes (require authentication)
studentRouter.get("/profile", authenticate, getStudentProfile);
studentRouter.put("/profile", authenticate, updateStudentProfile);
studentRouter.get("/onboarding-status", authenticate, getOnboardingStatus);
studentRouter.post("/switch-semester", authenticate, switchSemester);

export default studentRouter;
