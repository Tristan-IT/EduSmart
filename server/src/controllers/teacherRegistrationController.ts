import type { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import SchoolModel from "../models/School.js";
import UserModel from "../models/User.js";
import { TeacherProfileModel } from "../models/TeacherProfile.js";
import { signAccessToken } from "../utils/token.js";
import type { Types } from "mongoose";

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
        subjects: subjects || [],
        classes: [],
        classIds: [],
        qualification,
        yearsOfExperience,
        specialization,
      },
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

    // Generate JWT token
    const token = signAccessToken({
      sub: (teacher._id as any).toString(),
      role: teacher.role,
      name: teacher.name,
      email: teacher.email,
    });

    return res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
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
      token,
    });
  } catch (error: any) {
    console.error("Error registering teacher:", error);
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
