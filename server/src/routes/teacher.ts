import { Router } from "express";
import {
  getTeacherDashboard,
  createTeacher,
  getAllTeachersBySchool,
  updateTeacher,
  deactivateTeacher,
  getTeacherSettings,
  updateTeacherSettings,
  changeTeacherPassword,
} from "../controllers/teacherController.js";
import { authenticate } from "../middleware/authenticate.js";

export const teacherRouter = Router();

// Protected routes
teacherRouter.get("/:id/dashboard", getTeacherDashboard);
teacherRouter.get("/profile/me", authenticate, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await (await import("../models/User.js")).default
      .findById(userId)
      .populate("teacherProfile.subjectRefs", "name code color icon")
      .populate("teacherProfile.classes", "className gradeLevel semester")
      .populate("school", "schoolName schoolId");

    if (!user || user.role !== "teacher") {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    return res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
        school: user.school,
        schoolId: user.schoolId,
        schoolName: user.schoolName,
        teacherProfile: user.teacherProfile,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error fetching teacher profile:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Update own profile
teacherRouter.put("/profile/me", authenticate, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, phone, address, bio, employeeId, qualification } = req.body;

    const user = await (await import("../models/User.js")).default.findById(userId);
    if (!user || user.role !== "teacher") {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    // Update basic info
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    // Update teacher profile
    if (!user.teacherProfile) {
      user.teacherProfile = { subjects: [], subjectRefs: [], classes: [], classIds: [] };
    }
    if (bio !== undefined) user.teacherProfile.bio = bio;
    if (employeeId !== undefined) user.teacherProfile.employeeId = employeeId;
    if (qualification !== undefined) user.teacherProfile.qualification = qualification;

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        address: user.address,
        teacherProfile: user.teacherProfile,
      },
    });
  } catch (error: any) {
    console.error("Error updating teacher profile:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Settings routes
teacherRouter.get("/settings", authenticate, getTeacherSettings as any);
teacherRouter.put("/settings", authenticate, updateTeacherSettings as any);

// Password change route
teacherRouter.put("/profile/password", authenticate, changeTeacherPassword as any);

// School owner routes
teacherRouter.post("/create", authenticate, createTeacher as any);
teacherRouter.get("/school/all", authenticate, getAllTeachersBySchool as any);
teacherRouter.put("/:teacherId", authenticate, updateTeacher as any);
teacherRouter.delete("/:teacherId", authenticate, deactivateTeacher as any);

export default teacherRouter;
