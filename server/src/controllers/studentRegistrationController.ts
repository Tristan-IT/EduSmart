import type { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import SchoolModel from "../models/School.js";
import ClassModel from "../models/Class.js";
import UserModel from "../models/User.js";
import { StudentProfileModel } from "../models/StudentProfile.js";
import { signAccessToken } from "../utils/token.js";
import type { Types } from "mongoose";

/**
 * Enhanced Student Registration
 * Requires Class ID for multi-tenant system
 */
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const {
      // Personal info
      name,
      email,
      password,
      phone,

      // Class info
      classId,
      rollNumber, // Nomor absen (1-40)

      // Student info
      studentId, // NIS/NISN
      parentName,
      parentPhone,
      parentEmail,
    } = req.body;

    // Validation
    if (!name || !email || !password || !classId || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing: name, email, password, classId, rollNumber",
      });
    }

    // Validate class exists
    const classData = await ClassModel.findOne({ classId }).populate("school");
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found. Please check your Class ID.",
      });
    }

    if (!classData.isActive) {
      return res.status(400).json({
        success: false,
        message: "Class is inactive. Please contact your teacher.",
      });
    }

    const school = classData.school as any;
    if (!school || !school.isActive) {
      return res.status(400).json({
        success: false,
        message: "School is inactive. Please contact school administrator.",
      });
    }

    // Check if class is full
    if (classData.currentStudents >= classData.maxStudents) {
      return res.status(400).json({
        success: false,
        message: `Class is full. Maximum students: ${classData.maxStudents}`,
      });
    }

    // Check if roll number is already taken in this class
    const existingRollNumber = await UserModel.findOne({
      class: classData._id,
      rollNumber,
    });

    if (existingRollNumber) {
      return res.status(400).json({
        success: false,
        message: `Roll number ${rollNumber} is already taken in this class`,
      });
    }

    // Check if email already exists in this school
    const existingUser = await UserModel.findOne({
      email,
      school: school._id,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A student with this email already exists in this school",
      });
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create student user
    const student = await UserModel.create({
      name,
      email,
      passwordHash,
      phone,
      role: "student",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      
      // School relationship
      school: school._id as Types.ObjectId,
      schoolId: school.schoolId,
      schoolName: school.schoolName,
      
      // Class relationship
      class: classData._id as Types.ObjectId,
      classId: classData.classId,
      className: classData.className,
      rollNumber,
      
      // Student info
      studentId,
      parentName,
      parentPhone,
      parentEmail,
    });

    // Create StudentProfile with gamification data
    await StudentProfileModel.create({
      user: student._id,
      masteryPerTopic: {},
      xp: 0,
      level: 1,
      xpInLevel: 0,
      xpForNextLevel: 100,
      streak: 0,
      bestStreak: 0,
      dailyGoalXP: 30,
      dailyGoalProgress: 0,
      dailyGoalMet: false,
      dailyGoalClaimed: false,
      league: "bronze",
      riskLevel: "low",
      boosts: [],
      dailyPlan: [],
      aiRecommendations: [],
      aiRewardQuests: [],
      skillTree: [],
    });

    // Update class student count
    classData.currentStudents = (classData.currentStudents || 0) + 1;
    await classData.save();

    // Update school student count
    school.totalStudents = (school.totalStudents || 0) + 1;
    await school.save();

    // Generate JWT token
    const token = signAccessToken({
      sub: (student._id as any).toString(),
      role: student.role,
      name: student.name,
      email: student.email,
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        schoolId: student.schoolId,
        schoolName: student.schoolName,
        classId: student.classId,
        className: student.className,
        rollNumber: student.rollNumber,
        studentId: student.studentId,
        avatar: student.avatar,
      },
      token,
    });
  } catch (error: any) {
    console.error("Error registering student:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register student",
      error: error.message,
    });
  }
};

/**
 * Get Student Profile
 */
export const getStudentProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const student = await UserModel.findById(userId)
      .populate("school", "schoolId schoolName city province")
      .populate("class", "classId className grade section homeRoomTeacherName");

    if (!student || student.role !== "student") {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const profile = await StudentProfileModel.findOne({ user: student._id });

    return res.status(200).json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        avatar: student.avatar,
        phone: (student as any).phone,
        schoolId: student.schoolId,
        schoolName: student.schoolName,
        classId: student.classId,
        className: student.className,
        rollNumber: student.rollNumber,
        studentId: student.studentId,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        parentEmail: student.parentEmail,
        createdAt: student.createdAt,
      },
      gamification: profile ? {
        xp: profile.xp,
        level: profile.level,
        streak: profile.streak,
        league: profile.league,
        dailyGoalXP: profile.dailyGoalXP,
        dailyGoalProgress: profile.dailyGoalProgress,
      } : null,
    });
  } catch (error: any) {
    console.error("Error getting student profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get student profile",
      error: error.message,
    });
  }
};

/**
 * Update Student Profile
 */
export const updateStudentProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const updates = req.body;

    const student = await UserModel.findById(userId);

    if (!student || student.role !== "student") {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Update allowed fields
    const allowedUpdates = ["name", "phone", "avatar", "parentName", "parentPhone", "parentEmail"];
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (student as any)[key] = updates[key];
      }
    });

    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      student,
    });
  } catch (error: any) {
    console.error("Error updating student profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update student profile",
      error: error.message,
    });
  }
};
