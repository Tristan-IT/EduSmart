import { Request, Response } from "express";
import NotificationModel from "../models/Notification.js";
import type { NotificationType, NotificationCategory, NotificationPriority } from "../models/Notification.js";

/**
 * Get all notifications for current user
 * GET /api/notifications
 */
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.userId;
    const { read, category, limit = 50, skip = 0 } = req.query;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: "User not authenticated" 
      });
    }

    // Build query
    const query: any = { recipient: userId };
    
    if (read !== undefined) {
      query.read = read === "true";
    }
    
    if (category) {
      query.category = category;
    }

    const notifications = await NotificationModel.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string))
      .populate("sender", "name email")
      .lean();

    const total = await NotificationModel.countDocuments(query);
    const unreadCount = await NotificationModel.countDocuments({ 
      recipient: userId, 
      read: false 
    });

    res.json({
      success: true,
      data: {
        notifications,
        total,
        unreadCount,
        hasMore: total > parseInt(skip as string) + notifications.length
      }
    });
  } catch (error: any) {
    console.error("Error getting notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get notifications",
      error: error.message
    });
  }
};

/**
 * Get unread count
 * GET /api/notifications/unread-count
 */
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: "User not authenticated" 
      });
    }

    const count = await NotificationModel.getUnreadCount(userId);

    res.json({
      success: true,
      data: { count }
    });
  } catch (error: any) {
    console.error("Error getting unread count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get unread count",
      error: error.message
    });
  }
};

/**
 * Mark notification as read
 * PUT /api/notifications/:id/read
 */
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: "User not authenticated" 
      });
    }

    // Verify notification belongs to user
    const notification = await NotificationModel.findOne({ 
      _id: id, 
      recipient: userId 
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    await notification.markRead();

    res.json({
      success: true,
      message: "Notification marked as read",
      data: notification
    });
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message
    });
  }
};

/**
 * Mark all notifications as read
 * PUT /api/notifications/read-all
 */
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: "User not authenticated" 
      });
    }

    const result = await NotificationModel.markAllAsRead(userId);

    res.json({
      success: true,
      message: "All notifications marked as read",
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error: any) {
    console.error("Error marking all as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all as read",
      error: error.message
    });
  }
};

/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: "User not authenticated" 
      });
    }

    // Verify notification belongs to user
    const notification = await NotificationModel.findOneAndDelete({ 
      _id: id, 
      recipient: userId 
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.json({
      success: true,
      message: "Notification deleted"
    });
  } catch (error: any) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message
    });
  }
};

/**
 * Delete all read notifications
 * DELETE /api/notifications/clear
 */
export const clearAllRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id || (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: "User not authenticated" 
      });
    }

    const result = await NotificationModel.deleteMany({ 
      recipient: userId,
      read: true
    });

    res.json({
      success: true,
      message: "All read notifications cleared",
      data: { deletedCount: result.deletedCount }
    });
  } catch (error: any) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear notifications",
      error: error.message
    });
  }
};

/**
 * Create notification (admin/system use)
 * POST /api/notifications
 */
export const createNotification = async (req: Request, res: Response) => {
  try {
    const {
      recipient,
      recipientRole,
      sender,
      type,
      category,
      priority,
      title,
      message,
      actionUrl,
      metadata,
      expiresAt
    } = req.body;

    if (!recipient || !recipientRole || !title || !message || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const notification = await NotificationModel.create({
      recipient,
      recipientRole,
      sender,
      type: type || "info",
      category,
      priority: priority || "medium",
      title,
      message,
      actionUrl,
      metadata,
      expiresAt
    });

    res.status(201).json({
      success: true,
      message: "Notification created",
      data: notification
    });
  } catch (error: any) {
    console.error("Error creating notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create notification",
      error: error.message
    });
  }
};

/**
 * Create bulk notifications
 * POST /api/notifications/bulk
 */
export const createBulkNotifications = async (req: Request, res: Response) => {
  try {
    const { notifications } = req.body;

    if (!Array.isArray(notifications) || notifications.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Notifications array is required"
      });
    }

    const created = await NotificationModel.createBulkNotifications(notifications);

    res.status(201).json({
      success: true,
      message: `${created.length} notifications created`,
      data: { count: created.length }
    });
  } catch (error: any) {
    console.error("Error creating bulk notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create notifications",
      error: error.message
    });
  }
};
