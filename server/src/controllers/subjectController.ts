import { Request, Response } from "express";
import SubjectModel from "../models/Subject";
import SchoolModel from "../models/School";
import mongoose from "mongoose";
import { getSubjectPreview } from "../services/subjectService";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

/**
 * Create a new subject
 * POST /api/subjects
 */
export const createSubject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      code,
      name,
      category,
      schoolTypes,
      grades,
      smaSpecializations,
      smkMajors,
      description,
      color,
      icon,
    } = req.body;

    // Get school from authenticated user
    const userId = req.user?.id;
    const school = await SchoolModel.findOne({
      owner: userId,
    });

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found for this owner",
      });
    }

    // Validation
    if (!code || !name || !category || !schoolTypes || !grades) {
      return res.status(400).json({
        success: false,
        message: "Code, name, category, schoolTypes, and grades are required",
      });
    }

    // Check for duplicate code
    const existingSubject = await SubjectModel.findOne({
      school: school._id,
      code: code.toUpperCase(),
    });

    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: `Subject with code '${code}' already exists in your school`,
      });
    }

    // Validate category
    const validCategories = ["WAJIB", "PEMINATAN", "MUATAN_LOKAL", "EKSTRAKURIKULER"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Must be WAJIB, PEMINATAN, MUATAN_LOKAL, or EKSTRAKURIKULER",
      });
    }

    // Validate school types
    const validSchoolTypes = ["SD", "SMP", "SMA", "SMK"];
    if (!Array.isArray(schoolTypes) || schoolTypes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one school type is required",
      });
    }

    for (const type of schoolTypes) {
      if (!validSchoolTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid school type: ${type}. Must be SD, SMP, SMA, or SMK`,
        });
      }
    }

    // Validate grades
    if (!Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one grade is required",
      });
    }

    for (const grade of grades) {
      if (typeof grade !== "number" || grade < 1 || grade > 12) {
        return res.status(400).json({
          success: false,
          message: "Grades must be numbers between 1 and 12",
        });
      }
    }

    // Create subject
    const subject = await SubjectModel.create({
      school: school._id,
      code: code.toUpperCase(),
      name,
      category,
      schoolTypes,
      grades,
      smaSpecializations,
      smkMajors,
      description,
      color,
      icon,
    });

    return res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: subject,
    });
  } catch (error: any) {
    console.error("Error creating subject:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create subject",
      error: error.message,
    });
  }
};

/**
 * Get all subjects for school with filters
 * GET /api/subjects?category=WAJIB&schoolType=SMA&grade=10&search=matematika
 */
export const getSubjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, schoolType, grade, search, isActive } = req.query;

    // Get school from authenticated user
    const userId = req.user?.id;
    const school = await SchoolModel.findOne({
      owner: userId,
    });

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found for this owner",
      });
    }

    // Build query
    const query: any = {
      school: school._id,
    };

    if (category) {
      query.category = category;
    }

    if (schoolType) {
      query.schoolTypes = schoolType;
    }

    if (grade) {
      query.grades = parseInt(grade as string);
    }

    if (search) {
      query.$or = [
        { code: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    } else {
      // By default, only show active subjects
      query.isActive = true;
    }

    const subjects = await SubjectModel.find(query).sort({ category: 1, name: 1 });

    return res.status(200).json({
      success: true,
      data: subjects,
      count: subjects.length,
    });
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
      error: error.message,
    });
  }
};

/**
 * Get single subject by ID
 * GET /api/subjects/:id
 */
export const getSubjectById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }

    // Get school from authenticated user
    const userId = req.user?.id;
    const school = await SchoolModel.findOne({
      owner: userId,
    });

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found for this owner",
      });
    }

    const subject = await SubjectModel.findOne({
      _id: id,
      school: school._id,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error: any) {
    console.error("Error fetching subject:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subject",
      error: error.message,
    });
  }
};

/**
 * Update subject
 * PUT /api/subjects/:id
 */
export const updateSubject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      code,
      name,
      category,
      schoolTypes,
      grades,
      smaSpecializations,
      smkMajors,
      description,
      color,
      icon,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }

    // Get school from authenticated user
    const userId = req.user?.id;
    const school = await SchoolModel.findOne({
      owner: userId,
    });

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found for this owner",
      });
    }

    const subject = await SubjectModel.findOne({
      _id: id,
      school: school._id,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // Check for duplicate code if code is being changed
    if (code && code.toUpperCase() !== subject.code) {
      const existingSubject = await SubjectModel.findOne({
        school: school._id,
        code: code.toUpperCase(),
        _id: { $ne: id },
      });

      if (existingSubject) {
        return res.status(400).json({
          success: false,
          message: `Subject with code '${code}' already exists in your school`,
        });
      }
    }

    // Update fields
    if (code) subject.code = code.toUpperCase();
    if (name) subject.name = name;
    if (category) subject.category = category;
    if (schoolTypes) subject.schoolTypes = schoolTypes;
    if (grades) subject.grades = grades;
    if (smaSpecializations !== undefined) subject.smaSpecializations = smaSpecializations;
    if (smkMajors !== undefined) subject.smkMajors = smkMajors;
    if (description !== undefined) subject.description = description;
    if (color) subject.color = color;
    if (icon) subject.icon = icon;

    await subject.save();

    return res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      data: subject,
    });
  } catch (error: any) {
    console.error("Error updating subject:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update subject",
      error: error.message,
    });
  }
};

/**
 * Soft delete subject
 * DELETE /api/subjects/:id
 */
export const deleteSubject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }

    // Get school from authenticated user
    const userId = req.user?.id;
    const school = await SchoolModel.findOne({
      owner: userId,
    });

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found for this owner",
      });
    }

    const subject = await SubjectModel.findOne({
      _id: id,
      school: school._id,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // Soft delete
    subject.isActive = false;
    await subject.save();

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting subject:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete subject",
      error: error.message,
    });
  }
};

/**
 * Restore soft-deleted subject
 * POST /api/subjects/:id/restore
 */
export const restoreSubject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subject ID",
      });
    }

    // Get school from authenticated user
    const userId = req.user?.id;
    const school = await SchoolModel.findOne({
      owner: userId,
    });

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found for this owner",
      });
    }

    const subject = await SubjectModel.findOne({
      _id: id,
      school: school._id,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    // Restore
    subject.isActive = true;
    await subject.save();

    return res.status(200).json({
      success: true,
      message: "Subject restored successfully",
      data: subject,
    });
  } catch (error: any) {
    console.error("Error restoring subject:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to restore subject",
      error: error.message,
    });
  }
};

/**
 * Get subjects grouped by category
 * GET /api/subjects/grouped
 */
export const getSubjectsGrouped = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Get school from authenticated user
    const userId = req.user?.id;
    const school = await SchoolModel.findOne({
      owner: userId,
    });

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found for this owner",
      });
    }

    const subjects = await SubjectModel.find({
      school: school._id,
      isActive: true,
    }).sort({ category: 1, name: 1 });

    // Group by category
    const grouped = {
      WAJIB: subjects.filter((s) => s.category === "WAJIB"),
      PEMINATAN: subjects.filter((s) => s.category === "PEMINATAN"),
      MUATAN_LOKAL: subjects.filter((s) => s.category === "MUATAN_LOKAL"),
      EKSTRAKURIKULER: subjects.filter((s) => s.category === "EKSTRAKURIKULER"),
    };

    return res.status(200).json({
      success: true,
      data: grouped,
      total: subjects.length,
    });
  } catch (error: any) {
    console.error("Error fetching grouped subjects:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch grouped subjects",
      error: error.message,
    });
  }
};

/**
 * Get subject preview for school types
 * POST /api/subjects/preview
 */
export const getSubjectsPreview = async (req: Request, res: Response) => {
  try {
    const { schoolTypes } = req.body;

    // Validation
    if (!schoolTypes || !Array.isArray(schoolTypes) || schoolTypes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "schoolTypes array is required",
      });
    }

    const validTypes = ["SD", "SMP", "SMA", "SMK"];
    const invalidTypes = schoolTypes.filter((type: string) => !validTypes.includes(type));
    
    if (invalidTypes.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid school types: ${invalidTypes.join(", ")}`,
      });
    }

    const preview = getSubjectPreview(schoolTypes);

    // Group by category for better UI display
    const grouped = {
      WAJIB: preview.filter((s) => s.category === "WAJIB"),
      PEMINATAN: preview.filter((s) => s.category === "PEMINATAN"),
      MUATAN_LOKAL: preview.filter((s) => s.category === "MUATAN_LOKAL"),
      EKSTRAKURIKULER: preview.filter((s) => s.category === "EKSTRAKURIKULER"),
    };

    return res.status(200).json({
      success: true,
      data: {
        all: preview,
        grouped,
        total: preview.length,
      },
    });
  } catch (error: any) {
    console.error("Error getting subject preview:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get subject preview",
      error: error.message,
    });
  }
};
