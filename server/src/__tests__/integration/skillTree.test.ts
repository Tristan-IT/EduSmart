import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import skillTreeRoutes from '../../routes/skillTree.js';
import SkillTreeNodeModel from '../../models/SkillTreeNode.js';
import UserModel from '../../models/User.js';
import UserProgressModel from '../../models/UserProgress.js';

const mockAuth = (req: any, res: any, next: any) => {
  req.user = { id: req.headers['x-user-id'] || 'test-user-id' };
  next();
};

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(mockAuth);
  app.use('/api/skill-tree', skillTreeRoutes);
  return app;
};

describe('Skill Tree API Integration Tests', () => {
  let app: express.Application;
  let testUserId: string;

  beforeEach(async () => {
    app = createTestApp();

    // Create test user
    const user = await UserModel.create({
      name: 'Test Student',
      email: 'student@example.com',
      role: 'student',
      xp: 0,
      level: 1,
      gems: 0,
      hearts: 5,
      streak: 0
    });
    testUserId = (user._id as any).toString();

    // Create test skill tree nodes
    await SkillTreeNodeModel.create([
      {
        nodeId: 'math-node-1',
        title: 'Basic Arithmetic',
        description: 'Learn addition and subtraction',
        subject: 'mathematics',
        difficulty: 'beginner',
        xpReward: 50,
        gemsReward: 5,
        order: 1,
        prerequisites: [],
        dependencies: [],
        quizzes: [{
          quizId: 'quiz-arithmetic',
          title: 'Arithmetic Quiz',
          questions: [],
          passingScore: 70,
          timeLimit: 300
        }],
        lessonContent: {
          sections: [{
            type: 'text',
            title: 'Introduction to Numbers',
            content: 'Numbers are fundamental...'
          }],
          learningObjectives: ['Understand basic arithmetic'],
          estimatedTime: 15
        }
      },
      {
        nodeId: 'math-node-2',
        title: 'Multiplication',
        description: 'Master multiplication tables',
        subject: 'mathematics',
        difficulty: 'beginner',
        xpReward: 75,
        gemsReward: 8,
        order: 2,
        prerequisites: ['math-node-1'],
        dependencies: ['math-node-1'],
        quizzes: [{
          quizId: 'quiz-multiplication',
          title: 'Multiplication Quiz',
          questions: [],
          passingScore: 75,
          timeLimit: 400
        }]
      },
      {
        nodeId: 'math-node-3',
        title: 'Division',
        description: 'Learn division techniques',
        subject: 'mathematics',
        difficulty: 'intermediate',
        xpReward: 100,
        gemsReward: 10,
        order: 3,
        prerequisites: ['math-node-1', 'math-node-2'],
        dependencies: ['math-node-2'],
        quizzes: []
      }
    ]);
  });

  describe('GET /api/skill-tree/nodes', () => {
    it('should return all skill tree nodes', async () => {
      const response = await request(app)
        .get('/api/skill-tree/nodes')
        .set('x-user-id', testUserId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.nodes).toHaveLength(3);
      expect(response.body.nodes[0].title).toBe('Basic Arithmetic');
    });

    it('should filter nodes by subject', async () => {
      // Create a science node
      await SkillTreeNodeModel.create({
        nodeId: 'science-node-1',
        title: 'Photosynthesis',
        subject: 'science',
        difficulty: 'beginner',
        xpReward: 60,
        gemsReward: 6,
        order: 1,
        prerequisites: [],
        dependencies: [],
        quizzes: []
      });

      const response = await request(app)
        .get('/api/skill-tree/nodes?subject=mathematics')
        .set('x-user-id', testUserId)
        .expect(200);

      expect(response.body.nodes).toHaveLength(3);
      expect(response.body.nodes.every((n: any) => n.subject === 'mathematics')).toBe(true);
    });

    it('should filter nodes by difficulty', async () => {
      const response = await request(app)
        .get('/api/skill-tree/nodes?difficulty=beginner')
        .set('x-user-id', testUserId)
        .expect(200);

      expect(response.body.nodes).toHaveLength(2);
      expect(response.body.nodes.every((n: any) => n.difficulty === 'beginner')).toBe(true);
    });
  });

  describe('GET /api/skill-tree/nodes/:nodeId', () => {
    it('should return a specific node with full details', async () => {
      const node = await SkillTreeNodeModel.findOne({ nodeId: 'math-node-1' });

      const response = await request(app)
        .get(`/api/skill-tree/nodes/${node?._id}`)
        .set('x-user-id', testUserId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.node.title).toBe('Basic Arithmetic');
      expect(response.body.node.lessonContent).toBeDefined();
      expect(response.body.node.quizzes).toHaveLength(1);
    });

    it('should include completion status for authenticated user', async () => {
      const node = await SkillTreeNodeModel.findOne({ nodeId: 'math-node-1' });

      // Complete the node
      await UserProgressModel.create({
        user: testUserId,
        nodeId: (node?._id as any).toString() || '',
        status: 'completed',
        stars: 3,
        completedAt: new Date(),
        attempts: 1,
        bestScore: 85,
        lessonTimeSpent: 300
      });

      const response = await request(app)
        .get(`/api/skill-tree/nodes/${node?._id}`)
        .set('x-user-id', testUserId)
        .expect(200);

      expect(response.body.node.completed).toBe(true);
      expect(response.body.node.userScore).toBe(85);
    });
  });

  describe('Node Prerequisites and Dependencies', () => {
    it('should check if node prerequisites are met', async () => {
      const node1 = await SkillTreeNodeModel.findOne({ nodeId: 'math-node-1' });
      const node2 = await SkillTreeNodeModel.findOne({ nodeId: 'math-node-2' });

      // Try to access node 2 without completing node 1
      const response1 = await request(app)
        .get(`/api/skill-tree/nodes/${node2?._id}`)
        .set('x-user-id', testUserId)
        .expect(200);

      expect(response1.body.node.isLocked).toBe(true);

      // Complete prerequisite node 1
      await UserProgressModel.create({
        user: testUserId,
        nodeId: (node1._id as any).toString() || '',
        status: 'completed',
        stars: 2,
        completedAt: new Date(),
        attempts: 1,
        bestScore: 80,
        lessonTimeSpent: 300
      });

      // Now node 2 should be unlocked
      const response2 = await request(app)
        .get(`/api/skill-tree/nodes/${node2?._id}`)
        .set('x-user-id', testUserId)
        .expect(200);

      expect(response2.body.node.isLocked).toBe(false);
    });
  });

  describe('Lesson Content Integration', () => {
    it('should return lesson content for a node', async () => {
      const node = await SkillTreeNodeModel.findOne({ nodeId: 'math-node-1' });

      const response = await request(app)
        .get(`/api/skill-tree/nodes/${node?._id}`)
        .set('x-user-id', testUserId)
        .expect(200);

      expect(response.body.node.lessonContent).toBeDefined();
      expect(response.body.node.lessonContent.sections).toHaveLength(1);
      expect(response.body.node.lessonContent.learningObjectives).toBeDefined();
      expect(response.body.node.lessonContent.estimatedTime).toBe(15);
    });

    it('should track lesson views separately from quiz completion', async () => {
      const node = await SkillTreeNodeModel.findOne({ nodeId: 'math-node-1' });

      // Track lesson view
      await UserProgressModel.create({
        user: testUserId,
        nodeId: (node._id as any).toString() || '',
        status: 'in-progress',
        stars: 0,
        attempts: 0,
        bestScore: 0,
        lessonViewed: true,
        lessonViewedAt: new Date(),
        lessonTimeSpent: 200
      });

      const response = await request(app)
        .get(`/api/skill-tree/nodes/${node?._id}`)
        .set('x-user-id', testUserId)
        .expect(200);

      expect(response.body.node.lessonViewed).toBe(true);
      expect(response.body.node.completed).toBe(false);
    });
  });

  describe('Node Progress Calculation', () => {
    it('should calculate overall subject progress', async () => {
      const node1 = await SkillTreeNodeModel.findOne({ nodeId: 'math-node-1' });
      const node2 = await SkillTreeNodeModel.findOne({ nodeId: 'math-node-2' });

      // Complete 2 out of 3 math nodes
      await UserProgressModel.create({
        userId: testUserId,
        completedNodes: [
          {
            nodeId: (node1?._id as any).toString() || '',
            completedAt: new Date(),
            score: 85,
            attempts: 1,
            timeSpent: 300,
            perfectScore: false
          },
          {
            nodeId: (node2?._id as any).toString() || '',
            completedAt: new Date(),
            score: 90,
            attempts: 1,
            timeSpent: 350,
            perfectScore: false
          }
        ]
      });

      const response = await request(app)
        .get('/api/skill-tree/nodes?subject=mathematics')
        .set('x-user-id', testUserId)
        .expect(200);

      const completedCount = response.body.nodes.filter((n: any) => n.completed).length;
      expect(completedCount).toBe(2);
    });
  });

  describe('Quiz Association', () => {
    it('should return associated quizzes with a node', async () => {
      const node = await SkillTreeNodeModel.findOne({ nodeId: 'math-node-1' });

      const response = await request(app)
        .get(`/api/skill-tree/nodes/${node?._id}`)
        .set('x-user-id', testUserId)
        .expect(200);

      expect(response.body.node.quizzes).toBeDefined();
      expect(response.body.node.quizzes).toHaveLength(1);
      expect(response.body.node.quizzes[0].title).toBe('Arithmetic Quiz');
      expect(response.body.node.quizzes[0].passingScore).toBe(70);
    });

    it('should handle nodes without quizzes', async () => {
      const node = await SkillTreeNodeModel.findOne({ nodeId: 'math-node-3' });

      const response = await request(app)
        .get(`/api/skill-tree/nodes/${node?._id}`)
        .set('x-user-id', testUserId)
        .expect(200);

      expect(response.body.node.quizzes).toHaveLength(0);
    });
  });
});
