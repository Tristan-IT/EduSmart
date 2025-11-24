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
 * PUBLIC ROUTES (NO AUTH) - Must be defined FIRST
 */

// Get subjects by schoolId (public - for teacher registration)
// IMPORTANT: Must be before /:id route to avoid conflict
router.get("/public/school/:schoolId", async (req, res) => {
  try {
    const { schoolId } = req.params;
    console.log(`[Subjects API] Getting subjects for schoolId: ${schoolId}`);
    
    const SchoolModel = (await import("../models/School.js")).default;
    const SubjectModel = (await import("../models/Subject.js")).default;
    
    // Find school
    const school = await SchoolModel.findOne({ schoolId });
    console.log(`[Subjects API] School found:`, school ? `${school.schoolName} (${school._id})` : "Not found");
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }
    
    // Get active subjects for this school
    const subjects = await SubjectModel.find({
      school: school._id,
      isActive: true,
    })
      .select("name code color icon category")
      .sort({ name: 1 });
    
    console.log(`[Subjects API] Found ${subjects.length} subjects for school ${schoolId}`);
    
    res.json({
      success: true,
      message: "Subjects retrieved successfully",
      data: subjects,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get subject preview for school types (no auth required - for setup)
router.post("/preview", getSubjectsPreview as any);

/**
 * PROTECTED ROUTES (REQUIRE AUTH)
 */

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
