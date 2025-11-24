import { Request, Response } from "express";
import UserProgressModel from "../models/UserProgress.js";
import { AiSessionModel } from "../models/AiSession.js";
import SkillTreeNodeModel from "../models/SkillTreeNode.js";

interface AiContextOptions {
  includeProgress?: boolean;
  includeSkillTree?: boolean;
  includeTelemetry?: boolean;
  includeClassData?: boolean;
  windowDays?: number;
}

/**
 * Build AI context for a student
 */
export const buildStudentContext = async (
  userId: string,
  schoolId: string,
  options: AiContextOptions = {}
) => {
  const {
    includeProgress = true,
    includeSkillTree = true,
    includeTelemetry = false,
    windowDays = 7,
  } = options;

  const context: Record<string, any> = {
    userId,
    schoolId,
    timestamp: new Date().toISOString(),
  };

  // Fetch user progress
  if (includeProgress) {
    const progress = await UserProgressModel.findOne({ userId });
    if (progress) {
      const completedNodes = (progress as any).completedNodes || [];
      const recentErrors = completedNodes
        .filter((cn: any) => cn.score < 70)
        .slice(-5)
        .map((cn: any) => ({
          nodeId: cn.nodeId,
          subject: cn.subject,
          score: cn.score,
          mistakes: cn.mistakes || [],
        }));

      context.progress = {
        totalCompleted: completedNodes.length,
        currentStreak: (progress as any).currentStreak || 0,
        longestStreak: (progress as any).longestStreak || 0,
        averageScore:
          completedNodes.length > 0
            ? completedNodes.reduce((sum: number, cn: any) => sum + (cn.score || 0), 0) /
              completedNodes.length
            : 0,
        recentErrors,
        lastActivityDate: (progress as any).lastActivityDate,
      };
    }
  }

  // Fetch skill tree nodes (incomplete)
  if (includeSkillTree) {
    const completedNodeIds = context.progress?.recentErrors?.map((e: any) => e.nodeId) || [];
    const availableNodes = await SkillTreeNodeModel.find({
      _id: { $nin: completedNodeIds },
    })
      .limit(10)
      .select("title subject difficulty xpReward prerequisites");

    context.skillTree = {
      availableNodes: availableNodes.map((n) => ({
        id: n._id,
        title: n.title,
        subject: n.subject,
        difficulty: n.difficulty,
        xpReward: n.xpReward,
      })),
    };
  }

  // Fetch recent AI session history (for conversation continuity)
  if (includeTelemetry) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - windowDays);

    const recentSessions = await AiSessionModel.find({
      userId,
      createdAt: { $gte: cutoffDate },
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("sessionType messages.role messages.content createdAt");

    context.telemetry = {
      recentSessions: recentSessions.map((s) => ({
        sessionType: s.sessionType,
        messageCount: s.messages.length,
        lastMessage: s.messages[s.messages.length - 1]?.content.substring(0, 100),
        createdAt: s.createdAt,
      })),
    };
  }

  return context;
};

/**
 * Build AI context for a teacher
 */
export const buildTeacherContext = async (
  teacherId: string,
  schoolId: string,
  classId?: string,
  options: AiContextOptions = {}
) => {
  const { windowDays = 7 } = options;

  const context: Record<string, any> = {
    teacherId,
    schoolId,
    classId,
    timestamp: new Date().toISOString(),
  };

  // TODO: Fetch class analytics, student risk levels, recent interventions
  // This would integrate with teacherAnalyticsService

  context.teacherInsights = {
    placeholder: "Teacher analytics integration pending",
  };

  return context;
};

/**
 * Build AI context for content operations
 */
export const buildContentContext = async (
  userId: string,
  schoolId: string,
  templateId?: string
) => {
  const context: Record<string, any> = {
    userId,
    schoolId,
    templateId,
    timestamp: new Date().toISOString(),
  };

  // TODO: Fetch content templates, quiz banks, metadata
  // This would integrate with contentService

  context.contentData = {
    placeholder: "Content management integration pending",
  };

  return context;
};

/**
 * Cache context in Redis (placeholder)
 */
export const cacheContext = async (key: string, context: any, ttlSeconds: number = 300) => {
  // TODO: Implement Redis caching
  console.log(`[Cache] Would cache key: ${key} for ${ttlSeconds}s`);
  return context;
};

/**
 * Get cached context from Redis (placeholder)
 */
export const getCachedContext = async (key: string): Promise<any | null> => {
  // TODO: Implement Redis retrieval
  console.log(`[Cache] Would retrieve key: ${key}`);
  return null;
};
