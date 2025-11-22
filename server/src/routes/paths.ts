import express from "express";
import pathController from "../controllers/pathController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

/**
 * Public Routes (Student + Teacher)
 */

// Get all paths with filters
router.get("/", authenticate, pathController.getPaths);

// Get template paths only
router.get("/templates", authenticate, pathController.getTemplatePaths);

// Get paths for a specific school
router.get("/school/:schoolId", authenticate, pathController.getSchoolPaths);

// Get a single path by ID
router.get("/:id", authenticate, pathController.getPathById);

// Get all nodes in a path
router.get("/:id/nodes", authenticate, pathController.getPathNodes);

// Get user's progress on a path
router.get("/:id/progress/:userId", authenticate, pathController.getPathProgress);

/**
 * Teacher-Only Routes
 */

// Create a new path
router.post("/", authenticate, pathController.createPath);

// Update a path
router.put("/:id", authenticate, pathController.updatePath);

// Delete a path
router.delete("/:id", authenticate, pathController.deletePath);

// Clone a path
router.post("/:id/clone", authenticate, pathController.clonePath);

// Reorder nodes in a path
router.post("/:id/reorder", authenticate, pathController.reorderPathNodes);

export default router;
