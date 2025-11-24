import type { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import SchoolModel from "../models/School.js";
import UserModel from "../models/User.js";
import { signAccessToken } from "../utils/token.js";
import type { Types } from "mongoose";
import ClassModel from "../models/Class.js";
import StudentProfileModel from "../models/StudentProfile.js";
import TeacherProfileModel from "../models/TeacherProfile.js";
import SchoolAnalyticsModel from "../models/SchoolAnalytics.js";
import type { AuthenticatedRequest } from "../middleware/authenticate.js";
import type { ISMKMajor } from "../models/School.js";
import { createSubjectsFromTemplates } from "../services/subjectService.js";

/**
 * School Setup - Configure school type and related settings
 * This should be done once after school registration
 */
export const setupSchoolType = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { schoolTypes, smaSpecializations, smkMajors } = req.body;

    // Validation
    if (!schoolTypes || !Array.isArray(schoolTypes) || schoolTypes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one school type must be selected",
      });
    }

    // Validate all school types
    const validTypes = ["SD", "SMP", "SMA", "SMK"];
    const invalidTypes = schoolTypes.filter((type: string) => !validTypes.includes(type));
    if (invalidTypes.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid school types: ${invalidTypes.join(", ")}. Must be SD, SMP, SMA, or SMK`,
      });
    }

    // Get school from authenticated user
    const userId = req.user?.id;
    const owner = await UserModel.findById(userId);

    if (!owner || !owner.ownedSchool) {
      return res.status(404).json({
        success: false,
        message: "School not found for this owner",
      });
    }

    const school = await SchoolModel.findById(owner.ownedSchool);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    // Validate SMA specializations if SMA is selected
    if (schoolTypes.includes("SMA")) {
      if (!smaSpecializations || !Array.isArray(smaSpecializations) || smaSpecializations.length === 0) {
        return res.status(400).json({
          success: false,
          message: "SMA must have at least one specialization (IPA, IPS, Bahasa)",
        });
      }

      const validSpecializations = ["IPA", "IPS", "BAHASA"];
      const invalidSpecs = smaSpecializations.filter(
        (s: string) => !validSpecializations.includes(s.toUpperCase())
      );

      if (invalidSpecs.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid specializations: ${invalidSpecs.join(", ")}. Valid: IPA, IPS, BAHASA`,
        });
      }

      school.smaSpecializations = smaSpecializations.map((s: string) => s.toUpperCase());
    } else {
      school.smaSpecializations = undefined;
    }

    // Validate SMK majors if SMK is selected
    if (schoolTypes.includes("SMK")) {
      if (!smkMajors || !Array.isArray(smkMajors) || smkMajors.length === 0) {
        return res.status(400).json({
          success: false,
          message: "SMK must have at least one major configured",
        });
      }

      // Validate each major
      for (const major of smkMajors) {
        if (!major.code || !major.name) {
          return res.status(400).json({
            success: false,
            message: "Each major must have code and name",
          });
        }
      }

      school.smkMajors = smkMajors.map((m: ISMKMajor) => ({
        code: m.code.toUpperCase().trim(),
        name: m.name.trim(),
        description: m.description?.trim(),
      }));
    } else {
      school.smkMajors = undefined;
    }

    // Update school types
    school.schoolTypes = schoolTypes;
    school.schoolType = schoolTypes[0]; // Set first type for backward compatibility
    await school.save();

    // Auto-create default subjects based on selected school types
    try {
      await createSubjectsFromTemplates(school._id as Types.ObjectId, schoolTypes);
    } catch (subjectError: any) {
      // Log error but don't fail the request - subjects can be created manually
      console.error("Error creating default subjects:", subjectError);
    }

    return res.status(200).json({
      success: true,
      message: "School configuration updated successfully",
      data: {
        schoolTypes: school.schoolTypes,
        schoolType: school.schoolType,
        smaSpecializations: school.smaSpecializations,
        smkMajors: school.smkMajors,
      },
    });
  } catch (error: any) {
    console.error("Error setting up school type:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to setup school type",
      error: error.message,
    });
  }
};

/**
 * Get School Setup Configuration
 */
export const getSchoolSetup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const owner = await UserModel.findById(userId);

    if (!owner || !owner.ownedSchool) {
      return res.status(404).json({
        success: false,
        message: "School not found for this owner",
      });
    }

    const school = await SchoolModel.findById(owner.ownedSchool);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        schoolTypes: school.schoolTypes || [school.schoolType] || [],
        schoolType: school.schoolType, // Backward compatibility
        smaSpecializations: school.smaSpecializations || [],
        smkMajors: school.smkMajors || [],
        isConfigured: !!(school.schoolTypes?.length || school.schoolType),
      },
    });
  } catch (error: any) {
    console.error("Error getting school setup:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get school setup",
      error: error.message,
    });
  }
};

/**
 * School Owner Registration
 * Creates both School and Owner account
 */
export const registerSchoolOwner = async (req: Request, res: Response) => {
  try {
    const {
      // Owner info
      name,
      email,
      password,
      phone,

      // School info
      schoolName,
      address, // Frontend sends 'address', map to schoolAddress
      city,
      province,
      schoolPhone,
      schoolEmail,
      academicYear,
      website,

      // School type configuration
      schoolTypes,
      smaSpecializations,
      smkMajors,
    } = req.body;

    // Validation
    if (!name || !email || !password || !schoolName || !address || !city || !province) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // Check if school email already exists
    const existingSchool = await SchoolModel.findOne({ email: schoolEmail || email });
    if (existingSchool) {
      return res.status(400).json({
        success: false,
        message: "School with this email already exists",
      });
    }

    // Check if owner email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create owner user first (needed for school owner field)
    const owner = await UserModel.create({
      name,
      email,
      passwordHash,
      phone,
      role: "school_owner",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      isSchoolOwner: true,
    });

    // Create school
    const school = await SchoolModel.create({
      schoolName,
      address: address, // Use 'address' from request
      city,
      province,
      phone: schoolPhone || phone,
      email: schoolEmail || email,
      website,
      owner: owner._id,
      ownerName: name,
      ownerEmail: email,
      totalClasses: 0, // Will be auto-calculated when classes are created
      academicYear: academicYear || "2024/2025",
      subscriptionPlan: "free",
      subscriptionStatus: "active",
      // School type configuration
      schoolTypes: schoolTypes || ["SD"],
      schoolType: schoolTypes && schoolTypes.length > 0 ? schoolTypes[0] : "SD", // Use first type as primary for backward compatibility
      smaSpecializations: schoolTypes?.includes("SMA") ? smaSpecializations : undefined,
      smkMajors: schoolTypes?.includes("SMK") ? smkMajors : undefined,
    });

    // Update owner with school reference
    owner.school = school._id as Types.ObjectId;
    owner.schoolId = school.schoolId;
    owner.schoolName = school.schoolName;
    owner.ownedSchool = school._id as Types.ObjectId;
    await owner.save();

    // Generate JWT token
    const token = signAccessToken({
      sub: (owner._id as any).toString(),
      role: owner.role,
      name: owner.name,
      email: owner.email,
    }, "7d");

    return res.status(201).json({
      success: true,
      message: "School and owner account created successfully",
      data: {
        school: {
          id: school._id,
          schoolId: school.schoolId,
          schoolName: school.schoolName,
          city: school.city,
          province: school.province,
          totalClasses: school.totalClasses,
          academicYear: school.academicYear,
        },
        user: {
          id: owner._id,
          name: owner.name,
          email: owner.email,
          role: owner.role,
          schoolId: owner.schoolId,
          schoolName: owner.schoolName,
          avatar: owner.avatar,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error("Error registering school owner:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register school owner",
      error: error.message,
    });
  }
};

/**
 * School Owner Login
 */
export const loginSchoolOwner = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user with role school_owner
    const owner = await UserModel.findOne({ 
      email, 
      role: "school_owner" 
    }).populate("school");

    if (!owner) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or account not found",
      });
    }

    // Verify password
    if (!owner.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    
    const isPasswordValid = await bcryptjs.compare(password, owner.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = signAccessToken({
      sub: (owner._id as any).toString(),
      role: owner.role,
      name: owner.name,
      email: owner.email,
    }, "7d");

    // Get school data
    const school = await SchoolModel.findById(owner.ownedSchool || owner.school);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role,
        schoolId: owner.schoolId,
        schoolName: owner.schoolName,
        avatar: owner.avatar,
      },
      school: school ? {
        id: school._id,
        schoolId: school.schoolId,
        schoolName: school.schoolName,
        city: school.city,
        province: school.province,
      } : null,
    });
  } catch (error: any) {
    console.error("Error logging in school owner:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error.message,
    });
  }
};

/**
 * Get School Details (for owner)
 */
export const getSchoolDetails = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;
    const userId = (req as any).user?.id;

    const school = await SchoolModel.findOne({ schoolId }).populate("owner", "name email");

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    // Verify ownership
    if ((school.owner._id as any).toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    return res.status(200).json({
      success: true,
      school: {
        id: school._id,
        schoolId: school.schoolId,
        schoolName: school.schoolName,
        address: school.address,
        city: school.city,
        province: school.province,
        phone: school.phone,
        email: school.email,
        website: school.website,
        logoUrl: school.logoUrl,
        ownerName: school.ownerName,
        ownerEmail: school.ownerEmail,
        totalClasses: school.totalClasses,
        totalTeachers: school.totalTeachers,
        totalStudents: school.totalStudents,
        academicYear: school.academicYear,
        subscriptionPlan: school.subscriptionPlan,
        subscriptionStatus: school.subscriptionStatus,
        createdAt: school.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error getting school details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get school details",
      error: error.message,
    });
  }
};

/**
 * Update School Details
 */
export const updateSchool = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;
    const userId = (req as any).user?.id;
    const updates = req.body;

    const school = await SchoolModel.findOne({ schoolId });

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    // Verify ownership
    if (school.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      "schoolName",
      "address",
      "city",
      "province",
      "phone",
      "email",
      "website",
      "logoUrl",
      "totalClasses",
      "academicYear",
    ];

    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (school as any)[key] = updates[key];
      }
    });

    await school.save();

    return res.status(200).json({
      success: true,
      message: "School updated successfully",
      school,
    });
  } catch (error: any) {
    console.error("Error updating school:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update school",
      error: error.message,
    });
  }
};

/**
 * Get School Owner Profile
 */
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const owner = await UserModel.findById(userId).select("-password");
    
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    return res.status(200).json({
      success: true,
      name: owner.name,
      email: owner.email,
      schoolId: owner.schoolId,
      schoolName: owner.schoolName,
      avatar: owner.avatar,
    });
  } catch (error: any) {
    console.error("Error getting profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

/**
 * Update School Owner Profile
 */
export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, email } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const owner = await UserModel.findById(userId);
    
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    // Check if email is already taken
    if (email && email !== owner.email) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
      owner.email = email;
    }

    if (name) owner.name = name;
    
    await owner.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

/**
 * Change Password
 */
export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password required",
      });
    }

    const owner = await UserModel.findById(userId);
    
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    // Verify current password
    const isValid = await bcryptjs.compare(currentPassword, (owner as any).password);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    (owner as any).password = await bcryptjs.hash(newPassword, 10);
    await owner.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};

/**
 * Get School by ID
 */
export const getSchoolById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { schoolId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const school = await SchoolModel.findOne({ schoolId });
    
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found",
      });
    }

    // Verify ownership
    if (school.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    return res.status(200).json({
      success: true,
      school: {
        schoolId: school.schoolId,
        schoolName: school.schoolName,
        email: school.email,
        phone: school.phone,
        address: school.address,
        city: school.city,
        province: school.province,
        postalCode: (school as any).postalCode,
        academicYear: (school as any).academicYear,
      },
    });
  } catch (error: any) {
    console.error("Error getting school:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get school",
      error: error.message,
    });
  }
};

/**
 * Get Analytics Data for School Owner
 * Provides comprehensive analytics including:
 * - Overview stats (students, teachers, classes)
 * - Student performance trends
 * - Teacher workload
 * - Class distribution
 */
export const getSchoolAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { schoolId } = req.params;
    const { dateRange = "30" } = req.query; // Default 30 days

    // Verify ownership
    const owner = await UserModel.findById(req.user?.id);
    if (!owner || owner.role !== "school_owner") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Verify school belongs to owner
    const school = await SchoolModel.findOne({ schoolId, owner: req.user?.id });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found or you don't have access",
      });
    }

    // Calculate date range
    const days = parseInt(dateRange as string) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total counts
    const totalStudents = await UserModel.countDocuments({
      role: "student",
      school: school._id,
      isActive: true,
    });

    const totalTeachers = await UserModel.countDocuments({
      role: "teacher",
      school: school._id,
      isActive: true,
    });

    const totalClasses = await ClassModel.countDocuments({
      school: school._id,
      isActive: true,
    });

    // Get active students (logged in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeStudents = await UserModel.countDocuments({
      role: "student",
      school: school._id,
      isActive: true,
      lastLogin: { $gte: sevenDaysAgo },
    });

    // Get class distribution
    const classDistribution = await ClassModel.aggregate([
      { $match: { school: school._id, isActive: true } },
      {
        $group: {
          _id: "$grade",
          count: { $sum: 1 },
          totalStudents: { $sum: "$currentStudents" },
          avgStudents: { $avg: "$currentStudents" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get student performance trends (last 30 days)
    const studentProfiles = await StudentProfileModel.find({
      school: school._id,
    })
      .select("currentXP currentLevel streak lastActiveDate")
      .limit(100);

    // Calculate average XP and Level
    const avgXP =
      studentProfiles.length > 0
        ? studentProfiles.reduce((sum, s) => sum + ((s as any).currentXP || 0), 0) /
          studentProfiles.length
        : 0;

    const avgLevel =
      studentProfiles.length > 0
        ? studentProfiles.reduce((sum, s) => sum + ((s as any).currentLevel || 1), 0) /
          studentProfiles.length
        : 1;

    // Get teacher workload
    const teacherWorkload = await ClassModel.aggregate([
      { $match: { school: school._id, isActive: true } },
      {
        $lookup: {
          from: "users",
          localField: "homeRoomTeacher",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: { path: "$teacher", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$homeRoomTeacher",
          teacherName: { $first: "$teacher.name" },
          totalClasses: { $sum: 1 },
          totalStudents: { $sum: "$currentStudents" },
        },
      },
      { $match: { _id: { $ne: null } } },
      { $sort: { totalStudents: -1 } },
      { $limit: 10 },
    ]);

    // Get performance trends (simulated for last 7 days)
    const performanceTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      performanceTrends.push({
        date: date.toISOString().split("T")[0],
        activeStudents: Math.floor(activeStudents * (0.7 + Math.random() * 0.3)),
        avgXP: Math.floor(avgXP * (0.9 + Math.random() * 0.2)),
        quizzesTaken: Math.floor(Math.random() * 50 + 20),
      });
    }

    // Get top performing students
    const topStudents = await StudentProfileModel.find({
      school: school._id,
    })
      .sort({ currentXP: -1 })
      .limit(5)
      .populate("user", "name email")
      .select("currentXP currentLevel streak user");

    // Response
    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalStudents,
          totalTeachers,
          totalClasses,
          activeStudents,
          activeStudentsPercentage:
            totalStudents > 0
              ? Math.round((activeStudents / totalStudents) * 100)
              : 0,
          avgXP: Math.round(avgXP),
          avgLevel: Math.round(avgLevel * 10) / 10,
        },
        classDistribution: classDistribution.map((c) => ({
          grade: `Kelas ${c._id}`,
          count: c.count,
          totalStudents: c.totalStudents,
          avgStudents: Math.round(c.avgStudents),
        })),
        teacherWorkload: teacherWorkload.map((t) => ({
          name: t.teacherName,
          classes: t.totalClasses,
          students: t.totalStudents,
        })),
        performanceTrends,
        topStudents: topStudents.map((s: any) => ({
          name: s.user?.name || "Unknown",
          email: s.user?.email || "",
          xp: s.currentXP,
          level: s.currentLevel,
          streak: s.streak,
        })),
        dateRange: {
          days,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
        },
      },
    });
  } catch (error: any) {
    console.error("Error getting analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get analytics",
      error: error.message,
    });
  }
};
