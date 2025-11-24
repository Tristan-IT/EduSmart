import type { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import SchoolModel from "../models/School.js";
import UserModel from "../models/User.js";
import { TeacherProfileModel } from "../models/TeacherProfile.js";
import { signAccessToken } from "../utils/token.js";
import type { Types } from "mongoose";
import { notifyNewTeacher } from "../services/notificationService.js";

/**
 * Teacher Login
 */
export const loginTeacher = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find teacher
    const teacher = await UserModel.findOne({ email, role: "teacher" });
    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isValid = await bcryptjs.compare(password, teacher.passwordHash || '');
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = signAccessToken({
      sub: (teacher._id as Types.ObjectId).toString(),
      role: teacher.role,
      name: teacher.name,
      email: teacher.email,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        avatar: teacher.avatar,
        schoolId: teacher.schoolId,
        schoolName: teacher.schoolName,
        classIds: teacher.teacherProfile?.classIds || [],
      },
    });
  } catch (error) {
    console.error("Teacher login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Enhanced Teacher Registration
 * Requires School ID for multi-tenant system
 */
export const registerTeacher = async (req: Request, res: Response) => {
  try {
    const {
      // Personal info
      name,
      email,
      password,
      phone,

      // School info
      schoolId,

      // Teacher info
      employeeId, // NIP/NIK
      subjects, // Array of subjects
      qualification,
      yearsOfExperience,
      specialization,
      classIds, // Array of class IDs
    } = req.body;

    // Validation
    if (!name || !email || !password || !schoolId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing: name, email, password, schoolId",
      });
    }

    // Validate school exists
    const school = await SchoolModel.findOne({ schoolId });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found. Please check your School ID.",
      });
    }

    if (!school.isActive) {
      return res.status(400).json({
        success: false,
        message: "School is inactive. Please contact school administrator.",
      });
    }

    // Check if email already exists in this school
    const existingUser = await UserModel.findOne({ 
      email,
      school: school._id 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A teacher with this email already exists in this school",
      });
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Validate and resolve subjectRefs
    const SubjectModel = (await import("../models/Subject.js")).default;
    const subjectNames = subjects || [];
    const subjectObjectIds: Types.ObjectId[] = [];
    
    if (subjectNames.length > 0) {
      // Find subjects by name in this school
      const foundSubjects = await SubjectModel.find({
        school: school._id,
        name: { $in: subjectNames },
        isActive: true,
      });
      
      subjectObjectIds.push(...foundSubjects.map(s => s._id as Types.ObjectId));
      
      // Log if some subjects not found
      if (foundSubjects.length !== subjectNames.length) {
        console.log("Some subjects not found in database:", 
          subjectNames.filter((name: string) => !foundSubjects.some(s => s.name === name))
        );
      }
    }

    // Validate classIds if provided
    const teacherClassIds = classIds || [];
    const classObjectIds: Types.ObjectId[] = [];
    
    if (teacherClassIds.length > 0) {
      // Import ClassModel
      const ClassModel = (await import("../models/Class.js")).default;
      
      // Validate all classIds belong to this school
      const classes = await ClassModel.find({
        classId: { $in: teacherClassIds },
        school: school._id,
        isActive: true,
      });
      
      if (classes.length !== teacherClassIds.length) {
        return res.status(400).json({
          success: false,
          message: "One or more class IDs are invalid or do not belong to this school",
        });
      }
      
      // Get ObjectIds
      classObjectIds.push(...classes.map(c => c._id as Types.ObjectId));
    }

    // Create teacher user
    const teacher = await UserModel.create({
      name,
      email,
      passwordHash,
      phone,
      role: "teacher",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      school: school._id as Types.ObjectId,
      schoolId: school.schoolId,
      schoolName: school.schoolName,
      teacherProfile: {
        employeeId,
        subjects: subjectNames,
        subjectRefs: subjectObjectIds,
        classes: classObjectIds,
        classIds: teacherClassIds,
        qualification,
        yearsOfExperience,
        specialization,
      },
    });
    
    console.log(`[Teacher Registration] Created teacher:`, {
      name: teacher.name,
      email: teacher.email,
      subjectCount: subjectObjectIds.length,
      classCount: classObjectIds.length,
    });

    // Create separate TeacherProfile (if you have this model)
    try {
      await TeacherProfileModel.create({
        user: teacher._id,
        subjects: subjects || [],
        classes: [],
      });
    } catch (err) {
      console.log("TeacherProfile creation skipped or failed:", err);
    }

    // Update school teacher count
    school.totalTeachers = (school.totalTeachers || 0) + 1;
    await school.save();

    // Notify school owner about new teacher registration
    try {
      const schoolOwner = await UserModel.findOne({
        school: school._id,
        role: "school_owner",
      });

      if (schoolOwner) {
        await notifyNewTeacher(
          (schoolOwner._id as Types.ObjectId).toString(),
          teacher.name,
          (teacher._id as Types.ObjectId).toString()
        );
        console.log(`[Notification] School owner notified about new teacher: ${teacher.name}`);
      }
    } catch (notifError) {
      console.error("Failed to send notification:", notifError);
      // Don't fail registration if notification fails
    }

    // Generate JWT token
    const token = signAccessToken({
      sub: (teacher._id as any).toString(),
      role: teacher.role,
      name: teacher.name,
      email: teacher.email,
    }, "7d");

    return res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
      token,
      user: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        schoolId: teacher.schoolId,
        schoolName: teacher.schoolName,
        avatar: teacher.avatar,
        teacherProfile: teacher.teacherProfile,
      },
    });
  } catch (error: any) {
    console.error("Error registering teacher:", error);
    
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar. Gunakan email lain atau login jika Anda sudah memiliki akun.",
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Failed to register teacher",
      error: error.message,
    });
  }
};

/**
 * Get Teacher Profile
 */
export const getTeacherProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const teacher = await UserModel.findById(userId)
      .populate("school", "schoolId schoolName city province")
      .populate("teacherProfile.classes", "classId className grade section");

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    return res.status(200).json({
      success: true,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        avatar: teacher.avatar,
        phone: (teacher as any).phone,
        schoolId: teacher.schoolId,
        schoolName: teacher.schoolName,
        teacherProfile: teacher.teacherProfile,
        createdAt: teacher.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error getting teacher profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get teacher profile",
      error: error.message,
    });
  }
};

/**
 * Update Teacher Profile
 */
export const updateTeacherProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const updates = req.body;

    const teacher = await UserModel.findById(userId);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Update allowed fields
    const allowedUpdates = ["name", "phone", "avatar"];
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (teacher as any)[key] = updates[key];
      }
    });

    // Update teacher profile fields
    if (updates.teacherProfile) {
      const allowedProfileUpdates = [
        "subjects",
        "qualification",
        "yearsOfExperience",
        "specialization",
      ];

      Object.keys(updates.teacherProfile).forEach((key) => {
        if (allowedProfileUpdates.includes(key) && teacher.teacherProfile) {
          (teacher.teacherProfile as any)[key] = updates.teacherProfile[key];
        }
      });
    }

    await teacher.save();

    return res.status(200).json({
      success: true,
      message: "Teacher profile updated successfully",
      teacher,
    });
  } catch (error: any) {
    console.error("Error updating teacher profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update teacher profile",
      error: error.message,
    });
  }
};
