import { Router } from "express";
import { addMentorMessage, getMentorSession, getStudentDashboard, listStudents } from "../controllers/studentController.js";
import {
  getStudentProfile,
  updateStudentProfile,
  getOnboardingStatus,
  switchSemester,
  changePassword,
  updateStudentSettings,
} from "../controllers/studentProfileController.js";
import { authenticate } from "../middleware/authenticate.js";

export const studentRouter = Router();

studentRouter.get("/", listStudents);
studentRouter.get("/:id/dashboard", getStudentDashboard);
studentRouter.get("/:id/mentor-session", getMentorSession);
studentRouter.post("/:id/mentor-session/messages", addMentorMessage);

// Student profile routes (require authentication)
studentRouter.get("/profile", authenticate, getStudentProfile);
studentRouter.get("/profile/me", authenticate, getStudentProfile);
studentRouter.put("/profile", authenticate, updateStudentProfile);
studentRouter.put("/profile/me", authenticate, updateStudentProfile);
studentRouter.put("/profile/password", authenticate, changePassword);
studentRouter.get("/settings", authenticate, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const UserModel = (await import("../models/User.js")).default;
    const user = await UserModel.findById(userId).select("settings");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, settings: user.settings || {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch settings" });
  }
});
studentRouter.put("/settings", authenticate, updateStudentSettings);
studentRouter.get("/onboarding-status", authenticate, getOnboardingStatus);
studentRouter.post("/switch-semester", authenticate, switchSemester);

export default studentRouter;
