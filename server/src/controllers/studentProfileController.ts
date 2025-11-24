import { Request, Response } from "express";
import UserModel from "../models/User.js";

/**
 * Get current user's student profile
 * GET /api/student/profile
 */
export const getStudentProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user injected by authenticate middleware
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not authenticated",
      });
    }

    const user = await UserModel.findById(userId)
      .populate("class", "name level")
      .populate("school", "name")
      .select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can access student profile",
      });
    }

    // Format response to match frontend interface
    const profileData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phone,
      studentId: user.studentId,
      dateOfBirth: null, // Add this to User model if needed
      address: user.address,
      class: user.class ? {
        _id: (user.class as any)._id,
        name: (user.class as any).name,
        level: (user.class as any).level,
      } : null,
      school: user.school ? {
        _id: (user.school as any)._id,
        name: (user.school as any).name,
      } : null,
      parents: {
        fatherName: user.parentName,
        motherName: null, // Add if needed
        guardianPhone: user.parentPhone,
      },
    };

    res.json(profileData);
  } catch (error: any) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student profile",
      error: error.message,
    });
  }
};

/**
 * Update student profile (onboarding)
 * PUT /api/student/profile
 */
export const updateStudentProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user injected by authenticate middleware
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not authenticated",
      });
    }

    const { name, email, phoneNumber, address, currentGrade, currentClass, currentSemester, major } = req.body;

    // Validation (only if onboarding data is provided)
    if (currentGrade || currentClass || currentSemester) {
      const validGrades = ["SD", "SMP", "SMA", "SMK"];
      if (currentGrade && !validGrades.includes(currentGrade)) {
        return res.status(400).json({
          success: false,
          message: `Invalid grade level. Must be one of: ${validGrades.join(", ")}`,
        });
      }

      if (currentClass && (currentClass < 1 || currentClass > 12)) {
        return res.status(400).json({
          success: false,
          message: "Invalid class number. Must be between 1 and 12",
        });
      }

      if (currentSemester && ![1, 2].includes(currentSemester)) {
        return res.status(400).json({
          success: false,
          message: "Invalid semester. Must be 1 or 2",
        });
      }

      // Validate class number is within grade level range
      if (currentGrade && currentClass) {
        const gradeRanges: Record<string, { min: number; max: number }> = {
          SD: { min: 1, max: 6 },
          SMP: { min: 7, max: 9 },
          SMA: { min: 10, max: 12 },
          SMK: { min: 10, max: 12 },
        };

        const range = gradeRanges[currentGrade];
        if (currentClass < range.min || currentClass > range.max) {
          return res.status(400).json({
            success: false,
            message: `Invalid class number for ${currentGrade}. Must be between ${range.min} and ${range.max}`,
          });
        }
      }

      // SMK requires major
      if (currentGrade === "SMK" && !major) {
        return res.status(400).json({
          success: false,
          message: "Major (jurusan) is required for SMK students",
        });
      }
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can update student profile",
      });
    }

    // Update basic info
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber !== undefined) user.phone = phoneNumber;
    if (address !== undefined) user.address = address;

    // Update student profile if provided
    if (currentGrade || currentClass || currentSemester) {
      if (!user.studentProfile) {
        user.studentProfile = {
          currentGrade: currentGrade || "SMA",
          currentClass: currentClass || 10,
          currentSemester: currentSemester || 1,
          onboardingComplete: false,
        };
      }
      
      if (currentGrade) user.studentProfile.currentGrade = currentGrade;
      if (currentClass) user.studentProfile.currentClass = currentClass;
      if (currentSemester) user.studentProfile.currentSemester = currentSemester;
      if (currentGrade === "SMK" && major) user.studentProfile.major = major;
      user.studentProfile.onboardingComplete = true;
    }

    await user.save();

    res.json({
      success: true,
      message: "Student profile updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating student profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update student profile",
      error: error.message,
    });
  }
};

/**
 * Check if student has completed onboarding
 * GET /api/student/onboarding-status
 */
export const getOnboardingStatus = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user injected by authenticate middleware
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not authenticated",
      });
    }

    const user = await UserModel.findById(userId).select("studentProfile role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "student") {
      return res.json({
        success: true,
        onboardingComplete: true, // Non-students don't need onboarding
        requiresOnboarding: false,
      });
    }

    const onboardingComplete = user.studentProfile?.onboardingComplete || false;

    res.json({
      success: true,
      onboardingComplete,
      requiresOnboarding: !onboardingComplete,
      profile: user.studentProfile || null,
    });
  } catch (error: any) {
    console.error("Error checking onboarding status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check onboarding status",
      error: error.message,
    });
  }
};

/**
 * Change password
 * PUT /api/student/profile/password
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not authenticated",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await (user as any).comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    (user as any).passwordHash = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};

/**
 * Update student settings
 * PUT /api/student/settings
 */
export const updateStudentSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not authenticated",
      });
    }

    const { notifications, learning, privacy, sound } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize settings if not exists
    if (!user.settings) {
      user.settings = {};
    }

    // Update settings
    if (notifications) user.settings.notifications = { ...user.settings.notifications, ...notifications };
    if (learning) user.settings.learning = { ...user.settings.learning, ...learning };
    if (privacy) user.settings.privacy = { ...user.settings.privacy, ...privacy };
    if (sound) user.settings.sound = { ...user.settings.sound, ...sound };
    user.settings.updatedAt = new Date();

    await user.save();

    res.json({
      success: true,
      message: "Settings updated successfully",
      settings: user.settings,
    });
  } catch (error: any) {
    console.error("Error updating settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
};

/**
 * Switch semester (for existing students)
 * POST /api/student/switch-semester
 */
export const switchSemester = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - req.user injected by authenticate middleware
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not authenticated",
      });
    }

    const { semester } = req.body;

    if (![1, 2].includes(semester)) {
      return res.status(400).json({
        success: false,
        message: "Invalid semester. Must be 1 or 2",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can switch semester",
      });
    }

    if (!user.studentProfile) {
      return res.status(400).json({
        success: false,
        message: "Student profile not found. Please complete onboarding first",
      });
    }

    // Update semester
    user.studentProfile.currentSemester = semester;
    await user.save();

    res.json({
      success: true,
      message: `Switched to semester ${semester}`,
      profile: user.studentProfile,
    });
  } catch (error: any) {
    console.error("Error switching semester:", error);
    res.status(500).json({
      success: false,
      message: "Failed to switch semester",
      error: error.message,
    });
  }
};
