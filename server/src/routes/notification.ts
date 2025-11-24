import { Router } from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllRead,
  createNotification,
  createBulkNotifications
} from "../controllers/notificationController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get notifications for current user
router.get("/", getNotifications);

// Get unread count
router.get("/unread-count", getUnreadCount);

// Mark notification as read
router.put("/:id/read", markAsRead);

// Mark all as read
router.put("/read-all", markAllAsRead);

// Delete notification
router.delete("/:id", deleteNotification);

// Clear all read notifications
router.delete("/clear/all", clearAllRead);

// Create notification (for system/admin use)
router.post("/", createNotification);

// Create bulk notifications
router.post("/bulk", createBulkNotifications);

export default router;
