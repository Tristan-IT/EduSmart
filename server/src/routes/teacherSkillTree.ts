import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  createSkillTreeNode,
  updateSkillTreeNode,
  deleteSkillTreeNode,
  cloneSkillTreeNode,
  bulkImportNodes,
} from "../controllers/teacherSkillTreeController.js";

const teacherSkillTreeRouter = Router();

// All routes require authentication
teacherSkillTreeRouter.use(authenticate);

teacherSkillTreeRouter.post("/", createSkillTreeNode);
teacherSkillTreeRouter.put("/:nodeId", updateSkillTreeNode);
teacherSkillTreeRouter.delete("/:nodeId", deleteSkillTreeNode);
teacherSkillTreeRouter.post("/:nodeId/clone", cloneSkillTreeNode);
teacherSkillTreeRouter.post("/bulk-import", bulkImportNodes);

export default teacherSkillTreeRouter;
