import { Router } from "express";
import {
  getTeacherDashboard,
  createTeacher,
  getAllTeachersBySchool,
  updateTeacher,
  deactivateTeacher,
} from "../controllers/teacherController.js";
import { authenticate } from "../middleware/authenticate.js";

export const teacherRouter = Router();

// Protected routes
teacherRouter.get("/:id/dashboard", getTeacherDashboard);

// School owner routes
teacherRouter.post("/create", authenticate, createTeacher as any);
teacherRouter.get("/school/all", authenticate, getAllTeachersBySchool as any);
teacherRouter.put("/:teacherId", authenticate, updateTeacher as any);
teacherRouter.delete("/:teacherId", authenticate, deactivateTeacher as any);

export default teacherRouter;
