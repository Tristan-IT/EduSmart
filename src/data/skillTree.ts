/**
 * Skill Tree System - Duolingo-style Learning Path
 * Maps 15 learning modules to interactive skill tree nodes
 */

import { LearningModule, allLearningModules } from "./learningModules";

export type NodeStatus = 'locked' | 'current' | 'in-progress' | 'completed';

export interface SkillTreeNode {
  id: string;
  moduleId: string; // Reference to LearningModule
  title: string;
  categoryId: string;
  categoryName: string;
  description: string;
  position: {
    x: number; // Horizontal position (0-100%)
    y: number; // Vertical position (pixel offset)
  };
  status: NodeStatus;
  stars: number; // 0-3 stars based on performance
  xpReward: number;
  prerequisites: string[]; // IDs of nodes that must be completed first
  isCheckpoint: boolean; // Major milestone nodes
  difficulty: "Mudah" | "Sedang" | "Sulit";
  estimatedDuration: string;
}

export interface SkillTreePath {
  from: string; // Node ID
  to: string; // Node ID
  isActive: boolean; // Path is unlocked
}

export interface UserProgress {
  nodeId: string;
  status: NodeStatus;
  stars: number;
  completedAt?: Date;
  attempts: number;
  bestScore: number;
}

/**
 * Skill Tree Structure - 15 Nodes in a progressive path
 * Layout: Vertical path with some branching
 */
export const skillTreeNodes: SkillTreeNode[] = [
  // === LEVEL 1: Foundation (Algebra Basics) ===
  {
    id: 'node-1',
    moduleId: 'alg-linear-eq',
    title: 'Persamaan Linear',
    categoryId: 'algebra',
    categoryName: 'Aljabar',
    description: 'Dasar persamaan linear satu variabel',
    position: { x: 50, y: 0 },
    status: 'current',
    stars: 0,
    xpReward: 50,
    prerequisites: [],
    isCheckpoint: false,
    difficulty: 'Mudah',
    estimatedDuration: '45 menit',
  },
  {
    id: 'node-2',
    moduleId: 'alg-quadratic',
    title: 'Persamaan Kuadrat',
    categoryId: 'algebra',
    categoryName: 'Aljabar',
    description: 'Menyelesaikan persamaan kuadrat',
    position: { x: 50, y: 200 },
    status: 'locked',
    stars: 0,
    xpReward: 60,
    prerequisites: ['node-1'],
    isCheckpoint: false,
    difficulty: 'Sedang',
    estimatedDuration: '60 menit',
  },
  {
    id: 'node-3',
    moduleId: 'alg-systems',
    title: 'Sistem Persamaan',
    categoryId: 'algebra',
    categoryName: 'Aljabar',
    description: 'Sistem persamaan linear dua variabel',
    position: { x: 50, y: 400 },
    status: 'locked',
    stars: 0,
    xpReward: 70,
    prerequisites: ['node-2'],
    isCheckpoint: true,
    difficulty: 'Sedang',
    estimatedDuration: '75 menit',
  },

  // === LEVEL 2: Geometry Branch ===
  {
    id: 'node-4',
    moduleId: 'geo-triangles',
    title: 'Segitiga',
    categoryId: 'geometry',
    categoryName: 'Geometri',
    description: 'Jenis dan sifat segitiga',
    position: { x: 30, y: 600 },
    status: 'locked',
    stars: 0,
    xpReward: 55,
    prerequisites: ['node-3'],
    isCheckpoint: false,
    difficulty: 'Mudah',
    estimatedDuration: '50 menit',
  },
  {
    id: 'node-5',
    moduleId: 'geo-circles',
    title: 'Lingkaran',
    categoryId: 'geometry',
    categoryName: 'Geometri',
    description: 'Keliling, luas, dan busur lingkaran',
    position: { x: 70, y: 600 },
    status: 'locked',
    stars: 0,
    xpReward: 55,
    prerequisites: ['node-3'],
    isCheckpoint: false,
    difficulty: 'Mudah',
    estimatedDuration: '50 menit',
  },
  {
    id: 'node-6',
    moduleId: 'geo-area-volume',
    title: 'Luas & Volume',
    categoryId: 'geometry',
    categoryName: 'Geometri',
    description: 'Bangun ruang 3D',
    position: { x: 50, y: 800 },
    status: 'locked',
    stars: 0,
    xpReward: 65,
    prerequisites: ['node-4', 'node-5'],
    isCheckpoint: true,
    difficulty: 'Sedang',
    estimatedDuration: '70 menit',
  },

  // === LEVEL 3: Calculus Path ===
  {
    id: 'node-7',
    moduleId: 'calc-limits',
    title: 'Limit Fungsi',
    categoryId: 'calculus',
    categoryName: 'Kalkulus',
    description: 'Konsep limit dan kontinuitas',
    position: { x: 50, y: 1000 },
    status: 'locked',
    stars: 0,
    xpReward: 75,
    prerequisites: ['node-6'],
    isCheckpoint: false,
    difficulty: 'Sedang',
    estimatedDuration: '80 menit',
  },
  {
    id: 'node-8',
    moduleId: 'calc-limits', // Using same module for now (derivatives module doesn't exist yet)
    title: 'Turunan',
    categoryId: 'calculus',
    categoryName: 'Kalkulus',
    description: 'Dasar-dasar diferensiasi',
    position: { x: 50, y: 1200 },
    status: 'locked',
    stars: 0,
    xpReward: 80,
    prerequisites: ['node-7'],
    isCheckpoint: false,
    difficulty: 'Sulit',
    estimatedDuration: '90 menit',
  },
  {
    id: 'node-9',
    moduleId: 'calc-limits', // Using same module for now (integrals module doesn't exist yet)
    title: 'Integral',
    categoryId: 'calculus',
    categoryName: 'Kalkulus',
    description: 'Integral tak tentu dan tentu',
    position: { x: 50, y: 1400 },
    status: 'locked',
    stars: 0,
    xpReward: 85,
    prerequisites: ['node-8'],
    isCheckpoint: true,
    difficulty: 'Sulit',
    estimatedDuration: '95 menit',
  },

  // === LEVEL 4: Statistics Branch ===
  {
    id: 'node-10',
    moduleId: 'stat-central-tendency',
    title: 'Statistika Dasar',
    categoryId: 'statistics',
    categoryName: 'Statistika',
    description: 'Mean, median, modus',
    position: { x: 30, y: 1600 },
    status: 'locked',
    stars: 0,
    xpReward: 60,
    prerequisites: ['node-9'],
    isCheckpoint: false,
    difficulty: 'Mudah',
    estimatedDuration: '55 menit',
  },
  {
    id: 'node-11',
    moduleId: 'stat-data-presentation',
    title: 'Distribusi Data',
    categoryId: 'statistics',
    categoryName: 'Statistika',
    description: 'Kuartil dan diagram',
    position: { x: 70, y: 1600 },
    status: 'locked',
    stars: 0,
    xpReward: 65,
    prerequisites: ['node-9'],
    isCheckpoint: false,
    difficulty: 'Sedang',
    estimatedDuration: '60 menit',
  },
  {
    id: 'node-12',
    moduleId: 'stat-data-presentation', // Using same module (probability module doesn't exist yet)
    title: 'Peluang',
    categoryId: 'statistics',
    categoryName: 'Statistika',
    description: 'Probabilitas dan kombinatorik',
    position: { x: 50, y: 1800 },
    status: 'locked',
    stars: 0,
    xpReward: 70,
    prerequisites: ['node-10', 'node-11'],
    isCheckpoint: true,
    difficulty: 'Sedang',
    estimatedDuration: '75 menit',
  },

  // === LEVEL 5: Advanced Topics ===
  {
    id: 'node-13',
    moduleId: 'trig-basic',
    title: 'Trigonometri',
    categoryId: 'trigonometry',
    categoryName: 'Trigonometri',
    description: 'Sin, cos, tan dan sudut istimewa',
    position: { x: 35, y: 2000 },
    status: 'locked',
    stars: 0,
    xpReward: 75,
    prerequisites: ['node-12'],
    isCheckpoint: false,
    difficulty: 'Sedang',
    estimatedDuration: '80 menit',
  },
  {
    id: 'node-14',
    moduleId: 'trig-identities',
    title: 'Identitas Trigonometri',
    categoryId: 'trigonometry',
    categoryName: 'Trigonometri',
    description: 'Rumus identitas trigonometri',
    position: { x: 65, y: 2000 },
    status: 'locked',
    stars: 0,
    xpReward: 80,
    prerequisites: ['node-12'],
    isCheckpoint: false,
    difficulty: 'Sulit',
    estimatedDuration: '85 menit',
  },
  {
    id: 'node-15',
    moduleId: 'logic-statements',
    title: 'Logika Matematika',
    categoryId: 'logic',
    categoryName: 'Logika',
    description: 'Pernyataan dan penalaran logis',
    position: { x: 50, y: 2200 },
    status: 'locked',
    stars: 0,
    xpReward: 90,
    prerequisites: ['node-13', 'node-14'],
    isCheckpoint: true,
    difficulty: 'Sulit',
    estimatedDuration: '90 menit',
  },
];

/**
 * Define paths between nodes
 */
export const skillTreePaths: SkillTreePath[] = [
  // Main vertical path
  { from: 'node-1', to: 'node-2', isActive: false },
  { from: 'node-2', to: 'node-3', isActive: false },
  
  // Geometry branch
  { from: 'node-3', to: 'node-4', isActive: false },
  { from: 'node-3', to: 'node-5', isActive: false },
  { from: 'node-4', to: 'node-6', isActive: false },
  { from: 'node-5', to: 'node-6', isActive: false },
  
  // Calculus path
  { from: 'node-6', to: 'node-7', isActive: false },
  { from: 'node-7', to: 'node-8', isActive: false },
  { from: 'node-8', to: 'node-9', isActive: false },
  
  // Statistics branch
  { from: 'node-9', to: 'node-10', isActive: false },
  { from: 'node-9', to: 'node-11', isActive: false },
  { from: 'node-10', to: 'node-12', isActive: false },
  { from: 'node-11', to: 'node-12', isActive: false },
  
  // Advanced topics
  { from: 'node-12', to: 'node-13', isActive: false },
  { from: 'node-12', to: 'node-14', isActive: false },
  { from: 'node-13', to: 'node-15', isActive: false },
  { from: 'node-14', to: 'node-15', isActive: false },
];

/**
 * Get node by ID
 */
export function getNode(nodeId: string): SkillTreeNode | undefined {
  return skillTreeNodes.find(node => node.id === nodeId);
}

/**
 * Get learning module for a node
 */
export function getModuleForNode(nodeId: string): LearningModule | undefined {
  const node = getNode(nodeId);
  if (!node) return undefined;
  
  return allLearningModules.find(module => module.id === node.moduleId);
}

/**
 * Check if node can be unlocked
 */
export function canUnlockNode(nodeId: string, completedNodes: string[]): boolean {
  const node = getNode(nodeId);
  if (!node) return false;
  
  // If no prerequisites, can unlock
  if (node.prerequisites.length === 0) return true;
  
  // Check if all prerequisites are completed
  return node.prerequisites.every(prereqId => completedNodes.includes(prereqId));
}

/**
 * Get next available nodes
 */
export function getNextNodes(completedNodes: string[]): SkillTreeNode[] {
  return skillTreeNodes.filter(node => {
    // Skip if already completed
    if (completedNodes.includes(node.id)) return false;
    
    // Check if can be unlocked
    return canUnlockNode(node.id, completedNodes);
  });
}

/**
 * Calculate total progress percentage
 */
export function calculateProgress(userProgress: UserProgress[]): number {
  const totalNodes = skillTreeNodes.length;
  const completedCount = userProgress.filter(p => p.status === 'completed').length;
  
  return Math.round((completedCount / totalNodes) * 100);
}

/**
 * Calculate total stars earned
 */
export function calculateTotalStars(userProgress: UserProgress[]): number {
  return userProgress.reduce((total, progress) => total + progress.stars, 0);
}

/**
 * Get category progress
 */
export function getCategoryProgress(categoryId: string, userProgress: UserProgress[]): {
  total: number;
  completed: number;
  percentage: number;
} {
  const categoryNodes = skillTreeNodes.filter(node => node.categoryId === categoryId);
  const completedNodes = userProgress.filter(p => 
    p.status === 'completed' && 
    categoryNodes.some(n => n.id === p.nodeId)
  );
  
  return {
    total: categoryNodes.length,
    completed: completedNodes.length,
    percentage: Math.round((completedNodes.length / categoryNodes.length) * 100),
  };
}

/**
 * Get checkpoint nodes
 */
export function getCheckpoints(): SkillTreeNode[] {
  return skillTreeNodes.filter(node => node.isCheckpoint);
}

/**
 * Award stars based on score
 */
export function calculateStars(score: number): number {
  if (score >= 90) return 3;
  if (score >= 75) return 2;
  if (score >= 60) return 1;
  return 0;
}

/**
 * Get XP reward with star multiplier
 */
export function calculateXPReward(baseXP: number, stars: number): number {
  const multiplier = {
    0: 0.5,  // Failed: 50% XP
    1: 1.0,  // 1 star: 100% XP
    2: 1.25, // 2 stars: 125% XP
    3: 1.5,  // 3 stars: 150% XP
  }[stars] || 1.0;
  
  return Math.round(baseXP * multiplier);
}

/**
 * Update node status based on user progress
 */
export function updateNodeStatuses(
  nodes: SkillTreeNode[],
  userProgress: UserProgress[]
): SkillTreeNode[] {
  const completedIds = userProgress
    .filter(p => p.status === 'completed')
    .map(p => p.nodeId);
  
  return nodes.map(node => {
    const progress = userProgress.find(p => p.nodeId === node.id);
    
    // If user has progress for this node, use it
    if (progress) {
      return {
        ...node,
        status: progress.status,
        stars: progress.stars,
      };
    }
    
    // Check if can unlock based on prerequisites
    if (canUnlockNode(node.id, completedIds)) {
      return {
        ...node,
        status: 'current', // Node is unlocked and ready to start
      };
    }
    
    return { ...node, status: 'locked' };
  });
}

/**
 * Update path activation based on completed nodes
 */
export function updatePathStatuses(
  paths: SkillTreePath[],
  completedNodes: string[]
): SkillTreePath[] {
  return paths.map(path => ({
    ...path,
    isActive: completedNodes.includes(path.from),
  }));
}
