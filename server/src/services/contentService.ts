import { Types } from "mongoose";
import { LearningModuleModel } from "../models/LearningModule.js";
import { ContentItemModel } from "../models/ContentItem.js";
import { QuizQuestionModel } from "../models/QuizQuestion.js";
import SubjectModel from "../models/Subject.js";
import SchoolModel from "../models/School.js";

/**
 * Validate that subject belongs to the school
 */
export async function validateSubjectOwnership(
  subjectId: string | Types.ObjectId,
  schoolId: string | Types.ObjectId
): Promise<boolean> {
  try {
    const subject = await SubjectModel.findOne({
      _id: subjectId,
      school: schoolId,
      isActive: true,
    });
    return !!subject;
  } catch (error) {
    console.error("Error validating subject ownership:", error);
    return false;
  }
}

/**
 * Create a new learning module
 */
export async function createLearningModule(data: {
  schoolId: string | Types.ObjectId;
  subjectId: string | Types.ObjectId;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  estimatedDuration: string;
  prerequisites?: string[];
  learningObjectives?: string[];
  theory: {
    sections: Array<{
      title: string;
      content: string;
      examples?: string[];
      keyPoints?: string[];
    }>;
  };
  video: {
    title: string;
    youtubeUrl: string;
    duration: string;
    description: string;
    channel: string;
  };
  exercises?: Array<{
    id: string;
    question: string;
    type: "mcq" | "short-answer" | "multiple-choice";
    options?: string[];
    correctAnswer: string | string[];
    explanation: string;
    difficulty: number;
  }>;
}) {
  try {
    // Validate subject belongs to school
    const isValidSubject = await validateSubjectOwnership(data.subjectId, data.schoolId);
    if (!isValidSubject) {
      throw new Error("Subject does not belong to this school or is inactive");
    }

    // Generate unique moduleId
    const moduleId = `MOD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const module = await LearningModuleModel.create({
      moduleId,
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      subject: data.subjectId,
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      estimatedDuration: data.estimatedDuration,
      prerequisites: data.prerequisites || [],
      learningObjectives: data.learningObjectives || [],
      theory: data.theory,
      video: data.video,
      exercises: data.exercises || [],
    });

    return module;
  } catch (error) {
    console.error("Error creating learning module:", error);
    throw error;
  }
}

/**
 * Get learning modules with optional filters
 */
export async function getLearningModules(filters: {
  schoolId?: string | Types.ObjectId;
  subjectId?: string | Types.ObjectId;
  categoryId?: string;
  difficulty?: string;
  search?: string;
}) {
  try {
    const query: any = {};

    if (filters.subjectId) {
      query.subject = filters.subjectId;
    }

    if (filters.categoryId) {
      query.categoryId = filters.categoryId;
    }

    if (filters.difficulty) {
      query.difficulty = filters.difficulty;
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
      ];
    }

    const modules = await LearningModuleModel.find(query)
      .populate("subject", "code name category color")
      .sort({ createdAt: -1 });

    // If schoolId provided, filter by school through subject
    if (filters.schoolId) {
      const filteredModules = modules.filter((module: any) => {
        return module.subject?.school?.toString() === filters.schoolId?.toString();
      });
      return filteredModules;
    }

    return modules;
  } catch (error) {
    console.error("Error getting learning modules:", error);
    throw error;
  }
}

/**
 * Get a single learning module by ID
 */
export async function getLearningModuleById(moduleId: string) {
  try {
    const module = await LearningModuleModel.findOne({ moduleId })
      .populate("subject", "code name category color icon");
    
    if (!module) {
      throw new Error("Learning module not found");
    }

    return module;
  } catch (error) {
    console.error("Error getting learning module:", error);
    throw error;
  }
}

/**
 * Update a learning module
 */
export async function updateLearningModule(
  moduleId: string,
  schoolId: string | Types.ObjectId,
  updates: Partial<{
    subjectId: string | Types.ObjectId;
    title: string;
    description: string;
    difficulty: "Mudah" | "Sedang" | "Sulit";
    estimatedDuration: string;
    prerequisites: string[];
    learningObjectives: string[];
    theory: any;
    video: any;
    exercises: any[];
  }>
) {
  try {
    const module = await LearningModuleModel.findOne({ moduleId });
    if (!module) {
      throw new Error("Learning module not found");
    }

    // If updating subject, validate ownership
    if (updates.subjectId) {
      const isValidSubject = await validateSubjectOwnership(updates.subjectId, schoolId);
      if (!isValidSubject) {
        throw new Error("Subject does not belong to this school or is inactive");
      }
      (module as any).subject = updates.subjectId;
    }

    // Update other fields
    if (updates.title) module.title = updates.title;
    if (updates.description) module.description = updates.description;
    if (updates.difficulty) module.difficulty = updates.difficulty;
    if (updates.estimatedDuration) module.estimatedDuration = updates.estimatedDuration;
    if (updates.prerequisites) module.prerequisites = updates.prerequisites;
    if (updates.learningObjectives) module.learningObjectives = updates.learningObjectives;
    if (updates.theory) module.theory = updates.theory;
    if (updates.video) module.video = updates.video;
    if (updates.exercises) module.exercises = updates.exercises;

    await module.save();

    return module;
  } catch (error) {
    console.error("Error updating learning module:", error);
    throw error;
  }
}

/**
 * Delete a learning module (soft delete if needed)
 */
export async function deleteLearningModule(moduleId: string) {
  try {
    const result = await LearningModuleModel.deleteOne({ moduleId });
    return result;
  } catch (error) {
    console.error("Error deleting learning module:", error);
    throw error;
  }
}

/**
 * Create a content item
 */
export async function createContentItem(data: {
  schoolId: string | Types.ObjectId;
  subjectId: string | Types.ObjectId;
  topic: string;
  type: "video" | "pdf" | "quiz" | "slide";
  difficulty: "beginner" | "intermediate" | "advanced";
  title: string;
  durationMinutes: number;
  author: string;
  tags?: string[];
}) {
  try {
    // Validate subject belongs to school
    const isValidSubject = await validateSubjectOwnership(data.subjectId, data.schoolId);
    if (!isValidSubject) {
      throw new Error("Subject does not belong to this school or is inactive");
    }

    const contentItem = await ContentItemModel.create({
      topic: data.topic,
      subject: data.subjectId,
      type: data.type,
      difficulty: data.difficulty,
      title: data.title,
      durationMinutes: data.durationMinutes,
      author: data.author,
      tags: data.tags || [],
    });

    return contentItem;
  } catch (error) {
    console.error("Error creating content item:", error);
    throw error;
  }
}

/**
 * Get content items with filters
 */
export async function getContentItems(filters: {
  schoolId?: string | Types.ObjectId;
  subjectId?: string | Types.ObjectId;
  type?: string;
  difficulty?: string;
  search?: string;
}) {
  try {
    const query: any = {};

    if (filters.subjectId) {
      query.subject = filters.subjectId;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.difficulty) {
      query.difficulty = filters.difficulty;
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { topic: { $regex: filters.search, $options: "i" } },
      ];
    }

    const items = await ContentItemModel.find(query)
      .populate("subject", "code name category color")
      .sort({ updatedAt: -1 });

    // If schoolId provided, filter by school through subject
    if (filters.schoolId) {
      const filteredItems = items.filter((item: any) => {
        return item.subject?.school?.toString() === filters.schoolId?.toString();
      });
      return filteredItems;
    }

    return items;
  } catch (error) {
    console.error("Error getting content items:", error);
    throw error;
  }
}

/**
 * Create quiz questions
 */
export async function createQuizQuestion(data: {
  schoolId: string | Types.ObjectId;
  subjectId: string | Types.ObjectId;
  topicId: string;
  question: string;
  type: "mcq" | "multi-select" | "short-answer";
  options?: string[];
  correctAnswer: string | string[];
  difficulty?: number;
  hints?: string[];
  explanation: string;
}) {
  try {
    // Validate subject belongs to school
    const isValidSubject = await validateSubjectOwnership(data.subjectId, data.schoolId);
    if (!isValidSubject) {
      throw new Error("Subject does not belong to this school or is inactive");
    }

    const quizQuestion = await QuizQuestionModel.create({
      topicId: data.topicId,
      subject: data.subjectId,
      question: data.question,
      type: data.type,
      options: data.options,
      correctAnswer: data.correctAnswer,
      difficulty: data.difficulty || 1,
      hints: data.hints || [],
      hintCount: data.hints?.length || 0,
      explanation: data.explanation,
    });

    return quizQuestion;
  } catch (error) {
    console.error("Error creating quiz question:", error);
    throw error;
  }
}

/**
 * Get quiz questions with filters
 */
export async function getQuizQuestions(filters: {
  schoolId?: string | Types.ObjectId;
  subjectId?: string | Types.ObjectId;
  topicId?: string;
  difficulty?: number;
  limit?: number;
}) {
  try {
    const query: any = {};

    if (filters.subjectId) {
      query.subject = filters.subjectId;
    }

    if (filters.topicId) {
      query.topicId = filters.topicId;
    }

    if (filters.difficulty) {
      query.difficulty = filters.difficulty;
    }

    const limit = filters.limit || 20;

    const questions = await QuizQuestionModel.find(query)
      .populate("subject", "code name category color")
      .limit(limit);

    // If schoolId provided, filter by school through subject
    if (filters.schoolId) {
      const filteredQuestions = questions.filter((q: any) => {
        return q.subject?.school?.toString() === filters.schoolId?.toString();
      });
      return filteredQuestions;
    }

    return questions;
  } catch (error) {
    console.error("Error getting quiz questions:", error);
    throw error;
  }
}
