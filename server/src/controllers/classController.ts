import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authenticate.js";
import * as classService from "../services/classService.js";
import SubjectModel from "../models/Subject.js";
import ClassModel from "../models/Class.js";

/**
 * Class Controller
 * Handles HTTP requests for class management
 */

/**
 * Create a new class
 * POST /api/classes/create
 * Role: school_owner only
 */
export const createClass = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      schoolId,
      grade,
      section,
      specialization,
      majorCode,
      majorName,
      academicYear,
      maxStudents,
      homeRoomTeacherId,
    } = req.body;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can create classes",
      });
    }

    // Validation
    if (!schoolId || !grade || !section || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: schoolId, grade, section, academicYear",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Create class
    const newClass = await classService.createClass(
      schoolId,
      {
        schoolId,
        grade: parseInt(grade),
        section,
        specialization,
        majorCode,
        majorName,
        academicYear,
        maxStudents: maxStudents || 40,
        homeRoomTeacherId,
      },
      ownerId
    );

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: {
        class: newClass,
      },
    });
  } catch (error: any) {
    console.error("❌ Create class error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Bulk create classes
 * POST /api/classes/bulk
 * Role: school_owner only
 */
export const bulkCreateClasses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      schoolId,
      grades,
      specialization,
      majorCode,
      majorName,
      sectionStart,
      sectionEnd,
      maxStudents,
      academicYear,
    } = req.body;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can create classes",
      });
    }

    // Validation
    if (!schoolId || !grades || !Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: schoolId, grades (array)",
      });
    }

    if (!sectionStart || !sectionEnd || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: sectionStart, sectionEnd, academicYear",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Bulk create classes
    const results = await classService.bulkCreateClasses(
      schoolId,
      {
        grades: grades.map((g: any) => parseInt(g)),
        specialization,
        majorCode,
        majorName,
        sectionStart: parseInt(sectionStart),
        sectionEnd: parseInt(sectionEnd),
        maxStudents: maxStudents || 36,
        academicYear,
      },
      ownerId
    );

    res.status(201).json({
      success: true,
      message: `Successfully created ${results.created.length} classes`,
      data: {
        created: results.created,
        failed: results.failed,
        summary: {
          total: results.created.length + results.failed.length,
          succeeded: results.created.length,
          failed: results.failed.length,
        },
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Assign homeroom teacher to a class
 * PUT /api/classes/:classId/homeroom-teacher
 * Role: school_owner only
 */
export const assignHomeRoomTeacher = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;
    const { teacherId } = req.body;
    const requesterId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can assign teachers",
      });
    }

    // Validation
    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: teacherId",
      });
    }

    if (!requesterId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Assign teacher
    const updatedClass = await classService.assignHomeRoomTeacher(
      classId,
      teacherId,
      requesterId
    );

    res.status(200).json({
      success: true,
      message: "Homeroom teacher assigned successfully",
      data: {
        class: updatedClass,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Add subject teacher to a class
 * POST /api/classes/:classId/subject-teachers
 * Role: school_owner only
 */
export const addSubjectTeacher = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;
    const { teacherId, subjects } = req.body;
    const requesterId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can assign teachers",
      });
    }

    // Validation
    if (!teacherId || !subjects || !Array.isArray(subjects)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: teacherId, subjects (array)",
      });
    }

    if (!requesterId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Add subject teacher
    const updatedClass = await classService.addSubjectTeacher(
      classId,
      teacherId,
      subjects,
      requesterId
    );

    res.status(200).json({
      success: true,
      message: "Subject teacher added successfully",
      data: {
        class: updatedClass,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Remove subject teacher from a class
 * DELETE /api/classes/:classId/subject-teachers/:teacherId
 * Role: school_owner only
 */
export const removeSubjectTeacher = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId, teacherId } = req.params;
    const requesterId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can remove teachers",
      });
    }

    if (!requesterId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Remove subject teacher
    const updatedClass = await classService.removeSubjectTeacher(
      classId,
      teacherId,
      requesterId
    );

    res.status(200).json({
      success: true,
      message: "Subject teacher removed successfully",
      data: {
        class: updatedClass,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all students in a class
 * GET /api/classes/:classId/students
 * Role: school_owner, teacher (must be assigned to class)
 */
export const getClassStudents = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;
    const requesterId = req.user?.id;
    const userRole = req.user?.role;

    if (!requesterId || !userRole) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get students
    const students = await classService.getClassStudents(classId, requesterId, userRole);

    res.status(200).json({
      success: true,
      message: "Class students retrieved successfully",
      data: {
        students,
        total: students.length,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get class details
 * GET /api/classes/:classId
 * Role: school_owner, teacher (assigned), student (own class)
 */
export const getClassDetails = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;
    const requesterId = req.user?.id;
    const userRole = req.user?.role;

    if (!requesterId || !userRole) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get class details
    const classDetails = await classService.getClassDetails(classId, requesterId, userRole);

    res.status(200).json({
      success: true,
      message: "Class details retrieved successfully",
      data: {
        class: classDetails,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all classes in a school
 * GET /api/classes/school/:schoolId
 * Role: school_owner only
 */
export const getSchoolClasses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { schoolId } = req.params;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can view all classes",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Get all classes
    const classes = await classService.getSchoolClasses(schoolId, ownerId);

    res.status(200).json({
      success: true,
      message: "School classes retrieved successfully",
      data: {
        classes,
        total: classes.length,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update class details
 * PUT /api/classes/:classId
 * Role: school_owner only
 */
export const updateClass = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;
    const updateData = req.body;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can update classes",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Update class
    const updatedClass = await classService.updateClass(classId, updateData, ownerId);

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: {
        class: updatedClass,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Deactivate a class
 * DELETE /api/classes/:classId
 * Role: school_owner only
 */
export const deactivateClass = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can deactivate classes",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Deactivate class
    const deactivatedClass = await classService.deactivateClass(classId, ownerId);

    res.status(200).json({
      success: true,
      message: "Class deactivated successfully",
      data: {
        class: deactivatedClass,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Assign subjects to a class
 * PUT /api/classes/:classId/subjects
 * Role: school_owner only
 */
export const assignSubjectsToClass = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId } = req.params;
    const { subjectIds } = req.body;
    const ownerId = req.user?.id;
    const userRole = req.user?.role;

    // Authorization check
    if (userRole !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only school owners can assign subjects",
      });
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    // Validation
    if (!subjectIds || !Array.isArray(subjectIds)) {
      return res.status(400).json({
        success: false,
        message: "subjectIds must be an array",
      });
    }

    // Find class and verify ownership
    const classDoc = await ClassModel.findOne({ classId }).populate("school");
    if (!classDoc) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Verify school ownership
    const school: any = classDoc.school;
    if (school.owner.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don't own this school",
      });
    }

    // Validate subjects exist and belong to the school
    const subjects = await SubjectModel.find({
      _id: { $in: subjectIds },
      school: school._id,
      isActive: true,
    });

    if (subjects.length !== subjectIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some subjects not found or don't belong to this school",
      });
    }

    // Validate subjects are applicable to class grade and school type
    const invalidSubjects = subjects.filter((subject) => {
      const isSchoolTypeValid = subject.schoolTypes.includes(classDoc.schoolType);
      const isGradeValid = subject.grades.includes(classDoc.grade);
      return !isSchoolTypeValid || !isGradeValid;
    });

    if (invalidSubjects.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Some subjects are not applicable to ${classDoc.schoolType} grade ${classDoc.grade}`,
        invalidSubjects: invalidSubjects.map((s) => ({
          code: s.code,
          name: s.name,
          schoolTypes: s.schoolTypes,
          grades: s.grades,
        })),
      });
    }

    // Update class with subjects
    classDoc.subjects = subjectIds.map((id) => id as any);
    await classDoc.save();

    res.status(200).json({
      success: true,
      message: "Subjects assigned to class successfully",
      data: {
        classId: classDoc.classId,
        className: classDoc.displayName,
        subjects: subjects.map((s) => ({
          _id: s._id,
          code: s.code,
          name: s.name,
          category: s.category,
          color: s.color,
        })),
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
