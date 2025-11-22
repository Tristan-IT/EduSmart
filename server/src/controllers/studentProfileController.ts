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

    const user = await UserModel.findById(userId).select("studentProfile name email role");

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

    res.json({
      success: true,
      profile: user.studentProfile || null,
      user: {
        name: user.name,
        email: user.email,
      },
    });
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

    const { currentGrade, currentClass, currentSemester, major } = req.body;

    // Validation
    if (!currentGrade || !currentClass || !currentSemester) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: currentGrade, currentClass, currentSemester",
      });
    }

    const validGrades = ["SD", "SMP", "SMA", "SMK"];
    if (!validGrades.includes(currentGrade)) {
      return res.status(400).json({
        success: false,
        message: `Invalid grade level. Must be one of: ${validGrades.join(", ")}`,
      });
    }

    if (currentClass < 1 || currentClass > 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid class number. Must be between 1 and 12",
      });
    }

    if (![1, 2].includes(currentSemester)) {
      return res.status(400).json({
        success: false,
        message: "Invalid semester. Must be 1 or 2",
      });
    }

    // Validate class number is within grade level range
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

    // SMK requires major
    if (currentGrade === "SMK" && !major) {
      return res.status(400).json({
        success: false,
        message: "Major (jurusan) is required for SMK students",
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
        message: "Only students can update student profile",
      });
    }

    // Update student profile
    user.studentProfile = {
      currentGrade,
      currentClass,
      currentSemester,
      major: currentGrade === "SMK" ? major : undefined,
      onboardingComplete: true,
    };

    await user.save();

    res.json({
      success: true,
      message: "Student profile updated successfully",
      profile: user.studentProfile,
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
