import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

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
  averageTimeToComplete: number;
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
  excellent: number;
  good: number;
  average: number;
  belowAverage: number;
  poor: number;
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

export interface SubjectComparison {
  subjects: string[];
  completionRates: number[];
  averageScores: number[];
  dropoutRates: number[];
  totalStudents: Record<string, number>;
}

export interface TrendingPath {
  pathId: string;
  pathName: string;
  activeStudents: number;
  completionRate: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Hook to get path analytics
 */
export function usePathAnalytics(
  gradeLevel?: string,
  classNumber?: number,
  semester?: number,
  subject?: string
) {
  const [analytics, setAnalytics] = useState<PathAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!gradeLevel || !classNumber || !semester || !subject) {
      setAnalytics(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        gradeLevel,
        classNumber: classNumber.toString(),
        semester: semester.toString(),
        subject
      });

      const response: any = await apiClient.get(`/skill-tree/analytics/path?${params}`);
      if (response?.success) {
        setAnalytics(response.analytics);
      }
    } catch (err: any) {
      console.warn('Analytics API not available, using fallback:', err.message);
      setError(err.response?.data?.message || 'Failed to load analytics');
      // Set null instead of throwing to prevent crash
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [gradeLevel, classNumber, semester, subject]);

  return { analytics, loading, error, refresh: fetchAnalytics };
}

/**
 * Hook to get student progress for a path
 */
export function useStudentPathProgress(
  gradeLevel?: string,
  classNumber?: number,
  semester?: number,
  subject?: string
) {
  const [students, setStudents] = useState<StudentPathProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    if (!gradeLevel || !classNumber || !semester || !subject) {
      setStudents([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        gradeLevel,
        classNumber: classNumber.toString(),
        semester: semester.toString(),
        subject
      });

      const response = await apiClient.get(`/skill-tree/analytics/students?${params}`);
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [gradeLevel, classNumber, semester, subject]);

  return { students, loading, error, refresh: fetchStudents };
}

/**
 * Hook to get subject comparison
 */
export function useSubjectComparison(
  gradeLevel?: string,
  classNumber?: number,
  semester?: number
) {
  const [comparison, setComparison] = useState<SubjectComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = async () => {
    if (!gradeLevel || !classNumber || !semester) {
      setComparison(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        gradeLevel,
        classNumber: classNumber.toString(),
        semester: semester.toString()
      });

      const response = await apiClient.get(`/skill-tree/analytics/comparison?${params}`);
      if (response.data.success) {
        setComparison(response.data.comparison);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load comparison');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [gradeLevel, classNumber, semester]);

  return { comparison, loading, error, refresh: fetchComparison };
}

/**
 * Hook to get trending paths
 */
export function useTrendingPaths(limit: number = 10) {
  const [trending, setTrending] = useState<TrendingPath[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/skill-tree/analytics/trending?limit=${limit}`);
      if (response.data.success) {
        setTrending(response.data.trending);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load trending paths');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, [limit]);

  return { trending, loading, error, refresh: fetchTrending };
}
