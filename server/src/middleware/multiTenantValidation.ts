import { Request, Response, NextFunction } from "express";
import School from "../models/School";
import Class from "../models/Class";
import User from "../models/User";

/**
 * Middleware to ensure the authenticated user can only access data from their own school
 * Validates that user's schoolId matches the requested resource's school
 */
export const validateSchoolAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = (req as any).user;

    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // School owners, teachers, and students must have a schoolId
    if (["school_owner", "teacher", "student"].includes(currentUser.role)) {
      if (!currentUser.schoolId) {
        res.status(403).json({
          success: false,
          message: "User is not associated with any school",
        });
        return;
      }

      // Get school ID from request params, body, or query
      const requestedSchoolId =
        req.params.schoolId || req.body.schoolId || req.query.schoolId;

      // If there's a schoolId in the request, validate it matches the user's school
      if (requestedSchoolId) {
        // Allow both ObjectId and schoolId format
        const school = await School.findOne({
          $or: [{ _id: requestedSchoolId }, { schoolId: requestedSchoolId }],
        });

        if (!school) {
          res.status(404).json({
            success: false,
            message: "School not found",
          });
          return;
        }

        // Check if user belongs to this school
        if (currentUser.schoolId.toString() !== (school._id as any).toString()) {
          res.status(403).json({
            success: false,
            message: "Access denied: You can only access data from your own school",
          });
          return;
        }
      }
    }

    next();
  } catch (error) {
    console.error("School access validation error:", error);
    res.status(500).json({
      success: false,
      message: "Error validating school access",
    });
  }
};

/**
 * Middleware to ensure the authenticated user can only access data from their own class
 * For students: can only access their own class
 * For teachers: can only access classes they teach
 */
export const validateClassAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = (req as any).user;

    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Get class ID from request params, body, or query
    const requestedClassId = req.params.classId || req.body.classId || req.query.classId;

    if (!requestedClassId) {
      // No class ID in request, skip validation
      next();
      return;
    }

    // Find the class
    const classDoc = await Class.findOne({
      $or: [{ _id: requestedClassId }, { classId: requestedClassId }],
    });

    if (!classDoc) {
      res.status(404).json({
        success: false,
        message: "Class not found",
      });
      return;
    }

    // Validation based on role
    if (currentUser.role === "student") {
      // Students can only access their own class
      if (!currentUser.classId || currentUser.classId.toString() !== (classDoc._id as any).toString()) {
        res.status(403).json({
          success: false,
          message: "Access denied: You can only access your own class",
        });
        return;
      }
    } else if (currentUser.role === "teacher") {
      // Teachers can only access classes they teach
      const isHomeroom =
        classDoc.homeRoomTeacher?.toString() === currentUser._id.toString();
      const isSubjectTeacher = classDoc.subjectTeachers.some(
        (st) => st.teacher.toString() === currentUser._id.toString()
      );

      if (!isHomeroom && !isSubjectTeacher) {
        res.status(403).json({
          success: false,
          message: "Access denied: You are not assigned to this class",
        });
        return;
      }
    } else if (currentUser.role === "school_owner") {
      // School owners can access all classes in their school
      if (currentUser.schoolId.toString() !== classDoc.school.toString()) {
        res.status(403).json({
          success: false,
          message: "Access denied: This class belongs to a different school",
        });
        return;
      }
    }

    next();
  } catch (error) {
    console.error("Class access validation error:", error);
    res.status(500).json({
      success: false,
      message: "Error validating class access",
    });
  }
};

/**
 * Middleware to ensure only school owners can access school management endpoints
 */
export const requireSchoolOwner = (req: Request, res: Response, next: NextFunction): void => {
  const currentUser = (req as any).user;

  if (!currentUser) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  if (currentUser.role !== "school_owner") {
    res.status(403).json({
      success: false,
      message: "Access denied: Only school owners can perform this action",
    });
    return;
  }

  next();
};

/**
 * Middleware to ensure only teachers can access teacher-specific endpoints
 */
export const requireTeacher = (req: Request, res: Response, next: NextFunction): void => {
  const currentUser = (req as any).user;

  if (!currentUser) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  if (currentUser.role !== "teacher") {
    res.status(403).json({
      success: false,
      message: "Access denied: Only teachers can perform this action",
    });
    return;
  }

  next();
};

/**
 * Middleware to ensure user can only access/modify their own student data
 */
export const validateStudentDataAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = (req as any).user;

    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const requestedStudentId =
      req.params.studentId || req.body.studentId || req.query.studentId;

    if (!requestedStudentId) {
      // No student ID in request, skip validation
      next();
      return;
    }

    const student = await User.findById(requestedStudentId);

    if (!student || student.role !== "student") {
      res.status(404).json({
        success: false,
        message: "Student not found",
      });
      return;
    }

    // Role-based validation
    if (currentUser.role === "student") {
      // Students can only access their own data
      if (currentUser._id.toString() !== (student._id as any).toString()) {
        res.status(403).json({
          success: false,
          message: "Access denied: You can only access your own data",
        });
        return;
      }
    } else if (currentUser.role === "teacher") {
      // Teachers can only access students in their classes
      if (!student.classId) {
        res.status(403).json({
          success: false,
          message: "Student is not enrolled in any class",
        });
        return;
      }

      const studentClass = await Class.findById(student.classId);
      if (!studentClass) {
        res.status(404).json({
          success: false,
          message: "Student's class not found",
        });
        return;
      }

      const isHomeroom =
        studentClass.homeRoomTeacher?.toString() === currentUser._id.toString();
      const isSubjectTeacher = studentClass.subjectTeachers.some(
        (st) => st.teacher.toString() === currentUser._id.toString()
      );

      if (!isHomeroom && !isSubjectTeacher) {
        res.status(403).json({
          success: false,
          message: "Access denied: This student is not in your class",
        });
        return;
      }
    } else if (currentUser.role === "school_owner") {
      // School owners can access all students in their school
      if (currentUser.schoolId.toString() !== (student.schoolId as any)?.toString()) {
        res.status(403).json({
          success: false,
          message: "Access denied: This student belongs to a different school",
        });
        return;
      }
    }

    next();
  } catch (error) {
    console.error("Student data access validation error:", error);
    res.status(500).json({
      success: false,
      message: "Error validating student data access",
    });
  }
};

/**
 * Middleware to prevent cross-school data leakage in list/query endpoints
 * Automatically filters results by user's school
 */
export const filterBySchool = (req: Request, res: Response, next: NextFunction): void => {
  const currentUser = (req as any).user;

  if (!currentUser) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  // Add school filter to request for use in controllers
  if (["school_owner", "teacher", "student"].includes(currentUser.role)) {
    (req as any).schoolFilter = { schoolId: currentUser.schoolId };
  }

  next();
};
