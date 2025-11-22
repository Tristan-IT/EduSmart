import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  restoreSubject,
  getSubjectsGrouped,
  getSubjectsPreview,
} from "../controllers/subjectController";

const router = Router();

/**
 * Subject Routes
 * All routes require authentication
 */

// Get subject preview for school types (no auth required - for setup)
router.post("/preview", getSubjectsPreview as any);

// Create subject
router.post("/", authenticate, createSubject as any);

// Get all subjects with filters
router.get("/", authenticate, getSubjects as any);

// Get subjects grouped by category
router.get("/grouped", authenticate, getSubjectsGrouped as any);

// Get single subject
router.get("/:id", authenticate, getSubjectById as any);

// Update subject
router.put("/:id", authenticate, updateSubject as any);

// Delete subject (soft delete)
router.delete("/:id", authenticate, deleteSubject as any);

// Restore subject
router.post("/:id/restore", authenticate, restoreSubject as any);

export default router;
