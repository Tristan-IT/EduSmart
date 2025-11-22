import { Router } from "express";
import {
  createClass,
  bulkCreateClasses,
  assignHomeRoomTeacher,
  addSubjectTeacher,
  removeSubjectTeacher,
  getClassStudents,
  getClassDetails,
  getSchoolClasses,
  updateClass,
  deactivateClass,
  assignSubjectsToClass,
} from "../controllers/classController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// All class routes require authentication
router.use(authenticate);

// Class management routes (school_owner only)
router.post("/create", createClass as any);
router.post("/bulk", bulkCreateClasses as any);
router.put("/:classId", updateClass as any);
router.delete("/:classId", deactivateClass as any);

// Teacher assignment routes (school_owner only)
router.put("/:classId/homeroom-teacher", assignHomeRoomTeacher as any);
router.post("/:classId/subject-teachers", addSubjectTeacher as any);
router.delete("/:classId/subject-teachers/:teacherId", removeSubjectTeacher as any);

// Subject assignment route (school_owner only)
router.put("/:classId/subjects", assignSubjectsToClass as any);

// View routes (role-based access)
router.get("/school/:schoolId", getSchoolClasses as any); // school_owner only
router.get("/:classId/students", getClassStudents as any); // owner, teacher (assigned)
router.get("/:classId", getClassDetails as any); // owner, teacher, student (own class)

export default router;
