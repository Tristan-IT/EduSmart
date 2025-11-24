import type { Request, Response } from "express";
import { ContentItemModel } from "../models/ContentItem.js";
import {
  createLearningModule,
  getLearningModules,
  getLearningModuleById,
  updateLearningModule,
  deleteLearningModule,
  createContentItem,
  getContentItems,
  createQuizQuestion,
  getQuizQuestions,
} from "../services/contentService.js";

// ==================== LEARNING MODULES ====================

/**
 * Create a new learning module
 * POST /api/content/modules
 */
export const createModule = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can create learning modules" });
    }

    const { subjectId, categoryId, categoryName, title, description, difficulty, estimatedDuration, prerequisites, learningObjectives, theory, video, exercises } = req.body;

    if (!subjectId || !title || !description || !difficulty || !theory || !video) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const module = await createLearningModule({
      schoolId: user.schoolId,
      subjectId,
      categoryId: categoryId || "general",
      categoryName: categoryName || "General",
      title,
      description,
      difficulty,
      estimatedDuration: estimatedDuration || "30 minutes",
      prerequisites,
      learningObjectives,
      theory,
      video,
      exercises,
    });

    return res.status(201).json({
      success: true,
      message: "Learning module created successfully",
      module,
    });
  } catch (error: any) {
    console.error("Error creating learning module:", error);
    return res.status(500).json({ message: error.message || "Failed to create learning module" });
  }
};

/**
 * Get all learning modules with filters
 * GET /api/content/modules
 */
export const getModules = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { subjectId, categoryId, difficulty, search } = req.query;

    const filters: any = {};

    // Filter by school if user is not admin
    if (user && user.schoolId) {
      filters.schoolId = user.schoolId;
    }

    if (subjectId) filters.subjectId = subjectId as string;
    if (categoryId) filters.categoryId = categoryId as string;
    if (difficulty) filters.difficulty = difficulty as string;
    if (search) filters.search = search as string;

    const modules = await getLearningModules(filters);

    return res.json({
      success: true,
      modules,
      total: modules.length,
    });
  } catch (error: any) {
    console.error("Error getting learning modules:", error);
    return res.status(500).json({ message: error.message || "Failed to get learning modules" });
  }
};

/**
 * Get a single learning module
 * GET /api/content/modules/:moduleId
 */
export const getModule = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;

    const module = await getLearningModuleById(moduleId);

    return res.json({
      success: true,
      module,
    });
  } catch (error: any) {
    console.error("Error getting learning module:", error);
    return res.status(404).json({ message: error.message || "Learning module not found" });
  }
};

/**
 * Update a learning module
 * PUT /api/content/modules/:moduleId
 */
export const updateModule = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can update learning modules" });
    }

    const { moduleId } = req.params;
    const updates = req.body;

    const module = await updateLearningModule(moduleId, user.schoolId, updates);

    return res.json({
      success: true,
      message: "Learning module updated successfully",
      module,
    });
  } catch (error: any) {
    console.error("Error updating learning module:", error);
    return res.status(500).json({ message: error.message || "Failed to update learning module" });
  }
};

/**
 * Delete a learning module
 * DELETE /api/content/modules/:moduleId
 */
export const deleteModule = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can delete learning modules" });
    }

    const { moduleId } = req.params;

    await deleteLearningModule(moduleId);

    return res.json({
      success: true,
      message: "Learning module deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting learning module:", error);
    return res.status(500).json({ message: error.message || "Failed to delete learning module" });
  }
};

// ==================== CONTENT ITEMS ====================

/**
 * Create a content item
 * POST /api/content/items
 */
export const createItem = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can create content items" });
    }

    const { subjectId, topic, type, difficulty, title, durationMinutes, tags } = req.body;

    if (!subjectId || !topic || !type || !difficulty || !title || !durationMinutes) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const item = await createContentItem({
      schoolId: user.schoolId,
      subjectId,
      topic,
      type,
      difficulty,
      title,
      durationMinutes,
      author: user.name,
      tags,
    });

    return res.status(201).json({
      success: true,
      message: "Content item created successfully",
      item,
    });
  } catch (error: any) {
    console.error("Error creating content item:", error);
    return res.status(500).json({ message: error.message || "Failed to create content item" });
  }
};

/**
 * Get content items with filters
 * GET /api/content/items
 */
export const getItems = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { subjectId, type, difficulty, search } = req.query;

    const filters: any = {};

    // Filter by school if user is not admin
    if (user && user.schoolId) {
      filters.schoolId = user.schoolId;
    }

    if (subjectId) filters.subjectId = subjectId as string;
    if (type) filters.type = type as string;
    if (difficulty) filters.difficulty = difficulty as string;
    if (search) filters.search = search as string;

    const items = await getContentItems(filters);

    return res.json({
      success: true,
      items,
      total: items.length,
    });
  } catch (error: any) {
    console.error("Error getting content items:", error);
    return res.status(500).json({ message: error.message || "Failed to get content items" });
  }
};

/**
 * Update a content item
 * PUT /api/content/items/:id
 */
export const updateItem = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can update content items" });
    }

    const { id } = req.params;
    const { title, topic, type, difficulty, durationMinutes, author, tags } = req.body;

    const contentItem = await ContentItemModel.findByIdAndUpdate(
      id,
      { title, topic, type, difficulty, durationMinutes, author, tags },
      { new: true, runValidators: true }
    ).populate("subject", "code name category color");

    if (!contentItem) {
      return res.status(404).json({ message: "Content item not found" });
    }

    return res.json({
      success: true,
      message: "Content item updated successfully",
      item: contentItem,
    });
  } catch (error: any) {
    console.error("Error updating content item:", error);
    return res.status(500).json({ message: error.message || "Failed to update content item" });
  }
};

/**
 * Delete a content item
 * DELETE /api/content/items/:id
 */
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can delete content items" });
    }

    const { id } = req.params;

    const contentItem = await ContentItemModel.findByIdAndDelete(id);

    if (!contentItem) {
      return res.status(404).json({ message: "Content item not found" });
    }

    return res.json({
      success: true,
      message: "Content item deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting content item:", error);
    return res.status(500).json({ message: error.message || "Failed to delete content item" });
  }
};

// ==================== QUIZ QUESTIONS ====================

/**
 * Create a quiz question
 * POST /api/content/quiz-questions
 */
export const createQuestion = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can create quiz questions" });
    }

    const { subjectId, topicId, question, type, options, correctAnswer, difficulty, hints, explanation } = req.body;

    if (!subjectId || !topicId || !question || !type || !correctAnswer || !explanation) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const quizQuestion = await createQuizQuestion({
      schoolId: user.schoolId,
      subjectId,
      topicId,
      question,
      type,
      options,
      correctAnswer,
      difficulty,
      hints,
      explanation,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz question created successfully",
      question: quizQuestion,
    });
  } catch (error: any) {
    console.error("Error creating quiz question:", error);
    return res.status(500).json({ message: error.message || "Failed to create quiz question" });
  }
};

/**
 * Get quiz questions with filters
 * GET /api/content/quiz-questions
 */
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { subjectId, topicId, difficulty, limit } = req.query;

    const filters: any = {};

    // Filter by school if user is not admin
    if (user && user.schoolId) {
      filters.schoolId = user.schoolId;
    }

    if (subjectId) filters.subjectId = subjectId as string;
    if (topicId) filters.topicId = topicId as string;
    if (difficulty) filters.difficulty = parseInt(difficulty as string);
    if (limit) filters.limit = parseInt(limit as string);

    const questions = await getQuizQuestions(filters);

    return res.json({
      success: true,
      questions,
      total: questions.length,
    });
  } catch (error: any) {
    console.error("Error getting quiz questions:", error);
    return res.status(500).json({ message: error.message || "Failed to get quiz questions" });
  }
};

// ==================== LEGACY ENDPOINT ====================

export const listContentItems = async (_req: Request, res: Response) => {
  const items = await ContentItemModel.find().sort({ updatedAt: -1 }).exec();
  return res.json({ items });
};

// ============================================
// TOPICS (Content Management System)
// ============================================

import Topic from '../models/Topic.js';
import ContentTemplate from '../models/ContentTemplate.js';
import ContentVersion from '../models/ContentVersion.js';
import { ContentAuditLogModel } from '../models/ContentVersion.js';
import QuizQuestion from '../models/QuizQuestion.js';
import SubjectModel from "../models/Subject.js";
import { ensureTemplateContentForSubject, ensureTemplateContentForSubjects } from "../services/topicTemplateService.js";

/**
 * GET /api/topics
 * List all topics with optional filters
 */
export const listTopics = async (req: Request, res: Response) => {
  try {
    const {
      subject,
      school,
      difficulty,
      gradeLevel,
      isTemplate,
      search
    } = req.query;

    const filter: any = { isActive: true };

    if (subject) filter.subject = subject;
    if (school) filter.school = school;
    if (difficulty) filter.difficulty = difficulty;
    if (gradeLevel) filter['metadata.gradeLevel'] = gradeLevel;
    if (isTemplate !== undefined) filter.isTemplate = isTemplate === 'true';

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'metadata.tags': { $regex: search, $options: 'i' } }
      ];
    }

    if (subject) {
      const subjectDoc = await SubjectModel.findById(subject).select("_id code grades schoolTypes school");
      if (subjectDoc) {
        console.log(`[listTopics] Ensuring template content for subject: ${subjectDoc.code}`);
        await ensureTemplateContentForSubject(subjectDoc as any);
        console.log(`[listTopics] Template content ensured for subject: ${subjectDoc.code}`);
      } else {
        console.warn(`[listTopics] Subject not found: ${subject}`);
      }
    } else if (school) {
      const schoolSubjects = await SubjectModel.find({ school }).select("_id code grades schoolTypes school");
      if (schoolSubjects.length) {
        console.log(`[listTopics] Ensuring template content for ${schoolSubjects.length} subjects in school: ${school}`);
        await ensureTemplateContentForSubjects(schoolSubjects as any);
        console.log(`[listTopics] Template content ensured for all subjects`);
      }
    }

    const topics = await Topic.find(filter)
      .populate('subject', 'name code icon')
      .populate('school', 'name')
      .populate('prerequisites', 'name topicCode')
      .sort({ order: 1 });

    console.log(`[listTopics] Found ${topics.length} topics for filter:`, JSON.stringify(filter));

    res.json({
      success: true,
      count: topics.length,
      data: topics
    });
  } catch (error) {
    console.error('Error listing topics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch topics'
    });
  }
};

/**
 * GET /api/topics/:id
 * Get single topic by ID
 */
export const getTopic = async (req: Request, res: Response) => {
  try {
    const topic = await Topic.findById(req.params.id)
      .populate('subject', 'name code icon color')
      .populate('school', 'name')
      .populate('prerequisites', 'name topicCode icon');

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: 'Topic not found'
      });
    }

    res.json({
      success: true,
      data: topic
    });
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch topic'
    });
  }
};

/**
 * GET /api/topics/:id/quizzes
 * Get all quizzes for a topic
 */
export const getTopicQuizzes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { difficulty, limit = 20, offset = 0 } = req.query;

    const filter: any = { topic: id, status: 'published' };
    if (difficulty) filter.difficulty = difficulty;

    const quizzes = await QuizQuestion.find(filter)
      .sort({ order: 1 })
      .limit(Number(limit))
      .skip(Number(offset));

    const total = await QuizQuestion.countDocuments(filter);

    res.json({
      success: true,
      count: quizzes.length,
      total,
      data: quizzes
    });
  } catch (error) {
    console.error('Error fetching topic quizzes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quizzes'
    });
  }
};

// ============================================
// CONTENT TEMPLATES (Content Management System)
// ============================================

/**
 * GET /api/content/templates
 * List content templates with filters
 */
export const listTemplates = async (req: Request, res: Response) => {
  try {
    const {
      subject,
      topic,
      school,
      contentType,
      difficulty,
      isDefault,
      status,
      search,
      limit = 20,
      offset = 0
    } = req.query;

    const filter: any = {};

    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;
    if (school) filter.school = school;
    if (contentType) filter.contentType = contentType;
    if (difficulty) filter.difficulty = difficulty;
    if (isDefault !== undefined) filter.isDefault = isDefault === 'true';
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Teachers can only see templates or their school's content
    const user = (req as any).user;
    if (user && user.role === 'teacher') {
      filter.$or = [
        { isDefault: true, school: null },
        { school: user.teacherProfile?.school }
      ];
    }

    const templates = await ContentTemplate.find(filter)
      .populate('subject', 'name code icon')
      .populate('topic', 'name topicCode icon')
      .populate('school', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset));

    const total = await ContentTemplate.countDocuments(filter);

    res.json({
      success: true,
      count: templates.length,
      total,
      data: templates
    });
  } catch (error) {
    console.error('Error listing templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch templates'
    });
  }
};

/**
 * GET /api/content/templates/:id
 * Get single template by ID
 */
export const getTemplate = async (req: Request, res: Response) => {
  try {
    const template = await ContentTemplate.findById(req.params.id)
      .populate('subject', 'name code icon color')
      .populate('topic', 'name topicCode icon')
      .populate('school', 'name')
      .populate('createdBy', 'name email')
      .populate('lastEditedBy', 'name email')
      .populate('clonedFrom', 'title');

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    // Check access permissions
    const user = (req as any).user;
    if (user && user.role === 'teacher') {
      const isTemplate = template.isDefault && !template.school;
      const isOwnSchool = template.school?.toString() === user.teacherProfile?.school?.toString();
      
      if (!isTemplate && !isOwnSchool) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch template'
    });
  }
};

/**
 * POST /api/content/templates
 * Create new template (admin only)
 */
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    // Only admin can create platform templates
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can create platform templates'
      });
    }

    const template = await ContentTemplate.create({
      ...req.body,
      createdBy: user._id,
      lastEditedBy: user._id,
      isDefault: true,
      school: null
    });

    // Create audit log
    await ContentAuditLogModel.create({
      action: 'create',
      contentType: 'ContentTemplate',
      contentId: template._id,
      userId: user._id,
      userRole: user.role,
      changes: [],
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }
    });

    res.status(201).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create template'
    });
  }
};

/**
 * POST /api/content/templates/:id/clone
 * Clone template for school customization
 */
export const cloneTemplate = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { schoolId, customizations } = req.body;

    // Get original template
    const originalTemplate = await ContentTemplate.findById(req.params.id);
    if (!originalTemplate) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    // Verify school access
    if (user && user.role === 'teacher') {
      if (schoolId !== user.teacherProfile?.school?.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Cannot clone template for another school'
        });
      }
    }

    // Use clone method from model
    const clonedTemplate = await (originalTemplate as any).clone(schoolId, user._id);

    // Apply customizations if provided
    if (customizations) {
      Object.assign(clonedTemplate, customizations);
      await clonedTemplate.save();
    }

    // Create audit log
    await ContentAuditLogModel.create({
      action: 'clone',
      contentType: 'quiz',
      contentId: clonedTemplate._id,
      userId: user._id,
      userRole: user.role,
      school: schoolId,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        originalTemplateId: originalTemplate._id
      }
    });

    res.status(201).json({
      success: true,
      data: clonedTemplate
    });
  } catch (error) {
    console.error('Error cloning template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clone template'
    });
  }
};

/**
 * PUT /api/content/templates/:id
 * Update template
 */
export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const template = await ContentTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    // Check permissions
    if (user && user.role === 'teacher') {
      const isOwnSchool = template.school?.toString() === user.teacherProfile?.school?.toString();
      if (!isOwnSchool) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    // Track changes
    const changes: any[] = [];
    const oldData = template.toObject();
    
    for (const [key, newValue] of Object.entries(req.body)) {
      const oldValue = (oldData as any)[key];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          field: key,
          oldValue,
          newValue
        });
      }
    }

    // Update template
    Object.assign(template, req.body);
    template.lastEditedBy = user._id;
    const currentVersion = (template.metadata?.version || 0) + 1;
    template.metadata = { ...template.metadata, version: currentVersion };
    await template.save();

    // Create version snapshot
    await ContentVersion.create({
      contentTemplate: template._id,
      version: currentVersion,
      content: template.toObject(),
      changes,
      editedBy: user._id,
      reason: req.body.reason || 'Update'
    });

    // Create audit log
    await ContentAuditLogModel.create({
      action: 'update',
      contentType: 'quiz',
      contentId: template._id,
      userId: user._id,
      userRole: user.role,
      school: template.school,
      changes,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        previousVersion: currentVersion - 1,
        newVersion: currentVersion
      }
    });

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update template'
    });
  }
};

/**
 * DELETE /api/content/templates/:id
 * Delete template (admin only)
 */
export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can delete templates'
      });
    }

    const template = await ContentTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    await template.deleteOne();

    // Create audit log
    await ContentAuditLogModel.create({
      action: 'delete',
      contentType: 'quiz',
      contentId: template._id,
      userId: user._id,
      userRole: user.role,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }
    });

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete template'
    });
  }
};

/**
 * PATCH /api/content/templates/:id/publish
 * Publish template
 */
export const publishTemplate = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const template = await ContentTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    // Check permissions
    if (user && user.role === 'teacher') {
      const isOwnSchool = template.school?.toString() === user.teacherProfile?.school?.toString();
      if (!isOwnSchool) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    template.status = 'published';
    template.publishedAt = new Date();
    await template.save();

    // Create audit log
    await ContentAuditLogModel.create({
      action: 'publish',
      contentType: 'quiz',
      contentId: template._id,
      userId: user._id,
      userRole: user.role,
      school: template.school,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }
    });

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error publishing template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish template'
    });
  }
};

/**
 * PATCH /api/content/templates/:id/archive
 * Archive template
 */
export const archiveTemplate = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const template = await ContentTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    // Check permissions
    if (user && user.role === 'teacher') {
      const isOwnSchool = template.school?.toString() === user.teacherProfile?.school?.toString();
      if (!isOwnSchool) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    template.status = 'archived';
    await template.save();

    // Create audit log
    await ContentAuditLogModel.create({
      action: 'archive',
      contentType: 'quiz',
      contentId: template._id,
      userId: user._id,
      userRole: user.role,
      school: template.school,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }
    });

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error archiving template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to archive template'
    });
  }
};

// ============================================
// VERSION HISTORY
// ============================================

/**
 * GET /api/content/templates/:id/versions
 * Get version history for template
 */
export const getVersionHistory = async (req: Request, res: Response) => {
  try {
    const versions = await ContentVersion.find({
      contentTemplate: req.params.id
    })
      .populate('editedBy', 'name email')
      .sort({ version: -1 });

    res.json({
      success: true,
      count: versions.length,
      data: versions
    });
  } catch (error) {
    console.error('Error fetching version history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch version history'
    });
  }
};

/**
 * GET /api/content/templates/:id/versions/:version
 * Get specific version
 */
export const getVersion = async (req: Request, res: Response) => {
  try {
    const version = await ContentVersion.findOne({
      contentTemplate: req.params.id,
      version: req.params.version
    }).populate('editedBy', 'name email');

    if (!version) {
      return res.status(404).json({
        success: false,
        error: 'Version not found'
      });
    }

    res.json({
      success: true,
      data: version
    });
  } catch (error) {
    console.error('Error fetching version:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch version'
    });
  }
};

/**
 * POST /api/content/templates/:id/rollback
 * Rollback to previous version
 */
export const rollbackVersion = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { version: targetVersion } = req.body;

    const template = await ContentTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    // Check permissions
    if (user && user.role === 'teacher') {
      const isOwnSchool = template.school?.toString() === user.teacherProfile?.school?.toString();
      if (!isOwnSchool) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    // Get target version
    const versionDoc = await ContentVersion.findOne({
      contentTemplate: template._id,
      version: targetVersion
    });

    if (!versionDoc) {
      return res.status(404).json({
        success: false,
        error: 'Version not found'
      });
    }

    // Restore content from version
    const currentVersion = template.metadata?.version || 0;
    Object.assign(template, versionDoc.content);
    const newVersion = currentVersion + 1;
    template.metadata = { ...template.metadata, version: newVersion };
    template.lastEditedBy = user._id;
    await template.save();

    // Create new version snapshot for rollback
    await ContentVersion.create({
      contentTemplate: template._id,
      version: newVersion,
      content: template.toObject(),
      changes: [{
        field: 'rollback',
        oldValue: currentVersion,
        newValue: targetVersion
      }],
      editedBy: user._id,
      reason: `Rollback to version ${targetVersion}`
    });

    // Create audit log
    await ContentAuditLogModel.create({
      action: 'rollback',
      contentType: 'quiz',
      contentId: template._id,
      userId: user._id,
      userRole: user.role,
      school: template.school,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        previousVersion: currentVersion,
        newVersion: newVersion,
        rolledBackTo: targetVersion
      }
    });

    res.json({
      success: true,
      message: `Rolled back to version ${targetVersion}`,
      data: template
    });
  } catch (error) {
    console.error('Error rolling back version:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to rollback version'
    });
  }
};

/**
 * GET /api/content/audit
 * Get audit logs
 */
export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const {
      contentId,
      userId,
      action,
      school,
      startDate,
      endDate,
      limit = 50,
      offset = 0
    } = req.query;

    const filter: any = {};

    if (contentId) filter.contentId = contentId;
    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    if (school) filter.school = school;

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate as string);
      if (endDate) filter.timestamp.$lte = new Date(endDate as string);
    }

    const logs = await ContentAuditLogModel.find(filter)
      .populate('userId', 'name email')
      .populate('school', 'name')
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip(Number(offset));

    const total = await ContentAuditLogModel.countDocuments(filter);

    res.json({
      success: true,
      count: logs.length,
      total,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audit logs'
    });
  }
};

