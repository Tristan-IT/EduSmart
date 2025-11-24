import SkillTreeNodeModel from '../models/SkillTreeNode.js';
import UserProgressModel from '../models/UserProgress.js';
import UserModel from '../models/User.js';

/**
 * Learning Path Analytics Service
 * Provides comprehensive analytics for skill tree paths and student progress
 * 
 * NOTE: This service needs REFACTORING - currently uses legacy completedNodes structure
 * which no longer exists in UserProgressModel. Type assertions added as temporary fix.
 */

// Temporary type helper for legacy completedNodes structure
type LegacyUserProgress = any; // Should be refactored to use new UserProgress query pattern

export interface PathAnalytics {
  pathId: string;
  pathName: string;
  subject: string;
  difficulty: string;
  totalNodes: number;
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  completionRate: number;
  averageProgress: number;
  averageTimeToComplete: number; // in minutes
  averageScore: number;
  dropoutRate: number;
  dropoutPoints: DropoutPoint[];
  nodeAnalytics: NodeAnalytics[];
  progressDistribution: ProgressDistribution;
  timeDistribution: TimeDistribution;
  scoreDistribution: ScoreDistribution;
}

export interface NodeAnalytics {
  nodeId: string;
  nodeName: string;
  order: number;
  attemptsCount: number;
  completionCount: number;
  completionRate: number;
  averageScore: number;
  averageAttempts: number;
  averageTimeSpent: number;
  isBottleneck: boolean;
  dropoutCount: number;
}

export interface DropoutPoint {
  nodeId: string;
  nodeName: string;
  order: number;
  dropoutCount: number;
  dropoutPercentage: number;
  reason: string;
}

export interface ProgressDistribution {
  notStarted: number;
  inProgress: number;
  completed: number;
  percentages: {
    notStarted: number;
    inProgress: number;
    completed: number;
  };
}

export interface TimeDistribution {
  under1Hour: number;
  between1And3Hours: number;
  between3And6Hours: number;
  between6And12Hours: number;
  over12Hours: number;
}

export interface ScoreDistribution {
  excellent: number; // 90-100
  good: number; // 80-89
  average: number; // 70-79
  belowAverage: number; // 60-69
  poor: number; // <60
}

export interface StudentPathProgress {
  studentId: string;
  studentName: string;
  email: string;
  nodesCompleted: number;
  totalNodes: number;
  progressPercentage: number;
  averageScore: number;
  totalTimeSpent: number;
  lastActivity: Date;
  isStuck: boolean;
  currentNode?: string;
}

/**
 * Get comprehensive analytics for a learning path
 * TODO: CRITICAL REFACTOR NEEDED - UserProgress model structure changed
 * completedNodes array no longer exists, need to query UserProgressModel separately
 */
export async function getPathAnalytics(
  gradeLevel: string,
  classNumber: number,
  semester: number,
  subject: string
): Promise<PathAnalytics> {
  try {
    // Get all nodes in this path
    const nodes = await SkillTreeNodeModel.find({
      gradeLevel,
      classNumber,
      semester,
      subject
    }).sort({ order: 1 });

    if (nodes.length === 0) {
      throw new Error('No nodes found for this path');
    }

    const nodeIds = nodes.map((n: any) => n._id.toString());

    // Get all students who have completed any nodes in this path
    const progressRecords = await UserProgressModel.find({
      nodeId: { $in: nodeIds },
      status: 'completed'
    }).populate('user', 'name email');

    // Group by user
    const studentProgress = new Map<string, any[]>();
    progressRecords.forEach((record: any) => {
      const userId = record.user._id.toString();
      if (!studentProgress.has(userId)) {
        studentProgress.set(userId, []);
      }
      studentProgress.get(userId)!.push(record);
    });

    // Calculate metrics
    const totalStudents = studentProgress.size;
    let activeStudents = 0;
    let completedStudents = 0;

    studentProgress.forEach((records, userId) => {
      // Check if active (completed something in last 7 days)
      const lastActivity = records
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
      if (lastActivity) {
        const daysSinceActivity = (Date.now() - new Date(lastActivity.completedAt).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceActivity <= 7) activeStudents++;
      }

      // Check if completed all nodes in path
      const completedNodeIds = records.map(r => r.nodeId);
      const completedAll = nodeIds.every(nodeId => completedNodeIds.includes(nodeId));
      if (completedAll) completedStudents++;
    });

    const completionRate = totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;

    // Calculate average progress
    // TODO: REFACTOR NEEDED - UserProgress model changed, completedNodes no longer exists
    // This code needs to query UserProgressModel.find() with nodeId filter instead
    let totalProgress = 0;
    progressRecords.forEach((p: any) => {
      const completedCount = (p.completedNodes || []).filter((cn: any) => 
        nodeIds.includes(cn.nodeId.toString()) && cn.score >= 70
      ).length;
      totalProgress += (completedCount / nodes.length) * 100;
    });
    const averageProgress = totalStudents > 0 ? totalProgress / totalStudents : 0;

    // Calculate average time to complete
    let totalCompletionTime = 0;
    let completedCount = 0;
    (progressRecords as any[]).forEach((p: any) => {
      const pathNodes = (p.completedNodes || []).filter((cn: any) => 
        nodeIds.includes(cn.nodeId.toString()) && cn.score >= 70
      );
      if (pathNodes.length === nodes.length) {
        const totalTime = pathNodes.reduce((sum: number, cn: any) => sum + (cn.timeSpent || 0), 0);
        totalCompletionTime += totalTime;
        completedCount++;
      }
    });
    const averageTimeToComplete = completedCount > 0 ? totalCompletionTime / completedCount : 0;

    // Calculate average score
    let totalScore = 0;
    let scoreCount = 0;
    (progressRecords as any[]).forEach((p: any) => {
      (p.completedNodes || []).filter((cn: any) => nodeIds.includes(cn.nodeId.toString())).forEach((cn: any) => {
        totalScore += cn.score || 0;
        scoreCount++;
      });
    });
    const averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;

    // Calculate dropout rate
    const droppedOut = (progressRecords as any[]).filter((p: any) => {
      const pathNodes = (p.completedNodes || []).filter((cn: any) => nodeIds.includes(cn.nodeId.toString()));
      if (pathNodes.length === 0) return false;
      const lastActivity = pathNodes.sort((a: any, b: any) => 
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )[0];
      const daysSinceActivity = (Date.now() - new Date(lastActivity.completedAt).getTime()) / (1000 * 60 * 60 * 24);
      const completedCount = pathNodes.filter((cn: any) => cn.score >= 70).length;
      return daysSinceActivity > 14 && completedCount < nodes.length; // Inactive for 14+ days and incomplete
    }).length;
    const dropoutRate = totalStudents > 0 ? (droppedOut / totalStudents) * 100 : 0;

    // Node-level analytics
    const nodeAnalytics: NodeAnalytics[] = nodes.map(node => {
      const nodeId = (node._id as any).toString();
      let attemptsCount = 0;
      let completionCount = 0;
      let totalScore = 0;
      let totalAttempts = 0;
      let totalTimeSpent = 0;
      let dropoutCount = 0;

      (progressRecords as any[]).forEach((p: any) => {
        const nodeData = (p.completedNodes || []).find((cn: any) => cn.nodeId.toString() === nodeId);
        if (nodeData) {
          attemptsCount++;
          totalScore += nodeData.score || 0;
          totalAttempts += nodeData.attempts || 1;
          totalTimeSpent += nodeData.timeSpent || 0;
          if (nodeData.score >= 70) {
            completionCount++;
          }
          
          // Check if student dropped out after this node
          const nodeIndex = (p.completedNodes || []).findIndex((cn: any) => cn.nodeId.toString() === nodeId);
          const subsequentNodes = (p.completedNodes || []).slice(nodeIndex + 1).filter((cn: any) => 
            nodeIds.includes(cn.nodeId.toString())
          );
          if (subsequentNodes.length === 0 && completionCount < nodes.length) {
            const daysSince = (Date.now() - new Date(nodeData.completedAt).getTime()) / (1000 * 60 * 60 * 24);
            if (daysSince > 14) dropoutCount++;
          }
        }
      });

      const completionRate = attemptsCount > 0 ? (completionCount / attemptsCount) * 100 : 0;
      const averageScore = attemptsCount > 0 ? totalScore / attemptsCount : 0;
      const averageAttempts = attemptsCount > 0 ? totalAttempts / attemptsCount : 0;
      const averageTimeSpent = attemptsCount > 0 ? totalTimeSpent / attemptsCount : 0;
      const isBottleneck = completionRate < 50 || averageAttempts > 3;

      return {
        nodeId,
        nodeName: (node as any).title || (node as any).name,
        order: node.order || 0,
        attemptsCount,
        completionCount,
        completionRate,
        averageScore,
        averageAttempts,
        averageTimeSpent,
        isBottleneck,
        dropoutCount
      };
    });

    // Identify dropout points
    const dropoutPoints: DropoutPoint[] = nodeAnalytics
      .filter(na => na.dropoutCount > 0)
      .map(na => ({
        nodeId: na.nodeId,
        nodeName: na.nodeName,
        order: na.order,
        dropoutCount: na.dropoutCount,
        dropoutPercentage: totalStudents > 0 ? (na.dropoutCount / totalStudents) * 100 : 0,
        reason: na.isBottleneck ? 'High difficulty - low completion rate' : 'Engagement drop'
      }))
      .sort((a, b) => b.dropoutCount - a.dropoutCount)
      .slice(0, 5); // Top 5 dropout points

    // Progress distribution
    const progressDistribution: ProgressDistribution = {
      notStarted: 0,
      inProgress: progressRecords.filter(p => {
        const completed = (p as any).completedNodes.filter((cn: any) => 
          nodeIds.includes(cn.nodeId.toString()) && cn.score >= 70
        ).length;
        return completed > 0 && completed < nodes.length;
      }).length,
      completed: completedStudents,
      percentages: {
        notStarted: 0,
        inProgress: 0,
        completed: 0
      }
    };
    progressDistribution.percentages = {
      notStarted: totalStudents > 0 ? (progressDistribution.notStarted / totalStudents) * 100 : 0,
      inProgress: totalStudents > 0 ? (progressDistribution.inProgress / totalStudents) * 100 : 0,
      completed: completionRate
    };

    // Time distribution
    const timeDistribution: TimeDistribution = {
      under1Hour: 0,
      between1And3Hours: 0,
      between3And6Hours: 0,
      between6And12Hours: 0,
      over12Hours: 0
    };
    progressRecords.forEach(p => {
      const totalTime = (p as any).completedNodes
        .filter((cn: any) => nodeIds.includes(cn.nodeId.toString()))
        .reduce((sum: any, cn: any) => sum + (cn.timeSpent || 0), 0) / 60; // Convert to minutes
      
      if (totalTime < 60) timeDistribution.under1Hour++;
      else if (totalTime < 180) timeDistribution.between1And3Hours++;
      else if (totalTime < 360) timeDistribution.between3And6Hours++;
      else if (totalTime < 720) timeDistribution.between6And12Hours++;
      else timeDistribution.over12Hours++;
    });

    // Score distribution
    const scoreDistribution: ScoreDistribution = {
      excellent: 0,
      good: 0,
      average: 0,
      belowAverage: 0,
      poor: 0
    };
    progressRecords.forEach(p => {
      const scores = ((p as any).completedNodes || [])
        .filter((cn: any) => nodeIds.includes(cn.nodeId.toString()))
        .map((cn: any) => cn.score || 0);
      
      const avgScore = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
      
      if (avgScore >= 90) scoreDistribution.excellent++;
      else if (avgScore >= 80) scoreDistribution.good++;
      else if (avgScore >= 70) scoreDistribution.average++;
      else if (avgScore >= 60) scoreDistribution.belowAverage++;
      else scoreDistribution.poor++;
    });

    return {
      pathId: `${gradeLevel}-${classNumber}-${semester}-${subject}`,
      pathName: `${subject} - Kelas ${classNumber} Semester ${semester}`,
      subject,
      difficulty: nodes[0]?.difficulty || 'intermediate',
      totalNodes: nodes.length,
      totalStudents,
      activeStudents,
      completedStudents,
      completionRate,
      averageProgress,
      averageTimeToComplete,
      averageScore,
      dropoutRate,
      dropoutPoints,
      nodeAnalytics,
      progressDistribution,
      timeDistribution,
      scoreDistribution
    };
  } catch (error) {
    console.error('Error getting path analytics:', error);
    throw error;
  }
}

/**
 * Get student-level progress for a path
 */
export async function getStudentPathProgress(
  gradeLevel: string,
  classNumber: number,
  semester: number,
  subject: string
): Promise<StudentPathProgress[]> {
  try {
    const nodes = await SkillTreeNodeModel.find({
      gradeLevel,
      classNumber,
      semester,
      subject
    }).sort({ order: 1 });

    const nodeIds = nodes.map(n => (n._id as any).toString());

    const progressRecords = await UserProgressModel.find({
      'completedNodes.nodeId': { $in: nodeIds }
    }).populate('userId', 'name email');

    const studentProgress: StudentPathProgress[] = progressRecords.map(p => {
      const pathNodes = (p as any).completedNodes.filter((cn: any) => nodeIds.includes(cn.nodeId.toString()));
      const completedNodes = pathNodes.filter((cn: any) => cn.score >= 70);
      
      const totalScore = pathNodes.reduce((sum: any, cn: any) => sum + (cn.score || 0), 0);
      const averageScore = pathNodes.length > 0 ? totalScore / pathNodes.length : 0;
      
      const totalTimeSpent = pathNodes.reduce((sum: any, cn: any) => sum + (cn.timeSpent || 0), 0);
      
      const lastActivity = pathNodes.length > 0
        ? pathNodes.sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0].completedAt
        : new Date();
      
      const daysSinceActivity = (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24);
      const isStuck = daysSinceActivity > 7 && completedNodes.length < nodes.length && pathNodes.length > 0;
      
      const currentNodeIndex = completedNodes.length;
      const currentNode = currentNodeIndex < nodes.length ? (nodes[currentNodeIndex] as any).name : undefined;

      const user = (p as any).userId;

      return {
        studentId: (p.user as any).toString(),
        studentName: user?.name || 'Unknown',
        email: user?.email || '',
        nodesCompleted: completedNodes.length,
        totalNodes: nodes.length,
        progressPercentage: (completedNodes.length / nodes.length) * 100,
        averageScore,
        totalTimeSpent,
        lastActivity: new Date(lastActivity),
        isStuck,
        currentNode
      };
    });

    return studentProgress.sort((a, b) => b.progressPercentage - a.progressPercentage);
  } catch (error) {
    console.error('Error getting student path progress:', error);
    throw error;
  }
}

/**
 * Get analytics comparison across multiple subjects
 */
export async function getSubjectComparison(
  gradeLevel: string,
  classNumber: number,
  semester: number
): Promise<{
  subjects: string[];
  completionRates: number[];
  averageScores: number[];
  dropoutRates: number[];
  totalStudents: Record<string, number>;
}> {
  try {
    const subjects = await SkillTreeNodeModel.distinct('subject', {
      gradeLevel,
      classNumber,
      semester
    });

    const completionRates: number[] = [];
    const averageScores: number[] = [];
    const dropoutRates: number[] = [];
    const totalStudents: Record<string, number> = {};

    for (const subject of subjects) {
      const analytics = await getPathAnalytics(gradeLevel, classNumber, semester, subject.toString());
      completionRates.push(analytics.completionRate);
      averageScores.push(analytics.averageScore);
      dropoutRates.push(analytics.dropoutRate);
      totalStudents[subject.toString()] = analytics.totalStudents;
    }

    return {
      subjects: subjects.map(s => s.toString()),
      completionRates,
      averageScores,
      dropoutRates,
      totalStudents
    };
  } catch (error) {
    console.error('Error getting subject comparison:', error);
    throw error;
  }
}

/**
 * Get trending paths (most active/completed)
 */
export async function getTrendingPaths(limit: number = 10): Promise<{
  pathId: string;
  pathName: string;
  activeStudents: number;
  completionRate: number;
  trend: 'up' | 'down' | 'stable';
}[]> {
  try {
    // Get all unique path combinations
    const paths = await SkillTreeNodeModel.aggregate([
      {
        $group: {
          _id: {
            gradeLevel: '$gradeLevel',
            classNumber: '$classNumber',
            semester: '$semester',
            subject: '$subject'
          },
          nodeCount: { $sum: 1 }
        }
      },
      { $limit: limit * 2 } // Get more for filtering
    ]);

    const trendingData = await Promise.all(
      paths.map(async (path) => {
        const analytics = await getPathAnalytics(
          path._id.gradeLevel,
          path._id.classNumber,
          path._id.semester,
          path._id.subject
        );

        return {
          pathId: analytics.pathId,
          pathName: analytics.pathName,
          activeStudents: analytics.activeStudents,
          completionRate: analytics.completionRate,
          trend: analytics.activeStudents > analytics.totalStudents * 0.5 ? 'up' as const : 
                analytics.activeStudents < analytics.totalStudents * 0.2 ? 'down' as const : 'stable' as const
        };
      })
    );

    return trendingData
      .sort((a, b) => b.activeStudents - a.activeStudents)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting trending paths:', error);
    throw error;
  }
}
