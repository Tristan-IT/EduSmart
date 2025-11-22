import { useState, useEffect, useCallback } from 'react';

export interface PrerequisiteDetail {
  nodeId: string;
  title: string;
  isCompleted: boolean;
  completedAt?: Date;
  score?: number;
}

export interface PrerequisiteCheck {
  isMet: boolean;
  missingPrerequisites: string[];
  completedPrerequisites: string[];
  prerequisiteDetails: PrerequisiteDetail[];
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
}

export interface AccessibleNodesData {
  accessible: any[];
  locked: any[];
  completed: any[];
  counts: {
    accessible: number;
    locked: number;
    completed: number;
    total: number;
  };
}

/**
 * Hook to validate node access and prerequisites
 */
export const usePrerequisiteValidation = (nodeId?: string) => {
  const [validation, setValidation] = useState<NodeAccessValidation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAccess = useCallback(async (targetNodeId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/skill-tree/validate/${targetNodeId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to validate node access');
      }

      const result = await response.json();
      setValidation(result.validation);
      return result.validation;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (nodeId) {
      validateAccess(nodeId);
    }
  }, [nodeId, validateAccess]);

  return {
    validation,
    loading,
    error,
    validateAccess,
    canAccess: validation?.canAccess ?? false,
    isLocked: validation?.isLocked ?? true,
    lockReason: validation?.lockReason
  };
};

/**
 * Hook to check prerequisites for a node
 */
export const usePrerequisites = (nodeId?: string) => {
  const [prerequisiteCheck, setPrerequisiteCheck] = useState<PrerequisiteCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPrerequisites = useCallback(async (targetNodeId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/skill-tree/prerequisites/${targetNodeId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check prerequisites');
      }

      const result = await response.json();
      setPrerequisiteCheck(result.prerequisiteCheck);
      return result.prerequisiteCheck;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (nodeId) {
      checkPrerequisites(nodeId);
    }
  }, [nodeId, checkPrerequisites]);

  return {
    prerequisiteCheck,
    loading,
    error,
    checkPrerequisites,
    isMet: prerequisiteCheck?.isMet ?? false,
    missingCount: prerequisiteCheck?.missingPrerequisites.length ?? 0,
    prerequisiteDetails: prerequisiteCheck?.prerequisiteDetails ?? []
  };
};

/**
 * Hook to get accessible, locked, and completed nodes
 */
export const useAccessibleNodes = (subject?: string) => {
  const [data, setData] = useState<AccessibleNodesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccessibleNodes = useCallback(async (subjectFilter?: string) => {
    try {
      setLoading(true);
      setError(null);

      const url = subjectFilter 
        ? `/api/skill-tree/accessible?subject=${subjectFilter}`
        : '/api/skill-tree/accessible';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch accessible nodes');
      }

      const result = await response.json();
      setData({
        accessible: result.accessible,
        locked: result.locked,
        completed: result.completed,
        counts: result.counts
      });
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccessibleNodes(subject);
  }, [subject, fetchAccessibleNodes]);

  return {
    data,
    loading,
    error,
    refresh: () => fetchAccessibleNodes(subject),
    accessible: data?.accessible ?? [],
    locked: data?.locked ?? [],
    completed: data?.completed ?? [],
    counts: data?.counts
  };
};

/**
 * Hook to validate quiz access
 */
export const useQuizAccess = (nodeId?: string) => {
  const [validation, setValidation] = useState<{
    canStart: boolean;
    reason?: string;
    requiresLessonView?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateQuizAccess = useCallback(async (targetNodeId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/skill-tree/validate-quiz/${targetNodeId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to validate quiz access');
      }

      const result = await response.json();
      setValidation(result.validation);
      return result.validation;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (nodeId) {
      validateQuizAccess(nodeId);
    }
  }, [nodeId, validateQuizAccess]);

  return {
    validation,
    loading,
    error,
    validateQuizAccess,
    canStart: validation?.canStart ?? false,
    reason: validation?.reason,
    requiresLessonView: validation?.requiresLessonView ?? false
  };
};
