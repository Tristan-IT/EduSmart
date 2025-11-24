import { Router } from "express";
import {
  listContentItems,
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
  createItem,
  getItems,
  updateItem,
  deleteItem,
  createQuestion,
  getQuestions,
  // Content Management System endpoints
  listTopics,
  getTopic,
  getTopicQuizzes,
  listTemplates,
  getTemplate,
  createTemplate,
  cloneTemplate,
  updateTemplate,
  deleteTemplate,
  publishTemplate,
  archiveTemplate,
  getVersionHistory,
  getVersion,
  rollbackVersion,
  getAuditLogs,
} from "../controllers/contentController.js";
import { authenticate } from "../middleware/authenticate.js";

export const contentRouter = Router();

// Legacy endpoint (backward compatibility)
contentRouter.get("/items", listContentItems);

// Learning Module routes (requires authentication)
contentRouter.post("/modules", authenticate, createModule);
contentRouter.get("/modules", authenticate, getModules);
contentRouter.get("/modules/:moduleId", authenticate, getModule);
contentRouter.put("/modules/:moduleId", authenticate, updateModule);
contentRouter.delete("/modules/:moduleId", authenticate, deleteModule);

// Content Item routes (requires authentication)
contentRouter.post("/items/create", authenticate, createItem);
contentRouter.get("/items/list", authenticate, getItems);
contentRouter.put("/items/:id", authenticate, updateItem);
contentRouter.delete("/items/:id", authenticate, deleteItem);

// Quiz Question routes (requires authentication)
contentRouter.post("/quiz-questions", authenticate, createQuestion);
contentRouter.get("/quiz-questions", authenticate, getQuestions);

// ==================== CONTENT MANAGEMENT SYSTEM ====================

// Topic routes
contentRouter.get("/topics", authenticate, listTopics);
contentRouter.get("/topics/:id", authenticate, getTopic);
contentRouter.get("/topics/:id/quizzes", authenticate, getTopicQuizzes);

// Template routes
contentRouter.get("/templates", authenticate, listTemplates);
contentRouter.get("/templates/:id", authenticate, getTemplate);
contentRouter.post("/templates", authenticate, createTemplate); // Admin only
contentRouter.put("/templates/:id", authenticate, updateTemplate);
contentRouter.delete("/templates/:id", authenticate, deleteTemplate); // Admin only
contentRouter.post("/templates/:id/clone", authenticate, cloneTemplate);
contentRouter.patch("/templates/:id/publish", authenticate, publishTemplate);
contentRouter.patch("/templates/:id/archive", authenticate, archiveTemplate);

// Version history routes
contentRouter.get("/templates/:id/versions", authenticate, getVersionHistory);
contentRouter.get("/templates/:id/versions/:version", authenticate, getVersion);
contentRouter.post("/templates/:id/rollback", authenticate, rollbackVersion);

// Audit log routes
contentRouter.get("/audit", authenticate, getAuditLogs);

export default contentRouter;
