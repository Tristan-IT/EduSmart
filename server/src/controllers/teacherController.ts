import type { Request, Response } from "express";
import UserModel, { type UserDocument } from "../models/User.js";
import { TeacherProfileModel } from "../models/TeacherProfile.js";
import { StudentProfileModel, type StudentProfileDocument } from "../models/StudentProfile.js";
import { TelemetryEventModel } from "../models/TelemetryEvent.js";
import bcrypt from "bcryptjs";
import ClassModel from "../models/Class.js";
import SchoolModel from "../models/School.js";
import SubjectModel from "../models/Subject.js";

const mapStudent = (profile: StudentProfileDocument & { user: UserDocument }) => {
  const user = profile.user;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    className: user.className,
    masteryPerTopic: profile.masteryPerTopic,
    xp: profile.xp,
    level: profile.level,
    league: profile.league,
    dailyGoalXP: profile.dailyGoalXP,
    dailyGoalProgress: profile.dailyGoalProgress,
    streak: profile.streak,
    riskLevel: profile.riskLevel,
  };
};

export const getTeacherDashboard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const teacher = await UserModel.findById(id).exec();
  if (!teacher) {
    return res.status(404).json({ message: "Guru tidak ditemukan" });
  }
  if (teacher.role !== "teacher") {
    return res.status(400).json({ message: "Akun bukan guru" });
  }

  const teacherProfile = await TeacherProfileModel.findOne({ user: teacher.id }).exec();
  const studentProfiles: Array<StudentProfileDocument & { user: UserDocument }> = await StudentProfileModel.find()
    .populate("user")
    .exec() as Array<StudentProfileDocument & { user: UserDocument }>;

  const students = studentProfiles.map(mapStudent);
  const riskStudents = students.filter((student) => student.riskLevel === "high" || student.riskLevel === "medium");
  const telemetry = await TelemetryEventModel.find().sort({ timestamp: -1 }).limit(40).exec();
  const representativeSkillTree = studentProfiles[0]?.skillTree ?? [];

  return res.json({
    teacher: {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      role: teacher.role,
      avatar: teacher.avatar,
      schoolId: teacher.schoolId,
    },
    profile: teacherProfile,
    students,
    riskStudents,
    telemetry,
    skillTree: representativeSkillTree,
    stats: {
      totalStudents: students.length,
      riskCount: riskStudents.filter((student) => student.riskLevel === "high").length,
      averageMastery:
        students.length > 0
          ? Math.round(
              students.reduce((acc, student) => {
                const masteries = Object.values(student.masteryPerTopic ?? {});
                const average = masteries.length
                  ? masteries.reduce((a, b) => a + b, 0) / masteries.length
                  : 0;
                return acc + average;
              }, 0) / students.length
            )
          : 0,
    },
  });
};

// Create new teacher (School Owner only)
export const createTeacher = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, subjects } = req.body;
    const user = req.user as any;

    // Verify school owner
    if (!user || user.role !== "school_owner") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create teacher user
    const teacher = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      school: user.school,
      schoolId: user.schoolId,
      schoolName: user.schoolName,
      isActive: true,
    });

    // Create teacher profile
    await TeacherProfileModel.create({
      user: teacher._id,
      phone: phone || "",
      subjects: subjects || [],
      bio: "",
    });

    res.status(201).json({
      message: "Teacher created successfully",
      teacher: {
        _id: teacher._id,
        teacherId: (teacher as any).teacherId,
        name: teacher.name,
        email: teacher.email,
      },
    });
  } catch (error: any) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get all teachers by school
export const getAllTeachersBySchool = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    if (!user || user.role !== "school_owner") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const teachers = await UserModel.find({
      role: "teacher",
      school: user.school,
    }).populate("school");

    // Get additional stats for each teacher
    const teachersWithStats = await Promise.all(
      teachers.map(async (teacher) => {
        const classes = await ClassModel.find({
          $or: [
            { homeRoomTeacher: teacher._id },
            { "subjectTeachers.teacher": teacher._id },
          ],
        });

        const profile = await TeacherProfileModel.findOne({ user: teacher._id });

        return {
          _id: teacher._id,
          teacherId: (teacher as any).teacherId,
          name: teacher.name,
          email: teacher.email,
          phone: (profile as any)?.phone || "",
          subjects: (profile as any)?.subjects || [],
          totalClasses: classes.length,
          totalStudents: classes.reduce((sum, cls) => sum + ((cls as any).studentCount || 0), 0),
          isActive: (teacher as any).isActive,
        };
      })
    );

    res.json({ teachers: teachersWithStats });
  } catch (error: any) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update teacher
export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.params;
    const {
      name,
      email,
      phone,
      employeeId,
      qualification,
      address,
      bio,
      subjects, // Array of subject names
      classIds, // Array of class classId strings
    } = req.body;
    const user = req.user as any;

    if (!user || user.role !== "school_owner") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const teacher = await UserModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Get school to validate subjects and classes belong to the same school
    const school = await SchoolModel.findOne({ owner: user.userId });
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // Update basic user info
    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (employeeId) (teacher as any).employeeId = employeeId;
    await teacher.save();

    // Process subjects - convert names to ObjectIds
    let subjectObjectIds: any[] = [];
    let subjectNames: string[] = [];
    if (subjects && Array.isArray(subjects) && subjects.length > 0) {
      subjectNames = subjects;
      const foundSubjects = await SubjectModel.find({
        school: school._id,
        name: { $in: subjectNames },
        isActive: true,
      });
      
      if (foundSubjects.length !== subjectNames.length) {
        const foundNames = foundSubjects.map(s => s.name);
        const missingSubjects = subjectNames.filter(name => !foundNames.includes(name));
        return res.status(400).json({ 
          message: `Mata pelajaran tidak ditemukan: ${missingSubjects.join(", ")}` 
        });
      }
      
      subjectObjectIds = foundSubjects.map(s => s._id);
    }

    // Process classes - convert classId strings to ObjectIds
    let classObjectIds: any[] = [];
    let validClassIds: string[] = [];
    if (classIds && Array.isArray(classIds) && classIds.length > 0) {
      validClassIds = classIds;
      const foundClasses = await ClassModel.find({
        school: school._id,
        classId: { $in: validClassIds },
      });
      
      if (foundClasses.length !== validClassIds.length) {
        const foundIds = foundClasses.map(c => c.classId);
        const missingClasses = validClassIds.filter(id => !foundIds.includes(id));
        return res.status(400).json({ 
          message: `Kelas tidak ditemukan: ${missingClasses.join(", ")}` 
        });
      }
      
      classObjectIds = foundClasses.map(c => c._id);
    }

    // Update teacher profile with all fields
    const profileData: any = {
      phone: phone || "",
      qualification: qualification || "",
      address: address || "",
      bio: bio || "",
      subjects: subjectNames,
      subjectRefs: subjectObjectIds,
      classIds: validClassIds,
      classes: classObjectIds,
    };

    await TeacherProfileModel.findOneAndUpdate(
      { user: teacherId },
      profileData,
      { upsert: true, new: true }
    );

    res.json({ 
      message: "Data guru berhasil diperbarui",
      data: {
        teacher: {
          ...teacher.toObject(),
          teacherProfile: profileData,
        }
      }
    });
  } catch (error: any) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Deactivate teacher
export const deactivateTeacher = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.params;
    const user = req.user as any;

    if (!user || user.role !== "school_owner") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const teacher = await UserModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    (teacher as any).isActive = false;
    await teacher.save();

    res.json({ message: "Teacher deactivated successfully" });
  } catch (error: any) {
    console.error("Error deactivating teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get teacher settings
 * GET /api/teacher/settings
 */
export const getTeacherSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not authenticated",
      });
    }

    const user = await UserModel.findById(userId).select("settings");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      settings: user.settings || {},
    });
  } catch (error: any) {
    console.error("Error fetching teacher settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};

/**
 * Update teacher settings
 * PUT /api/teacher/settings
 */
export const updateTeacherSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not authenticated",
      });
    }

    const { notifications, academic, privacy, sound } = req.body;

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
    if (academic) user.settings.academic = { ...user.settings.academic, ...academic };
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
    console.error("Error updating teacher settings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
};

/**
 * Change teacher password
 * PUT /api/teacher/profile/password
 */
export const changeTeacherPassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Get user with password field
    const user = await UserModel.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const bcryptjs = await import("bcryptjs");
    const isPasswordValid = await bcryptjs.compare(currentPassword, (user as any).passwordHash || '');

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    (user as any).passwordHash = hashedPassword;
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
