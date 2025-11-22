import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import UserModel from '../../models/User.js';
import UserProgressModel from '../../models/UserProgress.js';
import SkillTreeNodeModel from '../../models/SkillTreeNode.js';
import { 
  calculateAchievementContext, 
  checkSkillTreeAchievements 
} from '../../utils/achievementHelper.js';

describe('Achievement Helper Unit Tests', () => {
  let testUserId: string;
  let testNodes: any[];

  beforeEach(async () => {
    // Create test user
    const user = await UserModel.create({
      name: 'Achievement Tester',
      email: 'achiever@example.com',
      role: 'student',
      xp: 0,
      level: 1,
      gems: 0,
      hearts: 5,
      streak: 0
    });
    testUserId = (user._id as any).toString();

    // Create test nodes
    testNodes = await SkillTreeNodeModel.create([
      {
        nodeId: 'test-1',
        title: 'Test Node 1',
        subject: 'mathematics',
        difficulty: 'beginner',
        xpReward: 50,
        gemsReward: 5,
        order: 1,
        prerequisites: [],
        dependencies: [],
        quizzes: [],
        isCheckpoint: false
      },
      {
        nodeId: 'test-2',
        title: 'Test Node 2',
        subject: 'mathematics',
        difficulty: 'intermediate',
        xpReward: 75,
        gemsReward: 8,
        order: 2,
        prerequisites: [],
        dependencies: [],
        quizzes: [],
        isCheckpoint: true
      },
      {
        nodeId: 'test-3',
        title: 'Test Node 3',
        subject: 'science',
        difficulty: 'beginner',
        xpReward: 60,
        gemsReward: 6,
        order: 3,
        prerequisites: [],
        dependencies: [],
        quizzes: [],
        isCheckpoint: false
      }
    ]);
  });

  describe('calculateAchievementContext', () => {
    it('should calculate correct context for new user', async () => {
      const context = await calculateAchievementContext(testUserId);

      expect(context.nodesCompleted).toBe(0);
      expect(context.nodesCompletedToday).toBe(0);
      expect(context.perfectNodes).toBe(0);
      expect(context.checkpointsCompleted).toBe(0);
      expect(context.nodeStreak).toBe(0);
      expect(context.subjectNodesCompleted).toEqual({});
      expect(context.difficultyNodesCompleted).toEqual({});
    });

    it('should calculate total nodes completed', async () => {
      await UserProgressModel.create({
        userId: testUserId,
        completedNodes: [
          {
            nodeId: testNodes[0]._id.toString(),
            completedAt: new Date(),
            score: 85,
            attempts: 1,
            timeSpent: 300,
            perfectScore: false
          },
          {
            nodeId: testNodes[1]._id.toString(),
            completedAt: new Date(),
            score: 92,
            attempts: 1,
            timeSpent: 400,
            perfectScore: false
          }
        ]
      });

      const context = await calculateAchievementContext(testUserId);
      expect(context.nodesCompleted).toBe(2);
    });

    it('should count nodes completed today', async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      await UserProgressModel.create({
        userId: testUserId,
        completedNodes: [
          {
            nodeId: testNodes[0]._id.toString(),
            completedAt: today,
            score: 85,
            attempts: 1,
            timeSpent: 300,
            perfectScore: false
          },
          {
            nodeId: testNodes[1]._id.toString(),
            completedAt: yesterday,
            score: 90,
            attempts: 1,
            timeSpent: 350,
            perfectScore: false
          }
        ]
      });

      const context = await calculateAchievementContext(testUserId);
      expect(context.nodesCompletedToday).toBe(1);
    });

    it('should count perfect score nodes', async () => {
      await UserProgressModel.create({
        userId: testUserId,
        completedNodes: [
          {
            nodeId: testNodes[0]._id.toString(),
            completedAt: new Date(),
            score: 100,
            attempts: 1,
            timeSpent: 300,
            perfectScore: true
          },
          {
            nodeId: testNodes[1]._id.toString(),
            completedAt: new Date(),
            score: 100,
            attempts: 1,
            timeSpent: 350,
            perfectScore: true
          },
          {
            nodeId: testNodes[2]._id.toString(),
            completedAt: new Date(),
            score: 85,
            attempts: 1,
            timeSpent: 320,
            perfectScore: false
          }
        ]
      });

      const context = await calculateAchievementContext(testUserId);
      expect(context.perfectNodes).toBe(2);
    });

    it('should count checkpoint completions', async () => {
      await UserProgressModel.create({
        userId: testUserId,
        completedNodes: [
          {
            nodeId: testNodes[1]._id.toString(), // This is a checkpoint
            completedAt: new Date(),
            score: 88,
            attempts: 1,
            timeSpent: 400,
            perfectScore: false
          }
        ]
      });

      const context = await calculateAchievementContext(testUserId);
      expect(context.checkpointsCompleted).toBe(1);
    });

    it('should calculate node completion streak', async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      await UserProgressModel.create({
        userId: testUserId,
        completedNodes: [
          {
            nodeId: testNodes[0]._id.toString(),
            completedAt: today,
            score: 85,
            attempts: 1,
            timeSpent: 300,
            perfectScore: false
          },
          {
            nodeId: testNodes[1]._id.toString(),
            completedAt: yesterday,
            score: 90,
            attempts: 1,
            timeSpent: 350,
            perfectScore: false
          },
          {
            nodeId: testNodes[2]._id.toString(),
            completedAt: twoDaysAgo,
            score: 88,
            attempts: 1,
            timeSpent: 320,
            perfectScore: false
          }
        ]
      });

      const context = await calculateAchievementContext(testUserId);
      expect(context.nodeStreak).toBe(3);
    });

    it('should break streak on missed day', async () => {
      const today = new Date();
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      await UserProgressModel.create({
        userId: testUserId,
        completedNodes: [
          {
            nodeId: testNodes[0]._id.toString(),
            completedAt: today,
            score: 85,
            attempts: 1,
            timeSpent: 300,
            perfectScore: false
          },
          {
            nodeId: testNodes[1]._id.toString(),
            completedAt: threeDaysAgo, // Gap of 2 days
            score: 90,
            attempts: 1,
            timeSpent: 350,
            perfectScore: false
          }
        ]
      });

      const context = await calculateAchievementContext(testUserId);
      expect(context.nodeStreak).toBe(1); // Only today counts
    });

    it('should count nodes by subject', async () => {
      await UserProgressModel.create({
        userId: testUserId,
        completedNodes: [
          {
            nodeId: testNodes[0]._id.toString(), // mathematics
            completedAt: new Date(),
            score: 85,
            attempts: 1,
            timeSpent: 300,
            perfectScore: false
          },
          {
            nodeId: testNodes[1]._id.toString(), // mathematics
            completedAt: new Date(),
            score: 90,
            attempts: 1,
            timeSpent: 350,
            perfectScore: false
          },
          {
            nodeId: testNodes[2]._id.toString(), // science
            completedAt: new Date(),
            score: 88,
            attempts: 1,
            timeSpent: 320,
            perfectScore: false
          }
        ]
      });

      const context = await calculateAchievementContext(testUserId);
      expect(context.subjectNodesCompleted?.mathematics).toBe(2);
      expect(context.subjectNodesCompleted?.science).toBe(1);
    });

    it('should count nodes by difficulty', async () => {
      await UserProgressModel.create({
        userId: testUserId,
        completedNodes: [
          {
            nodeId: testNodes[0]._id.toString(), // beginner
            completedAt: new Date(),
            score: 85,
            attempts: 1,
            timeSpent: 300,
            perfectScore: false
          },
          {
            nodeId: testNodes[1]._id.toString(), // intermediate
            completedAt: new Date(),
            score: 90,
            attempts: 1,
            timeSpent: 350,
            perfectScore: false
          },
          {
            nodeId: testNodes[2]._id.toString(), // beginner
            completedAt: new Date(),
            score: 88,
            attempts: 1,
            timeSpent: 320,
            perfectScore: false
          }
        ]
      });

      const context = await calculateAchievementContext(testUserId);
      expect(context.difficultyNodesCompleted?.beginner).toBe(2);
      expect(context.difficultyNodesCompleted?.intermediate).toBe(1);
    });
  });

  describe('checkSkillTreeAchievements', () => {
    it('should unlock "First Node" achievement', () => {
      const context = {
        nodesCompleted: 1,
        nodesCompletedToday: 1,
        perfectNodes: 0,
        checkpointsCompleted: 0,
        nodeStreak: 1,
        subjectNodesCompleted: { mathematics: 1 },
        difficultyNodesCompleted: { beginner: 1 }
      };

      const achievements = checkSkillTreeAchievements(context);
      expect(achievements).toContain('node-first');
    });

    it('should unlock "5 Nodes" achievement', () => {
      const context = {
        nodesCompleted: 5,
        nodesCompletedToday: 1,
        perfectNodes: 0,
        checkpointsCompleted: 0,
        nodeStreak: 2,
        subjectNodesCompleted: { mathematics: 5 },
        difficultyNodesCompleted: { beginner: 5 }
      };

      const achievements = checkSkillTreeAchievements(context);
      expect(achievements).toContain('node-explorer');
    });

    it('should unlock "10 Nodes" achievement', () => {
      const context = {
        nodesCompleted: 10,
        nodesCompletedToday: 2,
        perfectNodes: 1,
        checkpointsCompleted: 1,
        nodeStreak: 3,
        subjectNodesCompleted: { mathematics: 10 },
        difficultyNodesCompleted: { beginner: 10 }
      };

      const achievements = checkSkillTreeAchievements(context);
      expect(achievements).toContain('node-adventurer');
    });

    it('should unlock perfect score achievements', () => {
      const context = {
        nodesCompleted: 10,
        nodesCompletedToday: 1,
        perfectNodes: 5,
        checkpointsCompleted: 2,
        nodeStreak: 4,
        subjectNodesCompleted: { mathematics: 10 },
        difficultyNodesCompleted: { beginner: 10 }
      };

      const achievements = checkSkillTreeAchievements(context);
      expect(achievements).toContain('perfect-5');
    });

    it('should unlock checkpoint achievements', () => {
      const context = {
        nodesCompleted: 15,
        nodesCompletedToday: 2,
        perfectNodes: 3,
        checkpointsCompleted: 5,
        nodeStreak: 5,
        subjectNodesCompleted: { mathematics: 15 },
        difficultyNodesCompleted: { beginner: 15 }
      };

      const achievements = checkSkillTreeAchievements(context);
      expect(achievements).toContain('checkpoint-5');
    });

    it('should unlock streak achievements', () => {
      const context = {
        nodesCompleted: 8,
        nodesCompletedToday: 1,
        perfectNodes: 2,
        checkpointsCompleted: 1,
        nodeStreak: 3,
        subjectNodesCompleted: { mathematics: 8 },
        difficultyNodesCompleted: { beginner: 8 }
      };

      const achievements = checkSkillTreeAchievements(context);
      expect(achievements).toContain('streak-3');
    });

    it('should unlock daily dedication achievement', () => {
      const context = {
        nodesCompleted: 10,
        nodesCompletedToday: 5,
        perfectNodes: 1,
        checkpointsCompleted: 1,
        nodeStreak: 2,
        subjectNodesCompleted: { mathematics: 10 },
        difficultyNodesCompleted: { beginner: 10 }
      };

      const achievements = checkSkillTreeAchievements(context);
      expect(achievements).toContain('daily-dedication');
    });

    it('should unlock subject mastery achievement', () => {
      const context = {
        nodesCompleted: 20,
        nodesCompletedToday: 2,
        perfectNodes: 3,
        checkpointsCompleted: 2,
        nodeStreak: 4,
        subjectNodesCompleted: { mathematics: 20 },
        difficultyNodesCompleted: { beginner: 20 }
      };

      const achievements = checkSkillTreeAchievements(context);
      expect(achievements).toContain('subject-master');
    });

    it('should unlock multiple achievements at once', () => {
      const context = {
        nodesCompleted: 10,
        nodesCompletedToday: 5,
        perfectNodes: 5,
        checkpointsCompleted: 5,
        nodeStreak: 3,
        subjectNodesCompleted: { mathematics: 10 },
        difficultyNodesCompleted: { beginner: 10 }
      };

      const achievements = checkSkillTreeAchievements(context);
      expect(achievements.length).toBeGreaterThan(1);
      expect(achievements).toContain('node-adventurer');
      expect(achievements).toContain('perfect-5');
      expect(achievements).toContain('checkpoint-5');
      expect(achievements).toContain('streak-3');
      expect(achievements).toContain('daily-dedication');
    });

    it('should not unlock achievements below threshold', () => {
      const context = {
        nodesCompleted: 2,
        nodesCompletedToday: 2,
        perfectNodes: 1,
        checkpointsCompleted: 1,
        nodeStreak: 1,
        subjectNodesCompleted: { mathematics: 2 },
        difficultyNodesCompleted: { beginner: 2 }
      };

      const achievements = checkSkillTreeAchievements(context);
      expect(achievements).not.toContain('node-explorer'); // Requires 5 nodes
      expect(achievements).not.toContain('perfect-5'); // Requires 5 perfect scores
      expect(achievements).not.toContain('streak-3'); // Requires 3-day streak
    });
  });
});
