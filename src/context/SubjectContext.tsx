import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subjectApi, progressApi } from '@/lib/apiClient';
import { useAuth } from './AuthContext';

interface Subject {
  _id: string;
  code: string;
  name: string;
  category: string;
  color: string;
  icon?: string;
  description?: string;
}

interface SubjectProgress {
  subjectId: string;
  totalLessonsCompleted: number;
  totalQuizzesCompleted: number;
  averageScore: number;
  totalXPEarned: number;
  masteryPercentage: number;
}

interface SubjectContextType {
  subjects: Subject[];
  selectedSubject: string | null;
  selectSubject: (subjectId: string | null) => void;
  subjectProgress: Record<string, SubjectProgress>;
  loadingSubjects: boolean;
  loadSubjects: () => Promise<void>;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export const SubjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjectProgress, setSubjectProgress] = useState<Record<string, SubjectProgress>>({});
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const { user } = useAuth();

  const loadSubjects = async () => {
    // Skip loading if not authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingSubjects(false);
      setSubjects([]);
      return;
    }

    try {
      setLoadingSubjects(true);
      const response = await subjectApi.getAll();
      if (response.success && response.subjects && Array.isArray(response.subjects)) {
        setSubjects(response.subjects);
      } else if (response.data && Array.isArray(response.data)) {
        setSubjects(response.data);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const loadProgress = async () => {
    // Only load progress for students
    if (!user?.id || user.role !== 'student') {
      setSubjectProgress({});
      return;
    }
    
    try {
      const response = await progressApi.getStudentProgress(user.id);
      if (response.success && response.data) {
        const progressMap: Record<string, SubjectProgress> = {};
        response.data.forEach((item: any) => {
          progressMap[item.subject._id || item.subject] = {
            subjectId: item.subject._id || item.subject,
            totalLessonsCompleted: item.totalLessonsCompleted || 0,
            totalQuizzesCompleted: item.totalQuizzesCompleted || 0,
            averageScore: Math.round(item.averageScore || 0),
            totalXPEarned: item.totalXPEarned || 0,
            masteryPercentage: Math.round(item.masteryPercentage || 0),
          };
        });
        setSubjectProgress(progressMap);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
      // Silently fail for non-students - progress will remain empty
      setSubjectProgress({});
    }
  };

  useEffect(() => {
    // Only load if authenticated
    const token = localStorage.getItem('token');
    if (token) {
      loadSubjects();
    } else {
      setLoadingSubjects(false);
    }
  }, []);

  useEffect(() => {
    if (subjects && subjects.length > 0 && user) {
      loadProgress();
    }
  }, [subjects, user]);

  const selectSubject = (subjectId: string | null) => {
    setSelectedSubject(subjectId);
    // Store in localStorage for persistence
    if (subjectId) {
      localStorage.setItem('selectedSubject', subjectId);
    } else {
      localStorage.removeItem('selectedSubject');
    }
  };

  // Restore selected subject from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('selectedSubject');
    if (saved) {
      setSelectedSubject(saved);
    }
  }, []);

  return (
    <SubjectContext.Provider
      value={{
        subjects,
        selectedSubject,
        selectSubject,
        subjectProgress,
        loadingSubjects,
        loadSubjects,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubject = () => {
  const context = useContext(SubjectContext);
  if (context === undefined) {
    throw new Error('useSubject must be used within a SubjectProvider');
  }
  return context;
};
