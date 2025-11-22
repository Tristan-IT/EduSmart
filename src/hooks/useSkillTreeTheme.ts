import { useState, useEffect } from 'react';
import { getThemeBySubject, applyTheme, type SkillTreeTheme } from '@/lib/skillTreeThemes';

/**
 * Hook to manage skill tree theme based on subject
 */
export function useSkillTreeTheme(subject?: string) {
  const [theme, setTheme] = useState<SkillTreeTheme | null>(null);

  useEffect(() => {
    if (subject) {
      const selectedTheme = getThemeBySubject(subject);
      setTheme(selectedTheme);
      applyTheme(selectedTheme);
    }
  }, [subject]);

  return theme;
}
