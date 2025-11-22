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
    try {
      setLoadingSubjects(true);
      const response = await subjectApi.getAll();
      if (response.success) {
        setSubjects(response.subjects);
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
      // Silently fail - subjects will remain empty
    } finally {
      setLoadingSubjects(false);
    }
  };

  const loadProgress = async () => {
    if (!user?.id || user.role !== 'student') return;
    
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
      // Silently fail - progress will remain empty
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (subjects.length > 0 && user) {
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
