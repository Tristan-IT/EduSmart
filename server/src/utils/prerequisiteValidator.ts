import UserProgressModel from '../models/UserProgress.js';
import SkillTreeNodeModel from '../models/SkillTreeNode.js';

/**
 * Prerequisites Validation Utility
 * Checks if a student meets the requirements to access a skill tree node
 */

export interface PrerequisiteCheck {
  isMet: boolean;
  missingPrerequisites: string[];
  completedPrerequisites: string[];
  prerequisiteDetails: Array<{
    nodeId: string;
    title: string;
    isCompleted: boolean;
    completedAt?: Date;
    score?: number;
  }>;
}

export interface NodeAccessValidation {
  canAccess: boolean;
  isLocked: boolean;
  lockReason?: string;
  prerequisiteCheck: PrerequisiteCheck;
  levelRequirement?: {
    required: number;
    current: number;
    isMet: boolean;
  };
  minimumScoreRequirement?: {
    required: number;
    achieved: number;
    isMet: boolean;
  };
}

/**
 * Check if all prerequisites for a node are completed
 */
export async function checkPrerequisites(
  userId: string,
  nodeId: string
): Promise<PrerequisiteCheck> {
  try {
    // Fetch the target node
    const node = await SkillTreeNodeModel.findById(nodeId);
    if (!node) {
      throw new Error('Node not found');
    }

    // If no prerequisites, return success
    if (!node.prerequisites || node.prerequisites.length === 0) {
      return {
        isMet: true,
        missingPrerequisites: [],
        completedPrerequisites: [],
        prerequisiteDetails: []
      };
    }

    // Fetch user progress
    const userProgress = await UserProgressModel.findOne({ userId });
    if (!userProgress) {
      // No progress means nothing completed
      const prereqNodes = await SkillTreeNodeModel.find({
        _id: { $in: node.prerequisites }
      });

      return {
        isMet: false,
        missingPrerequisites: node.prerequisites.map(p => p.toString()),
        completedPrerequisites: [],
        prerequisiteDetails: prereqNodes.map(pNode => ({
          nodeId: (pNode._id as any).toString(),
          title: pNode.title,
          isCompleted: false
        }))
      };
    }

    // Get completed node IDs from UserProgress records
    const completedRecords = await UserProgressModel.find({
      user: userId,
      status: 'completed'
    });
    const completedNodeIds = completedRecords.map((record: any) => record.nodeId.toString());

    // Check each prerequisite
    const prerequisiteIds = node.prerequisites.map(p => p.toString());
    const completed = prerequisiteIds.filter(prereqId => completedNodeIds.includes(prereqId));
    const missing = prerequisiteIds.filter(prereqId => !completedNodeIds.includes(prereqId));

    // Fetch details for all prerequisites
    const prereqNodes = await SkillTreeNodeModel.find({
      _id: { $in: node.prerequisites }
    });

    const prerequisiteDetails = prereqNodes.map(pNode => {
      const nodeIdStr = (pNode._id as any).toString();
      const completedRecord = completedRecords.find(
        (record: any) => record.nodeId.toString() === nodeIdStr
      );

      return {
        nodeId: nodeIdStr,
        title: pNode.title,
        isCompleted: !!completedRecord,
        completedAt: completedRecord?.completedAt,
        score: completedRecord?.bestScore
      };
    });

    return {
      isMet: missing.length === 0,
      missingPrerequisites: missing,
      completedPrerequisites: completed,
      prerequisiteDetails
    };
  } catch (error) {
    console.error('Error checking prerequisites:', error);
    throw error;
  }
}

/**
 * Comprehensive validation of node access
 */
export async function validateNodeAccess(
  userId: string,
  nodeId: string,
  userLevel: number = 1
): Promise<NodeAccessValidation> {
  try {
    const node = await SkillTreeNodeModel.findById(nodeId);
    if (!node) {
      return {
        canAccess: false,
        isLocked: true,
        lockReason: 'Node not found',
        prerequisiteCheck: {
          isMet: false,
          missingPrerequisites: [],
          completedPrerequisites: [],
          prerequisiteDetails: []
        }
      };
    }

    // Check prerequisites
    const prerequisiteCheck = await checkPrerequisites(userId, nodeId);

    // Check level requirement (if exists)
    let levelRequirement;
    if (node.minimumLevel) {
      levelRequirement = {
        required: node.minimumLevel,
        current: userLevel,
        isMet: userLevel >= node.minimumLevel
      };
    }

    // Determine if node is accessible
    let canAccess = prerequisiteCheck.isMet;
    let lockReason;

    if (!prerequisiteCheck.isMet) {
      const missingCount = prerequisiteCheck.missingPrerequisites.length;
      lockReason = `Complete ${missingCount} prerequisite${missingCount > 1 ? 's' : ''} to unlock`;
    } else if (levelRequirement && !levelRequirement.isMet) {
      canAccess = false;
      lockReason = `Reach level ${levelRequirement.required} to unlock (current: ${levelRequirement.current})`;
    }

    return {
      canAccess,
      isLocked: !canAccess,
      lockReason,
      prerequisiteCheck,
      levelRequirement
    };
  } catch (error) {
    console.error('Error validating node access:', error);
    throw error;
  }
}

/**
 * Get all accessible nodes for a user
 */
export async function getAccessibleNodes(
  userId: string,
  userLevel: number,
  subjectFilter?: string
): Promise<{
  accessible: any[];
  locked: any[];
  completed: any[];
}> {
  try {
    // Fetch all nodes (optionally filtered by subject)
    const query = subjectFilter ? { subject: subjectFilter } : {};
    const allNodes = await SkillTreeNodeModel.find(query);

    // Fetch user completed nodes from UserProgress records
    const completedRecords = await UserProgressModel.find({
      user: userId,
      status: 'completed'
    });
    const completedNodeIds = completedRecords.map((record: any) => record.nodeId.toString());

    // Categorize nodes
    const accessible = [];
    const locked = [];
    const completed = [];

    for (const node of allNodes) {
      const nodeIdStr = (node._id as any).toString();

      // Check if completed
      if (completedNodeIds.includes(nodeIdStr)) {
        completed.push(node);
        continue;
      }

      // Validate access
      const validation = await validateNodeAccess(userId, nodeIdStr, userLevel);

      if (validation.canAccess) {
        accessible.push({
          ...node.toObject(),
          validation
        });
      } else {
        locked.push({
          ...node.toObject(),
          validation
        });
      }
    }

    return { accessible, locked, completed };
  } catch (error) {
    console.error('Error getting accessible nodes:', error);
    throw error;
  }
}

/**
 * Calculate prerequisite chain depth
 */
export async function getPrerequisiteChain(nodeId: string): Promise<string[]> {
  const visited = new Set<string>();
  const chain: string[] = [];

  async function traverse(currentNodeId: string) {
    if (visited.has(currentNodeId)) return;
    visited.add(currentNodeId);

    const node = await SkillTreeNodeModel.findById(currentNodeId);
    if (!node || !node.prerequisites || node.prerequisites.length === 0) {
      return;
    }

    for (const prereqId of node.prerequisites) {
      const prereqIdStr = prereqId.toString();
      chain.push(prereqIdStr);
      await traverse(prereqIdStr);
    }
  }

  await traverse(nodeId);
  return [...new Set(chain)]; // Remove duplicates
}

/**
 * Validate if a student can start a quiz for a node
 */
export async function validateQuizAccess(
  userId: string,
  nodeId: string,
  userLevel: number
): Promise<{
  canStart: boolean;
  reason?: string;
  requiresLessonView?: boolean;
}> {
  const validation = await validateNodeAccess(userId, nodeId, userLevel);

  if (!validation.canAccess) {
    return {
      canStart: false,
      reason: validation.lockReason
    };
  }

  // Check if lesson must be viewed first (optional business rule)
  const node = await SkillTreeNodeModel.findById(nodeId);
  if (node?.lessonContent && node.lessonContent.textContent) {
    // Check if lesson was viewed
    const userProgress = await UserProgressModel.findOne({ 
      user: userId, 
      nodeId: nodeId 
    });
    const lessonViewed = userProgress?.lessonViewed || false;

    if (!lessonViewed && node.requiresLessonView) {
      return {
        canStart: false,
        reason: 'You must view the lesson before taking the quiz',
        requiresLessonView: true
      };
    }
  }

  return { canStart: true };
}
