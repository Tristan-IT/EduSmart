import { Request, Response } from 'express';
import SkillTreeNodeModel from '../models/SkillTreeNode.js';
import mongoose from 'mongoose';

/**
 * Bulk Operations Service for Skill Tree Nodes
 * Enables teachers to efficiently manage multiple nodes
 */

export interface BulkCreateNodeData {
  nodes: Array<{
    nodeId: string;
    title: string;
    description: string;
    subject: string;
    difficulty: string;
    xpReward: number;
    gemsReward: number;
    order: number;
    prerequisites?: string[];
    dependencies?: string[];
    quizzes?: any[];
    lessonContent?: any;
  }>;
}

export interface BulkUpdateData {
  nodeIds: string[];
  updates: {
    subject?: string;
    difficulty?: string;
    xpReward?: number;
    gemsReward?: number;
    tags?: string[];
    isCheckpoint?: boolean;
  };
}

export interface BulkDeleteData {
  nodeIds: string[];
  cascade?: boolean; // Remove from prerequisites
}

export interface CloneNodeData {
  sourceNodeId: string;
  count: number;
  modifications?: {
    titlePrefix?: string;
    orderOffset?: number;
    subject?: string;
  };
}

/**
 * Create multiple nodes in one operation
 */
export async function bulkCreateNodes(req: Request, res: Response) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { nodes }: BulkCreateNodeData = req.body;

    if (!nodes || nodes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No nodes provided'
      });
    }

    if (nodes.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 100 nodes per bulk operation'
      });
    }

    // Validate all nodes before creating
    const errors: string[] = [];
    nodes.forEach((node, index) => {
      if (!node.title) errors.push(`Node ${index + 1}: Title is required`);
      if (!node.subject) errors.push(`Node ${index + 1}: Subject is required`);
      if (!node.difficulty) errors.push(`Node ${index + 1}: Difficulty is required`);
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Create all nodes
    const createdNodes = await SkillTreeNodeModel.insertMany(nodes, { session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: `Successfully created ${createdNodes.length} nodes`,
      nodes: createdNodes,
      count: createdNodes.length
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in bulk create:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create nodes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    session.endSession();
  }
}

/**
 * Update multiple nodes with same changes
 */
export async function bulkUpdateNodes(req: Request, res: Response) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { nodeIds, updates }: BulkUpdateData = req.body;

    if (!nodeIds || nodeIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No node IDs provided'
      });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No updates provided'
      });
    }

    // Perform bulk update
    const result = await SkillTreeNodeModel.updateMany(
      { _id: { $in: nodeIds } },
      { $set: updates },
      { session }
    );

    await session.commitTransaction();

    return res.json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} nodes`,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in bulk update:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update nodes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    session.endSession();
  }
}

/**
 * Delete multiple nodes
 */
export async function bulkDeleteNodes(req: Request, res: Response) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { nodeIds, cascade = false }: BulkDeleteData = req.body;

    if (!nodeIds || nodeIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No node IDs provided'
      });
    }

    // If cascade, remove from prerequisites of other nodes
    if (cascade) {
      await SkillTreeNodeModel.updateMany(
        { prerequisites: { $in: nodeIds } },
        { $pull: { prerequisites: { $in: nodeIds } } },
        { session }
      );

      await SkillTreeNodeModel.updateMany(
        { dependencies: { $in: nodeIds } },
        { $pull: { dependencies: { $in: nodeIds } } },
        { session }
      );
    }

    // Delete nodes
    const result = await SkillTreeNodeModel.deleteMany(
      { _id: { $in: nodeIds } },
      { session }
    );

    await session.commitTransaction();

    return res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} nodes`,
      deletedCount: result.deletedCount,
      cascadeApplied: cascade
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in bulk delete:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete nodes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    session.endSession();
  }
}

/**
 * Clone a node multiple times
 */
export async function cloneNode(req: Request, res: Response) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { sourceNodeId, count, modifications }: CloneNodeData = req.body;

    if (!sourceNodeId) {
      return res.status(400).json({
        success: false,
        message: 'Source node ID is required'
      });
    }

    if (!count || count < 1 || count > 50) {
      return res.status(400).json({
        success: false,
        message: 'Count must be between 1 and 50'
      });
    }

    // Find source node
    const sourceNode = await SkillTreeNodeModel.findById(sourceNodeId);
    if (!sourceNode) {
      return res.status(404).json({
        success: false,
        message: 'Source node not found'
      });
    }

    // Create clones
    const clones = [];
    for (let i = 0; i < count; i++) {
      const clone = {
        ...sourceNode.toObject(),
        _id: new mongoose.Types.ObjectId(),
        nodeId: `${sourceNode.nodeId}-clone-${i + 1}`,
        title: modifications?.titlePrefix 
          ? `${modifications.titlePrefix} ${i + 1}`
          : `${sourceNode.title} (Copy ${i + 1})`,
        order: (sourceNode.order || 0) + (modifications?.orderOffset || 0) + i,
        subject: modifications?.subject || sourceNode.subject,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      clones.push(clone);
    }

    const createdClones = await SkillTreeNodeModel.insertMany(clones, { session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: `Successfully cloned node ${count} times`,
      clones: createdClones,
      count: createdClones.length
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in clone node:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clone node',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    session.endSession();
  }
}

/**
 * Bulk assign quizzes to multiple nodes
 */
export async function bulkAssignQuizzes(req: Request, res: Response) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { nodeIds, quizzes } = req.body;

    if (!nodeIds || nodeIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No node IDs provided'
      });
    }

    if (!quizzes || quizzes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No quizzes provided'
      });
    }

    // Add quizzes to all specified nodes
    const result = await SkillTreeNodeModel.updateMany(
      { _id: { $in: nodeIds } },
      { $push: { quizzes: { $each: quizzes } } },
      { session }
    );

    await session.commitTransaction();

    return res.json({
      success: true,
      message: `Successfully assigned ${quizzes.length} quizzes to ${result.modifiedCount} nodes`,
      modifiedCount: result.modifiedCount,
      quizzesAdded: quizzes.length
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in bulk assign quizzes:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to assign quizzes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    session.endSession();
  }
}

/**
 * Bulk reorder nodes
 */
export async function bulkReorderNodes(req: Request, res: Response) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { nodeOrders } = req.body as { nodeOrders: Array<{ nodeId: string; order: number }> };

    if (!nodeOrders || nodeOrders.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No node orders provided'
      });
    }

    // Update each node's order
    const updates = nodeOrders.map(({ nodeId, order }) =>
      SkillTreeNodeModel.updateOne(
        { _id: nodeId },
        { $set: { order } },
        { session }
      )
    );

    await Promise.all(updates);

    await session.commitTransaction();

    return res.json({
      success: true,
      message: `Successfully reordered ${nodeOrders.length} nodes`,
      count: nodeOrders.length
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in bulk reorder:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reorder nodes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    session.endSession();
  }
}

/**
 * Import nodes from CSV/JSON template
 */
export async function importNodesFromTemplate(req: Request, res: Response) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { template, format = 'json' } = req.body;

    if (!template) {
      return res.status(400).json({
        success: false,
        message: 'No template data provided'
      });
    }

    let nodes;
    
    if (format === 'json') {
      nodes = Array.isArray(template) ? template : [template];
    } else {
      return res.status(400).json({
        success: false,
        message: 'Only JSON format is currently supported'
      });
    }

    // Validate and create nodes
    const createdNodes = await SkillTreeNodeModel.insertMany(nodes, { session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: `Successfully imported ${createdNodes.length} nodes`,
      nodes: createdNodes,
      count: createdNodes.length
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error importing nodes:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to import nodes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    session.endSession();
  }
}
