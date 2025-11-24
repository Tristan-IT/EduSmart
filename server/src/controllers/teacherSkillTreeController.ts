/**
 * Teacher Skill Tree Management Controller
 * Allows teachers/admins to create, edit, and delete skill tree nodes
 */

import { Request, Response } from "express";
import { Types } from "mongoose";
import SkillTreeNode from "../models/SkillTreeNode.js";

type AuthenticatedUser = {
  _id?: Types.ObjectId;
  role?: string;
  school?: Types.ObjectId | string;
};

const slugify = (value?: string | null) => {
  if (!value) return "general";
  return (
    value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "general"
  );
};

const toNumber = (value: any) => {
  if (value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const normalizeNodePayload = (
  rawData: any,
  options: { partial?: boolean; user?: AuthenticatedUser } = {}
) => {
  const { partial = false, user } = options;
  const normalized: Record<string, any> = {};
  const hasValue = (val: any) => val !== undefined && val !== null;

  const ensure = (key: string, val: any, fallback?: () => any) => {
    if (hasValue(val)) {
      normalized[key] = val;
    } else if (!partial && fallback) {
      normalized[key] = fallback();
    }
  };

  const copy = (key: string, val: any) => {
    if (hasValue(val)) normalized[key] = val;
  };

  ensure("nodeId", rawData.nodeId, () => `node-${Date.now()}`);
  const nodeId = normalized.nodeId;

  const topicCode = rawData.topicCode ?? rawData.moduleId ?? nodeId;
  ensure("moduleId", rawData.moduleId ?? topicCode, () => nodeId);

  const nameValue = rawData.name ?? rawData.title;
  ensure("title", rawData.title ?? nameValue, () => nameValue || "Skill Tree Node");
  copy("name", nameValue || normalized.title);

  const subjectName = rawData.subject ?? rawData.categoryName;
  const fallbackSubject = subjectName || "General";
  ensure("categoryName", subjectName, () => fallbackSubject);
  ensure("categoryId", rawData.categoryId, () => slugify(fallbackSubject));

  ensure("description", rawData.description, () => "");
  ensure("position", rawData.position, () => ({ x: 0, y: 0 }));

  const xpReward = rawData.xpReward ?? rawData.rewards?.xp ?? rawData.xpRequired ?? 50;
  ensure("xpReward", rawData.xpReward, () => xpReward);
  const gemsReward = rawData.gemsReward ?? rawData.rewards?.gems ?? 5;
  ensure("gemsReward", rawData.gemsReward ?? rawData.rewards?.gems, () => gemsReward);
  ensure("prerequisites", rawData.prerequisites, () => []);
  ensure("isCheckpoint", rawData.isCheckpoint, () => false);
  ensure("difficulty", rawData.difficulty, () => "Sedang");

  const estimatedDuration =
    rawData.estimatedDuration ??
    (hasValue(rawData.estimatedMinutes) ? `${rawData.estimatedMinutes} menit` : undefined);
  ensure("estimatedDuration", estimatedDuration, () => "60 menit");

  copy("gradeLevel", rawData.gradeLevel);
  copy("classNumber", toNumber(rawData.classNumber));
  copy("semester", toNumber(rawData.semester));
  copy("curriculum", rawData.curriculum);
  copy("kompetensiDasar", rawData.kompetensiDasar);
  copy("topicCode", topicCode);
  copy("icon", rawData.icon);
  copy("color", rawData.color);
  copy("level", toNumber(rawData.level));
  copy("xpRequired", toNumber(rawData.xpRequired) ?? xpReward);
  copy("quizCount", toNumber(rawData.quizCount));
  copy("estimatedMinutes", toNumber(rawData.estimatedMinutes));

  if (rawData.rewards || !partial) {
    normalized.rewards = {
      xp: rawData.rewards?.xp ?? xpReward,
      gems: rawData.rewards?.gems ?? gemsReward,
      hearts: rawData.rewards?.hearts,
      badge: rawData.rewards?.badge,
      certificate: rawData.rewards?.certificate,
    };
  }

  if (!partial) {
    normalized.isTemplate = false;
    if (user?._id) normalized.createdBy = user._id;
    if (user?.school) normalized.school = user.school;
    ensure("status", rawData.status, () => "published");
    ensure("version", rawData.version, () => "1.0");
  } else {
    copy("status", rawData.status);
    copy("version", rawData.version);
    copy("isTemplate", rawData.isTemplate);
  }

  return normalized;
};

// Define ApiResponse type locally
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

// Create a new skill tree node (Teacher/Admin only)
export const createSkillTreeNode = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Check if user is teacher or admin
    const userRole = (req.user as any).role;
    if (!["teacher", "admin", "school_owner"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Only teachers and admins can create skill tree nodes"
      });
    }

    const nodeData = req.body;

    // Validate required fields
    const requiredFields = ["nodeId", "name", "subject", "gradeLevel", "classNumber", "semester"];
    const missingFields = requiredFields.filter(field => !nodeData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`
      });
    }

    // Check if nodeId already exists
    const existing = await SkillTreeNode.findOne({ nodeId: nodeData.nodeId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Node ID already exists. Please use a unique ID."
      });
    }

    const newNode = new SkillTreeNode(
      normalizeNodePayload(nodeData, { user: req.user as AuthenticatedUser })
    );

    await newNode.save();

    const response: ApiResponse = {
      success: true,
      data: { node: newNode },
      message: "Skill tree node created successfully"
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating skill tree node:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create skill tree node",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Update existing skill tree node
export const updateSkillTreeNode = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const userRole = (req.user as any).role;
    if (!["teacher", "admin", "school_owner"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Only teachers and admins can update skill tree nodes"
      });
    }

    const { nodeId } = req.params;
    const updates = req.body;

    const node = await SkillTreeNode.findOne({ nodeId });

    if (!node) {
      return res.status(404).json({
        success: false,
        message: "Skill tree node not found"
      });
    }

    // Check if node belongs to teacher's school (or is admin)
    if (userRole !== "admin" && node.school && node.school.toString() !== (req.user as any).school?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update nodes from your school"
      });
    }

    delete updates.nodeId;

    const normalizedUpdates = normalizeNodePayload(updates, {
      partial: true,
      user: req.user as AuthenticatedUser,
    });

    Object.assign(node, normalizedUpdates);
    await node.save();

    const response: ApiResponse = {
      success: true,
      data: { node },
      message: "Skill tree node updated successfully"
    };

    res.json(response);
  } catch (error) {
    console.error("Error updating skill tree node:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update skill tree node",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Delete skill tree node
export const deleteSkillTreeNode = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const userRole = (req.user as any).role;
    if (!["teacher", "admin", "school_owner"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Only teachers and admins can delete skill tree nodes"
      });
    }

    const { nodeId } = req.params;

    const node = await SkillTreeNode.findOne({ nodeId });

    if (!node) {
      return res.status(404).json({
        success: false,
        message: "Skill tree node not found"
      });
    }

    // Prevent deletion of template nodes by non-admins
    if (node.isTemplate && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete template nodes"
      });
    }

    // Check school ownership
    if (userRole !== "admin" && node.school && node.school.toString() !== (req.user as any).school?.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete nodes from your school"
      });
    }

    // Check if node is used as prerequisite
    const dependentNodes = await SkillTreeNode.find({ prerequisites: nodeId });
    if (dependentNodes.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete: ${dependentNodes.length} node(s) depend on this as prerequisite`,
        // @ts-ignore - node.name exists
        data: { dependentNodes: dependentNodes.map(n => ({ id: n.nodeId, name: n.name })) }
      });
    }

    await SkillTreeNode.deleteOne({ nodeId });

    const response: ApiResponse = {
      success: true,
      message: "Skill tree node deleted successfully"
    };

    res.json(response);
  } catch (error) {
    console.error("Error deleting skill tree node:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete skill tree node",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Duplicate/Clone a node (useful for creating similar nodes)
export const cloneSkillTreeNode = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const userRole = (req.user as any).role;
    if (!["teacher", "admin", "school_owner"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Only teachers and admins can clone skill tree nodes"
      });
    }

    const { nodeId } = req.params;
    const { newNodeId, modifications } = req.body || {};

    const originalNode = await SkillTreeNode.findOne({ nodeId });

    if (!originalNode) {
      return res.status(404).json({
        success: false,
        message: "Original node not found"
      });
    }

    // Determine new node ID (generate fallback when not provided)
    let targetNodeId = newNodeId || `${nodeId}-copy-${Date.now()}`;

    // Ensure uniqueness even with generated ID
    let suffix = 1;
    // eslint-disable-next-line no-await-in-loop
    while (await SkillTreeNode.findOne({ nodeId: targetNodeId })) {
      targetNodeId = `${nodeId}-copy-${Date.now()}-${suffix++}`;
    }

    // Clone node
    const clonedData = originalNode.toObject();
    delete clonedData._id;
    // @ts-ignore - __v is optional
    delete clonedData.__v;

    delete clonedData.createdAt;
    delete clonedData.updatedAt;

    const normalizedClone = normalizeNodePayload(
      {
        ...clonedData,
        ...(modifications || {}),
        nodeId: targetNodeId,
        // @ts-ignore - name exists in schema
        name: modifications?.name || `${originalNode.name} (Copy)`,
      },
      { user: req.user as AuthenticatedUser }
    );

    const newNode = new SkillTreeNode(normalizedClone);

    await newNode.save();

    const response: ApiResponse = {
      success: true,
      data: { node: newNode },
      message: "Skill tree node cloned successfully"
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error cloning skill tree node:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clone skill tree node",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Bulk import nodes from JSON
export const bulkImportNodes = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const userRole = (req.user as any).role;
    if (!["admin"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Only admins can bulk import nodes"
      });
    }

    const { nodes, replaceExisting, replace } = req.body;
    const shouldReplace =
      typeof replaceExisting === "boolean"
        ? replaceExisting
        : typeof replace === "boolean"
          ? replace
          : false;

    if (!Array.isArray(nodes) || nodes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid nodes array"
      });
    }

    if (shouldReplace) {
      // Clear existing nodes with same IDs
      const nodeIds = nodes.map(n => n.nodeId);
      await SkillTreeNode.deleteMany({ nodeId: { $in: nodeIds } });
    }

    const normalizedNodes = nodes.map(node =>
      normalizeNodePayload(node, { user: req.user as AuthenticatedUser })
    );

    const result = await SkillTreeNode.insertMany(normalizedNodes, { ordered: false });

    const response: ApiResponse = {
      success: true,
      data: { 
        imported: result.length,
        nodes: result
      },
      message: `Successfully imported ${result.length} nodes`
    };

    res.status(201).json(response);
  } catch (error: any) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Some nodes have duplicate IDs. Use replaceExisting=true to overwrite.",
        error: error.message
      });
    }

    console.error("Error bulk importing nodes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to bulk import nodes",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
