/**
 * Teacher Skill Tree Management Controller
 * Allows teachers/admins to create, edit, and delete skill tree nodes
 */

import { Request, Response } from "express";
import SkillTreeNode from "../models/SkillTreeNode";

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

    // Create new node
    const newNode = new SkillTreeNode({
      ...nodeData,
      isTemplate: false, // Custom nodes are not templates
      school: (req.user as any).school // Associate with teacher's school
    });

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

    // Prevent updating nodeId
    delete updates.nodeId;

    // Update node
    Object.assign(node, updates);
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
    const { newNodeId, modifications } = req.body;

    if (!newNodeId) {
      return res.status(400).json({
        success: false,
        message: "New node ID is required"
      });
    }

    const originalNode = await SkillTreeNode.findOne({ nodeId });

    if (!originalNode) {
      return res.status(404).json({
        success: false,
        message: "Original node not found"
      });
    }

    // Check if new ID already exists
    const existing = await SkillTreeNode.findOne({ nodeId: newNodeId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "New node ID already exists"
      });
    }

    // Clone node
    const clonedData = originalNode.toObject();
    delete clonedData._id;
    // @ts-ignore - __v is optional
    delete clonedData.__v;

    const newNode = new SkillTreeNode({
      ...clonedData,
      nodeId: newNodeId,
      // @ts-ignore - node.name exists
      name: modifications?.name || `${originalNode.name} (Copy)`,
      isTemplate: false,
      school: (req.user as any).school,
      ...modifications
    });

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

    const { nodes, replaceExisting } = req.body;

    if (!Array.isArray(nodes) || nodes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid nodes array"
      });
    }

    if (replaceExisting) {
      // Clear existing nodes with same IDs
      const nodeIds = nodes.map(n => n.nodeId);
      await SkillTreeNode.deleteMany({ nodeId: { $in: nodeIds } });
    }

    const result = await SkillTreeNode.insertMany(nodes, { ordered: false });

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
