import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

export interface NodePerformanceMetrics {
  nodeId: string;
  totalAttempts: number;
  uniqueStudents: number;
  completionRate: number;
  averageScore: number;
  averageAttempts: number;
  averageTimeSpent: number;
  perfectScoreRate: number;
  dropoffRate: number;
  recommendedDifficulty: string;
  currentDifficulty: string;
  shouldAdjust: boolean;
  adjustmentReason?: string;
}

export interface DifficultyAdjustment {
  nodeId: string;
  oldDifficulty: string;
  newDifficulty: string;
  oldXpReward: number;
  newXpReward: number;
  oldGemsReward: number;
  newGemsReward: number;
  reason: string;
  confidence: number;
}

export interface DifficultyDistribution {
  distribution: Record<string, number>;
  totalNodes: number;
  averageScoreByDifficulty: Record<string, number>;
}

/**
 * Hook to get metrics for a specific node
 */
export function useNodeMetrics(nodeId: string | null) {
  const [metrics, setMetrics] = useState<NodePerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nodeId) {
      setMetrics(null);
      return;
    }

    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: any = await apiClient.get(`/skill-tree/nodes/${nodeId}/metrics`);
        if (response?.success) {
          setMetrics(response.metrics);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [nodeId]);

  return { metrics, loading, error };
}

/**
 * Hook to get calibration suggestions
 */
export function useCalibrationSuggestions(subject?: string, minStudents: number = 10) {
  const [suggestions, setSuggestions] = useState<NodePerformanceMetrics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (subject) params.append('subject', subject);
      params.append('minStudents', minStudents.toString());

      const response: any = await apiClient.get(`/skill-tree/calibration/suggestions?${params}`);
      if (response?.success) {
        setSuggestions(response.suggestions);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [subject, minStudents]);

  return { suggestions, loading, error, refresh: fetchSuggestions };
}

/**
 * Hook to apply difficulty calibration
 */
export function useCalibrateNode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calibrate = async (
    nodeId: string,
    newDifficulty: string,
    autoAdjustRewards: boolean = true
  ): Promise<DifficultyAdjustment | null> => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await apiClient.patch(`/skill-tree/nodes/${nodeId}/calibrate`, {
        newDifficulty,
        autoAdjustRewards
      });
      if (response?.success) {
        return response.adjustment;
      }
      return null;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to calibrate node');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { calibrate, loading, error };
}

/**
 * Hook to run auto-calibration
 */
export function useAutoCalibrate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoCalibrate = async (
    subject?: string,
    minStudents: number = 20,
    dryRun: boolean = false
  ): Promise<DifficultyAdjustment[]> => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await apiClient.post('/skill-tree/calibration/auto', {
        subject,
        minStudents,
        dryRun
      });
      if (response?.success) {
        return response.adjustments;
      }
      return [];
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to auto-calibrate');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { autoCalibrate, loading, error };
}

/**
 * Hook to get difficulty distribution
 */
export function useDifficultyDistribution(subject?: string) {
  const [distribution, setDistribution] = useState<DifficultyDistribution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDistribution = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = subject ? `?subject=${subject}` : '';
      const response: any = await apiClient.get(`/skill-tree/calibration/distribution${params}`);
      if (response?.success) {
        setDistribution({
          distribution: response.distribution,
          totalNodes: response.totalNodes,
          averageScoreByDifficulty: response.averageScoreByDifficulty
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load distribution');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistribution();
  }, [subject]);

  return { distribution, loading, error, refresh: fetchDistribution };
}
