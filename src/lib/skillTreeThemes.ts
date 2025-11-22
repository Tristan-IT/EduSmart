/**
 * Skill Tree Themes - Subject-based visual customization
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  nodeDefault: string;
  nodeCompleted: string;
  nodeLocked: string;
  nodeActive: string;
  connectionLine: string;
  glow: string;
}

export interface ThemeGradient {
  from: string;
  via?: string;
  to: string;
}

export interface SkillTreeTheme {
  id: string;
  name: string;
  subject: string;
  colors: ThemeColors;
  gradients: {
    background: ThemeGradient;
    node: ThemeGradient;
    completed: ThemeGradient;
  };
  icons: {
    default: string;
    completed: string;
    locked: string;
  };
  animations: {
    nodeHover: string;
    completion: string;
    pulse: string;
  };
  particles?: {
    enabled: boolean;
    color: string;
    shape: 'circle' | 'star' | 'triangle';
  };
}

export const mathTheme: SkillTreeTheme = {
  id: 'math',
  name: 'Matematika',
  subject: 'Matematika',
  colors: {
    primary: '#3b82f6', // blue-500
    secondary: '#60a5fa', // blue-400
    accent: '#2563eb', // blue-600
    background: '#eff6ff', // blue-50
    nodeDefault: '#dbeafe', // blue-100
    nodeCompleted: '#3b82f6', // blue-500
    nodeLocked: '#cbd5e1', // slate-300
    nodeActive: '#2563eb', // blue-600
    connectionLine: '#93c5fd', // blue-300
    glow: '#3b82f6'
  },
  gradients: {
    background: {
      from: '#eff6ff', // blue-50
      via: '#dbeafe', // blue-100
      to: '#bfdbfe' // blue-200
    },
    node: {
      from: '#dbeafe', // blue-100
      to: '#93c5fd' // blue-300
    },
    completed: {
      from: '#3b82f6', // blue-500
      to: '#2563eb' // blue-600
    }
  },
  icons: {
    default: '📐',
    completed: '✅',
    locked: '🔒'
  },
  animations: {
    nodeHover: 'hover:scale-110 transition-transform duration-200',
    completion: 'animate-bounce',
    pulse: 'animate-pulse'
  },
  particles: {
    enabled: true,
    color: '#3b82f6',
    shape: 'circle'
  }
};

export const scienceTheme: SkillTreeTheme = {
  id: 'science',
  name: 'IPA (Sains)',
  subject: 'IPA',
  colors: {
    primary: '#10b981', // green-500
    secondary: '#34d399', // green-400
    accent: '#059669', // green-600
    background: '#ecfdf5', // green-50
    nodeDefault: '#d1fae5', // green-100
    nodeCompleted: '#10b981', // green-500
    nodeLocked: '#cbd5e1', // slate-300
    nodeActive: '#059669', // green-600
    connectionLine: '#6ee7b7', // green-300
    glow: '#10b981'
  },
  gradients: {
    background: {
      from: '#ecfdf5', // green-50
      via: '#d1fae5', // green-100
      to: '#a7f3d0' // green-200
    },
    node: {
      from: '#d1fae5', // green-100
      to: '#6ee7b7' // green-300
    },
    completed: {
      from: '#10b981', // green-500
      to: '#059669' // green-600
    }
  },
  icons: {
    default: '🧪',
    completed: '⚗️',
    locked: '🔒'
  },
  animations: {
    nodeHover: 'hover:scale-110 transition-transform duration-200',
    completion: 'animate-bounce',
    pulse: 'animate-pulse'
  },
  particles: {
    enabled: true,
    color: '#10b981',
    shape: 'star'
  }
};

export const languageTheme: SkillTreeTheme = {
  id: 'language',
  name: 'Bahasa',
  subject: 'Bahasa Indonesia',
  colors: {
    primary: '#8b5cf6', // violet-500
    secondary: '#a78bfa', // violet-400
    accent: '#7c3aed', // violet-600
    background: '#f5f3ff', // violet-50
    nodeDefault: '#ede9fe', // violet-100
    nodeCompleted: '#8b5cf6', // violet-500
    nodeLocked: '#cbd5e1', // slate-300
    nodeActive: '#7c3aed', // violet-600
    connectionLine: '#c4b5fd', // violet-300
    glow: '#8b5cf6'
  },
  gradients: {
    background: {
      from: '#f5f3ff', // violet-50
      via: '#ede9fe', // violet-100
      to: '#ddd6fe' // violet-200
    },
    node: {
      from: '#ede9fe', // violet-100
      to: '#c4b5fd' // violet-300
    },
    completed: {
      from: '#8b5cf6', // violet-500
      to: '#7c3aed' // violet-600
    }
  },
  icons: {
    default: '📚',
    completed: '📖',
    locked: '🔒'
  },
  animations: {
    nodeHover: 'hover:scale-110 transition-transform duration-200',
    completion: 'animate-bounce',
    pulse: 'animate-pulse'
  },
  particles: {
    enabled: true,
    color: '#8b5cf6',
    shape: 'circle'
  }
};

export const englishTheme: SkillTreeTheme = {
  id: 'english',
  name: 'Bahasa Inggris',
  subject: 'Bahasa Inggris',
  colors: {
    primary: '#f59e0b', // amber-500
    secondary: '#fbbf24', // amber-400
    accent: '#d97706', // amber-600
    background: '#fffbeb', // amber-50
    nodeDefault: '#fef3c7', // amber-100
    nodeCompleted: '#f59e0b', // amber-500
    nodeLocked: '#cbd5e1', // slate-300
    nodeActive: '#d97706', // amber-600
    connectionLine: '#fcd34d', // amber-300
    glow: '#f59e0b'
  },
  gradients: {
    background: {
      from: '#fffbeb', // amber-50
      via: '#fef3c7', // amber-100
      to: '#fde68a' // amber-200
    },
    node: {
      from: '#fef3c7', // amber-100
      to: '#fcd34d' // amber-300
    },
    completed: {
      from: '#f59e0b', // amber-500
      to: '#d97706' // amber-600
    }
  },
  icons: {
    default: '🌍',
    completed: '🎓',
    locked: '🔒'
  },
  animations: {
    nodeHover: 'hover:scale-110 transition-transform duration-200',
    completion: 'animate-bounce',
    pulse: 'animate-pulse'
  },
  particles: {
    enabled: true,
    color: '#f59e0b',
    shape: 'star'
  }
};

export const socialStudiesTheme: SkillTreeTheme = {
  id: 'social',
  name: 'IPS (Sosial)',
  subject: 'IPS',
  colors: {
    primary: '#ef4444', // red-500
    secondary: '#f87171', // red-400
    accent: '#dc2626', // red-600
    background: '#fef2f2', // red-50
    nodeDefault: '#fee2e2', // red-100
    nodeCompleted: '#ef4444', // red-500
    nodeLocked: '#cbd5e1', // slate-300
    nodeActive: '#dc2626', // red-600
    connectionLine: '#fca5a5', // red-300
    glow: '#ef4444'
  },
  gradients: {
    background: {
      from: '#fef2f2', // red-50
      via: '#fee2e2', // red-100
      to: '#fecaca' // red-200
    },
    node: {
      from: '#fee2e2', // red-100
      to: '#fca5a5' // red-300
    },
    completed: {
      from: '#ef4444', // red-500
      to: '#dc2626' // red-600
    }
  },
  icons: {
    default: '🏛️',
    completed: '🌏',
    locked: '🔒'
  },
  animations: {
    nodeHover: 'hover:scale-110 transition-transform duration-200',
    completion: 'animate-bounce',
    pulse: 'animate-pulse'
  },
  particles: {
    enabled: true,
    color: '#ef4444',
    shape: 'triangle'
  }
};

export const defaultTheme: SkillTreeTheme = {
  id: 'default',
  name: 'Default',
  subject: 'Default',
  colors: {
    primary: '#6366f1', // indigo-500
    secondary: '#818cf8', // indigo-400
    accent: '#4f46e5', // indigo-600
    background: '#eef2ff', // indigo-50
    nodeDefault: '#e0e7ff', // indigo-100
    nodeCompleted: '#6366f1', // indigo-500
    nodeLocked: '#cbd5e1', // slate-300
    nodeActive: '#4f46e5', // indigo-600
    connectionLine: '#a5b4fc', // indigo-300
    glow: '#6366f1'
  },
  gradients: {
    background: {
      from: '#eef2ff', // indigo-50
      via: '#e0e7ff', // indigo-100
      to: '#c7d2fe' // indigo-200
    },
    node: {
      from: '#e0e7ff', // indigo-100
      to: '#a5b4fc' // indigo-300
    },
    completed: {
      from: '#6366f1', // indigo-500
      to: '#4f46e5' // indigo-600
    }
  },
  icons: {
    default: '📌',
    completed: '✅',
    locked: '🔒'
  },
  animations: {
    nodeHover: 'hover:scale-110 transition-transform duration-200',
    completion: 'animate-bounce',
    pulse: 'animate-pulse'
  },
  particles: {
    enabled: false,
    color: '#6366f1',
    shape: 'circle'
  }
};

export const themes: Record<string, SkillTreeTheme> = {
  math: mathTheme,
  matematika: mathTheme,
  science: scienceTheme,
  ipa: scienceTheme,
  language: languageTheme,
  'bahasa indonesia': languageTheme,
  english: englishTheme,
  'bahasa inggris': englishTheme,
  social: socialStudiesTheme,
  ips: socialStudiesTheme,
  default: defaultTheme
};

/**
 * Get theme by subject name
 */
export function getThemeBySubject(subject: string): SkillTreeTheme {
  const normalizedSubject = subject.toLowerCase().trim();
  return themes[normalizedSubject] || defaultTheme;
}

/**
 * Get all available themes
 */
export function getAllThemes(): SkillTreeTheme[] {
  return [
    mathTheme,
    scienceTheme,
    languageTheme,
    englishTheme,
    socialStudiesTheme,
    defaultTheme
  ];
}

/**
 * Apply theme to CSS variables
 */
export function applyTheme(theme: SkillTreeTheme): void {
  const root = document.documentElement;
  
  root.style.setProperty('--theme-primary', theme.colors.primary);
  root.style.setProperty('--theme-secondary', theme.colors.secondary);
  root.style.setProperty('--theme-accent', theme.colors.accent);
  root.style.setProperty('--theme-background', theme.colors.background);
  root.style.setProperty('--theme-node-default', theme.colors.nodeDefault);
  root.style.setProperty('--theme-node-completed', theme.colors.nodeCompleted);
  root.style.setProperty('--theme-node-locked', theme.colors.nodeLocked);
  root.style.setProperty('--theme-node-active', theme.colors.nodeActive);
  root.style.setProperty('--theme-connection', theme.colors.connectionLine);
  root.style.setProperty('--theme-glow', theme.colors.glow);
}

/**
 * Generate CSS class for gradient background
 */
export function getBackgroundGradientClass(theme: SkillTreeTheme): string {
  const { from, via, to } = theme.gradients.background;
  if (via) {
    return `bg-gradient-to-br from-[${from}] via-[${via}] to-[${to}]`;
  }
  return `bg-gradient-to-br from-[${from}] to-[${to}]`;
}

/**
 * Generate CSS class for node gradient
 */
export function getNodeGradientClass(theme: SkillTreeTheme, completed: boolean = false): string {
  const gradient = completed ? theme.gradients.completed : theme.gradients.node;
  return `bg-gradient-to-br from-[${gradient.from}] to-[${gradient.to}]`;
}

/**
 * Get theme icon for node state
 */
export function getThemeIcon(theme: SkillTreeTheme, state: 'default' | 'completed' | 'locked'): string {
  return theme.icons[state];
}
